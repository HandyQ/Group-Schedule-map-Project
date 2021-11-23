<template>
  <div class="searchGroup">
    <div class="searchGroupDiv">
      <el-dialog v-model="info.dialogVisible">
        <span>{{ info.message }}</span>
      </el-dialog>
      <el-dialog v-model="info.searchDia" :title="info.groupName" width="30%">
        <div v-if="info.private">
          <p style="font-size:17px;">{{ info.groupDes }}</p>
          <span style="color:rgb(255, 155, 155)">비공개 그룹입니다</span>
        </div>
        <div v-else>
          <p style="font-size:17px;">{{ info.groupDes }}</p>
        </div>
        <template #footer>
          <div v-if="info.private">
            <span class="dialog-footer">
              <el-button
                class="redBtn"
                @click=";(info.searchDia = false), (info.password = '')"
                >취소</el-button
              >
            </span>
          </div>
          <div v-else>
            <span class="dialog-footer">
              <el-button class="redBtn" @click="info.searchDia = false"
                >취소</el-button
              >
              <el-button class="blueBtn" @click="joinGroup">참여</el-button>
            </span>
          </div>
        </template>
      </el-dialog>
      <img src="@/assets/dobby.png" alt="" />
      <div>
        <el-select class="search" v-model="info.value" @change="search">
          <el-option
            v-for="item in info.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <button
          class="newGroupBtn blueBtn"
          type="button"
          @click="handleToCreate"
        >
          그룹 생성
        </button>
      </div>
      <div
        class="groupLi"
        v-for="(group, index) in info.pageGroup"
        :key="index"
        @click="clickGroup(group.gid)"
      >
        <div>
          <span class="groupName">{{ group.name }}</span>
          <span class="lock" v-if="group.private">🔒</span>
        </div>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :total="info.groupLi.length"
        :page-size="8"
        @current-change="handleCurrentChange"
        hide-on-single-page
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import axios from 'axios'
import { onBeforeMount } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

export default {
  name: 'searchGroup',
  setup() {
    const router = useRouter()
    const info = reactive({
      dialogVisible: false,
      message: '',
      searchDia: false,
      options: ref([
        {
          value: '전체 그룹',
          label: '전체 그룹',
        },
        {
          value: '공개 그룹',
          label: '공개 그룹',
        },
      ]),
      value: '전체 그룹',
      groupLi: [],
      pageGroup: [],
      groupName: '',
      groupDes: '',
      private: false,
      groupGid: '',
    })

    onBeforeMount(() => {
      axios
        .get('https://k5d105.p.ssafy.io:3030/group/getAllgroups', {
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          info.groupLi = res.data.groups
          info.pageGroup = info.groupLi.slice(0, 8)
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

    const search = function() {
      if (info.value === '전체 그룹') {
        axios
          .get('https://k5d105.p.ssafy.io:3030/group/getAllgroups', {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          })
          .then((res) => {
            info.groupLi = res.data.groups
            info.pageGroup = info.groupLi.slice(0, 8)
          })
          .catch((err) => {
            if (err.response.status === 401) {
              alert('로그인이 만료되었습니다')
              location.replace('/')
              localStorage.removeItem('token')
              localStorage.removeItem('uid')
            }
          })
      } else {
        axios
          .get('https://k5d105.p.ssafy.io:3030/group/getPublicGroups', {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          })
          .then((res) => {
            info.groupLi = res.data.groups
            info.pageGroup = info.groupLi.slice(0, 8)
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

    const handleToCreate = function() {
      router.push({ name: 'NewGroup' })
    }

    const clickGroup = function(e) {
      info.groupGid = e
      axios
        .get('https://k5d105.p.ssafy.io:3030/group/getGroup', {
          params: { gid: info.groupGid },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          info.groupName = res.data.group.name
          info.groupDes = res.data.group.description
          info.private = res.data.group.private
          info.searchDia = true
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

    const joinGroup = function() {
      axios
        .get('https://k5d105.p.ssafy.io:3030/groupCalendar/getGroup', {
          params: {
            uid: localStorage.getItem('uid'),
            headers: {
              authorization: localStorage.getItem('token'),
            },
          },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        })
        .then((res) => {
          for (var i in res.data.group) {
            if (res.data.group[i]['name'] === info.groupName) {
              info.searchDia = false
              info.message = '이미 가입되어 있는 그룹입니다'
              return (info.dialogVisible = true)
            }
          }
          axios
            .post(
              'https://k5d105.p.ssafy.io:3030/group/joinGroup',
              {
                gid: info.groupGid,
                uid: localStorage.getItem('uid'),
              },
              {
                headers: {
                  authorization: localStorage.getItem('token'),
                },
              }
            )
            .then(() => {
              alert(`${info.groupName}에 가입되었습니다`)
              location.replace(`/groupCalendar?gid=${info.groupGid}`)
            })
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

    const handleCurrentChange = function(val) {
      info.pageGroup = info.groupLi.slice((val - 1) * 8, (val - 1) * 8 + 8)
    }
    return {
      info,
      search,
      handleToCreate,
      clickGroup,
      joinGroup,
      handleCurrentChange,
    }
  },
}
</script>

<style>
.searchGroupDiv {
  width: 90%;
  min-width: 260px;
  max-width: 1000px;
  margin: 0 auto;
}

.searchGroupDiv img {
  width: 60%;
  max-width: 200px;
  margin-bottom: 3%;
}

.searchGroupDiv .el-dialog {
  width: 90%;
  max-width: 600px;
}

.search {
  width: 80%;
  margin-bottom: 3%;
}

.newGroupBtn {
  width: 15%;
  height: 40px;
  margin-left: 2%;
}

.searchGroupDiv .el-select:hover {
  box-shadow: 0 0 10px #a9c9de;
}

.searchGroupDiv .el-select .el-input.is-focus .el-input__inner,
.searchGroupDiv .el-select .el-input__inner:focus {
  border: 2px solid #a9c9de;
}

.groupLi {
  display: inline-block;
  width: 20%;
  height: 150px;
  margin: 3% 1% 0 1%;
  border: 1px solid #a9c9de;
  border-radius: 4px;
  box-shadow: 3px 3px 3px #b3b3b3;
  cursor: pointer;
  transition: 0.2s linear;
}

.groupLi:hover {
  box-shadow: 0 0 10px #a9c9de;
}

.groupName {
  line-height: 9;
}

.lock {
  width: 20px;
  /* float: right; */
  margin-left: 2%;
}

.searchGroupDiv .el-pagination {
  margin: 5% 0 1% 0;
}

@media screen and (max-width: 835px) {
  .groupLi {
    width: 45%;
    height: 100px;
  }

  .groupName {
    line-height: 6;
  }

  .newGroupBtn {
    width: 19%;
    margin-left: 1%;
  }
}

/* @media screen and (max-width: 620px) {
  .lock {
    margin: 7% 7% 0 0;
  }
} */

@media screen and (max-width: 530px) {
  .search {
    width: 100%;
    margin-bottom: 3%;
  }

  .newGroup {
    width: 100%;
    height: 40px;
    margin-left: 0;
  }

  .groupLi {
    width: 95%;
    height: 50px;
    margin: 3% 0 0 0;
  }

  .groupName {
    line-height: 3;
  }

  .newGroupBtn {
    width: 100%;
    margin: 0;
  }
}
</style>
