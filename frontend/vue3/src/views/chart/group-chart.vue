<template>
  <div>
    <div class="chart">
      <img
        src="@/assets/dobby.png"
        alt="Dobby logo"
        style="width: 40%; margin: 5% 0;"
      />
      <div class="demo-date-picker" style="margin-bottom:5%;">
        <div class="block">
          <span class="demonstration" style="margin: 0 5% 5% 0;"
            >기간 설정</span
          >
          <el-date-picker
            class="datePicker"
            v-model="state.date"
            type="daterange"
            @change="changeDate"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </div>
      </div>
    </div>

    <div v-if="info.totalCount" class="chartBottom">
      <div>
        <p>주로 어떤 계획을 세웠을까?</p>
        <p style="margin:0 0 3% 0">총 {{ info.totalCount }}개</p>
        <div class="demo-progress">
          <div v-for="(t, index) in info.totalLi" :key="index">
            <p>
              {{ t.category }}
            </p>
            <el-progress
              class="progress"
              :text-inside="true"
              :stroke-width="20"
              :percentage="
                Math.floor((t.Num / info.totalCount).toFixed(2) * 100)
              "
              :color="info.color[index % 2]"
              style="margin-bottom:3%"
            />
          </div>
        </div>
      </div>
      <div>
        <p>계획은 얼마나 달성했을까?</p>
        <p style="margin:0 0 3% 0">
          평균 {{ (info.doneCount / info.totalCount).toFixed(2) * 100 }}%
        </p>
        <div class="demo-progress">
          <div v-for="(t, index) in info.categoryLi" :key="index">
            <p>
              {{ t.category }}
            </p>
            <el-progress
              class="progress"
              :text-inside="true"
              :stroke-width="20"
              :percentage="Math.floor((t.check / t.total).toFixed(2) * 100)"
              :color="info.color[index % 2]"
              style="margin-bottom:3%"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="state.date && !info.totalCount">
      <p>기간 내에 일정이 없습니다</p>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import axios from 'axios'
import { watch } from 'vue-demi'
import { useRoute } from 'vue-router'

export default {
  name: 'chart',
  props: ['gid'],
  setup(props) {
    const route = useRoute()
    const info = reactive({
      totalCount: 0,
      totalLi: [],
      doneCount: 0,
      categoryLi: [],
      color: ['#a9c9de', '#F4EF50', '#C882D8', '#D2F276', '#5FCEC6'],
    })

    const state = reactive({
      date: '',
    })

    watch(
      () => route.params,
      (first) => {
        props = first
        state.date = ''
        info.totalCount = 0
      }
    )

    const changeDate = function() {
      let startDate = state.date[0]
      let endDate = state.date[1]
      axios
        .post(
          'https://k5d105.p.ssafy.io:3030/chart/getGroup',
          {
            gid: props.gid,
            uid: localStorage.getItem('uid'),
            startDate: startDate,
            endDate: endDate,
          },
          {
            headers: {
              authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((res) => {
          info.totalCount = res.data.totalNum
          info.totalLi = res.data.totalCategory
          info.doneCount = res.data.checkNum
          info.categoryLi = res.data.checkCategory
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
    return { info, state, changeDate }
  },
}
</script>

<style>
.chart {
  width: 90%;
  min-width: 260px;
  max-width: 500px;
  margin: 0 auto;
}

.chartBottom {
  width: 90%;
  min-width: 260px;
  max-width: 500px;
  margin: 0 auto;
}

.chartBottom > div > p {
  margin-top: 10%;
}

.datePicker {
  margin-bottom: 5%;
  width: 80% !important;
}

.demo-progress p {
  display: inline-block;
  width: 25%;
  text-align: left;
}

.progress {
  display: inline-block !important;
  width: 70%;
}

.el-progress-bar__innerText {
  color: black !important;
}

.el-popper.is-pure::-webkit-scrollbar {
  background-color: white;
  height: 10px;
}

.el-popper.is-pure::-webkit-scrollbar-thumb {
  background-color: rgb(238, 238, 238);
}

@media screen and (min-width: 950px) {
  .chartBottom {
    max-width: 1300px;
  }

  .chartBottom > div {
    display: inline-block;
    width: 45%;
  }

  .chartBottom > div:nth-child(1) {
    margin-right: 10%;
  }

  .chartBottom > div:nth-child(2) > p {
    margin-top: 0;
  }
}

@media screen and (max-width: 650px) {
  .el-popper.is-pure {
    width: 97%;
    overflow-x: auto;
    overflow-y: hidden;
  }
}

@media screen and (max-width: 560px) {
  .demo-progress p {
    display: block;
    margin: 5% 0 2% 0;
  }

  .progress {
    display: block !important;
    width: 100%;
  }
}

@media screen and (max-width: 470px) {
  .demonstration {
    margin: 0 0 2% 0;
    display: block;
  }

  .datePicker {
    margin-bottom: 5%;
    width: 100% !important;
  }

  .chartBottom > div:nth-child(2) > p {
    margin-top: 25%;
  }
}
</style>
