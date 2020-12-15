<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选搜索卡片   -->
    <el-card style="margin-bottom: 15px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float: right"
                @click="getUserList"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="ResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form :inline="true" v-model="queryInfo.userFilter" size="small" label-width="140px" ref="searchForm">
          <el-form-item label="输入搜索：" prop="username">
            <el-input style="width: 203px" v-model="queryInfo.userFilter.username" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-select v-model="queryInfo.userFilter.gender" placeholder="请选择性别">
              <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区：" prop="region">
            <div class="block">
              <el-cascader
                      size="large"
                      :options="region"
                      v-model="searchSelectedRegion"
                      @change="searchRegionChange">
              </el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-select v-model="queryInfo.userFilter.role" placeholder="请选择角色">
              <el-option
                      v-for="item in roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="有效状态：">-->
          <!--            <el-switch disabled v-model="!queryInfo.userFilter.del">-->
          <!--            </el-switch>-->
          <!--          </el-form-item>-->
        </el-form>
      </div>
    </el-card>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="用户名模糊搜索" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search" disabled></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="batchDelete">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe @selection-change="handleSelectionChange" ref="seclectedList"
                @sort-change="changeTableSort">
        <!-- 选择多行 -->
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>

        <!--  扩展内容区域      -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名:">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="用户id:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="省份:">
                <span>{{ props.row.province }}</span>
              </el-form-item>
              <el-form-item label="城市:">
                <span>{{ props.row.city }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- 展示内容区域-->
        <el-table-column type="index"></el-table-column>
        <el-table-column sortable label="用户名" prop="username"></el-table-column>
        <el-table-column sortable label="微信昵称" prop="nickname"></el-table-column>
        <el-table-column sortable label="性别" prop="gender" :formatter="genderStateFormat"></el-table-column>
        <el-table-column label="角色" prop="role" :formatter="roleStateFormat"></el-table-column>
        <el-table-column label="有效状态">
          <template slot-scope="scope">
            <el-switch disabled v-model="!scope.row.del" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" :current-page="queryInfo.listParam.currentPage"
                     :page-sizes="[2, 5, 10, 50]" :page-size="queryInfo.listParam.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!--取消选择按钮-->
      <el-button @click="toggleSelection()" style="margin-top: 10px">取消选择</el-button>
    </el-card>

    <!-- 添加用户的对话框 -->
    <add-user :AddDialogVisible.sync="addDialogVisible" @addSuccess="getUserList"></add-user>

    <!-- 修改用户的对话框 -->
    <edit-user :EditDialogVisible.sync="editDialogVisible" :EditForm="editForm" @editSuccess="getUserList" ></edit-user>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRole" placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchUserList,
    deleteUser,
    updateUserRole,
    batchDeleteUser
  } from '@/api/users';
  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'

  import AddUser from "./components/AddUser";
  import EditUser from "./components/EditUser";
  export default {
    name: "Users",
    components: {AddUser,EditUser},
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          listParam: {
            currentPage: 1,
            pageSize: 5,
          },
          userFilter: {
            username: null,
            role: null,
            province: null,
            city: null,
            gender: null,
            del: null
          }
        },
        userList: [],
        total: 0,
        searchFilter: '',  //模糊搜索
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 修改用户前查询到的用户信息对象
        editForm: {},
        // 控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        //性别选择
        genderOptions: [
          {value: 'MALE', label: '男'},
          {value: 'FEMALE', label: '女'},
          {value: 'ELSE', label: '其他'},
        ],
        //角色选择
        roleOptions: [
          {value: 'USER', label: '用户'},
          {value: 'MERCHANT', label: '商家'},
          {value: 'VERIFIED', label: '审核者'},
          {value: 'ADMIN', label: '管理员'},
        ],
        //日期选择
        birthdayOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        //地区选择
        region: provinceAndCityData,
        //增加表单选中的地区
        selectedRegion: [],
        // 需要被分配角色的用户信息
        userInfo: {},
        // 已选中的角色值
        selectedRole: '',
        //筛选搜索
        searchSelectedRegion: [], //筛选地区
        selectedId: [] //批量删除id
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        fetchUserList(this.queryInfo).then(res => {
          console.log('获取用户列表', res);
          this.userList = res.payload.list;
          this.total = res.payload.param.totalNum;
        }).catch(error => console.log(error))
      },
      //角色的后台数据转化显示
      roleStateFormat(row, column) {
        if (row.role === 'ADMIN') {
          return '管理员'
        } else if (row.role === 'USER') {
          return '用户'
        } else if (row.role === 'VERIFIED') {
          return '审核者'
        } else if (row.role === 'MERCHANT') {
          return '商家'
        } else {
          return '新增'
        }
      },
      //性别的后台数据转化显示
      genderStateFormat(row, column) {
        if (row.gender === 'MALE') {
          return '男'
        } else if (row.gender === 'FEMALE') {
          return '女'
        } else {
          return '其他'
        }
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.listParam.pageSize = newSize;
        this.getUserList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.listParam.currentPage = newPage;
        this.getUserList()
      },
      // 监听 switch 开关状态的改变
      async userStateChanged(userinfo) {
        console.log(userinfo)
      },
      //筛选用户选择地区
      searchRegionChange(region) {
        this.queryInfo.userFilter.province = CodeToText[ region[0] ];
        if(CodeToText[ region[1] ] === '市辖区')
          this.queryInfo.userFilter.city = CodeToText[ region[0] ];
        else
          this.queryInfo.userFilter.city = CodeToText[ region[1] ];
      },
      // 展示编辑用户的对话框
      async showEditDialog(row) {
        this.editForm = row;
        this.editDialogVisible = true;
      },
      // 根据Id删除对应的用户信息
      async removeUserById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该用户, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteUser(id).then(res => {
          this.$message.success('删除用户成功！')
          this.getUserList()
        }).catch(error => console.log(error))
      },
      // 展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo;
        this.setRoleDialogVisible = true
      },
      // 点击按钮，分配角色
      async saveRoleInfo() {
        if (!this.selectedRole) {
          return this.$message.error('请选择要分配的角色！')
        }

        let param = new URLSearchParams();
        param.append("id", this.userInfo.id);
        param.append("role", this.selectedRole);
        await updateUserRole(this.userInfo.id, param).then(res => {
          this.$message.success('更新角色成功！');
          this.getUserList();
          this.setRoleDialogVisible = false
        }).catch(error => console.log(error))
      },
      // 监听分配角色对话框的关闭事件
      setRoleDialogClosed() {
        this.selectedRole = '';
        this.userInfo = {}
      },
      //取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.seclectedList.toggleRowSelection(row);
          });
        } else {
          this.$refs.seclectedList.clearSelection();
        }
      },
      //处理选择变化
      handleSelectionChange(val) {
        this.selectedId = val.map((item) => {
          return item.id
        });
      },
      //批量删除
      async batchDelete() {
        if (this.selectedId.length === 0) {
          return this.$message.info('未选中用户')
        }
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除这些用户, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await batchDeleteUser(this.selectedId).then(res => {
          this.$message.success('删除用户成功！')
          this.getUserList()
        }).catch(error => console.log(error))
      },
      ResetSearch() {
        const originalFilter = {
          username: null,
          role: null,
          province: null,
          city: null,
          gender: null,
          del: null
        };
        this.queryInfo.userFilter = originalFilter;
        this.getUserList();
      },
      changeTableSort(column) {
        console.log(column);
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.userList = this.userList.filter(item => {
          let boolFind = false;
          if(item.username !== null && item.username.indexOf(val)!==-1){
            boolFind = true;
          }
          else if(item.nickname !== null && item.nickname.indexOf(val)!==-1)
            boolFind = true;
          return boolFind;
        });
        if (val === '') this.getUserList();
      },
      addDialogVisible(newV,oldV){
        console.log('父组件中addDialogVisible改变',newV,oldV);
      },
    }
  }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
