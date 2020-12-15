<template>
  <div>
    <!-- 添加章节的对话框 -->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="chapter" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="描述" prop="description">
          <el-input v-model="chapter.description" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddChapter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //接口
  import {addChapter} from "@/api/chapters";

  let courseId = 0;
  export default {
    name: "AddChapter",
    props: ['pAddDialogVisible'],
    data() {
      return {
        addDialogVisible: false,
        chapter: {},
        addFormRules: {
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
      }
    },
    methods: {
      async handleAddChapter() {
        this.chapter.courseId = courseId;
        await addChapter(this.chapter).then(res =>  {
          this.$message.success('添加课程成功！');
          // 隐藏添加课程的对话框
          this.addDialogVisible = false;
          this.chapter.id = res.payload;
          this.$emit('addSuccess', this.chapter);
          //将父组件addDialogVisible设为false
          this.$emit('update:pAddDialogVisible', false);
        }).catch(error => console.log(error))
      },
      // 监听添加课程对话框的关闭事件
      addDialogClosed() {
        this.chapter = {};
        this.$emit('update:pAddDialogVisible',this.addDialogVisible);
      },
    },
    created() {
      courseId = this.$route.query.courseId;
    },
    watch: {
      'pAddDialogVisible': {
        handler(val) {
          //父组件中addDialogVisible改变就会传回给子组件赋值
          console.log('章节父组件addDialog改变了',val);
          this.addDialogVisible = this.pAddDialogVisible;
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
