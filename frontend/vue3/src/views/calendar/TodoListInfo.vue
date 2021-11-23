<template>
  <div>
    <el-space wrap direction="vertical">
      <el-card v-for="i in state.mData" :key="i" class="box-card todoList-card" @click="changeTodo(i)">
        <el-row v-if="isToday(i.start)">
          <el-col :span="10" class="todoList-card-time">
            {{ `${i.start.toString().split(' ')[4].substring(0, 2)}시` }}
            {{ ` ${((i.start.toString().split(' ')[4].substring(3, 5) == '00') ? '' : `${i.start.toString().split(' ')[4].substring(3, 5)}분`)}`}}
          </el-col>
          <el-col :span="14" class="todoList-card-title">
            <span>
              {{ i.title }}
            </span>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24" class="todoList-card-title-checked">
            <span>
              {{ i.title}}
            </span>
          </el-col>
        </el-row>
      </el-card>
    </el-space>
  </div>
</template>

<script>
import { computed, inject, reactive } from 'vue'
import { useStore } from 'vuex'

import dayjs from 'dayjs'

export default {
  name: "TodoListInfo",
  setup() {
    const store = useStore()
    const today = inject('todayData')

    const changeTodo = function(todo) {
      store.dispatch('setTodo', todo)
    }

    const isToday = function (time) {
      const tTime = dayjs();
      return tTime.isSame(time, 'day')
    }

    const state = reactive({
      mData: computed(() => store.getters.getTodayToDoList)
    })

    return { state, today, changeTodo, isToday}
  },
}
</script>

<style>
  .todoList-card {
    cursor: pointer;
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
      font-size: 2rem;
      text-align: start;
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