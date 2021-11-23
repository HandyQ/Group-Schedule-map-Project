<template>
  <div class="findInfo">
    <el-dialog v-model="info.dialogVisible">
      <span>{{ info.message }}</span>
    </el-dialog>
    <div class="findId">
      <h2 v-if="info.find">이메일 찾기</h2>
      <h2 v-else>비밀번호 찾기</h2>
      <div v-if="!info.result">
        <p v-if="info.find">가입 시 등록한 이메일을 입력해 주세요</p>
        <p v-else>가입 시 등록한 정보를 입력해 주세요</p>
        <div v-if="info.find">
          <el-input
            v-model="info.userName"
            placeholder="이름"
            @keyup.enter="clickFindEmail"
          ></el-input>
          <el-input
            v-model="info.userPhone"
            placeholder="전화번호"
            @keyup.enter="clickFindEmail"
            maxlength="11"
          ></el-input>
        </div>
        <div v-else>
          <el-input
            v-model="info.userPhone"
            placeholder="전화번호"
            @keyup.enter="clickFindPw"
            maxlength="11"
          ></el-input>
          <el-input
            v-model="info.userEmail"
            placeholder="이메일"
            @keyup.enter="clickFindPw"
          ></el-input>
        </div>
        <button
          class="findIdBtn blueBtn"
          v-if="info.find"
          type="button"
          @click="clickFindEmail"
        >
          이메일 찾기
        </button>
        <button
          class="findIdBtn blueBtn"
          v-else
          type="button"
          @click="clickFindPw"
        >
          비밀번호 찾기
        </button>
      </div>

      <div v-else>
        <div class="findEmailResult" v-if="info.find">
          <span>이메일: {{ info.userEmail }}</span>
        </div>
        <div v-else>
          <p style="margin-top:5%">비밀번호 변경</p>
          <el-form
            class="changePwForm"
            :model="state.form"
            :rules="state.rules"
            ref="changePwForm"
            :label-position="state.form.align"
            label-width="105px"
          >
            <el-form-item label="비밀번호" prop="password">
              <el-input
                v-model="state.form.password"
                type="password"
                placeholder="8~16, 영문+숫자+특수문자"
              ></el-input>
            </el-form-item>
            <el-form-item label="비밀번호 확인" prop="checkPw">
              <el-input v-model="state.form.checkPw" type="password"></el-input>
            </el-form-item>
          </el-form>
          <button
            class="findIdBtn blueBtn"
            type="button"
            @click="clickChangePw"
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      <router-link to="/"
        ><button class="findCancelBtn redBtn">취소</button></router-link
      >
      <button
        class="findPwBtn blueBtn"
        v-if="info.find"
        type="button"
        @click=";(info.find = false), (info.result = false)"
      >
        비밀번호 찾기
      </button>
      <button
        class="findPwBtn blueBtn"
        v-else
        type="button"
        @click=";(info.find = true), (info.result = false)"
      >
        이메일 찾기
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import axios from 'axios'

export default {
  name: 'findInfo',

  setup() {
    const changePwForm = ref(null)

    const info = reactive({
      find: true,
      userName: '',
      userEmail: '',
      userPhone: '',
      dialogVisible: false,
      message: '',
      result: false,
    })

    const state = reactive({
      form: {
        password: '',
        checkPw: '',
        align: 'left',
      },
      rules: {
        password: [
          { required: true, message: '필수 입력 항목입니다' },
          {
            min: 8,
            max: 16,
            message: '비밀번호는 8~16자입니다',
          },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{7,16}$/,
            message: '영문, 숫자, 특수문자 조합 필요',
          },
        ],
        checkPw: [
          { required: true, message: '필수 입력 항목입니다' },
          {
            validator(rule, value, callback) {
              if (value != state.form.password) {
                callback(new Error('비밀번호가 일치하지 않습니다'))
              } else {
                callback()
              }
            },
          },
        ],
      },
    })

    const clickFindEmail = function() {
      if (info.userName && info.userPhone) {
        axios
          .post('https://k5d105.p.ssafy.io:3030/users/findID', {
            name: info.userName,
            phone: info.userPhone,
          })
          .then((res) => {
            if (res.data.error === '등록된 아이디가 없습니다.') {
              info.dialogVisible = true
              info.message = '일치하는 정보가 없습니다'
            } else {
              info.result = true
              info.userEmail = res.data.id
            }
          })
      }
    }

    const clickFindPw = function() {
      if (info.userPhone && info.userEmail) {
        axios
          .post('https://k5d105.p.ssafy.io:3030/users/findPW', {
            email: info.userEmail,
            phone: info.userPhone,
          })
          .then((res) => {
            if (res.data.error === '등록된 회원 정보가 없습니다.') {
              info.dialogVisible = true
              info.message = '일치하는 정보가 없습니다'
            } else {
              info.result = true
            }
          })
      }
    }

    const clickChangePw = function() {
      changePwForm.value.validate((valid) => {
        if (valid) {
          axios
            .put('https://k5d105.p.ssafy.io:3030/users/changePW', {
              email: info.userEmail,
              password: state.form.password,
            })
            .then(() => {
              state.form.password = ''
              state.form.checkPw = ''
              alert('비밀번호가 변경되었습니다')
              location.replace('/')
            })
        }
      })
    }
    return {
      changePwForm,
      info,
      state,
      clickFindEmail,
      clickFindPw,
      clickChangePw,
    }
  },
}
</script>

<style>
.findInfo {
  display: flex;
  height: 85vh;
  align-items: center;
}

.findId {
  width: 90%;
  min-width: 270px;
  max-width: 700px;
  margin: 0 auto;
}

.findId h2,
.findId p {
  margin-top: 0;
  text-align: left;
}

.findId input,
.findIdBtn {
  margin-top: 3%;
  width: 100%;
}

.findIdBtn,
.findPwBtn,
.findCancelBtn {
  height: 40px;
}

.findPwBtn {
  margin: 5% 0 0 3%;
}

.findPwBtn,
.findCancelBtn {
  width: 48%;
}

.changePwForm .el-input {
  text-align: left;
}
.changePwForm .el-input input {
  margin: 0;
}

.findInfo .el-dialog {
  width: 30%;
  top: 20%;
  max-width: 400px;
}

.findInfo .el-dialog__body {
  word-break: keep-all;
}

.findEmailResult {
  height: 100px;
  line-height: 6;
  background: #f0f2f5;
  border-radius: 4px;
}

@media screen and (max-width: 950px) {
  .findInfo .el-dialog {
    width: 40%;
    top: 20%;
    word-break: keep-all;
  }
}

@media screen and (max-width: 680px) {
  .findInfo .el-dialog {
    width: 80%;
    top: 20%;
  }
}
</style>
