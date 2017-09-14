<template>
<div class="main">
  <div class="topContent">
    <h2>过程考核目录</h2>
  </div>
  <div class="bodyContent">
    <div class="btn-menu">
      <el-button-group>
        <el-button type="primary" size="small">新建考核</el-button>
      </el-button-group>
    </div>
    <div class="main-table">
      <el-table :data="workData" border>
        <el-table-column prop="year" label="年度" sortable width="100"></el-table-column>
        <el-table-column prop="title" label="标题" width="400"></el-table-column>
        <el-table-column prop="state" label="状态" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作"  width="220">
          <template scope="scope">
            <el-button type="text" size="small">基本内容</el-button>
            <el-button type="text" size="small">考核过程</el-button>
            <el-button type="text" size="small">分类资源</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="70">
      </el-pagination>
    </div>
    <div class="help">
      <p><el-tag type="primary"><i class="el-icon-warning"></i> 说明</el-tag></p>
      <p>制定：创建结构，用户不能访问</p>
      <p>维护：结构、内容正在修改，用户不能访问</p>
      <p>发布：用户可读写访问（对处于评分状态的条目只能只读访问）</p>
      <p>完成：用户只读访问</p>
    </div>
  </div>
</div>
</template>
<script>
    export default {
      name: 'main',
      data() {
        return {
          workData:[
            {
              id: '1',
              year: '2017',
              title: '2017年基层党建工作目标考核指标体系（一）',
              state: '制定'
            },
            {
              id: '2',
              year: '2016',
              title: '2016年基层党建工作目标考核指标体系（一）',
              state: '发布'
            },
            {
              id: '3',
              year: '2016',
              title: '2016年基层党建工作目标考核指标体系（二）',
              state: '维护'
            },
            {
              id: '4',
              year: '2015',
              title: '2015年基层党建工作目标考核指标体系（一）',
              state: '完成'
            }
          ]
        }
      }
    }
</script>
<style scoped>
.el-table {
  width: 900px;
  margin: 0 auto;
}
.btn-menu {
  display: inline-block;
  margin-left: 30px;
  margin-bottom: 10px;
}
.pagination{
  width: 100%;
  margin: 10px auto;
  text-align: center;
}
.help{
  display: inline-block;
  margin-left: 30px;
}
.help p {
  margin: 5px;
}
</style>
