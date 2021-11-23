<template>
  <div class="calendar-main">
    <div class="calendar-headerwrap">
      <GroupCalendarButton ref="calButton">
        {{ state.currentMonth }}
      </GroupCalendarButton>
    </div>
    <div class="calendar-calwrap">
      <FullCalendar
        class="calendar-calendar"
        ref="groupfullCalendar"
        :options="calendarOptions"
      />
    </div>
    <div class="calendar-todowrap">
      <GroupTodoList class="calendar-todolist" />
    </div>
  </div>
  <teleport to="#destination">
    <GroupCalendarModal ref="groupModal" />
  </teleport>
</template>

<script>
// Calendar
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

//vue
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, reactive, ref, watch } from 'vue'

// component
import GroupCalendarModal from '@/components/teleport/GroupCalendarModal'
import GroupCalendarButton from '@/components/calendar/GroupCalendarButton'
import GroupTodoList from '@/views/groupCalendar/GroupTodoList'

//utils
import dayjs from 'dayjs'
import axios from 'axios'

export default {
  name: 'GCalendar',
  components: {
    FullCalendar,
    GroupCalendarModal,
    GroupCalendarButton,
    GroupTodoList,
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const gCData = computed(() => store.state.groupCalendarData)
    const groupfullCalendar = ref(null)
    const groupModal = ref(null)

    watch(
      () => route.query,
      () => {
        changeQuery()
      }
    )

    onMounted(() => {
      handleViewTitle()
      store.dispatch('setGroupCalendarApi', groupfullCalendar.value)
      initData()
      checkWriter()
    })

    const showGroupModal = function() {
      groupModal.value.show()
    }

    const changeQuery = () => {
      axios
        .get(`https://k5d105.p.ssafy.io:3030/groupCalendar/getCalendar`, {
          // uid: localStorage.getItem('uid'),
          params: {
            gid: route.query.gid,
          },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.msg === '그룹 캘린더가 없습니다.') {
            store.dispatch('getChangeGroupCalendarData', [])
            initData()
          } else {
            const res = response.data.calendar.map((r) => {
              // participants completed check
              let checkCompleted = false

              for (let par of r.participant) {
                if (par.uid === localStorage.getItem('uid')) {
                  if (par.completed) {
                    checkCompleted = true
                  }
                  break
                }
              }

              if (checkCompleted) {
                // completed 된 것
                return {
                  cid: r.cid,
                  gid: route.query.gid,
                  completed: true,
                  title: r.title,
                  content: r.content,
                  start: r.startDate + 'T' + r.startTime,
                  end: r.endDate + 'T' + r.endTime,
                  color: r.color,
                  placeName: r.placeName,
                  placeLat: r.placeLat,
                  placeLng: r.placeLng,
                  startDate: r.startDate,
                  endDate: r.endDate,
                  classNames: ['calendar-done'],
                  participant: r.participant,
                  creator: r.creator,
                  category: r.category,
                }
              }
              return {
                cid: r.cid,
                gid: route.query.gid,
                completed: false,
                title: r.title,
                content: r.content,
                start: r.startDate + 'T' + r.startTime,
                end: r.endDate + 'T' + r.endTime,
                color: r.color,
                placeName: r.placeName,
                placeLat: r.placeLat,
                placeLng: r.placeLng,
                startDate: r.startDate,
                endDate: r.endDate,
                participant: r.participant,
                creator: r.creator,
                category: r.category,
              }
            })
            store.dispatch('getChangeGroupCalendarData', res)
            initData()
          }
        })
        .catch((error) => {
          if (error.response) {
            if (
              error.response.status == 401 &&
              error.response.data.error === '그룹 캘린더가 없습니다.'
            ) {
              store.dispatch('getChangeGroupCalendarData', [])
              initData()
            }
          }
        })
    }

    const handleClickDate = function(clickInfo) {
      if (!state.writer) {
        alert('일정을 추가할 수 있는 권한이 없습니다.')
      } else {
        if (confirm('일정을 추가하시겠습니까?')) {
          store.dispatch('initGroupMapChoice')
          router.push({
            name: 'GroupCalendarCreateSchedule',
            query: {
              gid: route.query.gid,
              start: clickInfo.dateStr,
            },
          })
        }
      }
    }

    const handleEventClick = (clickInfo) => {
      // vuex 상태전환
      store.dispatch('setGroupModal', clickInfo.event)
      showGroupModal()
    }

    const initData = function() {
      let calendarApi = groupfullCalendar.value.getApi()
      const data = calendarApi.getEvents()

      // 중복을 방지하기 위해서!
      if (data.length) {
        data.forEach((element) => {
          element.remove()
        })
      }

      // state 와 동기화 해주기
      calendarApi.batchRendering(function() {
        gCData.value.map((c) => {
          if (c.completed) {
            calendarApi.addEvent({
              cid: c.cid,
              gid: c.gid,
              completed: c.completed,
              title: c.title,
              content: c.content,
              start: c.start,
              end: c.end,
              color: c.color,
              placeName: c.placeName,
              placeLat: c.placeLat,
              placeLng: c.placeLng,
              startDate: c.startDate,
              endDate: c.endDate,
              classNames: ['calendar-done'],
              participant: c.participant,
              creator: c.creator,
              category: c.category,
              allDay: c.allDay,
            })
          } else {
            calendarApi.addEvent(c)
          }
        })
      })
      store.dispatch('refreshGroupCalendarData', calendarApi.getEvents())
    }

    const handleViewTitle = () => {
      let calendarApi = groupfullCalendar.value.getApi()

      const title = calendarApi
        .getDate()
        .toString()
        .split(' ')
      if (state.calendarView === '월') {
        state.currentMonth = `${title[3]}년 ${changeMonthFormat(title[1])}월`
      }
      // else if (state.calendarView === '주') {
      else {
        let today = dayjs(calendarApi.getDate().toString())
        let start = today
          .day(1)
          .toString()
          .split(' ')
        let end = today
          .endOf('week')
          .toString()
          .split(' ')

        // 다를 경우 -1 1년 -2 1개월만
        if (start[3] === end[3]) {
          // 같은 년도
          if (start[2] === end[2]) {
            // 같은 달
            state.currentMonth = `${changeMonthFormat(start[2])}월 ${
              start[1]
            } - ${end[1]}일 ${start[3]}년`
          } else {
            // 다른 달
            state.currentMonth = `${changeMonthFormat(start[2])}월 ${
              start[1]
            }일 - ${changeMonthFormat(end[2])}월 ${end[1]}일, ${start[3]}년`
          }
        } else {
          // 다른 년도
          state.currentMonth = `${start[3]}년 ${changeMonthFormat(
            start[2]
          )}월 ${start[1]}일 -  ${end[3]}년 ${changeMonthFormat(end[2])}월 ${
            end[1]
          }일`
        }
      }
    }

    const changeMonthFormat = (month) => {
      switch (month) {
        case 'Jan':
          return '1'
        case 'Feb':
          return '2'
        case 'Mar':
          return '3'
        case 'Apr':
          return '4'
        case 'May':
          return '5'
        case 'Jun':
          return '6'
        case 'Jul':
          return '7'
        case 'Aug':
          return '8'
        case 'Sep':
          return '9'
        case 'Oct':
          return '10'
        case 'Nov':
          return '11'
        case 'Dec':
          return '12'
      }
    }

    const checkWriter = () => {
      axios
        .post(
          'https://k5d105.p.ssafy.io:3030/groupCalendar/checkWriter',
          {
            uid: localStorage.getItem('uid'),
            gid: route.query.gid,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((response) => {
          state.writer = response.data.writer
        })
    }

    const calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      headerToolbar: {
        left: '',
        center: '',
        right: '',
      },
      initialView: 'dayGridMonth',
      dateClick: handleClickDate,
      eventClick: handleEventClick,
      events: [],
      eventColor: 'red', // color default?
      timeZone: 'local', // local default
      display: 'list-item',
      height: 'auto', // height
    }

    const state = reactive({
      calendarView: '월',
      currentMonth: '',
      writer: false,
    })

    return {
      state,
      calendarOptions,
      gCData,
      groupfullCalendar,
      groupModal,
      showGroupModal,
      handleViewTitle,
    }
  },
}
</script>

<style></style>
