<template>
  <el-form :model="data" label-width="80px">

    <el-form-item label="普通表单">
      <el-input v-model="data.test1"></el-input>
    </el-form-item>
    <el-form-item label="上传测试">
      <el-upload
        class="upload-demo"
        action="http://localhost:53975/webapi/FileUpload?name='121'"
        :data="dataname"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

  </el-form>

</template>
<script>
    export default {
      name:'upload',
      data() {
        return {
          data:{test1:''},
          fileList: [],
          dataname:{'value':'datanamevalue'}
        };
      },
      methods: {
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleSuccess(response,file,fileList){
          console.log(response);
          console.log(file);
          console.log(fileList);
        }
      }
    }
</script>
<style scoped>

</style>
