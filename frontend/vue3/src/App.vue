<template>
  <div v-if="info.size" style="height: 100vh;display: inline;">
    <!-- id="nav" -->

    <div v-if="info.userId" class="icon-bar">
      <div class="parent">
        <div
          class="child"
          style="margin: 50px 0 20px 10%; text-align: left; font-size:20px;"
        >
          {{ info.userId }} 님
        </div>
        <button
          class="whiteBtn"
          @click="logout"
          type="button"
          style="width: 80%;height: 25px;margin-bottom: 50px; cursor:pointer;"
        >
          Logout
        </button>
        <!-- <div
          class="child"
          @click="logout"
          style="cursor:pointer; color: white; flex:1; "
        >
          Logout
        </div> -->
        <!-- <p @click="logout" style="cursor:pointer; color: white; font-size: 20px; margin-bottom: 5px;">Logout</p> -->
      </div>
      <!-- <router-link to="/main">Login</router-link>  -->
      <!-- <router-link to="/newgroup">New Group</router-link>  -->
      <router-link
        to="/calendar"
        style="text-align: left;margin-left: 10%; margin-bottom: 10px;"
        >Calendar</router-link
      >
      <!-- <router-link to="/schedule">Schedule</router-link>  -->
      <router-link
        to="/chart"
        style="text-align: left;margin-left: 10%;margin-bottom: 10px;"
        >Chart</router-link
      >

      <router-link
        to="/searchGroup"
        style="text-align: left;margin-left: 10%;margin-bottom: 10px;"
        >Group</router-link
      >
      <!-- <p class="group-p" style=":not(:hover)">Group</p> -->
      <!-- <i class="bi bi-gear-fill"></i> -->

      <div>
        <ul style="padding:0;">
          <li
            v-for="groupList in info.groupLists"
            :key="groupList.gid"
            style="list-style: none; padding-bottom : 13px"
          >
            <div style="text-align: left;margin-left: 20%;">
              <p
                @click="TogroupCallendar(groupList.gid)"
                style="display:inline; cursor:pointer;"
              >
                {{ groupList.name }}
              </p>
              <!-- <a @click="TogroupCallendar(groupList.gid)">{{ groupList.name }}</a> -->

              <svg
                @click="ToGroup(groupList.gid)"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                class="bi bi-gear-fill"
                viewBox="0 0 16 16"
                style="cursor:pointer;  margin-right:10px; float: right; margin-top: 8px;"
              >
                <path
                  d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                />
              </svg>
              <span
                @click="handleToGChart(groupList.gid)"
                style="float: right; margin-right:5%; cursor:pointer;"
                >📊</span
              >
            </div>
          </li>
        </ul>
      </div>
      <!-- <button @click="logout" class="logoutButton">logout</button> -->
    </div>
    <!-- <div v-else>
      <router-link to="/">Login</router-link>
    </div> -->
  </div>

  <div v-else>
    <div v-if="info.userId">
      <el-dropdown
        class="list-button"
        style="text-align: left; min-width:355px;"
      >
        <el-button btn-sm style="margin: 5% 0 0 2%; border:none;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-394d1fd8=""
            style="width:20px; "
          >
            <path
              fill="currentColor"
              d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32H608zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H160zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32H608z"
            ></path>
          </svg>
        </el-button>
        <h1 style="display: inline-block; float:right; margin:7% 7% 0 0;">
          Dobby
        </h1>

        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item><router-link to="/newgroup">New Group</router-link> </el-dropdown-item> -->
            <el-dropdown-item
              ><router-link
                to="/calendar"
                style="text-decoration:none; color:black; font-size:20px; height: 40px;line-height: 2;"
                >Calendar</router-link
              >
            </el-dropdown-item>
            <!-- <el-dropdown-item><router-link to="/schedule">Schedule</router-link> </el-dropdown-item> -->
            <el-dropdown-item
              ><router-link
                to="/chart"
                style="text-decoration:none; color:black; font-size:20px;height: 40px;line-height: 2;"
                >Chart</router-link
              >
            </el-dropdown-item>
            <el-dropdown-item
              ><router-link
                to="/searchGroup"
                style="text-decoration:none; color:black; font-size:20px;height: 40px;line-height: 2;"
                >Group</router-link
              >
            </el-dropdown-item>
            <div>
              <ul style="padding:0 30px;">
                <li
                  v-for="groupList in info.groupLists"
                  :key="groupList.gid"
                  style="list-style: none;"
                >
                  <div
                    class="mobGroupName"
                    style="width:100%; height:30px; line-height:2; font-size:15px; padding:5px;"
                  >
                    <p
                      @click="TogroupCallendar(groupList.gid)"
                      style="display:inline; cursor:pointer;"
                    >
                      {{ groupList.name }}
                    </p>
                    <!-- <a @click="TogroupCallendar(groupList.gid)">{{ groupList.name }}</a> -->
                    <svg
                      @click="ToGroup(groupList.gid)"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="currentColor"
                      class="bi bi-gear-fill"
                      viewBox="0 0 16 16"
                      style="cursor:pointer; float:right; margin: 10px 0 0 10px;"
                    >
                      <path
                        d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                      />
                    </svg>
                    <span
                      @click="handleToGChart(groupList.gid)"
                      style=" margin-right:1%; cursor:pointer;float:right;"
                      >📊</span
                    >
                  </div>
                </li>
              </ul>
            </div>
            <el-dropdown-item
              ><div style="margin-top:50px; ">
                <button
                  class="blueBtn"
                  @click="logout"
                  type="button"
                  style="width:100%; height:25px; cursor:pointer;"
                >
                  Logout
                </button>
              </div>
              <!-- <p @click="logout" style="cursor:pointer;">logout</p> -->
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div v-else>
      <!-- <el-dropdown-item
        ><router-link to="/group">Group</router-link>
      </el-dropdown-item> -->
    </div>
  </div>

  <!-- <div class="teleport-modal">
    <teleportExample />
  </div> -->

  <div class="routerView">
    <router-view />
  </div>
</template>

<script>
// teleport
// import teleportExample from '@/components/teleport/teleportExample'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { reactive, onBeforeMount } from 'vue'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import firebaseConfig from '../firebaseConfig'
import firebase from 'firebase/compat/app'
import { ElNotification } from 'element-plus'

export default {
  components: {
    // teleportExample,
  },
  setup() {
    const router = useRouter()

    // user 정보
    const info = reactive({
      userId: '',
      size: true,
      groupLists: [],
      gid: '',

    })

    const firebaseApp = firebase.initializeApp(firebaseConfig)
    const messaging = getMessaging(firebaseApp)

    getToken(messaging, {
      vapidKey:
        'BE5n2nc_3FLKh9U_gkhPTcpe3NMimxEcUBAdriZG1dk3arXlOWRFhg3-6U6sIVa1cVMJbVI236v93OMMKQf0jy0',
    })
      .then((currentToken) => {
        if (currentToken) {
          localStorage.setItem('FCMtoken', currentToken)
        } else {
          console.log(
            'No Instance ID token available. Request permission to generate one.'
          )
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
      })
    onMessage(messaging, function(payload) {
      ElNotification({
        title: 'Success',
        message: payload.notification.body,
        type: 'success',
      })
      reload()
    })

    onBeforeMount(() => {
      // if (localStorage.getItem('token')) {
      axios
        .get('https://k5d105.p.ssafy.io:3030/users/getUserInfo', {
          params: { uid: localStorage.getItem('uid') },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          info.userId = response.data.user.nickname
        })

      // groupLists
      axios
        .get('https://k5d105.p.ssafy.io:3030/groupCalendar/getGroup', {
          params: { uid: localStorage.getItem('uid') },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          info.groupLists = response.data.group
        })

      if (window.innerWidth < 730) {
        info.size = false
      }
    })

    window.addEventListener(
      'resize',
      function() {
        if (window.innerWidth < 730) {
          info.size = false
        } else {
          info.size = true
        }
      },
      true
    )

    // 로그아웃
    const logout = function() {
      axios
        .post(
          'https://k5d105.p.ssafy.io:3030/users/logout',
          {
            idToken: localStorage.getItem('token'),
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('uid')
          localStorage.removeItem('FCMtoken')
          location.replace('/')
        })
        .catch((err) => {
          if (err.response.status === 403) {
            alert('로그인이 만료되었습니다')
            location.replace('/')
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
          }
        })
    }

    const ToGroup = function(gid) {
      router.push({
        name: 'GroupInfo',
        params: { gid: gid },
      })
    }

    const TogroupCallendar = function(gid) {
      router.push({ name: 'GroupCalendar', query: { gid: gid } })
    }

    const handleToGChart = function(gid) {
      router.push({
        name: 'groupChart',
        params: { gid: gid },
      })
    }

    const reload = function() {
      setTimeout(function() {
        router.go()
      }, 2000)
    }

    return { info, logout, ToGroup, TogroupCallendar, handleToGChart }
  },
}
</script>

<style>
html,
body,
#app {
  height: 150vh;
  margin: 0;
}

#app {
  font-family: 'Dongle', sans-serif serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.routerView {
  display: table-cell;
  width: 100vw;
  height: 90vh;
  vertical-align: middle;
  text-align: center;
  padding-top: 50px;
}

@font-face {
  font-family: 'Godo';
  font-style: normal;
  font-weight: 400;
  src: url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoM.woff2')
      format('woff2'),
    url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoM.woff')
      format('woff');
}

* {
  font-family: 'Godo' !important;
}

.logoutButton {
  position: fixed;
  bottom: 0;
  left: 0;
}

/* 사이드바 */
.icon-bar {
  height: 150%;
  width: 20vw;
  float: left;
  background-color: #a9c9de;
  /* position: -webkit-sticky;  */
  /* top: 0;
  left: 0; */

  overflow-x: hidden; 
  padding-top: 0;
  max-width: 280px;
  min-width: 212px;
}

.icon-bar a {
  display: block;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 5px;
  transition: all 0.3s ease;
  color: white;
  font-size: 23px;
}

.group-p {
  display: block;
  text-align: center;
  padding: 10px;
  transition: all 0.3s ease;
  color: white;
  font-size: 20px;
}

/* .icon-bar { fontSize: 1rem !important; } */

.icon-bar a:hover {
  background-color: #deb4b4;
}

.active {
  background-color: #5eaf13;
}

.list-button {
  display: block;
  width: 100%;
}

.el-icon-notebook-2 {
  font-size: 1.5rem;
}

.icon-bar a {
  text-decoration: none;
}

.icon-bar p:hover {
  background-color: #deb4b4;
}

.icon-bar svg:hover {
  background-color: #deb4b4;
}

.mulit-line-ellipsis:before {
  content: '...';
  position: absolute;
  right: 0;
  bottom: 0;
}
.el-popper.is-pure {
  width: 90%;
  overflow-x: auto;
  overflow-y: hidden;
}

.mobGroupName:hover {
  background-color: #ecf5ff;
}
/* @media (max-width: 1086px) {
  svg {
    display: none;
  }
} */

/* @media screen and (max-width: 730px) {
  .icon-bar {
    display: none;
  }
} */
</style>
