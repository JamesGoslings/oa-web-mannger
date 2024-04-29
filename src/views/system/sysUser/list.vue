<!-- 用户管理页面 -->
<template>
    <div class="userManngerAll">
        <div class="funTitle">用户表</div>
        <div class="baseCard tableBox">
            <div class="tableFuns">
                <actButton class="actBtn" txt='+添加' actColor="rgb(60,118,244)"></actButton>
                <actButton class="actBtn" txt='&#xe614; 重置' actColor="rgb(60,118,244)"></actButton>
                <span class="iptBox">
                    <input class=""/>
                </span>
            </div>
            <table class="table" cellspacing="0px">
                <tr class="ltr">
                    <th class="td2">-</th>
                    <th v-for="(tabHead,i) in tabHeads" :key="i">{{tabHead}}</th>
                </tr>
                <tbody v-for="(user,i) in 10" :key="i">
                    <tr :class="{'ltr': true,'ltrBackColor': i % 2 === 0}" @load="trStyleChoose(i)">
                        <td class="td2">√</td>
                        <td v-for="(field, j) in fields" :key="j">
                            {{users[field]}}
                        </td>
                        <td>删除 修改</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="chooseUsers">
            <div class="baseCard boxTitle">已选中用户</div>
            <div class="baseCard userCard" v-for="(it,i) in 3" :key="i"></div>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import actButton from '@/components/ActButton.vue'

const router = useRouter()
let tabHeads = ref(['用户名','姓名','手机','所属角色','账号状态','创建时间','修改时间','操作'])
let fields = ref(['username','name','phone','roles','state','createTime','updateTime'])
let users = ref(
    {
        username: 'zym666',
        name: '朱大萌',
        phone: '1008611',
        roles: '普通管理员,运维管理员,牛马管理员',
        state: '正常',
        createTime: '2024-03-21',
        updateTime: '2024-04-21'
    }
)
function saveUser(){

}
// 指定按钮动态边框和文字颜色
let buttonColor = ref('#4361ee')
</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';

.userManngerAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: 0 3vw;
    .funTitle{
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 2vh;
        margin-bottom: 4vh;
        font-size: 12px;
        font-weight: 550;
        color: rgb(36,47,87);
    }
    .tableBox{
        width: 74%;
        max-height: 78vh;
        padding: 1vh 2vw;
        .tableFuns{
            width: 100%;
            margin: 1vh 0;
            .actBtn{
                margin-right: 1vw;
            }
        }
        .table{
            box-shadow: 0px 0px 2px #928c8c64;
            width: 100%;
            // height: 90%;
            // border: #000 1px solid;
            border-collapse: collapse;
            // justify-content: center;
            .ltr{
                // min-height: 5vh;
                // border: #000 1px solid;
                // color: rgb(136,136,136);
                color: rgb(36,47,87);
                width: 100%;
                font-size: 9px;
                text-align: center;
                th{
                    max-height: 2vh;
                    border: rgb(236,239,246) 1px solid;
                    // background: rgb(220,231,255);
                }
                td{
                    padding: 0 0;
                    height: 5vh;
                    border: rgb(236,239,246) 1px solid;
                    .sp{
                        width: 100%;
                        height: 100%;
                    }
                }
                .td2{
                    padding: 0 0;
                    // height: 100%;
                    width: 2vw;
                    border: rgb(236,239,246) 1px solid;
                }
            }
            .ltrBackColor{
                background: rgb(250,250,250);
            }
        }
    }
    .chooseUsers{
        width: 15vw;
        .boxTitle{
            padding: 0.5vh 0;
            text-align: center;
            font-size: 10px;
            font-weight: 550;
            color: rgb(36,47,87);
        }
        .userCard{
            min-height: 22.42vh;
            margin: 3vh 0;
        }
    }
}
.baseCard{
    background: #FFF;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #928c8c64;
}
</style>