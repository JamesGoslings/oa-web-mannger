<!-- 主体页面 -->
<template>
    <Header></Header>
    <Right></Right>
    <div class="layout">
    
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Right from '@/components/Right.vue'


</script>

<style lang="scss" scoped>
.layout{
    position: fixed;
	top: 0;
	left: 0;
	width: 100%;
    height: 100%;
	overflow: auto;
    background: rgb(244,247,252);
}
</style>