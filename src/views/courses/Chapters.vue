<template>
  <div>
    <!-- 面包屑导航区域    -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/courses' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>章节列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图    -->
    <el-card>
      <!-- 搜索与添加区域      -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加章节</el-button>
        </el-col>
      </el-row>

      <!-- 课程列表区域     -->
      <el-table :data="chapterList" border stripe ref="selectedList" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="章节id" prop="id"></el-table-column>
        <el-table-column label="章节描述" prop="description"></el-table-column>
        <el-table-column label="章节封面" >
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.photoUrl"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="章节视频" prop="description">
          <template slot-scope="scope">
            <video :src="scope.row.videoUrl" controls controlsList="nodownload" style="width: 100%"></video>
          </template>
        </el-table-column>
        <el-table-column label="通过状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.passed" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮          -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮          -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeChapterById(scope.row.id)"></el-button>
            <!--查看视频按钮          -->
            <el-tooltip class="item" effect="dark" content="查看章节" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-suitcase" size="mini" @click="showReadDialog(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域     -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.currentPage"
              :page-sizes="[2, 5, 10, 50]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>

    <add-chapter :AddDialogVisible.sync="addDialogVisible" @addSuccess="getChapterList"></add-chapter>

    <!-- 评论卡片视图    -->
    <el-card style="margin-top: 15px">
      <h1>评论</h1>
    </el-card>

  </div>
</template>

<script>
  //组件
  import AddChapter from "./components/AddChapter";
  //接口
  import {addChapter, deleteChapter, updateChapter, inspectChapter} from "@/api/chapters";
  import {fetchChapterList} from "@/api/courses";

  let courseId = 0;
  export default {
    name: "Chapter",
    components: {AddChapter},
    data() {
      return {
        // 获取课程列表的参数对象
        queryInfo: {
          currentPage: 1,
          orderBy: [],
          pageSize: 5,
        },
        //章节列表
        chapterList: [],
        //章节总数
        total: 10,
        searchFilter: '',  //模糊搜索
        // 控制添加章节视频对话框的显示与隐藏
        addDialogVisible: false,
        // 添加章节视频的表单数据
        addForm: {
        },
        // 添加表单的验证规则对象
        addFormRules: {
        },
        // 控制修改视频章节对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的章节信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {},
        //控制查看视频章节对话框的显示与隐藏
        readDialogVisible: false,
        // 查询到的章节信息对象
        readForm: {}
      }
    },
    methods: {
      //获取章节列表
      getChapterList() {
        fetchChapterList(this.queryInfo,courseId).then(res => {
          console.log('获取章节列表',res);
          this.chapterList = res.payload.list;
          this.total = res.payload.param.totalNum;
        }).catch(err => console.log(err))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageSize = newSize;
        //然后需要重新获取课程章节列表
        this.getChapterList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.currentPage = newPage;
        //然后需要重新获取课程章节列表
        this.getChapterList()
      },
      // 监听添加章节对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 展示编辑章节视频的对话框
      async showEditDialog(id) {
        this.editForm = this.chapterlist[0]
        this.editDialogVisible = true
      },
      showReadDialog(id) {
        this.editForm = this.chapterlist[0]
        this.readDialogVisible = true
      },
      // 监听修改章节对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 根据Id删除对应的视频章节信息
      async removeChapterById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该章节, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteChapter(id).then(res => {
          this.$message.success('删除课程章节成功！');
          this.getChapterList();
        }).catch(error => console.log(error))
      }
    },
    created() {
      courseId = this.$route.query.courseId;
      this.getChapterList();
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.chapterList = this.chapterList.filter(item => {
          let boolFind = false;
          if(item.description !== null && item.description.indexOf(val) !== -1)
            boolFind = true;
          return boolFind
        });
        if(val === '') this.getChapterList(courseId);
      }
    }
  }
</script>

<style scoped>
  .video {
    width: 300px;
    height: 280px;
  }
</style>
