import { createStore } from 'vuex'
import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

const BASE_URL = 'https://k5d105.p.ssafy.io:3030/'

export default createStore({
  state: {
    //user calendar
    isData: false,
    isTodoItem: false,
    calendarData: [],
    modalData: {},
    refreshData: [],
    todayToDoList: [],
    toDo: {},
    calAPI: {},
    calendarMapGoal: {},
    isChoiceWay: false,
    choiceWay: {},
    putMapGoal:{},
    isPutChoiceWay: false,
    putChoiceWay: {},

    // group calendar
    isGroupData: false,
    isGroupTodoItem: false,
    groupCalendarData: [],
    groupModalData: {},
    groupRefreshData: [],
    groupCalAPI: {},
    groupToDo: {},
    GroupCalendarMapGoal: {},
    isGroupChoiceWay: false,
    GroupChoiceWay: {},
    groupPutMapGoal : {},
    isGroupPutChoiceWay: false,
    GroupPutChoiceWay : {},
  },
  mutations: {
    setCalendarData(state, payload) {
      // set calendar Data
      state.calendarData = payload
    },
    checkCalendarData(state) {
      // check calendar loading state
      if (state.calendarData.length) state.isData = true
    },
    CHECKEMPTYCALENDARDATA(state) {
      state.isData = true
    },
    setModalData(state, payload) {
      state.modalData = payload
    },
    refreshCalData(state, payload) {
      //todoList 뽑기...
      state.refreshData = payload
    },
    SETTODO(state, payload) {
      state.toDo = payload
      state.isTodoItem = true
    },
    SETCALENDARAPI(state, payload) {
      state.calAPI = payload
    },
    PUSHCALENDARDATA(state, payload) {
      state.calendarData.push(payload)
    },
    DELETECALENDARDATA(state, payload) {
      // console.log(state.calendarData)
      state.calendarData = state.calendarData.filter((c) => {
        return c.cid != payload
      })
    },
    SETCALENDARMAPGOAL(state, payload) {
      state.calendarMapGoal = payload
    },
    SETMAPMODALCHOICE ( state, payload) {
      state.isChoiceWay = true
      state.choiceWay = {
        distance : payload.distance,
        duration : payload.duration
      }
    },
    DISABLEMAPMODALCHOICE(state) {
      state.isChoiceWay = false
    },
    SETPUTMAPGOAL( state, payload) {
      state.putMapGoal = payload
    },
    SETPUTMAPCHOICE ( state, payload ) {
      state.isPutChoiceWay = true
      state.putChoiceWay = {
        distance : payload.distance,
        duration : payload.duration
      }
    },
    DISABLEPUTMAPCHOICE ( state ) {
      state.isPutChoiceWay = false
    },
    INITMAPCHOICE ( state ) {
      state.isChoiceWay = false
      state.choiceWay = {}
    },

    // 그룹 캘린더
    SETGROUPCALENDARDATA(state, payload) {
      state.groupCalendarData = payload
    },
    CHECKGROUPCALENDARDATA(state) {
      state.isGroupData = true
    },
    SETGROUPMODAL(state, payload) {
      state.groupModalData = payload
    },
    SETGROUPCALENDARAPI(state, payload) {
      state.groupCalAPI = payload
    },
    DELETEGROUPCALENDARDATA(state, payload) {
      state.groupCalendarData = state.groupCalendarData.filter((c) => {
        return c.cid != payload
      })
    },
    PUSHGROUPCALENDARDATA(state, payload) {
      state.groupCalendarData.push(payload)
    },
    REFRESHGROUPCALENDARDATA(state, payload) {
      state.groupRefreshData = payload
    },
    SETGROUPTODO(state, payload) {
      state.groupToDo = payload
      state.isGroupTodoItem = true
    },
    SETGROUPCALENDARMAPGOAL ( state, payload ) {
      state.GroupCalendarMapGoal = payload
    },
    SETGROUPMAPMODALCHOICE (state, payload) {
      state.isGroupChoiceWay = true
      state.groupChoiceWay = {
        distance : payload.distance,
        duration : payload.duration
      }
    },
    DISABLEGROUPMAPMODALCHOICE ( state ) {
      state.isGroupChoiceWay = false
    },
    DISABLEGROUPPUTMAPCHOICE ( state ) {
      state.isGroupPutChoiceWay = false
    },
    SETGROUPPUTMAPGOAL ( state, payload ) {
      state.groupPutMapGoal = payload
    },
    SETPUTGROUPMAPCHOICE ( state, payload ) {
      state.isGroupPutChoiceWay = true
      state.GroupPutChoiceWay = {
        distance : payload.distance,
        duration : payload.duration
      }
    },
    INITGROUPMAPCHOICE ( state ) {
      state.isGroupPutChoiceWay = false
      state.GroupPutChoiceWay = {}
    }
  },
  actions: {
    // user calendar
    getCalendarData({ commit }) {
      // console.log('store axios')
      axios
        .post(
          `${BASE_URL}calendar/getCalendar`,
          {
            uid: localStorage.getItem('uid'),
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((response) => {
          if (response.data.msg === '일정 정보가 없습니다.') {
            commit('setCalendarData', [])
            commit('CHECKEMPTYCALENDARDATA')
          } else {
            const res = response.data.calendar.map((r) => {
              if (r.completed) {
                return {
                  cid: r.cid,
                  completed: r.completed,
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
                  category: r.category,
                  allDay: r.allDay,
                  classNames: ['calendar-done'],
                }
              }
              return {
                cid: r.cid,
                completed: r.completed,
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
                category: r.category,
                allDay: r.allDay,
              }
            })
            commit('setCalendarData', res)
            commit('checkCalendarData')
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert('로그인이 만료되었습니다')
            location.replace('/')
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
          }
        })
    },
    setModal({ commit }, payload) {
      commit('setModalData', payload)
    },
    refreshCalendarData({ commit }, payload) {
      commit('refreshCalData', payload)
    },
    setTodo({ commit }, payload) {
      commit('SETTODO', payload)
    },
    setCalendarApi({ commit }, payload) {
      commit('SETCALENDARAPI', payload)
    },
    pushCalendarData({ commit }, payload) {
      commit('PUSHCALENDARDATA', payload)
    },
    deleteCalendarData({ commit }, payload) {
      commit('DELETECALENDARDATA', payload)
    },
    setCalendarMapGoal({ commit }, payload) {
      commit('SETCALENDARMAPGOAL', payload)
    },
    setMapModalChoice ( {commit} , payload) {
      commit('SETMAPMODALCHOICE', payload)
    },
    disableMapModalChocie ( {commit} ) {
      commit('DISABLEMAPMODALCHOICE')
    },
    setPutMapGoal ( { commit }, payload) {
      commit('SETPUTMAPGOAL', payload)
    },
    setPutMapChoice ( { commit }, payload) {
      commit('SETPUTMAPCHOICE', payload)
    },
    diablePutMapChoice ( { commit } ) {
      commit('DISABLEPUTMAPCHOICE')
    },
    initMapChoice( { commit }) {
      commit('INITMAPCHOICE')
    },

    // group calendar
    getGroupCalendarData({ commit }, payload) {
      // console.log('request g cal data')
      axios
        .get(`${BASE_URL}groupCalendar/getCalendar`, {
          // uid: localStorage.getItem('uid'),
          params: {
            gid: payload,
          },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          // console.log(response)
          if (response.data.msg === '그룹 캘린더가 없습니다.') {
            commit('SETGROUPCALENDARDATA', [])
            commit('CHECKGROUPCALENDARDATA')
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
                  gid: payload,
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
                  allDay: r.allDay,
                  creator: r.creator,
                  category: r.category,
                }
              }
              return {
                cid: r.cid,
                gid: payload,
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
                allDay: r.allDay,
                creator: r.creator,
                category: r.category,
              }
            })
            commit('SETGROUPCALENDARDATA', res)
            commit('CHECKGROUPCALENDARDATA')
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert('로그인이 만료되었습니다')
            location.replace('/')
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
          }
        })
    },  
    getChangeGroupCalendarData( {commit}, payload) {
      commit('SETGROUPCALENDARDATA', payload)
    },
    setGroupModal({ commit }, payload) {
      commit('SETGROUPMODAL', payload)
    },
    setGroupCalendarApi({ commit }, payload) {
      commit('SETGROUPCALENDARAPI', payload)
    },
    deleteGroupCalendarData({ commit }, payload) {
      commit('DELETEGROUPCALENDARDATA', payload)
    },
    pushGroupCalendarData({ commit }, payload) {
      commit('PUSHGROUPCALENDARDATA', payload)
    },
    refreshGroupCalendarData({ commit }, payload) {
      commit('REFRESHGROUPCALENDARDATA', payload)
    },
    setGroupTodo({ commit }, payload) {
      commit('SETGROUPTODO', payload)
    },
    setGroupCalendarMapGoal ( { commit }, payload ) {
      commit('SETGROUPCALENDARMAPGOAL', payload)
    },
    disableGroupMapModalChoice ( {commit}) {
      commit('DISABLEGROUPMAPMODALCHOICE')
    },
    setGroupMapModalChoice ( {commit}, payload) {
      commit('SETGROUPMAPMODALCHOICE', payload)
    },
    diableGroupPutMapChoice ( { commit }) {
      commit('DISABLEGROUPPUTMAPCHOICE')
    },
    setGroupPutMapGoal ( { commit }, payload ) {
      commit('SETGROUPPUTMAPGOAL', payload)
    },
    setPutGroupMapChoice ( { commit }, payload ) {
      commit('SETPUTGROUPMAPCHOICE', payload)
    },
    initGroupMapChoice ({ commit }) {
      commit('INITGROUPMAPCHOICE')
    },
  },
  modules: {},
  getters: {
    // user calendar
    getModalDataFormat(state) {
      // 날짜 정리하기
      // Fri Nov 26 2021 18:00:00 GMT+0900 (한국 표준시)
      const ModalDate = state.modalData

      const start = ModalDate.start.toString().split(' ')
      // 시작하는 날
      const startDay = changeDateFormat(start, ModalDate.allDay)
      // 끝나는 날
      if (ModalDate.allDay && ModalDate.end === null) {
        return {
          ModalDate: ModalDate,
          startDay: startDay,
          endDay: startDay,
        }
      }
      const end = ModalDate.end.toString().split(' ')
      const endDay = changeDateFormat(end, ModalDate.allDay)
      return {
        ModalDate: ModalDate,
        startDay: startDay,
        endDay: endDay,
      }
    },
    getTodayToDoList(state) {
      const calData = state.refreshData
      let date = dayjs()
      dayjs.extend(isBetween)

      const todayList = calData.filter((day) => {
        /* 
          today 조건
          1. 오늘이 시작과 끝 사이다
          2. 끝나는 날이 오늘이다
          3. 시작하는 날이 오늘이다
          ( allday )
          4. 종일일정이 오늘이다1
          5. 하루 시작과 끝이 오늘이다.
        */
        if (date.isBetween(day.startStr, day.endStr)) {
          return day
        }
        if (date.isSame(day.startStr, 'day')) {
          return day
        }
        if (date.isSame(day.endStr, 'day')) {
          return day
        }
      })

      return todayList.sort(daySort)
    },
    // group calendar
    getGroupModalDataFormat(state) {
      // 날짜 정리하기
      // Fri Nov 26 2021 18:00:00 GMT+0900 (한국 표준시)
      const ModalDate = state.groupModalData
      const start = ModalDate.start.toString().split(' ')
      // 시작하는 날
      const startDay = changeDateFormat(start, ModalDate.allDay)
      if (ModalDate.allDay && ModalDate.end === null) {
        return {
          ModalDate: ModalDate,
          startDay: startDay,
          endDay: startDay,
        }
      }
      // 끝나는 날
      const end = ModalDate.end.toString().split(' ')
      const endDay = changeDateFormat(end, ModalDate.allDay)
      return {
        ModalDate: ModalDate,
        startDay: startDay,
        endDay: endDay,
      }
    },
    getGroupTodayToDoList(state) {
      const calData = state.groupRefreshData
      let date = dayjs()
      dayjs.extend(isBetween)

      const todayList = calData.filter((day) => {
        /* 
          today 조건
          1. 오늘이 시작과 끝 사이다
          2. 끝나는 날이 오늘이다
          3. 시작하는 날이 오늘이다
          ( allday )
          4. 종일일정이 오늘이다1
          5. 하루 시작과 끝이 오늘이다.
        */
        if (date.isBetween(day.startStr, day.endStr)) {
          return day
        }
        if (date.isSame(day.startStr, 'day')) {
          return day
        }
        if (date.isSame(day.endStr, 'day')) {
          return day
        }
      })

      return todayList.sort(daySort)
    },
  },
})

function daySort(a, b) {
  /*
    요구사항
    1. 당일 시간순서대로 정렬한다.
    2. 종일 일정이라면 맨 뒤로 놓는다.
    2-1. 시작한 날에 따라서 정렬한다.
    절차
    1. a 와 b의 시작날짜가 오늘인지 체크 ( allDay 도 체크해야한다.)
    1-1. 둘 다 오늘이면 정렬한다.
    1-2. 둘 중 하나라도 오늘이 아니면 뒤로 밀어버린다.
    1-3. 둘 다 오늘이 아니면 정렬한다. 시작하는 날짜 기준으로
  */
  /* 
    삼항연산자
      (dateA > dateB) ? 1 : -1
      () 조건식
      ? 1 true
      : -1 false
    sort 시 1 이면 뒤로 -1 이면 그대로 인 듯하다.
  */
  let today = dayjs()
  let dateA = new Date(a.start).getTime()
  let dateB = new Date(b.start).getTime()
  // 둘 다 오늘이면 비교
  if (today.isSame(a.startStr, 'day') && today.isSame(b.startStr, 'day')) {
    return dateA > dateB ? 1 : -1
  }
  if (!today.isSame(a.startStr, 'day') && today.isSame(b.startStr, 'day')) {
    return 1
  }
  if (today.isSame(a.startStr, 'day') && !today.isSame(b.startStr, 'day')) {
    return -1
  }
  if (!today.isSame(a.startStr, 'day') && !today.isSame(b.startStr, 'day')) {
    return dateA > dateB ? 1 : -1
  }
}

function changeDateFormat(date, allDay) {
  // 날짜 정리하기
  // Fri Nov 26 2021 18:00:00 GMT+0900 (한국 표준시)

  let month = ''
  let dow = ''
  let time = ''

  // 월 변환
  switch (date[1]) {
    case 'Jan':
      month = '1'
      break
    case 'Feb':
      month = '2'
      break
    case 'Mar':
      month = '3'
      break
    case 'Apr':
      month = '4'
      break
    case 'May':
      month = '5'
      break
    case 'Jun':
      month = '6'
      break
    case 'Jul':
      month = '7'
      break
    case 'Aug':
      month = '8'
      break
    case 'Sep':
      month = '9'
      break
    case 'Oct':
      month = '10'
      break
    case 'Nov':
      month = '11'
      break
    case 'Dec':
      month = '12'
      break
  }

  // 요일 변환
  switch (date[0]) {
    case 'Mon':
      dow = '월'
      break
    case 'Tue':
      dow = '화'
      break
    case 'Wed':
      dow = '수'
      break
    case 'Thu':
      dow = '목'
      break
    case 'Fri':
      dow = '금'
      break
    case 'Sat':
      dow = '토'
      break
    case 'Sun':
      dow = '일'
      break
  }

  // 시간
  if (!allDay) {
    time = date[4].slice(0, 5)
    return `${date[3]}년 ${month}월 ${date[2]}일 (${dow}) ${time}`
  }
  return `${date[3]}년 ${month}월 ${date[2]}일 (${dow})`
}
