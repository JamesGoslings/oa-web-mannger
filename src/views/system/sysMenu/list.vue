<template>
    <div class="menuPageAll">
        <div class="funTitle">菜单列表</div>
        <div class="funs">
            <div class="funBar">
                <myInputBar back-color="rgb(229,231,235)" font-color="rgb(36,47,87)"
                radius="35px" holder-color="rgb(183,190,200)" style="height: 4vh;width: 55vw;"
                @on-enter="handleEnter" v-model="iptValue" text="搜索菜单，请输入菜单名" />
                <el-button type="primary" style="border-radius: 50px;">＋ 新增菜单</el-button>
            </div>
            <div class="funTreeList">
                <div>
                    <treeMenuList :menuDataList="menus" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue"
import treeMenuList from "@/components/TreeMenuList.vue"
import { useUserStore } from '@/store/userStore';
import { getAllTreeMenus,getMenuListByKeyword } from '@/api/menu'
import { isSpace } from '@/utils/stringUtil'
import { onMounted } from "vue";


// 接收输入关键字
let iptValue = ref("")
// 存拿到的树型菜单列表
let menus = ref({})
console.log(menus.value)

// 条件查询
const getMenusByKey = async()=>{
    let {data} = await getMenuListByKeyword(iptValue.value);
    menus.value = data
}
function handleEnter(){
    console.log(iptValue.value)
    if(isSpace(iptValue.value)){
        getAllNodes().then(()=>{
            iptValue.value = ''
        })
        return
    }
    getMenusByKey().then(()=>{
        iptValue.value = ''
    })
}
// 获取所有菜单的树型列表
const getAllNodes = async()=>{
    let {data} = await getAllTreeMenus()
    menus.value = data
}


onMounted(async ()=>{
    await getAllNodes()
    // await getAllParentMenus()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.menuPageAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .funs{
        background: #FFF;
        width: 100%;
        padding: 2vh 1vw;
        .funBar{
            @include flex-box;
            justify-content: space-between;
            margin-bottom: 1vh;
        }
        .funTreeList{
            // padding: 1vh 2vw;
            box-shadow: 0px 0px 3px $box-shadow-color;
        }
    }
}
</style>