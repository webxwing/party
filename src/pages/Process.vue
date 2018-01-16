<template>
  <div class="main">
    <div class="topContent">
      <h2>党建考核过程活动目录</h2>
    </div>
    <div class="bodyContent">
      <div class="menu-title">
        <el-row>
          <el-col :span="1"><el-tag type="success">标题</el-tag></el-col>
          <el-col :span="21"><h4>{{ title }}</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="1"><el-tag type="success">时间</el-tag></el-col>
          <el-col :span="21"><h4>{{ dateRange }}</h4></el-col>
        </el-row>
      </div>
      <div class="btn-menu">
        <el-button-group>
          <el-button type="primary" size="small" @click="baseFun.gotoLink({ path:'/admin/processnew' })">新建活动</el-button>
          <el-button type="success" size="small"  @click="baseFun.gotoLink({path:'/admin/main'})">返回</el-button>
        </el-button-group>
      </div>
      <div class="main-table">
        <el-table :data="currentData" border>
          <el-table-column label="活动时间" width="190">
            <template scope="scope">
              <span>{{ dateFormate(scope.row.STARTTIME) +' - '+ dateFormate(scope.row.ENDTIME) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="NAME" label="活动名称" width="350"></el-table-column>
          <el-table-column prop="STATUS" label="状态" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作"  width="240">
            <template scope="scope">
              <el-button type="text" size="small" @click="baseFun.gotoLink({path:'/admin/processedit/' + scope.row.ASSESS_ID  })">编辑内容</el-button>
              <el-button type="text" size="small" @click="baseFun.gotoLink({path:'/admin/processgrade/' + scope.row.ASSESS_ID })">评分设置</el-button>
              <el-button type="text" size="small" @click="delAssess(scope.row.ASSESS_ID)">删除</el-button>
              <el-button type="text" size="small" @click="baseFun.gotoLink({ path:'/admin/result/' + scope.row.ASSESS_ID })">得分</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :page-size = "pageSize"
          :total = "workLength"
          @current-change="handleCurChange">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'process',
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

      delAssess(assess_id){
        this.$confirm('确定删除该考核活动？','提示',{
          confimButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let delAssessUrl = '/webapi/delAssess/';
          let delAssessParams = {
            'session_id' : this.user.sessionID,
            'assess_id' : assess_id
          }
          this.$http.post(delAssessUrl,qs.stringify(delAssessParams)).then((d)=>{
            if(d && d.data.code != '-1'){
              this.workData = this.workData.filter((w)=>{ return w.ASSESS_ID != assess_id });
              this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
              this.$message({ message:'删除成功！',type:'success',duration: 1500});
            }else if( d && d.data.code == '-1'){
              this.$message({ message: d.data.msg , type:'warning',duration: 1500});
            }else{
              this.$message({ message: '删除失败，请重试！' , type:'error',duration: 1500});
            }

          }).catch((err)=>{
            this.$message({ message: err ,type:'error',duration: 1500});
          })

        });

      }
    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      if(this.$route.params.row){
        //缓存row
        window.sessionStorage.setItem('processRow',JSON.stringify(this.$route.params.row));
        //显示标题和时间
        this.title = this.$route.params.row.NAME;
        this.dateRange = this.dateFormate(this.$route.params.row.STARTTIME)+" - "+ this.dateFormate(this.$route.params.row.ENDTIME);
        //获取考核活动
        this.$http.post('/webapi/getAllAssess',qs.stringify({'session_id':this.user.sessionID,'subject_id':this.$route.params.row.SUBJECT_ID})).then((d)=>{
          if(d && d.data.code != '-1'){
            if(d.data.value){
              this.workData = JSON.parse(d.data.value);
              this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
            }
          }
        }).catch((err)=>{
          this.$message({message:err.message,type:'error',duration:1500});
        })
      }else{
        //获取缓存
        let sessionRow = window.sessionStorage.getItem('processRow');
        let row = JSON.parse(sessionRow);
        //显示标题和时间
        this.title = row.NAME;
        this.dateRange = this.dateFormate(row.STARTTIME)+" - "+ this.dateFormate(row.ENDTIME);
        //获取考核活动
        this.$http.post('/webapi/getAllAssess',qs.stringify({'session_id':this.user.sessionID,'subject_id':row.SUBJECT_ID})).then((d)=>{
          if(d && d.data.code != '-1'){
            if(d.data.value){
              this.workData = JSON.parse(d.data.value);
              this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
            }
          }
        }).catch((err)=>{
          this.$message({message:err.message,type:'error',duration:1500});
        })
      }

    }
  }
</script>
<style scoped>
  .el-table {
    width: 900px;
    margin: 0 auto;
  }
  .menu-title {
    width: 900px;
    margin: 5px 30px;
  }
  .menu-title .el-row .el-col {
    margin: 5px;
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
</style>
