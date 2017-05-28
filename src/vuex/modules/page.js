import * as types from '../types';

/*
分页当前页码和

*/

const state={
    page: 10,
    pageSizes:[10,20,50,100]
}

const mutations = {
    
}

const actions ={
  
}

const getters = {
    getPage : state => state.page,
    getPageSizes : state => state.pageSizes
}
export default {
    state,
    actions,
    getters,
    mutations
}