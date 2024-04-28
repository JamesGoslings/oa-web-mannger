<!-- 用户管理页面 -->
<template>
    <div class="userManngerAll">
        <div class="tableBox">
            <button @click="emitMitt()">点我</button>
            <table class="table">
                <tr class="ltr">
                    <th class="th">姓名</th>
                    <th class="th2">账号</th>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import { getCurrentInstance } from 'vue'

const cxt  = getCurrentInstance() //相当于Vue2中的this
const bus = cxt.appContext.config.globalProperties.$bus
const emitMitt = function(){
    console.log("6")
    bus.emit('printMessage','我是Role组件，我被user组件触发了')
}

const router = useRouter()

</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';
.userManngerAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    .tableBox{
        margin: 2vh 0;
        width: 80%;
        background: #FFF;
        height: 60vh;
        border-radius: 2px;
        box-shadow: 0px 0px 3px #928c8c64;
        .table{
            border: #000 1px solid;
            .ltr{
                border: #000 1px solid;
                color: rgb(136,136,136);
                .th{
                    background: #F5F5F5;
                }
            }
        }
    }
}
</style>