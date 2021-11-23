<template>
  <div class="groupInfo" style="margin: 5% 0;">
    <el-dialog v-model="info.dialogVisible">
      <span>{{ info.message }}</span>
    </el-dialog>
    <el-dialog v-model="info.inviteDia" title="초대하기" width="30%">
      <p style="margin: 0 0 3% 0">초대할 멤버의 이메일을 입력하세요</p>
      <el-input
        v-model="info.inviteEmail"
        type="email"
        @keyup.enter="inviteMem"
      ></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="redBtn"
            @click=";(info.inviteDia = false), (info.inviteEmail = '')"
            >취소</el-button
          >
          <el-button class="blueBtn" @click="inviteMem">초대</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="info.changeDia" title="그룹장 변경" width="30%">
      <p style="margin: 0 0 3% 0">
        {{ info.changeAdmin }} 님께 그룹장을 위임하시겠습니까?
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="redBtn" @click="info.changeDia = false"
            >취소</el-button
          >
          <el-button class="blueBtn" @click="changeAdmin">변경</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="groupInfoDiv">
      <div class="groupInfoTop">
        <img src="@/assets/dobby.png" alt="" />
        <div>
          <el-input
            v-if="info.admin"
            v-model="info.name"
            style="margin-bottom:2%"
          ></el-input>
          <h3 v-else style="margin-top:0;">{{ info.name }}</h3>
          <span>비공개 여부</span>
          <el-switch
            v-model="info.private"
            :disabled="!info.admin"
            style="margin-bottom:1%; "
          ></el-switch>
          <el-input
            v-if="info.private"
            v-model="info.password"
            :disabled="!info.admin"
          ></el-input>
        </div>
      </div>
      <div class="groupInfoMid textarea">
        <p>상세 설명</p>
        <el-input
          v-model="info.description"
          type="textarea"
          :disabled="!info.admin"
        ></el-input>
        <button class="blueBtn" v-if="info.admin" @click="changeInfo">
          정보 수정
        </button>
        <div class="groupMember">
          <div v-for="(t, index) in info.member" :key="index">
            <span
              v-if="t.admin"
              style="float: left; margin-left:2%; cursor: pointer;width:20px; margin-top:5px;"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-394d1fd8=""
              >
                <path
                  fill="currentColor"
                  d="M320 320V128h384v192h192v192H128V320h192zM128 576h768v320H128V576zm256-256h256.064V192H384v128z"
                ></path></svg
            ></span>
            <span
              v-else-if="t.writer"
              style="float: left; margin-left:2%; cursor: pointer;font-weight: 900; font-size: 20px; width:20px; margin-top:5px;"
              @click="handleWriter(t.nickname, true)"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-394d1fd8=""
                @click="handleWriter(t.nickname, true)"
              >
                <path
                  fill="currentColor"
                  d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"
                ></path>
                <path
                  fill="currentColor"
                  d="M512 563.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4z"
                ></path></svg
            ></span>
            <span
              v-else
              style="color: lightgray; float: left; margin-left:2%; cursor: pointer; font-weight: 900; font-size: 20px; width:20px; margin-top:5px;"
              @click="handleWriter(t.nickname, false)"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                data-v-394d1fd8=""
                @click="handleWriter(t.nickname, false)"
              >
                <path
                  fill="currentColor"
                  d="m174.72 855.68 130.048-43.392 23.424 11.392C382.4 849.984 444.352 864 512 864c223.744 0 384-159.872 384-352 0-192.832-159.104-352-384-352S128 319.168 128 512a341.12 341.12 0 0 0 69.248 204.288l21.632 28.8-44.16 110.528zm-45.248 82.56A32 32 0 0 1 89.6 896l56.512-141.248A405.12 405.12 0 0 1 64 512C64 299.904 235.648 96 512 96s448 203.904 448 416-173.44 416-448 416c-79.68 0-150.848-17.152-211.712-46.72l-170.88 56.96z"
                ></path></svg
            ></span>
            <p
              style="display:inline-block; margin: 6px 0; cursor:pointer"
              @click="changeAdminBtn(t.nickname)"
            >
              {{ t.nickname }}
            </p>
            <span
              v-if="info.admin && t.nickname != info.userNick"
              style="float: right; margin:1% 2% 0 0; cursor: pointer;"
              @click="deleteMem(t.nickname)"
            >
              X</span
            >
          </div>
        </div>
        <div>
          <button
            class="blueBtn"
            @click="handleToGroupCal"
            style="margin-right: 4%; width: 48%;"
          >
            돌아가기
          </button>

          <button
            class="blueBtn"
            style="width: 48%;"
            @click="info.inviteDia = true"
          >
            초대하기
          </button>
          <button v-if="info.admin" class="redBtn" @click="deleteGroup">
            {{ info.name }} is free!
          </button>
          <button v-else class="redBtn" @click="deleteGroupMem">
            {{ info.userNick }} is free!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, watch } from '@vue/runtime-core'

export default {
  name: 'groupInfo',
  props: ['gid'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const info = reactive({
      userEmail: '',
      userNick: '',
      admin: false,
      private: false,
      password: '',
      name: '',
      description: '',
      dialogVisible: false,
      message: '',
      changeDia: false,
      changeAdmin: '',
      inviteDia: false,
      inviteEmail: '',
      member: [],
    })

    watch(
      () => route.params,
      (first) => {
        props = first
        getGroup()
      }
    )

    onBeforeMount(() => {
      axios
        .get('https://k5d105.p.ssafy.io:3030/users/getUserInfo', {
          params: { uid: localStorage.getItem('uid') },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          info.userEmail = res.data.user.email
          info.userNick = res.data.user.nickname
          getGroup()
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert('로그인이 만료되었습니다')
            location.replace('/')
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
          }
        })
    })
    const getGroup = function() {
      if (props.gid) {
        axios
          .get('https://k5d105.p.ssafy.io:3030/group/getGroup', {
            params: { gid: props.gid },
            headers: {
              authorization: localStorage.getItem('token'),
            },
          })
          .then((res) => {
            info.name = res.data.group.name
            info.description = res.data.group.description
            info.private = res.data.group.private
            info.password = res.data.group.password
            info.member = res.data.group.members
            if (res.data.group.admin === info.userEmail) {
              info.admin = true
            } else {
              info.admin = false
            }
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
    }

    const changeInfo = function() {
      if (info.private) {
        if (!info.password) {
          info.dialogVisible = true
          info.message = '비밀번호를 입력해 주세요'
        } else if (!info.password.match(/^[0-9]{4}/)) {
          info.dialogVisible = true
          info.message = '비밀번호는 숫자 4자리입니다'
        } else {
          axios
            .put(
              'https://k5d105.p.ssafy.io:3030/group/updateGroup',
              {
                private: info.private,
                password: info.password,
                name: info.name,
                description: info.description,
                gid: props.gid,
              },
              {
                headers: {
                  authorization: localStorage.getItem('token'),
                },
              }
            )
            .then(() => {
              alert('그룹 정보가 수정되었습니다')
              location.reload()
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
      } else {
        axios
          .put(
            'https://k5d105.p.ssafy.io:3030/group/updateGroup',
            {
              private: info.private,
              password: info.password,
              name: info.name,
              description: info.description,
              gid: props.gid,
            },
            {
              headers: {
                authorization: localStorage.getItem('token'),
              },
            }
          )
          .then(() => {
            alert('그룹 정보가 수정되었습니다')
            location.reload()
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
    }

    const changeAdminBtn = function(e) {
      if (info.admin && info.userNick != e) {
        info.changeAdmin = e
        info.changeDia = true
      }
    }

    const changeAdmin = function() {
      axios
        .put(
          'https://k5d105.p.ssafy.io:3030/group/changeAdmin',
          {
            gid: props.gid,
            currentuid: localStorage.getItem('uid'),
            changenickname: info.changeAdmin,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then(() => {
          alert(`그룹장이 ${info.changeAdmin} 님으로 변경되었습니다`)
          info.changeDia = false
          info.changeAdmin = ''
          getGroup()
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

    const handleWriter = function(nickname, writer) {
      if (info.admin) {
        axios
          .put(
            'https://k5d105.p.ssafy.io:3030/group/updateWriterAuth',
            {
              gid: props.gid,
              nickname: nickname,
              writer: !writer,
            },
            {
              headers: { authorization: localStorage.getItem('token') },
            }
          )
          .then(() => {
            info.dialogVisible = true
            info.message = '일정 작성 권한이 수정되었습니다'
            getGroup()
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
    }

    const deleteMem = function(e) {
      axios
        .delete('https://k5d105.p.ssafy.io:3030/group/leaveMember', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
          data: { gid: props.gid, nickname: e },
        })
        .then(() => {
          info.dialogVisible = true
          info.message = '회원을 추방했습니다'
          getGroup()
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

    const inviteMem = function() {
      if (info.inviteEmail) {
        axios
          .put(
            'https://k5d105.p.ssafy.io:3030/group/addMember',
            {
              gid: props.gid,
              email: info.inviteEmail,
            },
            {
              headers: { authorization: localStorage.getItem('token') },
            }
          )
          .then((res) => {
            if (res.data.msg === '존재하지 않는 유저입니다.') {
              info.dialogVisible = true
              info.message = '이메일을 확인해 주세요'
            } else if (res.data.msg === '이미 존재하는 유저입니다.') {
              info.dialogVisible = true
              info.message = '이미 존재하는 유저입니다'
            } else {
              info.inviteDia = false
              info.inviteEmail = ''
              getGroup()
            }
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
    }

    const deleteGroup = function() {
      axios
        .delete('https://k5d105.p.ssafy.io:3030/group/deleteGroup', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
          data: {
            gid: props.gid,
          },
        })
        .then(() => {
          alert('그룹이 삭제되었습니다')
          location.replace('/calendar')
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

    const deleteGroupMem = function() {
      axios
        .delete('https://k5d105.p.ssafy.io:3030/group/leaveMember', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
          data: { gid: props.gid, nickname: info.userNick },
        })
        .then(() => {
          alert(`${info.name}에서 탈퇴했습니다`)
          location.replace('/calendar')
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
    const handleToGroupCal = function() {
      router.push({ name: 'GroupCalendar', query: { gid: props.gid } })
    }

    return {
      info,
      getGroup,
      changeInfo,
      handleWriter,
      deleteMem,
      changeAdminBtn,
      changeAdmin,
      inviteMem,
      deleteGroup,
      deleteGroupMem,
      handleToGroupCal,
    }
  },
}
</script>

<style>
.groupInfoDiv {
  width: 90%;
  min-width: 260px;
  max-width: 500px;
  margin: 0 auto;
}

.groupInfo .el-dialog {
  width: 30%;
  top: 20%;
  max-width: 400px;
}

.groupInfo .el-dialog__body {
  word-break: keep-all;
}

.groupInfoTop img {
  float: left;
  width: 30%;
  margin: 0 5% 5% 0;
}

.groupInfoTop > div {
  float: left;
  width: 65%;
  text-align: left;
}

.groupInfoTop span {
  display: inline-block;
  margin: 4% 5% 1% 0;
}

.groupInfoMid p {
  clear: both;
  margin: 0;
  text-align: left;
}

.groupInfoMid textarea {
  height: 100px;
  max-height: 100px;
}

.groupInfoMid button {
  width: 100%;
  height: 35px;
  margin-top: 5%;
}

.groupInfoTop .el-switch.is-checked .el-switch__core {
  border-color: #a9c9de;
  background-color: #a9c9de;
}

.groupInfoMid .el-textarea.is-disabled .el-textarea__inner,
.groupInfoTop .el-input.is-disabled .el-input__inner {
  background-color: rgba(245, 245, 245, 0.582);
  border-color: #a9c9de;
  color: black;
  cursor: auto;
}

.groupInfoTop .el-switch.is-disabled .el-switch__core {
  cursor: auto;
}

.groupMember {
  height: 200px;
  margin-top: 5%;
  border: 2px solid #a9c9de;
  border-radius: 2px;
  overflow: auto;
}
.groupMember::-webkit-scrollbar {
  width: 10px;
  background-color: white;
}
.groupMember::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgb(241, 241, 241);
}

.groupMember div {
  height: 30px;
  margin: 2%;
  text-align: center;
  background: rgb(241, 241, 241);
}

@media screen and (max-width: 570px) {
  .groupInfoTop img {
    float: none;
    width: 50%;
    margin: 0;
  }

  .groupInfoTop > div {
    display: inline-block;
    float: none;
    width: 65%;
    text-align: center;
  }

  .groupInfoTop h3 {
    margin-top: 5%;
  }

  .groupInfoMid p {
    clear: both;
    margin: 5% 0 2% 0;
    text-align: left;
  }
}

@media screen and (max-width: 950px) {
  .groupInfo .el-dialog {
    width: 40%;
    top: 20%;
    word-break: keep-all;
  }
}

@media screen and (max-width: 680px) {
  .groupInfo .el-dialog {
    width: 80%;
    top: 20%;
  }
}
</style>
