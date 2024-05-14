<!-- 表单设计 -->
<template>
    <div class="otherAll">
        <div class="funTitle">{{`正在设置 “${thisTemplate.name}” 的表单`}}</div>
        <el-button type="primary" round plain @click="getMyJson()">点我</el-button>
        <fc-designer ref="designer" class="myForm" style="height: 80vh"/>
    </div>
</template>

<script setup>
import {getProcessTemplateById} from '@/api/processTemplate'
import { useRoute,useRouter } from 'vue-router'


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
    .myForm{
        box-shadow: $common-box-shodow;
        width: 80%;
        
    }
}

</style>