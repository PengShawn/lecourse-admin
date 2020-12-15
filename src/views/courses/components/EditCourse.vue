<template>
  <div>
    <!-- 修改课程的对话框 -->
    <el-dialog title="修改课程" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="课程id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <label>介绍视频:</label>
      <video-upload @videoInfo="uploadVideoSuccess" style="margin-left: 70px"></video-upload>
      <label>课程封面:</label>
      <image-upload :id="id" :type="type" style="margin-left: 70px"></image-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";
  import SelectTag from "@/components/selectTag/SelectTag";
  //接口
  import {updateCourse} from "@/api/courses";
  import {fetchHobbyList} from "@/api/hobby";

  export default {
    name: "EditCourse",
    props: ['EditDialogVisible', 'EditForm'],
    components: {ImageUpload, VideoUpload,SelectTag},
    data() {
      return {
        //所有hobby
        hobbyList: [],
        hobbyIdList: [],
        tagIdList: [],
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
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
              message: '课程描述名的长度在2~200个字符之间',
              trigger: 'blur'
            }
          ],
        },
        id: '',
        type: 'course'
      }
    },
    created() {
      this.getHobbyList();
    },
    methods: {
      getHobbyList() {
        fetchHobbyList().then(res => {
          console.log('获取hobby列表', res);
          this.hobbyList = res.payload;
        }).catch(error => console.log(error))
      },
      //课程上传视频组件传来url
      uploadVideoSuccess(videoInfo) {
        this.editForm.videoUrl = videoInfo.videoUrl;
        this.editForm.videoDuration = videoInfo.videoDuration;
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
        this.id = '';
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:EditDialogVisible',this.editDialogVisible);
      },
      //修改课程信息提交
      editCourseInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          console.log('修改课程表', this.editForm);
          updateCourse(this.editForm.id, this.editForm).then(res => {
            this.$message.success('更新课程信息成功');
            this.editDialogVisible = false;
            this.$emit('editSuccess', true);
            //将父组件editDialogVisible设为false
            this.$emit('update:EditDialogVisible', false);
          }).catch(error => console.log(error))
        })
      },
    },
    watch: {
      'EditDialogVisible': {
        handler(val) {
          console.log('父组件EditDialogVisible改变了', val);
          this.editDialogVisible = this.EditDialogVisible;
        },
        immediate: true
      },
      'EditForm': {
        handler(val) {
          console.log('父组件EditForm改变', val);
          this.editForm = this.EditForm;
          this.id = this.EditForm.id;
        }
      },
    }
  }
</script>

<style scoped>

</style>
