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
      <!-- 搜索与添加区域      -->
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
              <el-form-item label="作者:">
                <span>{{expandUsername}}</span>
              </el-form-item>
              <el-form-item label="分类:">
                <el-tag v-for="item in expandHobby" v-bind:key="item.id" effect="dark" type="success">{{item.name}}
                </el-tag>
              </el-form-item>
              <el-form-item label="标签:">
                <el-tag v-for="item in expandTag" v-bind:key="item.id" size="small" type="">{{item.name}}</el-tag>
              </el-form-item>
              <el-form-item label="课程id:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="作者id:">
                <span>{{ props.row.userId}}</span>
              </el-form-item>
              <el-form-item label="介绍视频:">
                <video :src="props.row.videoUrl" controls class="video"
                       width="100%"></video>
              </el-form-item>
              <el-form-item label="课程描述:">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--  展示内容区域      -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="课程名称" prop="title"></el-table-column>
        <el-table-column label="课程id" prop="id"></el-table-column>
        <el-table-column label="作者id" prop="userId"></el-table-column>
        <el-table-column label="课程封面">
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.photoUrl"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="审核状态" prop="checked">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.checked" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮          -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--审核按钮          -->
            <el-tooltip class="item" effect="dark" content="审核课程" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                         @click="showInspectDialog(scope.row)"></el-button>
            </el-tooltip>
            <!--查看视频按钮    -->
            <el-tooltip class="item" effect="dark" content="查看章节" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-video-camera" size="mini" @click="btnToChapter"></el-button>
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

    <!-- 添加课程的对话框 -->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addCourseInputCourse" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addCourseInputCourse.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addCourseInputCourse.description" clearable></el-input>
        </el-form-item>
        <div>
          <label>课程分类</label>
          <el-select
                  v-model="hobbyIdList"
                  multiple
                  collapse-tags
                  style="margin-left: 12px;margin-bottom: 10px;"
                  placeholder="请选择">
            <el-option
                    v-for="item in hobbyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-form>
      <label>介绍视频:</label>
      <video-upload @videoInfo="uploadVideoSuccess" style="margin-left: 70px"></video-upload>
      <label>课程封面:</label>
      <image-upload @photoUrl="uploadImageSuccess" style="margin-left: 70px"></image-upload>

      <label>课程标签:</label>
      <select-tag @selectValue="handleAddTagIdList" :tagIdList="tagIdList" style="margin-left: 70px"></select-tag>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改课程的对话框 -->
    <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="课程id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程题目" prop="email">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" prop="email">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <label>介绍视频:</label>
      <video-upload @videoInfo="uploadVideoSuccess" style="margin-left: 70px"></video-upload>
      <label>课程封面:</label>
      <image-upload @photoUrl="uploadImageSuccess" style="margin-left: 70px"></image-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审核课程的对话框 -->
    <el-dialog title="审核课程" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <p>课程题目：{{courseInfo.title}}</p>
        <p>创建人id：{{courseInfo.userId}}</p>
        <p>课程描述：</p>
        <textarea readonly rows="3" cols="80">{{courseInfo.description}}</textarea>
        <el-form :model="inspectForm" :rules="inspectFormRules" ref="inspectFormRef" label-width="80px">
          <el-form-item label="审核信息" prop="details">
            <el-input v-model="inspectForm.details"></el-input>
          </el-form-item>
          <el-form-item label="审核种类" prop="type">
            <el-select v-model="selectedType" placeholder="请选择">
              <el-option v-for="item in inspectTypeOptions" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inspectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="inspectInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";
  import SelectTag from "@/components/selectTag/SelectTag";
  import EditCourse from "./components/EditCourse";
  //接口
  import {fetchCourseList, addCourse, updateCourse, auditCourse, getCourseHobby, getCourseTag} from "@/api/courses";
  import {getUserInfo} from "@/api/users";
  import {fetchHobbyList} from "@/api/hobby";

  export default {
    name: "Courses",
    components: {ImageUpload, VideoUpload,SelectTag,EditCourse},
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
            passed: null
          }
        },
        //课程
        courseList: [],
        courseInfo: {},
        //所有hobby
        hobbyList: [],
        //展开后信息
        expandHobby: [],
        expandTag: [],
        expandUsername: '',
        total: 0,
        searchFilter: '',  //模糊搜索
        // 控制修改课程对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的课程信息对象
        addDialogVisible: false,
        inspectDialogVisible: false,
        addCourseInputCourse: {
          city: "13000000",
          description: "",
          photoUrl: "",
          position: "13000000",
          price: 0,
          province: "13000000",
          title: "",
          type: "COURSE",
          userId: null,
          videoDuration: 0,
          videoUrl: ""
        },
        hobbyIdList: [],
        tagIdList: [],
        addFormRules: {
          title: [
            {required: true, message: '请输入课程标题', trigger: 'blur'},
            {
              min: 2,
              max: 50,
              message: '用户名的长度在2~50个字符之间',
              trigger: 'blur'
            }
          ],
          description: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
            {
              min: 2,
              max: 200,
              message: '用户名的长度在2~200个字符之间',
              trigger: 'blur'
            }
          ],
        },
        editForm: {},
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
      this.getHobbyList();
    },
    methods: {
      getCourseList() {
        fetchCourseList(this.queryInfo).then(res => {
          console.log('获取课程列表', res);
          this.courseList = res.payload.courseList;
          this.total = res.payload.listParam.totalNum;
        }).catch(error => console.log(error))
      },
      getHobbyList() {
        fetchHobbyList().then(res => {
          console.log('获取hobby列表', res);
          this.hobbyList = res.payload;
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
      //增加课程上传图片组件传来url
      uploadImageSuccess(photoUrl) {
        this.addCourseInputCourse.photoUrl = photoUrl;
      },
      //添加课程上传视频组件传来url
      uploadVideoSuccess(videoInfo) {
        this.addCourseInputCourse.videoUrl = videoInfo.videoUrl;
        this.addCourseInputCourse.videoDuration = videoInfo.videoDuration;
      },
      //选择标签组件传来的标签list
      handleAddTagIdList(selectValue) {
        console.log('选择的标签',selectValue);
        this.tagIdList = selectValue;
      },
      //点击确定添加课程
      handleAddCourse() {
        console.log('爱好列表', this.hobbyIdList);
        this.addCourseInputCourse.userId = window.sessionStorage.getItem('userId');
        const addForm = {
          addCourseInputCourse: this.addCourseInputCourse,
          tagIdList: this.tagIdList,
          hobbyIdList: this.hobbyIdList
        };
        addCourse(addForm).then(res => {
          this.$message.success('添加课程成功！');
          // 隐藏添加课程的对话框
          this.addDialogVisible = false;
          this.getCourseList();
        }).catch(error => console.log(error))
      }
      ,
      // 监听添加课程对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
        this.hobbyIdList = [];
        this.tagIdList = [];
      },
      //点击查看章节列表按钮
      btnToChapter() {
        //此次还需要传参课程id，先做个demo
        this.$router.push('chapters')
      }
      ,
      // 展示编辑章节视频的对话框
      async showEditDialog(id) {
        this.editForm = this.courseList[0];
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //编辑课程上传图片组件传来url
      editImageSuccess(photoUrl) {
        this.editForm.photoUrl = photoUrl;
      },
      //编辑课程上传视频组件传来url
      editVideoSuccess(videoInfo) {
        this.editForm.videoUrl = videoInfo.videoUrl;
        this.editForm.videoDuration = videoInfo.videoDuration;
      },
      //修改课程信息提交
      editCourseInfo() {
        updateCourse(this.editForm.id, this.editForm).then(res => {
          this.$message.success('更新课程信息成功');
          this.editDialogVisible = false;
          this.getCourseList();
        }).catch(error => console.log(error))
      },
      //审核课程
      async inspectInfo() {
        if(!this.selectedType) {
          return this.$message.error('请选择审核类型')
        }
        this.inspectForm.type = this.selectedType;
        this.inspectForm.courseId = this.courseInfo.id;
        this.inspectForm.inspectorId = window.sessionStorage.getItem('userId');
        auditCourse(this.inspectForm).then(res => {
          console.log('审核课程',res);
          this.$message.success('审核课程成功！');
          this.getCourseList();
          this.inspectDialogVisible = false
        }).catch(error => console.log(error));
      },

      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.selectedType = '';
        this.courseInfo = {}
      },

      //展开课程详情
      async expandChange(row, expandedRows) {
        if (expandedRows.length === 0) return;
        const lastExpandId = expandedRows[expandedRows.length - 1].id;
        const userId = expandedRows[expandedRows.length - 1].userId;
        if (expandedRows.length > 1) {
          expandedRows.map((item) => {
            if (lastExpandId !== item.id) {
              this.$refs.selectedList.toggleRowExpansion(item, false)
            }
          })
        }
        //获取展开课程的hobby
        getCourseHobby(lastExpandId).then(res => {
          this.expandHobby = res.payload;
        }).catch(error => console.log(error));
        //获取展开课程的tag
        getCourseTag(lastExpandId).then(res => {
          this.expandTag = res.payload;
        }).catch(error => console.log(error));
        //获取展开课程的作者
        getUserInfo(userId).then(res => {
          console.log('展开获取userInfo', res);
          this.expandUsername = res.payload.username;
        }).catch(error => console.log(error));
      },

      ResetSearch() {
        this.queryInfo.courseFilter = {
          title: null,
          userId: null,
          checked: null
        };
        this.getCourseList()
      },
      //展示审核课程的对话框
      showInspectDialog(courseInfo) {
        this.courseInfo = courseInfo;
        this.inspectDialogVisible = true;
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.courseList = this.courseList.filter(item => (~item.title.indexOf(val)));
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
