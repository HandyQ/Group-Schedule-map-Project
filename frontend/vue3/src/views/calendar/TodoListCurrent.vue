<template>
  <TodoListCurrentInit v-if="!state.isTodoItem && todayItem" />
  <TodoListCurrentCheck v-else />
</template>

<script>
import { computed, inject, reactive } from 'vue'
import { useStore } from 'vuex'

import TodoListCurrentInit from '@/views/calendar/TodoListCurrentInit'
import TodoListCurrentCheck from'@/views/calendar/TodoListCurrentCheck'

export default {
  name: "TodoListCurrent",
  components: {
    TodoListCurrentInit,
    TodoListCurrentCheck
  },
  setup() {
    const store = useStore()
    const today = inject('todayData')
    const todayItem = inject('toDoItem')

    const state = reactive({
      toDo: computed(() => store.state.toDo),
      isTodoItem: computed(() => store.state.isTodoItem)
    })
    return { state, today, todayItem }
  },
}
</script>

<style>

</style>