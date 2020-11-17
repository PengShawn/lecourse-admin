<template>
  <div>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="addForm.gender" placeholder="请选择性别">
            <el-option
                    v-for="item in genderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
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
                    v-model="addForm.birthday"
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
                    v-model="selectedRegion"
                    @change="regionChange">
            </el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addUser} from '@/api/users';
  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'

  export default {
    name: "AddUser",
    props: ['AddDialogVisible'],
    data() {
      return {
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          gender: 'MALE',
          role: 'USER',
          birthday: '',
          province: '',
          city: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              min: 2,
              max: 15,
              message: '用户名的长度在2~15个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {
              min: 6,
              max: 15,
              message: '密码的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ]
        },
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
        //增加表单选中的地区
        selectedRegion: [],
      }
    },
    methods: {
      // 监听添加用户对话框的关闭事件
      addDialogClosed() {
        //重置表单
        this.$refs.addFormRef.resetFields();
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:AddDialogVisible',this.addDialogVisible);
      },
      //增加用户选择地区
      regionChange(region) {
        this.addForm.province = CodeToText[region[0]];
        if (CodeToText[region[1]] === '市辖区')
          this.addForm.city = CodeToText[region[0]];
        else
          this.addForm.city = CodeToText[region[1]];
      },
      // 点击按钮，添加新用户
      handleAddUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          addUser(this.addForm).then(res => {
            this.$message.success('添加用户成功！');
            this.$emit('addSuccess', true);
            //将父组件addDialogVisible设为false
            this.$emit('update:AddDialogVisible', false);
          }).catch(error => console.log(error))
        })
      }
    },
    watch: {
      'AddDialogVisible': {
        handler(val) {
          //父组件中addDialogVisible改变就会传回给子组件赋值
          this.addDialogVisible = this.AddDialogVisible;
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
