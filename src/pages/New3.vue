<template>
<div class="main">
  <leftSteps :active-numb="3"></leftSteps>
  <div class="rightContent">
    <div class="topContent">
      <h2>考核要求及评分设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
          <i class="el-icon-warning"></i> 点击各考核条目设置其要求及分数。</el-tag>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到考核体系设置" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink('new2')">上一步</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="保存并进入考核对象设置" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink('new4')">下一步</el-button>
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
        size="small">
        <el-form :model="form">
          <el-form-item v-if="selectNodeData" label="名称:" label-width="50px">
            {{ selectNodeData.name.length <= 20 ? selectNodeData.name :  selectNodeData.name.slice(0,20) + '...'  }}
          </el-form-item>
          <el-form-item label="分值:" label-width="50px">
            <el-input-number v-model="form.score" :step="2" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="要求:" label-width="50px">
            <el-input v-model="form.content" type="textarea" :rows="3" placeholder="考核要求及评分细则"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>


</div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  import router from '../router'
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'new3',
    data() {
      return {
        loading:true,
        user:{},
        newParty:{},
        //所有分支条目数据(树)
        data:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        //所选节点
        selectNodeData: null,
        dialogVisible: false ,
        //设置表单域
        form:{
          //条目id
          id:'',
          name: '',
          score: 0,
          content: ''
        }
      };
    },
    components: { leftSteps },store,
    methods: {

      //节点点击事件
      handleNodeClick(data,node,self){
        //var isChecked = node.checked;
        this.$refs.trees.setCheckedKeys([]);
        //node.checked = ! isChecked;
        //console.log(data.id);
        //console.log(node);
        node.checked = true;
        //console.log(self);
        //this.$refs.trees.store.remove(data);
        this.selectNodeData = data;
        if( data.children == undefined || data.children.length <= 0){
          //初始化表单
          this.form.score = data.value;
          this.form.content = data.memo;
          //显示设置对话框
          this.dialogVisible = true;
        }
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
      showTitle(node){
        return node.children.length <= 0 ? true : false;
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
              <el-tag type="success">{ data.value }分</el-tag>
            </span>
          );
        }

      },
      //设置对话框提交
      onSubmit(){
        //关闭对话框
        this.dialogVisible = false;
        console.log(this.data);
        if(this.selectNodeData){
          //console.log(this.selectNodeData);
          let postUrl = '/webapi/updateItem';
          let params = {
            session_id : this.user.sessionID ? this.user.sessionID : '',
            subject_id : this.newParty.subjectID ? this.newParty.subjectID : '',
            item_id : this.selectNodeData.id,
            name : this.selectNodeData.name,
            parent_id : this.selectNodeData.parent_id,
            value: this.form.score,
            memo: this.form.content.trim()
          }
          //打开等待
          this.loading = true;
          this.$http.post(postUrl,qs.stringify(params)).then((d)=>{
            if( d !=undefined && d.data.msg == 'success'){
              //设置前端显示
              this.selectNodeData.value = this.form.score;
              this.selectNodeData.memo = this.form.content;
              console.log(this.selectNodeData);
              this.$refs.trees.setCheckedNodes(Array.from(this.selectNodeData));

              //清空表单
              this.form.score = 0;
              this.form.content = "";

              this.loading = false;
              this.$message({ message: '设置成功！',type:'success' ,duration:1500 });
            }else{
              this.loading = false;
              this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
            }
          }).catch((err)=>{
            this.loading = false;
            this.$message({ message:'服务器'+err,type:'error',duration:1500 });
          })

        }

      }
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
          this.loading = false;
        }else{
          this.loading = false;
          this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
        }
      }).catch((err)=>{
        this.loading = false;
        this.$message({ message:'服务器'+err,type:'error',duration:1500 });
      })
    }
  }
</script>
<style scoped>
  .el-tree {
    border: none;
    width: 720px;
    border-top: 1px solid #676a6c;
    border-bottom: 1px solid #676a6c;
    margin-right: 30px;
    margin-bottom: 5px;
  }
  .dialog-footer{
    text-align: right;
  }
  .el-tag{
    margin-left: 5px;
  }
</style>
