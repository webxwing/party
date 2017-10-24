import router from '../router'
import axios from 'axios'
import store from '../common/store.js'

//链接跳转
const gotoLink = function(link){
  router.push(link);
}
//验证是否登录，未登录则跳转至登录界面
const isLoginGoTo = function(){
  let name = window.sessionStorage.getItem('name');
  let sessionID = window.sessionStorage.getItem('sessionID');
  let department = window.sessionStorage.getItem('department');
  if( name==null || name.length <=0 || sessionID == null || sessionID.length <=0 ){
    this.gotoLink('login');
    return false;
  }else{
    return true;
  }
}
//验证是否登录
const isLogin = function(){
  let name = window.sessionStorage.getItem('name');
  let sessionID = window.sessionStorage.getItem('sessionID');
  let department = window.sessionStorage.getItem('department');
  if( name==null || name.length <=0 || sessionID == null || sessionID.length <=0 ){
    return false;
  }else{
    return true;
  }
}

//注销
const logout = function(){
  window.sessionStorage.clear();
  router.push({ name:'login'});
}

//数组的分页
const pagination = function(pageNo,pageSize,array){
  var offset = (pageNo - 1) * pageSize;
  return ( offset + pageSize >= array.length) ?
    array.slice( offset,array.length) :
    array.slice( offset,offset + pageSize);
}
//服务器URL地址
const baseURL = 'http://localhost:53975';

export default {
  gotoLink,
  isLogin,
  isLoginGoTo,
  logout,
  pagination,
  baseURL
};
