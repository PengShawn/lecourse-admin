<template>
  <div>
    <!-- 审核章节的对话框 -->
    <el-dialog title="审核课程章节" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <el-form ref="inspectFormRef" label-width="80px">
          <el-form-item label="章节简介" prop="text">
            <el-input v-model="chapterInfo.description" disabled></el-input>
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
  import {inspectChapter} from "@/api/chapters";
  let {inspectTypeOptions} = require('../../../config/inspect');
  export default {
    name: "InspectChapter",
    props: ['pChapterInfo', 'pInspectDialogVisible'],
    data() {
      return {
        chapterInfo: {},
        //审核种类
        inspectTypeOptions: inspectTypeOptions,
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
      //审核章节
      inspectInfo() {
        const inspectForm = {
          type: this.selectedType,
          details: this.details,
          inspectorId: window.sessionStorage.getItem('userId')
        };
        if (this.pass === 'true') inspectForm.type = 'PASS';
        inspectChapter(this.chapterInfo.id, this.pass, inspectForm).then(res => {
          console.log('审核章节', res);
          this.$message.success('审核章节成功！');
          this.$emit('inspectSuccess', true);
          //将父组件editDialogVisible设为false
          this.$emit('update:pInspectDialogVisible', false);
        }).catch(error => console.log(error));
      },
      // 监听审核框的关闭事件
      inspectDialogClosed() {
        this.pass = 'true';
        this.details = '';
        this.selectedType = 'ELSE';
        this.chapterInfo = {};
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:pInspectDialogVisible',this.inspectDialogVisible);
      },
    },
    watch: {
      'pInspectDialogVisible': {
        handler(val) {
          //父组件InspectDialogVisible改变后赋值给子组件
          this.inspectDialogVisible = this.pInspectDialogVisible;
        }
      },
      'pChapterInfo': {
        handler(val) {
          this.chapterInfo = this.pChapterInfo;
          console.log('审核组件章节信息',this.chapterInfo)
        }
      },
    }
  }
</script>

<style scoped>

</style>
