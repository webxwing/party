<template>
  <div class="main">
    <div class="topContent">
      <h2>过程考核目录</h2>
    </div>
    <div class="bodyContent">
      <div class="btn-menu">

      </div>
      <div class="main-table">
        <el-table :data="currentData" border>
          <el-table-column width="200">
            <template scope="scope">
              <span> {{ dateFormate(scope.row.STARTTIME
,scope.row.ENDTIME) }} </span>
            </template>
          </el-table-column>
          <el-table-column prop="NAME" label="标题" width="400"></el-table-column>
          <el-table-column prop="STATUS" label="状态" width="150"></el-table-column>

          <el-table-column fixed="right" label="操作"  width="100">
            <template scope="scope">
              <el-button type="text" size="small" @click="baseFun.gotoLink({ name : 'gradeoperate',params:{ row : scope.row } })">考核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :page-size = "pageSize"
          :total="workLength"
          @current-change="handleCurChange">
        </el-pagination>
      </div>
      <div class="help">
        <p><el-tag type="primary"><i class="el-icon-warning"></i> 说明</el-tag></p>
        <p>制定：创建结构，用户不能访问</p>
        <p>维护：结构、内容正在修改，用户不能访问</p>
        <p>发布：用户可读写访问（对处于评分状态的条目只能只读访问）</p>
        <p>完成：用户只读访问</p>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name:'gradeindex',
    store,
    data(){
      return {
        user:null,
        //所有数据
        workData:[],
        //当前显示页数据
        currentData:[],
        total: 1000,
        pageSize: 5,
        currentPage: 1
      }
    },
    computed:{
      workLength(){
        return this.workData ? this.workData.length:0;
      }
    },
    methods:{
      //页码发生变化
      handleCurChange(evl){
        this.currentPage = evl;
        this.currentData = this.baseFun.pagination(evl,this.pageSize,this.workData);
      },
      dateFormate(starttime,endtime){
        let startTime = new Date(starttime);
        let endTime = new Date(endtime);
        return startTime.getFullYear()+"/"+(startTime.getMonth()+1) +"/" + startTime.getDate() + " - " + endTime.getFullYear()+"/"+(endTime.getMonth()+1) +"/" + endTime.getDate();
      }
    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      //获取当前部门下的所有考核workData
      let loading = this.$loading({text:"加载中..."});

            this.$http.post('/webapi/getAllAssess_Man ',qs.stringify({ session_id:this.user.sessionID }))
              .then((d)=>{
                if(d&&d.data.code!='-1'){
                  this.workData = JSON.parse(d.data.value);
                  //console.log(this.workData);
                  this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
                  loading.close();
                }else if(d&&d.data.code=='-1'){
                  this.$message({
                    message: d.data.msg,
                    type: 'warning',
                    duration: 1500
                  });
                }
              })
              .catch((d)=>{
                this.$message({
                message: d,
                  type: 'error',
                  duration: 1500
                });
              });
        /*
            //518da9e9-7b1f-49d1-9740-6641c8bdf242
            //[{"subject_id":48,"subject_name":"测试1","ASSESS_ID":"518da9e9-7b1f-49d1-9740-6641c8bdf242","NAME":"考核活动1","STARTTIME":"2017/11/1 0:00:00","ENDTIME":"2017/11/30 0:00:00","MEMO":"说明测试","SUBJECT_ID1":48,"CREATETIME":"2017/11/14 10:29:19","CREATOR":"陈智秋","UPDATETIME":"2017/11/23 9:58:19","MODIFIER":"陈智秋","VALUE":12,"STATUS":"启动"}]
            this.$http.post('/webapi/getAllAssess_Item_Man',qs.stringify( {
              session_id:this.user.sessionID,
              assess_id: '518da9e9-7b1f-49d1-9740-6641c8bdf242'
            }))
              .then((d)=>{
                console.log(d.data.value);
              })
            //{"code":0,"msg":"success","value":{"id":"39c5ff93-c6da-4959-a34e-6f372cf21269","parent_id":"","name":"测试1","memo":"","value":80,"assess_item_id":"","assess_memo":"","assess_value":23,"children":[{"id":"561c4695-cf26-4f4d-b570-b1bb8ae86735","parent_id":"39c5ff93-c6da-4959-a34e-6f372cf21269","name":"条目1","memo":"","value":80,"assess_item_id":"","assess_memo":"","assess_value":23,"children":[{"id":"0df9e7f4-574c-43df-a4c3-e28844add38e","parent_id":"561c4695-cf26-4f4d-b570-b1bb8ae86735","name":"条目1-1","memo":"","value":0,"assess_item_id":"6d4b0025-aeb7-41dd-a606-daf4a8d2e160","assess_memo":"评分说明要求。","assess_value":6,"children":null},{"id":"c388e9e0-3f6a-4cf8-8f22-4629315bd4ba","parent_id":"561c4695-cf26-4f4d-b570-b1bb8ae86735","name":"条目1-2","memo":"","value":80,"assess_item_id":"","assess_memo":"","assess_value":17,"children":[{"id":"02e4b115-9d8c-4cbd-a584-98335c69d710","parent_id":"c388e9e0-3f6a-4cf8-8f22-4629315bd4ba","name":"条目1-2-1","memo":"","value":80,"assess_item_id":"4655a88d-87af-4229-bec8-1b6ca3f42ed6","assess_memo":"情况说明","assess_value":17,"children":null}]}]}]}}
            //561c4695-cf26-4f4d-b570-b1bb8ae86735
            //资源目录树
            this.$http.post('/webapi/getAssessItemRes_Man',qs.stringify( {
              session_id:this.user.sessionID,
              assess_id: '0df9e7f4-574c-43df-a4c3-e28844add38e',
              item_id:'561c4695-cf26-4f4d-b570-b1bb8ae86735',
              department:'信息中心'
            } ))
              .then((d)=>{
                console.log(d.data.value);
              })
            this.$http.post('/webapi/getAssess_Man_RelevantDepartment',qs.stringify({
              session_id:this.user.sessionID,
              assess_item_id: '4655a88d-87af-4229-bec8-1b6ca3f42ed6',
              man_id : this.user.name
            }))
              .then((d)=>{
                console.log(d.data.value);
              })
      */
    }
  }
</script>
<style scoped>
  .el-table {
    width: 900px;
    margin: 0 auto;
  }
  .btn-menu {
    display: inline-block;
    margin-left: 30px;
    margin-bottom: 10px;
  }
  .pagination{
    width: 100%;
    margin: 10px auto;
    text-align: center;
  }
  .help{
    display: inline-block;
    margin-left: 30px;
  }
  .help p {
    margin: 5px;
  }
</style>
