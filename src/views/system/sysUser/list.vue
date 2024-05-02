<!-- 用户管理页面 -->
<template>
    <div class="userManngerAll">
        <div class="funTitle">用户表</div>
        <div class="baseCard tableBox">
            <div class="tableFuns">
                <actButton class="actBtn" txt='+添加' actColor="rgb(60,118,244)"></actButton>
                <actButton class="actBtn" txt='&#xe614; 重置' actColor="rgb(234,123,54)" backColor="rgb(252,245,237)"></actButton>
                <myInputBar class="myIpt" text="搜索用户" fontColor="rgb(9,82,200)" holderColor="rgb(211,227,253)"></myInputBar>
            </div>
            <table class="table" cellspacing="0px">
                <tr class="ltr">
                    <th class="td2">-</th>
                    <th v-for="(tabHead,i) in tabHeads" :key="i">{{tabHead}}</th>
                </tr>
                <tbody v-for="(user,i) in users" :key="i">
                    <tr :class="{'ltr': true,'ltrBackColor': i % 2 === 0}" @load="trStyleChoose(i)">
                        <td class="td2">
                            <!-- <input class="checkBoxStyle" type="checkbox" @click="chooseUsers()"
                            v-model="user.isChoose" style="width: 1vw;user-select: none;"/> -->
                            <el-checkbox v-model="choices[user.userId]"/>
                        </td>
                        <td v-for="(field, j) in fields" :key="j">
                            <span v-if="field !== 'state'">{{user[field]}}</span>
                            <span v-else>
                                <MySwitch right-back-color="rgb(244,249,255)" wrong-back-color="rgb(252,245,237)" 
                                right-font-color="rgb(60,118,244)" wrong-font-color="rgb(234,123,54)" />
                            </span>
                        </td>
                        <td>
                            <baseButton content="&#xe71a;" mainBackColor="rgb(244,249,255)" fontColor="rgb(60,118,244)" style="margin-right: 1vw;"/>
                            <baseButton mainBackColor="rgb(252,245,237)" fontColor="rgb(234,123,54)"/>
                        </td>
                    </tr>
                </tbody>

            </table>
            <div class="usePage" id="myPage">
                <el-pagination
                class="page"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[2, 5, 10, 15]"
                :small="small"
                :disabled="disabled"
                layout="sizes, prev, pager, next, jumper"
                :total="pageTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <div class="chooseUsers">
            <div class="baseCard boxTitle">已选中用户</div>
            <div class="baseCard userCard" v-for="(user,i) in choseUsers" :key="i">
                <img class="avatar" :src="user.avatarUrl" />
                <div class="msg">
                    <div class="name">{{user.name}}</div>
                    <div>{{`部门：${user.dept}`}}</div>
                    <div>{{`岗位：${user.post}`}}</div>
                    <div>{{`电话号码；${user.phone}`}}</div>
                    <div>
                        <baseButton style="margin: 5px 5px;" content="&#xe71a;" main-back-color="rgb(60,118,244)" />
                        <baseButton style="margin: 5px 5px;" main-back-color="rgb(234,123,54)" />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import actButton from '@/components/ActButton.vue'
import myInputBar from "@/components/MyInputBar.vue"
import baseButton from '@/components/BaseIconButton.vue'
import MySwitch from '@/components/MySwitch.vue'
import {useRouter} from 'vue-router'
import {getPageUsers,getAllUserMsg} from '@/api/user'
import { onMounted, watch } from 'vue'

const router = useRouter()
let tabHeads = ref(['用户名','姓名','手机','所属角色','账号状态','创建时间','修改时间','操作'])
let fields = ref(['username','name','phone','roleList','state','createTime','updateTime'])
let users = ref([
    {
        username: 'zym666',
        name: '朱大萌',
        phone: '1008611',
        roleList: '普通管理员,运维管理员,牛马管理员',
        state: '正常',
        createTime: '2024-03-21',
        updateTime: '2024-04-21'
    }]
)
function saveUser(){

}
// 指定按钮动态边框和文字颜色
let buttonColor = ref('#4361ee')
// let chooseBoxs = ref([])
let switchValues = ref([])

// 存储被选中的用户
let choseUsers = ref([])
// 获取选中的用户的信息
function chooseUsers(){
    let tempList = []
    let t = 0;
    for(var j = 0;j < allUsers.value.length;j++){
        // let is = users.value[j].isChoose
        // 存选中值信息
        let is = choices.value[allUsers.value[j].userId];
        if(is && is !== undefined){
            // 头像的设定
            let avatar = allUsers.value[j].avatarUrl
            if(avatar == null || avatar === ''){
                allUsers.value[j].avatarUrl = '/src/assets/img/default_avatar.png'
            }
            tempList[t++] = allUsers.value[j]
        }
    }
    choseUsers.value = tempList;
    console.log('==============VVVVVV=======================')
    for (const key in choices.value) {
        console.log(key)
        console.log(choices.value[key])
    }
    console.log('666666666666=============>>>>')
    console.log(choices.value[6])
    console.log('==============VVVVVV=======================')
}
// 用来存选中值(userId和isChoose进行映射),保证在重新拉请求之后选中值不会重置
let choices = ref({})

watch(
    choices.value,
    (newValue,oldValue)=>{
        chooseUsers()
    },
    {deep: true}
)
// 绑定当前页数
let currentPage = ref(1)
// 每页显示的最多数目
let pageSize = ref(5)
// 总共的数目
let pageTotal = ref(10)
const getPages = async()=>{
    let {data} = await getPageUsers(currentPage.value,pageSize.value,{keyword:''});
    users.value = data.records
    pageTotal.value = data.total
    console.log('==============Data==================')
    console.log(users.value)
    console.log('==============Data==================')
}
// 页数改变时加载一次分页数据
function handleCurrentChange(){
    getPages(currentPage.value,pageSize.value,{keyword:''})
}
// 单页面最大数目改变时再加载
function handleSizeChange(){
    getPages(currentPage.value,pageSize.value,{keyword:''})
}
// 存拿到的所有用户信息
let allUsers = ref([])
const getAll = async()=>{
    let {data} = await getAllUserMsg();
    allUsers.value = data
    // 将本次拿到的所有userId对应的chice都映射成false
    for(var i = 0;i < data.length;i++){
        if(!choices.value[data[i].userId]){
            choices.value[data[i].userId] = false
        }
    }
}
onMounted(()=>{
    console.log('进入onMounted')
    // 初始时加载一次分页的数据
    getPages()
    getAll()

})
</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';

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
        font-size: $title-font-size;
        font-weight: 550;
        color: rgb(36,47,87);
    }
    .tableBox{
        width: 74%;
        // max-height: 78vh;
        padding: 1vh 2vw;
        .tableFuns{
            width: 100%;
            margin-top: 1vh;
            margin-bottom: 2vh;
            display: flex;
            align-items: center;
            user-select: none;
            .actBtn{
                margin-right: 1vw;
            }
            .myIpt{
                width: 40vw;
                height: 4vh;
                box-shadow: 0px 0px 1px #928c8c64;
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
                font-size: $common-font-size;
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
        .usePage{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .page{
                $page-font-size: $common-font-size;
;
                padding: 0 0;
                margin: 0 0;
                font-size: $page-font-size;
                :deep(){
                    .el-select--default{
                        width: 6vw;
                        font-size: $page-font-size;
                    }
                    .el-tooltip__trigger{
                        font-size: $page-font-size;
                        height: 4vh;
                        min-height: 1vh;
                    }
                    .el-select__suffix{
                        .el-select__icon{
                            font-size: $page-font-size;
                        }
                    }
                    .btn-prev,.btn-next{
                        .el-icon{
                            font-size: $page-font-size;
                        }
                    }
                    .el-pager{
                        .number{
                            font-size: $page-font-size;
                        }
                        .el-icon{
                            font-size: $page-font-size;
                        }
                    }
                    .el-pagination__jump{
                        .el-pagination__goto{
                            font-size: 0px;
                        }
                        .el-input__wrapper{
                            height: 4vh;
                            font-size: $page-font-size;
                            padding: 0 0;
                        }
                    }
                }
                
            }
        }
    }
    .chooseUsers{
        width: 15vw;
        .boxTitle{
            padding: 0.5vh 0;
            text-align: center;
            font-size: $common-font-size;
            font-weight: 550;
            color: rgb(36,47,87);
        }
        .userCard{
            min-height: 22.42vh;
            margin: 3vh 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            .avatar{
                margin-top: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
            .msg{
                width: 100%;
                text-align: center;
                user-select: none;
                font-size: $common-font-size - 2px;
                color: #878D98;
                font-family: '幼圆';
                .name{
                    font-size: $title-font-size;
                    font-weight: bolder;
                    color: black;
                }
            }
        }
    }
}
.baseCard{
    background: #FFF;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #928c8c64;
}
</style>