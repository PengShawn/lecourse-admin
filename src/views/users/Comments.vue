<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选搜索卡片   -->
    <el-card style="margin-bottom: 15px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float: right"
                @click="getCommentList"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="ResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form :inline="true" v-model="queryInfo.commentFilter" size="small" label-width="140px" ref="searchForm">
          <el-form-item label="用户id：" prop="userid">
            <el-input style="width: 203px" v-model="queryInfo.commentFilter.userId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item label="是否审核：" prop="checked">
            <el-select v-model="queryInfo.commentFilter.checked" placeholder="请选择是否审核">
              <el-option
                      v-for="item in checkedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否通过：" prop="passed">
            <el-select v-model="queryInfo.commentFilter.passed" placeholder="请选择是否通过">
              <el-option
                      v-for="item in passedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与批量删除区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="评论内容模糊搜索" v-model="searchFilter" clearable>
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
            <el-table :data="subCommentList" border stripe @selection-change="handleSubSelectionChange"
                      ref="subSelectedList">
              <!-- 选择多行 -->
              <el-table-column
                      type="selection"
                      width="55">
              </el-table-column>
              <!-- 二级评论展示内容区域-->
              <el-table-column type="index"></el-table-column>
              <el-table-column sortable label="评价内容" prop="subComment.text"></el-table-column>
              <el-table-column sortable label="评价用户" prop="master.username"></el-table-column>
              <el-table-column sortable label="评价时间" prop="subComment.createTime"
                               :formatter="dateFormat"></el-table-column>
              <el-table-column label="通过状态">
                <template slot-scope="scope">
                  <el-switch disabled v-model="scope.row.subComment.passed">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                  <!-- 二级评论删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="removeSubCommentById(scope.row.comment.id)"></el-button>
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
        <el-table-column sortable label="评论内容" prop="comment.text"></el-table-column>
        <el-table-column sortable label="评价用户" prop="master.nickname"></el-table-column>
        <el-table-column sortable label="类别" prop="comment.type" :formatter="commentTypeFormat"></el-table-column>
        <el-table-column sortable label="评论时间" prop="comment.createTime" :formatter="dateFormat"></el-table-column>
        <el-table-column label="通过状态">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.comment.passed">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeCommentById(scope.row.comment.id)"></el-button>
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
    <inspect-comment :InspectDialogVisible.sync="inspectDialogVisible"
                     :CommentInfo="commentInfo"
                     @inspectSuccess="getCommentList"></inspect-comment>

    <!-- 审核二级评论的对话框 -->
    <inspect-sub-comment :SubInspectDialogVisible.sync="subInspectDialogVisible"
                         :SubCommentInfo="subCommentInfo"
                         @subInspectSuccess="getSubCommentList"></inspect-sub-comment>
  </div>
</template>

<script>
  import {fetchCommentList, deleteCommentById, batchDeleteComment} from "@/api/comments";
  import {fetchSubCommentList, deleteSubCommentById, batchDeleteSubComment} from "@/api/subcomments";

  import {formatDate} from '@/utils/date';

  import InspectComment from "./components/InspectComment";
  import InspectSubComment from "./components/InspectSubComment";
  export default {
    name: "Comments",
    components: {InspectComment,InspectSubComment},
    data() {
      return {
        // 获取评论列表的参数对象
        queryInfo: {
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          },
          commentFilter: {
            userId: null,
            checked: null,
            passed: null,
            del: false
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
        commentId: null,
        commentList: [],
        subCommentList: [],
        commentInfo: {},
        subCommentInfo: {},
        total: 0,
        subTotal: 0,
        searchFilter: '',
        selectedId: [], //批量删除id
        subSelectedId: [],
        // 控制审核评论对话框的显示与隐藏
        inspectDialogVisible: false,
        subInspectDialogVisible: false,
        //是否通过审核
        passedOptions: [
          {value: true, label: '已通过'},
          {value: false, label: '未通过'}
        ],
        //是否已经审核
        checkedOptions: [
          {value: true, label: '已审核'},
          {value: false, label: '未审核'}
        ]
      }
    },
    created() {
      this.getCommentList()
    },
    methods: {
      async getCommentList() {
        fetchCommentList(this.queryInfo).then(res => {
          console.log('获取评论列表', res);
          this.commentList = res.payload.list;
          this.total = res.payload.param.totalNum;
        });
      },
      async getSubCommentList(commentId) {
        this.subQueryInfo.subCommentFilter.commentId = commentId;
        console.log('请求二级评论列表前打印id信息',commentId);
        fetchSubCommentList(this.subQueryInfo).then(res => {
          console.log('获取二级评论列表', res);
          this.subCommentList = res.payload.list;
          this.subTotal = res.payload.param.totalNum;
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
          return item.comment.id
        });
      },
      handleSubSelectionChange(val) {
        this.subSelectedId = val.map((item) => {
          return item.comment.id
        });
      },
      //评论类别的后台数据转化显示
      commentTypeFormat(row, column) {
        if (row.comment.type === 'COURSE') {
          return '课程'
        } else if (row.comment.type === 'CHAPTER') {
          return '章节'
        } else if (row.comment.type === 'POST') {
          return '帖子'
        } else if (row.comment.type === 'CLUB') {
          return '社团'
        } else {
          return '其他'
        }
      },
      dateFormat(row, column) {
        let cm;
        if (row.subComment !== undefined) cm = row.subComment;
        else cm = row.comment;
        let date = new Date(cm.createTime);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
      async showInspectDialog(row) {
        this.commentInfo = row.comment;
        this.inspectDialogVisible = true
      },
      async showSubInspectDialog(row) {
        this.subCommentInfo = row.subComment;
        this.subInspectDialogVisible = true
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
          console.log('批量删除评论', res);
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
          console.log('批量删除二级评论', res);
          this.$message.success('批量删除评论回复成功！');
          this.getSubCommentList(this.commentId)
        }).catch(error => console.log(error))
      },
      //展开后获取回复的二级评论
      expandChange(row, expandedRows) {
        if (expandedRows.length === 0) return;
        const lastExpandId = expandedRows[expandedRows.length - 1].comment.id;
        if (expandedRows.length > 1) {
          expandedRows.map((item) => {
            if (lastExpandId !== item.id) {
              this.$refs.selectedList.toggleRowExpansion(item, false)
            }
          })
        }
        this.commentId = lastExpandId;
        console.log('展开的评论id', this.commentId);
        this.getSubCommentList(lastExpandId);
      },
      //重置搜索表单
      ResetSearch() {
        const originalFilter = {
          userId: null,
          checked: null,
          passed: null
        };
        this.queryInfo.commentFilter = originalFilter;
        this.getCommentList();
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.commentList = this.commentList.filter(item => {
          let boolFind = false;
          if(item.comment.text !== null && item.comment.text.indexOf(val)!==-1){
            boolFind = true;
          }
          if(item.master.nickname !== null && item.master.nickname.indexOf(val)!==-1)
            boolFind = true;
          return boolFind;
        });
        if (val === '') this.getCommentList();
      }
    }
  }
</script>

<style scoped>

</style>
