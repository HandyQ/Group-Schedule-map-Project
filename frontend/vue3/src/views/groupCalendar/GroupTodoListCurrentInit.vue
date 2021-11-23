<template>
  <el-space wrap class="todoitem-card-wrap">
    <el-card class="box-card todoitem-card">

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <div class="todoitem-card-color">
            <span class="todoitem-card-color-box" v-bind:style="{backgroundColor: todayItem.backgroundColor}"></span>
          </div>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-header-title">
          <span>
            {{ todayItem.title }}
          </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Calendar />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-time">
          <span>
            {{ 
              ((todayItem.start.toString().split(' ')[4].substring(3, 5) === '00') ? (`${todayItem.start.toString().split(' ')[4].substring(0, 2)}시`) : `${todayItem.start.toString().split(' ')[4].substring(0, 2)}시 ${todayItem.start.toString().split(' ')[4].substring(3, 5)}분`)   
            }}
          </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Location />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-place">
          <span>
              {{ todayItem.extendedProps.placeName }}
            </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <User />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="group-todoitem-card-participant">
          <div v-for="par in todayItem.extendedProps.participant" :key="par.uid" class="group-todoitem-card-participant-element">
            <el-button v-if="par.completed" size="mini" type="info" plain>
              {{ par.nickname }}
            </el-button>
            <el-button v-if="!par.completed" size="mini">
              {{ par.nickname }}
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Document />  
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-content">
          {{ todayItem.extendedProps.content }}
        </el-col>
      </el-row>

    </el-card>
  </el-space>
</template>

<script>
import { computed, inject, reactive, onBeforeMount, onUnmounted} from 'vue'
import { useStore } from 'vuex'

//icons
import { Calendar, Location, Document, User } from '@element-plus/icons'

export default {
  name: "GroupTodoListCurrentInit",
  components: {
    Calendar,
    Location,
    Document,
    User,
  },
  setup() {
    const store = useStore()
    const today = inject('grouptodayData')
    const todayItem = inject('grouptoDoItem')

    onBeforeMount(() => {
      window.addEventListener('resize', handleGroupTodoListCurrentInfoWindowSize)
      handleGroupTodoListCurrentInfoWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupTodoListCurrentInfoWindowSize)
    })

    const handleGroupTodoListCurrentInfoWindowSize = () => {
      if (window.innerWidth > 1199) {
        state.winSize = 'xl'
      } else if (window.innerWidth > 992 && window.innerWidth <= 1199) {
        state.winSize = 'lg'
      } else if (window.innerWidth > 767 && window.innerWidth <= 992) {
        state.winSize = 'md'
      } else if (window.innerWidth > 499 && window.innerWidth <= 767) {
        state.winSize = 'sm'
      } else {
        state.winSize = 'xs'
      }
    }

    const state = reactive({
      toDo: computed(() => store.state.groupToDo),
      isTodoItem: computed(() => store.state.isGroupTodoItem),
      winSize: 'lg',

    })
    return { state, today, todayItem }
  }
}
</script>

<style>
  .todoitem-card-wrap .el-space__item {
    margin-right: 0 !important;
  }

  .todoitem-card-header-title {
      /* el-col 기본속성 무시 */
      display: flex !important; 
      justify-content: flex-start;
      align-items: center;
    }

  .todoitem-card-header-time {
      display: flex !important;
      justify-content: flex-start;
      align-items: flex-end;
    }

  .group-todoitem-card-participant {
    display: flex;
    flex-flow: wrap;
  }

  .group-todoitem-card-participant-element {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  @media screen and (min-width: 1200px) {
    .todoitem-card {
      width: 460px;
      height: 460px;
    }
    

    /* 제목 */
    .todoitem-card-header-title > span {
      font-size: 2rem;
    }

    
    .todoitem-card-body-place {
      margin-bottom: 10px;
    }


    .todoitem-card-header-time > span {
      font-size: 1rem;
    }


    .todoitem-card-body-content {
      height: 300px;
      border: 1px solid #ededed;
      border-radius: 0.5em;
      display: flex !important;
      padding: 1rem;
    }

  }

  @media screen and (max-width: 1199px) and (min-width: 993px) {
    .todoitem-card {
      width: 380px;
      height: 460px;
    }
  }

  @media screen and (max-width: 992px) and (min-width: 768px) {
    .todoitem-card {
      /* width: 272px; */
      width: 500px;
      margin-bottom: 1rem;
    }
  }

  @media screen and (max-width: 767px) and (min-width: 500px) {
    .todoitem-card {
      width: 350px;
      margin-bottom: 1rem;
    }
  }
    @media screen and (max-width: 499px) {
    .todoitem-card {
      width: 250px;
      margin-bottom: 1rem;
    }
  }
</style>