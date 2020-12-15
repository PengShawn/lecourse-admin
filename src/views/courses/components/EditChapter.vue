<template>
  <div>
    <!-- 修改章节的对话框 -->
    <el-dialog title="修改章节" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="章节id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <label>章节视频:</label>
      <video-upload :id="id" :type="type" style="margin-left: 70px"></video-upload>
      <label>章节封面:</label>
      <image-upload :id="id" :type="type" style="margin-left: 70px"></image-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editChapterInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";

  import {updateChapter} from "@/api/chapters";

  let courseId = 0;
  export default {
    name: "EditChapter",
    props: ['pEditDialogVisible', 'pEditForm'],
    components: {ImageUpload, VideoUpload},
    data()  {
      return {
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
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
        type: 'chapter'
      }
    },
    methods: {
// 监听修改对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
        this.id = '';
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:pEditDialogVisible',this.editDialogVisible);
      },
      //修改课程章节信息提交
      editChapterInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          delete this.editForm.photoUrl;
          delete this.editForm.videoUrl;
          updateChapter(this.editForm.id, this.editForm).then(res => {
            this.$message.success('更新章节信息成功');
            this.editDialogVisible = false;
            this.$emit('editSuccess', true);
            //将父组件editDialogVisible设为false
            this.$emit('update:pEditDialogVisible', false);
          }).catch(error => console.log(error))
        })
      },
    },
    created() {
      courseId = this.$route.query.courseId;
    },
    watch: {
      'pEditDialogVisible': {
        handler(val) {
          this.editDialogVisible = this.pEditDialogVisible;
        },
        immediate: true
      },
      'pEditForm': {
        handler(val) {
          this.editForm = this.pEditForm;
          this.id = this.pEditForm.id;
        }
      },
    }
  }
</script>

<style scoped>

</style>
