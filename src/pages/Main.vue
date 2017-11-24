<template>
<div class="main">
  <div class="topContent">
    <h2>过程考核目录</h2>
  </div>
  <div class="bodyContent">
    <div class="btn-menu">
      <el-button-group>
        <el-button type="primary" size="small" @click="baseFun.gotoLink('new')">新建考核</el-button>
      </el-button-group>
    </div>
    <div class="main-table">
      <el-table :data="currentData" border>
        <el-table-column prop="YEAR" label="年度" width="100"></el-table-column>
        <el-table-column label="标题" width="400">
          <template scope="scope">
            <el-button type="text" @click="baseFun.gotoLink({ path:'/admin/detail/' + scope.row.SUBJECT_ID })">{{ scope.row.NAME }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="STATUS" label="状态" width="100"></el-table-column>

        <el-table-column fixed="right" label="操作"  width="250">
          <template scope="scope">
            <el-button type="text" size="small" @click="baseFun.gotoLink({ name : 'new',params:{ row : scope.row } })">编辑</el-button>
            <el-button type="text" size="small" @click="delParty(scope.row.SUBJECT_ID)">删除</el-button>
            <el-button type="text" size="small" @click="baseFun.gotoLink({ path: '/admin/resource/'+scope.row.SUBJECT_ID})">资源设置</el-button>
            <el-button type="text" size="small" @click="baseFun.gotoLink({ name: 'process',params:{ row : scope.row } })">过程设置</el-button>

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
      name: 'main',
      data() {
        return {
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
      store,
      methods: {
        //页码发生变化
        handleCurChange(evl){
          this.currentPage = evl;
          this.currentData = this.baseFun.pagination(evl,this.pageSize,this.workData);
        },
        //删除
        delParty(subjectID){
          this.$confirm('确定删除该考核？','提示',{
            confimButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            //确认删除
            this.$http.post('/webapi/delParty',qs.stringify( {'session_id':this.$store.state.user.sessionID,'subject_id':subjectID })).then((d)=>{
              if(d!==undefined && d.data.msg == 'success'){
                this.$message({
                  message:'删除成功！',
                  type: 'info',
                  duration: 1500
                });
                this.workData = this.workData.filter((w)=>{ return w.SUBJECT_ID != subjectID });
                this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
              }else{
                this.$message({
                  message:'删除失败:'+d.data.msg,
                  type: 'warning',
                  duration: 1500
                });
              }
            })
          });
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
        let loading = this.$loading({text:"加载中..."});
        this.$http.post('/webapi/getAllParties',qs.stringify({'session_id':this.$store.state.user.sessionID,'department':this.$store.state.user.department})).then((d)=>{
          if(d !== undefined && d.data.msg == 'success'){
            if(d.data.value){
            this.workData = JSON.parse(d.data.value);
            this.currentData = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
            //let test = this.baseFun.pagination(this.currentPage,this.pageSize,this.workData);
            //console.log(test);
            }
            loading.close();
          }else{
            this.$message({
              message: d.data.msg,
              type: 'warning',
              duration: 1500
            });
            loading.close();
          }
        }).catch((err)=>{
          this.$message({
            message: err,
            type: 'warning',
            duration: 1500
          });
          loading.close();
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
</style>
