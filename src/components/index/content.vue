<template>
  <div class="wrapper">
    <div class="header">
      <v-head></v-head>
    </div>
    <div id="main">
      <v-sidebar @addTab="addTabMenu" ref="sidebar"></v-sidebar>
      <div class="content">
        <el-tabs class="tabWrapper" v-model="urlState" type="border-card" @tab-click="selectTab" @tab-remove="removeTab">
          <el-tab-pane v-for="(item, index) in openTab" :key="index" :label="item.ModuleName" :closable="index!==0" :name="''+item.ModuleId" oncontextmenu="console.log('asd');return false;">
          </el-tab-pane>
          <div id="view">
             <keep-alive>
                <router-view></router-view>
              </keep-alive>
          </div>    
        </el-tabs>
        <!--<Vselect></Vselect>
        <selectMonth></selectMonth>-->
      </div>
    </div> 
  </div>
</template>

<script>
import vHead from '../header/header.vue';
import vSidebar from '../sidebar/sidebar.vue';
import Vselect from "./../../view/plug/select.vue";
import selectMonth from "./../../view/plug/selectMonth.vue";
import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex';
export default {
  components: {
    vHead,
    vSidebar,
    Vselect,
    selectMonth
  },
  computed: {
    ...mapGetters([
      "getOpenTab"
    ]),
    ...mapState({
      openTab: state => state.com.openTab,
      urlState: state => state.com.urlState
    })
  },
  created:function(){
     let clientH= document.documentElement.clientHeight-70-42-30-36-38-30;
     this.$store.commit('COM_CHANGE_TABHEIGHT',clientH);
  },
  methods: {
    ...mapActions([
      'changeUrlState',
      "delOpenTab"
    ]),
    addTabMenu(item) {
      this.$router.push(item.ModuleUri)
    },
    selectTab(item) {
      this.changeUrlState('' + this.openTab[item.index].ModuleId);
      this.$router.push(this.openTab[item.index].ModuleUri);
    },
    removeTab(targetName) {
      this.getOpenTab.forEach((item, index) => {
        if (item.ModuleId == targetName) {
          this.$router.push(this.getOpenTab[index - 1].ModuleUri);
          this.delOpenTab(index);
        }
      })
    }
  }
}
</script>

<style scoped>
.wrapper{
  height:100%;
}
/*#main{
  height:calc(100% - 70px);
}*/
.content {
  padding-left: 140px; 
  height:100%;
} 
/*.tabWrapper{
  height:100%;
  box-sizing:border-box;
}*/
#view{
  position: relative;
}
/*#view{
  height:100%;
}*/
</style>
