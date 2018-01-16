<template>
  <div class="main">
    <div class="topContent">
      <h2>党建工作考核实施</h2>
      <h4>{{$store.state.user.department}}</h4>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
          <div class="info-content" v-if="selectNodeData.id != ''">
            <el-row>
              <el-tag type="success">所选考核：{{ selectNodeData.name.length >= 40 ? selectNodeData.name.slice(0,40) + '...' : selectNodeData.name  }}</el-tag>
            </el-row>
            <el-row>
              <el-tag type="success">分数：</el-tag> {{ selectNodeData.value }} 分
            </el-row>
            <el-row>
              <el-tag type="success">考核要求及评分细则：</el-tag> {{ selectNodeData.memo }}
            </el-row>
          </div>
        </div>
        <div class="button-group">
          <el-popover ref="popover4"
                      placement="left"
                      width="420"
                      trigger="click">
            <el-tree :data="data"
                     node-key = "id"
                     :props="defaultProps"
                     highlight-current
                     @node-click="handleNodeClick"
                     :default-expanded-keys = "defaultChecked"
                     ref="trees">
            </el-tree>
          </el-popover>
          <el-button-group>
            <el-tooltip class="item" effect="light" content="点击查看整个考核内容" placement="top">
              <el-button type="primary" size="small"  v-popover:popover4>选择(查看)考核项目</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" @click="baseFun.gotoLink({ path:'/user/main'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>

      <div class="leftContent">
        <h3>资源目录</h3>
        <div class="leftContentDetail">
          <div class="btnPanel">
            <div class="btnLeft">
              <span>所选资源：{{  showResName  }}</span>
            </div>
            <div class="btnRight">
              <el-button-group>
                <el-button type="primary"  size="mini" icon="plus" @click="addClass" ></el-button>
                <el-button type="primary"  size="mini" icon="edit" @click="editClass"></el-button>
                <el-button type="primary"  size="mini" icon="delete" @click="delClass"></el-button>
              </el-button-group>
              <el-button-group>
                <el-button type="primary" size="mini" icon="upload" @click="uploadClass">文件</el-button>
              </el-button-group>
            </div>
          </div>
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
                    <span :class=" {'colorBlue' : fileItem.DEPARTMENT != 'share'}" >  &nbsp; {{ fileItem.FILENAME }}</span>
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
      <el-dialog
        :visible.sync="dialogUpload"
        :close-on-click-modal = "false"
        @close="uploadDialogClose"
        size="small"
        title="文件上传">
        <div class="uploadContent">

          <el-row>
            <el-col :span="24">
              <el-tag type="primary"><i class="el-icon-warning"></i> 当前目录：{{ showResName }}</el-tag>
            </el-col>
          </el-row>
          <el-row><p> </p></el-row>
          <el-row>
            <el-col :span="24">
              <el-upload
                ref="upload"
                :action="uploadUrl"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :auto-upload="false"
                :multiple = "true"
                :data = "fileParams"
                :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button size="small" type="success" @click="submitUpload">点击上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'userprocess',
    store,
    data(){
      return {
        data: [],
        rData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        //默认展开
        defaultChecked: [1],
        //所选节点
        selectNodeData: {
          id:'',
          memo: '',
          name: '',
          value: ''
        },
        //所选资源节点
        selectResItem:[],
        selectResExp : null,
        resLoading: true,
        //上传文件时附带的额外参数
        fileParams:{},
        fileListName: '1',
        //资源详情文件列表
        filesList:[],
        //文件上传对话框控制
        dialogUpload: false,
        //上传文件列表
        fileList:[],
        //文件上传的URL
        uploadUrl: this.baseFun.baseURL+'/webapi/addFiles_Department'
      }
     },
    methods:{
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
      //是否有节点被选中
      isCheck(node){
        if(node == undefined||node.length<=0){
          this.$message({message:'请选择操作目录！',type:'warning',duration:1500});
          return false
        }else{
          return true;
        }
      },
      //节点点击事件
      handleNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        /* 叶子节点
        if( data.children == null || data.children.length <= 0){

        }
        */
        this.selectNodeData = data;
        //获取当前选择资源目录树
        let rPostUrl = '/webapi/getItemRes_Department';
        let rParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          subject_id :this.$route.params.subject_id ? this.$route.params.subject_id : '',
          department : store.state.user.department ? store.state.user.department : '',
          item_id :  data.id
        };
        this.$http.post(rPostUrl, qs.stringify(rParams)).then((d)=>{
          if( d !=undefined && d.data.msg == 'success'){
            if(d.data.value){
              //console.log(d.data.value);
              this.rData = new Array(d.data.value);
            }else{
              this.rData = [];
            }
          }else{
            this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
        this.resLoading = false;

      },
      resNodeClick(data,node,self){
        this.$refs.resource.setCheckedKeys([]);
        node.checked = true;
        this.selectResItem = data;

        //获取资源属性并显示
        let getItemPostUrl = '/webapi/getItemResExpireDate';
        let getItemParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          department : store.state.user.department ? store.state.user.department : '',
          item_directory_id : data.id
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
        //获取文件列表 getFilesList_Department(
        let getFilesUrl = "/webapi/getFilesList_Department_Admin";
        let getFilesParams = {
          session_id :store.state.user.sessionID ? store.state.user.sessionID : '',
          item_directory_id : this.selectResItem.id,
          department : store.state.user.department ? store.state.user.department : ''
        }
        this.$http.post(getFilesUrl,qs.stringify(getFilesParams)).then((d)=>{
          if( d !=undefined && d.data.msg == 'success' && d.data.value) {
            //显示文件列表
            var files = JSON.parse(d.data.value);
            this.filesList = files;
            //console.log(this.filesList);
          }else{
            this.filesList = [];

          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
      },

      //添加分类
      addClass(){
        var node = this.$refs.resource.getCheckedNodes();
        if(this.isCheck(node)){
          this.$prompt('请输入目录名称','添加',{
            confirmButtonText:'确定',
            cancelButtonText:'放弃',
            inputValidator: /\S/,
            inputErrorMessage: '请准确输入考核条目'
          }).then(({ value })=>{
            if(value != node[0].name){
              let addUrl = '/webapi/addItemRes_Department';
              let addParams = {
                session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
                name : value.trim(),
                department : store.state.user.department ? store.state.user.department :'',
                parent_id : node[0].id
              };
              this.$http.post(addUrl,qs.stringify(addParams)).then((d)=>{
                if(d && d.data.msg=='success'){
                  //前台添加子节点
                  if( !node[0].hasOwnProperty('children') || node[0].children == null){
                    node[0].children = [];
                  }
                  let tempNode = {
                    id: d.data.value,
                    name: value.trim(),
                    children: [],
                    parent_id : node[0].id
                  };
                  this.selectResItem = tempNode;
                  node[0].children .push(tempNode);
                  this.$message({message:"添加成功！",type:"success",duration:1500});
                }else{
                  this.$message({message:d.data.msg,type:'warning',duration:1500})
                }
              })

            }

          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '取消输入！',
              duration: 1500
            })
          })
        }
      },
      //编辑分类
      editClass(){
        var node = this.$refs.resource.getCheckedNodes();
        //console.log(node[0].children);
        if( !node[0].parent_id || node[0].parent_id.length <=0){
          this.$message({ message:'所选节点不能修改！',type:'warning',duration:1500 });
          return;
        }
        if(this.isCheck(node)){
          this.$prompt('请输入考核条目','编辑',{
            confirmButtonText:'确定',
            cancelButtonText:'放弃',
            inputValue: node[0].name
          }).then(({ value })=>{
            if(value != node[0].name){

              let editUrl = '/webapi/updateItemRes_Department';
              let editParams = {
                session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
                name : value.trim(),
                department : store.state.user.department ? store.state.user.department :'',
                item_directory_id : node[0].id,
                parent_id : node[0].parent_id
              }
              this.$http.post(editUrl,qs.stringify(editParams)).then((d)=> {
                if (d && d.data.msg == 'success') {
                  node[0].name = value;
                  //同步选中条目
                  this.selectResItem.name = value;
                  this.$message({ message:"修改成功！",type:"success",duration:1500 });
                }else{
                  this.$message({ message:d.data.msg,type:'warning',duration:1500 })
                }
              });
            }
          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '取消输入！',
              duration: 1500
            })
          })
        }
      },
      //删除分类
      delClass(){
        var node = this.$refs.resource.getCheckedNodes();
        if(this.isCheck(node)){
          //根目录不能修改
          if( !node[0].parent_id || node[0].parent_id.length <=0 ){
            this.$message({ message: '不能删除根目录！',type:'warning' ,duration:1500 });
            return ;
          }
          let postUrl = '/webapi/delItemRes_Department';
          let params = {
            session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
            department : store.state.user.department ? store.state.user.department :'',
            item_directory_id : node[0].id
          }
          this.$http.post(postUrl,qs.stringify(params)).then((d)=>{
            if(d!=undefined && d.data.msg == 'success'){
              this.$refs.resource.store.remove(this.selectResItem);
              this.selectResItem = [];
              this.$message({ message:'删除成功！',type:'success',duration: 1500 });
            }else{
              this.$message({ message:d.data.msg,type:'warning',duration: 1500 });
            }
          }).catch((err)=>{
            this.$message({ message:'服务器'+err,type:'error',duration:1500 });
          });
        }
      },

      //点击上传按钮
      uploadClass(){
        var node = this.$refs.resource.getCheckedNodes();
        if(this.isCheck(node)) {
          //清空已上传文件变量
          this.fileList = [];

          //对已文件列表进行改造
          this.filesList.map(f => {
            this.fileList.push({
              name: f.FILENAME,
              percentage: 100,
              status: "success",
              file_id: f.FILES_ID
            })
          });
          this.dialogUpload = true;
          this.fileParams = {
            session_id: store.state.user.sessionID ? store.state.user.sessionID : '',
            item_directory_id: this.selectResItem ? this.selectResItem.id : '',
            department: store.state.user.department ? store.state.user.department : ''
          }
        }
      },
      //移除
      handleRemove(file,fileList){
        //console.log(file,fileList);
        if(file.status == "success"){
          let delUrl = '/webapi/delFiles_Department ';
          let delParams = {
            session_id :  store.state.user.sessionID ? store.state.user.sessionID : '',
            files_id : file.file_id ? file.file_id : '',
            department: store.state.user.department ? store.state.user.department : ''
          }
          this.$http.post(delUrl,qs.stringify(delParams)).then((d)=>{
            if(d && d.data.msg=='success'){
              this.$message({message:'删除成功！',type:'success',duration:1500});
              this.filesList = this.filesList.filter( f =>{
                return f.FILES_ID != file.file_id
              })
            }else{
              this.$message({ message : d.data.msg , type:'warning' , duration:1500});
              this.dialogUpload = false;
            }
          })
        }
      },
      //上传保存
      submitUpload(){
        this.$refs.upload.submit();
      },
      uploadDialogClose(){
        //清空已上传列表
        this.fileList = [];
      },
      handleSuccess(response,file,fileList) {
        if(response && response.msg == 'success'){

          //console.log(response,file);
          //接收回调中文件ID
          file["file_id"] = response.value;
          //console.log(file);
          this.filesList.push({
            FILENAME : file.name,
            FILES_ID : file.file_id
          });

          this.$message({ message : '上传成功！',type:'success',duration:1500});
        }else if(response){
          this.$message({ message : response.msg,type:'warning',duration:1500});
        }
        //console.log(response,file,fileList);

      },
      handleError(err,file,fileList){
        this.$message.error('上传失败，请检查网络是否正常:'+err);
      },

      //文件列表操作
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

      //文件列表悬浮提示
      showFileCreator(creator,createTime){
        return '上传者：'+creator +',  时间：' + createTime;
      },
      downloadFile(fileId){
        let baseUrl = this.baseFun.baseURL;
        let downParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          files_id : fileId,
          department : store.state.user.department ? store.state.user.department : ''
        }
        window.location.href = baseUrl + "/webapi/getFile_Department?session_id=" + downParams.session_id + "&files_id=" + downParams.files_id + "&department=" + downParams.department;
      }
    },
    beforeCreate(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
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

    },
    created(){
      let postUrl = '/webapi/getAllPartyItems_Department';
      let postParams = {
        session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
        subject_id : this.$route.params.subject_id ? this.$route.params.subject_id : '',
        department : store.state.user.department ? store.state.user.department :''
      };
      //获取考核条目信息
      this.$http.post(postUrl,qs.stringify(postParams)).then(( d )=>{
        if( d != undefined && d.data.msg == 'success' && d.data.value){
          this.data = new Array(d.data.value) ;
          this.defaultChecked = new Array(this.data[0].id);
        }else{
          this.$message({ message:'考核条目获取失败！',type:'warning',duration:1500 });
        }
      }).catch((err)=>{
        this.$message({message:'服务器：'+ err , type:'error' , duration:1500 });
      });
    }
  }
</script>
<style scoped>
  .leftContent {
    position: relative;
    width: 445px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }
  .leftContentDetail {
    width: 415px;
    background-color: #E5E9F2;
    padding: 10px 15px;
  }
  .rightContent {
    position: relative;
    width: 445px;
    height: auto;
    float: right;
    margin-right: 30px;
  }

  h3 {
    padding-left: 10px;
    width: auto;
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
    border: none;
    min-height: 38px;
    width: 415px;
  }

  .btnPanel {
    position: relative;
    width: 415px;
    height: 28px;
  }
  .btnPanel .btnLeft {
    float: left;
    line-height: 28px;
    width: 65%;
  }
  .btnPanel .btnLeft span {
    margin-top: 5px;
  }
  .btnPanel .btnRight {
    text-align: right;
    float: right;
    width: 35%;
  }
  .topContent h4{
    margin: 5px;
  }
  .info-content{
    width: 900px;
    height: auto;
    margin-left:30px;
    overflow: hidden;
  }
  .colorBlue{
    color:blue;
  }
</style>
