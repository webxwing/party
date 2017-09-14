<template>
<div class="main">
  <leftSteps :active-numb="2"></leftSteps>
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
            <el-button type="primary" icon="plus" size="small" @click="addItem">添加</el-button>
            <el-button type="primary" icon="edit" size="small" @click="editItem">编辑</el-button>
            <el-button type="primary" icon="delete" size="small" @click="delItem">删除</el-button>
          </el-button-group>
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到考核总览设置" placement="top">
              <el-button type="success"  size="small" >上一步</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="保存并进入评分设置" placement="top">
              <el-button type="success"  size="small" >下一步</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <el-tree :data="data"
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
  //节点新增的id标识
  let guid = 2;
  export default {
    name: 'new2',
    data() {
      return {
        data: [{
          id: 1,
          label:'根目录',
          children:[{
            id: 199,
            label: '一级目录',
            children: []
          },{
            id: 200,
            label: '一级目录2',
            children: [{
              id: 201,
              label: '二级目录',
              children: []
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //所选条目
        selectItem: '',
        selectNodeData: [],
      };
    },
      components: { leftSteps },
      methods: {
        //增加考核条目
        addItem(){
          //判断结点是否有选择
          //弹出编辑菜单
          //增加结点
          var node = this.$refs.trees.getCheckedNodes();
          if(this.isCheck(node)){
            var newNode = {
              id: guid++,
              label: '新建条目',
              children:[]
            };
            this.$prompt('请输入考核条目','添加',{
              confirmButtonText:'确定',
              cancelButtonText:'放弃'
            }).then(({value})=>{
              newNode.label = value;
              //添加子节点
              node[0].children.push(newNode);
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
            this.$prompt('请输入考核条目','编辑',{
              confirmButtonText:'确定',
              cancelButtonText:'放弃',
              inputValue: node[0].label
            }).then(({ value })=>{
              if(value != node[0].label){
                node[0].label = value;
                //同步选中条目
                this.selectItem = value;
              }
            }).then(()=>{
              this.$message({message:"修改成功！",type:"success",duration:1500});
            }).catch(()=>{
              this.$message({
                type: 'info',
                message: '取消输入！',
                duration: 1500
              })
            })
          }

        },
        //删除考核条目
        delItem(){
          //console.log(this.data);
          //console.log(this.selectNodeData);
          this.$refs.trees.store.remove(this.selectNodeData);
          //清空所选条目
          this.selectItem = [];
        },
        editRequire(){

        },
        //节点点击事件
        handleNodeClick(data,node,self){
          //var isChecked = node.checked;
          this.$refs.trees.setCheckedKeys([]);
          //node.checked = ! isChecked;
          //console.log(data.id);
          this.selectItem = data.label;
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
              message: '请选择父级条目！',
              duration: 1500
            });
            return false
          }else{
            return true;
          }
        },
        findNode(id){

        }
      }
    }
</script>
<style scoped>

.el-tree {
  border: none;
  border-top: 1px solid #676a6c;
  margin-right: 30px;
}
</style>
