<template>
  <!-- 审核一级评论的对话框 -->
  <el-dialog title="审核评论" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
    <div>
      <el-form :model="inspectForm" ref="inspectFormRef" label-width="80px">
        <el-form-item label="评价内容">
          <el-input v-model="commentInfo.comment.text"></el-input>
        </el-form-item>
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
</template>

<script>
  import {inspectComment} from "@/api/comments";
  import {InspectSubComment} from "@/api/subcomments";

  export default {
    name: "InspectComment",
    props: ['CommentInfo','InspectDialogVisible'],
    data() {
      return {
        // 控制审核评论对话框的显示与隐藏
        inspectDialogVisible: false,
        commentInfo: {
          comment:{
            text: ''
          },
          master: {
            username: ''
          }
        },
        //审核种类
        inspectTypeOptions: [
          {value: 'PASS', label: '审核通过'},
          {value: 'VIOLATE', label: '含暴力信息'},
          {value: 'ELSE', label: '其他原因(不通过)'}
        ],
        // 审核评论的表单数据
        inspectForm: {
          commentId: '',
          pass: true,
          record: {
            inspectorId: '',
            type: '',
            details: '',
          }
        },
        selectedType: ''
      }
    },
    methods: {
      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.selectedType = '';
        this.commentInfo = {}
      },
      //审核评论
      async inspectInfo() {
        if(!this.selectedType) {
          return this.$message.error('请选择审核类型')
        }
        this.inspectForm.type = this.selectedType;
        this.inspectForm.commentId = this.commentInfo.id;
        this.inspectForm.inspectorId = window.sessionStorage.getItem('userId');
        inspectComment(this.inspectForm).then(res => {
          console.log('审核评价',res);
          this.$message.success('审核评价成功！');
          this.$emit('inspectSuccess',true)
        }).catch(error => console.log(error));
      },
    },
    watch: {
      'InspectDialogVisible': {
        handler(val) {
          console.log('父组件InspectDialogVisible改变了',val);
          this.inspectDialogVisible = this.InspectDialogVisible;
        },
        immediate: true
      },
      'CommentInfo': {
        handler(val) {
          console.log('父组件CommentInfo改变了',val);
          this.commentInfo = this.CommentInfo;
        }
      },
    }
  }
</script>

<style scoped>

</style>
