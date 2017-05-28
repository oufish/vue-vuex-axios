<template>
  <div class="editMenu">
    <div class="form">
      <el-form :model="form" ref="form" :rules="rules">
        <el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="模块名称" :label-width="formLabelWidth" prop="ModuleName">
              <el-input v-model="form.ModuleName" class="ModuleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="父级菜单" :label-width="formLabelWidth" class="treeWrapper">
              <combotree :form="form"></combotree>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="排序号" :label-width="formLabelWidth" prop="DisplayOrder">
              <el-input v-model.number="form.DisplayOrder" class="ModuleNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="删除标识" :label-width="formLabelWidth">
              <el-checkbox v-model="form.Deleted"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="模块地址" :label-width="formLabelWidth">
            <el-input v-model="form.ModuleUri" class="ModuleAddr"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="showMess">
      <el-row :gutter="20">
        <el-col :span="6" :offset="20">
          <el-button size="small" icon="edit" @click="_showCodeName">添加功能</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table :data="tableData" border stripe fit resizable style="width: 100%" v-loading="loading" :default-sort="{prop: 'FunctionId', order: 'descending'}" @row-dblclick="_dblclick">
          <el-table-column prop="Code" label="功能编码" width="180" sortable align="center">
          </el-table-column>
          <el-table-column prop="FunctionName" label="功能名称" width="180" sortable align="center">
          </el-table-column>
          <el-table-column prop="Deleted" label="删除标识" sortable align="center">
            <template scope="scope">
              <i class="el-icon-check" v-show="scope.row.Deleted"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <transition name="fade">
      <div v-show="codeNameShow" class="codeNameWrapper">
        <div class="codeName">
          <div class="head">
            <label>{{codeNameTitle}}</label>
            <span class="el-icon-close" @click='_codeCancal'></span>
          </div>
          <div class="conmtent">
            <el-form label-position="right" label-width="80px" class="form" ref="CodeForm" :model="CodeForm" :rules="rules2">
              <el-form-item label="FunctionId" v-show="false">
                <el-input size="small" v-model="CodeForm.FunctionId"></el-input>
              </el-form-item>
              <el-form-item label="功能编码" prop="Code">
                <el-input size="small" v-model="CodeForm.Code"></el-input>
              </el-form-item>
              <el-form-item label="功能名称" prop="FunctionName">
                <el-input size="small" v-model="CodeForm.FunctionName"></el-input>
              </el-form-item>
              <el-form-item label="删除标识">
                <el-checkbox v-model="CodeForm.Deleted"></el-checkbox>
              </el-form-item>
            </el-form>
          </div>
          <div class="footer">
            <el-button @click="_codeCancal">取 消</el-button>
            <el-button type="primary" @click="_codSave">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import combotree from './../combotree.vue'
import axios from 'axios';
import 'babel-polyfill';
export default {
  props: {
    form: {
      type: Object
    },
  },
  data() {
    return {
      formLabelWidth: "80px",
      tableData: [],
      loading: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      codeNameShow: false,
      codeNameTitle: "",
      type: "",//控制新增或者添加,默认为空--新增
      CodeForm: {//设置添加编辑弹窗数据
        Code: "",
        FunctionName: "",
        Deleted: "",
        FunctionId: ""
      },
      //验证表单开始
      rules: {
        ModuleName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' },
        ],
        DisplayOrder: [
          { required: true, type: 'number', message: '排序号必须为数字', trigger: 'blur' },
        ]
      },
      rules2: {
        Code: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' }
        ],
        FunctionName: [
          { required: true, message: '功能编码不能为空', trigger: 'blur' }
        ]
      }
      // 验证表单结束
    }
  },
  watch: {
    form() {//监听父组件传过来的form值
      this._loadTabel();
    }
  },
  methods: {
    _loadTabel() {
      let _this = this;
      axios.get('/Sys/ModuleManagement/GetModuleFunctions?ModuleId=' + _this.form.ModuleId).then((res) => {
        _this.tableData = res.data.data;
      }).catch(err => {
        console.log(err);
      });
      _this.loading = false;
    },
    _showCodeName() {
      this.codeNameShow = true;
      this.codeNameTitle = '新增';
    },
    _dblclick(row, event) {
      this.codeNameTitle = '编辑';
      this.CodeForm.Code = row.Code;
      this.CodeForm.FunctionName = row.FunctionName;
      this.CodeForm.Deleted = row.Deleted;
      this.CodeForm.FunctionId = row.FunctionId;
      this.codeNameShow = true;
      this.type = "UPDATE";
    },
    _codeCancal() {
      this.codeNameShow = false;
      this.CodeForm.Code = "";//清空
      this.CodeForm.FunctionName = "",//清空
        this.CodeForm.Deleted = "";//清空
      this.CodeForm.FunctionId = "";//清空
      this.type = "";
      this.$refs.CodeForm.resetFields();
    },
    _codSave() {
      this.$refs.CodeForm.validate((valid) => {
        if (valid) {
          this.codeNameShow = false;
          let _this = this;
          axios.post('/Sys/ModuleManagement/SaveFunction?__mode=' + _this.type, {
            ModuleId: _this.form.ModuleId,
            Code: _this.CodeForm.Code,
            FunctionId: _this.CodeForm.FunctionId,
            FunctionName: _this.CodeForm.FunctionName,
            Deleted: _this.CodeForm.Deleted,
          }).then((res) => {
            if (res.data.success) {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              _this._loadTabel();
            }
          }).catch();
          this.CodeForm.Code = "";//清空
          this.CodeForm.FunctionName = "",//清空
            this.CodeForm.Deleted = "";//清空
          this.CodeForm.FunctionId = "";//清空
          this.type = "";
        } else {
          return false;
        }
      });
    }
  },
  components: {
    combotree
  }
}
</script>
<style scoped>
.ModuleName,
.parentModuleName,
.ModuleNumber,
.tree {
  width: 70%;
}

.ModuleAddr {
  width: 87%;
}

.treeWrapper {
  position: relative;
}

.tree {
  position: absolute;
  top: 36px;
  left: 0;
  z-index: 100;
  max-height: 180px;
  overflow-y: scroll;
}

.form {
  overflow: hidden;
}

.showMess {
  background: #ddd;
}

.codeNameWrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}

.codeName {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: #fff;
  z-index: 20000;
  border-radius: 5px;
}

.codeNameWrapper .head {
  overflow: hidden;
}

.codeNameWrapper .head label {
  float: left;
  margin: 15px 0 0 15px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2d3d;
}

.codeNameWrapper .head span {
  float: right;
  margin: 15px 20px 0 0;
  cursor: pointer;
  color: #bfcbd9;
}

.codeNameWrapper .conmtent {
  padding: 20px 0 0 20px;
}

.codeNameWrapper .conmtent form {
  margin: 0 20px;
}

.codeNameWrapper .conmtent .el-form-item {
  margin-bottom: 16px;
}


.codeNameWrapper .footer {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.moduleName {
  width: 70%;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
