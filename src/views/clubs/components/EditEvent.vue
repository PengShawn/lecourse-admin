<template>
  <div>
    <!-- 修改活动的对话框 -->
    <el-dialog title="修改活动" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="活动id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="holdTime">
          <div class="block">
            <el-date-picker
                    v-model="editForm.holdTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="timeOptions">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <label>活动封面:</label>
      <image-upload :id="id" :type="type" style="margin-left: 70px"></image-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEventInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";

  import {updateEvent} from "@/api/events";

  let courseId = 0;
  export default {
    name: "EditEvent",
    props: ['pEditDialogVisible', 'pEditForm'],
    components: {ImageUpload},
    data()  {
      return {
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          title: [
            {required: true, message: '请输入活动标题', trigger: 'blur'},
            {
              min: 2,
              max: 50,
              message: '标题的长度在2~50个字符之间',
              trigger: 'blur'
            }
          ],
          description: [
            {required: true, message: '请输入活动描述', trigger: 'blur'},
            {
              min: 2,
              max: 200,
              message: '课程描述名的长度在2~800个字符之间',
              trigger: 'blur'
            }
          ],
          holdTime: [
            {required: true, message: '请选择时间', trigger: 'blur'},
          ]
        },
        //日期选择
        timeOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }
          ]
        },
        id: '',
        type: 'event'
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
      //修改课程活动信息提交
      editEventInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          delete this.editForm.photoUrl;
          delete this.editForm.videoUrl;
          updateEvent(this.editForm.id, this.editForm).then(res => {
            this.$message.success('更新活动信息成功');
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
