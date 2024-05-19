<!-- 在线流程图设计 -->
<template>
    <div class="processTemplateAll">
        <div class="funTitle">{{`正在设计 “${thisTemplate.name}” 模板的流程图`}}</div>
        <div class="baseCard bpmnAll">
            <div class="bpmnFun">
                <ActButton txt="退出" actColor="rgb(234,123,54)" backColor="rgb(252,245,237)" @click="goBackPage()" />
                <ActButton txt="保存" @click="saveAndQuit()" />
                <!-- <el-button type="primary" round plain @click="exportXML()">导出流程图xml文件</el-button> -->
            </div>
            <div class="myFrame">
                <div id="container"></div>
                <div id="js-properties-panel" class="panel"></div>
            </div>
            
        </div>
    </div>
    
</template>


<script setup>
import ActButton from '@/components/ActButton.vue';
import{useTips,useSimpleConfirm} from '@/utils/msgTip'
import {getProcessTemplateById} from '@/api/processTemplate'
import { useRoute,useRouter } from 'vue-router'
import { onMounted, markRaw } from 'vue';
 // bpmn-js相关
 import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
 import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
 import BpmnModeler from 'bpmn-js/lib/Modeler';
 // bpmn-js-properties-panel相关
 import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
 import propertiesPanelModule from 'bpmn-js-properties-panel'
 import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
 import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
// 引入汉化js
import translate from '@/utils/bpmn/translate.js'

const router = useRouter()
// 直接返回上一个路由
function goBackPage(){
    useSimpleConfirm('你确定要直接退出吗').then(()=>{
        router.go(-1)
    })
}
// 保存并退出
function saveAndQuit(){
    useSimpleConfirm(`你确定要保存 “${thisTemplate.value.name}” 模板的流程图吗？`).then(async ()=>{
        await updateFormMsg()
        // router.go(-1)
    })
}
// 加载汉化包
let customTranslateModule = {
    translate: ['value', translate]
}
const containerEl = ref(null)
// 渲染图的modeler
const bpmnModeler = ref(null)
// 导出xml
function exportXML() {
  bpmnModeler.value.saveXML({ format: true }, function(err, xml) {
    if (err) {
      console.error('导出错误:', err);
    } else {
      let myXml = xml.replace(/camunda.org\/schema\/1.0\/bpmn/ig,"activiti.org/bpmn").replace(/camunda/ig,"activiti");
      console.log('导出的XML:', myXml);
      
    }
  });
}

const route = useRoute()
// 存正在修改的模板对象
let thisTemplate = ref({})
// 获取当前模板
const getThisTemplate = async()=>{
    let{data} = await getProcessTemplateById(route.query.templateId);
    thisTemplate.value = data
}

onMounted(() => {
    getThisTemplate()
    containerEl.value = document.getElementById('container');
    bpmnModeler.value = markRaw(new BpmnModeler({
        container: containerEl.value,
        // 添加控制板
        propertiesPanel: {
            parent: '#js-properties-panel'
        },
        // 右侧属性面板
        additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule,
            customTranslateModule
        ],
        moddleExtensions: {
            camunda: camundaModdleDescriptor
        }
    }));
    bpmnModeler.value.createDiagram(() => {
        bpmnModeler.value.get('canvas').zoom('fit-viewport');
    });
})
</script>
  
<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';

.processTemplateAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .bpmnAll{
        width: 100%;
        height: 80vh;
        margin-bottom: 15vh;
        .bpmnFun{
            width: 98%;
            height: 5vh;
            background: #FFF;
            @include flex-box;
            padding: 0.5vh 1%;
            justify-content: left;
        }
        .myFrame{
            width: 100%;
            height: 100%;
            @include flex-box;
            justify-content: space-between;
            flex-wrap: nowrap;
            background-image: url('/src/assets/img/bpmnBack.jpg');
            #container{
                height: 100%;
                width: 90%;
                z-index: 8;
            }
            .panel{
                width: 15vw;
                height: 100%;
                overflow: auto;
                overflow-x: hidden;
                z-index: 8;
                border-left: #000 1px solid;
            }
            :deep(){
                .djs-palette,.djs-palette-entries{
                    min-width: none;
                    width: 3vw;
                    height: 100%;
                    left: 0;
                    top: 0;
                }
                .bjs-powered-by{
                    svg{
                        height: 0;
                        width: 0;
                    }
                }
            }
        }
        
    }
}
</style>