<template>
  <div class="main">
    <div class="topContent">
      <h2>工作过程考核详情</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
          <div class="info-content">
            <el-tag type="success">所选考核：{{ selectWorkItem.name.length >= 40 ? selectWorkItem.name.slice(0,40) + '...' : selectWorkItem.name  }}</el-tag>
          </div>
        </div>
        <el-popover ref="popover4"
                    placement="left"
                    width="420"
                    trigger="click">
          <el-tree :data="data"
                   :loading ="loading"
                   node-key = "id"
                   @node-click="workNodeClick"
                   :props="defaultProps"
                   ref="trees">
          </el-tree>
        </el-popover>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="所有条目查看、选择" placement="top">
              <el-button type="primary"  size="small" v-popover:popover4>考核总览</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink( { name:'main'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="menu">
        <div class="departments">
          <div class="info-content">
            <span>有资料部门：</span><el-select v-model="fileDepartmentsSelect" placeholder="有资料上传部门" @change="fileDepartChange">
            <el-option v-for="department in fileDepartments" :key="department.department" :label="department.department" :value="department.department">

            </el-option>
          </el-select><span> - </span>
            <span>无资料部门：</span><el-select v-model="noFileDepartmentsSelect" placeholder="无资料上传部门">
            <el-option v-for="department in noFileDepartments" :key="department.department" :label="department.department" :value="department.department">
            </el-option>
          </el-select>
          </div>
        </div>
      </div>
      <div class="rightContent">
        <h3>资源详情</h3>
        <div class="ContentDetail" v-if="selectResExp">
          <el-row>
            <el-tag type="success">超时属性：{{ selectResExp.timeoutEx }}</el-tag>
            <span></span>
            <el-tag type="success">目录属性：{{ selectResExp.allowEx }}</el-tag>
          </el-row>
          <el-row>
            <el-tag type="success">允许上传时间：{{ selectResExp.dateRange}}</el-tag>
          </el-row>
        </div>
        <div class="ContentDetail">
          <el-collapse v-model="fileListName">

            <el-collapse-item title="文件列表" name="1">
              <ul>
                <li v-for="fileItem in filesList">
                  <a :title='showFileCreator(fileItem.CREATOR,fileItem.CREATETIME)' @click="downloadFile(fileItem.FILES_ID)" style="cursor:pointer">
                    <i class="el-icon-document"></i>
                    <span :class=" {'colorBlue' : fileItem.DEPARTMENT != 'share' }" >  &nbsp; {{ fileItem.FILENAME }}</span>
                    <el-tag type="primary" v-if="fileItem.EXPIRE == 'yes' && fileItem.DEPARTMENT != 'share'">逾期</el-tag>
                  </a>
                </li>
              </ul>
              <div v-if="filesList.length <= 0">
                没有任何文件
              </div>
            </el-collapse-item>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="leftContent">
        <div class="rightUpContent">

        </div>
        <div class="rightDownContent">
          <div class="top">
            <h3>资源目录</h3>
          </div>
          <div class="btnPanel">
            <div class="btnLeft">
              <span>所选资源：{{  showResName  }}</span>
            </div>
            <div class="btnRight">

            </div>
          </div>
          <div class="resource">
            <el-tree :data="rData"
                     :default-expand-all = "true"
                     :v-loading = "resLoading"
                     class="tree-style"
                     :render-content = 'renderContent'
                     @node-click="resNodeClick"
                     highlight-current
                     node-key = "id"
                     :props="defaultProps"
                     ref="resource">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'detail',
    data() {
      return {
        data: [],
        user:null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        //资源目录树
        rData:[],
        //所选考核条目
        selectWorkItem:{
          children : [],
          id : null,
          memo : '--',
          value : '--',
          name : '--'
        },
        //所选资源条目
        selectResItem:null,
        selectResExp:null,
        //目录树等待动画
        loading: true,
        //资源树等待动画
        resLoading: true,
        fileListName: '1',
        //上传部门和未上传部门
        noFileDepartments : [],
        fileDepartments : [],
        noFileDepartmentsSelect : '',
        fileDepartmentsSelect : '',
        //文件列表
        filesList:[]
      }
    },
    store,
    methods: {
      renderContent(h,{ node ,data,store }){
        if(data.department != 'share'){
          return (
            <span style="color:blue">
             { node.label }
           </span >
          )
        }else{
          return (
            <span>
             { node.label }
           </span >
          )
        }

      },
      //节点点击事件
      workNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        this.selectWorkItem = data;
        //console.log(data);
        //当前条目资源分类初始化

        //获取资料上传和未上传部门
        let fileDepartUrl = "/webapi/get_Item_All_HasFiles_Department_Admin";
        let noFileDepartUrl = "/webapi/get_Item_All_HasNoFiles_Department_Admin";
        let departParmas = {
          session_id :this.user.sessionID ? this.user.sessionID : '',
          item_id : data.id
        }
        this.$http.post(fileDepartUrl,qs.stringify(departParmas)).then((d)=>{
          if( d!= undefined && d.data.msg == 'success' && d.data.value){
            //console.log(d.data.value)
            this.fileDepartments = JSON.parse(d.data.value);
          }else{
            this.rData = [];
            this.fileDepartments = [];
            this.noFileDepartmentsSelect = '';
            this.fileDepartmentsSelect =  '';
          }
        });
        this.$http.post(noFileDepartUrl,qs.stringify(departParmas)).then((d)=>{
          if( d!= undefined && d.data.msg == 'success' && d.data.value){
            //console.log(d.data.value)
            this.noFileDepartments = JSON.parse(d.data.value);
          }else{
            this.rData = [];
            this.noFileDepartments = [];
            this.noFileDepartmentsSelect = '';
            this.fileDepartmentsSelect =  '';
          }
        })
      },
      resNodeClick(data,node,self){
        this.$refs.resource.setCheckedKeys([]);
        node.checked = true;
        this.selectResItem = data;
        this.selectResExp = null;
        //console.log(this.selectResItem); item_id
        //获取资源属性并显示
        let getItemPostUrl = '/webapi/getItemResExpireDate';
        let getItemParams = {
          session_id : this.user.sessionID ? this.user.sessionID : '',
          department : this.user.department ? this.user.department : '',
          item_directory_id : this.selectResItem.id
        };
        this.$http.post(getItemPostUrl,qs.stringify(getItemParams)).then((d)=>{
          if( d !=undefined && d.data.msg == 'success') {
            //初始化
            var item = JSON.parse(d.data.value);
            var startTime = new Date(item[0].STARTTIME);
            var endTime = new Date(item[0].ENDTIME);
            this.selectResExp = [];
            this.selectResExp.dateRange = startTime.getFullYear()+"/"+(startTime.getMonth()+1) +"/" + startTime.getDate() + " - " + endTime.getFullYear()+"/"+(endTime.getMonth()+1) +"/" + endTime.getDate();
            this.selectResExp.timeoutEx = this.expireFilter(item[0].EXPIRE_OPER);
            this.selectResExp.allowEx = this.allowFileter(item[0].ALLOWDIR);
          }else{
            this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
        //获取文件列表
        let getFilesUrl = "/webapi/getFilesList_Department_Admin";
        let getFilesParams = {
          session_id :this.user.sessionID ? this.user.sessionID : '',
          item_directory_id : this.selectResItem.id,
          department : this.fileDepartmentsSelect
        }
        this.$http.post(getFilesUrl,qs.stringify(getFilesParams)).then((d)=>{
          if( d !=undefined && d.data.msg == 'success' && d.data.value) {
            //显示文件列表
            var files = JSON.parse(d.data.value);
            this.filesList = files;
          }else{
            this.filesList = [];

          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });

      },
      //是否有节点被选中
      isCheck(node){
        if(node == undefined||node.length<=0){
          this.$message({message:'请选择操作目录！',type:'warning',duration:1500});
          return false
        }else{
          return true;
        }
      },
      expireFilter(value){
        switch(value){
          case "no": return '禁止上传';break;
          case "yes": return '允许上传';break;
          case "assess": return '允许上传(要考核)';break;
        }
      },
      allowFileter(value){
        switch(value){
          case ",yes,": return '创建、上传';break;
          case ",yes,nofile,": return '创建、禁止上传';break;
          case ",no,": return '禁止创建、禁止上传';break;
        }
      },
      //选择有资料部门
      fileDepartChange(value){
        let rPostUrl = '/webapi/getItemRes_Department';
        let rParams = {
          session_id : this.user.sessionID ? this.user.sessionID : '',
          subject_id :this.$route.params.subject_id ? this.$route.params.subject_id : '',
          department : value,
          item_id :  this.selectWorkItem.id
        }
        this.$http.post(rPostUrl, qs.stringify(rParams)).then((d)=>{
          if( d !=undefined && d.data.msg == 'success'){
            if(d.data.value){
              //console.log(d.data.value);
              this.rData = new Array(d.data.value);

            }else{
              this.rData = [];
              this.selectResItem = {};
            }
          }else{
            this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
        this.resLoading = false;
      },
      //文件列表悬浮提示
      showFileCreator(creator,createTime){
        return '上传者：'+creator +',  时间：' + createTime;
      },
      downloadFile(fileId){
        let baseUrl = this.baseFun.baseURL;
        let downParams = {
          session_id : this.user.sessionID ? this.user.sessionID : '',
          files_id : fileId,
          department : this.fileDepartmentsSelect
        }
        window.location.href = baseUrl + "/webapi/getFile_Department_Admin?session_id=" + downParams.session_id + "&files_id=" + downParams.files_id + "&department=" + downParams.department;
      }

    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      //获取体系树目录
      let postUrl = '/webapi/getAllPartyItems';
      let params = {
        session_id : this.user.sessionID ? this.user.sessionID : '',
        subject_id : this.$route.params.subject_id ? this.$route.params.subject_id : ''
      }
      this.$http.post(postUrl, qs.stringify(params)).then((d)=>{
        if( d !=undefined && d.data.msg == 'success'){
          this.data = new Array(d.data.value);
        }else{
          this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
        }
      }).catch((err)=>{
        this.$message({ message:'服务器'+err,type:'error',duration:1500 });
      });
      this.loading = false;
    },
    computed: {
      showResName: function(){
        if(this.selectResItem  && this.selectResItem.name){

          if(this.selectResItem.name.length >18 ){
            return this.selectResItem.name.slice(0,18) + '...';
          }else{
            return this.selectResItem.name;
          }
        }else{
          return "空";
        }
      }

    }
  }
</script>
<style scoped>
  /*重写*/
  .topContent{
    margin: 3px auto !important;
  }

  .leftContent {
    position: relative;
    width: 445px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }

  .rightContent {
    position: relative;
    width: 445px;
    height: auto;
    float: right;
    margin-right: 30px;
  }
  .rightUpContent,.rightDownContent {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0;
  }
  .rightDownContent {
    /*margin-top: 10px;*/
    margin-bottom: 10px;
  }

  h3 {
    padding-left: 10px;
    width: 435px;
    height: 28px;
    line-height: 28px;
    color: #EFEFEF;
    background: #58B7FF;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    -moz-border-radius-topright: 5px;
    -moz-border-radius-topleft: 5px;
    -webkit-border-top-left-radius: 5px;
    -webkit-border-top-right-radius: 5px;
  }
  .el-tree {
    min-height: 38px;
    width: 100%;
  }
  .resource .el-tree{
    min-height: 38px;
    width: 443px;
    border: 1px solid #58B7FF;
    border-top: 1px solid rgb(193,193,193) !important;
  }
  .btnPanel {
    position: relative;
    width: 433px;
    height: 28px;
    padding: 5px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
  }
  .btnPanel .btnLeft {
    float: left;
    line-height: 28px;
    width: 100%;
  }
  .btnPanel .btnLeft span {
    margin-top: 5px;
  }
  .btnPanel .btnRight {
    text-align: right;
    float: right;
    width: 35%;
  }
  .resTree{
    margin-bottom: 10px;
  }
  .ContentDetail{
    width: 443px;
    border: 1px solid #58B7FF;
    border-top: none;
  }
  .info-content{
    margin-left:30px;
  }
  .menu .departments{
    margin-bottom: 8px;
    display:block;
  }
  .colorBlue{
    color:blue;
  }
</style>

