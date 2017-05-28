<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" :xs="12">
        <div class="pading-10-0">
          <el-input placeholder="请输入角色编码" v-model="queryObj.Code">
            <template slot="prepend">角色编码</template>
          </el-input>
      </div> 
    </el-col>

    <el-col :span="6" :xs="12">
      <div class="pading-10-0">
        <el-input placeholder="请输入角色名称" v-model="queryObj.RoleName">
          <template slot="prepend">角色名称</template>
        </el-input>
      </div> 
    </el-col>

    <el-col :span="12" :xs="24">
      <div class="pading-10-0">
        <el-button type="primary" icon="plus" @click="addRoleFunc()" v-if=" accessCodes.indexOf('Add')!==-1">新增</el-button>
        <el-button type="primary" icon="search" @click="getData(queryObj)">查询</el-button>
      </div>
    </el-col>

    <el-col :span="24">
      <el-table
        @cell-dblclick="queryDetail"
        :data="resData.data"
        stripe
        :height="this.$store.state.com.tabHeight"
        style="width: 100%">
        <el-table-column
          type="index"
          width="100"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="Code"
          label="角色编码">
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="Deleted"
          label="删除标识">
            <template scope="scope">
                <i class="el-icon-check" v-show="scope.row.Deleted"></i>
            </template>
        </el-table-column>
        <el-table-column
          label="功能权限"
          width="100" v-if=" accessCodes.indexOf('EditRoleFunction')!==-1">
          <template scope="scope">
            <el-button type="text" size="small" @click="getRoleAction(scope.row.RoleId)">角色功能</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    
    
    </el-row>
       <div class="pagination-fixed" v-if="resData.total>0">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryObj.page"
                    :page-sizes="this.$store.getters.getPageSizes"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper,sizes"
                    :total="resData.total">
                </el-pagination>
        </div>

      <el-dialog :title="addRole? '添加角色':'修改角色信息'" :visible.sync="detailVisible" >
          <el-form :model="detail" label-width="100px"   class="demo-form-inline" :inline="true" :rules="rules" ref="detail">
            <el-form-item label="角色编码" prop="Code">
              <el-input v-model="detail.Code" :disabled="!addRole"></el-input>
            </el-form-item>
             <el-form-item label="角色名称" prop="RoleName">
              <el-input v-model="detail.RoleName"></el-input>
            </el-form-item>
            <el-form-item label="删除标识" prop="Deleted">
              <el-checkbox-group v-model="detail.Deleted">
                <el-checkbox name="Deleted"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo(detail)" v-if=" accessCodes.indexOf('Edit')!==-1">确 定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="角色功能权限" :visible.sync="roleActionVisible" >
            <el-table
              :data="roleActionData.children"
              stripe
              style="width: 100%">
               <el-table-column
                type="expand">
                 <template scope="props">
                    <ul id="list-item-box">
                        <li v-for="(item, index) in props.row.children">
                            <div class="item-name"> {{item.label}}</div>
                            <div class="item-checkbox">
                                <el-checkbox v-model="itemChecked.Checked" v-for="(itemChecked, index) in item.tag" :key="itemChecked.FunctionId">{{itemChecked.FunctionName}}</el-checkbox>
                            </div>
                        </li>
                    </ul>
                 </template>
              </el-table-column>
              <el-table-column
                prop="label"
                label="菜单名称"
                width="200">
              </el-table-column>
              <el-table-column
                prop="RoleName"
                label="菜单功能">
              </el-table-column>
            </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="roleActionVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleAction()">确 定</el-button>
          </div>
      </el-dialog>

  </div>
</template>
<script>
  import '@/style/common.css';
    export default{
        data(){
            return {
                roleActionData:{},
                accessCodes:[],
                resData:{},
                detailVisible:false,
                roleActionVisible:false,
                detail:{
                    RoleId:null,
                    Code:"",
                    RoleName:"",
                    Deleted:false
                    },
                loading2: true,
                pageSize: this.$store.getters.getPage,
                queryObj: {
                    Code:"",
                    RoleName:"",
                    page: 1,
                    sort: "RoleId",
                    dir: "ASC",
                    _dc: new Date().getTime(),
                    start: 0,
                    limit: this.$store.getters.getPage
                    },
                 addRole:false,
                 roleObj:{
                    RoleID:null
                 },
                 rules: {
                  Code: [
                    { required: true, message: '请输入角色编码' }
                  ],
                  RoleName: [
                    { required: true, message: '请输入角色名称'}
                  ]
                 }
            }
        },
        created:function(){
            this.getAccessCodes();
        },
        methods:{
            getAccessCodes:function(){
              this.axios.get("/Sys/RoleManagement/AccessCodes")
                    .then((res) => {
                        this.accessCodes = res.data.data ? res.data.data :[];
                        this.getData(this.queryObj);
                    })
            },
             getData: function(obj) {
                this.resData={}
                this.axios.get("/Sys/RoleManagement/Query",{params:obj})
                .then((res) => {
                    this.resData = res.data;
                    this.loading2=false;
                })
            },
            queryDetail:function(row){
               this.axios.post("/Sys/RoleManagement/Detail",{RoleId:row.RoleId})
               .then((res) => {
                 this.detail=res.data.data;
                 this.detailVisible=true;
                 this.addRole=false;
                })
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
            },
            addRoleFunc:function(){
              this.detailVisible = true;
              this.addRole = true;
              this.detail={
                    UserId:null,
                    Code:"",
                    RoleName:"",
                    Deleted:false
                };
              
            },
            saveRoleInfo:function(obj){
              this.$refs.detail.validate((valid) => {
                  if (valid) {
                   this.detailVisible = false;
                    if(this.addRole){
                        obj.__mode='';
                        obj.RoleId=null;
                    }else{
                        obj.__mode='UPDATE';
                    }
                    this.axios.post("/Sys/RoleManagement/Save",Qs.stringify(obj))
                    .then((res) => {
                      this.$notify({
                          title: res.data.success ? '成功':'失败',
                          message: res.data.message,
                          type: res.data.success ? 'success':'error'
                        });
                        this.getData(this.queryObj);
                      })
                  } else {
                    return true;
                  }
                });
               
            },
            getRoleAction:function(id){
                this.roleObj.RoleID=id;
                this.roleActionVisible=true;
                this.roleActionData={};
                 this.axios.get("/Sys/RoleManagement/GetRoleFunctionTreeData",{params:{roleId:id}})
                      .then((res) => {
                            this.roleActionData = res.data;
                            console.log(this.roleActionData)
                        })
            },
            saveRoleAction:function(){
                this.roleActionVisible=false;
                let Checked=[];
                this.roleActionData.children.forEach(function(items) {
                    items.children.forEach(function(item) {
                        item.tag.forEach(function(element) {
                            element.Checked ? Checked.push(element.FunctionId): "";
                        })
                    })
                });
                let obj={};
                obj.RoleID=this.roleObj.RoleID;
                Checked.length ? obj.FunctionIDs=Checked:"";
                 this.axios.post("/Sys/RoleManagement/SaveRoleFunctions",Qs.stringify(obj))
                      .then((res) => {
                            this.$notify({
                                title: res.data.success ? '成功':'失败',
                                message: res.data.message,
                                type: res.data.success ? 'success':'error'
                            });
                        })
            }
        }
    }
</script>

<style scoped>
    #list-item-box{
        list-style:none;
    }
    #list-item-box li{
        padding:10px 0;
    }
    #list-item-box .item-name{
        width:150px;
        display: inline-block;
    }
    #list-item-box .item-checkbox{
        display: inline-block;
    }
</style>