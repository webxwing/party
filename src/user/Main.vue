<template>
  <div class="main">
    <div class="topContent">
      <h2>党建工作过程考核目录</h2>
      <h4>{{ $store.state.user.department }}</h4>
    </div>
    <div class="bodyContent">
      <div class="btn-menu">

      </div>
      <div class="main-table">
        <el-table :data="currentData" border>
          <el-table-column prop="YEAR" label="年度" width="90"></el-table-column>
          <el-table-column  label="标题" width="330">
            <template scope="scope">
              <el-button type="text" @click="baseFun.gotoLink({ path:'/user/process/' + scope.row.SUBJECT_ID })">{{ scope.row.NAME }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="STATUS" label="状态" width="70"></el-table-column>
          <el-table-column label="开始"  width="110">
            <template scope="scope">
              {{ dateFormate(scope.row.STARTTIME) }}
            </template>
          </el-table-column>
          <el-table-column label="结束"  width="110">
            <template scope="scope">
              {{ dateFormate(scope.row.ENDTIME) }}
            </template>
          </el-table-column>
          <el-table-column  label="得分"  width="70">0</el-table-column>
          <el-table-column  label="总分"  width="70" fixed="right">100</el-table-column>
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
    name: 'usermain',
    data() {
      return {
        workData:[],
        currentData:[],
        workLength: 0,
        pageSize: 5,
        currentPage: 1
      }
    },
    store,
    methods: {
      //页码发生变化
      handleCurChange(evl){
        this.currentPage = evl;
        this.currentData = this.baseFun.pagination(evl,this.pageSize,this.workData);
      },
      dateFormate(dateValue){
        var tempDate = new Date(dateValue);
        return tempDate.getFullYear() + "-" + ( tempDate.getMonth() + 1) + "-" + tempDate.getDate();
      }
    },
    beforeCreate(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      store.commit('initNewParty');
    },
    mounted(){
      //获取当前部门下的所有考核workData
      this.$http.post('/webapi/getAllParties_Department',qs.stringify({'session_id':this.$store.state.user.sessionID,'department':this.$store.state.user.department})).then((d)=>{
        if(d !== undefined && d.data.msg == 'success'){
          if(d.data.value){
            this.workData = JSON.parse(d.data.value);
            this.workLength = this.workData.length;
            this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
          }
        }else{
          this.$message({
            message: d.data.msg,
            type: 'warning',
            duration: 1500
          });
        }
      }).catch((err)=>{
        this.$message({
          message: err,
          type: 'warning',
          duration: 1500
        });
      })
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
  h3{
    margin: 5px;
  }
</style>
