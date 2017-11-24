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
              <el-button type="primary"  size="small" @click="baseFun.gotoLink({ path:'/admin/process/'})">返 回</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="leftContent">
        <h3>相关设置</h3>
        <div class="leftContentDetail">
          <el-form label-width="80px" ref="form" :model="itemForm">
            <el-form-item label="条目">
              <span v-text="itemForm.name"></span>
            </el-form-item>
            <el-form-item label="条目分值">
              <el-input-number  v-model="itemForm.value" :step="2" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="评分说明">
              <el-input v-model="itemForm.memo" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveItem">保存</el-button>
            </el-form-item>
            <el-form-item label="评分人">
              <el-select  v-model="people"
                          multiple
                          filterable
                          remote
                          :loading="peopleLoading"
                          :remote-method="remoteMethod"
                          @remove-tag="removeMan"
                          placeholder="请输入姓名或用户名">
                <el-option v-for="item in peopleOptions" :key="item.username" :label="item.username" :value="item.username">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="评分部门">
              <el-tree :data="manAndDepartTrees"
                       node-key = "id"
                       :props="defaultProps"
                       :expand-on-click-node = "false"
                       :default-expand-all = "true"
                       :render-content = "renderContent"
                       ref="manager">
              </el-tree>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog title="评分对象设置"
                   :close-on-click-modal = "false"
                   @close="dialogClose"
                   :visible.sync="showDepartDialog">
        <div class="departByMan">
          <div v-show="showDialogDepart.length > 0">
            <el-checkbox-group v-model="selectDepart" @change="handleSelectDep">
              <el-checkbox v-for="dep in showDialogDepart" :label="dep.id
"  :key="dep.id">{{ dep.department }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-show="showDialogDepart.length <=0">
            <span>没有可选择部门</span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSelectDep">确定</el-button>
          </span>

        </div>
        </el-dialog>

      </div>
      <div class="rightContent">
        <div class="rightUpContent">
          <h3>选择考核活动相关条目</h3>
          <el-tree :data="data"
                   v-loading = 'loading'
                   element-loading-text="加载中..."
                   node-key = "id"
                   @node-click="handleNodeClick"
                   :props="defaultProps"
                   :default-expand-all = "true"
                   highlight-current
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
    name: 'processgrade',
    store,
    data(){
      return {
        subjectRow: null,
        user:null,
        data:[],
        defaultProps:{
          children: 'children',
          label: 'name'
        },
        peopleOptions:[],
        peopleLoading:false,
        loading: false,
        people:[],
        itemForm:{
          name:'-',
          value:0,
          memo:'-'
        },
        //所选条目
        selectItem:null,
        //搜索评分人延迟
        timeout : 0,
        //记录所有被考核部门
        allDepartments: [],
        //是否显示设置对话框
        showDepartDialog: false,
        //对话框中选择的数据
        selectDepart:[],
        //对话框显示可供选择的数据
        showDialogDepart:[],
        //评分人通过加载完成标记 默认在加载
        loadTag: true,
        //设置部门对象的评分人id
        selectManId : ''
      }
    },
    methods:{
      //条目点击事件
      handleNodeClick(data,node,self){
        this.$refs.trees.setCheckedKeys([]);
        node.checked = true;
        this.selectItem = data;
        //每次点击 设置评分人加载标记
        this.loadTag = true;
        //获取当前条目相关考核活动信息
        if(!data.children && data.assess_item_id && data.assess_item_id.length > 0 ){
          let getAssessItemUrl = "/webapi/getAssess_Item";
          let getAssessItemParams = {
            session_id: this.user.sessionID,
            assess_item_id: data.assess_item_id
          };
          let getAssessManUrl = "/webapi/getAssess_Man";
          this.$http.post(getAssessItemUrl,qs.stringify(getAssessItemParams))
          //获取基本信息
            .then((d)=>{
              if( d && d.data.code != '-1'){
                //获取被考核部门
                this.allDepartments = [];
                let getItemDepartmentsUrl = "/webapi/getItemRelevantDepartment";
                let getItemDepartmentsParams = {
                  session_id: this.user.sessionID,
                  subject_id: this.subjectRow.SUBJECT_ID,
                  item_id: data.id
                };
                this.$http.post(getItemDepartmentsUrl,qs.stringify(getItemDepartmentsParams))
                  .then((d)=>{
                    if( d && d.data.code != '-1'){
                      let tempDep = JSON.parse(d.data.value);
                      if(tempDep && tempDep.length > 0){
                        //console.log(tempDep);
                        this.allDepartments = tempDep;
                      }
                    }
                  });

                let item = JSON.parse(d.data.value);
                if(item && item.length > 0 ){
                  this.itemForm.name = item[0].item_name;
                  this.itemForm.value = item[0].VALUE;
                  this.itemForm.memo = item[0].MEMO;
                  return "true";
                }else{
                  this.itemForm.name = '-';
                  this.itemForm.value = 0;
                  this.itemForm.memo = '-';
                  this.$message({ message:d.data.msg, type: 'wraning', duration: 1500 });
                  return "false";
                }
              }
            })
            //获取评分人
            .then(_=>{
              if(_="true"){
                this.$http.post(getAssessManUrl,qs.stringify(getAssessItemParams))
                  .then((d)=>{
                    if( d && d.data.code != '-1'){
                      let tempMan = JSON.parse(d.data.value);
                      if(tempMan && tempMan.length > 0){
                        this.people = [];
                        tempMan.map((man)=>{
                          this.people.push(man.username+'('+man.usercode+')');
                        })
                      }else{
                        this.people = [];
                      }
                    }else{
                      this.people = [];
                    }
                  })
                  .then(_=>{
                    //加载完成
                    this.loadTag = false;


                  })
              }
            })
            .then(_=>{
              //加载完成
              //this.loadTag = false;
            })
            .catch((err)=>{
              this.$message({ message:err,type:'error',duration:1500});
            })
        }

      },
      //评分人下的部门渲染
      renderContent(h,{node,data,store}){
        //console.log(node);
        //console.log(data);
        if(data.parentId){
          return (
            <span>
              { node.label }
            </span >
          );
        }else{
          return (
            <span>
              { node.label  }
              &nbsp;&nbsp;
              <el-button type="text" size="small" icon="edit"
              on-click={ ()=> this.setDep(store,data) }
              >设置</el-button>
            </span>
          );
        }
      },
      removeMan(val){
        if(this.loadTag){return false}
        let manStr =  val.value;
        let manObj = null;
        if(manStr && manStr.length > 0){
          manObj = {
            username: manStr.substring(0,manStr.indexOf('(')),
            usercode: manStr.substring(manStr.indexOf('(') + 1,manStr.indexOf(')'))
          };

          this.$http.post('/webapi/getAssess_Man_RelevantDepartment_List',qs.stringify({ session_id: this.user.sessionID,assess_item_id: this.selectItem.assess_item_id,man_id: manObj.usercode }))
            .then((d)=>{
              if(d && d.data.code != '-1'){
                let value = JSON.parse(d.data.value);
                if( value && value.length > 0){
                  value.map((dep)=>{
                    this.$http.post('/webapi/delAssess_Man',qs.stringify({ session_id: this.user.sessionID, assess_man_id:dep.ASSESS_MAN_ID}))
                      .then((d)=>{

                      });
                  })
                }
              }else if(d&&d.data.code=='-1'){
                this.$message({message:d.data.msg,type:'warning',duration:1500});
              }
            })

        }
      },
      setDep(store,data){
        //设置部门  data中包含已选的部门
        // showDialogDepart = 已选+可选
        let allSelectDep = [];//记录所有评分人已选择的部门
        //勾选当前评分人已选
        if(data.children && data.children.length > 0){
          data.children.map((dep)=>{
            this.showDialogDepart.push({
              id: dep.id,
              department: dep.name
            });
            this.selectDepart.push(dep.id);
          })
        }
        //各部门已选 concat
        this.manAndDepartTrees.map((allSelDep)=>{
          if(allSelDep.children && allSelDep.children.length>0){
            allSelectDep = allSelectDep.concat(allSelDep.children);
          }
        });
        this.allDepartments.map((allDep)=>{
          let has = false;//未选
          for(let i=0;i<allSelectDep.length;i++){
            if(allDep.DEPARTMENT == allSelectDep[i].name){
              has = true;//已选
            }
          }
          if(!has){
            this.showDialogDepart.push({
              id: allDep.RELEVANT_DEPARTMENT_ID,
              department: allDep.DEPARTMENT
            })
          }
        });
        //console.log(this.showDialogDepart);
        this.selectManId = data.id;
        this.showDepartDialog = true;

      },
      //保存分值和说明
      saveItem(){
        if(this.selectItem){
          let updateUrl = '/webapi/updateAssess_Item/';

          let updateParams = {
            session_id: this.user.sessionID,
            assess_item_id: this.selectItem.assess_item_id,
            value : this.itemForm.value,
            memo :  this.itemForm.memo
          }
          //console.log(updateParams);
          this.$http.post(updateUrl,qs.stringify(updateParams))
            .then((d)=>{
              if(d&&d.data.code!='-1'){
                this.$message({message:'基础信息修改成功！',type:'success',duration:1500});
              }
              else if(d&&d.data.code =='-1'){
                this.$message({message:d.data.msg,type:'warning',duration:1500});
              }
            })
        }else{
          //没有选择条目，不能获取评分人
          this.$message( { message:'请先选择活动相关条目',type:'warning',duration:1500 } )
        }
      },

      //搜索获取评分人
      remoteMethod(query){
        if(query!==''){
          this.peopleLoading = true;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(_=>{
            if(!this.selectItem){
              //没有选择条目，不能获取评分人
              this.$message( { message:'请先选择活动相关条目',type:'warning',duration:1500 } )
              return false;
            }
            this.$http.post("/webapi/GetUser/",qs.stringify({ session_id: this.user.sessionID,username: query.trim(),usercode:query.trim() }))
              .then((d)=>{
                if(d && d.data.value && d.data.value.length > 0){
                  this.peopleLoading = false;
                  this.peopleOptions = JSON.parse(d.data.value);
                }else{
                  this.peopleOptions = [];
                }
              })
          },1000)
        }else{
          this.peopleOptions = [];
        }
      },
      //选择部门事件
      handleSelectDep(event){
        //console.log('handleSelectDep');
        //console.log(event);
      },
      //关闭对话框
      dialogClose(){
        //清空已选择和可供选择的数据
        this.selectDepart =[];
        this.showDialogDepart = [];
        this.selectManId = ''
      },
      //确定设置部门
      confirmSelectDep(){
        let selectDep = this.selectDepart;
        let selectMan = this.selectManId;
        let selectObj = this.selectDepObj;//计算属性得到选择的部门（id,name）对象
        let allMan =  this.peopleArr;//计算属性得到所有评分人
//        if(!this.selectDepart || this.selectDepart.length <= 0){ this.dialogClose();
//          this.showDepartDialog = false;  return false }
        //数据库中已存在当前评分人的考核部门
        let getSelectedDepByManId = [];
        //获取评价对象列表
        this.$http.post('/webapi/getAssess_Man_RelevantDepartment_List',qs.stringify({ session_id: this.user.sessionID,assess_item_id: this.selectItem.assess_item_id,man_id: this.selectManId }))
          .then((d)=>{
            if(d && d.data.code != '-1'){
              let value = JSON.parse(d.data.value);
              //console.log(value);
              if( value && value.length > 0){
                getSelectedDepByManId = value;
              }
            }
          })
          .then(_=>{
            //清空数据库已选择的
            let countDel = 0;
            for(let i=0;i<getSelectedDepByManId.length;i++){
              this.$http.post('/webapi/delAssess_Man',qs.stringify({ session_id: this.user.sessionID, assess_man_id:getSelectedDepByManId[i].ASSESS_MAN_ID}))
                .then((d)=>{

                });
              //console.log(getSelectedDepByManId[i]);
              countDel++;
            }
            if( countDel == getSelectedDepByManId.length){
              //清空完成
              //如果选择的部门为空，则将评分人前端移除
              let currentMan = allMan.filter((d)=>{ return d.usercode == selectMan });
              let currentManStr = currentMan[0].username+'('+currentMan[0].usercode+')';
              if(!selectDep || selectDep.length <= 0){
                //更新显示
                this.people = this.people.filter((m)=>{ return m != currentManStr });
              }else{
                //选择部门不为空，添加
                let selectNode = this.manAndDepartTrees.filter((node)=>{
                  return node.id == selectMan;
                });
                //selectNode.children = [{id:'1',name:'aefad',parentId:selectMan}];
                this.people = this.people.filter((m)=>{ return m != currentManStr });

                setTimeout(()=>{
                  //add
                  selectObj.map((dep)=>{
                    let addUrl = '/webapi/addAssess_Man';
                    //let tempName = this.findDepName(dep.id,showDialogDepart);
                    //console.log(tempName);
                    let addParams = {
                      session_id: this.user.sessionID,
                      assess_item_id: this.selectItem.assess_item_id,
                      man_id:selectMan,
                      relevant_department_id:dep.id
                    };
                    this.$http.post(addUrl,qs.stringify(addParams))
                      .then((d)=>{
                        if( d && d.data.code !='-1'){
                          /*
                          console.log(selectNode.children);
                          selectNode.children.push({
                            id:dep.id,
                            name:dep.name,
                            parentId:selectMan
                          })
                          */
                        }
                      });
                    //前端显示所选部门

                  });
                  this.people.push(currentManStr);

                },400)
              }

            }
          })
          /*
          .then(_=>{
            //添加
            this.selectDepart.map((dep)=>{
              this.$http.post('/webapi/addAssess_Man',qs.stringify({
                session_id: this.user.sessionID,
                assess_item_id: this.selectItem.assess_item_id,
                main_id:this.selectManId,
                relevant_department_id:dep
              }))
                .then((d)=>{
                })
            })
          })
          */
          .then(_=>{
            this.$message({ message:'设置完成！',type:'success',duration:1500 })
          })


        this.dialogClose();
        this.showDepartDialog = false;
      }
    },


    computed:{
      selectDepObj:function(){
        let selectTemp = [];
        this.selectDepart.map((dep)=>{
          let department = '';
          for(let i=0;i<this.showDialogDepart.length;i++){
            if( dep == this.showDialogDepart[i].id ){
              department = this.showDialogDepart[i].department;
            }
          }
          selectTemp.push({
            id: dep,
            name: department
          });
        })
        /*
        for(var i=0;i<this.selectDepart.length;i++){
          var tempSelectItem = this.selectDepart[i];
          for(var j=0;j<this.showDialogDepart.length;j++){
            var tempSelectItemShow = this.showDialogDepart[j];
            if( tempSelectItem == tempSelectItemShow.id ){
              selectTemp.push({
                id: tempSelectItem,
                name: tempSelectItemShow.department
              });
              break;
            }
          }
        }*/
        return selectTemp;
      },
      manAndDepartTrees:function(){
        let tempManAndDepTreesArr = [];
        this.peopleArr.map((man)=>{
          let tempMan = {
            id: man.usercode,
            name: man.username,
            parentId:null,
            children:[]
          };
          let tempUrl = '/webapi/getAssess_Man_RelevantDepartment_List';
          let tempParams = {
            session_id: this.user.sessionID,
            assess_item_id: this.selectItem.assess_item_id,
            man_id: man.usercode
          }
          this.$http.post(tempUrl,qs.stringify(tempParams))
            .then((d)=>{
              if(d&&d.data.code!='-1'){
                let tempJson = JSON.parse(d.data.value);
                //console.log(tempJson);
                if(tempJson&&tempJson.length>0){
                  tempJson.map((temp)=>{
                    tempMan.children.push({
                      id: temp.RELEVANT_DEPARTMENT_ID,
                      name: temp.DEPARTMENT,
                      parentId: man.usercode,
                      children:[]
                    });
                  })
                }
              }
            });
          tempManAndDepTreesArr.push(tempMan);
        });
        return tempManAndDepTreesArr;
      },
      peopleArr:function(){
        let tempArr = [];
        this.people.map((man)=>{
          tempArr.push({
            username: man.substring(0,man.indexOf('(')),
            usercode: man.substring(man.indexOf('(') + 1,man.indexOf(')'))
          });
        })
        return tempArr;
      },

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
      //console.log(this.subjectRow);
      //获取考核活动的条目
      this.loading = true;
      let assessItemsUrl = '/webapi/getAllAssess_Item';
      let assessItemsParams = {
        session_id: this.user.sessionID,
        assess_id: this.$route.params.assess_id
      }
      this.$http.post(assessItemsUrl,qs.stringify(assessItemsParams))
        .then((d)=>{
          if( d && d.data.code != '-1'){
            if( d.data.value ){
              this.data = [d.data.value];
            }
          }
        })
        .then(_=>{
          this.loading = false;
      })

    }
  }
</script>
<style scoped>
  .el-select{
    width: 355px;
  }
  .leftContent {
    position: relative;
    width: 445px;
    height: 100%;
    float: left;
    margin-left: 30px;
  }
  .leftContentDetail {
    width: 435px;
    background-color: #edf7ff;
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
  .rightUpContent .el-tree {
    border: none;
    min-height: 388px;
    width: 443px;
    border-left: 1px solid #58B7FF;
    border-right: 1px solid #58B7FF;
    border-bottom: 1px solid #58B7FF;
  }
  .dialog-footer{
    float:right;
    margin: 8px;
  }
 </style>
