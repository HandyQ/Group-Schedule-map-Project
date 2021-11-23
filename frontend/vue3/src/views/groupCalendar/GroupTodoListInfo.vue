<template>
  <div>
    <el-space wrap direction="vertical">
      <el-card v-for="day in state.mData" :key="day" class="box-card todoList-card" @click="changeTodo(day)">
        <el-row v-if="isToday(day.start)">
          <el-col :span="9" class="todoList-card-time">
            {{ `${day.start.toString().split(' ')[4].substring(0, 2)}시` }}
            {{ ` ${((day.start.toString().split(' ')[4].substring(3, 5) == '00') ? '' : `${day.start.toString().split(' ')[4].substring(3, 5)}분`)}`}}
          </el-col>
          <el-col :span="11" class="todoList-card-title">
            <span v-if="state.mData">
              <!-- {{ day.title.toString() }} -->
              {{ titleFormat(day.title) }}
            </span>
          </el-col>
          <el-col :span="4" class="todoList-card-particpant">
            <el-icon>
              <User />
            </el-icon>
            {{ calculpParticipant(day.extendedProps.participant) }}
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="20" class="todoList-card-title-checked">
            <span>
              {{ titleFormat(day.title) }}
            </span>
          </el-col>
          <el-col :span="4" class="todoList-card-particpant">
            <el-icon>
              <User />
            </el-icon>
            {{ calculpParticipant(day.extendedProps.participant) }}
          </el-col>
        </el-row>
      </el-card>
    </el-space>

    
  </div>
</template>

<script>
import { computed, inject, reactive, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'

// utils
import dayjs from 'dayjs'
import { User } from '@element-plus/icons'


export default {
  name: "GroupTodoListInfo",
  components:{
    User
  },
  setup() {
    const store = useStore()
    const today = inject('grouptodayData')

    onBeforeMount(() => {
      window.addEventListener('resize', handleGroupTodoListInfoWindowSize)
      handleGroupTodoListInfoWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupTodoListInfoWindowSize)
    })

    const handleGroupTodoListInfoWindowSize = () => {
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

    const changeTodo = function(todo) {
      store.dispatch('setGroupTodo', todo)
    }

    const isToday = function (time) {
      const tTime = dayjs();
      return tTime.isSame(time, 'day')
    }

    const calculpParticipant = (participants) => {
      const completedUsers = participants.filter((par) => par.completed)
      return `${completedUsers.length}/${participants.length}`
    } 

    const titleFormat = (title) => {

      if (state.winSize === 'xl') {
        // 12
        if (title.length > 12) {
          return `${title.substring(0, 10)}..` 
        }
        return title
      } else if ( state.winSize === 'lg' ) {
        // 10
        if (title.length > 10) {
          return `${title.substring(0, 8)}..` 
        }
        return title
      } else if ( state.winSize === 'md' ) {
        // 13
        if (title.length > 13) {
          return `${title.substring(0, 11)}..` 
        }
        return title
      } else if ( state.winSize === 'sm' ) {
        // 9
        if (title.length > 9) {
          return `${title.substring(0, 7)}..` 
        }
        return title
      } else {
        // 6
        if (title.length > 6) {
          return `${title.substring(0, 4)}`
        } 
        return title
      }
    }

    const state = reactive({
      mData: computed(() => store.getters.getGroupTodayToDoList),
      winSize: 'lg',
    })

    return { state, today, changeTodo, isToday, calculpParticipant, titleFormat }
  },
}
</script>

<style>
  .todoList-card {
    cursor: pointer;
  }

  .todoList-card-particpant {
    display: flex;
    align-items: center;
  }

  @media screen and (min-width: 1200px) {
    .todoList-card {
      width: 460px;
    }
    .todoList-card-time {
      font-size: 2rem;
      display: flex;
      justify-content: flex-start;
    }

    .todoList-card-title{
      display: flex;
      align-items: center;
    }

    .todoList-card-title-checked {
      font-size: 1.5rem;
    }
  }

  @media screen and (max-width: 1199px) and (min-width: 993px) {
    .todoList-card {
      width: 380px;
    }
  }

  @media screen and (max-width: 992px) and (min-width: 768px) {
    .todoList-card {
      width: 500px;
    }
  }

  @media screen and (max-width: 767px) and (min-width: 500px) {
    .todoList-card {
      width: 350px;
    }
  }

  @media screen and (max-width: 499px) {
    .todoList-card {
      width: 250px;
    }
  }

</style>