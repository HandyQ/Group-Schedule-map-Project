<template>
  <div class="calendar-main">
    <div class="calendar-headerwrap">
      <CalendarButton ref="calButton">
        {{ state.currentMonth }}
      </CalendarButton>
    </div>
    <div class="calendar-calwrap">
      <FullCalendar
        class="calendar-calendar"
        ref="fullCalendar"
        :options="calendarOptions"
      />
    </div>
    <div class="calendar-todowrap">
      <TodoList class="calendar-todolist" />
    </div>
  </div>
  <teleport to="#destination">
    <CalendarModal ref="modal"> </CalendarModal>
  </teleport>
</template>

<script>
// vue
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Calendar
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

// views
import TodoList from '@/views/calendar/TodoList'

//components
import CalendarModal from '@/components/teleport/CalendarModal'
import CalendarButton from '@/components/calendar/CalendarButton'

//utils
import dayjs from 'dayjs'

export default {
  name: 'UserCalendar',
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    TodoList,
    CalendarButton,
    CalendarModal,
  },

  setup() {
    const store = useStore()
    const cData = computed(() => store.state.calendarData)
    const router = useRouter()

    const fullCalendar = ref(null)
    const modal = ref(null)

    onMounted(() => {
      handleViewTitle()
      store.dispatch('setCalendarApi', fullCalendar.value)
      initData()
    })

    function showModal() {
      // VMmodal.vue에 접근하여 show 함수 실행
      // console.log(modal.value)
      modal.value.show()
    }

    const handleClickDate = function(clickInfo) {
      // console.log(clickInfo)
      if (confirm('일정을 추가하시겠습니까?')) {
        store.dispatch('initMapChoice')
        router.push({ name: 'Schedule', query: { start: clickInfo.dateStr } })
      }
    }

    const handleEventClick = (clickInfo) => {
      // vuex 상태전환
      // console.log(clickInfo)
      store.dispatch('setModal', clickInfo.event)
      // modal open
      showModal()
    }

    const initData = function() {
      let calendarApi = fullCalendar.value.getApi()
      const data = calendarApi.getEvents()

      // 중복을 방지하기 위해서!
      if (data.length) {
        data.map((d) => d.remove())
      }

      const addE = cData.value.map((c) => {
        if (c.completed) {
          return {
            cid: c.cid,
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
            category: c.category,
            classNames: ['calendar-done'],
            allDay: c.allDay,
          }
        } else {
          return {
            cid: c.cid,
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
            category: c.category,
            allDay: c.allDay,
          }
        }
      })

      // state 와 동기화 해주기
      calendarApi.batchRendering(function() {
        addE.forEach((e) => {
          calendarApi.addEvent(e)
        })
      })
      store.dispatch('refreshCalendarData', calendarApi.getEvents())
    }

    const handleViewTitle = () => {
      let calendarApi = fullCalendar.value.getApi()

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
      eventColor: 'orange', // color default?
      timeZone: 'local', // local default
      display: 'list-item',
      height: 'auto', // height,
    }

    const state = reactive({
      calendarView: '월',
      currentMonth: '',
    })

    return {
      modal,
      state,
      showModal,
      cData,
      fullCalendar,
      calendarOptions,
      handleViewTitle,
    }
  },
}
</script>

<style>
.calendar-done {
  color: #ececec !important;
  text-decoration: line-through !important;
}

.calendar-done .fc-event-title {
  color: #ececec !important;
  text-decoration: line-through !important;
}

.calendar-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* calendar 크기는 width 를 통해서 조절한다. %, px 둘 다 된다.*/
.calendar-calwrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.calendar-todowrap {
  margin: 30px 0 10% 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

@media screen and (min-width: 1200px) {
  .calendar-calendar {
    width: 1000px;
  }

  .calendar-todolist {
    width: 1000px;
  }
}

@media screen and (max-width: 1199px) and (min-width: 993px) {
  .calendar-calendar {
    width: 793px;
  }

  .calendar-todolist {
    width: 793px;
  }
}

@media screen and (max-width: 992px) and (min-width: 768px) {
  .calendar-calendar {
    width: 569px;
  }

  .calendar-todolist {
    width: 569px;
  }
}

@media screen and (max-width: 767px) and (min-width: 500px) {
  .calendar-calendar {
    width: 400px;
  }

  .calendar-todolist {
    width: 400px;
  }
}

@media screen and (max-width: 499px) {
  .calendar-calendar {
    width: 300px;
  }

  .calendar-todolist {
    width: 300px;
  }
}
</style>
