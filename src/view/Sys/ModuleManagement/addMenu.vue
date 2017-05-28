<template>
  <div class="addMenu" @click.self="hide">
    <el-form :model="form" class="formWraper" ref="form" :rules="rules" @click.self="hide">
      <el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="模块名称" :label-width="formLabelWidth" prop="ModuleName">
            <el-input v-model="form.ModuleName" class="ModuleName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="父级菜单" :label-width="formLabelWidth" class="treeWrapper" @click.stop="cs">
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
</template>
<script>
import combotree from './../combotree.vue';
import axios from 'axios';
import 'babel-polyfill';
export default {
  props: {
    form: {
      type: Object
    }
  },
  data() {
    return {
      formLabelWidth: "80px",
      ParentModuleIdShow: false,
      showTree: false,
      //验证
      rules: {
        ModuleName: [
          { required: true, message: '模块名称不能为空', trigger: 'blur' },
        ],
        DisplayOrder: [
          { required: true, type: 'number', message: '排序号不能为空且必须为数字', trigger: 'blur' },
        ]
      }
    }
  },
  components: {
    combotree
  }
}
</script>
<style scoped>
.addMenu {
  overflow: hidden;
}

.formWraper {
  overflow: hidden;
}

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

.code,
.name {
  margin-bottom: 15px;
}
</style>
