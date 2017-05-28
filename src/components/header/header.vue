<template>
    <div class="header">
        <div class="logo">
            <img alt="logo" src="./logo.png" />
        </div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo"> {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import 'babel-polyfill';
export default {
    data() {
        return {
            name: ''
        }
    },
    created: function () {
        this._loadUserName();
    },
    computed: {
        username() {
            // let username = localStorage.getItem('ms_username');
            // return username ? username : this.name;
            return this.name;
        }
    },
    methods: {
        handleCommand(command) {
            if (command == 'loginout') {
                //localStorage.removeItem('ms_username')
                this.$router.push('/login');
            }
        },
        _loadUserName() {
            let _this = this;
            axios.get('/Home/CurrentUser').then((res) => {
                _this.name = res.data.data.DisplayName;
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
    background-color: #eef1f6;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.header .logo img {
    display: inline-block;
    vertical-align: middle;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}
</style>