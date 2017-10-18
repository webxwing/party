<template>
  <div class="main">
    <div class="topContent">
      <h2>党建工作过程考核目录</h2>
      <h3>信息工程学院党总支</h3>
    </div>
    <div class="bodyContent">
      <div class="btn-menu">

      </div>
      <div class="main-table">
        <el-table :data="workData" border>
          <el-table-column prop="year" label="年度" sortable width="90"></el-table-column>
          <el-table-column  label="标题" width="330">
            <template scope="scope">
              <el-button type="text" @click="gotoLink('process')">{{ scope.row.title }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" width="70"></el-table-column>
          <el-table-column prop="beginDate" label="开始"  width="110"></el-table-column>
          <el-table-column prop="endDate" label="结束"  width="110"></el-table-column>
          <el-table-column prop="score" label="得分"  width="70"></el-table-column>
          <el-table-column prop="total" label="总分"  width="70" fixed="right"></el-table-column>
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
        <p>发布：用户可读写访问（对处于评分状态的条目只能只读访问）</p>
        <p>完成：用户只读访问</p>
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../router'
  export default {
    name: 'usermain',
    data() {
      return {
        workData:[
          {
            id: '1',
            year: '2017',
            title: '2017年基层党建工作目标考核指标体系（一）',
            state: '制定',
            beginDate:'2017-1-1',
            endDate:'2017-12-31',
            score: 56,
            total:100
          },
          {
            id: '2',
            year: '2016',
            title: '2016年基层党建工作目标考核指标体系（一）',
            state: '发布',
            beginDate:'2016-1-1',
            endDate:'2016-6-30',
            score: 96,
            total:100
          },
          {
            id: '3',
            year: '2016',
            title: '2016年基层党建工作目标考核指标体系（二）',
            state: '维护',
            beginDate:'2016-7-1',
            endDate:'2016-12-31',
            score: 90,
            total:100
          },
          {
            id: '4',
            year: '2015',
            title: '2015年基层党建工作目标考核指标体系（一）',
            state: '完成',
            beginDate:'2015-1-1',
            endDate:'2015-12-31',
            score: 91,
            total:100
          }
        ]
      }
    },
    methods: {
      gotoLink(link){
        router.push(link);
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
  h3{
    margin: 5px;
  }
</style>
