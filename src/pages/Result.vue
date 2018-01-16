<template>
  <div class="main">
    <div class="topContent">
      <h2>工作过程考核结果查看</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">
        部门：<el-select v-model="department" @change="handleChange" placeholder="选择被考核部门">
          <el-option v-for="item in departments" :key="item.DEPARTMENT" :value="item.DEPARTMENT" :label="item.DEPARTMENT">
          </el-option>
        </el-select>
        </div>

        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="primary"  size="small" @click="baseFun.gotoLink({ path:'/admin/process/'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>考核内容</h3>
        <el-tree :data="data"
                 node-key = "id"
                 :props="defaultProps"
                 highlight-current
                 @node-click="handleNodeClick"
                 :default-expanded-keys = "defaultChecked"
                 ref="trees">
        </el-tree>
      </div>
      <div class="rightContent">
        <div class="rightUpContent">

        </div>
        <div class="rightDownContent">
          <div class="top">
            <h3>考核结果详情</h3>
          </div>
          <div class="btnPanel">
            <el-row>
              得分：{{ selectItem.department_assess_value }}分
            </el-row>
            <el-row>
              评价： {{ selectItem.department_assess_memo }}
            </el-row>
            <el-row>
              评分人：{{ selectItem.modifier }}
            </el-row>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name:'result',
    data() {
      return {
        data:[],
        //选择部门
        department:'',
        //待选部门
        departments:[],
        //选择条目
        selectItem:{
          children:[],
          id:null,
          assess_memo:'-',
          department_assess_value:'-',
          modifier:'-'
        },
        defaultProps:{
          children:'children',
          label: 'name'
        },
        //默认展开
        defaultChecked: [1]
      }
    },
    store,
    methods: {
      handleNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        this.selectItem = data;
//        console.log(data);
      },

      //部门选择
      handleChange(value){
        this.selectItem = {
          children: [],
          id: null,
          department_assess_memo: '-',
          department_assess_value: '-',
          modifier: '-'
        };

        this.$http.post('/webapi/getAllAssess_Deaprtment_Value',qs.stringify({'session_id':this.user.sessionID,'assess_id':  this.$route.params.assess_id,'department':value}))
          .then((d)=>{
            if( d !=undefined && d.data.msg == 'success'){
              let val = d.data.value;
              if(val){
                this.data = new Array(val);
              }else{
                this.data = [];
              }
            }else{
              this.$message({ message: d.data.msg,type:'warning' ,duration:1500 });
            }
          });
      }
    },
    created(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      //获取部门
      let postUrl = '/webapi/getAllAssessDepartmentList';
      let params = {
        session_id : this.user.sessionID ? this.user.sessionID : '',
        assess_id : this.$route.params.assess_id ? this.$route.params.assess_id : ''
      }
      this.$http.post(postUrl, qs.stringify(params)).then((d)=>{
        if( d !=undefined && d.data.msg == 'success'){
          let dep = JSON.parse(d.data.value);
          if(dep.length){
            this.departments = dep;
          }else{
            this.departments = [];
          }
        }else{
          this.$message({ message: d.data.msg ,duration:1500 });
        }
      }).catch((err)=>{
        this.$message({ message:'服务器'+err,type:'error',duration:1500 });
      })

    }
  }
</script>
<style scoped>
  /*重写*/
  .topContent{
    margin: 3px auto !important;
  }

  .leftContent {
    position: relative;
    width: 445px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }

  .rightContent {
    position: relative;
    width: 445px;
    height: auto;
    float: right;
    margin-right: 30px;
  }
  .rightUpContent,.rightDownContent {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0;
  }
  .rightDownContent {
    /*margin-top: 10px;*/
    margin-bottom: 10px;
  }
  h3 {
    padding-left: 10px;
    width: 435px;
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
  .el-tree {
    border: none;
    min-height: 38px;
    width: 443px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
  }
  .info {
    padding-left: 30px;
  }
  .resource .el-tree{
    border-top: 1px solid rgb(193,193,193) !important;
  }
  .btnPanel {
    position: relative;
    width: 433px;
    /*height: 28px;*/
    height: auto;
    overflow:hidden;
    padding: 5px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
  }
  .btnPanel .btnLeft {
    float: left;
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
  .resTree{
    margin-bottom: 10px;
  }
  .el-row {
    margin-bottom: 5px;
  }
</style>
