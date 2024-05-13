<template>
    <div class="containerBox" style="position: relative;">
        <div id="container" style="width: calc(100vw - 750px); height: calc(100vh - 150px);margin-left: 30vw;margin-top: 10vh; ">
        </div>
        <div id="js-properties-panel" class="panel"></div>
    </div>
</template>


<script setup> 
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

// 加载汉化包
let customTranslateModule = {
    translate: ['value', translate]
}
onMounted(() => {
    const containerEl = document.getElementById('container');
    const bpmnModeler = markRaw(new BpmnModeler({
        container: containerEl,
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
    bpmnModeler.createDiagram(() => {
        bpmnModeler.get('canvas').zoom('fit-viewport');
    });
})
</script>
  
<style>
.containerBox {
    height: calc(100vh - 160px);
    margin-top: 30px;
}
 
.containerBox #container {
    height: calc(100vh - 160px);
    border: 1px solid rgb(121, 121, 121);
}
 
.bpp-properties-panel [type=text] {
    box-sizing: border-box;
}
 
.panel {
    width: 400px;
    position: absolute;
    top: 1px;
    right: 1px;
    height: 100%;
    overflow: auto;
}
 
/* 右下角logo */
.bjs-powered-by {
    display: none;
}
</style>


















<!-- <template>
    <div class="processTemplateAll">
        <div class="funTitle">审批模板列表</div>
        <div class="baseCard bpmnAll">
            <div id="container"></div>
        </div>
    </div>



</template>

<script setup>
import { markRaw, onMounted } from 'vue';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';

let containerEl = ref(null)
let	bpmnModeler = ref(null)

function init() {
    containerEl.value = document.getElementById('container');
    // 加markRaw去除双向绑定作用域
    bpmnModeler.value = markRaw(new BpmnModeler({
        container: containerEl.value
    }));
    bpmnModeler.value.createDiagram(() => {
        bpmnModeler.value.get('canvas').zoom('fit-viewport');
    });
}
onMounted(()=>{
    init()
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
        #container{
            width: 100%;
            height: 100%;
        }
    }
}
</style> -->