<template>
  <div>
    <!-- 添加活动的对话框 -->
    <el-dialog title="添加活动" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="event" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="event.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="holdTime">
          <div class="block">
            <el-date-picker
                    v-model="event.holdTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    :picker-options="timeOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="event.description" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //接口
  import {addEvent} from "@/api/events";

  let clubId = 1;
  export default {
    name: "AddEvent",
    props: ['pAddDialogVisible'],
    data() {
      return {
        addDialogVisible: false,
        event: {},
        addFormRules: {
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
      }
    },
    methods: {
      async handleAddEvent() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          this.event.clubId = clubId;
          this.event.userId = window.sessionStorage.getItem('userId');
          console.log('添加活动传参', event);
          await addEvent(this.event).then(res => {
            this.$message.success('添加活动成功！');
            // 隐藏添加课程的对话框
            this.addDialogVisible = false;
            this.event.id = res.payload;
            this.$emit('addSuccess', this.event);
            //将父组件addDialogVisible设为false
            this.$emit('update:pAddDialogVisible', false);
          }).catch(error => console.log(error))
        })
      },
      // 监听添加课程对话框的关闭事件
      addDialogClosed() {
        this.event = {};
        this.$emit('update:pAddDialogVisible', this.addDialogVisible);
      }
    },
    created() {
      clubId = this.$route.query.clubId;
    },
    watch: {
      'pAddDialogVisible': {
        handler(val) {
          //父组件中addDialogVisible改变就会传回给子组件赋值
          console.log('活动父组件addDialog改变了', val);
          this.addDialogVisible = this.pAddDialogVisible;
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
