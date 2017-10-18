<template>
  <div class="main">
    <div class="topContent">
      <h2>党建工作考核实施</h2>
      <h4>信息工程学院党总支</h4>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

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
              <el-button type="primary" size="small"  v-popover:popover4>选择(查看)考核内容</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" @click="gotoLink('main')">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>考核实施</h3>
        <div class="leftContentDetail">
          <div class="btnPanel">
            <div class="btnLeft">
              <span>所选：{{ selectResItem.label }}</span>
            </div>
            <div class="btnRight">
              <el-button-group>
                <el-button type="primary"  size="mini" icon="plus" @click="dialogVisible = true" ></el-button>
                <el-button type="primary"  size="mini" icon="edit" @click="editClass"></el-button>
                <el-button type="primary"  size="mini" icon="delete" @click="delClass"></el-button>
              </el-button-group>
              <el-button type="success" size="small">上传文件</el-button>
            </div>
          </div>
          <el-tree :data="rData"
                   class="tree-style"
                   @node-click="resNodeClick"
                   highlight-current
                   node-key = "id"
                   :props="defaultProps"
                   ref="resource">
          </el-tree>
        </div>
      </div>
      <div class="rightContent">
        <div class="rightUpContent">
          <h3>所在考核条目的内容及评分细则</h3>
          <div class="score">
            <p class="pTitle">
              <el-tag type="success">内容：</el-tag>
            </p>
            <p class="pContent">
              {{ selectNodeData.label }}
            </p>
            <p class="pTitle">
              <el-tag type="success">分数：</el-tag>
            </p>
            <p class="pContent">
              10
            </p>
            <p class="pTitle">
              <el-tag type="success">考核要求及评分细则:</el-tag>
            </p>
            <p class="pContent">
              提供深入群众的会谈记录、解决问题的清单及相关资料。 ( 好3分，一般2分，差1分。)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../router/index.js'
  export default {
    name: 'userprocess',
    data(){
      return {
        data: [{
          id: 1,
          label: '2017年基层党建目标考核',
          children: [{
            id: 10,
            label: '1、基本目标',
            children: [{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 1011,
                label: '1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children: []
              }, {
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }, {
              id: 11,
              label: '1-2 党政领导履职尽现（6分）',
              children: [{
                id: 1111,
                label: '1-2-1 认真履行党建工作责任，部门党政领导、支委成员分工明确、责任落实（2分）',
                children: []
              }, {
                id: 1112,
                label: '1-2-2 有较稳定的专兼职人员负责开展党建工作（2分）',
                children: []
              }, {
                id: 1113,
                label: '1-2-3 党建工作年度计划明确，重点突出，措施具体（2分）',
                children: []
              }]
            }]
          }, {
            id: 2,
            label: '2、重点目标（6分）',
            children: [{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 1011,
                label: '1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children: []
              }, {
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }]
          }, {
            id: 3,
            label: '3、其它目标（6分）',
            children: [{
              id: 101,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 1011,
                label: '1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children: []
              }, {
                id: 1012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }]
          }, {
            id: 40,
            label: '4、明年目标',
            children: [{
              id: 401,
              label: '1-1 整体工作氛围良好（6分）',
              children: [{
                id: 4011,
                label: '1-1-1 党政主要负责同志能深入群众，善于解决实际问题，在群众中有威信，党群关系良好（3分）',
                children: []
              }, {
                id: 4012,
                label: '1-1-2 所在部门遵章守纪，团结和谐，积极向上（3分）',
                children: []
              }]
            }, {
              id: 41,
              label: '1-2 党政领导履职尽现（6分）',
              children: [{
                id: 4111,
                label: '1-2-1 认真履行党建工作责任，部门党政领导、支委成员分工明确、责任落实（2分）',
                children: []
              }, {
                id: 4112,
                label: '1-2-2 有较稳定的专兼职人员负责开展党建工作（2分）',
                children: []
              }, {
                id: 4113,
                label: '1-2-3 党建工作年度计划明确，重点突出，措施具体（2分）',
                children: []
              }]
            }]
          }]
        }],
        rData: [{
          id: 1,
          label: '资源目录',
          children: [{
            id: 2,
            label: '1月考核内容',
            children: []
          }, {
            id: 3,
            label: '2月考核内容',
            children:[]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        //默认展开
        defaultChecked: [1],
        //所选节点
        selectNodeData: [],
        selectResItem:[]
      }
     },
    methods:{
      //节点点击事件
      handleNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        this.selectNodeData = data;
        if( data.children == undefined || data.children.length <= 0){

        }
      },
      resNodeClick(data,node,self){
        this.$refs.resource.setCheckedKeys([]);
        node.checked = true;
        this.selectResItem = data;
      },
      gotoLink(link){
        router.push(link);
      },
      //添加分类
      addClass(){
        this.dialogVisible = true;
      },
      //编辑分类
      editClass(){
        var node = this.$refs.resource.getCheckedNodes();
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
      //删除分类
      delClass(){

      }
    }
  }
</script>
<style scoped>
  .leftContent {
    position: relative;
    width: 485px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }
  .leftContentDetail {
    width: 465px;
    background-color: #E5E9F2;
    padding: 10px 15px;
  }
  .rightContent {
    position: relative;
    width: 390px;
    height: auto;
    float: right;
    margin-right: 30px;
  }
  .rightUpContent {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0;
  }

  .pTitle,.pContent{
    padding: 5px;
  }
  .pContent {
    text-indent: 15px;
    line-height: 22px;
  }
  .score {
    width: 398px;
    min-height: 60px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
    padding: 5px 0 10px 0;
  }
  h3 {
    padding-left: 10px;
    width: 100%;
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
  .el-tree{
    min-height: 40px;
  }

  .btnPanel {
    position: relative;
    width: 460px;
    height: 35px;
    padding: 5px;
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
  .topContent h4{
    margin: 5px;
  }
</style>
