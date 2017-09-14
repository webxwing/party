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

          </div>
          <div class="button-group">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="回到评分设置" placement="top">
                <el-button type="primary"  size="small" >上一步</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="全部保存并返回主页" placement="top">
                <el-button type="success"  size="small" >完 成</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </div>
        <el-tree :data="data"
                 node-key = "id"
                 :props="defaultProps"
                 ref="trees">
        </el-tree>
        <div class="choosePanel">
          <el-transfer
            v-model="chooseList"
            :titles = '["备选部门","选择部门"]'
            :data="departList">
          </el-transfer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  export default {
    name: 'new4',
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
        //部门数据
       departList:[{
        key: 1,
        label: '信息工程学院党支部',
        disabled: false
       },{
         key: 2,
         label: '物流学院党支部',
         disabled: false
       },{
         key: 3,
         label: '财经学院党支部',
         disabled: false
       },{
         key: 4,
         label: '汽车学院党支部',
         disabled: false
       },{
         key: 5,
         label: '艺术与人文学院党支部',
         disabled: false
       },{
         key: 6,
         label: '装备制程学院党支部',
         disabled: false
       }],
        chooseList:[]
      };
    },
    components: { leftSteps },
    methods: {

    }
  }
</script>
<style scoped>
.el-tree {

  margin-right: 30px;
}
.choosePanel{
  width: 100%;
  margin-top: -1px;
}
</style>
