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
                    v-if="
                      checkPartipants() &&
                        state.mData.ModalDate.extendedProps.completed
                    "
                    class="el-icon-refresh-left modalIcon"
                    @click="modalSuccess"
                  ></i>
                  <i
                    v-if="
                      checkPartipants() &&
                        !state.mData.ModalDate.extendedProps.completed
                    "
                    class="el-icon-check modalIcon"
                    @click="modalSuccess"
                  ></i>

                  <i
                    v-if="checkWriter()"
                    class="el-icon-edit modalIcon"
                    @click="modalPut"
                  ></i>

                  <i
                    v-if="checkWriter()"
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
                v-if="
                  checkPartipants() &&
                    state.mData.ModalDate.extendedProps.completed
                "
                class="el-icon-refresh-left modalIcon"
                @click="modalSuccess"
              ></i>
              <i
                v-if="
                  checkPartipants() &&
                    !state.mData.ModalDate.extendedProps.completed
                "
                class="el-icon-check modalIcon"
                @click="modalSuccess"
              ></i>

              <i
                v-if="checkWriter()"
                class="el-icon-edit modalIcon"
                @click="modalPut"
              ></i>

              <i
                v-if="checkWriter()"
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
            <el-button
              v-if="!state.isMap"
              @click="handleGroupMapView()"
              type="info"
              >경로보기</el-button
            >
            <el-button
              v-if="state.isMap"
              @click="handleGroupMapView()"
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

        <el-row class="modal-content-body-contents-row">
          <el-col :span="1">
            <div class="modal-content-body-contents-row-icon-wrap">
              <el-icon><User /></el-icon>
            </div>
          </el-col>
          <el-col :span="22" :offset="1" class="modal-content-body-participant">
            <div
              v-for="par in state.mData.ModalDate.extendedProps.participant"
              :key="par.uid"
              class="modal-content-body-participant-element"
            >
              <el-button v-if="par.completed" size="mini" type="info" plain>
                {{ par.nickname }}
              </el-button>
              <el-button v-if="!par.completed" size="mini">
                {{ par.nickname }}
              </el-button>
            </div>
          </el-col>
        </el-row>

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
          <el-button v-if="checkWriter()" type="danger" @click="delEvent"
            >삭제</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, reactive, ref, onBeforeMount, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
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
import {
  Calendar,
  Location,
  Document,
  User,
  FolderOpened,
} from '@element-plus/icons'

export default {
  components: {
    Calendar,
    Location,
    Document,
    User,
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPolyline,
    FolderOpened,
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const fullCalendar = ref(null)
    const isOpen = ref(false)

    onBeforeMount(() => {
      startMap()

      window.addEventListener('resize', handleGroupModalWindowSize)
      handleGroupModalWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupModalWindowSize)
    })

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
      if (!checkWriter()) {
        alert('일정을 수정할수 있는 권한이 없습니다.')
        router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
      } else {
        router.push({
          name: 'GroupCalendarPutSchedule',
          query: { gid: route.query.gid },
        })
      }
    }

    const delEvent = () => {
      if (!checkWriter()) {
        alert('일정을 삭제할수 있는 권한이 없습니다.')
        router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
      } else {
        state.dialogVisible = false
        // 삭제 axios 요청
        axios
          .delete(
            'https://k5d105.p.ssafy.io:3030/groupCalendar/deleteCalendar',
            {
              data: {
                uid: localStorage.getItem('uid'),
                cid: state.mData.ModalDate.extendedProps.cid,
                gid: route.query.gid,
              },
              headers: {
                authorization: localStorage.getItem('token'),
                FCMtoken: localStorage.getItem('FCMtoken'),
              },
            }
          )
          .then(() => {
            state.mData.ModalDate.remove()
            hide()
          })
      }
    }

    const modalSuccess = function() {
      if (!checkPartipants()) {
        alert('일정을 완료할수 있는 권한이 없습니다.')
        router.push({ name: 'GroupCalendar', query: { gid: route.query.gid } })
      } else {
        axios
          .put(
            'https://k5d105.p.ssafy.io:3030/groupCalendar/checkCalendar',
            {
              uid: localStorage.getItem('uid'),
              cid: state.mData.ModalDate.extendedProps.cid,
              gid: route.query.gid,
            },
            {
              headers: {
                authorization: localStorage.getItem('token'),
              },
            }
          )
          .then((response) => {
            let calendarApi = state.calendar.getApi()
            store.dispatch(
              'deleteGroupCalendarData',
              state.mData.ModalDate.extendedProps.cid
            )
            state.mData.ModalDate.remove()
            const r = response.data.calendar
            let checkCompleted = false
            for (let par of r.participant) {
              if (par.uid === localStorage.getItem('uid')) {
                if (par.completed) {
                  checkCompleted = true
                }
                break
              }
            }
            if (checkCompleted) {
              const cal = {
                cid: r.cid,
                gid: r.gid,
                completed: true,
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
                classNames: ['calendar-done'],
                participant: r.participant,
                creator: r.creator,
                allDay: r.allDay,
              }
              store.dispatch('pushGroupCalendarData', cal)
              calendarApi.batchRendering(function() {
                calendarApi.addEvent(cal)
              })
            } else {
              const cal = {
                cid: r.cid,
                gid: r.gid,
                completed: false,
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
                participant: r.participant,
                creator: r.creator,
                allDay: r.allDay,
              }
              store.dispatch('pushGroupCalendarData', cal)

              calendarApi.batchRendering(function() {
                calendarApi.addEvent(cal)
              })
            }
            store.dispatch('refreshGroupCalendarData', calendarApi.getEvents())
            hide()
          })
      }
    }

    const checkWriter = () => {
      if (state.mData) {
        if (
          localStorage.getItem('uid') ===
          state.mData.ModalDate.extendedProps.creator
        ) {
          return true
        } else {
          return false
        }
      }
      return false
    }

    const checkPartipants = () => {
      if (state.mData) {
        const parts = state.mData.ModalDate.extendedProps.participant
        const res = parts.find((p) => p.uid === localStorage.getItem('uid'))
        if (res === undefined) {
          // 없다
          return false
        } else {
          return true
        }
      }
      return false
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

    const handleGroupMapView = () => {
      state.isMap = !state.isMap

      if (state.isMap) {
        startMap()
        findWayCar()
      }
    }

    const state = reactive({
      mData: computed(() => store.getters.getGroupModalDataFormat),
      calendar: computed(() => store.state.groupCalAPI),
      dialogVisible: ref(false),
      isAuthority: computed(
        () =>
          localStorage.getItem('uid') ===
          state.mData.ModalDate.extendedProps.creator
      ),
      writer: false,
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
      checkWriter,
      checkPartipants,
      startMap,
      handleGroupMapView,
    }
  },
  data() {
    return {}
  },
}
</script>

<style>
.modal-content-body-participant {
  display: flex;
  flex-flow: wrap;
}

.modal-content-body-participant-element {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
