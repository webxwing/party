<template>
  <div class="main">
    <div class="topContent">
      <h2>党建考核过程活动目录</h2>
    </div>
    <div class="bodyContent">
      <div class="menu-title">
        <el-row>
          <el-col :span="1"><el-tag type="success">标题</el-tag></el-col>
          <el-col :span="21"><h4>2017年基层党建目标考核</h4></el-col>
        </el-row>
        <el-row>
          <el-col :span="1"><el-tag type="success">时间</el-tag></el-col>
          <el-col :span="21"><h4>2017年1月1日 - 2017年12月31日</h4></el-col>
        </el-row>
      </div>
      <div class="btn-menu">
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
                   :render-content="renderContent"
                   ref="trees">
          </el-tree>
        </el-popover>
        <el-button-group>
          <el-button type="primary" size="small"  v-popover:popover4>新建活动</el-button>
          <el-button type="success" size="small"  @click="gotoLink('main')">返回</el-button>
        </el-button-group>
      </div>
      <div class="main-table">
        <el-table :data="workData" border>
          <el-table-column prop="pDate" label="活动时间" width="190"></el-table-column>
          <el-table-column prop="pTitle" label="活动名称" width="380"></el-table-column>
          <el-table-column prop="pState" label="状态" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作"  width="200">
            <template scope="scope">
              <el-button type="text" size="small" @click="gotoLink('processnew')">编辑内容</el-button>
              <el-button type="text" size="small" @click="gotoLink('processgrade')">评分设置</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="70">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import router from '../router/index.js'
  export default {
    name: 'process',
    data() {
      return {
        data: [{
          id: 1,
          label:'2017年基层党建目标考核',
          children:[{
            id: 10,
            label: '1、基本目标',
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
        workData:[
          {
            id: '1',
            pDate: '2017.1.1-2017.1.31',
            pTitle: '2017年基层党建工作目标1月份考核',
            pState: '已完成'
          },
          {
            id: '2',
            pDate: '2017.2.1-2017.2.28',
            pTitle: '2017年基层党建工作目标2月份考核',
            pState: '进行中'
          },
          {
            id: '3',
            pDate: '2017.3.1-2017.1.31',
            pTitle: '2017年基层党建工作目标3月份考核',
            pState: '未开始'
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        //默认展开
        defaultChecked:[1],
        //所选节点
        selectNodeData: []
      }
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
          router.push('processnew');
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
      renderContent(h,{ node ,data,store }){
        return (
          <span>
             { node.label }
           </span >
        );
      },
      gotoLink(link){
        router.push(link);
      }
    }
  }
</script>
<style scoped>
  .el-table {
    width: 900px;
    margin: 0 auto;
  }
  .menu-title {
    width: 900px;
    margin: 5px 30px;
  }
  .menu-title .el-row .el-col {
    margin: 5px;
  }
  .btn-menu {
    display: inline-block;
    float: right;
    margin: 5px 30px;
  }
  .pagination{
    width: 100%;
    margin: 10px auto;
    text-align: center;
  }
</style>
