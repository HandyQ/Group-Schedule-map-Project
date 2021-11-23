<template>
  <div>
    <user-calendar v-if="state.waitData"/>
  </div>
</template>

<script>
// vue
import { useStore } from 'vuex'
import UserCalendar from '@/views/calendar/UserCalendar'
import { computed, onBeforeMount, reactive } from 'vue'

export default {
  name: 'Calendar',
  components : {
    UserCalendar,
  },
  setup() {
    const store = useStore()

    onBeforeMount(() => {
      store.dispatch('getCalendarData')
    })

    const state = reactive({
      waitData: computed(() => store.state.isData)
    })

    return {
      state
    }
  },
}
</script>

<style>

</style>