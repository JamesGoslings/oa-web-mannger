<template>
    <div class="treeAll" v-for="(menu,i) in menuList" :key="i">
        <div :style="{background: backColors[i]}">
            <div class="menuOne" :style="{paddingLeft: floor + 'vw',background: clickColors[i]}" @click="changeStyle(i,menu)"
            @mouseenter="backColors[i] = actStyle.color" @mouseleave="backColors[i] = '#FFF'">
                <div class="msg">
                    <span class="iconfont menuIco" v-html="menu.icon"></span>
                    <span class="icoText">{{menu.name}}</span>
                </div>
                <span v-if="menu.children !== null && menu.children !== undefined && menu.children.length !== 0">
                    <div class="iconfont chooseIco" :style="{marginRight: floor + 'vw'}" v-if="!isChoose[i]">&#xe600;</div>
                    <div class="iconfont chooseIco" :style="{marginRight: floor + 'vw'}" v-else style="-moz-transform: rotate(90deg);-webkit-transform: rotate(90deg);">&#xe600;</div>
                </span>
            </div>
        </div>
        <Tree v-if="isChoose[i] && menu.children !== null && menu.children !== undefined && menu.children.length !== 0" 
        :menuList = "menu.children" :floor="floor + 1"></Tree>
    </div>
</template>

<script setup>
import Tree from '@/components/TreeMenu.vue'

// 传入的二级及以下的菜单
defineProps({
	menuList: {
		type: Array,
		default(){
			return []
		}
	},
    floor: {
        type: Number,
        default(){
			return 0
		}
    }
})
// 判断当前菜单栏是否被选中
let isChoose = ref([false,false])
// 判断菜单栏鼠标经过时背景色
let backColors = ref([''])
// 判断菜单栏选中时的背景色
let clickColors = ref([''])
// 经过或选中时的样式
const actStyle = ref({
    color: 'rgb(249,236,221)'
})

// 选中后的样式操作
function changeStyle(i,menu){
    isChoose.value[i] = !isChoose.value[i]
    // 选中状态
    if(isChoose.value[i]){
        // TODO 保证没有子级的菜单栏只有一个可以获取选中样式
        // 有子级，直接给选中样式
        if(menu.children !== null && menu.children !== undefined && menu.children.length !== 0){
            clickColors.value[i] = actStyle.value.color
        }else{
            // 没有子级共享选中样式
            
        }
    }else{
        clickColors.value[i] = ''
    }
}
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.treeAll{
    width: 100%;
    font-size: 10px;
    // background: #F5F5F5;
    .menuOne{
        width: 100%;
        height: 5vh;
        color: rgb(136,136,136);
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-left: 1vw;
        .msg{
            display: flex;
            align-items: center;
            .menuIco{
                margin-left: 1vw;
                font-size: 15px;
            }
            .icoText{
                margin-left: 1vw;
                font-size: 9px;
            }
        }
        .chooseIco{
            // margin-right: 1vw;
            font-size: 12px;
        }
    }
}
</style>