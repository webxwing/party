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
              <el-button type="primary"  size="small" @click="baseFun.gotoLink({ path:'/admin/process/'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>考核活动</h3>
        <div class="leftContentDetail">
          <el-form label-width="80px" :model="form" :rules="fromRules"  ref="formRef" >
            <el-form-item label="活动名称" prop="name" required>
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="开始日期" prop="starttime" required>
              <el-date-picker type="date" v-model="form.starttime" placeholder="点击选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" prop="endtime" required>
              <el-date-picker type="date" v-model="form.endtime" placeholder="点击选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="考核分值">
              <el-input-number v-model="form.value" :step="2" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="考核说明">
              <el-input type="textarea" v-model="form.memo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm('formRef')">确认添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="rightContent">
        <div class="rightUpContent">
          <h3>选择活动所要考核条目</h3>
          <el-tree :data="data"
                   v-loading = 'loading'
                   element-loading-text="加载中..."
                   node-key = "id"
                   :props="defaultProps"
                   :render-content = "renderContent"
                   :default-expand-all = "true"
                   :show-checkbox = "true"
                   ref="trees">
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
    name: 'processNew',
    store,
    data() {
      return {
        subjectRow: null ,
        user:null,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        form: {
          name: '',
          memo:'',
          value: 0,
          starttime: null,
          endtime: null
        },
        fromRules:{
          name:[{ required:true,message:'名称不能为空',trigger:'blur' },{ min: 1,max: 80,message:'长度在1到80个字符',trigger:'blur' }],

          starttime:[{ type:'date',required:true,message:'开始时间未选择',trigger:'blur' }],
          endtime:[{ type:'date',required:true,message:'结束时间未选择',trigger:'blur' }]
        },
        //等待动画
        loading: true
      }
    },
    methods: {

      renderContent(h,{ node ,data,store }){
        return (
          <span>
             { node.label }
           </span >
        )
      },
      confirm(formName){
        //表单验证
        //获取所选条目数组
        let selectItemArr =this.$refs.trees.getCheckedNodes();
        this.$refs[formName].validate((valid)=>{
          if(valid ){
            //验证通过
            this.$confirm('请确认已在右侧勾选了相关考核条目！',"提示",{
              confirmButtonText:'确定',
              cancelButtonText:'取消',
              type: 'info'
            }).then(_=>{
              //添加活动
              let stringStartTime = new Date(this.form.starttime);
              let stringEndTime = new Date(this.form.endtime);
              let newAssessId = null;
              let addUrl = "/webapi/addAssess/";
              let addParams = {
                session_id : this.user.sessionID ,
                subject_id : this.subjectRow.SUBJECT_ID,
                name: this.form.name,
                memo: this.form.memo,
                value: this.form.value,
                starttime : stringStartTime.getFullYear()+'-'+(stringStartTime.getMonth()+1)+'-'+stringStartTime.getDate(),
                endtime : stringEndTime.getFullYear()+'-'+(stringEndTime.getMonth()+1)+'-'+stringEndTime.getDate()
              }

              this.$http.post(addUrl,qs.stringify(addParams)).then((d)=>{
                if(d && d.data.code != '-1'){
                  //console.log(d.data.value);
                  //记录新生成考核评价id
                  newAssessId = d.data.value;
                }
              }).then(()=>{
                if(newAssessId){
                  //遍历所选节点
                  selectItemArr.map((item)=>{
                    //无子节点（叶子节点）
                    if(!item.children || item.children.length <= 0 ){
                      let addAssessItemUrl = '/webapi/addAssess_item';
                      let addAssessItemParams = {
                        session_id : this.user.sessionID ,
                        assess_id : newAssessId ,
                        value: '0',
                        memo:'',
                        item_id : item.id
                      }
                      this.$http.post(addAssessItemUrl,qs.stringify(addAssessItemParams)).then((d)=>{
                        //添加新考核评价条目

                      })
                    }
                  });
                  this.$message( { message: '添加成功！' , type: 'success' , duration: 1500} );
                  this.baseFun.gotoLink({ path:'/admin/process/'});
                }

              }).catch((err)=>{
                this.$message( { message: err.message , type: 'error' , duration: 1500} );
              })
            }).catch(_=>{
              //对话框取消
            })
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
      //获取缓存的考核信息
      let sessionRow = window.sessionStorage.getItem('processRow');
      this.subjectRow = JSON.parse(sessionRow);

      //获取考核条目树
      let getAllPartyItemsUrl = "/webapi/getAllPartyItems/";
      let getAllPartyItemsParams = {
        session_id : this.user.sessionID ,
        subject_id : this.subjectRow.SUBJECT_ID
      }
      this.$http.post(getAllPartyItemsUrl,qs.stringify(getAllPartyItemsParams)).then((d)=>{
        if(d && d.data.code != '-1'){
          this.data =  new Array( d.data.value );
        }
        this.loading = false;
      }).catch((err)=>{
          this.$message({ message:err , type:'error' , duration: 1500 })
        this.loading = false;
      });

    }
  }
</script>
<style scoped>
  .leftContent {
    position: relative;
    width: 445px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }
  .leftContentDetail {
    width: 435px;
    background-color: #E5E9F2;
    padding: 10px 5px;
  }
  .rightContent {
    position: relative;
    width: 445px;
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
    min-height: 388px;
    width: 443px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
  }
</style>
