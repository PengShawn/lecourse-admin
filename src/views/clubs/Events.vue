<template>
  <div>
    <!-- 面包屑导航区域    -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>社团管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/clubs' }">社团列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图    -->
    <el-card>
      <h1>社团活动的管理</h1>
      <!-- 搜索与添加区域      -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加活动</el-button>
        </el-col>
      </el-row>

      <!-- 社团列表区域     -->
      <el-table :data="eventList" border stripe ref="selectedList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="活动id" prop="id"></el-table-column>
        <el-table-column label="活动标题" prop="title"></el-table-column>
        <el-table-column label="活动描述" prop="description"></el-table-column>
        <el-table-column label="活动封面">
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.photoUrl"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column sortable label="举办时间" prop="holdTime" :formatter="dateFormat"></el-table-column>
        <el-table-column label="通过状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.passed" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="删除状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.del" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮          -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!--删除按钮          -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeEventById(scope.row.id)"></el-button>
            <!--审核按钮          -->
            <el-tooltip class="item" effect="dark" content="审核活动" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-suitcase" size="mini"
                         @click="showInspectDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域     -->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.listParam.currentPage"
              :page-sizes="[2, 5, 10, 50]"
              :page-size="queryInfo.listParam.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加活动的对话框 -->
    <add-event :pAddDialogVisible.sync="addDialogVisible" @addSuccess="addEventSuccess"></add-event>
    <!-- 修改活动的对话框 -->
    <edit-event :pEditDialogVisible.sync="editDialogVisible" :pEditForm="editForm"
                @editSuccess="getEventList"></edit-event>
    <!-- 审核活动的对话框 -->
    <inspect-event :pInspectDialogVisible.sync="inspectDialogVisible"
                   :pEventInfo="eventInfo"
                   @inspectSuccess="getEventList"></inspect-event>
  </div>
</template>

<script>
  //组件
  import AddEvent from "./components/AddEvent";
  import EditEvent from "./components/EditEvent";
  import InspectEvent from "./components/InspectEvent";
  //接口
  import {deleteEvent} from "@/api/events";
  import {fetchEventListById} from "@/api/clubs";

  import {formatDate} from '@/utils/date';
  let clubId = 0;
  export default {
    name: "Events",
    components: {AddEvent, EditEvent, InspectEvent},
    data() {
      return {
        // 获取社团列表的参数对象
        queryInfo: {
          eventFilter: {
            userId: null,
            checked: null,
            passed: null,
            del: false
          },
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          }
        },
        //活动列表
        eventList: [],
        //活动总数
        total: 0,
        searchFilter: '',  //模糊搜索
        // 控制添加活动视频对话框的显示与隐藏
        addDialogVisible: false,
        // 控制修改视频活动对话框的显示与隐藏
        editDialogVisible: false,
        inspectDialogVisible: false,
        // 查询到的活动信息对象
        editForm: {},
        eventInfo: {}
      }
    },
    methods: {
      //获取活动列表
      getEventList() {
        fetchEventListById(clubId, this.queryInfo.listParam).then(res => {
          console.log('获取活动列表', res);
          this.eventList = res.payload.list;
          this.total = res.payload.param.totalNum;
        }).catch(err => console.log(err))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.listParam.pageSize = newSize;
        //然后需要重新获取社团活动列表
        this.getEventList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.listParam.currentPage = newPage;
        //然后需要重新获取社团活动列表
        this.getEventList()
      },
      addEventSuccess(data) {
        console.log('添加社团活动成功的信息', data);
        this.editForm = data;
        this.editDialogVisible = true;
        this.getEventList();
      },
      // 展示编辑活动视频的对话框
      async showEditDialog(row) {
        this.editForm = row;
        this.editDialogVisible = true
      },
      showInspectDialog(row) {
        this.eventInfo = row;
        this.inspectDialogVisible = true
      },
      // 根据Id删除对应的视频活动信息
      async removeEventById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该活动, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        ).catch(err => err);
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        await deleteEvent(id).then(res => {
          this.$message.success('删除社团活动成功！');
          this.getEventList();
        }).catch(error => console.log(error))
      },
      dateFormat(row) {
        let date = new Date(row.holdTime);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    created() {
      clubId = this.$route.query.clubId;
      this.getEventList();
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.eventList = this.eventList.filter(item => {
          let boolFind = false;
          if (item.description !== null && item.description.indexOf(val) !== -1)
            boolFind = true;
          return boolFind
        });
        if (val === '') this.getEventList();
      }
    }
  }
</script>

<style scoped>

</style>
