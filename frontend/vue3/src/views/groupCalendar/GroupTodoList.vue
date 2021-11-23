<template>
  <div class="todoList" v-if="state.isTodayData">
    <el-row :gutter="10" v-if="state.isBig">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <GroupTodoListInfo />
        </div>
      </el-col>
      <!-- <el-col :span="2"></el-col> -->
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <GroupTodoListCurrent />
        </div>
      </el-col>
    </el-row>

    <div v-else>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <GroupTodoListCurrent />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <GroupTodoListInfo />
          </div>
        </el-col>
      </el-row>

    </div>
    
  </div>
  <div v-else>
  </div>
</template>

<script>
import { computed, provide, reactive, onBeforeMount, onUnmounted, watchEffect, ref } from 'vue'
import { useStore } from 'vuex'

// components
import GroupTodoListInfo from '@/views/groupCalendar/GroupTodoListInfo'
import GroupTodoListCurrent from '@/views/groupCalendar/GroupTodoListCurrent'

export default {
  name: "TodoList",
  components: {
    GroupTodoListInfo,
    GroupTodoListCurrent,
  },
  setup() {
    const store = useStore()

    let grouptodayData = computed(() => state.mData)

    provide( 'grouptodayData',
      // computed(() => state.mData)
      ref(grouptodayData)
    )
    provide('grouptoDoItem',
      computed(() => state.mData[0])
    )

    watchEffect(() => {
      
    })

    onBeforeMount(() => {
      window.addEventListener('resize', handleGroupTodoListWindowSize)
      handleGroupTodoListWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupTodoListWindowSize)
    })

    // windowSize
    const handleGroupTodoListWindowSize = () => {
      if (window.innerWidth > 992) {
        state.isBig = true
      } else {
        state.isBig = false
      }
    }

    const state = reactive({
      mData: computed(() => store.getters.getGroupTodayToDoList),
      isTodayData: computed(() => {
        return (store.getters.getGroupTodayToDoList.length > 0) ? true : false
      }),
      isBig: true,
    })

    return { state }
  }
}
</script>

<style>

</style>