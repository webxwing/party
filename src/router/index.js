import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login.vue'
import Main from '@/pages/Main.vue'
import Error from '@/pages/Error.vue'
import Hello from '@/components/Hello.vue'
import New from '@/pages/New.vue'
import New2 from '@/pages/New2.vue'
import New3 from '@/pages/New3.vue'
import New4 from '@/pages/New4.vue'
import Resource from '@/pages/Resource.vue'
import Process from '@/pages/Process.vue'
import ProcessNew from '@/pages/ProcessNew.vue'
import ProcessEdit from '@/pages/ProcessEdit.vue'
import Detail from '@/pages/Detail.vue'
import ChooseWork from '@/components/ChooseWork.vue'
import ProcessGrade from '@/pages/ProcessGrade.vue'
import Result from '@/pages/Result.vue'

import UserLogin from '@/user/Login.vue'
import UserMain from '@/user/Main.vue'
import UserProcess from '@/user/Process.vue'
import UserProcessRst from '@/user/ProcessResult.vue'
import UserResult from '@/user/Result.vue'

import Upload from '@/pages/upload.vue'

import GradeIndex from '@/grade/index.vue'
import Operate from '@/grade/Operate.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'root', component: Login },
    { path: '*', name: '404', component: Error },

    { path: '/admin/login', name: 'login', component: Login },
    { path: '/admin/main', name: 'main', component: Main },
    { path: '/admin/new', name:'new', component: New },
    { path: '/admin/new2', name:'new2', component: New2 },
    { path: '/admin/new3', name:'new3', component: New3 },
    { path: '/admin/new4', name:'new4', component: New4 },
    { path: '/admin/detail/:subject_id', name:'detail', component: Detail },
    { path: '/admin/resource/:subject_id', name:'resource', component: Resource },
    { path: '/admin/process/', name:'process', component: Process },
    { path: '/admin/processnew', name:'processnew', component: ProcessNew },
    { path: '/admin/processedit/:assess_id',name:'processedit',component:ProcessEdit},
    { path: '/admin/choosework', name:'choosework', component: ChooseWork },
    { path: '/admin/processgrade/:assess_id', name:'processgrade', component: ProcessGrade },
    { path: '/admin/result/:assess_id', name:'result', component: Result }
    ,
    { path:'/user/login',name:'userlogin',component:Login},
    { path:'/user/main',name:'usermain',component:UserMain },
    { path:'/user/process/:subject_id',name:'userprocess',component:UserProcess },
    { path:'/user/processResult/:subject_id',name:'userprocess',component:UserProcessRst },
    { path:'/user/userResult/:assess_id',name:'userprocess',component:UserResult }
    ,
    { path:'/user/upload',name:'userupload',component:Upload }
    ,
    { path:'/grade/index',name:'gradeindex',component:GradeIndex },
    { path:'/grade/operate/:assess_id',name:'gradeoperate',component:Operate }  ]
})
