<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与批量删除区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="评价内容模糊搜索" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search" disabled></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="batchDelete">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 一级评价列表区域 -->
      <el-table :data="commentList" border stripe highlight-current-row
                @selection-change="handleSelectionChange"
                @expand-change="expandChange" ref="selectedList">
        <!-- 选择多行 -->
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>

        <!--  二级评论内容区域      -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="subCommentList" border stripe @selection-change="handleSubSelectionChange" ref="subSelectedList">
              <!-- 选择多行 -->
              <el-table-column
                      type="selection"
                      width="55">
              </el-table-column>
              <!-- 二级评论展示内容区域-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="评价内容" prop="text"></el-table-column>
              <el-table-column label="评价用户" prop="userId"></el-table-column>
              <el-table-column label="类别" prop="type"></el-table-column>
              <el-table-column label="通过状态">
                <template slot-scope="scope">
                  <el-switch disabled v-model="scope.row.passed">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                  <!-- 二级评论删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="removeSubCommentById(scope.row.id)"></el-button>
                  <!-- 审核评价回复按钮 -->
                  <el-tooltip effect="dark" content="审核回复" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"
                               @click="showSubInspectDialog(scope.row)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSubSizeChange"
                           @current-change="handleSubCurrentChange" :current-page="subQueryInfo.listParam.currentPage"
                           :page-sizes="[2, 5, 10, 50]" :page-size="subQueryInfo.listParam.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="subTotal">
            </el-pagination>
            <!--取消选择按钮-->
            <el-button @click="toggleSubSelection()" style="margin-top: 10px">取消选择</el-button>
          </template>
        </el-table-column>

        <!-- 一级评论展示内容区域-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="评价内容" prop="text"></el-table-column>
        <el-table-column label="评价用户" prop="userId"></el-table-column>
        <el-table-column label="类别" prop="type"></el-table-column>
        <el-table-column label="通过状态">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.passed">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeCommentById(scope.row.id)"></el-button>
            <!-- 批量删除回复按钮 -->
            <el-tooltip effect="dark" content="批量删除回复" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-delete-solid" size="mini"
                         @click="subBatchDelete"></el-button>
            </el-tooltip>
            <!-- 审核评价按钮 -->
            <el-tooltip effect="dark" content="审核评论" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                         @click="showInspectDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" :current-page="queryInfo.listParam.currentPage"
                     :page-sizes="[2, 5, 10, 50]" :page-size="queryInfo.listParam.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!--取消选择按钮-->
      <el-button @click="toggleSelection()" style="margin-top: 10px">取消选择</el-button>
    </el-card>

    <!-- 审核一级评论的对话框 -->
    <el-dialog title="审核评论" :visible.sync="inspectDialogVisible" width="50%" @close="inspectDialogClosed">
      <div>
        <p>当前的评价内容：{{commentInfo.text}}</p>
        <p>发言人：{{commentInfo.userId}}</p>
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

    <!-- 审核二级评论的对话框 -->
    <el-dialog title="审核评论回复" :visible.sync="subInspectDialogVisible" width="50%" @close="subInspectDialogClosed">
      <div>
        <p>当前的评价内容：{{subCommentInfo.text}}</p>
        <p>发言人：{{subCommentInfo.userId}}</p>
        <el-form :model="subInspectForm" :rules="inspectFormRules" ref="subInspectFormRef" label-width="80px">
          <el-form-item label="审核信息" prop="details">
            <el-input v-model="subInspectForm.details"></el-input>
          </el-form-item>
          <el-form-item label="审核种类" prop="type">
            <el-select v-model="subSelectedType" placeholder="请选择">
              <el-option v-for="item in inspectTypeOptions" :key="item.id" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subInspectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subInspectInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchCommentList, deleteCommentById,InspectComment,batchDeleteComment} from "@/api/comments";
  import {fetchSubCommentList, deleteSubCommentById,InspectSubComment,batchDeleteSubComment} from "@/api/subcomments";

  export default {
    name: "Comments",
    data() {
      return {
        // 获取评论列表的参数对象
        queryInfo: {
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          }
        },
        subQueryInfo: {
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          },
          subCommentFilter: {
            commentId: ''
          }
        },
        commentId: '',
        commentList: [],
        subCommentList: [],
        commentInfo: {},
        subCommentInfo: {},
        total: 0,
        subTotal: 0,
        searchFilter: '',
        selectedId: [], //批量删除id
        subSelectedId: [],
        //审核种类
        inspectTypeOptions: [
          {value: 'PASS', label: '审核通过'},
          {value: 'VIOLATE', label: '含暴力信息'},
          {value: 'ELSE', label: '其他'}
        ],
        // 控制审核评论对话框的显示与隐藏
        inspectDialogVisible: false,
        subInspectDialogVisible: false,
        selectedType: '',
        subSelectedType: '',
        // 审核评论的表单数据
        inspectForm: {
          commentId: '',
          details: '',
          inspectorId: '',
          type: ''
        },
        subInspectForm: {
          subCommentId: '',
          details: '',
          inspectorId: '',
          type: ''
        },
        inspectFormRules: {
          details: [
            {required: true, message: '请输入审核信息', trigger: 'blur'},
            {
              min: 1,
              message: '审核信息不能为空',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    created() {
      this.getCommentList()
    },
    methods: {
      async getCommentList() {
        fetchCommentList(this.queryInfo).then(res => {
          console.log('获取评论列表', res);
          this.commentList = res.payload.commentList;
          this.total = res.payload.listParam.totalNum;
        });
      },
      async getSubCommentList(commentId) {
        this.subQueryInfo.subCommentFilter.commentId = commentId;
        fetchSubCommentList(this.subQueryInfo).then(res => {
          console.log('获取二级评论列表', res);
          this.subCommentList = res.payload.subCommentList;
          this.subTotal = res.payload.listParam.totalNum;
          this.subQueryInfo.subCommentFilter.commentId = '';
        });
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.listParam.pageSize = newSize;
        this.getCommentList()
      },
      handleSubSizeChange(newSize) {
        this.subQueryInfo.listParam.pageSize = newSize;
        this.getSubCommentList(this.commentId);
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.listParam.currentPage = newPage;
        this.getCommentList()
      },
      handleSubCurrentChange(newPage) {
        // console.log(newPage)
        this.subQueryInfo.listParam.currentPage = newPage;
        this.getCommentList(this.commentId)
      },
      //取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.selectedList.toggleRowSelection(row);
          });
        } else {
          this.$refs.selectedList.clearSelection();
        }
      },
      toggleSubSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.subSelectedList.toggleRowSelection(row);
          });
        } else {
          this.$refs.subSelectedList.clearSelection();
        }
      },
      //处理选择变化
      handleSelectionChange(val) {
        this.selectedId = val.map((item) => {
          return item.id
        });
      },
      handleSubSelectionChange(val) {
        this.subSelectedId = val.map((item) => {
          return item.id
        });
      },
      // 根据Id删除对应的评论信息
      async removeCommentById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该评论, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        deleteCommentById(id).then(res => {
          this.$message.success('删除评论成功！');
          this.getCommentList()
        }).catch(error => console.log(error))
      },
      // 根据Id删除对应的二级评论信息
      async removeSubCommentById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该评论, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        deleteSubCommentById(id).then(res => {
          this.$message.success('删除评论回复成功！');
          this.getSubCommentList(this.commentId)
        }).catch(error => console.log(error))
      },
      //展示审核评价的对话框
      async showInspectDialog(commentInfo) {
        this.commentInfo = commentInfo;
        this.inspectDialogVisible = true
      },
      async showSubInspectDialog(commentInfo) {
        this.subCommentInfo = commentInfo;
        this.subInspectDialogVisible = true
      },
      //审核评论
      async inspectInfo() {
        if(!this.selectedType) {
          return this.$message.error('请选择审核类型')
        }
        this.inspectForm.type = this.selectedType;
        this.inspectForm.commentId = this.commentInfo.id;
        this.inspectForm.inspectorId = window.sessionStorage.getItem('userId')
        InspectComment(this.inspectForm).then(res => {
          console.log('审核评价',res);
          this.$message.success('审核评价成功！');
          this.getCommentList();
          this.inspectDialogVisible = false
        }).catch(error => console.log(error));
      },
      //审核二级评论
      async subInspectInfo() {
        if(!this.subSelectedType) {
          return this.$message.error('请选择审核类型')
        }
        this.subInspectForm.type = this.subSelectedType;
        this.subInspectForm.subCommentId = this.subCommentInfo.id;
        this.subInspectForm.inspectorId = window.sessionStorage.getItem('userId')
        //const {data: res} = await this.$http.post('/comment/audit', this.subInspectForm);
        // const {data: res} = await this.$http.put(
        //     `/comment/sub/${this.commentId}/audit`, this.subInspectForm
        // );
        InspectSubComment(this.commentId, this.subInspectForm).then(res => {
          console.log('审核二级评价',res);
          this.$message.success('审核评价回复成功！');
          this.getSubCommentList(this.commentId)
          this.subInspectDialogVisible = false;
        }).catch(error => console.log(error))
      },
      // 监听审核评论框的关闭事件
      inspectDialogClosed() {
        this.selectedType = '';
        this.commentInfo = {}
      },
      subInspectDialogClosed() {
        this.subSelectedType = '';
        this.subCommentInfo = {}
      },
      //批量删除
      async batchDelete() {
        if (this.selectedId.length === 0) {
          return this.$message.info('未选中评论')
        }
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除这些评论, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        batchDeleteComment(this.selectedId).then(res => {
          console.log('批量删除评论',res);
          this.$message.success('批量删除评论成功！');
          this.getCommentList()
        }).catch(error => console.log(error))
      },
      async subBatchDelete() {
        if (this.subSelectedId.length === 0) {
          return this.$message.info('未选中此评论的回复')
        }
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除这些评论, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        batchDeleteSubComment(this.subSelectedId).then(res => {
          console.log('批量删除二级评论',res);
          this.$message.success('批量删除评论回复成功！');
          this.getSubCommentList(this.commentId)
        }).catch(error => console.log(error))
      },
      //展开后获取回复的二级评论
      expandChange(row,expandedRows) {
        if(expandedRows.length === 0) return;
        const lastExpandId = expandedRows[expandedRows.length-1].id;
        if(expandedRows.length > 1){
          expandedRows.map((item) => {
            if (lastExpandId !== item.id) {
              this.$refs.selectedList.toggleRowExpansion(item, false)
            }
          })
        }
        this.commentId = lastExpandId;
        console.log('展开的评论id', this.commentId);
        this.getSubCommentList(lastExpandId);
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.commentList = this.commentList.filter(item => (~item.text.indexOf(val)));
        if (val === '') this.getCommentList();
      }
    }
  }
</script>

<style scoped>

</style>
