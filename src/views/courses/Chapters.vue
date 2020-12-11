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
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加章节</el-button>
        </el-col>
      </el-row>

      <!-- 课程列表区域     -->
      <el-table :data="chapterList" border stripe ref="selectedList">
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
        <el-table-column label="简介" prop="description"></el-table-column>
        <el-table-column label="通过状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.passed">
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

    <!-- 评论卡片视图    -->
    <el-card style="margin-top: 15px">
      <h1>评论</h1>

    </el-card>

<!--    &lt;!&ndash; 添加视频的对话框 &ndash;&gt;-->
<!--    <el-dialog title="添加章节" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">-->
<!--      &lt;!&ndash; 内容主体区域 &ndash;&gt;-->
<!--      <el-upload-->
<!--              class="upload-demo" style="margin-bottom: 20px"-->
<!--              drag-->
<!--              action="https://jsonplaceholder.typicode.com/posts/"-->
<!--              accept=".txt"-->
<!--              multiple>-->
<!--        <i class="el-icon-upload"></i>-->
<!--        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--        <div class="el-upload__tip" slot="tip">只能上传视频文件，且不超过500mb</div>-->
<!--      </el-upload>-->
<!--      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">-->
<!--        <el-form-item label="章节名称" prop="username">-->
<!--          <el-input v-model="addForm.username"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="章节介绍" prop="description">-->
<!--          <el-input v-model="addForm.description"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="邮箱" prop="email">-->
<!--          <el-input v-model="addForm.email"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="手机" prop="mobile">-->
<!--          <el-input v-model="addForm.mobile"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      &lt;!&ndash; 底部区域 &ndash;&gt;-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="addDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

<!--    &lt;!&ndash; 修改课程的对话框 &ndash;&gt;-->
<!--    <el-dialog title="修改视频章节" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">-->
<!--      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">-->
<!--        <el-form-item label="视频id">-->
<!--          <el-input v-model="editForm.id" disabled></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="章节描述" prop="email">-->
<!--          <el-input v-model="editForm.description"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="视频时长" prop="mobile">-->
<!--          <el-input v-model="editForm.video_duration"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="editDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

<!--    &lt;!&ndash; 查看视频的对话框 &ndash;&gt;-->
<!--    <el-dialog title="查看视频" :visible.sync="readDialogVisible" width="50%">-->
<!--      <video :src="videoUrl" controls autoplay class="video"  :ref=""-->
<!--             width="100%"></video>-->
<!--      <el-form :model="editForm" ref="readFormRef" label-width="70px">-->
<!--        <el-form-item label="视频id">-->
<!--          <el-input v-model="editForm.id" disabled></el-input>-->
<!--        </el-form-item>-->

<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="readDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="readDialogVisible = false">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->

  </div>
</template>

<script>

  //接口
  import {fetchChapterList} from "@/api/courses";

  let courseId = 0;
  export default {
    name: "Chapter",
    data() {
      return {
        //测试视频url
        videoUrl: "https://www.w3school.com.cn//i/movie.ogg",
        // 获取课程列表的参数对象
        queryInfo: {
          currentPage: 1,
          orderBy: [],
          pageSize: 5,
        },
        //章节列表
        chapterList: [
          {id: '00213', video_url: '', video_duration: '3分', course_id: '111', description: '第1章', checked: true, create_time: '2020-10-1'},
          {id: '00214', video_url: '', video_duration: '3分', course_id: '111', description: '第2章', checked: true, create_time: '2020-10-1'},
          {id: '00215', video_url: '', video_duration: '3分', course_id: '111', description: '第3章', checked: true, create_time: '2020-10-1'},
          {id: '00216', video_url: '', video_duration: '3分', course_id: '111', description: '第4章', checked: true, create_time: '2020-10-1'},
          {id: '00217', video_url: '', video_duration: '3分', course_id: '111', description: '第5章', checked: true, create_time: '2020-10-1'},
          {id: '00218', video_url: '', video_duration: '3分', course_id: '111', description: '第6章', checked: true, create_time: '2020-10-1'}
        ],
        //章节总数
        total: 10,
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
      getChapterList(courseId) {
        fetchChapterList(this.queryInfo,courseId).then(res => {
          console.log('获取章节列表',res);
          this.chapterList = res.payload.chapterList;
          this.total = res.payload.listParam.totalNum;
        }).catch(err => console.log(err))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        //然后需要重新获取课程章节列表

      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //然后需要重新获取课程章节列表

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
            '此操作将永久删除该视频章节, 是否继续?',
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

        const { data: res } = await this.$http.delete('users/' + id)

        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功！')
        this.getUserList()
      }
    },
    created() {
      courseId = this.$route.query.courseId;
      console.log('传递过来的参数',courseId);
      this.getChapterList(courseId);
    }
  }
</script>

<style scoped>
  .video {
    width: 300px;
    height: 280px;
  }

</style>
