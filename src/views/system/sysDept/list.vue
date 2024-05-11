<template>
        <div class="deptAll">
            <div class="funTitle">部门列表</div>
            <div class="baseCard" style="height: 400px; width: 70vw;">
                <vue3-tree-org
                :data="treeData"
                :horizontal="horizontal"
                :collapsable="collapsable"
                :label-style="style"
                :node-draggable="true"
                :scalable="false"
                :only-one-node="onlyOneNode"
                :default-expand-level="1"
                :clone-node-drag="cloneNodeDrag"
                @on-contextmenu="onMenus"
                @on-node-click="onNodeClick"
                >
                    <!-- 节点内容 -->
                    <template v-slot="{node}">
                        <div class="tree-org-node__text node-label">
                            <div class="custom-content">{{node.$$data.name}}</div>
                            <div>部门人数：{{node.$$data.totalCount}}</div>
                        </div>
                    </template>
                    <!-- 展开按钮 -->
                    <template v-slot:expand="{node}">
                        <div>{{node.children.length}}</div>
                    </template>
                </vue3-tree-org>
            </div>
        </div>
</template>
<script setup>
import { getTreeDeptList } from '@/api/dept';
import { onMounted } from 'vue';

let treeData = ref({
    id:0,
    name:"牛马科技有限公司",
    children:[]
})

const getAllTreeDepts = async()=>{
    let {data} = await getTreeDeptList()
    treeData.value.children = data
    console.log(data)
}

onMounted(()=>{
    getAllTreeDepts()
})


let horizontal = ref(false)
let collapsable = ref(true)
let onlyOneNode = ref(true)
let cloneNodeDrag = ref(true)
let  expandAll = ref(true)
let style = ref({
    background: "#fff",
    color: "#5e6d82",
})

</script>
<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
#pieone{
    width: 50vw;
    height: 50vh;
}
.deptAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .tree-org-node__text {
        text-align: left;
        font-size: 14px;
        .custom-content {
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid currentColor;
        }
    }
}
</style>