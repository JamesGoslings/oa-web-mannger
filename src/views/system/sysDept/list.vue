<template>
    <div class="deptAll">
        <div class="funTitle">部门列表</div>
        <div class="baseCard" >
            6
        </div>
    </div>
   
  </template>
   
<script setup>

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
}
</style>