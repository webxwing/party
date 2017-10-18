<template>
  <div class="main">
    <leftSteps :active-numb="4"></leftSteps>
    <div class="rightContent">
      <div class="topContent">
        <h2>考核对象设置</h2>
      </div>
      <div class="bodyContent">
        <div class="menu">
          <div class="info">
            <el-tag type="success">已设置部门个数:{{ chooseDepCount }}</el-tag>
          </div>
          <div class="button-group">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="回到评分设置" placement="top">
                <el-button type="primary"  size="small" @click="baseFun.gotoLink({ name:'new3' })">上一步</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="对选中节点进行考核部门设置" placement="top">
                <el-button type="primary"  size="small" @click="onSubmit">设 置</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="全部保存并返回主页" placement="top">
                <el-button type="success"  size="small" @click="baseFun.gotoLink({ name:'main'})">完 成</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </div>
        <el-tree :data="data"
                 v-loading = 'loading'
                 element-loading-text="加载中..."
                 node-key = "id"
                 :props="defaultProps"
                 highlight-current
                 default-expand-all
                 @node-click="handleNodeClick"
                 :render-content="renderContent"
                 ref="trees">
        </el-tree>
        <el-dialog
          title="设置"
          :visible.sync="dialogVisible"
          @close = "dialogClose"
          size="small">
          <div class="choosePanel">
            <el-transfer
              v-model="chooseList"
              v-loading = "departLoading"
              :titles = '["可选部门","已选部门"]'
              :data="departList"
              :props="departProps"
              @change="saveDepart">
            </el-transfer>
          </div>
        </el-dialog>

      </div>
    </div>
  </div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'new4',
    data() {
      return {
        data: [],
        user:{},
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        loading : true,
        //部门数据
        departLoading : false,
        departProps: { key:'id',label:'name',disabled:'disabled' },
        departList:[],
        chooseList:[],
        //所有部门
        allDepartments:[],
        //所选节点
        selectNodeData: null,
        dialogVisible: false
      }
    },
    components: { leftSteps },store,
    computed:{
      chooseDepCount:function(){
        return this.chooseList.length;
      }
    },
    methods: {
      //节点点击事件
      handleNodeClick(data,node,self){
        if( data.children == undefined || data.children.length <= 0){
          this.$refs.trees.setCheckedKeys([]);
          node.checked = true;
          this.selectNodeData = data;
          //获取已设置部门存于chooseList
          let getItemRelevantDepartmentUrl = '/webapi/getItemRelevantDepartment';
          let getItemRelevantDepartmentParams = {
            session_id : this.user.sessionID ? this.user.sessionID : '',
            subject_id : this.newParty.subjectID ? this.newParty.subjectID : '',
            department : this.user.department ? this.user.department : '',
            item_id : data.id
          };
          this.$http.post(getItemRelevantDepartmentUrl,qs.stringify(getItemRelevantDepartmentParams)).then((d)=>{
            if(d.data.msg == "success"){
              let tempDep = d.data.value ? JSON.parse(d.data.value) : [];
              this.chooseList = [];
              for(var i=0;i<tempDep.length;i++){
                let item = tempDep[i];
                this.chooseList.push(item.DEPARTMENT);
              }
            }else{
              this.$message({message:'已选部门获取失败',type:'warning',duration:1500});
            }
          }).catch((err)=>{
            this.chooseList = [];
          });
        }else{this.selectNodeData = null;this.chooseList = []}
      },
      //是否有节点被选中
      isCheck(node){
        if(node == undefined||node.length<=0){
          this.$message({
            showClose: true,
            type: 'error',
            message: '请选择父级条目！',
            duration: 1500
          });
          return false
        }else{
          return true;
        }
      },
      //点击设置部门，显示设置对话框
      onSubmit(){
        if(!this.selectNodeData){  this.$message({ message:'请选择项目节点！',type:'warning',duration:1500 });  return false }
        this.departLoading = true;
        //清空备选数组,筛选已选部门,留下未选部门,直接存入备选数组
        this.departList = [];
        this.allDepartments.map( _ =>{
          //遍历每一个部门，假设每一个未选 _
          let temp = false;
          this.chooseList.map(d=>{
            if(d.name == _.department){
              //已出现在已选数组中
              temp = true;
            }
          });
          if(!temp){
            this.departList.push({
              id:_.department,
              name:_.department,
              disabled:false
            })
          }
        })
        console.log(this.departList);
        console.log(this.chooseList);
        console.log(this.allDepartments);
        this.departLoading = false;
        this.dialogVisible = true;
      },
      saveDepart(value,direction,keyArr){
        //console.log(direction);//right-添加 left-删除
        let addUrl = '/webapi/addOrg';
        let delUrl = '/webapi/delOrg';
        let session_id = this.user.sessionID ? this.user.sessionID : '';
        let subject_id = this.newParty.subjectID ? this.newParty.subjectID : '';
        let item_id = this.selectNodeData ? this.selectNodeData.id : '';
        if(direction == 'right'){

          keyArr.map((dep)=>{
            let addParams = {
              session_id ,
              subject_id ,
              department : dep,
              item_id
            };
            this.$http.post(addUrl,qs.stringify(addParams)).then((d)=>{
             if( d != undefined  && d.data.message=="success"){

             }
            });
          });
        }else if(direction == 'left'){
          keyArr.map((dep)=>{
            let delParams = {
              session_id ,
              subject_id ,
              department : dep,
              item_id
            };
            this.$http.post(delUrl,qs.stringify(delParams)).then((d)=>{
              if( d != undefined  && d.data.message=="success"){

              }
            });
          });
        }
      },
      renderContent(h,{ node ,data,store }){

        if(data.children){
          return (
            <span>
              { node.label }
            </span >
          );
        }else{
          return (
            <span>
              { node.label  }
            </span>
          );
        }

      },
    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      store.commit('initNewParty');

      //更新数据
      this.user = store.state.user;
      this.newParty = store.state.newParty;

      //获取体系树目录
      let postUrl = '/webapi/getAllPartyItems';
      let params = {
        session_id : this.user.sessionID ? this.user.sessionID : '',
        subject_id : this.newParty.subjectID ? this.newParty.subjectID : ''
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
      //关闭tree加载动画
      this.loading = false;
      //获取部门信息
      let departUrl = '/webapi/get_LoginDepartment';
      this.$http.post(departUrl).then((d)=>{
        if( d !=undefined && d.data.msg == 'success'){
          this.allDepartments = d.data.value ? JSON.parse(d.data.value) : [];
        }else{
          this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
        }
      })
    }
  }
</script>
<style>
  .el-tree {
    border: none;
    width: 720px;
    border-top: 1px solid #676a6c;
    border-bottom: 1px solid #676a6c;
    margin-right: 30px;
    margin-bottom: 5px;
  }
.el-transfer-panel{
  width: 40%;
}
.btnConfig{
  margin-left: 5px;
  font-size: 8px;
}
</style>
