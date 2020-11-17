<template>
  <div>
    <!-- 审核课程的对话框 -->
    <el-dialog title="审核课程" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <el-form ref="inspectFormRef" label-width="80px">
          <el-form-item label="课程题目" prop="text">
            <el-input v-model="courseInfo.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="课程描述" prop="text">
            <el-input v-model="courseInfo.description" disabled></el-input>
          </el-form-item>
          <el-form-item label="作者id" prop="text">
            <el-input v-model="courseInfo.userId" disabled></el-input>
          </el-form-item>
          <el-form-item label="是否通过" prop="pass">
            <el-radio v-model="pass" label="true">通过</el-radio>
            <el-radio v-model="pass" label="false">不通过</el-radio>
          </el-form-item>
          <el-form-item label="审核种类" prop="type" v-if="pass === 'false'">
            <el-select v-model="selectedType" placeholder="请选择">
              <el-option v-for="item in inspectTypeOptions" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核信息" prop="details">
            <el-input v-model="details"></el-input>
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
  import {inspectCourse} from "@/api/courses";

  export default {
    name: "InspectCourse",
    props: ['CourseInfo', 'InspectDialogVisible'],
    data() {
      return {
        courseInfo: {},
        //审核种类
        inspectTypeOptions: [
          {value: 'VIOLATE', label: '含暴力信息'},
          {value: 'ELSE', label: '其他原因(不通过)'}
        ],
        // 控制审核评论对话框的显示与隐藏
        inspectDialogVisible: false,
        //审核是否通过
        pass: 'true',
        // 审核评论的信息
        details: '',
        //选中的审核类型
        selectedType: 'ELSE',
      }
    },
    methods: {
      //审核课程
      inspectInfo() {
        const inspectForm = {
          type: this.selectedType,
          details: this.details,
          inspectorId: window.sessionStorage.getItem('userId')
        };
        if (this.pass === 'true') inspectForm.type = 'PASS';
        inspectCourse(this.courseInfo.id, this.pass, inspectForm).then(res => {
          console.log('审核课程', res);
          this.$message.success('审核课程成功！');
          this.$emit('inspectSuccess', true);
          //将父组件editDialogVisible设为false
          this.$emit('update:InspectDialogVisible', false);
        }).catch(error => console.log(error));
      },
      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.pass = 'true';
        this.details = '';
        this.selectedType = 'ELSE';
        this.courseInfo = {};
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:InspectDialogVisible',this.inspectDialogVisible);
      },
    },
    watch: {
      'InspectDialogVisible': {
        handler(val) {
          //父组件InspectDialogVisible改变后赋值给子组件
          this.inspectDialogVisible = this.InspectDialogVisible;
        }
      },
      'CourseInfo': {
        handler(val) {
          this.courseInfo = this.CourseInfo;
        }
      },
    }
  }
</script>

<style scoped>

</style>
