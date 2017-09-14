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
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'hello', component: Hello },
    { path: '/admin/login', name: 'login', component: Login },
    { path: '/admin/main', name: 'main', component: Main },
    { path: '/admin/new', name:'new', component: New},
    { path: '/admin/new2', name:'new2', component: New2},
    { path: '/admin/new3', name:'new3', component: New3},
    { path: '/admin/new4', name:'new4', component: New4},
    { path: '*', name: '404', component: Error }
  ]
})
