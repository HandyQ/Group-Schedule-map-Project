<template>
  <div class="newGroup textarea">
    <div class="newGroupDiv">
      <img src="@/assets/dobby.png" alt="" />
      <el-form
        ref="newGroupForm"
        :model="state.form"
        :rules="state.rules"
        label-width="95px"
        label-position="left"
      >
        <el-form-item label="그룹 이름" prop="groupTitle">
          <el-input
            v-model="state.form.groupTitle"
            placeholder="2~8글자"
          ></el-input>
        </el-form-item>
        <el-form-item label="비공개" prop="private" style="text-align:left;">
          <el-switch
            v-model="state.form.private"
            @change="state.form.password = ''"
          ></el-switch>
        </el-form-item>
        <el-form-item
          v-if="state.form.private"
          label="비밀번호"
          prop="password"
        >
          <el-input
            v-model="state.form.password"
            maxlength="4"
            placeholder="4자리 숫자"
          ></el-input>
        </el-form-item>
        <el-form-item label="상세 설명" prop="info">
          <el-input
            v-model="state.form.info"
            type="textarea"
            placeholder="100자까지 입력 가능합니다"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <router-link to="/"><button class="redBtn">취소</button></router-link>
      <button class="blueBtn" type="button" @click="createNewGroup">
        생성
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import axios from 'axios'

export default {
  name: 'new-group',
  setup() {
    const newGroupForm = ref(null)

    const state = reactive({
      form: {
        groupTitle: '',
        private: false,
        password: '',
        info: '',
      },
      rules: {
        groupTitle: [
          { required: true, message: '필수 입력 항목입니다' },
          { min: 2, max: 8, message: '그룹 이름은 2~8자입니다' },
        ],
        password: [
          { required: true, message: '필수 입력 항목입니다' },
          { pattern: /^[0-9]{4}/, message: '비밀번호는 4자리 숫자' },
        ],
        info: [
          { required: true, message: '필수 입력 항목입니다' },
          { max: 100, message: '100자까지 입력 가능합니다' },
        ],
      },
    })

    const createNewGroup = function() {
      newGroupForm.value.validate((valid) => {
        if (valid) {
          axios
            .post(
              'https://k5d105.p.ssafy.io:3030/group/createGroup',
              {
                uid: localStorage.getItem('uid'),
                name: state.form.groupTitle,
                description: state.form.info,
                private: state.form.private,
                password: state.form.password,
              },
              {
                headers: {
                  authorization: localStorage.getItem('token'),
                },
              }
            )
            .then((res) => {
              location.replace(`/groupCalendar?gid=${res.data.group.gid}`)
            })
            .catch((err) => {
              if (err.response.status === 401) {
                alert('로그인이 만료되었습니다')
                location.replace('/')
                localStorage.removeItem('token')
                localStorage.removeItem('uid')
              }
            })
        }
      })
    }
    return { state, newGroupForm, createNewGroup }
  },
}
</script>

<style>
.newGroupDiv {
  width: 90%;
  min-width: 260px;
  max-width: 500px;
  margin: 0 auto;
}

.newGroupDiv img {
  width: 30%;
  margin-bottom: 5%;
}

.newGroupDiv p {
  margin-bottom: 0;
  text-align: left;
}

.newGroupDiv textarea {
  height: 100px !important;
}

.newGroupDiv .el-form-item.is-error .el-textarea__inner {
  border-color: rgb(255, 155, 155);
}

.newGroupDiv button {
  width: 48%;
  height: 30px;
  margin-top: 5%;
}

.newGroupDiv > a > button {
  margin-right: 4%;
}

.newGroupDiv .el-switch.is-checked .el-switch__core {
  background-color: #a9c9de;
  border-color: #a9c9de;
}
</style>
