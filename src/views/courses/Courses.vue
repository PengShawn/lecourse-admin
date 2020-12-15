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
                @click="getCourseList"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="ResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form :inline="true" v-model="queryInfo.courseFilter" size="small" label-width="140px" ref="searchForm">
          <el-form-item label="课程名称：" prop="title">
            <el-input style="width: 203px" v-model="queryInfo.courseFilter.title" placeholder="课程名称"></el-input>
          </el-form-item>
          <el-form-item label="用户id：" prop="userid">
            <el-input style="width: 203px" v-model="queryInfo.courseFilter.userId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item label="是否审核：" prop="checked">
            <el-select v-model="queryInfo.courseFilter.checked" placeholder="请选择是否审核">
              <el-option
                      v-for="item in checkedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否通过：" prop="passed">
            <el-select v-model="queryInfo.courseFilter.passed" placeholder="请选择是否通过">
              <el-option
                      v-for="item in passedOptions"
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
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
        </el-col>
      </el-row>

      <!-- 课程列表区域     -->
      <el-table :data="courseList" border stripe @expand-change="expandChange" ref="selectedList">
        <!--  扩展内容区域      -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="分类:">
                <el-tag v-for="item in expandHobby" v-bind:key="item.id" effect="dark" type="success">{{item.name}}
                </el-tag>
              </el-form-item>
              <el-form-item label="标签:">
                <el-tag v-for="item in expandTag" v-bind:key="item.id" size="small" type="">{{item.name}}</el-tag>
              </el-form-item>
              <el-form-item label="课程id:">
                <span>{{ props.row.course.id }}</span>
              </el-form-item>
              <el-form-item label="作者id:">
                <span>{{ props.row.course.userId}}</span>
              </el-form-item>
              <el-form-item label="介绍视频:">
                <video :src="props.row.videoUrl" controls class="video"
                       width="100%"></video>
              </el-form-item>
              <el-form-item label="课程描述:">
                <span>{{ props.row.course.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--  展示内容区域      -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="课程题目" prop="course.title"></el-table-column>
        <el-table-column label="课程id" prop="course.id"></el-table-column>
        <el-table-column label="作者" prop="master.username"></el-table-column>
        <el-table-column label="课程封面">
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.course.photoUrl"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="course.price"></el-table-column>
        <el-table-column label="通过状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.course.passed" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <div>
              <!--审核按钮          -->
              <el-tooltip class="item" effect="dark" content="审核课程" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"
                           @click="showInspectDialog(scope.row)"></el-button>
              </el-tooltip>
              <!--查看视频按钮 -->
              <el-tooltip class="item" effect="dark" content="查看章节" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-video-camera" size="mini"
                           @click="btnToChapter(scope.row)"></el-button>
              </el-tooltip>
            </div>
            <div style="margin-top: 10px">
              <!--修改按钮          -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!--删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeCourseById(scope.row.course.id)"></el-button>

            </div>
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

    <!-- 添加课程的对话框 -->
    <add-course :AddDialogVisible.sync="addDialogVisible" @addSuccess="addCourseSuccess"></add-course>
    <!-- 修改课程的对话框 -->
    <edit-course :EditDialogVisible.sync="editDialogVisible" :EditForm="editForm"
                 @editSuccess="getCourseList"></edit-course>
    <!-- 审核课程的对话框 -->
    <inspect-course :InspectDialogVisible.sync="inspectDialogVisible"
                    :CourseInfo="courseInfo"
                    @inspectSuccess="getCourseList"></inspect-course>
  </div>
</template>


<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";
  import SelectTag from "@/components/selectTag/SelectTag";
  import EditCourse from "./components/EditCourse";
  import AddCourse from "./components/AddCourse";
  import InspectCourse from "./components/InspectCourse";
  //接口
  import {fetchCourseList, getCourseHobby, getCourseTag, deleteCourse} from "@/api/courses";

  export default {
    name: "Courses",
    components: {ImageUpload, VideoUpload, SelectTag, AddCourse, EditCourse, InspectCourse},
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
            title: null,
            userId: null,
            checked: null,
            passed: null,
            del: false
          }
        },
        //课程
        courseList: [],
        courseInfo: {},
        //展开后信息
        expandHobby: [],
        expandTag: [],
        total: 0,
        searchFilter: '',  //模糊搜索
        // 控制修改课程对话框的显示与隐藏
        editDialogVisible: false,
        editForm: {},
        addDialogVisible: false,
        inspectDialogVisible: false,
        //审核种类
        inspectTypeOptions: [
          {value: 'PASS', label: '审核通过'},
          {value: 'VIOLATE', label: '含暴力信息'},
          {value: 'ELSE', label: '其他原因(不通过)'}
        ],
        inspectForm: {
          courseId: '',
          details: '',
          inspectorId: '',
          type: ''
        },
        inspectFormRules: {
          details: [
            {required: true, message: '请输入审核信息', trigger: 'blur'},
            {
              min: 1,
              message: '审核信息不能为空',
              trigger: 'blur'
            }
          ],
        },
        selectedType: '',
        //是否通过审核
        passedOptions: [
          {value: true, label: '已通过'},
          {value: false, label: '未通过'}
        ],
        //是否已经审核
        checkedOptions: [
          {value: true, label: '已审核'},
          {value: false, label: '未审核'}
        ],
      }
    },
    created() {
      this.getCourseList();
    },
    methods: {
      getCourseList() {
        fetchCourseList(this.queryInfo).then(res => {
          console.log('获取课程列表', res);
          this.courseList = res.payload.list;
          this.total = res.payload.param.totalNum;
        }).catch(error => console.log(error))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.listParam.pageSize = newSize;
        //然后需要重新获取课程列表
        this.getCourseList();
      }
      ,
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.listParam.currentPage = newPage;
        //然后需要重新获取课程列表
        this.getCourseList();
      }
      ,
      //点击查看章节列表按钮
      btnToChapter(row) {
        console.log('跳转到章节', row.course.id);
        this.$router.push({
          path: 'chapters',
          query: {
            courseId: row.course.id
          }
        })
      },
      addCourseSuccess(data) {
        console.log('添加课程成功的信息', data);
        this.editForm = data;
        this.editDialogVisible = true;

      },
      // 展示编辑课程的对话框
      async showEditDialog(row) {
        this.editForm = row.course;
        this.editDialogVisible = true
      },
      //展示审核课程的对话框
      showInspectDialog(row) {
        this.courseInfo = row.course;
        this.inspectDialogVisible = true;
      },
      //删除课程
      async removeCourseById(id) {
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
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteCourse(id).then(res => {
          this.$message.success('删除课程成功！');
          this.getCourseList()
        }).catch(error => console.log(error))
      },
      //展开课程详情
      async expandChange(row, expandedRows) {
        if (expandedRows.length === 0) return;
        const lastExpand = expandedRows[expandedRows.length - 1].course;
        if (expandedRows.length > 1) {
          expandedRows.map((item) => {
            if (lastExpand.id !== item.id) {
              this.$refs.selectedList.toggleRowExpansion(item, false)
            }
          })
        }
        //获取展开课程的hobby
        getCourseHobby(lastExpand.id).then(res => {
          this.expandHobby = res.payload;
        }).catch(error => console.log(error));
        //获取展开课程的tag
        getCourseTag(lastExpand.id).then(res => {
          this.expandTag = res.payload;
        }).catch(error => console.log(error));
      },
      //重置搜索
      ResetSearch() {
        this.queryInfo.courseFilter = {
          title: null,
          userId: null,
          checked: null
        };
        this.getCourseList()
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.courseList = this.courseList.filter(item => {
          let boolFind = false;
          if (item.course.title !== null && item.course.title.indexOf(val) !== -1) {
            boolFind = true;
          } else if (item.course.description !== null && item.course.description.indexOf(val) !== -1) {
            boolFind = true;
          } else if (item.master.username !== null && item.master.username.indexOf(val) !== -1)
            boolFind = true;
          return boolFind
        });
        if (val === '') this.getCourseList();
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
    width: 100%;
  }

  .demo-table-expand .el-tag {
    margin-right: 10px;
  }

  .video {
    width: 350px;
    height: 300px;
  }

</style>
