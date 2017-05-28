<template>
  <div class="menu">
    <el-row :gutter="4" class="searchWrapper">
      <el-col :span="6" :xs="12">
        <div class="grid-content bg-purple">
          <el-input v-model="queryParm.ModuleName" placeholder="请输入内容" class="search">
            <template slot="prepend">模块名称</template>
          </el-input>
        </div>
        
      </el-col>
      <el-col :span="6" :xs="24">
        <el-button type="info" icon="plus" @click="dialogShow = true">增加</el-button>
        <el-button type="info" icon="search" @click="getData(queryParm)">查询</el-button>
      </el-col>
      <el-dialog title="新增" :visible.sync="dialogShow">
        <addMenu :form="form" ref="addMenu"></addMenu>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="editDialogShow">
        <editMenu :form="detialFrom" ref="editMenu"></editMenu>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCancel">取 消</el-button>
          <el-button type="primary" @click="editSave">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-table :data="menuData.data" border stripe fit resizable style="width: 100%" v-loading="loading" :default-sort="{prop: 'DisplayOrder', order: 'descending'}" @row-dblclick="dblclick" :height="this.$store.state.com.tabHeight">
      <el-table-column prop="ModuleName" label="模块名称" sortable width="200" align="center"></el-table-column>
      <el-table-column prop="ModuleUri" label="模块地址" sortable width="180" align="center"></el-table-column>
      <el-table-column prop="ParentModuleName" label="父级菜单" align="center"></el-table-column>
      <el-table-column prop="DisplayOrder" label="排序号" align="center"></el-table-column>
      <el-table-column prop="Deleted" label="删除标志" align="center">
        <template scope="scope">
          <i class="el-icon-check" v-show="scope.row.Deleted"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-fixed" v-if="menuData.total>0">
      <el-pagination @size-change="changeSize" @current-change="currentChange" :current-page="queryParm.currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import 'babel-polyfill';
import addMenu from "./addMenu.vue";
import editMenu from "./editMenu.vue";
export default {
  data() {
    return {
      menuData: {},//tab数据
      loading: true,
      total: 0,//总条数
      pageSizes: this.$store.getters.getPageSizes,
      pageSize: this.$store.getters.getPage,
      queryParm: {
        page: 1,//當前頁數
        start: 0,
        limit: this.$store.getters.getPage,
        sort: "ModuleId",
        ModuleName: "",
        dir: "ASC",
        _dc: new Date()
      },
      dialogShow: false,
      editDialogShow: false,
      form: {
        _mode: "",
        ModuleId: "",
        ModuleName: "",
        ParentModuleId: "",
        DisplayOrder: "",
        Deleted: false,
        ModuleUri: ""
      },
      detialFrom: {},
    };
  },
  created: function () {
    this.$nextTick(function () {
      this.getData(this.queryParm);
    });
  },
  methods: {
    getData: function (queryParm) {
      let _this = this;
      axios.get("/Sys/ModuleManagement/Query", { params: queryParm }).then((res) => {
        _this.menuData = res.data;
        _this.total = res.data.total;
        _this.loading = false;
      }).catch(function (err) { console.log(err); });
    },
    changeSize(val) {
      this.loading = true;
      this.queryParm.limit = val;
      this.$nextTick(function () {
        this.getData(this.queryParm);
      });
    },
    currentChange(val) {
      this.loading = true;
      this.queryParm.page = val;
      this.queryParm.start = (val - 1) * this.queryParm.limit + 1;
      this.$nextTick(function () {
        this.getData(this.queryParm);
      });
    },
    cancel() {
      this.dialogShow = false;
      this.form._mode = '';
      this.form.ModuleId = '';
      this.form.ModuleName = '';
      this.form.ParentModuleId = '';
      this.form.DisplayOrder = '';
      this.form.Deleted = false;
      this.form.ModuleUri = '';
      this.$refs.addMenu.$refs.form.resetFields();
    },
    save() {
      this.$refs.addMenu.$refs.form.validate((valid) => {
        if (valid) {
          let _this = this;
          axios.post('/Sys/ModuleManagement/Save', {
            __mode: _this.form._mode,
            ModuleId: _this.form.ModuleId,
            ModuleName: _this.form.ModuleName,
            ParentModuleId: _this.form.ParentModuleId,
            DisplayOrder: _this.form.DisplayOrder,
            Deleted: _this.form.Deleted,
            ModuleUri: _this.form.ModuleUri
          }).then((res) => {
            if (res.data.success) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
            }
            this.cancel();//情况输入框
          }).catch((error) => { console.log(error) });
          this.dialogShow = false;
          this.loading = true;
          this.getData(this.queryParm);
        } else {
          return false;
        }
      })
    },
    dblclick(row, event) {
      this.editDialogShow = true;
      let _this = this;
      //获取编辑状态的输入框数据
      axios.post('/Sys/ModuleManagement/Detail', { ModuleId: row.ModuleId }).then((res) => {
        _this.detialFrom = res.data.data;
      }).catch((error) => { console.log(error) });
    },
    editCancel() {
      this.editDialogShow = false;
      this.$refs.editMenu.$refs.form.resetFields();
    },
    editSave() {
      this.$refs.editMenu.$refs.form.validate((valid) => {
        if (valid) {
          let _this = this;
          axios.post('/Sys/ModuleManagement/Save?__mode=UPDATE', {
            ModuleId: _this.detialFrom.ModuleId,
            ModuleName: _this.detialFrom.ModuleName,
            ParentModuleId: _this.detialFrom.ParentModuleId,
            DisplayOrder: _this.detialFrom.DisplayOrder,
            Deleted: _this.detialFrom.Deleted,
            ModuleUri: _this.detialFrom.ModuleUri,
          }).then((res) => {
            if (res.data.success) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
            }
          }).catch((error) => { console.log(error) });
          _this.editDialogShow = false;
          _this.loading = true;
          _this.getData(this.queryParm);
        } else {
          return false;
        }
      });
    }
  },
  components: {
    addMenu, editMenu
  }
}  
</script>
<style scoped>
/*.menu{
  height:100%;
  width:100%;
  position:relative;
}*/
.searchWrapper {
  margin: 16px 0;
}

.search {
  width: 100%;
}
</style>
