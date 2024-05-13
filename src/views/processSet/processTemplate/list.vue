<template>
        <!-- <button style="margin-left: 30vw;margin-top: 10vh;" @click="exportXML()">点我</button> -->
    <div class="processTemplateAll">
        <div class="funTitle">审批模板列表</div>
        <div class="baseCard bpmnAll">
            <div class="bpmnFun">
                <el-button type="primary" round plain @click="exportXML()">导出流程图xml文件</el-button>
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
const containerEl = ref(null)
// 渲染图的modeler
const bpmnModeler = ref(null)
// 导出xml
function exportXML() {
  bpmnModeler.value.saveXML({ format: true }, function(err, xml) {
    if (err) {
      console.error('导出错误:', err);
    } else {
      console.log('导出的XML:', xml);
      // 这里可以将xml发送到服务器或者进行其他操作
    }
  });
}
onMounted(() => {
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
            padding: 0 1%;
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