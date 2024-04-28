<template>
    <div class="treeAll" v-for="(menu,i) in menuList" :key="i">
        <div v-if="!menu.hidden">
            <div class="menuBar" :style="{background: backColors[i]}" @click="routerPash(menu.path)">
                <div class="menuOne" :style="{paddingLeft: floor + 'vw',background: backColors[i],color: clickOtherColors[i]}" @click="changeStyle(i,menu,menuList)"
                @mouseenter="backColors[i] = actStyle.backColor" @mouseleave="resetColor(i,menu)">
                    <div class="msg">
                        <span class="iconfont menuIco" v-html="menu.meta.icon"></span>
                        <span class="icoText">{{menu.meta.title}}</span>
                    </div>
                    <span v-if="menu.alwaysShow">
                        <div class="iconfont chooseIco" :style="{marginRight: floor + 'vw'}" v-if="!isChoose[i]">&#xe600;</div>
                        <div class="iconfont chooseIco" :style="{marginRight: floor + 'vw'}" v-else style="-moz-transform: rotate(90deg);-webkit-transform: rotate(90deg);">&#xe600;</div>
                    </span>
                </div>
                <span class="tip" :style="{background: clickOtherColors[i]}"></span>
            </div>

                <Tree v-if="menu.alwaysShow"
                :menuList = "menu.children" :floor="floor + 1" :parentChoose="hasChoose"></Tree>

        </div>
    </div>
</template>

<script setup>
import Tree from '@/components/TreeMenu.vue'
import {useRouter} from 'vue-router'
import { usePathStore } from '@/store/pathStore';
import { getCurrentInstance } from 'vue'

const router = useRouter()

// 传入的二级及以下的菜单
let props = defineProps({
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
    },
    parentChoose: {
        type: Boolean,
        default(){
			return false
		}
    }
})
// 判断当前菜单栏是否被选中
let isChoose = ref([false,false])
// 判断菜单栏鼠标经过时背景色
let backColors = ref([])
backColors.value.length = 10
// 判断字体和tip选中时的颜色
let clickOtherColors = ref([''])
// 经过或选中时的样式
const actStyle = ref({
    // color: 'rgb(249,236,221)'
    backColor: 'rgb(252,245,237)',
    otherColor: 'rgb(234,123,54)'
})
// 鼠标移走后重置颜色
function resetColor(i,menu){
    if(!isChoose.value[i] ) {
        backColors.value[i] = ''
    }
}
// 判断本级目录有无被选中的无子级的菜单栏
let hasChoose = ref(false)
// 选中后的样式操作
function changeStyle(i,menu,menuList){
    isChoose.value[i] = !isChoose.value[i]
    usePathStore().isChoose = ! usePathStore().isChoose
    // 选中状态
    if(isChoose.value[i]){
        // TODO 保证没有子级的菜单栏只有一个可以获取选中样式
        // 有子级，直接给选中样式
        if(menu.alwaysShow){
            backColors.value[i] = actStyle.value.backColor
            clickOtherColors.value[i] = actStyle.value.otherColor
        }else{
            // 没有子级的菜单共享选中样式
            // 清空其他同级菜单栏的样式
            for(var j = 0;j < menuList.length;j++){
                if(!menuList[j].alwaysShow && j !== i){
                    backColors.value[j] = ''
                    clickOtherColors.value[j] = ''
                    isChoose.value[j] = false
                }
            }
            isChoose.value[i] = true
            backColors.value[i] = actStyle.value.backColor
            clickOtherColors.value[i] = actStyle.value.otherColor
            // 用于清空兄弟级下面的子级的样式
            hasChoose.value = true
            emitMitt(menu.path)
        }
    }else{
        backColors.value[i] = ''
        clickOtherColors.value[i] = ''
    }
}
// 通过全局事件让其他组件的无子级菜单栏也清空样式
const cxt  = getCurrentInstance() //相当于Vue2中的this
const bus = cxt.appContext.config.globalProperties.$bus
const emitMitt = function(path){
    console.log(path)
    bus.emit('chooseEvent',path)
}
onMounted(()=>{
    bus.on('chooseEvent',(path)=>{
        clearStyle(path)
    })
})
function clearStyle(path){
    for(var j = 0;j < props.menuList.length;j++){
        if(!props.menuList[j].alwaysShow && props.menuList[j].path != path){
            backColors.value[j] = ''
            clickOtherColors.value[j] = ''
            isChoose.value[j] = false
        }
    }
}
onBeforeUnmount(()=>{
    bus.off('chooseEvent')
})


// 加载指定路由
function routerPash(path){
    router.push(path)
}
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.treeAll{
    width: 100%;
    font-size: 10px;
    // background: #F5F5F5;
    .menuBar{
        width: 100%;
        height: 5vh;
        display: flex;
        align-items: center;
        .tip{
            width: 0.3vw;
            height: 60%;
            // background: rgb(234,123,54);
            border-radius: 2px;
        }
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
                    font-size: 8px;
                }
            }
            .chooseIco{
                // margin-right: 1vw;
                font-size: 12px;
            }
        }
    }
}
</style>