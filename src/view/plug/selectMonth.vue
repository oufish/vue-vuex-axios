<template>
  <div class="selectMonth">
    <el-date-picker v-model="value" type="month" placeholder="选择年月">
    </el-date-picker>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value:""
    }
  }
}
</script>
<style scoped>

</style>

