<template>
  <div>
    <GCalendar v-if="isData"/>
  </div>
</template>

<script>
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

// component
import GCalendar from '@/views/groupCalendar/GCalendar'

export default {
  name: 'GroupCalendar',
  components:{
    GCalendar
  },

  setup() {
    const route = useRoute()
    const store = useStore()

    const { gid } = route.query

    const isData = computed(() => store.state.isGroupData)

    onBeforeMount(() => {
      store.dispatch('getGroupCalendarData', gid)
    })

    return {
      isData,
    }

  }

}
</script>

<style>

</style>