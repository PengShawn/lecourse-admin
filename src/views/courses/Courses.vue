<template>
  <div>
    <!-- 面包屑导航区域    -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选搜索卡片   -->
    <el-card style="margin-bottom: 15px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float: right"
                @click="handleSearchList()"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form :inline="true" v-model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="课程id：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="课程id"></el-input>
          </el-form-item>
          <el-form-item label="课程分类：">
            <el-cascader clearable v-model="selectCourseValue" :options="courseOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="作者名称：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="作者名称"></el-input>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="verifyStatusValue" placeholder="全部" clearable>
              <el-option
                      v-for="item in verifyStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 卡片视图    -->
    <el-card>
      <!-- 搜索与添加区域      -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="btnAddCourse">添加课程</el-button>
        </el-col>
      </el-row>

      <!-- 课程列表区域     -->
      <el-table :data="courseList" border stripe>
        <!--  扩展内容区域      -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程id">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="创建者id">
                <span>{{ props.row.user_id }}</span>
              </el-form-item>
              <el-form-item label="点赞量">
                <span>{{ props.row.star }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--  展示内容区域      -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="课程id" prop="id"></el-table-column>
        <el-table-column label="创建者" prop="user_id"></el-table-column>
        <el-table-column label="课程封面">
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.photo_url"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="审核状态" prop="checked">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.checked">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮          -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮          -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!--查看视频按钮          -->
            <el-tooltip class="item" effect="dark" content="查看课程章节" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-video-camera" size="mini" @click="btnToChapter"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域     -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.listParam.currentPage"
              :page-sizes="[2, 5, 10, 50]"
              :page-size="queryInfo.listParam.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改课程的对话框 -->
    <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="课程id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="email">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" prop="mobile">
          <el-input v-model="editForm.photo_url"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {fetchCourseList} from "@/api/courses";

  export default {
    name: "Courses",
    data() {
      return {
        // 获取课程列表的参数对象
        queryInfo: {
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          },
          courseFilter: {
          }
        },
        //课程
        courseList: [
          {
            id: '111',
            user_id: '000001',
            photo_url: 'https://img13.360buyimg.com/babel/s320x320_jfs/t1/119166/16/17215/426351/5f54f132E5aa3dc82/35f473f073295c47.jpg!cc_320x320.webp',
            price: 20,
            star: 20,
            hits: 200,
            create_time: '2020-10-3',
            checked: true
          },
          {
            id: '112',
            user_id: '000002',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 10,
            star: 20,
            hits: 200,
            create_time: '2020-10-4',
            checked: false
          },
          {
            id: '113',
            user_id: '000003',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 30,
            star: 20,
            hits: 200,
            create_time: '2020-10-3',
            checked: true
          },
          {
            id: '114',
            user_id: '000004',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 50,
            star: 20,
            hits: 200,
            create_time: '2020-10-7',
            checked: true
          },
          {
            id: '115',
            user_id: '000005',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 70,
            star: 20,
            hits: 200,
            create_time: '2020-10-3',
            checked: true
          },
          {
            id: '116',
            user_id: '000006',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 2,
            star: 20,
            hits: 200,
            create_time: '2020-10-3',
            checked: false
          },
          {
            id: '117',
            user_id: '000007',
            photo_url: 'https://img10.360buyimg.com/img/s200x200_jfs/t1/72384/18/15450/95485/5dce0dd6Ea6afaa33/ee3ca6ef4f171c37.jpg!cc_100x100.webp',
            price: 23,
            star: 20,
            hits: 200,
            create_time: '2020-10-3',
            checked: true
          },
        ],
        total: 10,
        // 控制修改课程对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的课程信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {},
        //筛选搜索
        listQuery: [],
        selectCourseValue: [],
        courseOptions: [
          {
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'skerch',
              label: 'Sketch Templates'
            }, {
              value: 'zujianjiaohu',
              label: '组件交互文档'
            }, {
              value: 'zujianjiaohu',
              label: '交互文档'
            }]
          },
          {
            value: 'zujian',
            label: '组件',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'skerch',
              label: 'Sketch Templates'
            }, {
              value: 'zujianjiaohu',
              label: '组件交互文档'
            }, {
              value: 'zujianjiaohu',
              label: '组件交互文档'
            }]
          },
          {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }, {
              value: 'zujianjiaohu',
              label: '组件交互文档'
            }]
          },
          {}
        ],   //课程二级分类列表
        verifyStatusOptions: [
          {
            value: '选项1',
            label: '审核通过'
          }, {
            value: '选项2',
            label: '待审核'
          }, {
            value: '选项3',
            label: '审核不通过'
          }],   //审核状态列表
        verifyStatusValue: ''
      }
    },
    created() {
      this.getCourseList()
    },
    methods: {
      getCourseList() {
        fetchCourseList(this.queryInfo).then(res => {
          console.log('获取课程列表', res);
          this.courseList = res.payload.courseList;
          this.total = res.payload.listParam.totalNum;
        }).catch(error => console.log(error))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        //然后需要重新获取课程列表

      }
      ,
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //然后需要重新获取课程列表

      }
      ,
      //点击添加课程按钮
      btnAddCourse() {
        this.$router.push('addcourses')
      }
      ,
      //点击查看章节列表按钮
      btnToChapter() {
        //此次还需要传参课程id，先做个demo
        this.$router.push('chapters')
      }
      ,
      // 展示编辑章节视频的对话框
      async showEditDialog(id) {

        this.editForm = this.courselist[0]
        this.editDialogVisible = true
      }
      ,
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      }
      ,

      // 根据Id删除对应的课程信息
      async removeUserById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该课程, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err)

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        const {data: res} = await this.$http.delete('users/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getUserList()
      }
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
    width: 50%;
  }
</style>
