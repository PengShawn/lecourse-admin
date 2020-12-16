<template>
  <div>
    <!-- 修改社团的对话框 -->
    <el-dialog title="修改社团" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <label>社团封面:</label>
      <image-upload :id="id" :type="type" style="margin-left: 70px"></image-upload>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="社团id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="社团位置" prop="region">
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
      <div>
        <label>社团分类</label>
        <el-select
                v-model="hobbyIdList"
                multiple
                collapse-tags
                style="margin-left: 12px;margin-bottom: 10px;"
                placeholder="请选择">
          <el-option
                  v-for="item in hobbyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClubInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'
  //接口
  import {updateClub, updateClubClassification, updateClubTag} from "@/api/clubs";
  import {fetchHobbyList} from "@/api/hobby";

  export default {
    name: "EditClub",
    props: ['pEditDialogVisible', 'pEditForm'],
    components: {ImageUpload},
    data() {
      return {
        //所有hobby
        hobbyList: [],
        hobbyIdList: [],
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          name: [
            {required: true, message: '请输入社团名称', trigger: 'blur'},
            {
              min: 2,
              max: 50,
              message: '用户名的长度在2~50个字符之间',
              trigger: 'blur'
            }
          ],
          description: [
            {required: true, message: '请输入社团描述', trigger: 'blur'},
            {
              min: 2,
              max: 200,
              message: '社团描述名的长度在2~200个字符之间',
              trigger: 'blur'
            }
          ],
        },
        id: '',
        type: 'club',
        //地区选择
        region: provinceAndCityData,
        //增加表单选中的地区
        selectedRegion: []
      }
    },
    created() {
      this.getHobbyList();
    },
    methods: {
      getHobbyList() {
        fetchHobbyList().then(res => {
          console.log('获取hobby列表', res);
          this.hobbyList = res.payload;
        }).catch(error => console.log(error))
      },
      //选择地区
      regionChange(region) {
        this.editForm.province = CodeToText[region[0]];
        if (CodeToText[region[1]] === '市辖区' || CodeToText[region[1]] === '县')
          this.editForm.city = CodeToText[region[0]];
        else
          this.editForm.city = CodeToText[region[1]];
      },
      // 监听修改对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
        this.id = '';
        this.hobbyIdList = [];
        //将子组件addDialogVisible传回给父组件
        this.$emit('update:pEditDialogVisible', this.editDialogVisible);
      },
      //修改社团信息提交
      async editClubInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          delete this.editForm.photoUrl;
          console.log('修改社团表', this.editForm);
          updateClub(this.editForm.id, this.editForm).then(res => {
            if (this.hobbyIdList.length > 0) {
              updateClubClassification(this.editForm.id, this.hobbyIdList).then();
            }
            this.$message.success('更新社团信息成功');
            this.editDialogVisible = false;
            this.$emit('editSuccess', true);
            //将父组件editDialogVisible设为false
            this.$emit('update:pEditDialogVisible', false);
          }).catch(error => console.log(error))
        })
      },
    },
    watch: {
      'pEditDialogVisible': {
        handler(val) {
          this.editDialogVisible = this.pEditDialogVisible;
        },
        immediate: true
      },
      'pEditForm': {
        handler(val) {
          this.editForm = this.pEditForm;
          this.id = this.pEditForm.id;
        }
      },
    }
  }
</script>

<style scoped>

</style>
