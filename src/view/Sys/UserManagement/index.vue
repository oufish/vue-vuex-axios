<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" :xs="12">
        <div class="pading-10-0">
          <el-input placeholder="请输入账号" v-model="queryObj.UserAccount">
            <template slot="prepend">用户账号</template>
          </el-input>
      </div> 
    </el-col>

    <el-col :span="6" :xs="12">
      <div class="pading-10-0">
        <el-input placeholder="请输入名称" v-model="queryObj.DisplayName">
          <template slot="prepend">显示名称</template>
        </el-input>
      </div> 
    </el-col>

    <el-col :span="12" :xs="24">
      <div class="pading-10-0">
        <el-button type="primary" icon="plus" @click="addUserFunc()" v-if="accessCodes.indexOf('Add')!==-1">新增</el-button>
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
          prop="UserAccount"
          label="用户账号">
        </el-table-column>
        <el-table-column
          prop="DisplayName"
          label="显示名称">
        </el-table-column>
        <el-table-column
          prop="Deleted"
          label="删除标识">
            <template scope="scope">
                <i class="el-icon-check" v-show="scope.row.Deleted"></i>
            </template>
        </el-table-column>
        <el-table-column
          label="用户权限"
          width="100" v-if="accessCodes.indexOf('EditUserRole')!==-1">
          <template scope="scope">
            <el-button type="text" size="small" @click="getPermission(scope.row.UserId)">用户角色</el-button>
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
      
      <el-dialog :title="addUser? '添加用户':'修改用户信息'" :visible.sync="detailVisible" >
          <el-form :model="detail" label-width="100px"   class="demo-form-inline" :inline="true" :rules="rules" ref="detail">
            <el-form-item label="用户账号" prop="UserAccount">
              <el-input v-model="detail.UserAccount" :disabled="!addUser"></el-input>
            </el-form-item>
             <el-form-item label="显示名称" prop="DisplayName">
              <el-input v-model="detail.DisplayName"></el-input>
            </el-form-item>
            <el-form-item label="删除标识" prop="Deleted">
              <el-checkbox-group v-model="detail.Deleted">
                <el-checkbox name="Deleted"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="detailVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveUserInfo(detail)" v-if="accessCodes.indexOf('Edit')!==-1">确 定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="用户角色权限" :visible.sync="permissionVisible" >
            <el-table
              :data="PermissionData.data"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                >
              </el-table-column>
               <el-table-column
                width="55">
                 <template scope="scope">
                  <el-checkbox v-model="scope.row.Checked"></el-checkbox>
                 </template>
              </el-table-column>
              <el-table-column
                prop="Code"
                label="角色编码"
               >
              </el-table-column>
              <el-table-column
                prop="RoleName"
                label="角色名称"
                >
              </el-table-column>
            </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="permissionVisible = false">取 消</el-button>
            <el-button type="primary" @click="savePermission()">确 定</el-button>
          </div>
      </el-dialog>


  </div>
</template>
<script>
  import '@/style/common.css';
  export default {
    data() {
      return {
        resData: {},
        loading2: true,
        pageSize: this.$store.getters.getPage,
        queryObj: {
          UserAccount: "",
          DisplayName:"",
          page: 1,
          sort: "UserId",
          dir: "ASC",
          _dc: new Date().getTime(),
          start: 0,
          limit: this.$store.getters.getPage
        },
        detail:{
          UserId:null,
          UserAccount:"",
          DisplayName:"",
          Deleted:false
        },
        detailVisible:false,
        permissionVisible:false,
        addUser:false,
        PermissionData:{},
        queryPermission:{
           _dc:new Date().getTime(),
           userId:null,
           page:1,
           start:1,
           limit:"65535",
           sort:"RoleId",
           dir:"ASC"
          },
        accessCodes:[],
        rules: {
            UserAccount: [
              { required: true, message: '请输入用户账号' }
            ],
            DisplayName: [
              { required: true, message: '请输入显示名称'}
            ]
          }
      };
    },
    created: function() {
           
            this.getAccessCodes();
    },
    methods:{
            getAccessCodes:function(){
              this.axios.get("/Sys/UserManagement/AccessCodes")
                    .then((res) => {
                        this.accessCodes = res.data.data ? res.data.data :[];
                        this.getData(this.queryObj);
                    })
            },
            getData: function(obj) {
                this.resData={}
                this.axios.get("/Sys/UserManagement/Query",{params:obj})
                .then((res) => {
                    this.resData = res.data;
                    this.loading2=false;
                })
            },
            getPermission:function(id){
              this.PermissionData={};
              this.queryPermission.userId=id;
              this.axios.get("/Sys/UserManagement/GetUserRoles",{params:this.queryPermission})
                    .then((res) => {
                        this.PermissionData = res.data;
                        this.permissionVisible=true;
                    })
            },
            savePermission:function(){
              let obj={
                    roleIDs:[]
                    };
              obj.userId=this.queryPermission.userId;
              this.PermissionData.data.forEach(item=>{ item.Checked ? obj.roleIDs.push(item.RoleId):'';});
              obj.roleIDs.length ? '':delete obj.roleIDs;
              this.axios.post("/Sys/UserManagement/SaveUserRoles",Qs.stringify(obj))
               .then((res) => {
                      this.$notify({
                        title: res.data.success ? '成功':'失败',
                        message: res.data.message,
                        type: res.data.success ? 'success':'error'
                      });
                      this.permissionVisible=false;
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
            queryDetail:function(row){
               this.axios.post("/Sys/UserManagement/Detail",{UserId:row.UserId})
               .then((res) => {
                 if(res.data.data.Password==null) delete res.data.data.Password;
                 if(res.data.data.PasswordSalt==null) delete res.data.data.PasswordSalt;
                 this.detail=res.data.data;
                 this.detailVisible=true;
                 this.addUser=false;
                })
            },
            saveUserInfo:function(obj){
              this.$refs.detail.validate((valid) => {
                if (valid) {
                   this.detailVisible = false;
                    if(this.addUser){
                        obj.__mode='';
                        obj.UserId=null;
                    }else{
                        obj.__mode='UPDATE';
                        delete obj.UserAccount;
                    }
                    this.axios.post("/Sys/UserManagement/Save",Qs.stringify(obj))
                    .then((res) => {
                      this.$notify({
                          title: res.data.success ? '成功':'失败',
                          message: res.data.message,
                          type: res.data.success ? 'success':'error'
                        });
                        this.getData(this.queryObj);
                      })
                } else {
                  return false;
                }
              });
            },
            addUserFunc:function(){
              this.detailVisible = true;
              this.addUser = true;
              this.detail={
                    UserId:null,
                    UserAccount:"",
                    DisplayName:"",
                    Deleted:false
                  }
            }

    }
  }
</script>
<style scoped>

</style>