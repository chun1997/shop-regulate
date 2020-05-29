<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="~assets/img/ying.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <!-- 左侧 -->
      <Aside></Aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "./Aside";

export default {
  name: "",
  components: {
    Aside
  },
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-header div {
  color: #eaedf1;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.el-header div span {
  padding-left: 15px;
}
.el-header img {
  height: 100%;
  width: 10%;
  border-radius: 50%;
}
</style>