import * as types from '../types';
import axios from 'axios';
import 'babel-polyfill';
/*
通用配置 -(菜单点击效果)

*/

const state={
    tabHeight:0,
    leftMenu:[],
    urlState:"1",
    openTab:[{
          ModuleName: '首页',
          ModuleUri:'/main',
          ModuleId:'1'
        }]
}

const mutations = {
    [types.COM_LEFT_MENU](state,res){
        state.leftMenu = res;
    },
    [types.COM_CHANGE_URLSTATE](state,str){
        state.urlState=str; 
    },
    [types.COM_ADD_OPENTAB](state,obj){
        let flag=false;
        state.openTab.forEach((item)=> {
            item.ModuleUri==obj.ModuleUri ? flag=true : "";
        });
        flag ? "" : state.openTab.push(obj);
    },
    [types.COM_DEL_OPENTAB](state,num){
        state.urlState=""+state.openTab[num-1].ModuleId;
        state.openTab.splice(num,1);
    },
    [types.COM_CHANGE_TABHEIGHT](state,num){
        state.tabHeight=num;
    }
}

const actions ={
    getLeftMenuActions({ commit }){
        return new Promise((resolve, reject) => {
              axios.get("/Home/GetUserModules").then((res) =>{
                    commit(types.COM_LEFT_MENU,res.data.data)
                    resolve();
                })
        });
    },
    changeUrlState({ commit },str){
         commit(types.COM_CHANGE_URLSTATE,str)
    },
    addOpenTab({ commit },obj){
         commit(types.COM_ADD_OPENTAB,obj)
    },
    delOpenTab({ commit },num){
         commit(types.COM_DEL_OPENTAB,num)
    }
}

const getters = {
    getLeftMenu: state => state.leftMenu,
    getOpenTab :state => state.openTab,
    geturlState:state => state.urlState
}
export default {
    state,
    actions,
    getters,
    mutations
}