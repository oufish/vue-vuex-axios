<template>
    <div>
    
        <p>记录日期
    
            <el-date-picker v-model="queryObj.logDate" type="date" placeholder="选择日期">
    
            </el-date-picker>
     <el-button type="info" @click="getData(queryObj)">查询</el-button>
        </p>
    
        <el-table :data="queryLog.data" border style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}"  v-loading="loading2" :height="this.$store.state.com.tabHeight">
    
            <el-table-column prop="LogTime" label="日期"  width="180" :formatter="formatLogTime">
    
            </el-table-column>
    
            <el-table-column prop="UserName" label="操作员"  width="180">
    
            </el-table-column>
    
            <el-table-column prop="Description" label="日志">
    
            </el-table-column>
    
            <el-table-column prop="Category" label="分类">
    
            </el-table-column>
    
            <el-table-column prop="Source" label="来源">
    
            </el-table-column>
            
            <el-table-column prop="IP" label="IP地址">
    
            </el-table-column>
    
        </el-table>
    
        <div class="pagination-fixed" v-if="queryLog.total>0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryObj.page"
                :page-sizes="this.$store.getters.getPageSizes"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper,sizes"
                :total="queryLog.total">
            </el-pagination>
        </div>
    
    </div>
</template>
<script>
    import {formatDate} from '@/util/date.js'
    export default {
    
        data() {
    
            return {
                queryLog: {},
                value1: "",
                loading2:true,
                pageSize:this.$store.getters.getPage,
                queryObj:{
                    logDate:formatDate(new Date(),"yyyy-MM-dd"),
                    page:1,
                    sort:"LogTime",
                    dir:"DESC",
                    _dc:"1494234385929",
                    start:0,
                    limit:this.$store.getters.getPage
                }
            };
    
        },
    
        created: function() {
            this.getData(this.queryObj);
        },
    
        methods: {
            formatLogTime:(row)=>formatDate(row.LogTime,'yyyy-MM-dd hh:mm')
            ,
            getData: function(obj) {
                this.axios.get("/Sys/LogManagement/Query",{params:obj}).then((res) => {
                    this.queryLog = res.data;
                    this.loading2=false;
                });
            },
            handleCurrentChange:function(val){
                this.loading2=true;
                this.queryObj.page=val;
                this.getData(this.queryObj);
            },
            handleSizeChange:function(val){
                this.pageSize=val;
                this.queryObj.start=(this.queryObj.page-1)*val+1;
                this.queryObj.limit=this.queryObj.page*val;
                this.getData(this.queryObj);
            }
        }
    
    }
</script>
<style scoped>
     button{
      vertical-align: top;
    }
</style>