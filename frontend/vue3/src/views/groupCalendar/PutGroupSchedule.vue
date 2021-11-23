<template>
  <div class="schedule-info" v-if="state.isBig">
    <h1>Put Schedule</h1>
    <div class="userCalendar-schedule-row">
      <label class="label" for="scheduleTitle">제목</label>
      <input
        class="web-input"
        id="scheduleTitle"
        type="text"
        v-model="state.title"
      />
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <label class="label" for="date">날짜</label>
      <!-- <input class="date-input" type="date" id="date" v-model="state.startDay">~<input class="date-input" type="date" v-model="state.endDay"> -->
      <div class="scheduleDate">
        <div class="block">
          <el-date-picker
            class="datePicker"
            v-model="state.date"
            type="daterange"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <br />
    <transition name="slide-fade">
      <div v-if="!state.allDay">
        <div class="userCalendar-schedule-row">
          <label class="label" for="time">시간</label>
          <input
            class="time-input"
            type="time"
            id="time"
            v-model="state.startTime"
          />
          ~ <input class="time-input" type="time" v-model="state.endTime" />
        </div>
        <br />
      </div>
    </transition>
    <div class="userCalendar-schedule-allDay">
      <label for="allDay" class="label">종일</label>
      <input type="checkbox" v-model="state.allDay" />
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <label class="label" for="participant">참가자</label>
      <el-select
        v-model="state.participants"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="참가자를 선택해주세요"
        class="groupCalendar-schedule-participant"
      >
        <el-option
          v-for="member in state.participantsOption"
          :key="member.value"
          :label="member.label"
          :value="member.value"
        >
        </el-option>
      </el-select>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <label class="label" for="place">장소</label>
      <!-- <input
        class="web-input"
        type="text"
        id="place"
        v-model="state.placeName"
      /> -->
      <div v-if="!state.isGroupPutPlace" class="web-input web-input-placeName">
        <span>{{ state.placeName }}</span>
      </div>
      <GMapAutocomplete
        v-if="state.isGroupPutPlace"
        placeholder="장소를 입력해주세요"
        @place_changed="setGroupPutPlace"
        class="web-input"
        ref="PutGroupMapAutoComplete"
      >
      </GMapAutocomplete>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <div class="label"></div>
      <div
        style="display: flex; justify-content: space-between; align-items: center;"
      >
        <el-button
          v-if="!state.isGroupPutPlace"
          @click="state.isGroupPutPlace = true"
          type="primary"
          size="small"
        >
          장소 변경하기
        </el-button>
        <el-button
          v-if="state.isGroupPutPlace"
          @click="handleCanclePutGroupMap"
          type="primary"
          size="small"
        >
          장소 변경취소
        </el-button>

        <el-button
          v-if="state.isGroupPutPlace"
          @click="showPutGroupMapModal"
          type="info"
          size="small"
        >
          경로탐색
        </el-button>

        <div v-if="state.isChoiceWay" style="margin-left: 1rem;">
          <el-button round size="mini">{{
            state.choiceWay.duration
          }}</el-button>
          <el-button round size="mini">{{
            state.choiceWay.distance
          }}</el-button>
        </div>
      </div>
    </div>
    <br />
    <div class="userCalendar-schedule-category">
      <label class="label" for="category">분류</label>
      <div class="userCalendar-schedule-category-button-wrap">
        <el-radio v-model="state.category" label="공부" border size="mini"
          >공부</el-radio
        >
        <el-radio v-model="state.category" label="운동" border size="mini"
          >운동</el-radio
        >
        <el-radio v-model="state.category" label="업무" border size="mini"
          >업무</el-radio
        >
        <el-radio v-model="state.category" label="취미" border size="mini"
          >취미</el-radio
        >
        <el-radio v-model="state.category" label="일상" border size="mini"
          >일상</el-radio
        >
      </div>
    </div>
    <br />
    <div class="userCalendar-schedule-color-wrap">
      <label class="label" for="radio">중요도</label>
      <div class="userCalendar-schedule-color-box">
        <label class="import-label" v-bind:class="{ red: true }"
          ><input type="radio" value="#FF7C7C" v-model="state.color"
        /></label>
        <label class="import-label" v-bind:class="{ orange: true }"
          ><input type="radio" value="#FECFA3" v-model="state.color"
        /></label>
        <label class="import-label" v-bind:class="{ yellow: true }"
          ><input type="radio" value="#FFF972" v-model="state.color"
        /></label>
        <label class="import-label" v-bind:class="{ green: true }"
          ><input type="radio" value="#B6FB81" v-model="state.color"
        /></label>
        <label class="import-label" v-bind:class="{ blue: true }"
          ><input type="radio" value="#7886FF" v-model="state.color"
        /></label>
      </div>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <label class="label">내용</label>
      <textarea
        class="web-memo"
        v-bind:class="{ 'memo-content': true, input: true }"
        type="text"
        v-model="state.content"
        style="padding:10px;"
      />
    </div>
    <br />
    <div>
      <button class="web-button-red" @click="handleCancle">취소</button>
      <button
        class="web-button-blue"
        style="margin-left:30px"
        type="button"
        @click="putSchedule"
      >
        수정
      </button>
    </div>
  </div>

  <div class="mobile-schedule-main" v-else>
    <h1>Put Schedule</h1>
    <div>
      <label class="label" for="scheduleTitle">제목</label>
      <input
        class="input"
        id="scheduleTitle"
        type="text"
        v-model="state.title"
      />
    </div>
    <br />
    <div>
      <label class="label" for="date">날짜</label>
      <div class="scheduleDate">
        <div class="block">
          <el-date-picker
            class="datePicker"
            v-model="state.date"
            type="daterange"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <br />
    <div>
      <!--v-if -->
      <label class="label" for="time">시간</label>
      <input class="input" type="time" id="time" v-model="state.startTime" /> ~
      <input class="input" type="time" v-model="state.endTime" />
    </div>
    <br />
    <div>
      <label for="allDay" class="label">종일</label>
      <input type="checkbox" v-model="state.allDay" />
    </div>
    <br />
    <div>
      <label class="label" for="participant">참가자</label>
      <el-select
        v-model="state.participants"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="참가자를 선택해주세요"
      >
        <el-option
          v-for="member in state.participantsOption"
          :key="member.value"
          :label="member.label"
          :value="member.value"
        >
        </el-option>
      </el-select>
    </div>
    <br />
    <div>
      <label class="label" for="place">장소</label>
      <!-- <input class="input" type="text" id="place" v-model="state.placeName" />-->
      <div v-if="!state.isGroupPutPlace">
        <span>{{ state.placeName }}</span>
      </div>
      <GMapAutocomplete
        v-if="state.isGroupPutPlace"
        placeholder="장소를 입력해주세요"
        @place_changed="setGroupPutPlace"
        ref="PutGroupMapAutoComplete"
      >
      </GMapAutocomplete>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <div class="label"></div>
      <div
        style="display: flex; justify-content: space-between; align-items: center;"
      >
        <el-button
          v-if="!state.isGroupPutPlace"
          @click="state.isGroupPutPlace = true"
          type="primary"
          size="small"
        >
          장소 변경하기
        </el-button>
        <el-button
          v-if="state.isGroupPutPlace"
          @click="handleCanclePutGroupMap"
          type="primary"
          size="small"
        >
          장소 변경취소
        </el-button>

        <el-button
          v-if="state.isGroupPutPlace"
          @click="showPutGroupMapModal"
          type="info"
          size="small"
        >
          경로탐색
        </el-button>

        <div v-if="state.isChoiceWay" style="margin-left: 1rem;">
          <el-button round size="mini">{{
            state.choiceWay.duration
          }}</el-button>
          <el-button round size="mini">{{
            state.choiceWay.distance
          }}</el-button>
        </div>
      </div>
    </div>
    <br />
    <div>
      <label class="label" for="category">분류</label>
      <!-- <span class="label">분류</span> -->
      <div>
        <el-radio v-model="state.category" label="공부" border size="mini"
          >공부</el-radio
        >
        <el-radio v-model="state.category" label="운동" border size="mini"
          >운동</el-radio
        >
        <el-radio v-model="state.category" label="업무" border size="mini"
          >업무</el-radio
        >
        <el-radio v-model="state.category" label="취미" border size="mini"
          >취미</el-radio
        >
        <el-radio v-model="state.category" label="일상" border size="mini"
          >일상</el-radio
        >
      </div>
    </div>
    <br />
    <div>
      <label class="label" for="radio">중요도</label>
      <label class="import-label" v-bind:class="{ red: true }"
        ><input type="radio" value="#FF7C7C" v-model="state.color"
      /></label>
      <label class="import-label" v-bind:class="{ orange: true }"
        ><input type="radio" value="#FECFA3" v-model="state.color"
      /></label>
      <label class="import-label" v-bind:class="{ yellow: true }"
        ><input type="radio" value="#FFF972" v-model="state.color"
      /></label>
      <label class="import-label" v-bind:class="{ green: true }"
        ><input type="radio" value="#B6FB81" v-model="state.color"
      /></label>
      <label class="import-label" v-bind:class="{ blue: true }"
        ><input type="radio" value="#7886FF" v-model="state.color"
      /></label>
    </div>
    <br />
    <div>
      <label>내용</label>
      <textarea
        class="memo"
        v-bind:class="{ 'memo-content': true, input: true }"
        type="text"
        v-model="state.content"
        style="padding:10px;"
      />
    </div>
    <br />
    <div>
      <button class="redBtn" @click="handleCancle">취소</button>
      <button class="blueBtn" type="button" @click="putSchedule">
        수정
      </button>
    </div>
  </div>

  <teleport to="#destination">
    <PutGroupCalendarMapModal ref="putGroupMapModal" />
  </teleport>
</template>

<script>
import axios from 'axios'
import { computed, reactive, onBeforeMount, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// component
import PutGroupCalendarMapModal from '@/components/teleport/PutGroupCalendarMapModal'

export default {
  name: 'PutGroupSchedule',
  components: {
    PutGroupCalendarMapModal,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const initData = computed(() => store.getters.getGroupModalDataFormat)
    const putGroupMapModal = ref(null)

    onBeforeMount(() => {
      findGroupMember()
      pushParticipants()
      handleGroupCalendarPutWindowSize()
      window.addEventListener('resize', handleGroupCalendarPutWindowSize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupCalendarPutWindowSize)
    })

    const handleGroupCalendarPutWindowSize = () => {
      if (window.innerWidth > 730) {
        state.isBig = true
      } else {
        state.isBig = false
      }
    }

    const handleCancle = function() {
      router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
    }

    const pushParticipants = () => {
      initData.value.ModalDate.extendedProps.participant.forEach((par) => {
        state.participants.push(par.uid)
      })
    }

    const findGroupMember = () => {
      axios
        .post(
          'https://k5d105.p.ssafy.io:3030/group/GetGroupMember',
          {
            gid: route.query.gid,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((response) => {
          const res = response.data.members
          state.groupMember = res
          state.participantsOption = res.map((m) => {
            return {
              value: m.uid,
              label: m.nickname,
            }
          })
        })
    }

    const putSchedule = function() {
      const parList = state.participants.map((par) => {
        let parInfo = state.groupMember.find((p) => {
          return par === p.uid
        })
        if (parInfo) {
          // 원래 있는사람
          let existPar = initData.value.ModalDate.extendedProps.participant.find(
            (ep) => {
              return parInfo.uid === ep.uid
            }
          )
          if (existPar) {
            return {
              uid: parInfo.uid,
              name: parInfo.name,
              completed: existPar.completed,
              nickname: parInfo.nickname,
            }
          }
          // 없는 사람
          return {
            uid: parInfo.uid,
            name: parInfo.name,
            completed: false,
            nickname: parInfo.nickname,
          }
        }
      })

      let startDay = state.date[0]
      let endDay = state.date[1]

      axios
        .put(
          'https://k5d105.p.ssafy.io:3030/groupCalendar/updateCalendar',
          {
            cid: state.cid,
            uid: localStorage.getItem('uid'),
            gid: route.query.gid,
            title: state.title,
            category: state.category,
            content: state.content,
            startDate: startDay,
            endDate: endDay,
            startTime: state.startTime,
            endTime: state.endTime,
            placeName: state.placeName,
            placeLat: state.placeLat,
            placeLng: state.placeLng,
            allDay: state.allDay,
            color: state.color,
            completed: initData.value.ModalDate.extendedProps.completed,
            participant: parList,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((response) => {
          store.dispatch(
            'deleteGroupCalendarData',
            initData.value.ModalDate.extendedProps.cid
          )

          const res = response.data.calendar

          let checkCompleted = false
          for (let par of res.participant) {
            if (par.uid === localStorage.getItem('uid')) {
              if (par.completed) {
                checkCompleted = true
              }
              break
            }
          }

          if (checkCompleted) {
            store.dispatch('pushGroupCalendarData', {
              cid: res.cid,
              title: res.title,
              content: res.content,
              start: `${res.startDate}T${res.startTime}`,
              end: `${res.endDate}T${res.endTime}`,
              color: res.color,
              placeName: res.placeName,
              placeLat: res.placeLat,
              placeLng: res.placeLng,
              startDate: res.startDate,
              endDate: res.endDate,
              category: res.category,
              classNames: ['calendar-done'],
              allDay: res.allDay,
              participant: res.participant,
              creator: res.creator,
            })
          } else {
            store.dispatch('pushGroupCalendarData', {
              cid: res.cid,
              title: res.title,
              content: res.content,
              start: `${res.startDate}T${res.startTime}`,
              end: `${res.endDate}T${res.endTime}`,
              color: res.color,
              placeName: res.placeName,
              placeLat: res.placeLat,
              placeLng: res.placeLng,
              startDate: res.startDate,
              endDate: res.endDate,
              category: res.category,
              allDay: res.allDay,
              participant: res.participant,
              creator: res.creator,
            })
          }
          router.push({
            name: 'GroupCalendar',
            query: { gid: route.query.gid },
          })
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert('로그인이 만료되었습니다')
            location.replace('/')
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
          }
        })
    }

    const checkEndTime = () => {
      if (
        initData.value.ModalDate.allDay &&
        (initData.value.ModalDate.end === null ||
          initData.value.ModalDate.end === undefined)
      ) {
        return '23:59'
      }
      return initData.value.ModalDate.end
        .toString()
        .split(' ')[4]
        .substring(0, 5)
    }

    const setGroupPutPlace = (e) => {
      state.placeName = e.name
      state.placeLat = e.geometry.location.lat()
      state.placeLng = e.geometry.location.lng()

      store.dispatch('diableGroupPutMapChoice')
      store.dispatch('setGroupPutMapGoal', {
        Lat: state.placeLat,
        Lng: state.placeLng,
      })
    }

    const handleCanclePutGroupMap = () => {
      state.placeName = initData.value.ModalDate.extendedProps.placeName
      state.placeLat = initData.value.ModalDate.extendedProps.placeLat
      state.placeLng = initData.value.ModalDate.extendedProps.placeLng

      store.dispatch('diableGroupPutMapChoice')
      state.isPutPlace = false
    }

    const showPutGroupMapModal = () => {
      putGroupMapModal.value.show()
    }

    const state = reactive({
      title: initData.value.ModalDate.title,
      start: initData.value.ModalDate.start,
      end: initData.value.ModalDate.end,
      color: initData.value.ModalDate.backgroundColor,
      cid: initData.value.ModalDate.extendedProps.cid,
      content: initData.value.ModalDate.extendedProps.content,
      placeName: initData.value.ModalDate.extendedProps.placeName,
      placeLat: initData.value.ModalDate.extendedProps.placeLat,
      placeLng: initData.value.ModalDate.extendedProps.placeLng,
      date: [
        initData.value.ModalDate.extendedProps.startDate,
        initData.value.ModalDate.extendedProps.endDate,
      ],

      startTime: initData.value.ModalDate.start
        .toString()
        .split(' ')[4]
        .substring(0, 5),

      endTime: checkEndTime(),

      allDay: initData.value.ModalDate.allDay,
      category: initData.value.ModalDate.extendedProps.category,
      isBig: false,
      participantsOption: [],
      groupMember: [],
      participants: [],

      // map
      isGroupPutPlace: false,
      isChoiceWay: computed(() => store.state.isGroupPutChoiceWay),
      choiceWay: computed(() => store.state.GroupPutChoiceWay),
    })

    return {
      state,
      putSchedule,
      handleCancle,
      initData,
      putGroupMapModal,
      setGroupPutPlace,
      handleCanclePutGroupMap,
      showPutGroupMapModal,
    }
  },
}
</script>

<style></style>
