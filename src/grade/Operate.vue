<template>
<span>
  <div class="main">
    <div class="topContent">
      <h2>党建工作考核-评分人实施</h2>
      <h4> </h4>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
          <div class="info-content" v-if="selectNodeData.id != ''">
            <el-row>
              <el-tag type="success">所选条目：{{ selectNodeData.name.length >= 40 ? selectNodeData.name.slice(0,40) + '...' : selectNodeData.name  }}</el-tag>
            </el-row>
            <el-row>
              <el-tag type="success">分数：</el-tag> {{ selectNodeData.assess_value }} 分
            </el-row>
            <el-row>
              <el-tag type="success">考核要求及评分细则：</el-tag> {{ selectNodeData.assess_memo }}
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
              <el-button type="primary" size="small"  v-popover:popover4>< 选择活动条目</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="选择条目，对被考核部门进行考核" placement="top">
              <el-button type="warning" size="small" @click="gradeClick">打分</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" @click="baseFun.gotoLink({ path:'/grade/index'})">返 回</el-button>
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
              <span>{{  selectDepart  }} </span>
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
        :visible.sync="dialogGrade"
        :close-on-click-modal = "false"
        @close="gradeDialogClose"
        size="small"
        title="考核打分">
        <el-form v-model="form">
          <el-form-item v-if="selectNodeData" label="名称:" label-width="50px">
            {{ selectNodeData.name.length <= 20 ? selectNodeData.name :  selectNodeData.name.slice(0,20) + '...'  }}
          </el-form-item>
          <el-form-item label="部门" label-width="50px">
            <span>{{ selectDepart }}</span>
          </el-form-item>
          <el-form-item label="分值:" label-width="50px">
            <el-input-number v-model="form.score" :step="2" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="评价:" label-width="50px">
            <el-input v-model="form.content" type="textarea" :rows="3" placeholder="点评点什么？"></el-input>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <el-button @click="gradeDialogClose">清 空</el-button>
          <el-button type="primary" @click="gradeSubmit">确 定</el-button>
        </div>

      </el-dialog>
      <el-dialog
        title="请先选择考核部门"
        :close-on-click-modal = "false"
        size="small"
        :show-close="false"
        :visible.sync="dialogDepVisible">
          <el-row>
            <el-col :span="8">
              <p>考核部门：</p>
            </el-col>
            <el-col :span="16">
              <el-select v-model="selectDepart" placeholder="请选择被考核部门" @change="selectDepChange">
                <el-option v-for="dep in allEnableDeps" :key="dep.DEPARTMENT" :label="dep.DEPARTMENT" :value="dep.DEPARTMENT">{{ dep.DEPARTMENT }}</el-option>
              </el-select>
            </el-col>
          </el-row>
      </el-dialog>
    </div>
  </div>
</span>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name:'greadeOperate',
    store,
    data(){
        return {
          user:null,
          data:[],
          rData:[],
          defaultProps:{
            children:'children',
            label:'name'
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
          //打分对话框控制
          dialogGrade: false,
          form:{
            score:0,
            content:'',
            department:''
          },

          //选择的部门
          selectDepart:'',
          //可供选择的部门
          allEnableDeps:[],
          //部门选择对话框
          dialogDepVisible: true
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
      //条目节点点击事件
      handleNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        this.selectNodeData = data;
        /* 叶子节点
        if( data.children == null || data.children.length <= 0){

        }
        */
        /*
        //获取被考核部门
        this.$http.post('/webapi/getAssess_Man_RelevantDepartment_List',qs.stringify({
          session_id:this.user.sessionID,
          assess_item_id: data.assess_item_id,
          man_id : this.user.name
        }))
          .then((d)=>{
            this.allEnableDeps = [];
            this.selectDepart = '';
            if( d && d.data.code!='-1'){
              let tempData = JSON.parse(d.data.value);
              if(tempData && tempData.length>0){
                tempData.map((dep)=>{
                  this.allEnableDeps.push({
                    id: dep.RELEVANT_DEPARTMENT_ID,
                    department: dep.DEPARTMENT
                  })
                })
              }
            }
          });
        */
        /*
        //获取当前选择资源目录树
        this.resLoading = true;
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
          this.resLoading = false;
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
          this.resLoading = false;
        });
      */

        //获取当前选择部门下的资源目录树  getAllAssess_Item_ManForDepartment
        let rPostUrl = '/webapi/getAssessItemRes_Man';
        let rParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          assess_id: this.$route.params ? this.$route.params.assess_id :  '',
          item_id: data.id,
          department: this.selectDepart
        };
        this.$http.post(rPostUrl, qs.stringify(rParams)).then((d)=>{
          if( d && d.data.code!='-1'){
            if( d.data.value ){
              this.rData = new Array(d.data.value);
            }
            else {
              this.rData = [];
            }
            //console.log(this.rData);
          }else if(d && d.data.code =='-1'){
            this.rData = []
          }
          this.resLoading = false;
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
          this.resLoading = false;
        });

      },
      //部门下拉事件
      selectDepChange(val){
        this.dialogDepVisible = false;
        /*
        //console.log(this.selectNodeData);
        //获取当前选择部门下的资源目录树
        this.resLoading = true;
        let rPostUrl = '/webapi/getAssessItemRes_Man';
        let rParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          assess_id: this.$route.params ? this.$route.params.assess_id :  '',
          item_id: this.selectNodeData.id,
          department: val
        };
        this.$http.post(rPostUrl, qs.stringify(rParams)).then((d)=>{
          if(d&&d.data.code!='-1'){
            this.rData = new Array(d.data.value);
            //console.log(this.rData);
          }else if(d&&d.data.code=='-1'){
            this.rData = []
          }
          this.resLoading = false;
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
          this.resLoading = false;
        });

      */
        let postUrl = '/webapi/getAllAssess_Item_ManForDepartment';
        let postParams = {
          session_id:this.user.sessionID,
          assess_id: this.$route.params ? this.$route.params.assess_id :  '',
          department: this.selectDepart
        };
        this.$http.post(postUrl,qs.stringify(postParams))
          .then((d)=>{
            if(d&&d.data.code!='-1'){
              this.data = new Array(d.data.value);
              if(this.data.length > 0){
                this.defaultChecked = new Array(this.data[0].id);
              }
            }else if( d && d.data.code=='-1'){
              this.$message({message:d.data.msg,type:'warning',duration:1500});
            }
          }).catch((err)=>{
          this.$message({message:err,type:'warning',duration:1500});
        })
      },
      //资源节点点击
      resNodeClick(data,node,self){
        this.$refs.resource.setCheckedKeys([]);
        node.checked = true;
        this.selectResItem = data;
        /*
        //getAssessFile_Man session_id assess_id files_id department
        let getFilesUrl = "/webapi/getAssessFile_Man";
        let getFilesParams = {
          session_id :store.state.user.sessionID ? store.state.user.sessionID : '',
          item_directory_id : this.selectResItem.id,
          department : store.state.user.department ? store.state.user.department : ''
        }
        */


        //获取资源属性并显示
        let getItemPostUrl = '/webapi/getItemResExpireDate';
        let getItemParams = {
          session_id : store.state.user.sessionID ? store.state.user.sessionID : '',
          department : store.state.user.department ? store.state.user.department : '',
          item_directory_id : data.id
        };

        this.$http.post(getItemPostUrl,qs.stringify(getItemParams))
          .then((d)=>{
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
        //获取文件列表  getAssessFile_Man session_id assess_id files_id department
        let getFilesUrl = "/webapi/getFilesList_Department_Admin";
        let getFilesParams = {
          session_id :store.state.user.sessionID ? store.state.user.sessionID : '',
          item_directory_id : this.selectResItem.id,
          department : store.state.user.department ? store.state.user.department : ''
        }
        this.$http.post(getFilesUrl,qs.stringify(getFilesParams))
          .then((d)=>{
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

      }
      ,
      //对话框确认
      gradeSubmit(){
        //department
        //updateAssess_Department(session_id,assess_id,item_id, department,value,memo)
        let setUrl = "/webapi/updateAssess_Department/";
        let setParams = {
          session_id:this.user.sessionID,
          assess_id: this.$route.params ? this.$route.params.assess_id :  '',
          item_id: this.selectNodeData.id,
          department: this.selectDepart,
          value: this.form.score,
          memo: this.form.content
        };
        this.$http.post(setUrl,qs.stringify(setParams))
          .then((d)=>{
            if(d&&d.data.code!='-1'){
              this.$message({ message:'设置成功！',type:'success',duration:1500 });
            }else if(d&&d.data.code=='-1'){
              this.$message({  message:d.data.msg,type:'warning',duration:1500 });
            }
          })
          .catch((err)=>{
            this.$message( { message:err,type:'error',duation:1500 } );
          })
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
          this.dialogGrade = true;
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
              this.dialogGrade = false;
            }
          })
        }
      },
      //上传保存
      submitUpload(){
        this.$refs.upload.submit();
      },
      gradeDialogClose(){
        //清空表单
        this.form ={
          score:0 ,
          content:'' ,
          department:''
        }
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
      ,
      //打分
      gradeClick(){
        if(!this.selectNodeData || this.selectNodeData.id.length <= 0 ){
            this.$message({ message:'请先选择考核活动条目！',type:'warning', duration:1500});
            return false;
        }
        if(this.selectNodeData.children){
          this.$message({ message:'该项目不能评分！',type:'warning',duration:1500});
          return false;
        }

        //获取分数
        let postUrl = '/webapi/getAssess_Department_Value/'
        let setParams = {
          session_id:this.user.sessionID,
          assess_id: this.$route.params ? this.$route.params.assess_id :  '',
          item_id: this.selectNodeData.id,
          department: this.selectDepart
        };
        this.$http.post(postUrl,qs.stringify(setParams))
          .then((d)=>{
            if( d && d.data.code!='-1'){
              var grades = JSON.parse(d.data.value);
              if(grades && grades.length == 1){
                this.form.score = grades[0].value;
                this.form.content = grades[0].memo;
              }else{
                this.form.score = 0;
                this.form.content = '';
              }
            }else if( d && d.data.code=='-1'){
              this.form.score = 0;
              this.form.content = '';
            }
          })
          .catch((err)=>{
            this.$message( { message:err,type:'error',duation:1500 } );
          });


        this.dialogGrade = true;
      }

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
    created() {
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      //console.log(this.$route.params);


      //选择考核部门
      let selectDepUrl = '/webapi/getAllAssessDepartmentList_Man';
      //let postUrl = '/webapi/getAllAssess_Item_Man';
      let postParams = {
        session_id:this.user.sessionID,
        assess_id: this.$route.params ? this.$route.params.assess_id :  ''
      };


      this.$http.post(selectDepUrl,qs.stringify(postParams))
        .then((d)=>{
          if(d&&d.data.code!='-1') {
            this.allEnableDeps = JSON.parse(d.data.value) ;
            if(this.allEnableDeps.length > 0){
            }else if(d&&d.data.code=='-1'){
              this.$message({message:d.data.msg,type:'warning',duration:1500});
            }
          }
        })


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
    background-color: #edf7ff;
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
    height: 44px;
  }
  .btnPanel .btnLeft {
    float: left;
    line-height:44px;
    width: 65%;
  }
  .btnPanel .btnLeft span, .btnPanel .btnRight span {
    margin-top: 5px;
  }
  .btnPanel .btnRight {
    text-align: right;
    line-height:44px;
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
