<template>
  <div>
    <!-- 添加社团的对话框 -->
    <el-dialog title="添加社团" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="club" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="club.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="club.description" clearable></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="club.longitude" clearable></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="club.latitude" clearable></el-input>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddClub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //接口
  import {addClub} from "@/api/clubs";
  import {fetchHobbyList} from "@/api/hobby";

  import {provinceAndCityData, CodeToText, TextToCode} from 'element-china-area-data'

  export default {
    name: "AddClub",
    props: ['pAddDialogVisible'],
    data() {
      return {
        addDialogVisible: false,
        club: {
          city: "13000000",
          description: "",
          price: 0,
          province: "13000000",
          name: "",
          type: "COURSE",
          userId: null,
          latitude: 31.23224,
          longitude: 121.46902,
        },
        addFormRules: {
          name: [
            {required: true, message: '请输入社团标题', trigger: 'blur'},
            {
              min: 2,
              max: 50,
              message: '标题的长度在2~50个字符之间',
              trigger: 'blur'
            }
          ],
          description: [
            {required: true, message: '请输入社团描述', trigger: 'blur'},
            {
              min: 2,
              max: 200,
              message: '社团描述名的长度在2~800个字符之间',
              trigger: 'blur'
            }
          ],
        },
        hobbyIdList: [],
        //所有hobby
        hobbyList: [],
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
      //获取所有hobby
      getHobbyList() {
        fetchHobbyList().then(res => {
          console.log('获取hobby列表', res);
          this.hobbyList = res.payload;
        }).catch(error => console.log(error))
      },
      //选择地区
      regionChange(region) {
        this.club.province = CodeToText[region[0]];
        if (CodeToText[region[1]] === '市辖区' || CodeToText[region[1]] === '县')
          this.club.city = CodeToText[region[0]];
        else
          this.club.city = CodeToText[region[1]];
      },
      //点击确定添加社团
      async handleAddClub() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          this.club.userId = window.sessionStorage.getItem('userId');
          const addForm = {
            club: this.club,
            hobbyIdList: this.hobbyIdList
          };
          console.log('需要添加的社团的信息',addForm);
          await addClub(addForm).then(res => {
            this.$message.success('添加社团成功！');
            // 隐藏添加社团的对话框
            this.addDialogVisible = false;
            addForm.club.id = res.payload;
            this.$emit('addSuccess', addForm.club);
            //将父组件addDialogVisible设为false
            this.$emit('update:pAddDialogVisible', false);
          }).catch(error => console.log(error))
        })
      }
      ,
      // 监听添加社团对话框的关闭事件
      addDialogClosed() {
        this.club = {};
        this.hobbyIdList = [];
        this.selectedRegion = [];
        this.$emit('update:pAddDialogVisible', this.addDialogVisible);
      },
    },
    watch: {
      'pAddDialogVisible': {
        handler(val) {
          //父组件中addDialogVisible改变就会传回给子组件赋值
          console.log('父组件addDialog改变了', val);
          this.addDialogVisible = this.pAddDialogVisible;
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
