<template>
  <div>
    <!-- 审核社团的对话框 -->
    <el-dialog title="审核社团" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <el-form ref="inspectFormRef" label-width="80px">
          <el-form-item label="社团题目" prop="text">
            <el-input v-model="clubInfo.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="社团描述" prop="text">
            <el-input v-model="clubInfo.description" disabled></el-input>
          </el-form-item>
          <el-form-item label="作者id" prop="text">
            <el-input v-model="clubInfo.userId" disabled></el-input>
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
  import {inspectClub} from "@/api/clubs";

  let {inspectTypeOptions} = require('../../../config/inspect');
  export default {
    name: "InspectClub",
    props: ['pClubInfo', 'pInspectDialogVisible'],
    data() {
      return {
        clubInfo: {},
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
      //审核社团
      inspectInfo() {
        const inspectForm = {
          type: this.selectedType,
          details: this.details,
          inspectorId: window.sessionStorage.getItem('userId')
        };
        if (this.pass === 'true') inspectForm.type = 'PASS';
        inspectClub(this.clubInfo.id, this.pass, inspectForm).then(res => {
          console.log('审核社团', res);
          this.$message.success('审核社团成功！');
          this.$emit('inspectSuccess', true);
          //将父组件editDialogVisible设为false
          this.$emit('update:pInspectDialogVisible', false);
        }).catch(error => console.log(error));
      },
      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.pass = 'true';
        this.details = '';
        this.selectedType = 'ELSE';
        this.clubInfo = {};
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
      'pClubInfo': {
        handler(val) {
          this.clubInfo = this.pClubInfo;
        }
      },
    }
  }
</script>

<style scoped>

</style>
