<!-- 表单设计 -->
<template>
    <div class="otherAll">
        <div class="funTitle">{{`正在设置 “${thisTemplate.name}” 的表单`}}</div>
        <div class="funs">
            <ActButton txt="退出" actColor="rgb(234,123,54)" backColor="rgb(252,245,237)" @click="goBackPage()" />
            <ActButton txt="保存并退出" @click="saveAndQuit()" />
        </div>
        <!-- <el-button type="primary" round plain @click="getMyJson()">点我</el-button> -->
        <fc-designer ref="designer" class="myForm" style="height: 80vh"/>
    </div>
</template>

<script setup>
import ActButton from '@/components/ActButton.vue';
import {getProcessTemplateById,updateProcessTemplate} from '@/api/processTemplate'
import{useTips,useSimpleConfirm} from '@/utils/msgTip'
import { useRoute,useRouter } from 'vue-router'


const router = useRouter()
// 直接返回上一个路由
function goBackPage(){
    useSimpleConfirm('你确定要直接退出吗').then(()=>{
        router.go(-1)
    })
}
// 保存并退出
function saveAndQuit(){
    useSimpleConfirm('你确定要保存表单吗？').then(async ()=>{
        await updateFormMsg()
        // router.go(-1)
    })
}
// 保存的具体方法
const updateFormMsg = async()=>{
    // 装表单数据
    thisTemplate.value.formProps = JSON.stringify(designer.value.getRule())
    thisTemplate.value.formOptions = JSON.stringify(designer.value.getOption())
    // 发请求
    let data = await updateProcessTemplate(thisTemplate.value)
    useTips(`成功保存 ${thisTemplate.value.name} 的表单`,data)
}
// 表单的dom对象
let designer = ref(null)
function getMyJson(){
    //FcDesigner 生成的`JSON`
    const FcDesignerRule = designer.value.getRule()
    //FcDesigner 生成的`options`
    const FcDesignerOptions = designer.value.getOption()
    console.log('=========6=======>>>>>')
    console.log(FcDesignerRule)
    console.log(FcDesignerOptions)
    console.log('=========6=======>>>>>')
}
const route = useRoute()
// 存正在修改的模板对象
let thisTemplate = ref({})
// 获取当前模板
const getThisTemplate = async()=>{
    let{data} = await getProcessTemplateById(route.query.templateId);
    thisTemplate.value = data
}
// 初始化表单内容
function initForm(){
    designer.value.setRule(thisTemplate.value.formProps)
    designer.value.setOption(thisTemplate.value.formOptions)
}
onMounted(()=>{
    getThisTemplate().then(()=>{
        initForm()
    })
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.otherAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .funs{
        width: 100%;
        background: #FFF;
        padding: 1vh;
        @include flex-box;
        justify-content: left;
    }
    .myForm{
        box-shadow: $common-box-shodow;
        width: 80%;
    }
}

</style>