<template>
  <div class="main">
    <div class="topContent">
      <h2>工作过程考核资源分类设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink( { name:'main'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>考核内容</h3>
        <el-tree :data="data"
                 v-loading = 'loading'
                 element-loading-text="加载中..."
                 node-key = "id"
                 @node-click="workNodeClick"
                 :props="defaultProps"
                 :render-content = "renderContent"
                 ref="trees">
        </el-tree>
      </div>
      <div class="rightContent">
        <div class="rightUpContent">
          <h3>内容及评分细则</h3>
          <div class="score">
            <p class="pTitle">
              <el-tag type="success">内容：</el-tag>
            </p>
            <p class="pContent">
              {{ selectWorkItem.name }}
            </p>
            <p class="pTitle">
              <el-tag type="success">分数： {{ selectWorkItem.value }}分 </el-tag>
            </p>

            <p class="pTitle">
              <el-tag type="success">考核要求及评分细则:</el-tag>
            </p>
            <p class="pContent">
              {{ selectWorkItem.memo }}
            </p>
          </div>
        </div>
        <div class="rightDownContent">
          <div class="top">
            <h3>资源分类设置</h3>
          </div>
          <div class="btnPanel">
            <div class="btnLeft">
              <span>所选：{{ selectResItem.name }}</span>
            </div>
            <div class="btnRight">
              <el-button-group>
                <el-button type="primary"  size="mini" icon="plus" @click="addClass" ></el-button>
                <el-button type="primary"  size="mini" icon="edit" @click="editClass"></el-button>
                <el-button type="primary"  size="mini" icon="delete" @click="delClass"></el-button>
              </el-button-group>
              <el-button-group>
                <el-button type="primary" size="mini" icon="upload">文件</el-button>
              </el-button-group>
            </div>

          </div>
          <div class="resource">
            <el-tree :data="rData"
                     :v-loading = "resLoading"
                     class="tree-style"
                     @node-click="resNodeClick"
                     highlight-current
                     node-key = "id"
                     :props="defaultProps"
                     ref="resource">
            </el-tree>
          </div>
          <el-dialog
            :visible.sync="dialogUpload"
            title="文件上传">
            <el-form></el-form>
          </el-dialog>
          <el-dialog
            title="分类设置"
            :closeOnClickModal = "false"
            :closeOnPressEscape = "false"
            :visible.sync="dialogVisible"
            :show-close = "false"
            size="small">
            <el-form :model="resourceForm" :rules="formRule" ref="resourceFrm">
              <el-form-item label="名称:" label-width="90px" prop="name">
                <el-input v-model="resourceForm.name" placeholder="请输入目录名称"></el-input>
              </el-form-item>
              <el-form-item label="上传时间:" label-width="90px" required>
                <el-col :span="11">
                  <el-form-item prop="dateBegin">
                    <el-date-picker type="date" placeholder="开始日期" v-model="resourceForm.dateBegin" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center">--</el-col>
                <el-col :span="11">
                  <el-form-item prop="dateEnd">
                    <el-date-picker type="date" placeholder="结束日期" v-model="resourceForm.dateEnd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="目录属性:" label-width="90px">
                <el-radio-group v-model="resourceForm.fileEnable">
                  <el-radio  label=",yes,">创建、上传</el-radio>
                  <el-radio  label=",yes,nofile,">创建不上传</el-radio>
                  <el-radio  label=",no,">不创建不上传</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="超时设置:" label-width="90px">
                <el-radio-group v-model="resourceForm.expireOper">
                  <el-radio  label="no">禁止上传</el-radio>
                  <el-radio  label="yes">允许上传</el-radio>
                  <el-radio  label="assess">允许上传(考核)</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div class="dialog-footer">
              <el-button @click="resetResClass">取 消</el-button>
              <el-button type="primary" @click="saveResClass('resourceFrm')" v-if="resourceForm.itemDirectoryId ==''">确 定</el-button>
              <el-button type="primary" @click="saveUpdateClass('resourceFrm')" v-else>保 存</el-button>
            </div>
          </el-dialog>

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
      name: 'resource',
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
          selectResItem:[],
          //资源对话框控制
          dialogVisible: false,
          dialogUpload: true,
          //资源对话框数据
          resourceForm:{
            itemDirectoryId:'',
            name:'',
            dateBegin: null,
            dateEnd: null,
            fileEnable: ',yes,',
            expireOper: 'no',
          },
          formRule:{
            name:[{ required:true,message:'名称不能为空',trigger:'blur' },{ min: 1,max: 80,message:'长度在1到80个字符',trigger:'blur' }],
            dateRange: [
              { type:'date',required:true,message:'请选择目录上传日期范围',trigger:'blur' }
            ],
            dateBegin:[{ type:'date',required:true,message:'开始时间未选择',trigger:'blur' }],
            dateEnd:[{ type:'date',required:true,message:'结束时间未选择',trigger:'blur' }]
          },
          //目录树等待动画
          loading: true,
          //资源树等待动画
          resLoading: true
        }
      },
      store,
      methods: {
        renderContent(h,{ node ,data,store }){
          return (
            <span>
             { node.label }
           </span >
          )
        },
        //节点点击事件
        workNodeClick(data,node,self){
          this.$refs.trees.setCheckedKeys([]);
          node.checked = true;
          this.selectWorkItem = data;
          //console.log(data);
          //当前条目资源分类初始化
          let rPostUrl = '/webapi/getItemRes'
          let rParams = {
            session_id : this.user.sessionID ? this.user.sessionID : '',
            subject_id :this.$route.params.subject_id ? this.$route.params.subject_id : '',
            item_id :  this.selectWorkItem.id
          }
          this.$http.post(rPostUrl, qs.stringify(rParams)).then((d)=>{
            if( d !=undefined && d.data.msg == 'success'){
              if(d.data.value){
                this.rData = Array.from(d.data.value);
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
        resNodeClick(data,node,self){
          this.$refs.resource.setCheckedKeys([]);
          node.checked = true;
          this.selectResItem = data;
          console.log(this.selectResItem);

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
        //添加分类
        addClass(){
          //没有选择父节点，则不能新增目录
          if(this.isCheck(this.$refs.resource.getCheckedNodes())){
            this.dialogVisible = true;
          }
        },
        //清空分类资源设置表单数据
        resetResClass(){
          this.resourceForm = {
            itemDirectoryId:'',
            name:'',
            dateBegin: null,
            dateEnd: null,
            fileEnable: ',yes,',
            expireOper: 'no',
          }
          this.dialogVisible = false
        },
        //分类资源表单添加数据的保存
        saveResClass(formName){
          //表单验证
          this.$refs[formName].validate((valid) => {
            if(valid){
              //通过验证
              //生成目录
              let addPostUrl = '/webapi/addItemRes';
              let addParams = {
                session_id : this.user.sessionID ? this.user.sessionID : '',
                parent_id : this.selectResItem.id,
                name: this.resourceForm.name.trim()
              };
              this.$http.post(addPostUrl,qs.stringify(addParams)).then((d)=>{
                if( d !=undefined && d.data.msg == 'success'){
                  this.resourceForm.itemDirectoryId = d.data.value;
                }else{
                  this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
                }
              }).then( _ =>{
                //更改目录属性和权限
                let updatePostUrl = '/webapi/updateItemResExpireDate';
                let updateParams = {
                  session_id : this.user.sessionID ? this.user.sessionID : '',
                  department : this.user.department ? this.user.department : '',
                  item_directory_id : this.resourceForm.itemDirectoryId,
                  starttime : this.resourceForm.dateBegin,
                  endtime : this.resourceForm.dateEnd,
                  expire_oper : this.resourceForm.expireOper,
                  allowdir : this.resourceForm.fileEnable
                };
                  this.$http.post(updatePostUrl,qs.stringify(updateParams)).then((da)=>{
                    if( da !=undefined && da.data.msg == 'success') {
                      //前端显示
                      let currentNode = this.$refs.resource.getCheckedNodes();
                      if(currentNode[0].children == null){
                        currentNode[0].children = [];
                      }
                      currentNode[0].children.push({
                        children:[],
                        parent_id:this.selectResItem.id,
                        id: this.resourceForm.itemDirectoryId,
                        name: this.resourceForm.name
                      });
                      this.$message({ message: '添加成功!',type:'success' ,duration:1500 });
                      this.resetResClass();
                    }else{
                      this.$message({ message: da.data.msg,type:'warning' ,duration:1500 });
                    }
                  });
                }).catch((err)=>{
                  this.$message({ message: err,type:'error' ,duration:1500 });
                });
              return true;
            }else{
              return false;
            }
          });
        },
        //分类资源表单编辑数据的保存
        saveUpdateClass(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //通过验证
              //生成目录
              let updateItemPostUrl = '/webapi/updateItemRes';
              let updateItemParams = {
                session_id: this.user.sessionID ? this.user.sessionID : '',
                item_directory_id : this.resourceForm.itemDirectoryId,
                parent_id: this.selectResItem.parent_id,
                name: this.resourceForm.name.trim()
              };
              this.$http.post(updateItemPostUrl,qs.stringify(updateItemParams)).then((d)=>{
                if( d !=undefined && d.data.msg == 'success') {
                  //更改目录属性和权限
                  let updatePostUrl = '/webapi/updateItemResExpireDate';
                  let updateParams = {
                    session_id : this.user.sessionID ? this.user.sessionID : '',
                    department : this.user.department ? this.user.department : '',
                    item_directory_id : this.resourceForm.itemDirectoryId,
                    starttime : this.resourceForm.dateBegin,
                    endtime : this.resourceForm.dateEnd,
                    expire_oper : this.resourceForm.expireOper,
                    allowdir : this.resourceForm.fileEnable
                  };
                  this.$http.post(updatePostUrl,qs.stringify(updateParams)).then((da)=>{
                    if( da !=undefined && da.data.msg == 'success') {
                      //前端显示
                      this.selectResItem.name = this.resourceForm.name.trim();

                      this.$message({ message: '修改成功!',type:'success' ,duration:1500 });
                      this.resetResClass();

                    }else{
                      this.$message({ message: da.data.msg,type:'warning' ,duration:1500 });
                    }
                  });
                  console.log(d);
                }
              }).catch((err)=>{
                this.$message({ message:'服务器'+err,type:'error',duration:1500 });
              })
            }
          });
        },
        //编辑分类
        editClass(){
          //获取当前选中的节点
          var node = this.$refs.resource.getCheckedNodes();
          //根目录不能修改
          if(node[0].parent_id.length <=0 ){
            this.$message({ message: '不能修改根目录！',type:'warning' ,duration:1500 });
            return false;
          }
          if(this.isCheck(node)){
            //初始化表单数据
            //获取目录信息、获取时间及属性信息
            this.resourceForm.itemDirectoryId = this.selectResItem.id;
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
                this.resourceForm.name = this.selectResItem.name;
                this.resourceForm.dateBegin = new Date(item[0].STARTTIME);
                this.resourceForm.dateEnd = new Date(item[0].ENDTIME);
                this.resourceForm.fileEnable  = item[0].ALLOWDIR;
                this.resourceForm.expireOper = item[0].EXPIRE_OPER;
                this.dialogVisible = true;
              }else{
                this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
              }
            }).catch((err)=>{
              this.$message({ message:'服务器'+err,type:'error',duration:1500 });
            });
          }
        },
        //删除分类
        delClass(){
//获取当前选中的节点
          var node = this.$refs.resource.getCheckedNodes();
          //根目录不能修改
          if(node[0].parent_id.length <=0 ){
            this.$message({ message: '不能删除根目录！',type:'warning' ,duration:1500 });
            return false;
          }
          if(this.isCheck(node)) {
            let postUrl = '/webapi/delItemRes';
            let params = {
              session_id : this.user.sessionID ? this.user.sessionID : '',
              item_directory_id : node[0].id
            };
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
            this.data = Array.from(d.data.value);
            this.data = new Array(d.data.value);
          }else{
            this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
          }
        }).catch((err)=>{
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
        this.loading = false;


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
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .pTitle,.pContent{
    padding: 5px;
  }
  .pContent {
    text-indent: 15px;
    line-height: 22px;
  }
  .score {
    width: 443px;
    min-height: 60px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
    padding: 5px 0 10px 0;
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
    border: none;
    min-height: 38px;
    width: 443px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
  }
  .btnPanel {
    position: relative;
    width: 433px;
    height: 35px;
    padding: 5px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
  }
  .btnPanel .btnLeft {
    float: left;
    line-height: 35px;
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
  .resTree{
    margin-bottom: 10px;
  }
</style>
