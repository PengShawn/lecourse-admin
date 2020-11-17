<template>
  <!-- 审核二级评论的对话框 -->
  <el-dialog title="审核评论回复" :visible.sync="subInspectDialogVisible" width="50%" @close="inspectDialogClosed">
    <div>
      <el-form ref="inspectFormRef" label-width="80px">
        <el-form-item label="评论内容" prop="text">
          <el-input v-model="subCommentInfo.text" disabled></el-input>
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
</template>

<script>
  import {inspectSubComment} from "@/api/subcomments";
  export default {
    name: "InspectSubComment",
    props: ['SubCommentInfo','SubInspectDialogVisible'],
    data() {
      return {
        subCommentInfo: {},
        //审核种类
        inspectTypeOptions: [
          {value: 'VIOLATE', label: '含暴力信息'},
          {value: 'ELSE', label: '其他原因(不通过)'}
        ],
        // 控制审核评论对话框的显示与隐藏
        subInspectDialogVisible: false,
        //审核是否通过
        pass: 'true',
        // 审核评论的信息
        details: '',
        //选中的审核类型
        selectedType: 'ELSE',
      }
    },
    methods: {
      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.pass = 'true';
        this.details = '';
        this.selectedType = 'ELSE';
        this.subCommentInfo = {};
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:SubInspectDialogVisible',this.subInspectDialogVisible);
      },
      //审核评论
      inspectInfo() {
        const inspectForm = {
          type: this.selectedType,
          details: this.details,
          inspectorId: window.sessionStorage.getItem('userId')
        };
        if (this.pass === 'true') inspectForm.type = 'PASS';
        inspectSubComment(this.subCommentInfo.id, this.pass, inspectForm).then(res => {
          console.log('审核二级评价', res);
          this.$message.success('审核评论回复成功！');
          this.$emit('subInspectSuccess', this.subCommentInfo.commentId);
          //将父组件SubInspectDialogVisible设为false
          this.$emit('update:SubInspectDialogVisible', false);
        }).catch(error => console.log(error));
      },
    },
    watch: {
      'SubInspectDialogVisible': {
        handler(val) {
          //父组件InspectDialogVisible改变后赋值给子组件
          console.log('父组件中InspectDialogVisible改变',val);
          this.subInspectDialogVisible = this.SubInspectDialogVisible;
        }
      },
      'SubCommentInfo': {
        handler(val) {
          this.subCommentInfo = this.SubCommentInfo;
        }
      },
    }
  }
</script>

<style scoped>

</style>
