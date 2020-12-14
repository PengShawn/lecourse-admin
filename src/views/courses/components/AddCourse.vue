<template>
  <div>
    <!-- 添加课程的对话框 -->
    <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="course" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="course.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="course.description" clearable></el-input>
        </el-form-item>
        <div>
          <label>课程分类</label>
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
      <label>课程标签:</label>
      <select-tag @selectValue="handleAddTagIdList" :tagIdList="tagIdList" style="margin-left: 70px"></select-tag>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCourse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //组件
  import SelectTag from "@/components/selectTag/SelectTag";
  //接口
  import {addCourse} from "@/api/courses";
  import {fetchHobbyList} from "@/api/hobby";
  export default {
    name: "AddCourse",
    props: ['AddDialogVisible'],
    components: {SelectTag},
    data() {
      return {
        addDialogVisible: false,
        course: {
          city: "13000000",
          description: "",
          price: 0,
          province: "13000000",
          title: "",
          type: "COURSE",
          userId: null,
          videoDuration: 0,
          videoUrl: ""
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入课程标题', trigger: 'blur'},
            {
              min: 2,
              max: 50,
              message: '用户名的长度在2~50个字符之间',
              trigger: 'blur'
            }
          ],
          description: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
            {
              min: 2,
              max: 200,
              message: '课程描述名的长度在2~200个字符之间',
              trigger: 'blur'
            }
          ],
        },
        hobbyIdList: [],
        tagIdList: [],
        //所有hobby
        hobbyList: [],
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
      //选择标签组件传来的标签list
      handleAddTagIdList(selectValue) {
        console.log('选择的标签',selectValue);
        this.tagIdList = selectValue;
      },
      //点击确定添加课程
     async handleAddCourse() {
        this.course.userId = window.sessionStorage.getItem('userId');
        const addForm = {
          course: this.course,
          tagIdList: this.tagIdList,
          hobbyIdList: this.hobbyIdList
        };
        await addCourse(addForm).then(res => {
          this.$message.success('添加课程成功！');
          // 隐藏添加课程的对话框
          this.addDialogVisible = false;
          addForm.course.id = res.payload;
          this.$emit('addSuccess', addForm.course);
          //将父组件addDialogVisible设为false
          this.$emit('update:AddDialogVisible', false);
        }).catch(error => console.log(error))
      }
      ,
      // 监听添加课程对话框的关闭事件
      addDialogClosed() {
        this.course = {};
        this.hobbyIdList = [];
        this.tagIdList = [];
        this.$emit('update:AddDialogVisible',this.addDialogVisible);
      },
    },
    watch: {
      'AddDialogVisible': {
        handler(val) {
          //父组件中addDialogVisible改变就会传回给子组件赋值
          console.log('父组件addDialog改变了',val);
          this.addDialogVisible = this.AddDialogVisible;
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>
