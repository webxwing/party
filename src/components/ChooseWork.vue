<template>
<div class="choose-work">
  <el-tree :data="data"
           node-key = "id"
           :props="defaultProps"
           @node-click="handleNodeClick"
           :default-expanded-keys = "defaultChecked"
           :render-content="renderContent"
           highlight-current
           ref="trees">
  </el-tree>
  <div class="btnPanel">
    <el-button type="primary">确定</el-button>
    <el-button>取消</el-button>
  </div>
</div>
</template>
<script>
    export default {
      name:'chooseWork',
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
  .choose-work {
    max-width: 600px;
    min-height: 300px;
    padding: 10px;
  }
  .btnPanel {
    max-width: 600px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
  }
</style>
