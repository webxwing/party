<template>
  <div class="main">
    <div class="topContent">
      <h2>党建考核评分设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" @click="gotoLink('process')">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>评分设置</h3>
        <div class="leftContentDetail">
          <el-form label-width="80px" ref="form" :model="form" label-position="top">
            <el-form-item label="时间">
              <el-date-picker
                type="datetimerange"
                placeholder="选择起始日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="评分人">
              <el-select v-model="value5" multiple placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择被考核对象">
              <el-tree :data="managerList"
                       node-key = "id"
                       :props="defaultProps"
                       ref="manager">
              </el-tree>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">确定</el-button>
              <el-button >清空</el-button>
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
  import router from '../router'
    export default {
      data(){
        return {
          managerList:[{
            id:1,
            label:'张三',
            depart:[{
              id:11,
              label:'信息工程学院党支部',
              depart:[]
            },{
              id:12,
              label:'铁道交通学院党支部',
              depart:[]
            },{
              id:13,
              label:'建筑工程学院党支部',
              depart:[]
            }]
          },
            {
              id:2,
              label:'李四',
              depart:[]
            },{
              id:3,
              label:'王五',
              depart:[]
            }],
          defaultProps:{
            children: 'depart',
            label: 'label'
          },
          value5:[],
          options:[{
            value: '张三',
            label: '张三'
          },{
            value: '李四',
            label: '李四'
          },{
            value: '王五',
            label: '王五'
          }],
          form:{}
        }
      },
      name: 'processgrade',
      methods:{
        gotoLink(link){
          router.push(link);
        }
      },
      form:{}
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

</style>
