<template>
  <div class="main">
    <div class="topContent">
      <h2>党建考核活动设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="primary"  size="small" @click="gotoLink('process')">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>考核活动</h3>
        <div class="leftContentDetail">
          <el-form label-width="80px" ref="form" :model="form">
            <el-form-item label="活动名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="设置分值">
              <el-input-number v-model="form.score" :step="2" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="评分要求">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm">确认</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
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
              1-1-2所在部门遵章守纪，团结和谐，积极向上
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
    name: 'processNew',
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
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rData:[{
          "id": 1,
          "label": '资料分类',
          children: [{
            "id": 2,
            "label": '图片',
            children: []
          },{
            "id": 3,
            "label": '文档'
          }]
        }],
        score: 0,
        form: {}
      }
    },
    methods: {
      gotoLink(link){
        router.push(link);
      },
      renderContent(h,{ node ,data,store }){
        return (
          <span>
             { node.label }
           </span >
        )
      },
      confirm(){
        this.$confirm('是否进入“评分设置”？点击“取消”返回考核活动主页。',"提示",{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type: 'info'
        }).then(_=>{
          router.push('processgrade');
        }).catch(_=>{
          router.push('process');
        })
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
    width: 485px;
    background-color: #E5E9F2;
    padding: 10px 5px;
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

</style>
