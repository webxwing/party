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
import Detail from '@/pages/Detail.vue'
import ChooseWork from '@/components/ChooseWork.vue'
import ProcessGrade from '@/pages/ProcessGrade.vue'

import UserLogin from '@/user/Login.vue'
import UserMain from '@/user/Main.vue'
import UserProcess from '@/user/Process.vue'

import Upload from '@/pages/upload.vue'

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
    { path: '/admin/detail', name:'detail', component: Detail },
    { path: '/admin/resource/:subject_id', name:'resource', component: Resource },
    { path: '/admin/process', name:'process', component: Process },
    { path: '/admin/processnew', name:'processnew', component: ProcessNew },
    { path: '/admin/choosework', name:'choosework', component: ChooseWork },
    { path: '/admin/processgrade', name:'processgrade', component: ProcessGrade }
    ,
    { path:'/user/login',name:'userlogin',component:UserLogin},
    { path:'/user/main',name:'usermain',component:UserMain },
    { path:'/user/process',name:'userprocess',component:UserProcess }
    ,
    { path:'/user/upload',name:'userupload',component:Upload }
  ]
})
