<template>
  <el-space wrap class="todoitem-card-wrap">
    <el-card class="box-card todoitem-card" v-if="state.isTodoItem && state.toDo">

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <div class="todoitem-card-color">
            <span class="todoitem-card-color-box" v-bind:style="{backgroundColor: state.toDo.backgroundColor}"></span>
          </div>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-header-title">
          <span>
            {{ state.toDo.title }}
          </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Calendar />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-time">
          <span>
            {{ 
              ((state.toDo.start.toString().split(' ')[4].substring(3, 5) === '00') ? (`${state.toDo.start.toString().split(' ')[4].substring(0, 2)}시`) : `${state.toDo.start.toString().split(' ')[4].substring(0, 2)}시 ${state.toDo.start.toString().split(' ')[4].substring(3, 5)}분`)   
            }}
          </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Location />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-place">
          <span>
              {{ state.toDo.extendedProps.placeName }}
            </span>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <User />
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="group-todoitem-card-participant">
          <div v-for="par in state.toDo.extendedProps.participant" :key="par.uid" class="group-todoitem-card-participant-element">
            <el-button v-if="par.completed" size="mini" type="info" plain>
              {{ par.nickname }}
            </el-button>
            <el-button v-if="!par.completed" size="mini">
              {{ par.nickname }}
            </el-button>
          </div>
        </el-col>
      </el-row>

      <el-row class="todoitem-card-contents-wrap">
        <el-col :span="2">
          <el-icon>
            <Document />  
          </el-icon>
        </el-col>
        <el-col :span="21" :offset="1" class="todoitem-card-contents-content">
          {{ state.toDo.extendedProps.content }}
        </el-col>
      </el-row>

    </el-card>
  </el-space>
</template>

<script>
import { computed, reactive } from 'vue'
import { useStore } from 'vuex'

//icons
import { Calendar, Location, Document, User } from '@element-plus/icons'

export default {
  name: "TodoListCurrentCheck",
  components: {
    Calendar,
    Location,
    Document,
    User,
  },
  setup() {
    const store = useStore()

    const state = reactive({
      toDo: computed(() => store.state.groupToDo),
      isTodoItem: computed(() => store.state.isGroupTodoItem)
    })
    return { state }
  }
}
</script>

<style>

</style>