<template>
  <el-container class="home-container">
    <!--    头部区-->
    <el-header>
      <div>
        <img src="../assets/oldwoman.png" style="height: 50px; width: 60px; margin-left: 10px;" alt="">
        <span>乐龄后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    页面主体区域-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--    侧边栏菜单区域-->
        <el-menu
                background-color="#333744" :router="true"
                text-color="#fff" :collapse-transition="false"
                active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse">
          <el-menu-item index="welcome" >
              <!-- 图标-->
              <i class="el-icon-s-home"></i>
              <!-- 文本 -->
              <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="1">
            <!-- 一级菜单模板区-->
            <template slot="title">
              <!-- 图标-->
              <i class="el-icon-video-camera-solid"></i>
              <!-- 文本 -->
              <span>课程管理</span>
            </template>
            <!--二级菜单-->
            <el-menu-item index="courses" >
              <template slot="title">
                <!-- 图标-->
                <i class="el-icon-s-operation"></i>
                <!-- 文本 -->
                <span>课程列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <!-- 一级菜单模板区-->
            <template slot="title">
              <!-- 图标-->
              <i class="el-icon-s-custom"></i>
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
            <!--二级菜单-->
            <el-menu-item index="users" >
              <template slot="title">
                <!-- 图标-->
                <i class="el-icon-s-unfold"></i>
                <!-- 文本 -->
                <span>用户列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="comments" >
              <template slot="title">
                <!-- 图标-->
                <i class="el-icon-microphone"></i>
                <!-- 文本 -->
                <span>评论列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容体-->
      <el-main>
        <!--  路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {logout} from '@/api/login';
  export default {
    name: "Home",
    data() {
      return {
        //是否折叠
        isCollapse: false,
      }
    },
    methods: {
      async logout() {
        await logout;
        window.sessionStorage.removeItem('token');
        await this.$router.push('/login');
      },
      //点击按钮切换按钮的折叠与展开
      toggleCollapse() {
        this.isCollapse = ! this.isCollapse
      }
    },
    created() {

    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fffdef;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>
