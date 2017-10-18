import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
  //user : { name:'huyuan',sessionID:'ceb4272f-7356-4add-81d4-c2a089cfbe73_11:55:00',department:'信息中心' },
  user : { name:null,sessionID:null,department:null },
  newParty: { }
};
const mutations = {
  add(state){
    state.count++;
  },
  reduce(state){
    state.count--;
  },
  editSessionID(state){

  },
  //初始化用户信息
  initialUser(state){
    state.user.name = window.sessionStorage.getItem('name');
    state.user.sessionID = window.sessionStorage.getItem('sessionID');
    state.user.department = window.sessionStorage.getItem('department');

  },
  //初始化新建考核
  initNewParty(state){
    let newPartyStorage = window.sessionStorage.getItem('newParty');
    if(newPartyStorage!=null){
      state.newParty = JSON.parse(newPartyStorage);
    }
  }
}
export default new Vuex.Store({
  state,mutations
})
