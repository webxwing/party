<template>
<div class="main">
  <div class="leftStepsContent">
    <leftSteps :active-numb="2"></leftSteps>
  </div>

  <div class="rightContent">
    <div class="topContent">
      <h2>考核指标体系设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
          <span>所选条目：{{ selectItem.length > 0 ?  selectItem : "空" }}</span>
        </div>
        <div class="button-group">
          <el-button-group>
            <el-button type="success" icon="plus" size="small" @click="addItem">添加</el-button>
            <el-button type="success" icon="edit" size="small" @click="editItem">编辑</el-button>
            <el-button type="success" icon="delete" size="small" @click="delItem">删除</el-button>
          </el-button-group>
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink({ path:'/admin/main' })">退出</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="回到考核总览设置" placement="top">
              <el-button type="primary"  size="small" @click="provStep">上一步</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="保存并进入评分设置" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink('new3')">下一步</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <el-tree :data="data"
               v-loading = 'loading'
               element-loading-text="加载中..."
               highlight-current
               node-key = "id"
               :props="defaultProps"
               @node-click="handleNodeClick"
               @current-change = "handleCurrentChange"
               @check-change = "handleCheckChange"
               ref="trees"></el-tree>
    </div>
  </div>

</div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  import store from '../common/store.js'
  import qs from 'qs'

  export default {
    name: 'new2',
    data() {
      return {
        user: {},
        //等待动画
        loading:true,
        //存储新建的条目信息
        newParty: {},
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        //所选条目名称
        selectItem: '',
        selectNodeData: [],
      };
    },
    store,
    components: { leftSteps },
    methods: {
    //增加考核条目
    addItem(){
      //判断结点是否有选择
      //弹出编辑菜单
      //增加节点
      var node = this.$refs.trees.getCheckedNodes();
      if(this.isCheck(node)){
        var newNode = {
          id: '',
          name: '',
          parent_id:'',
          children:[]
        };
        this.$prompt('请输入考核条目','添加',{
          confirmButtonText:'确定',
          cancelButtonText:'放弃',
          inputValidator: /\S/,
          inputErrorMessage: '请准确输入考核条目'
        }).then(({value })=>{
          let postUrl = '/webapi/addItem';
          let params = {
            session_id : this.user.sessionID ? this.user.sessionID : '',
            subject_id : this.newParty.subjectID ? this.newParty.subjectID : '',
            //subject_id : '1',
            name : value.trim(),
            parent_id : node[0].id ,
            value : 0,
            memo :  ''
          };
          this.$http.post(postUrl,qs.stringify(params)).then((d)=>{
            this.loading = true;
            if( d!=undefined && d.data.msg == 'success'){
              //添加成功
              newNode.id = d.data.value;
              newNode.parent_id = node[0].id;
              newNode.name = value.trim();
              //前台添加子节点
              if(node[0].children == null){
                node[0].children = [];
              }
              node[0].children.push(newNode);
              this.loading = false;
              this.$message({message:"添加成功！",type:"success",duration:1500});
            }else{
              this.loading = false;
              this.$message({message: d.data.msg,type: 'warning',duraing: 1500});
            }
          });

        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消输入！',
            duration: 1500
          })
        });
      }
    },
    //编辑考核条目
    editItem(){
      var node = this.$refs.trees.getCheckedNodes();

      if(this.isCheck(node)){
        //根目录不能修改
        if(node[0].parent_id.length <=0 ){
          this.$message({ message: '不能修改根目录！',type:'warning' ,duration:1500 });
          return false;
        }
        this.$prompt('请输入考核条目','编辑',{
          confirmButtonText:'确定',
          cancelButtonText:'放弃',
          inputValue: node[0].name
        }).then(({ value })=>{
          if(value != node[0].name){
            let postUrl = '/webapi/updateItem';
            let params = {
              session_id : this.user.sessionID ? this.user.sessionID : '',
              subject_id : this.newParty.subjectID ? this.newParty.subjectID : '',
              name : value.trim(),
              item_id: node[0].id,
              parent_id : node[0].parent_id ,
              value : node[0].value,
              memo :  node[0].memo
            };
            this.$http.post(postUrl,qs.stringify(params)).then((d)=>{
              if(d!=undefined && d.data.msg == 'success'){
                node[0].name = value.trim();
                //同步选中条目
                this.selectItem = value.trim();
                this.$message({message:"修改成功！",type:"success",duration:1500});
                this.loading = false;
              }else{
                this.loading = false;
                this.$message({ message:d.data.msg,type:'warning',duration: 1500 });
              }
            }).catch((err)=>{
              this.loading = false;
              this.$message({ message:'服务器'+err,type:'error',duration:1500 });
            })



          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消修改！',
            duration: 1500
          })
        })
      }

    },
    //删除考核条目
    delItem(){
      var node = this.$refs.trees.getCheckedNodes();
      if(this.isCheck(node)){
        //根目录不能修改
        if( !node[0].parent_id || node[0].parent_id.length <=0 ){
          this.$message({ message: '不能删除根目录！',type:'warning' ,duration:1500 });
          return false;
        }
        let postUrl = '/webapi/delItem';
        let params = {
          session_id : this.user.sessionID ? this.user.sessionID : '',
          subject_id : this.newParty.subjectID ? this.newParty.subjectID : '',
          item_id : node[0].id
        }
        this.$http.post(postUrl,qs.stringify(params)).then((d)=>{
          this.loading = true;
          if(d!=undefined && d.data.msg == 'success'){
            this.$refs.trees.store.remove(this.selectNodeData);
            this.selectItem = [];
            this.loading = false;
            this.$message({ message:'删除成功！',type:'success',duration: 1500 });
          }else{
            this.loading = false;
            this.$message({ message:d.data.msg,type:'warning',duration: 1500 });
          }
        }).catch((err)=>{
          this.loading = false;
          this.$message({ message:'服务器'+err,type:'error',duration:1500 });
        });
      }
      //this.$refs.trees.store.remove(this.selectNodeData);
      //清空所选条目
      //this.selectItem = [];
    },

    //上一步跳转
    provStep(){
      this.baseFun.gotoLink({name:'new', params:{ row:{
        SUBJECT_ID : this.newParty.subjectID,
        NAME : this.newParty.name,
        YEAR : this.newParty.year,
        STARTTIME : this.newParty.startTime,
        ENDTIME : this.newParty.endTime,
        STATUS : this.newParty.status,
        DEPARTMENT : this.newParty.department
      }}});
    },
    //节点点击事件
    handleNodeClick(data,node,self){
      //var isChecked = node.checked;
      this.$refs.trees.setCheckedKeys([]);
      //node.checked = ! isChecked;
      //console.log(data.id);

      //节点名称
      this.selectItem = data.name;
      //console.log(node);
      node.checked = true;
      //console.log(self);
      //this.$refs.trees.store.remove(data);
      this.selectNodeData = data;

    },
    //节点选中状态变化
    handleCheckChange(data,isCheck,isChildCheck){
      //console.log(data.id + ',' + isCheck);
      //this.$refs.trees.setCheckedKeys([]);
      //if(isCheck == true){ this.$refs.trees.setCheckedKeys(Array.of(data.id)); }
//          console.log(Array.of(data.id));
//          console.log(isCheck);
//          console.log(isChildCheck);
    },
    //节点状态变化
    handleCurrentChange(data,node){
//          console.log(node);
//          var isChecked = node.checked;
//          this.$refs.trees.setCheckedKeys([]);
//          node.checked = ! isChecked;
    },
    //是否有节点被选中
    isCheck(node){
      if(node == undefined||node.length<=0){
        this.$message({
          showClose: true,
          type: 'error',
          message: '请选择一个条目！',
          duration: 1500
        });
        return false
      }else{
        return true;
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
          this.$message({ message: d.data.msg ,duration:1500 });
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
  min-height: 38px;
  border-top: 1px solid #676a6c;
  margin-right: 30px;
}
</style>
