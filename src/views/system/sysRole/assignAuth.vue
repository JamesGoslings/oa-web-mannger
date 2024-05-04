<!-- 分配权限页面 -->
<template>
    <div class="assignAllSty">
        <div class="funTitle" style="justify-content: center;">{{`正在为 “${role.roleName}” 分配权限`}}</div>
        
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
let role = ref({})
onMounted(() => {
    // 拿到对应角色的参数
    role.value.id = route.query.id
    role.value.roleName = route.query.roleName
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.assignAllSty{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;

}
</style>