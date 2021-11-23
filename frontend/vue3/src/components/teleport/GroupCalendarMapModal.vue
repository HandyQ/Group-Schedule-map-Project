<template>
  <div class="modal" v-if="isOpen && state.isBig">
    <el-card class="box-card modal-map-content">
      <el-container>
        <el-header>
          <el-row class="modal-map-content-row">
            <el-col :span="24">
              <div class="modal-content-header">
                <div></div>
                <div>
                  <i class="el-icon-place modalIcon" v-if="state.curDriveCourse || state.curFootCourse" @click="hide"></i>
                  <!-- <el-icon><place /></el-icon> -->
                  <i class="el-icon-close modalIcon" @click="hide"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-header>

        <el-container>
          <el-aside class="modal-map-content-side">
            <el-row class="modal-map-content-row">
              <el-col>
                <div class="modal-map-content-way-button"> 
                  <el-button @click="findWayWalking" type="primary" plain>도보</el-button>
                  <el-button @click="findWayCar" type="success" plain>차량</el-button>
                </div>
              </el-col>
              <el-col>
                <el-scrollbar height= "400px">
                  <el-card v-for="way in state.curWay" :key="way.instanceId" @click="choiceWay(way, state.isWay)" class="box-card modal-map-content-way-card">
                    <template #header>
                      <div class="card-header">
                        <span>경로 {{way.instanceId}}</span>
                      </div>
                    </template>
                    <div>
                      <div class="modal-map-content-way-card-info">
                        <div>
                          <el-icon><bicycle /></el-icon> 
                        </div>
                        <span>
                          {{ changeDistance(way.distance) }}                    
                        </span>
                      </div>
                      <div class="modal-map-content-way-card-info">
                        <div>
                          <el-icon><Timer /></el-icon>
                        </div>
                        <span>
                          {{ changeSeconds(way.duration) }}
                        </span>
                      </div>
                    </div>
                  </el-card>
                </el-scrollbar>
              </el-col>
            </el-row>
          </el-aside>

          <el-main>
              <div 
                v-if="state.goal.Lat"
                class="modal-map">
                <l-map
                  v-model="state.zoom"
                  v-model:zoom="state.zoom"
                  ref="groupMap"
                  :center="[ state.latitude, state.longitude ]">

                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                  </l-tile-layer>
                  <l-control-layers />

                  <!-- start -->
                  <l-marker :lat-lng="[state.latitude, state.longitude]" draggable>
                    <l-tooltip>
                      start
                    </l-tooltip>
                  </l-marker>

                  <!-- end -->
                  <l-marker
                    :lat-lng="[state.goal.Lat, state.goal.Lng]">
                    <l-tooltip>
                      end
                    </l-tooltip>
                  </l-marker>

                  <l-polyline
                    v-if="state.isWay === 'foot' && state.curFootCourse.length > 0"
                    :lat-lngs="state.curFootCourse"
                    color="blue">
                  </l-polyline>

                  <l-polyline
                    v-if="state.isWay === 'car' && state.curDriveCourse.length > 0"
                    :lat-lngs="state.curDriveCourse"
                    color="green">
                  </l-polyline>

                </l-map>
              </div>

          </el-main>
        </el-container>
      </el-container>    
    </el-card>
  </div>

  <!-- small -->
  <div class="modal" v-if="isOpen && !state.isBig">
    <el-card class="box-card modal-map-content-small">
      <el-container>
        <el-header>
            <el-row class="modal-map-content-row">
              <el-col :span="24">
                <div class="modal-content-header">
                  <div></div>
                  <div>
                    <i class="el-icon-place modalIcon" v-if="state.curDriveCourse || state.curFootCourse" @click="hide"></i>
                    <i class="el-icon-close modalIcon" @click="hide"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
        </el-header>

        <el-scrollbar height="400px">
          <el-main>
            <div 
              v-if="state.goal.Lat"
              class="modal-map-small">
              <l-map
                v-model="state.zoom"
                v-model:zoom="state.zoom"
                ref="userMap"
                :center="[ state.latitude, state.longitude ]">

                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                </l-tile-layer>
                <l-control-layers />

                <!-- start -->
                <l-marker :lat-lng="[state.latitude, state.longitude]" draggable>
                  <l-tooltip>
                    start
                  </l-tooltip>
                </l-marker>

                <!-- end -->
                <l-marker
                  :lat-lng="[state.goal.Lat, state.goal.Lng]">
                  <l-tooltip>
                    end
                  </l-tooltip>
                </l-marker>

                <l-polyline
                  v-if="state.isWay === 'foot' && state.curFootCourse.length > 0"
                  :lat-lngs="state.curFootCourse"
                  color="blue">
                </l-polyline>

                <l-polyline
                  v-if="state.isWay === 'car' && state.curDriveCourse.length > 0"
                  :lat-lngs="state.curDriveCourse"
                  color="green">
                </l-polyline>

              </l-map>
            </div>
          </el-main>

          <el-footer>
              <el-row class="modal-map-content-row">
                <el-col>
                  <div class="modal-map-content-way-button"> 
                    <el-button @click="findWayWalking" type="primary" plain>도보</el-button>
                    <el-button @click="findWayCar" type="success" plain>차량</el-button>
                  </div>
                </el-col>
                <el-col>
                  <el-scrollbar height= "400px">
                    <el-card v-for="way in state.curWay" :key="way.instanceId" @click="choiceWay(way, state.isWay)" class="box-card modal-map-content-way-card">
                      <template #header>
                        <div class="card-header">
                          <span>경로 {{way.instanceId}}</span>
                        </div>
                      </template>
                      <div>
                        <div class="modal-map-content-way-card-info">
                          <div>
                            <el-icon><bicycle /></el-icon> 
                          </div>
                          <span>
                            {{ changeDistance(way.distance) }}                    
                          </span>
                        </div>
                        <div class="modal-map-content-way-card-info">
                          <div>
                            <el-icon><Timer /></el-icon>
                          </div>
                          <span>
                            {{ changeSeconds(way.duration) }}
                          </span>
                        </div>
                      </div>
                    </el-card>
                  </el-scrollbar>
                </el-col>
              </el-row>
          </el-footer>
        </el-scrollbar>
      </el-container>
    </el-card>
  </div>



</template>
<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPolyline,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { computed, onBeforeMount, onUnmounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

//icons
import { Bicycle, Timer } from '@element-plus/icons'

export default {
  name: 'CalendarMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPolyline,
    Bicycle,
    Timer,
  },
  setup() {

    const store = useStore()
    
    const isOpen = ref(false)
    const groupMap = ref(null)

    const hide = () => {
      isOpen.value = false;
      state.curWay = []
      state.curFootCourse =  []
      state.curDriveCourse =  []
      state.isWay = ''
    };

    const check = () => {
      isOpen.value = false;
      state.curWay = []
      state.curFootCourse =  []
      state.curDriveCourse =  []
      state.isWay = ''
    }

    const show = () => {
      isOpen.value = true;
    };

    onBeforeMount(() => {
      startMap()

      window.addEventListener('resize', handleGroupMapModalWindowSize)
      handleGroupMapModalWindowSize()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleGroupMapModalWindowSize)
    })

    const changeDistance = (dis) => {
      if ( dis >= 1000) {
        const km = dis / 1000 
        return `${km.toFixed(2)} Km`
      } else {
        return `${dis} m`
      }
    }

    const changeSeconds = (seconds) => {
      let hour = parseInt(seconds/3600) 
      let min = parseInt((seconds%3600)/60)
      let sec = seconds%60
      
      if ( hour == 0 && min == 0 ) {
        return '너무 가깝습니다'
      }
      if (hour == 0) {
        if (sec >= 30) {
          return `${min + 1}분`
        } else {
          return `${min}분`
        }
      } else {
        return `${hour}시 ${min}분`
      }
    }

    const handleGroupMapModalWindowSize = () => {
      if (window.innerWidth > 767) {
        state.isBig = true
      } else {
        state.isBig = false
      }
    }

    const startMap = () => {
      if ("geolocation" in navigator) {	/* geolocation 사용 가능 */
        navigator.geolocation.getCurrentPosition(function(data) {
			
          var latitude = data.coords.latitude;
          var longitude = data.coords.longitude;
				
          state.latitude = latitude
          state.longitude = longitude
        }, function(error) {
          alert(error);
        }, {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0
      });
      } else {	/* geolocation 사용 불가능 */
        alert('geolocation 사용 불가능');
      }
    }

    const findWayWalking = () => {
      // axios.get(`http://k5d105.p.ssafy.io:5010/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?steps=true`)
      axios.get(`https://routing.openstreetmap.de/routed-foot/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?alternatives=true&steps=true`)
        .then((response) => {
          // console.log(response.data.routes)

          const data = [];
          let idCount = 1;

          response.data.routes.forEach((res) => {
            res.legs.forEach((r) => {
              data.push({
                instanceId : idCount,
                distance: r.distance,
                duration: r.duration,
                steps: r.steps
              })
              idCount = idCount + 1
            });
          });

          state.curWay = data
          state.isWay = 'foot'
        })
    }

    const findWayCar = () => {
      // axios.get(`http://k5d105.p.ssafy.io:5000/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?steps=true`)
      axios.get(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${state.longitude},${state.latitude};${state.goal.Lng},${state.goal.Lat}?alternatives=true&steps=true`)
        .then((response) => {

          const data = [];
          let idCount = 1;

          response.data.routes.forEach((res) => {
            res.legs.forEach((r) => {
              data.push({
                instanceId : idCount,
                distance: r.distance,
                duration: r.duration,
                steps: r.steps
              })
              idCount = idCount + 1
            });
          });
          state.curWay = data
          state.isWay = 'car'
          // console.log(state.curWay)
        })
    }

    const choiceWay = (course, way) => {

      const data = [];
      course.steps.forEach((element) => {
        element.intersections.forEach((ele) => {
          data.push([ele.location[1], ele.location[0]] )
        });
      });

      if (way === 'foot') {
        state.curFootCourse = data
      } else if ( way === 'car') {
        state.curDriveCourse = data
      }
      store.dispatch('setGroupMapModalChoice', {
        distance: changeDistance(course.distance),
        duration: changeSeconds(course.duration)
      })
      // console.log(state.curCourse)
    }


    const state = reactive({
      isBig: false,
      latitude: 1.2,
      longitude: 1.3,
      goal: computed(() => store.state.GroupCalendarMapGoal),
      zoom: 15,
      curWay: [],
      curFootCourse: [],
      curDriveCourse: [],
      isWay: '',
    })

    return {
      state,
      isOpen,
      hide,
      check,
      show,
      findWayWalking,
      findWayCar,
      groupMap,
      choiceWay,
      changeDistance,
      changeSeconds,
    }
  }
};
</script>

<style>

  .modal-map {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-map-content {
    background-color: #ffffff;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
  }

  .modal-map-content-row {
    margin-bottom: 1rem;
  }

  .modal-map-content-way-button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .modal-map-content-way-card-info {
    display: flex;
    justify-content: space-between;
    align-content: center !important;
  }

  @media screen and (min-width: 1200px) {
    .modal-map {
      width: 650px;
      height: 500px;
    }

    .modal-map-content {
      width: 900px;
      height: 700px;
    }

    .modal-map-content-side {
      width: 200px !important;
    }

    .modal-map-content-way-card {
      width : 180px;
      margin: 0 auto;
    }

  }

  @media screen and (max-width: 1199px) and (min-width: 993px) {
    .modal-map {
      width: 650px;
      height: 500px;
    }

    .modal-map-content {
      width: 900px;
      height: 700px;
    }

    .modal-map-content-side {
      width: 200px !important;
    }
  }

  @media screen and (max-width: 992px) and (min-width: 768px) {
    .modal-map {
      width: 500px;
      height: 500px;
    }
    .modal-map-content {
      width: 700px;
      height: 600px;
    }

    .modal-map-content-side {
      width: 150px !important;
    }
  }

  @media screen and (max-width: 767px) and (min-width: 500px) {
    .modal-map {
      width: 400px;
      height: 300px;
    }
    
    .modal-map-content {
      width: 450px;
      height: 350px;
    }
    
  }

  @media screen and (max-width: 499px) {
    .modal-map {
      width: 330px;
      height: 270px;
    }

    .modal-map-content {
      width: 380px;
      height: 300px;
    }
  }
</style>