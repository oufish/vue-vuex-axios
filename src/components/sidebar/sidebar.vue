<template>
    <div class="sidebar">
        <el-menu  class="el-menu-vertical-demo" unique-opened :default-active="geturlState">
            <el-submenu v-for="(menu,index) in menuList" :key="menu.ModuleId" :index="menu.ModuleId">
                <template slot="title"><i class="el-icon-menu"></i>{{menu.ModuleName}}</template>
                
                <el-menu-item v-for="(item,index2) in menu.children" :key="item.ModuleId" :index="item.ModuleId" @click="select(item)">{{item.ModuleName}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template> 
<script>
import axios from 'axios';
import 'babel-polyfill';
 import {toTree} from './../../util/toTree.js';
import { mapGetters,mapActions,mapState } from 'vuex'
    export default {
        data() {
            return {
                id:"0",
               menuList:[]
            };
         },
         
        computed: {
             ...mapGetters([
                'getLeftMenu',
                'geturlState'
                ])
        },
        created:function () {
             this.getLeftMenuActions().then(()=>this.getData());
        },
        methods:{
            ...mapActions([
                'getLeftMenuActions'
                ]),
            getData:function(){
                this.menuList = toTree(this.getLeftMenu);
            },
            select:function(item){
                this.$router.push(item.ModuleUri);
            }
        }
    }
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 140px;
        left: 0;
        top: 70px;
        bottom:0;
        background-color: #20a0ff;
        z-index: 100;
    }
    .sidebar > ul {
        height:100%;
    }
   
</style>