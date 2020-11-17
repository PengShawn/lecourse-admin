<template>
  <div>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别">
            <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <div class="block">
            <el-date-picker
                    v-model="editForm.birthday"
                    align="left"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="birthdayOptions">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <div class="block">
            <el-cascader
                    size="large"
                    :options="region"
                    v-model="editSelectedRegion"
                    @change="editRegionChange">
            </el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {updateUser} from '@/api/users';
  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'

  export default {
    name: "EditUser",
    props: ['EditDialogVisible','EditForm'],
    data() {
      return {
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 修改用户前查询到的用户信息对象
        editForm: {},
        //修改表单选中的地区
        editSelectedRegion: [],
        //性别选择
        genderOptions: [
          {value: 'MALE', label: '男'},
          {value: 'FEMALE', label: '女'},
          {value: 'ELSE', label: '其他'},
        ],
        //角色选择
        roleOptions: [
          {value: 'USER', label: '用户'},
          {value: 'MERCHANT', label: '商家'},
          {value: 'VERIFIED', label: '审核者'},
          {value: 'ADMIN', label: '管理员'},
        ],
        //日期选择
        birthdayOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        //地区选择
        region: provinceAndCityData,
      }
    },
    methods: {
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:EditDialogVisible',this.editDialogVisible);
      },
      //修改用户选择地区
      editRegionChange(region) {
        this.editForm.province = CodeToText[ region[0] ];
        if(CodeToText[ region[1] ] === '市辖区')
          this.editForm.city = CodeToText[ region[0] ];
        else
          this.editForm.city = CodeToText[ region[1] ];
      },
      // 修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          console.log('修改用户表', this.editForm);
          updateUser(this.editForm.id, this.editForm).then(res => {
            // 提示修改成功
            this.$message.success('更新用户信息成功！');
            //重置修改用户表单地区
            this.editSelectedRegion = [];
            this.$emit('editSuccess', true);
            //将父组件editDialogVisible设为false
            this.$emit('update:EditDialogVisible', false);
          }).catch(error => console.log(error))
        })
      },
    },
    watch: {
      'EditDialogVisible': {
        handler(val) {
          this.editDialogVisible = this.EditDialogVisible;
        },
        immediate: true
      },
      'EditForm': {
        handler(val) {
          this.editForm = this.EditForm;
        }
      },
    }
  }
</script>

<style scoped>

</style>
