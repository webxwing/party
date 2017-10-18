<template>
  <div class="main">
    <div class="detailContent">
      <div class="bodyContent">
        <div class="menu">
          <div class="info">

          </div>
          <div class="button-group">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="回到考核活动主页面" placement="top">
                <el-button type="success"  size="small" >返 回</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </div>
        <el-tree :data="data"
                 node-key = "id"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :default-expanded-keys = "defaultChecked"
                 :render-content="renderContent"
                 ref="trees">
        </el-tree>
      </div>
      <el-dialog
        title="设置"
        :visible.sync="dialogVisible"
        size="small">
        <el-form :model="form">
          <el-form-item label="分值:" label-width="50px">
            <el-input-number v-model="form.score" :step="2" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="要求:" label-width="50px">
            <el-input type="textarea" :rows="3" placeholder="考核要求及评分细则"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  //节点新增的id标识
  let guid = 2;
  export default {
    name: 'detail',
    data() {
      return {
        data: [{
          id: 1,
          label:'2017年基层党建目标考核2017年基层党建目标考核2017年基层党建目标考核',
          children:[{
            id: 10,
            label: '1、基本目标',
            children: [{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）2017年基层党建目标考核2017年基层党建目标考核2017年基层党建目标考核2017年基层党建目标考核2017年基层党建目标考核',
              children: [{
                id: 1011,
                label:'1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children:[]
              },{
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            },{
              id: 11,
              label: '1-2 党政领导履职尽现（6分）',
              children: [{
                id: 1111,
                label: '1-2-1 认真履行党建工作责任，部门党政领导、支委成员分工明确、责任落实（2分）',
                children:[]
              },{
                id: 1112,
                label: '1-2-2 有较稳定的专兼职人员负责开展党建工作（2分）',
                children:[]
              },{
                id: 1113,
                label: '1-2-3 党建工作年度计划明确，重点突出，措施具体（2分）',
                children:[]
              }]
            }]
          },{
            id: 2,
            label: '2、重点目标（6分）',
            children: [{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 1011,
                label:'1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children:[]
              },{
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }]
          },{
            id: 3,
            label: '3、其它目标（6分）',
            children:[{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 1011,
                label:'1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children:[]
              },{
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }]
          },{
            id: 40,
            label: '4、明年目标',
            children: [{
              id: 401,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 4011,
                label:'1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children:[]
              },{
                id: 4012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            },{
              id: 41,
              label: '1-2 党政领导履职尽现（6分）',
              children: [{
                id: 4111,
                label: '1-2-1 认真履行党建工作责任，部门党政领导、支委成员分工明确、责任落实（2分）',
                children:[]
              },{
                id: 4112,
                label: '1-2-2 有较稳定的专兼职人员负责开展党建工作（2分）',
                children:[]
              },{
                id: 4113,
                label: '1-2-3 党建工作年度计划明确，重点突出，措施具体（2分）',
                children:[]
              }]
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        //默认展开
        defaultChecked:[1],
        //所选节点
        selectNodeData: [],
        dialogVisible: false ,
        //设置表单域
        form:{
          id:23,
          label: '',
          score: 0,
          content: ''
        }
      };
    },
    components: {  },
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
        return (
          <span>
             { node.label }
           </span >
        );
      }
    }
  }
</script>
<style scoped>
  .el-tree {
    border: none;
    width: 900px;
    border-top: 1px solid #676a6c;
    border-bottom: 1px solid #676a6c;
    margin-right: 30px;
    margin-bottom: 5px;
  }
  .dialog-footer{
    text-align: right;
  }
  .detailContent{
    width: 930px;
    padding: 0 30px;
  }
</style>

