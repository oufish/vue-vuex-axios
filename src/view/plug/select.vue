<template>
  <div class="selectMenu">
    <el-select v-model="value" :filter-method="select" size="small" multiple filterable placeholder="请选择" class="selectMenuItem">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
var py = require('./../../util/pinyin.js');
import axios from 'axios';
import 'babel-polyfill';
export default {
  data() {
    return {
      options: [],
      value: [],
      data: [],//做一个中间变量,复制一份数据源,防止改变数据源
    }
  },
  created: function () {
     axios.get('./../../static/select.json').then((res)=>{
        res.data.map((option) => {
          option.pinyin = py.convertPYs(option.label)[0];
          option.py = py.convertPYs(option.label)[1];
         });
    this.options = res.data;
    this.data = res.data;
     }).catch((error)=>{
       console.log(error);
     })
  },
  methods: {
    select(query) {
      if (query!=="") {
        let PinYin = py.convertPYs(query)[0];
        let simplePY = py.convertPYs(query)[1];
        let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        let Arr = this.data.filter((option) => {
          if (reg.test(query)) {
            if (option.label.indexOf(query) > -1) {
              return option;
            }
          }
          else {
            console.log(option.pinyin);
            if (PinYin.toUpperCase() === option.pinyin.toUpperCase() ||//判断全拼音相等 
                simplePY.toUpperCase()=== option.py.toUpperCase() || //判断简拼相等
                option.py.toUpperCase().indexOf(simplePY.toUpperCase()) > -1||//全拼音包含
                option.pinyin.toUpperCase().indexOf(PinYin.toUpperCase()) > -1) {//简拼包含
              return option;
            } else {
              return ""
            }
          }
        });
        Arr.length > 0 ? this.options = [...Arr] : this.options = [];
      } else {
        this.options = this.data;
      }
    }
  }
}
</script>
<style>
/*不加scoped目的让其导入到根环境*/

.el-select__tags {
  height: 30px;
}

.el-select__tags>span {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

