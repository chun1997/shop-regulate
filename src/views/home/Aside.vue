<template>
  <el-aside :width="isCollapse?'64px':'200px'">
    <!-- 折叠区域 -->
    <div class="toggle-button" @click="toggleClick">|||</div>
    <!-- 侧边栏菜单 -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="$route.path"
    >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
        <template slot="title">
          <i :class="icons[index]" class="iconFont"></i>
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      menuList: [],
      icons: [
        "el-icon-user-solid",
        "el-icon-success",
        "el-icon-s-goods",
        "el-icon-s-order",
        "el-icon-s-marketing"
      ],
      isCollapse: false
    };
  },
  methods: {
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    }
  },
  async created() {
    const { data: res } = await this.$http.get("menus");
    console.log(res);

    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.menuList = res.data;
  }
};
</script>

<style scoped>
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconFont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>