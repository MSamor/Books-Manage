<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1']">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>书籍管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/book/bookSearch">书籍信息</el-menu-item>
            <el-menu-item index="/book/bookManage">借阅管理</el-menu-item>
            <el-menu-item index="/book/bookLog">借阅记录</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown class="bigFont">
          图书管理系统2.0
          <!-- <i class="el-icon-setting" style="margin-right: 15px"></i> -->
          <!-- <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>-->
        </el-dropdown>
        <!-- <span>王小虎</span> -->
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created: function() {
    if (this.GLOBALDATA.password == "") {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scope="scope">
html,
body {
  margin: 0;
  padding: 0;
  min-width: 1290px;
}
.bigFont {
  font-size: 30px !important;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

