<template>
  <div>
    <el-dialog title="审核课程" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <p>课程题目：{{courseInfo.title}}</p>
        <p>创建人id：{{courseInfo.userId}}</p>
        <p>课程描述：</p>
        <textarea readonly rows="3" cols="80">{{courseInfo.description}}</textarea>
        <el-form :model="inspectForm" :rules="inspectFormRules" ref="inspectFormRef" label-width="80px">
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
  </div>
</template>

<script>
  export default {
    name: "EditCourse",
    props: ['EditForm'],
    data() {
      return {
        editForm: this.EditForm
      }
    }
  }
</script>

<style scoped>

</style>
