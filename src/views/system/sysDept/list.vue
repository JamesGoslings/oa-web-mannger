<template>
    <div class="deptAll">
        <div class="funTitle">部门列表</div>
        <div class="baseCard" >
            <div autoresize ref="pieone" id="pieone"></div>
        </div>
    </div>
   
  </template>
   
<script setup>
import * as echarts from 'echarts'

const pieone = ref(null)
// 定义方法
function getEcharts(){
// 初始化Dom元素进行绘图
    const PieDome = echarts.init(pieone.value)

    PieDome.setOption({
        // 图例设置
        legend: {
            top: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 系列数据设置
        series: [{
            name: 'Nightingale Charts', // 系列名称
            type: 'pie', // 图表类型为饼图
            radius: [30, 150], // 饼图的内外半径
            center: ['50%', '50%'], // 饼图的中心位置
            roseType: 'area', // 玫瑰图类型为区域玫瑰图
            itemStyle: {
                borderRadius: 8 // 数据项的样式设置
            },
            // 数据
            data: [
                { value: 40, name: 'rose 1' },
                { value: 38, name: 'rose 2' },
                { value: 32, name: 'rose 3' },
                { value: 30, name: 'rose 4' },
                { value: 28, name: 'rose 5' },
                { value: 26, name: 'rose 6' },
                { value: 22, name: 'rose 7' },
                { value: 18, name: 'rose 8' }
                ]
            }]
        })

    // PieDome.setOption({
    //     title: {
    //         text: 'Nightingale Chart',
    //         subtext: 'Fake Data',
    //         left: 'center'
    //     },
    //     tooltip: {
    //         trigger: 'item',
    //         formatter: '{a} <br/>{b} : {c} ({d}%)'
    //     },
    //     legend: {
    //         left: 'center',
    //         top: 'bottom',
    //         data: [
    //         'rose1',
    //         'rose2',
    //         'rose3',
    //         'rose4',
    //         'rose5',
    //         'rose6',
    //         'rose7',
    //         'rose8'
    //         ]
    //     },
    //     toolbox: {
    //         show: true,
    //         feature: {
    //         mark: { show: true },
    //         dataView: { show: true, readOnly: false },
    //         restore: { show: true },
    //         saveAsImage: { show: true }
    //         }
    //     },
    //     series: [
    //     {
    //         name: 'Radius Mode',
    //         type: 'pie',
    //         radius: [20, 140],
    //         center: ['25%', '50%'],
    //         roseType: 'radius',
    //         itemStyle: {
    //             borderRadius: 5
    //         },
    //         label: {
    //             show: false
    //         },
    //         emphasis: {
    //             label: {
    //             show: true
    //             }
    //         },
    //         data: [
    //             { value: 40, name: 'rose 1' },
    //             { value: 33, name: 'rose 2' },
    //             { value: 28, name: 'rose 3' },
    //             { value: 22, name: 'rose 4' },
    //             { value: 20, name: 'rose 5' },
    //             { value: 15, name: 'rose 6' },
    //             { value: 12, name: 'rose 7' },
    //             { value: 10, name: 'rose 8' }
    //         ]
    //     },
    //         {
    //         name: 'Area Mode',
    //         type: 'pie',
    //         radius: [20, 140],
    //         center: ['75%', '50%'],
    //         roseType: 'area',
    //         itemStyle: {
    //             borderRadius: 5
    //         },
    //         data: [
    //             { value: 30, name: 'rose 1' },
    //             { value: 28, name: 'rose 2' },
    //             { value: 26, name: 'rose 3' },
    //             { value: 24, name: 'rose 4' },
    //             { value: 22, name: 'rose 5' },
    //             { value: 20, name: 'rose 6' },
    //             { value: 18, name: 'rose 7' },
    //             { value: 16, name: 'rose 8' }
    //         ]
    //         }
    //     ]
    //     })
};

// 挂载后调用
onMounted(()=>{
    getEcharts()
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
}
</style>