<template>
  <div class="modal" v-if="isOpen">
    <el-card class="box-card modal-content">
      <template #header>
        <div v-if="state.isBig">
          <el-row>
            <el-col :span="1">
              <div class="modal-content-color">
                <span
                  class="modal-content-color-box"
                  v-bind:style="{
                    backgroundColor: state.mData.ModalDate.backgroundColor,
                  }"
                ></span>
              </div>
            </el-col>
            <el-col :span="22" :offset="1">
              <div class="modal-content-header">
                <div>
                  <span
                    v-if="state.mData.ModalDate.title.length <= 10"
                    style="fontSize: 2rem"
                    >{{ state.mData.ModalDate.title }}</span
                  >
                  <span v-else style="fontSize: 1.5rem">{{
                    state.mData.ModalDate.title
                  }}</span>
                </div>
                <div>
                  <i
                    v-if="state.mData.ModalDate.extendedProps.completed"
                    class="el-icon-refresh-left modalIcon"
                    @click="modalSuccess"
                  ></i>
                  <i
                    v-if="!state.mData.ModalDate.extendedProps.completed"
                    class="el-icon-check modalIcon"
                    @click="modalSuccess"
                  ></i>
                  <i class="el-icon-edit modalIcon" @click="modalPut"></i>
                  <i
                    class="el-icon-delete modalIcon"
                    @click="state.dialogVisible = true"
                  ></i>
                  <i class="el-icon-close modalIcon" @click="hide"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="!state.isBig">
          <el-row class="modal-content-body-contents-row">
            <div class="modal-content-header" style="width: 100%">
              <i
                v-if="state.mData.ModalDate.extendedProps.completed"
                class="el-icon-refresh-left modalIcon"
                @click="modalSuccess"
              ></i>
              <i
                v-if="!state.mData.ModalDate.extendedProps.completed"
                class="el-icon-check modalIcon"
                @click="modalSuccess"
              ></i>
              <i class="el-icon-edit modalIcon" @click="modalPut"></i>
              <i
                class="el-icon-delete modalIcon"
                @click="state.dialogVisible = true"
              ></i>
              <i class="el-icon-close modalIcon" @click="hide"></i>
            </div>
          </el-row>

          <el-row class="modal-content-body-contents-row">
            <span
              class="modal-content-small-color-box"
              :style="{
                backgroundColor: state.mData.ModalDate.backgroundColor,
              }"
            ></span>
          </el-row>

          <el-row>
            <div class="modal-content-header">
              <span
                v-if="state.mData.ModalDate.title.length <= 10"
                style="fontSize: 2rem"
                >{{ state.mData.ModalDate.title }}</span
              >
              <span v-else style="fontSize: 1.5rem">{{
                state.mData.ModalDate.title
              }}</span>
            </div>
          </el-row>
        </div>
      </template>
      <div class="modal-content-body">
        <el-row class="modal-content-body-contents-row">
          <el-col :span="1">
            <div class="modal-content-body-contents-row-icon-wrap">
              <el-icon><Calendar /></el-icon>
            </div>
          </el-col>
          <el-col :span="22" :offset="1">
            <span v-if="state.mData.allDay">{{ state.mData.startDay }}</span>
            <span v-if="!state.mData.allDay" style="fontSize: 0.9rem"
              >{{ state.mData.startDay }} - {{ state.mData.endDay }}</span
            >
          </el-col>
        </el-row>

        <el-row class="modal-content-body-contents-row">
          <el-col :span="1">
            <div class="modal-content-body-contents-row-icon-wrap">
              <el-icon><FolderOpened /></el-icon>
            </div>
          </el-col>
          <el-col :span="22" :offset="1">
            <el-button plain>
              {{ state.mData.ModalDate.extendedProps.category }}
            </el-button>
          </el-col>
        </el-row>

        <el-row class="modal-content-body-contents-row">
          <el-col :span="1">
            <div class="modal-content-body-contents-row-icon-wrap">
              <el-icon><Location /></el-icon>
            </div>
          </el-col>
          <el-col
            :span="18"
            :offset="1"
            style="display: flex; align-items: center;"
          >
            <span>{{ state.mData.ModalDate.extendedProps.placeName }}</span>
          </el-col>
          <el-col :span="4">
            <el-button v-if="!state.isMap" @click="handleMapView()" type="info"
              >경로보기</el-button
            >
            <el-button
              v-if="state.isMap"
              @click="handleMapView()"
              type="info"
              plain
              >경로닫기</el-button
            >
          </el-col>
        </el-row>

        <transition name="slide-fade">
          <el-row
            v-if="state.isMap"
            class="modal-content-body-contents-row modal-content-body-contents-map"
          >
            <el-col :span="1"></el-col>
            <el-col :span="22" :offset="1">
              <l-map
                v-model="state.zoom"
                v-model:zoom="state.zoom"
                ref="userCalMap"
                :center="[state.latitude, state.longitude]"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                >
                </l-tile-layer>
                <l-control-layers />

                <l-marker
                  :lat-lng="[state.latitude, state.longitude]"
                  draggable
                >
                  <l-tooltip>
                    start
                  </l-tooltip>
                </l-marker>

                <l-marker
                  :lat-lng="[
                    state.mData.ModalDate.extendedProps.placeLat,
                    state.mData.ModalDate.extendedProps.placeLng,
                  ]"
                >
                  <l-tooltip>
                    end
                  </l-tooltip>
                </l-marker>

                <l-polyline
                  v-if="
                    state.isWay === 'car' && state.curDriveCourse.length > 0
                  "
                  :lat-lngs="state.curDriveCourse"
                  color="green"
                >
                </l-polyline>
              </l-map>
            </el-col>
          </el-row>
        </transition>

        <el-row>
          <el-col :span="1">
            <div class="modal-content-body-contents-document-icon-wrap">
              <el-icon><Document /></el-icon>
            </div>
          </el-col>
          <el-col :span="22" :offset="1">
            <span>
              {{ state.mData.ModalDate.extendedProps.content }}
            </span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog v-model="state.dialogVisible" width="30%">
      <span>일정을 삭제할까요?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">취소</el-button>
          <el-button type="danger" @click="delEvent">삭제</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, reactive, ref, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

// leaflet
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPolyline,
} from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

//icons
import { Calendar, Location, Document, FolderOpened } from '@element-plus/icons'

export default {
  props: {
    curModal: { type: Object },
  },
  components: {
    Calendar,
    Location,
    Document,
    FolderOpened,
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPolyline,
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const isOpen = ref(false)

    const hide = () => {
      isOpen.value = false
      state.isMap = false
      state.curWay = []
      state.isWay = ''
      state.curDriveCourse = []
    }

    const show = () => {
      isOpen.value = true
    }

    const fullCalendar = ref(null)

    onBeforeMount(() => {
      startMap()

      window.addEventListener('resize', handleGroupModalWindowSize)
      handleGroupModalWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupModalWindowSize)
    })

    const calData = function(cal) {
      fullCalendar.value = cal
    }

    // windowSize
    const handleGroupModalWindowSize = () => {
      if (window.innerWidth > 767) {
        state.isBig = true
      } else {
        state.isBig = false
      }
    }

    const modalPut = () => {
      router.push({ name: 'PutSchedule' })
    }

    const delEvent = () => {
      state.dialogVisible = false
      // 삭제 axios 요청
      axios
        .delete('https://k5d105.p.ssafy.io:3030/calendar/deleteCalendar', {
          headers: {
            authorization: localStorage.getItem('token'),
            FCMtoken: localStorage.getItem('FCMtoken'),
          },

          data: {
            uid: localStorage.getItem('uid'),
            cid: state.mData.ModalDate.extendedProps.cid,
          },
        })
        .then(() => {
          state.mData.ModalDate.remove()
          hide()
        })
    }

    const modalSuccess = function() {
      axios
        .put(
          'https://k5d105.p.ssafy.io:3030/calendar/checkCalendar',
          {
            uid: localStorage.getItem('uid'),
            cid: state.mData.ModalDate.extendedProps.cid,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
              FCMtoken: localStorage.getItem('FCMtoken'),
            },
          }
        )
        .then((response) => {
          let calendarApi = state.calendar.getApi()

          store.dispatch(
            'deleteCalendarData',
            state.mData.ModalDate.extendedProps.cid
          )
          state.mData.ModalDate.remove()
          const r = response.data.calendar
          if (r.completed) {
            const cal = {
              cid: r.cid,
              completed: r.completed,
              title: r.title,
              content: r.content,
              start: r.startDate + 'T' + r.startTime,
              end: r.endDate + 'T' + r.endTime,
              color: r.color,
              placeName: r.placeName,
              placeLat: r.placeLat,
              placeLng: r.placeLng,
              startDate: r.startDate,
              endDate: r.endDate,
              allDay: r.allDay,
              classNames: ['calendar-done'],
            }
            store.dispatch('pushCalendarData', cal)
            calendarApi.batchRendering(function() {
              calendarApi.addEvent(cal)
            })
          } else {
            const cal = {
              cid: r.cid,
              completed: r.completed,
              title: r.title,
              content: r.content,
              start: r.startDate + 'T' + r.startTime,
              end: r.endDate + 'T' + r.endTime,
              color: r.color,
              placeName: r.placeName,
              placeLat: r.placeLat,
              placeLng: r.placeLng,
              allDay: r.allDay,
              startDate: r.startDate,
              endDate: r.endDate,
            }
            store.dispatch('pushCalendarData', cal)

            calendarApi.batchRendering(function() {
              calendarApi.addEvent(cal)
            })
          }
          store.dispatch('refreshCalendarData', calendarApi.getEvents())
          hide()
        })
    }

    const startMap = () => {
      if ('geolocation' in navigator) {
        /* geolocation 사용 가능 */
        navigator.geolocation.getCurrentPosition(
          function(data) {
            var latitude = data.coords.latitude
            var longitude = data.coords.longitude

            state.latitude = latitude
            state.longitude = longitude
          },
          function(error) {
            alert(error)
          },
          {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0,
          }
        )
      } else {
        /* geolocation 사용 불가능 */
        alert('geolocation 사용 불가능')
      }
    }

    const findWayCar = () => {
      // axios.get(`http://k5d105.p.ssafy.io:5000/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?steps=true`)
      axios
        .get(
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${state.longitude},${state.latitude};${state.mData.ModalDate.extendedProps.placeLng},${state.mData.ModalDate.extendedProps.placeLat}?steps=true`
        )
        .then((response) => {
          const data = []
          let idCount = 1

          response.data.routes.forEach((res) => {
            res.legs.forEach((r) => {
              data.push({
                instanceId: idCount,
                distance: r.distance,
                duration: r.duration,
                steps: r.steps,
              })
              idCount = idCount + 1
            })
          })
          state.curWay = data
          state.isWay = 'car'

          choiceWay(state.curWay[0], state.isWay)
          // console.log(state.curWay)
        })
    }

    const choiceWay = (course, way) => {
      const data = []
      course.steps.forEach((element) => {
        element.intersections.forEach((ele) => {
          data.push([ele.location[1], ele.location[0]])
        })
      })

      if (way === 'foot') {
        state.curFootCourse = data
      } else if (way === 'car') {
        state.curDriveCourse = data
      }
    }

    const handleMapView = () => {
      state.isMap = !state.isMap

      if (state.isMap) {
        startMap()
        findWayCar()
      }
    }

    const state = reactive({
      mData: computed(() => store.getters.getModalDataFormat),
      calendar: computed(() => store.state.calAPI),
      dialogVisible: ref(false),
      isBig: true,
      isMap: false,
      zoom: 15,
      latitude: 1.2,
      longitude: 1.3,
      curWay: [],
      isWay: '',
      curDriveCourse: [],
    })
    return {
      isOpen,
      hide,
      show,
      modalPut,
      state,
      delEvent,
      calData,
      modalSuccess,
      startMap,
      findWayCar,
      handleMapView,
    }
  },
  data() {
    return {}
  },
}
</script>

<style>
.modal {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 1000vh;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #ffffff;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
}

.modal-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content-color {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content-body > span {
  color: #7e8183;
}

.modal-content-color-box {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 20%;
}

.modal-content-body-contents-row {
  margin-bottom: 1rem;
}

.modal-content-body-contents-row-icon-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content-body-contents-document-icon-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.modal-content-small-color-box {
  height: 30px;
  width: 100%;
  border-radius: 0.5rem;
}

.modalIcon {
  padding: 10px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.5rem;
  font-weight: bold;
}

@media screen and (min-width: 1200px) {
  .modal-content {
    width: 900px;
    height: 700px;
  }

  .modal-content-body-contents-map {
    height: 300px;
  }
}

@media screen and (max-width: 1199px) and (min-width: 993px) {
  .modal-content {
    width: 900px;
    height: 700px;
  }
  .modal-content-body-contents-map {
    height: 300px;
  }
}

@media screen and (max-width: 992px) and (min-width: 768px) {
  .modal-content {
    width: 700px;
  }
  .modal-content-body-contents-map {
    height: 200px;
  }
}

@media screen and (max-width: 767px) and (min-width: 500px) {
  .modal-content {
    width: 450px;
  }
  .modal-content-body-contents-map {
    height: 200px;
  }
}

@media screen and (max-width: 499px) {
  .modal-content {
    width: 380px;
  }
  .modal-content-body-contents-map {
    height: 150px;
  }
}
</style>
