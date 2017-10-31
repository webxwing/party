<template>
<div class="main">
  <div class="leftStepsContent">
    <leftSteps :active-numb="1"></leftSteps>
  </div>

  <div class="rightContent">
    <div class="topContent">
      <h2>考核总览</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" @click="baseFun.gotoLink({ path:'/admin/main' })">退出</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="保存并进入考核体系设置" placement="top">
              <el-button type="primary"  size="small" @click="onSubmit('form')" >下一步</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="form">
        <el-form :model="form"  label-width="80px" ref="form"  :rules="rules">
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.name" placeholder="请输入考核标题"></el-input>
          </el-form-item>
          <el-form-item label="年度" prop="year">
            <el-select v-model="form.year" placeholder="请选择年度" style="width: 290px;">
            <el-option v-for="year in years" :key="year.label" :label="year.label" :value="year.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考核时间" required>
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker type="date" placeholder="开始日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">--</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker type="date" placeholder="结束日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="r in statusArr" :key="r.label" :label="r.label" :disabled="r.disabled"></el-radio>

            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>

</div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
  import store from '../common/store.js'
  import qs from 'qs'
  export default {
      name: 'new',
      data() {
        return {
          years:[],
          form: {
            subjectID:'',
            name: '',
            year: '',
            startTime: '',
            endTime: '',
            status: '制定',
            department:''
          },
          editParty:{},
          store,
          user:{},
          rules:{
            name:[{ required:true,message:'标题不能为空',trigger:'blur' },{ min: 3,max: 80,message:'长度在3到80个字符',trigger:'blur' }],
            year:[{ required:true,message:'请选择年度',trigger:'blur' }],
            startTime:[{ type:'date',required:true,message:'开始时间未选择',trigger:'blur' }],
            endTime: [{ type:'date',required:true,message:'结束时间未选择',trigger:'blur' }]
          },
          statusArr:[
            { label:'制定',disabled: false },
            { label:'维护',disabled: true },
            { label:'发布',disabled: true },
            { label:'完成',disabled: true },
            { label:'终止',disabled: true }
          ]
        }
      },
      store,
      components: { leftSteps },
      methods: {
        onSubmit(formName){
          //表单验证
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let loading = this.$loading({text:"保存中..."});
              //判断是否有可修改的参数
              var stringStartTime = new Date( this.form.startTime);
              var stringEndTime = new Date(this.form.endTime);
              if(this.$route.params.row){
                //修改
                let posteditUrl = '/webapi/updateParty';
                let prams = {
                  session_id : this.user.sessionID,
                  subject_id : this.$route.params.row.SUBJECT_ID,
                  department : this.$route.params.row.DEPARTMENT,
                  name : this.form.name,
                  year : this.form.year,
                  startTime : stringStartTime.getFullYear()+'-'+(stringStartTime.getMonth()+1)+'-'+stringStartTime.getDate(),
                  endTime : stringEndTime.getFullYear()+'-'+(stringEndTime.getMonth()+1)+'-'+stringEndTime.getDate(),
                  memo : this.$route.params.row.MEMO,
                  status: this.form.status,
                };
                this.$http.post(posteditUrl,qs.stringify(prams)).then((d)=>{
                  if (d !== undefined && d.data.msg == 'success') {
                    //存储id
                    this.form.subjectID = this.$route.params.row.SUBJECT_ID;
                    //修改的数据缓存newParty
                    window.sessionStorage.setItem('newParty',JSON.stringify(this.form));
                    loading.close();
                    this.$message({ message: '保存成功！',type:'success',duration:1500 });
                    this.baseFun.gotoLink({name:'new2'});
                  } else {
                    loading.close();
                    this.$message({ message: d.data.msg,type:'warning',duration:1500 });
                  }
                }).catch((err)=>{
                  loading.close();
                  this.$message({ message:'服务器'+err,type:'error',duration:1500 });
                });
              }else{
                //添加
                let postaddUrl = '/webapi/addParty';
                let prams = {
                  session_id : this.user.sessionID,
                  department : this.user.department,
                  name : this.form.name,
                  year : this.form.year,
                  startTime : stringStartTime.getFullYear()+'-'+(stringStartTime.getMonth()+1)+'-'+stringStartTime.getDate(),
                  endTime : stringEndTime.getFullYear()+'-'+(stringEndTime.getMonth()+1)+'-'+stringEndTime.getDate(),
                  memo : ''
                };
                this.$http.post(postaddUrl,qs.stringify(prams)).then((d) => {
                  if (d !== undefined && d.data.msg == 'success') {
                    //获取subject_id
                    this.form.subjectID = d.data.value;
                    //存储新建
                    store.state.newParty = this.form;
                    //将新建的数据缓存
                    window.sessionStorage.setItem('newParty',JSON.stringify(this.form));
                    loading.close();
                    this.$message({ message: '新建成功！',type:'success',duration:1500 });
                    this.baseFun.gotoLink({path:'/admin/new2'});
                  } else {
                    loading.close();
                    this.$message({ message: d.data.msg,type:'warning',duration:1500 });
                  }
                }).catch((err) => {
                  loading.close();
                  this.$message({ message:'服务器'+err,type:'error',duration:1500 });
                });
              }

              return true;
            } else {
              return false;
            }
          });
        }
      },
      created(){
        //登录验证
        this.baseFun.isLoginGoTo();
        //防止刷新数据丢失
        store.commit('initialUser');
        store.commit('initNewParty');
        //有参数传递则为修改或者已创建了考核目录
        if(this.$route.params.row){
          //有参数
          this.editParty = this.$route.params.row;
          this.form.subjectID = this.editParty.SUBJECT_ID;
          this.form.name = this.editParty.NAME;
          this.form.year = this.editParty.YEAR;
          this.form.startTime = new Date(this.editParty.STARTTIME);
          this.form.endTime = new Date(this.editParty.ENDTIME);
          this.form.status = this.editParty.STATUS;
          this.form.department = this.editParty.DEPARTMENT;

          //状态可修改
          this.statusArr = [
            { label:'制定',disabled: false },
            { label:'维护',disabled: false },
            { label:'发布',disabled: false },
            { label:'完成',disabled: false },
            { label:'终止',disabled: false }
          ];

        }

        this.user = store.state.user;
        //年度选择项数据的初始化
        let currentYear = new Date().getFullYear();
        for(var i=currentYear+2;i>currentYear-4;i--){
          this.years.push({ 'value': i.toString() , 'label': i });
        }
      }
    }
</script>
<style scoped>

.form {
  margin-right: 30px;
}

</style>
