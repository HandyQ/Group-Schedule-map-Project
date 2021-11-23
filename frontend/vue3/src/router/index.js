import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/main/main'
import SelectSignup from '@/views/main/select-signup'
import Signup from '@/views/main/signup'
import SuccessSignup from '@/views/main/success-signup'
import FindInfo from '@/views/main/findInfo'
import NewGroup from '@/views/group/new-group'
import GroupInfo from '@/views/group/group-info'
import Calendar from '@/views/calendar/Calendar'
import Schedule from '@/views/schedule/Schedule'
import Chart from '@/views/chart/chart'
import PutSchedule from '@/views/calendar/PutSchedule'
import GroupCalendar from '@/views/groupCalendar/GroupCalendar'
import GroupChart from '@/views/chart/group-chart'
import SearchGroup from '@/views/group/search-group'
import GroupSchedule from '@/views/schedule/GroupSchedule'
import PutGroupSchedule from '@/views/groupCalendar/PutGroupSchedule'

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
  },
  {
    path: '/selectsignup',
    name: 'SelectSignup',
    component: SelectSignup,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/welcome',
    name: 'SuccessSignup',
    component: SuccessSignup,
  },
  {
    path: '/find',
    name: 'FindInfo',
    component: FindInfo,
  },
  {
    path: '/newgroup',
    name: 'NewGroup',
    component: NewGroup,
  },
  {
    path: '/groupInfo/:gid',
    name: 'GroupInfo',
    component: GroupInfo,
    props: true,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule,
  },
  {
    path: '/chart',
    name: 'Chart',
    component: Chart,
  },
  {
    path: '/groupChart/:gid',
    name: 'groupChart',
    component: GroupChart,
    props: true,
  },
  {
    path: '/calendar/putSchedule',
    name: 'PutSchedule',
    component: PutSchedule,
  },
  {
    path: '/groupCalendar',
    name: 'GroupCalendar',
    component: GroupCalendar,
  },
  {
    path: '/searchGroup',
    name: 'SearchGroup',
    component: SearchGroup,
  },
  {
    path: '/groupCalendar/createSchedule',
    name: 'GroupCalendarCreateSchedule',
    component: GroupSchedule,
  },
  {
    path: '/groupCalendar/putSchedule',
    name: 'GroupCalendarPutSchedule',
    component: PutGroupSchedule,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
