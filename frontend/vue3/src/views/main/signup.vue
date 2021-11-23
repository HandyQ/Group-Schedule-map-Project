<template>
  <div class="signupDiv">
    <el-dialog v-model="info.dialogVisible">
      <span>{{ info.message }}</span>
    </el-dialog>
    <div class="signup">
      <h2 style="text-align: left;">회원가입</h2>
      <el-form
        class="signupForm"
        :model="state.form"
        :rules="state.rules"
        ref="signupForm"
        :label-position="state.form.align"
        label-width="105px"
      >
        <el-form-item label="이름" prop="userName">
          <el-input v-model="state.form.userName" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="전화번호" prop="userPhone">
          <el-input
            class="duplInput"
            v-model="state.form.userPhone"
            maxlength="11"
          ></el-input>
          <button
            class="checkDuplBtn blueBtn"
            @click="checkPhoneDupl"
            type="button"
            :disabled="info.checkPhone"
            @input="info.checkPhone = false"
          >
            중복 확인
          </button>
        </el-form-item>
        <el-form-item label="이메일" prop="email">
          <el-input
            class="duplInput"
            v-model="state.form.email"
            type="email"
            @input="info.checkEmail = false"
          ></el-input
          ><button
            class="checkDuplBtn blueBtn"
            @click="checkEmailDupl"
            type="button"
            :disabled="info.checkEmail"
          >
            중복 확인
          </button>
        </el-form-item>
        <el-form-item label="닉네임" prop="userNick">
          <el-input
            class="duplInput"
            v-model="state.form.userNick"
            placeholder="최대 8글자"
            @input="info.checkNick = false"
          ></el-input>
          <button
            type="button"
            class="checkDuplBtn blueBtn"
            @click="checkNickDupl"
            :disabled="info.checkNick"
          >
            중복 확인
          </button>
        </el-form-item>
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
        <el-form-item label="주소" prop="address">
          <el-input
            class="duplInput"
            v-model="state.form.address"
            type="text"
            @click="findAddress"
            :disabled="info.addressInput"
          ></el-input
          ><button
            class="checkDuplBtn blueBtn"
            @click="findAddress"
            type="button"
          >
            주소 검색
          </button>
        </el-form-item>
      </el-form>

      <router-link to="/"
        ><button class="signupCancel redBtn">취소</button></router-link
      >
      <button class="signupBtn blueBtn" @click="clickSignup" type="button">
        회원가입
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'signup',
  setup() {
    const router = useRouter()
    const signupForm = ref(null)

    const info = reactive({
      message: '',
      dialogVisible: false,
      checkNick: false,
      checkEmail: false,
      checkPhone: false,
      addressInput: false,
    })

    const state = reactive({
      form: {
        userName: '',
        userPhone: '',
        email: '',
        userNick: '',
        password: '',
        checkPw: '',
        address: '',
        align: 'left',
      },
      rules: {
        userName: [{ required: true, message: '필수 입력 항목입니다' }],
        userPhone: [
          { required: true, message: '필수 입력 항목입니다' },
          {
            pattern: /^01[0-1]{1}[0-9]{4}[0-9]{4}/,
            message: '유효하지 않은 전화번호입니다',
          },
        ],
        email: [
          { required: true, message: '필수 입력 항목입니다' },
          {
            pattern: /^([0-9a-zA-Z]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z]{2,3})$/,
            message: '올바른 이메일 형식이 아닙니다',
          },
        ],
        userNick: [
          { required: true, message: '필수 입력 항목입니다' },
          { max: 8, message: '8글자까지 입력 가능합니다' },
        ],
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
        address: [{ required: true, message: '필수 입력 항목입니다' }],
      },
    })

    const checkPhoneDupl = function() {
      if (
        state.form.userPhone &&
        state.form.userPhone.match(/^01[0-1]{1}[0-9]{4}[0-9]{4}/)
      ) {
        axios
          .get('https://k5d105.p.ssafy.io:3030/users/checkDuplicatePhone', {
            params: {
              phone: state.form.userPhone,
            },
          })
          .then((res) => {
            if (res.data.valid) {
              info.dialogVisible = true
              info.message = '사용 가능한 전화번호입니다'
              info.checkPhone = true
            } else {
              info.dialogVisible = true
              info.message = '이미 등록된 전화번호입니다'
            }
          })
      } else {
        info.dialogVisible = true
        info.message = '올바른 전화번호를 입력해 주세요'
      }
    }

    const checkEmailDupl = function() {
      if (state.form.email) {
        axios
          .get('https://k5d105.p.ssafy.io:3030/users/checkDuplicateEmail', {
            params: { email: state.form.email },
          })
          .then((res) => {
            if (res.data.valid) {
              info.dialogVisible = true
              info.message = '사용 가능한 이메일입니다'
              info.checkEmail = true
            } else {
              info.dialogVisible = true
              info.message = '이미 등록된 이메일입니다'
            }
          })
      }
    }

    const checkNickDupl = function() {
      if (state.form.userNick && state.form.userNick.length <= 8) {
        axios
          .get('https://k5d105.p.ssafy.io:3030/users/checkDuplicateNick', {
            params: {
              nickname: state.form.userNick,
            },
          })
          .then((res) => {
            if (res.data.valid) {
              info.dialogVisible = true
              info.message = '사용 가능한 닉네임입니다'
              info.checkNick = true
            } else {
              info.dialogVisible = true
              info.message = '이미 등록된 닉네임입니다'
            }
          })
      }
    }

    const findAddress = function() {
      new window.daum.Postcode({
        oncomplete: function(data) {
          state.form.address = data.address
          info.addressInput = true
        },
      }).open()
    }

    const clickSignup = function() {
      signupForm.value.validate((valid) => {
        if (valid) {
          if (info.checkPhone && info.checkNick && info.checkEmail) {
            axios
              .post('https://k5d105.p.ssafy.io:3030/users/signup', {
                name: state.form.userName,
                phone: state.form.userPhone,
                nickname: state.form.userNick,
                password: state.form.password,
                email: state.form.email,
                address: state.form.address,
              })
              .then(() => router.push({ name: 'SuccessSignup' }))
          } else {
            info.dialogVisible = true
            info.message = '중복 확인을 해 주세요'
          }
        } else {
          info.dialogVisible = true
          info.message = '입력 값들을 확인해 주세요'
        }
      })
    }

    return {
      signupForm,
      info,
      state,
      checkPhoneDupl,
      checkEmailDupl,
      checkNickDupl,
      findAddress,
      clickSignup,
    }
  },
}
</script>

<style>
.signupDiv {
  display: flex;
  height: 80vh;
  align-items: center;
}

.signupDiv > div > div > .el-dialog {
  width: 20%;
  top: 20%;
}

.signupDiv .el-input.is-disabled .el-input__inner {
  color: #606266;
  background-color: rgb(247, 247, 247);
  border-color: #a9c9de;
  cursor: auto;
}

.signup {
  width: 90%;
  min-width: 260px;
  max-width: 500px;
  margin: 0 auto;
}

.signup h2 {
  margin: 10% 0 5% 0;
}

.duplInput {
  width: 76% !important;
}

.checkDuplBtn {
  margin-left: 3%;
  width: 21%;
  height: 40px;
}

.checkDuplBtn:disabled {
  background-color: rgb(211, 211, 211) !important;
}

.signupCancel,
.signupBtn {
  width: 45%;
  height: 35px;
  margin: 5% 0;
}

.signupCancel {
  margin-right: 5%;
}

.signupBtn {
  margin-left: 5%;
}

@media screen and (max-width: 950px) {
  .signupDiv > div > div > .el-dialog {
    width: 40%;
    top: 20%;
  }
}

@media screen and (max-width: 480px) {
  .signupDiv {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .signupDiv > div > div > .el-dialog {
    width: 70%;
    top: 20%;
  }

  .signup > h2 {
    margin-top: 0;
  }

  .duplInput {
    width: 100% !important;
  }

  .checkDuplBtn {
    width: 100%;
    margin: 5px 0 0;
  }
}
</style>
