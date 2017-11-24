<template>
  <div class="main">
    <div class="topContent">
      <h2>党建考核活动设置</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info" style="padding-left:30px;">
          <el-tag type="primary"><i class="el-icon-warning"></i> 考核条目的选择为及时修改，注意:取消后再选择会清空之前条目的设置！</el-tag>
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
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择" style="width:192px">
                <el-option key="启动" label="启动" value="启动"></el-option>
                <el-option key="停止" label="停止" value="停止"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="考核说明">
              <el-input type="textarea" v-model="form.memo"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm('formRef')">确认修改</el-button>
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
                   @check-change="handelCheckChange"
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
    name: 'processEdit',
    data() {
      return {
        store,
        subjectRow: null ,
        user:null,
        //第一次修改活动条目的提示控制
        tip:true,
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
          endtime: null,
          status: '启动'
        },
        //记录获取的已选择条目（assess_item_id）
        tempSelectItemArr:[],
        fromRules:{
          name:[{ required:true,message:'名称不能为空',trigger:'blur' },{ min: 1,max: 80,message:'长度在1到80个字符',trigger:'blur' }],

          starttime:[{ type:'date',required:true,message:'开始时间未选择',trigger:'blur' }],
          endtime:[{ type:'date',required:true,message:'结束时间未选择',trigger:'blur' }]
        },
        //等待动画
        loading: false
      }
    },
    methods: {
      //节点渲染
      renderContent(h,{ node ,data,store }){
        return (
          <span>
             { node.label }
           </span >
        )
      },
      //节点选择改变事件
      handelCheckChange(node,isCheck){
        if(!this.tip && !node.children ){
          //console.log(node);
          //已提示并且是叶子节点，可修改
          //this.$alert('操作成功！','提示');
          if(isCheck){
            //叶子节点选中,增加节点
            let addUrl = '/webapi/addAssess_Item';
            let addParams = {
              session_id : this.user.sessionID,
              assess_id : this.$route.params.assess_id,
              value: '0',
              memo:'',
              item_id :  node.id
            };
            this.$http.post(addUrl,qs.stringify(addParams))
              .then((d)=>{
              if(d && d.data.code !=  '-1' ){
                this.tempSelectItemArr.push({
                  ASSESS_ITEM_ID : d.data.value,
                  ITEM_ID : node.id
                });
                //console.log( this.tempSelectItemArr);
              }else if(d && d.data.code == '-1'){
                this.$message({ message:d.data.msg,type:'warning',duration:1500 })
                this.delAssess_item_node(node.id);
              }
            }).catch((err)=>{
              this.$message({ message:err,type:'error',duration:1500 });
              this.delAssess_item_node(node.id);
            })
          }else{
            //取消，删除节点
            let tempGetAssess_item = this.getAssess_item_idFromSelect(node.id);
            if( tempGetAssess_item && tempGetAssess_item.length  == 1){
              let delUrl = '/webapi/delAssess_Item';
              let delParams = {
                session_id : this.user.sessionID,
                assess_item_id : tempGetAssess_item[0].ASSESS_ITEM_ID
              }
              this.$http.post(delUrl,qs.stringify(delParams))
                .then((d)=>{
                  if(d && d.data.code !=  '-1' ){
                    this.tempSelectItemArr = this.tempSelectItemArr.filter((sel)=>{ return sel.ITEM_ID != node.id});
                  }else if(d && d.data.code == '-1'){
                    this.$message({ message:d.data.msg,type:'warning',duration:1500 })
                    this.addAssess_item_node(node.id);
                  }

                })
                .catch((err)=>{
                  this.$message({ message:err,type:'error',duration:1500 })
                  this.addAssess_item_node(node.id);
                })
            }
          }

        }
      },
      confirm(formName){
        //表单验证
        //获取所选条目数组
        let selectItemArr =this.$refs.trees.getCheckedNodes();
        this.$refs[formName].validate((valid)=>{
          if(valid ){
            //修改活动
            let stringStartTime = new Date(this.form.starttime);
            let stringEndTime = new Date(this.form.endtime);
            let updateUrl = "/webapi/updateAssess/";
            let updateParams = {
              session_id : this.user.sessionID,
              assess_id : this.$route.params.assess_id,
              name: this.form.name,
              memo: this.form.memo,
              value: this.form.value,
              status: this.form.status,
              starttime : stringStartTime.getFullYear()+'-'+(stringStartTime.getMonth()+1)+'-'+stringStartTime.getDate(),
              endtime : stringEndTime.getFullYear()+'-'+(stringEndTime.getMonth()+1)+'-'+stringEndTime.getDate()
            }
            this.$http.post(updateUrl,qs.stringify(updateParams))
              .then((d)=>{
                if(d && d.data.code != '-1'){
                  this.$message({ message: '基本信息修改成功！' , type:'success',duration: 1500 })
                  return "true";
                }else if(d && d.data.code =='-1'){
                  this.$message({ message: d.data.msg , type:'warning',duration: 1500 })
                  return "false";
                }
              })
              /*/批量修改
              .then((d)=>{
                if(d=="true"){
                  //对比已选条目，进行删除和添加条目
                  console.log(this.tempSelectItemArr);
                  selectItemArr.map((item)=>{
                    if(item && !item.children ){
                      //已选的叶子节点
                      this.tempSelectItemArr.map((tempItem)=>{
                        if( item.id == tempItem.ITEM_ID ){
                          //已存在
                        }else{
                          //不存在,添加
                        }
                      });


                    }
                  })

                }
              })
              */ //
              .catch((err)=>{
                this.$message({ message:err, type:'warning',duration:1500 })
              })
          }
        });

      },
      //通过item_id查询assess_item_id
      getAssess_item_idFromSelect(item_id){
        return this.tempSelectItemArr.filter((d)=>{ return d.ITEM_ID == item_id });
      },
      //设置已选的节点为选中状态（用于删除或增加不成功）
      resetAssess_item(){
        //console.log(this.tempSelectItemArr.length);
        let tempArr = [];
        this.tempSelectItemArr.map((selc)=>{
          tempArr.push(selc.ITEM_ID);
        });
        this.tip = true;
        this.$refs.trees.setCheckedKeys(tempArr);
        setTimeout(function(){
          this.tip = false;
        },600);
      },
      addAssess_item_node(id){
        this.tip = true;
        let trees = this.$refs.trees;
        let selectArr = trees.getCheckedKeys();
        selectArr.push(id);
        trees.setCheckedKeys(selectArr);
        setTimeout(_=>{
          this.tip = false;
        },500)
      },
      delAssess_item_node(id){
        this.tip = true;
        let trees = this.$refs.trees;
        let selectArr = trees.getCheckedKeys();
        selectArr = selectArr.filter( (d)=> { return d != id  } );
        trees.setCheckedKeys(selectArr);
        setTimeout(_=>{
          this.tip = false;
        },500)
      }
    },
    mounted(){
      //登录验证
      this.baseFun.isLoginGoTo();
      //防止刷新数据丢失
      store.commit('initialUser');
      //更新数据
      this.user = store.state.user;
      //获取缓存的考核信息
      let sessionRow = window.sessionStorage.getItem('processRow');
      this.subjectRow = JSON.parse(sessionRow);
      //获取考核活动
      let getAssessUrl = '/webapi/getAssess/';
      let getAssessParams = {
        session_id : this.user.sessionID ,
        assess_id : this.$route.params.assess_id
      }
      this.$http.post(getAssessUrl,qs.stringify(getAssessParams))
        .then((d)=>{
          if(d && d.data.code != '-1'){
            //console.log(d.data.value);
            let tempData = JSON.parse(d.data.value);
            if(tempData && tempData.length > 0){
              this.form.name = tempData[0].NAME;
              this.form.memo = tempData[0].MEMO;
              this.form.value = tempData[0].VALUE;
              this.form.starttime = new Date(tempData[0].STARTTIME);
              this.form.endtime = new Date(tempData[0].ENDTIME);
              this.form.status = tempData[0].STATUS;
            }
          }else if(d && d.data.code =='-1'){
            this.$message({ message: d.data.msg , type:'warning',duration: 1500 })
          }
        })
        .catch((err)=>{
          this.$message( { message:err,type:'warning',duration:1500 } )
        })
      //获取考核整个条目树
      let getAllPartyItemsUrl = "/webapi/getAllPartyItems/";
      let getAllPartyItemsParams = {
        session_id : this.user.sessionID ,
        subject_id : this.subjectRow.SUBJECT_ID
      }
      this.$http.post(getAllPartyItemsUrl,qs.stringify(getAllPartyItemsParams))
        .then((d)=>{
        if(d && d.data.code != '-1'){
          this.data =  new Array( d.data.value );
        }
      })
        .then((_)=>{
          //获取考核活动已选条目信息
          if( this.$route.params.assess_id ){
            let getAssessUrl = "/webapi/getAllAssessList_Item/";
            let getAssessParams = {
              session_id : this.user.sessionID,
              assess_id : this.$route.params.assess_id
            }
            this.$http.post(getAssessUrl,qs.stringify(getAssessParams)).then((d)=>{
              if(d && d.data.code != '-1'){
                //console.log(d.data.value); ITEM_ID
                //数据库中获取已选择列表，转换为数组，设置tree的已选节点
                let tempSelectItem = JSON.parse(d.data.value);
                //console.log(tempSelectItem);
                let tempSetSelectItem = [];
                tempSelectItem.map((item)=>{
                  tempSetSelectItem.push(item.ITEM_ID);
                });
                //记录所选条目用于修改操作
                this.tempSelectItemArr = tempSelectItem;
                //设置选中效果
                this.$refs.trees.setCheckedKeys(tempSetSelectItem);

                //提示

                this.$alert('考核条目的选择为及时修改，注意:取消后再选择会清空之前条目的设置！','提示',{
                  confirmButtonText:'确定',
                  callback: action =>{
                    this.tip = false;
                  }
                });

              }else if( d && d.data.code == '-1' ){
                this.$message({ message: d.data.msg , type:'warning',duration: 1500 })
              }
            })
          }
        })
        .catch((err)=>{
        this.$message({ message:err , type:'error' , duration: 1500 })
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
