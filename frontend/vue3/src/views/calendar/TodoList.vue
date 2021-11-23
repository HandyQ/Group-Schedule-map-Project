<template>
  <div class="todoList" v-if="state.isTodayData">
    <el-row :gutter="10" v-if="state.isBig">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <TodoListInfo />
        </div>
      </el-col>
      <!-- <el-col :span="2"></el-col> -->
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <TodoListCurrent />
        </div>
      </el-col>
    </el-row>


    <div v-else>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <TodoListCurrent />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <TodoListInfo />
          </div>
        </el-col>
      </el-row>

    </div>
    
  </div>
  <div v-else>
  </div>
</template>

<script>
import { computed, provide, reactive, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'

import TodoListInfo from '@/views/calendar/TodoListInfo'
import TodoListCurrent from '@/views/calendar/TodoListCurrent'

export default {
  name: "TodoList",
  components: {
    TodoListInfo,
    TodoListCurrent,
  },
  setup() {
    const store = useStore()


    provide( 'todayData',
      computed(() => state.mData)
    )
    provide('toDoItem',
      computed(() => state.mData[0])
    )

    // windowSize
    const handleWindowSize = () => {
      if (window.innerWidth > 992) {
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

    const state = reactive({
      mData: computed(() => store.getters.getTodayToDoList),
      isTodayData: computed(() => {
        return (store.getters.getTodayToDoList.length > 0) ? true : false
      }),
      isBig: true,
    })


    return { state }
  }
}
</script>

<style>
  .todoList{
    border-radius: 1rem;
    padding :10px 0;
    background-color: #EDEDED;
  }
</style>