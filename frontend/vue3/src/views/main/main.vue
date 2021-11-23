<template>
  <div class="main">
    <el-dialog v-model="info.dialogVisible">
      <span>{{ info.message }}</span>
    </el-dialog>
    <div class="mainDiv" v-if="info.size">
      <img
        src="https://cdn.notefolio.net/img/4a/68/4a68c7b7158baee7602cedc5aef9c2fe42a5f680689f55b250107789f7c531b6_v1.jpg"
        alt="logo"
      />
      <button class="mainLogin blueBtn" style="float: right" @click="login">
        로그인
      </button>
      <div class="mainLoginDiv">
        <div>
          <span>Email</span>
          <input
            class="input"
            type="text"
            v-model="info.userEmail"
            @keyup.enter="login"
          />
        </div>
        <div>
          <span>PW</span>
          <input
            class="input"
            type="password"
            v-model="info.userPw"
            @keyup.enter="login"
          />
          <br />
          <router-link class="mainFind" to="/find"
            ><span>이메일/비밀번호 찾기</span></router-link
          >
        </div>
      </div>
      <div class="mainSocialLeft" @click="facebookSignIn">
        <img src="@/assets/facebook.png" alt="" />
        <span>페이스북 로그인</span>
      </div>
      <div class="mainSocialRight">
        <img src="@/assets/google.png" alt="" />
        <div class="g-signin2" @click="googleSignIn">
          <span>구글 로그인</span>
        </div>
      </div>

      <router-link to="/selectsignup"
        ><button class="mainSign blueBtn">회원가입</button></router-link
      >
    </div>

    <div class="mainMobile" v-else>
      <img
        style="width: 47%; border-radius:4px;"
        src="https://cdn.notefolio.net/img/4a/68/4a68c7b7158baee7602cedc5aef9c2fe42a5f680689f55b250107789f7c531b6_v1.jpg"
        alt="logo"
      />
      <div class="mainMobLogin">
        <input
          class="input"
          type="text"
          placeholder="Email"
          v-model="info.userEmail"
          @keyup.enter="login"
        />
        <br />
        <input
          class="input"
          type="password"
          placeholder="PW"
          v-model="info.userPw"
          @keyup.enter="login"
        />
        <br />
        <div class="mainMobFind">
          <router-link to="/find"><p>이메일/비밀번호 찾기</p></router-link>
        </div>
        <br />
        <button class="blueBtn" @click="login">로그인</button>
      </div>
      <!-- <div class="mainMobSocialLogin">
        <div @click="facebookSignIn">
          <img src="@/assets/facebook.png" alt="" /><span style="font-size:15px"
            >페이스북 로그인</span
          >
        </div>
        <br />
        <div @click="googleSignIn">
          <img src="@/assets/google.png" alt="" />
          <span style="font-size:15px">구글 로그인</span>
        </div>
      </div> -->
      <div class="mainMobSign">
        <h3>아직 회원이 아니신가요?</h3>
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { onBeforeMount } from '@vue/runtime-core'
import axios from 'axios'
import firebase from 'firebase/compat/app'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import firebaseConfig from '../../../firebaseConfig'
import { useRouter } from 'vue-router'
import './main.css'

export default {
  name: 'main',
  methods: {
    googleSignIn() {
      firebase.initializeApp(firebaseConfig)
      const provider = new GoogleAuthProvider()
      const auth = getAuth()

      signInWithPopup(auth, provider)
        .then((res) => {
          const token = res._tokenResponse.idToken
          const uid = res.user.uid
          localStorage.setItem('token', token)
          localStorage.setItem('uid', uid)
          axios
            .post(
              'https://k5d105.p.ssafy.io:3030/users/checkUserProvider',
              {
                uid: uid,
              },
              {
                headers: { FCMtoken: localStorage.getItem('FCMtoken') },
              }
            )
            .then((res) => {
              if (res.data.msg === '이미 등록된 회원입니다.') {
                location.replace('/calendar')
              } else {
                localStorage.removeItem('token', token)
                localStorage.removeItem('uid', uid)
                location.replace('/welcome')
              }
            })
        })
        .catch((err) => {
          const errorCode = err.code
          if (errorCode === 'auth/popup-blocked') {
            alert('팝업이 차단되었습니다')
          }
        })
    },
    facebookSignIn() {
      firebase.initializeApp(firebaseConfig)
      const provider = new FacebookAuthProvider()
      const auth = getAuth()
      signInWithPopup(auth, provider)
        .then((res) => {
          const uid = res.user.uid
          const token = res._tokenResponse.idToken

          localStorage.setItem('token', token)
          localStorage.setItem('uid', uid)
          axios
            .post(
              'https://k5d105.p.ssafy.io:3030/users/checkUserProvider',
              {
                uid: uid,
              },
              {
                headers: { FCMtoken: localStorage.getItem('FCMtoken') },
              }
            )
            .then((res) => {
              if (res.data.msg === '이미 등록된 회원입니다.') {
                location.replace('/calendar')
              } else {
                localStorage.removeItem('token', token)
                localStorage.removeItem('uid', uid)
                location.replace('/welcome')
              }
            })
        })
        .catch((err) => {
          const errorCode = err.code
          if (errorCode === 'auth/popup-blocked') {
            alert('팝업이 차단되었습니다')
          }
        })
    },
  },
  setup() {
    const router = useRouter()

    const info = reactive({
      size: true,
      userEmail: '',
      userPw: '',
      dialogVisible: false,
      message: '',
    })

    if (localStorage.getItem('token')) {
      axios
        .post(
          'https://k5d105.p.ssafy.io:3030/token/checkToken',
          {},
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then(() => {
          router.push({ name: 'Calendar' })
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('uid')
        })
    }

    onBeforeMount(() => {
      if (window.innerWidth < 890) {
        info.size = false
      }
    })
    window.addEventListener(
      'resize',
      function() {
        if (window.innerWidth < 890) {
          info.size = false
        } else {
          info.size = true
        }
      },
      true
    )

    const login = function() {
      if (info.userEmail && info.userPw) {
        axios
          .post(
            'https://k5d105.p.ssafy.io:3030/users/login',
            {
              email: info.userEmail,
              password: info.userPw,
            },
            {
              headers: {
                FCMtoken: localStorage.getItem('FCMtoken'),
              },
            }
          )
          .then((res) => {
            localStorage.setItem('token', res.data.token.accessToken)
            localStorage.setItem('uid', res.data.user.uid)
            location.replace('/calendar')
          })
          .catch(() => {
            info.dialogVisible = true
            info.message = '이메일 또는 비밀번호가 잘못 되었습니다'
          })
      }
    }

    return { info, login }
  },
}
</script>

<style>
.main .el-dialog {
  width: 30%;
  top: 20%;
  max-width: 400px;
}

.main .el-dialog__body {
  word-break: keep-all;
}

.mainDiv,
.mainMobile {
  width: 100%;
  min-width: 270px;
  max-width: 700px;
  margin: 0 auto;
}

.mainDiv a,
.mainMobile a {
  text-decoration: none;
}

.mainDiv > img {
  width: 200px;
  float: left;
  border-radius: 4px;
}

.mainDiv > button,
.mainSign,
.mainMobLogin > button {
  font-size: 17px;
}

.mainLogin {
  height: 100px;
  width: 120px;
}

.mainSign {
  width: 700px;
  height: 45px;
  margin-top: 20px;
}

.mainSocialLeft:hover,
.mainSocialRight:hover,
.mainMobSocialLogin > div:hover {
  box-shadow: 0 0 10px #a9c9de;
}

.mainLoginDiv > div {
  margin-bottom: 10px;
}

.mainLoginDiv > div > input,
.mainMobLogin > input {
  height: 40px;
  width: 230px;
  padding-left: 10px;
}

.mainLoginDiv > div > input:focus,
.mainMobLogin > input:focus {
  margin-bottom: 0;
}

.mainLoginDiv > div > span {
  font-size: 20px;
}

.mainLoginDiv > div:nth-child(1) > span {
  margin-right: 20px;
}

.mainLoginDiv > div:nth-child(2) > span:nth-child(1) {
  margin-right: 34.8px;
}

.mainFind {
  font-size: 13px !important;
  color: #a9c9de;
  margin-left: 50px;
  cursor: pointer;
}

.mainSocialLeft,
.mainSocialRight {
  display: inline-block;
  cursor: pointer;
  width: 210px;
  height: 35px;
  margin-top: 17px;
  text-align: center;
  padding: 5px;
  background-color: white;
  border: 1px solid #a9c9de;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
}

.mainSocialLeft {
  margin-left: 40px;
  margin-right: 13px;
}

.mainSocialLeft > img,
.mainSocialRight > img {
  float: left;
  width: 35px;
  height: 35px;
}

.mainSocialLeft > span,
.mainSocialRight > div > span {
  line-height: 2;
}

.mainSocialRight > span {
  margin-left: 7px;
}

.mainSocialRight .g-signin2 {
  width: 100%;
  height: 100%;
}

.g-signin2 > div {
  height: 45px !important;
  width: 210px !important;
  top: 16px;
  border: 1px solid #a9c9de;
  border-radius: 2px;
}

.g-signin2 .abcRioButtonIcon {
  padding: 14px !important;
}

.g-signin2 .abcRioButtonContents span:nth-child(1) {
  line-height: 3.5 !important;
}

.mainMobLogin > input {
  width: 45%;
}

.mainMobLogin > input:nth-child(1) {
  margin-top: 20px;
  margin-bottom: 10px;
}

.mainMobFind {
  display: inline-block;
  width: 47%;
  text-align: end;
}

.mainMobFind > a > p {
  display: inline-block;
  font-size: 14px;
  color: #a9c9de;
  cursor: pointer;
  margin: 0;
}

.mainMobLogin > button {
  width: 48%;
  height: 35px;
  margin: 10px 0 20px 0;
}

.mainMobSocialLogin > div {
  display: inline-block;
  width: 45%;
  height: 25px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 1px;
  background-color: white;
  border: 1px solid #a9c9de;
  cursor: pointer;
}

.mainMobSocialLogin > div > img,
.g-signin2 > img {
  float: left;
  width: 15%;
  max-width: 24px;
}

.mainMobSocialLogin .g-signin2 {
  display: inline-block;
  width: 85%;

  height: 25px;
}

.mainMobSocialLogin .g-signin2 > div {
  height: 45px !important;
  width: 100% !important;
  border: 1px solid #a9c9de;
  border-radius: 2px;
}

.mainMobSign {
  padding-top: 30px;
}

.mainMobSign > h3,
.mainMobSign > a {
  font-size: 15px;
  color: #a9c9de;
}

@media screen and (max-width: 950px) {
  .main .el-dialog {
    width: 40%;
    top: 20%;
    word-break: keep-all;
  }
}

@media screen and (max-width: 680px) {
  .main .el-dialog {
    width: 80%;
    top: 20%;
  }
}
</style>
