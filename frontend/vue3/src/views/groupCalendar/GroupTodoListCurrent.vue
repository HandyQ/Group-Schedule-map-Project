<template>
  <GroupTodoListCurrentInit v-if="!state.isTodoItem && todayItem" />
  <GroupTodoListCurrentCheck v-else />
</template>

<script>
import { computed, inject, reactive } from 'vue'
import { useStore } from 'vuex'

import GroupTodoListCurrentInit from '@/views/groupCalendar/GroupTodoListCurrentInit'
import GroupTodoListCurrentCheck from'@/views/groupCalendar/GroupTodoListCurrentCheck'

export default {
  name: "GroupTodoListCurrent",
  components: {
    GroupTodoListCurrentInit,
    GroupTodoListCurrentCheck
  },
  setup() {
    const store = useStore()
    const today = inject('grouptodayData')
    const todayItem = inject('grouptoDoItem')

    const state = reactive({
      toDo: computed(() => store.state.groupToDo),
      isTodoItem: computed(() => store.state.isGroupTodoItem)
    })
    return { state, today, todayItem }
  },
}
</script>

<style>

</style>