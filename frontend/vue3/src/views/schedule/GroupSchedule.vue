<template>
  <div class="schedule-info" v-if="state.size">
    <h1>New Schedule</h1>
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
      <!-- <input
        class="date-input"
        type="date"
        id="date"
        v-model="state.startDate"
      />~<input class="date-input" type="date" v-model="state.endDate" /> -->
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
      <!-- <input class="web-input" type="text" id="place" v-model="state.placeName"> -->
      <GMapAutocomplete
        placeholder="장소를 입력해주세요"
        @place_changed="setPlace"
        class="web-input"
        ref="mapAutoComplete"
      >
      </GMapAutocomplete>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <div class="label"></div>
      <div>
        <el-button
          v-if="state.placeName"
          round
          @click="showGroupMapModal"
          type="info"
          >경로탐색</el-button
        >
        <el-button v-else disabled round @click="showGroupMapModal" type="info"
          >경로탐색</el-button
        >
      </div>
      <div v-if="state.isGroupChoiceWay" style="margin-left: 1rem;">
        <!-- <span class="userCalendar-choice-">
            {{ `시간 : ${state.choiceWay.duration}  거리 : ${state.choiceWay.distance}` }}
          </span> -->
        <el-button round size="small">{{
          state.groupChoiceWay.duration
        }}</el-button>
        <el-button round size="small">{{
          state.groupChoiceWay.distance
        }}</el-button>
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
      <button class="web-button-red" @click="handleCancleSchedule">취소</button>
      <button
        class="web-button-blue"
        style="margin-left:30px"
        type="button"
        @click="addGroupSchedule"
      >
        추가
      </button>
    </div>
  </div>

  <div class="mobile-schedule-main" v-else>
    <h1>New Schedule</h1>
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
    <transition name="slide-fade">
      <div v-if="!state.allDay">
        <div>
          <label class="label" for="time">시간</label>
          <input
            class="input"
            type="time"
            id="time"
            v-model="state.startTime"
          />
          ~
          <input class="input" type="time" v-model="state.endTime" />
        </div>
        <br />
      </div>
    </transition>

    <div>
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
      <GMapAutocomplete
        placeholder="장소를 입력해주세요"
        @place_changed="setPlace"
        ref="mapAutoComplete"
      >
      </GMapAutocomplete>
    </div>
    <br />
    <div class="userCalendar-schedule-row">
      <div class="label"></div>
      <div>
        <el-button
          v-if="state.placeName"
          round
          @click="showGroupMapModal"
          type="info"
          >경로탐색</el-button
        >
        <el-button v-else disabled round @click="showGroupMapModal" type="info"
          >경로탐색</el-button
        >
      </div>
      <div v-if="state.isGroupChoiceWay" style="margin-left: 1rem;">
        <!-- <span class="userCalendar-choice-">
            {{ `시간 : ${state.choiceWay.duration}  거리 : ${state.choiceWay.distance}` }}
          </span> -->
        <el-button round size="small">{{
          state.groupChoiceWay.duration
        }}</el-button>
        <el-button round size="small">{{
          state.groupChoiceWay.distance
        }}</el-button>
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
      <button class="redBtn" @click="handleCancleSchedule">취소</button>
      <button class="blueBtn" type="button" @click="addGroupSchedule">
        추가
      </button>
    </div>
  </div>
  <teleport to="#destination">
    <GroupCalendarMapModal ref="groupMapModal" />
  </teleport>
</template>

<script>
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import {
  reactive,
  onBeforeMount,
  onUnmounted,
  ref,
  computed,
  onMounted,
} from 'vue'
import { useStore } from 'vuex'

// components
import GroupCalendarMapModal from '@/components/teleport/GroupCalendarMapModal'

export default {
  name: 'Schedule',
  components: {
    GroupCalendarMapModal,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const groupMapModal = ref(null)

    const state = reactive({
      uid: localStorage.getItem('uid'),
      title: '',
      content: '',
      date: [route.query.start, route.query.start],
      startTime: '',
      endTime: '',
      placeName: '',
      placeLat: 38.5,
      placeLng: 0.00022,
      allDay: false,
      color: '#FF7C7C',
      category: '공부',
      size: true,
      participantsOption: [],
      groupMember: [],
      participants: [],
      isGroupChoiceWay: computed(() => store.state.isGroupChoiceWay),
      groupChoiceWay: computed(() => store.state.groupChoiceWay),
      writer: false,
    })

    onBeforeMount(() => {
      findGroupMember()
      handleGroupCalendarCreateSchedule()
      window.addEventListener('resize', handleGroupCalendarCreateSchedule)
    })

    onMounted(() => {
      checkWriter()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupCalendarCreateSchedule)
    })

    const showGroupMapModal = function() {
      groupMapModal.value.show()
    }

    const handleGroupCalendarCreateSchedule = () => {
      if (window.innerWidth < 730) {
        state.size = false
      } else {
        state.size = true
      }
    }

    const handleCancleSchedule = () => {
      router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
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
          const userUid = localStorage.getItem('uid')
          state.groupMember = res
          state.participantsOption = res.map((m) => {
            return {
              value: m.uid,
              label: m.nickname,
            }
          })
          const user = res.filter((r) => {
            return r.uid === userUid
          })
          state.participants.push(user[0].uid)
        })
    }

    const addGroupSchedule = function() {
      if (!state.writer) {
        alert('글을 수정할 수 있는 권한이 없습니다.')
        router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
      } else {
        const parList = state.participants.map((par) => {
          let parInfo = state.groupMember.find((p) => {
            return par === p.uid
          })
          if (parInfo) {
            return {
              uid: parInfo.uid,
              name: parInfo.name,
              completed: false,
              nickname: parInfo.nickname,
            }
          }
        })
        if (
          state.date[0] === state.date[1] &&
          state.startTime > state.endTime
        ) {
          alert('종료 시간은 시작 시간보다 빠를 수 없습니다')
        } else {
          if (state.allDay) {
            const aDay = {
              uid: state.uid,
              gid: route.query.gid,
              title: state.title,
              content: state.content,
              startDate: state.date[0],
              endDate: state.date[1],
              startTime: '00:00',
              endTime: '24:00',
              placeName: state.placeName,
              placeLat: state.placeLat,
              placeLng: state.placeLng,
              allDay: state.allDay,
              color: state.color,
              category: state.category,
              participant: parList,
            }
            axios
              .post(
                `https://k5d105.p.ssafy.io:3030/groupCalendar/createCalendar`,
                aDay,
                {
                  headers: {
                    authorization: localStorage.getItem('token'),
                  },
                }
              )
              .then((response) => {
                const res = response.data.calendar
                const d = {
                  cid: res.cid,
                  gid: route.query.gid,
                  title: res.title,
                  content: res.content,
                  start: res.startDate + 'T' + res.startTime,
                  end: res.endDate + 'T' + res.endTime,
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
                }

                store.dispatch('pushGroupCalendarData', d)
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
          } else {
            const day = {
              uid: state.uid,
              gid: route.query.gid,
              title: state.title,
              content: state.content,
              startDate: state.date[0],
              endDate: state.date[1],
              startTime: state.startTime,
              endTime: state.endTime,
              placeName: state.placeName,
              placeLat: state.placeLat,
              placeLng: state.placeLng,
              allDay: state.allDay,
              color: state.color,
              category: state.category,
              participant: parList,
            }
            axios
              .post(
                `https://k5d105.p.ssafy.io:3030/groupCalendar/createCalendar`,
                day,
                {
                  headers: {
                    authorization: localStorage.getItem('token'),
                  },
                }
              )
              .then((response) => {
                const res = response.data.calendar
                const day = {
                  cid: res.cid,
                  completed: res.completed,
                  title: res.title,
                  content: res.content,
                  start: res.startDate + 'T' + res.startTime,
                  end: res.endDate + 'T' + res.endTime,
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
                }

                store.dispatch('pushGroupCalendarData', day)
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
        }
      }
    }

    const setPlace = (e) => {
      state.placeName = e.name
      state.placeLat = e.geometry.location.lat()
      state.placeLng = e.geometry.location.lng()

      store.dispatch('disableGroupMapModalChoice')
      store.dispatch('setGroupCalendarMapGoal', {
        Lat: state.placeLat,
        Lng: state.placeLng,
      })
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

    return {
      state,
      addGroupSchedule,
      handleCancleSchedule,
      showGroupMapModal,
      groupMapModal,
      setPlace,
    }
  },
}
</script>

<style>
.groupCalendar-schedule-participant {
  width: 400px;
}
</style>
