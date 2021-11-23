<template>
  <div>
    <teleport to="#destination">
      <!-- 자식 엘리먼트 접근 -->
      <CalendarModal ref="modal">
      </CalendarModal>
    </teleport>
  </div>
</template>

<script>
import CalendarModal from "./CalendarModal";
import { ref } from "vue";
export default {
  components: {
    CalendarModal
  },
  setup() {
    const disableTeleport = ref(false);
    const modal = ref(null);
    function showModal() {
      // VMmodal.vue에 접근하여 show 함수 실행
      modal.value.show();
    }
    return {
      disableTeleport,
      modal,
      showModal
    };
  }
};
</script>
