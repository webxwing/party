<template>
  <div class="main">
    <div class="topContent">
      <h2>党建工作过程考核活动</h2>
      <h4>{{ $store.state.user.department }}</h4>
    </div>
    <div class="bodyContent">
      <div class="btn-menu">
        <el-button-group>
          <el-button type="success" size="small"  @click="baseFun.gotoLink({path:'/user/main'})">返回</el-button>
        </el-button-group>
      </div>
      <div class="main-table">
        <el-table :data="currentData" border>
          <el-table-column prop="NAME"  label="活动标题" width="330">
          </el-table-column>
          <el-table-column prop="STATUS" label="状态" width="70"></el-table-column>
          <el-table-column label="开始"  width="120">
            <template scope="scope">
              <span>{{ dateFormate(scope.row.STARTTIME) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束"  width="120">
            <template scope="scope">
              <span>{{ dateFormate(scope.row.ENDTIME) }} </span>
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作"    width="160">
            <template scope="scope">
              <el-button type="text" size="small" @click="baseFun.gotoLink({ path: '/user/userResult/'+scope.row.ASSESS_ID})">查看结果</el-button>
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
    name: 'processResult',
    data() {
      return {
        store,
        user: null,
        dateRange: '-',
        title: '-',
        currentData: [],
        workData:[],
        pageSize: 5 ,
        currentPage: 1 ,
        defaultProps: {
          children: 'children',
          label: 'label',
        }
      }
    },
    computed:{
      workLength(){
        return this.workData ? this.workData.length:0;
      }
    },
    store,
    methods: {
      //页码跳转
      handleCurChange(evl){
        this.currentPage = evl;
        this.currentData = this.baseFun.pagination(evl,this.pageSize,this.workData);
      },

      dateFormate(orgDate){
        let tempDate = new Date(orgDate);
        return tempDate.getFullYear() + '.' + ( tempDate.getMonth() + 1) + '.' + tempDate.getDate();
      },


    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;

      //获取所有活动
      this.$http.post('/webapi/getAllAssess_List',qs.stringify({'session_id':this.$store.state.user.sessionID,'subject_id':this.$route.params.subject_id,'department':this.$store.state.user.department}))
        .then((d)=>{
          if(d && d.data.code != '-1'){
            console.log(d.data.value);
            if(d.data.value){
              this.workData = JSON.parse(d.data.value);
              this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
            }
          }
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
    float: right;
    margin: 5px 30px;
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
