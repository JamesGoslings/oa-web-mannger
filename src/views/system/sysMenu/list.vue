<template>
    <div class="menuPageAll">
        <div class="funTitle">菜单列表</div>
        <div class="funs">
            <div class="funBar">
                <myInputBar back-color="rgb(229,231,235)" font-color="rgb(36,47,87)"
                radius="35px" holder-color="rgb(183,190,200)" style="height: 4vh;width: 55vw;" />
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
import { getAllTreeMenus } from '@/api/menu'
import { onMounted } from "vue";

let menus = ref({})
console.log(menus.value)

const getAllNodes = async()=>{
    let {data} = await getAllTreeMenus()
    menus.value = data
    console.log('==========>>>>')
    console.log(data)
    console.log('==========>>>>')
}

onMounted(async ()=>{
    await getAllNodes()
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