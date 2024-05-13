<template>
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