<template>
  <div>
    <!-- 面包屑导航区域    -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>社团管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选搜索卡片   -->
    <el-card style="margin-bottom: 15px">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float: right"
                @click="getClubList"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="ResetSearch" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form :inline="true" v-model="queryInfo.clubFilter" size="small" label-width="140px" ref="searchForm">
          <el-form-item label="社团名称：" prop="name">
            <el-input style="width: 203px" v-model="queryInfo.clubFilter.name" placeholder="社团名称"></el-input>
          </el-form-item>
          <el-form-item label="用户id：" prop="userid">
            <el-input style="width: 203px" v-model="queryInfo.clubFilter.userId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item label="是否审核：" prop="checked">
            <el-select v-model="queryInfo.clubFilter.checked" placeholder="请选择是否审核">
              <el-option
                      v-for="item in checkedOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否通过：" prop="passed">
            <el-select v-model="queryInfo.clubFilter.passed" placeholder="请选择是否通过">
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

    <!-- 卡片视图    -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchFilter" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加社团</el-button>
        </el-col>
      </el-row>

      <!-- 社团列表区域     -->
      <el-table :data="clubList" border stripe @expand-change="expandChange" ref="selectedList">
        <!--  扩展内容区域      -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="分类:">
                <el-tag v-for="item in expandHobby" v-bind:key="item.id" effect="dark" type="success">{{item.name}}
                </el-tag>
              </el-form-item>
              <el-form-item label="社团id:">
                <span>{{ props.row.club.id }}</span>
              </el-form-item>
              <el-form-item label="作者id:">
                <span>{{ props.row.club.userId}}</span>
              </el-form-item>
              <el-form-item label="创建者:">
                <span>{{ props.row.master.username}}</span>
              </el-form-item>
              <el-form-item label="社团描述:">
                <span>{{ props.row.club.description }}</span>
              </el-form-item>
              <el-form-item label="省份:">
                <span>{{ props.row.club.province }}</span>
              </el-form-item>
              <el-form-item label="城市:">
                <span>{{ props.row.club.city }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!--  展示内容区域      -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="社团名称" prop="club.name"></el-table-column>
        <el-table-column label="社团id" prop="club.id"></el-table-column>
        <el-table-column label="创建者昵称" prop="master.nickname"></el-table-column>
        <el-table-column label="社团封面">
          <template slot-scope="scope">
            <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.club.photoUrl"
                    fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="通过状态" prop="passed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.club.passed" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <div>
              <!--审核按钮          -->
              <el-tooltip class="item" effect="dark" content="审核社团" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"
                           @click="showInspectDialog(scope.row)"></el-button>
              </el-tooltip>
              <!--查看视频按钮 -->
              <el-tooltip class="item" effect="dark" content="查看活动" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-video-camera" size="mini"
                           @click="btnToChapter(scope.row)"></el-button>
              </el-tooltip>
            </div>
            <div style="margin-top: 10px">
              <!--修改按钮          -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <!--删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeClubById(scope.row.club.id)"></el-button>

            </div>
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

    <!-- 添加社团的对话框 -->
    <add-club :pAddDialogVisible.sync="addDialogVisible" @addSuccess="addClubSuccess"></add-club>
    <!-- 修改社团的对话框 -->
    <edit-club :pEditDialogVisible.sync="editDialogVisible" :pEditForm="editForm"
                 @editSuccess="getClubList"></edit-club>
    <!-- 审核社团的对话框 -->
    <inspect-club :pInspectDialogVisible.sync="inspectDialogVisible"
                    :pClubInfo="clubInfo"
                    @inspectSuccess="getClubList"></inspect-club>
  </div>
</template>


<script>
  //组件
  import ImageUpload from "@/components/upload/ImageUpload";
  import VideoUpload from "@/components/upload/VideoUpload";
  import SelectTag from "@/components/selectTag/SelectTag";
  import EditClub from "./components/EditClub";
  import AddClub from "./components/AddClub";
  import InspectClub from "./components/InspectClub";
  //接口
  import {fetchClubList, getClubHobby, deleteClub} from "@/api/clubs";

  export default {
    name: "Clubs",
    components: {ImageUpload, VideoUpload, SelectTag, AddClub, EditClub, InspectClub},
    data() {
      return {
        // 获取列表的参数对象
        queryInfo: {
          listParam: {
            currentPage: 1,
            orderBy: [],
            pageSize: 5,
          },
          clubFilter: {
            name: null,
            userId: null,
            checked: null,
            passed: null,
            del: false
          }
        },
        //社团
        clubList: [],
        clubInfo: {},
        //展开后信息
        expandHobby: [],
        total: 0,
        searchFilter: '',  //模糊搜索
        // 控制修改社团对话框的显示与隐藏
        editDialogVisible: false,
        editForm: {},
        addDialogVisible: false,
        inspectDialogVisible: false,
        //是否通过审核
        passedOptions: [
          {value: true, label: '已通过'},
          {value: false, label: '未通过'}
        ],
        //是否已经审核
        checkedOptions: [
          {value: true, label: '已审核'},
          {value: false, label: '未审核'}
        ],
      }
    },
    created() {
      this.getClubList();
    },
    methods: {
      getClubList() {
        if(this.queryInfo.clubFilter.name === '')
          this.queryInfo.clubFilter.name = null;
        fetchClubList(this.queryInfo).then(res => {
          console.log('获取社团列表', res);
          this.clubList = res.payload.list;
          this.total = res.payload.param.totalNum;
        }).catch(error => console.log(error))
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.listParam.pageSize = newSize;
        //然后需要重新获取社团列表
        this.getClubList();
      }
      ,
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.queryInfo.listParam.currentPage = newPage;
        //然后需要重新获取社团列表
        this.getClubList();
      }
      ,
      //点击查看活动列表按钮
      btnToChapter(row) {
        console.log('跳转到活动', row.club.id);
        this.$router.push({
          path: 'events',
          query: {
            clubId: row.club.id
          }
        })
      },
      addClubSuccess(data) {
        console.log('添加社团成功的信息', data);
        this.editForm = data;
        this.editDialogVisible = true;
        this.getClubList()
      },
      // 展示编辑社团的对话框
      async showEditDialog(row) {
        this.editForm = row.club;
        this.editDialogVisible = true
      },
      //展示审核社团的对话框
      showInspectDialog(row) {
        this.clubInfo = row.club;
        this.inspectDialogVisible = true;
      },
      //删除社团
      async removeClubById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
            '此操作将永久删除该社团, 是否继续?',
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
        await deleteClub(id).then(res => {
          this.$message.success('删除社团成功！');
          this.getClubList()
        }).catch(error => console.log(error))
      },
      //展开社团详情
      async expandChange(row, expandedRows) {
        if (expandedRows.length === 0) return;
        const lastExpand = expandedRows[expandedRows.length - 1].club;
        if (expandedRows.length > 1) {
          expandedRows.map((item) => {
            if (lastExpand.id !== item.id) {
              this.$refs.selectedList.toggleRowExpansion(item, false)
            }
          })
        }
        //获取展开社团的hobby
        getClubHobby(lastExpand.id).then(res => {
          this.expandHobby = res.payload;
        }).catch(error => console.log(error));
      },
      //重置搜索
      ResetSearch() {
        this.queryInfo.clubFilter = {
          name: null,
          userId: null,
          checked: null,
          passed: null,
          del: false
        };
        this.getClubList()
      }
    },
    watch: {
      searchFilter: function (val, oldVal) {
        this.clubList = this.clubList.filter(item => {
          let boolFind = false;
          if (item.club.name !== null && item.club.name.indexOf(val) !== -1) {
            boolFind = true;
          } else if (item.club.description !== null && item.club.description.indexOf(val) !== -1) {
            boolFind = true;
          } else if (item.master.username !== null && item.master.username.indexOf(val) !== -1)
            boolFind = true;
          return boolFind
        });
        if (val === '') this.getClubList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .demo-table-expand .el-tag {
    margin-right: 10px;
  }

  .video {
    width: 350px;
    height: 300px;
  }

</style>
