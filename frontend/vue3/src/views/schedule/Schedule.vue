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
    <div class="userCalendar-schedule-allDay">
      <label for="allDay" class="label">종일</label>
      <input type="checkbox" v-model="state.allDay" />
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
          @click="showMapModal"
          type="info"
          >경로탐색</el-button
        >
        <el-button v-else disabled round @click="showMapModal" type="info"
          >경로탐색</el-button
        >
      </div>
      <div v-if="state.isChoiceWay" style="margin-left: 1rem;">
        <!-- <span class="userCalendar-choice-">
            {{ `시간 : ${state.choiceWay.duration}  거리 : ${state.choiceWay.distance}` }}
          </span> -->
        <el-button round size="small">{{ state.choiceWay.duration }}</el-button>
        <el-button round size="small">{{ state.choiceWay.distance }}</el-button>
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
        @click="addSchedule"
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
      <div>
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
      <label class="label" for="place">장소</label>
      <!-- <input class="input" type="text" id="place" v-model="state.placeName"> -->
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
          @click="showMapModal"
          type="info"
          size="mini"
        >
          경로탐색</el-button
        >
        <el-button
          v-else
          disabled
          round
          @click="showMapModal"
          type="info"
          size="mini"
        >
          경로탐색
        </el-button>
      </div>
      <div v-if="state.isChoiceWay" style="margin-left: 1rem;">
        <!-- <span class="userCalendar-choice-">
            {{ `시간 : ${state.choiceWay.duration}  거리 : ${state.choiceWay.distance}` }}
          </span> -->
        <el-button round size="small">{{ state.choiceWay.duration }}</el-button>
        <el-button round size="small">{{ state.choiceWay.distance }}</el-button>
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
      <button class="blueBtn" type="button" @click="addSchedule">
        추가
      </button>
    </div>
  </div>

  <teleport to="#destination">
    <CalendarMapModal ref="mapModal" />
  </teleport>
</template>

<script>
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { reactive, onBeforeMount, ref, computed } from 'vue'
import { useStore } from 'vuex'

// component
import CalendarMapModal from '@/components/teleport/CalendarMapModal'

export default {
  name: 'Schedule',
  components: {
    // LMap,
    // LGeoJson,
    CalendarMapModal,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const mapAutoComplete = ref(null)
    const mapModal = ref(null)

    const state = reactive({
      uid: localStorage.getItem('uid'),
      title: '',
      content: '',
      date: [route.query.start, route.query.start],
      startTime: '',
      endTime: '',
      placeName: '',
      placeLat: '',
      placeLng: '',
      allDay: false,
      color: '#FF7C7C',
      category: '공부',
      size: true,
      latitude: 1.1,
      longitude: 1.1,
      falTest: false,
      isChoiceWay: computed(() => store.state.isChoiceWay),
      choiceWay: computed(() => store.state.choiceWay),
    })

    onBeforeMount(async () => {
      if (window.innerWidth < 730) {
        state.size = false
      }
      startMap()
    })

    window.addEventListener(
      'resize',
      function() {
        if (window.innerWidth < 730) {
          state.size = false
        } else {
          state.size = true
        }
      },
      true
    )

    const showMapModal = function() {
      mapModal.value.show()
    }

    const setPlace = (e) => {
      state.placeName = e.name
      state.placeLat = e.geometry.location.lat()
      state.placeLng = e.geometry.location.lng()

      // findWay()

      // mapModal.value.findWayCar()
      // mapModal.value.choiceWay(mapModal.value.state.curWay[0], 'car')
      store.dispatch('disableMapModalChocie')
      store.dispatch('setCalendarMapGoal', {
        Lat: state.placeLat,
        Lng: state.placeLng,
      })

      // provide('plcaeLat', state.placeLat)
      // provide('placeLng', state.placeLng)
    }

    // const findWay = () => {
    //   // car driving
    //   axios.get(`http://k5d105.p.ssafy.io:5000/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?steps=true`)
    //     .then((response) => {
    //       console.log(response.data.routes)
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // }

    const startMap = () => {
      if ('geolocation' in navigator) {
        /* geolocation 사용 가능 */
        navigator.geolocation.getCurrentPosition(
          function(data) {
            var latitude = data.coords.latitude
            var longitude = data.coords.longitude
            state.latitude = latitude
            state.longitude = longitude
          },
          function(error) {
            alert(error)
          },
          {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0,
          }
        )
      } else {
        /* geolocation 사용 불가능 */
        alert('geolocation 사용 불가능')
      }
    }

    const handleCancleSchedule = () => {
      router.push({ name: 'Calendar' })
    }

    const addSchedule = function() {
      let startDate = state.date[0]
      let endDate = state.date[1]
      if (startDate === endDate && state.startTime > state.endTime) {
        alert('종료 시간은 시작 시간보다 빠를 수 없습니다')
      } else {
        if (state.allDay) {
          if (
            state.title &&
            state.content &&
            startDate &&
            endDate &&
            state.placeName
          ) {
            const aDay = {
              uid: state.uid,
              title: state.title,
              content: state.content,
              startDate: startDate,
              endDate: endDate,
              startTime: '00:00',
              endTime: '23:59',
              placeName: state.placeName,
              placeLat: state.placeLat,
              placeLng: state.placeLng,
              allDay: state.allDay,
              color: state.color,
              category: state.category,
            }
            axios
              .post(
                `https://k5d105.p.ssafy.io:3030/calendar/createCalendar`,
                aDay,
                {
                  headers: {
                    FCMtoken: localStorage.getItem('FCMtoken'),
                    authorization: localStorage.getItem('token'),
                  },
                }
              )
              .then((response) => {
                const res = response.data.calendar

                const d = {
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
                }

                store.dispatch('pushCalendarData', d)
                router.push({ name: 'Calendar' })
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
            alert('시간을 제외한 모든 항목을 입력해 주세요')
          }
        } else {
          if (
            state.title &&
            state.content &&
            startDate &&
            endDate &&
            state.placeName &&
            state.startTime &&
            state.endTime
          ) {
            const day = {
              uid: state.uid,
              title: state.title,
              content: state.content,
              startDate: startDate,
              endDate: endDate,
              startTime: state.startTime,
              endTime: state.endTime,
              placeName: state.placeName,
              placeLat: state.placeLat,
              placeLng: state.placeLng,
              allDay: state.allDay,
              color: state.color,
              category: state.category,
            }
            axios
              .post(
                `https://k5d105.p.ssafy.io:3030/calendar/createCalendar`,
                day,
                {
                  headers: {
                    FCMtoken: localStorage.getItem('FCMtoken'),
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
                }

                store.dispatch('pushCalendarData', day)
                router.push({ name: 'Calendar' })
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
            alert('모든 항목을 입력해 주세요')
          }
        }
      }
    }

    return {
      state,
      addSchedule,
      handleCancleSchedule,
      setPlace,
      mapAutoComplete,
      showMapModal,
      mapModal,
      // geojson,
      // geojsonOptions
    }
  },
}
</script>

<style>
.schedule-info {
  /* 500 */
  width: 500px;
  margin: 0 auto;
}

.mobile-schedule-main {
  /* width: 100%;
    height: 100%; */

  margin: 0 auto;
  width: 300px;
  padding: 50px;
  border-radius: 30px;
  background-color: #f6f6f6;
}

.memo {
  width: 300px;
  height: 200px;
}

.memo-content {
  /* background-color: #F6F6F6; */
  font-size: 20px;
}

.import-label {
  border-radius: 50%;
  height: 20px;
  width: 20px;
}

.label {
  width: 70px;
  height: 30px;
  font-weight: 100;
  padding: 0px 12px 0px 0px;
}

.red {
  background-color: #ff7c7c;
}
.orange {
  background-color: #fecfa3;
}
.yellow {
  background-color: #fff972;
}
.green {
  background-color: #b6fb81;
}
.blue {
  background-color: #7886ff;
}

/* 웹화면 */
.scheduleDate,
.scheduleDate .el-range-editor.el-input__inner {
  margin: 0;
}

.scheduleDate .el-range-editor.el-input__inner {
  border: 2px solid #a9c9de;
}

.userCalendar-schedule-row {
  display: flex;
  align-items: center;
}

.userCalendar-schedule-map {
  display: flex;
  justify-content: center;
}

.web-input {
  width: 400px;
  height: 30px;
  outline: none;
  border: 2px solid #a9c9de;
  border-radius: 4px;
}

.date-input {
  width: 195px;
  height: 30px;
  outline: none;
  border: 2px solid #a9c9de;
  border-radius: 4px;
}

.time-input {
  width: 190px;
  height: 30px;
  outline: none;
  border: 2px solid #a9c9de;
  border-radius: 4px;
}

.web-memo {
  width: 390px;
  height: 200px;
}

.web-button-red {
  background-color: rgb(255, 155, 155);
  color: white;
  border: none;
  border-radius: 4px;
  width: 80px;
  height: 40px;
}

.web-button-red:hover {
  box-shadow: 0 0 10px rgb(255, 155, 155);
}

.web-button-blue {
  background-color: #a9c9de;
  color: white;
  border: none;
  border-radius: 4px;
  width: 80px;
  height: 40px;
}

.web-button-blue:hover {
  box-shadow: 0 0 10px #a9c9de;
}

.userCalendar-schedule-color-box {
  width: 400px;
  display: flex;
  justify-content: space-evenly;
}

.userCalendar-schedule-color-wrap {
  display: flex;
}

.userCalendar-schedule-allDay {
  display: flex;
  align-items: center;
}

.userCalendar-schedule-allDay > input {
  width: 15px;
  height: 15px;
}

.userCalendar-schedule-category {
  display: flex;
}

.userCalendar-schedule-category .el-radio {
  margin-right: 1px;
}

.userCalendar-schedule-category-button-wrap {
  width: 400px;
}
</style>
