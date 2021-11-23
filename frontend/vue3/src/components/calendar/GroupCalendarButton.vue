<template>
  <div class="calendar-header" v-if="state.isBig">
    <el-button-group>
      <el-button type="default" @click="handlePrevCalendar">
        <el-icon>
          <ArrowLeft/>
        </el-icon>
      </el-button>
      <el-button type="default" @click="handleNextCalendar">
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </el-button-group>

    <div>
      <span v-if="!state.isFullCalendar" class="calendar-header-title">
        <slot></slot>
      </span>
      <span v-else class="calendar-header-title">{{ state.currentMonth }}</span>
    </div>

    <div>
      <el-button @click="handleGoToday" style="margin-right: 0.5rem">
        <span>오늘</span>
      </el-button>
      <el-dropdown>
        <el-button type="default">
          {{ state.calendarView }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleViewMonth">월</el-dropdown-item>
            <el-dropdown-item @click="handleViewWeek">주</el-dropdown-item>
            <!-- <el-dropdown-item @click="handleViewList">목록</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>


  <div v-else>
    <div class="calendar-header-title-wrap">
      <span v-if="!state.isFullCalendar" class="calendar-header-title">
        <slot></slot>
      </span>
      <span v-else class="calendar-header-title">{{ state.currentMonth }}</span>
    </div>

    <div class="calendar-header">
      <div class="calendar-header-daycontroller">
        <el-button-group>
          <el-button type="default" @click="handlePrevCalendar">
            <el-icon>
              <ArrowLeft/>
            </el-icon>
          </el-button>
          <el-button type="default" @click="handleNextCalendar">
            <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </el-button-group>

        <el-button @click="handleGoToday" class="calendar-header-daycontroller-today">
          <span>오늘</span>
        </el-button>
      </div>

        <el-dropdown>
          <el-button type="default">
            {{ state.calendarView }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleViewMonth">월</el-dropdown-item>
              <el-dropdown-item @click="handleViewWeek">주</el-dropdown-item>
              <!-- <el-dropdown-item @click="handleViewList">목록</el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
  </div>  
</template>

<script>
//vue
// import { computed, onMounted, reactive, ref } from 'vue'
import { reactive, computed, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'

//utils
import dayjs from 'dayjs'
import { ArrowLeft, ArrowRight, ArrowDown } from '@element-plus/icons'


export default {
  name: 'GroupCalendarButton',
  components:{
    ArrowLeft,
    ArrowRight,
    ArrowDown,
  },

  setup() {
    const store = useStore()

    const fullCalendar = computed(() => {
      return store.state.groupCalAPI
    })

    // windowSize
    const handleWindowSize = () => {
      if (window.innerWidth > 767) {
        state.isBig = true
      } else {
        state.isBig = false
      }
    }

    onBeforeMount(() => {
      window.addEventListener('resize', handleWindowSize)
      handleWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowSize)
    })

    const handlePrevCalendar = () => {
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.prev()
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleNextCalendar = () => {
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.next()
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleGoToday = () => {
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.today()
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleViewMonth = () => {
      state.calendarView = '월'
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.changeView('dayGridMonth')
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleViewWeek = () => {
      state.calendarView = '주'
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.changeView('timeGridWeek')
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleViewList = () => {
      state.calendarView = '목록'
      let calendarApi = fullCalendar.value.getApi()
      calendarApi.changeView('listWeek')
      state.isFullCalendar = true
      handleViewTitle()
    }

    const handleViewTitle = () => {
      let calendarApi = fullCalendar.value.getApi()

      const title = calendarApi.getDate().toString().split(' ')
      if (state.calendarView === '월') {
        state.currentMonth = `${title[3]}년 ${changeMonthFormat(title[1])}월`
      }
      // else if (state.calendarView === '주') {
      else {
        let today = dayjs(calendarApi.getDate().toString())
        let start = today.day(1).toString().split(' ')
        let end = today.endOf('week').toString().split(' ')

        // 다를 경우 -1 1년 -2 1개월만
        if (start[3] === end[3]) {
          // 같은 년도
          if (start[2] === end[2]) {
            // 같은 달
            state.currentMonth = `${changeMonthFormat(start[2])}월 ${start[1]} - ${end[1]}일 ${start[3]}년`
          } else {
            // 다른 달
            state.currentMonth = `${changeMonthFormat(start[2])}월 ${start[1]}일 - ${changeMonthFormat(end[2])}월 ${end[1]}일, ${start[3]}년`
          }
        } else {
          // 다른 년도
          state.currentMonth = `${start[3]}년 ${changeMonthFormat(start[2])}월 ${start[1]}일 -  ${end[3]}년 ${changeMonthFormat(end[2])}월 ${end[1]}일`
        }
      }
    }

    const changeMonthFormat = (month) => {
      switch(month) {
        case 'Jan':
          return '1';
        case 'Feb':
          return '2';
        case 'Mar':
          return '3';
        case 'Apr':
          return '4';
        case 'May':
          return '5';
        case 'Jun':
          return '6';
        case 'Jul':
          return '7';
        case 'Aug':
          return '8';
        case 'Sep':
          return '9';
        case 'Oct':
          return '10';
        case 'Nov':
          return '11';
        case 'Dec':
          return '12';
      }
    }


    const state = reactive({
      isFullCalendar : false,
      calendarView: '월',
      currentMonth: '',
      isBig: true,
    })


    return {
      // calData,
      handlePrevCalendar,
      handleNextCalendar,
      handleGoToday,
      handleViewMonth,
      handleViewWeek,
      handleViewList,
      handleWindowSize,
      state,
    }
  }

}
</script>

<style>
  .calendar-header-daycontroller {
    display: flex;
    align-items: center;
  }

  .calendar-header-title-wrap {
    margin: 0 0 1rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .calendar-header-daycontroller-today {
    margin-left: 1rem !important;
  }

  @media screen and (min-width: 1200px) {

    .calendar-header {
      width: 1000px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calendar-header-title { 
      font-size: 1.1rem;
    }

  }

  @media screen and (max-width: 1199px) and (min-width: 993px) {
    .calendar-header {
      width: 793px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calendar-header-title { 
      font-size: 1.1rem;
    }
  }

  @media screen and (max-width: 992px) and (min-width: 768px) {
    .calendar-header {
      width: 569px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calendar-header-title { 
      font-size: 1.1rem;
    }

  }

  @media screen and (max-width: 767px) and (min-width: 500px) {
    .calendar-header {
      width: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calendar-header-title { 
      font-size: 1.1rem;
    }
  }

  @media screen and (max-width: 499px) {
    .calendar-header {
      width: 300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .calendar-header-title { 
      font-size: 1.1rem;
    }
  }

</style>