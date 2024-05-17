<template>
    <div class="recordAll">
        <div class="funTitle">考勤打卡率统计</div>
        <div class="funAll">
            <el-card class="imgShow" shadow="hover">
                <div class="myBar">
                   <span>{{`最近${chooseDay}天打卡率`}}</span>
                   <SelectDaysBar @change-days="getDays" />
                </div>
                <div autoresize ref="lineImg" id="lineImg"></div>
            </el-card>
            <div class="funTitle">考勤详细记录</div>
            
            <!-- 部门打卡率统计 -->
            <el-card class="statistic" shadow="hover">
                <div class="myBar">
                    <div>部门打卡率统计</div>
                    <SelectDaysBar @change-days="getDeptDays" />
                </div>
                <div autoresize ref="circleImg" id="circleImg"></div>
            </el-card>
            <el-card class="statistic" shadow="hover">

            </el-card>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { listRadiusByDays } from '@/api/attendance'
import { choreDateStr } from '@/utils/stringUtil'
import SelectDaysBar from '@/components/SelectDaysBar.vue'


// 更新部门环形统计图信息
function getDeptDays(days){
    
}

// 获取展示打开率的天数
let chooseDay = ref(7)
function getDays(days){
    chooseDay.value = days
    getRadiusList()
}

// 获取环形图的DOM对象
let circleImg = ref(null)
// 获取折线图的DOM对象
let lineImg = ref(null)

// 同步环形图数据
function getCircleEcharts(){
    const circleDom = echarts.init(circleImg.value)
    circleDom.setOption(
        {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                // bottom: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '部门打卡率',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    // padAngle: 5,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        }
    )
}

// 加载折线图数据
function setEchartsData(data){
    let radius = []
    let xAxisData = []
    for(let i = data.length -1 ;i >= 0;i--){
        let item = data[i]
        radius.push(item.recordRadius)
        xAxisData.push(choreDateStr(item.clockInRecordDate))
    }
    getLineEcharts(xAxisData,radius)
}
// 同步折线图数据
function getLineEcharts(xAxisData,radius){
    const lineDom = echarts.init(lineImg.value)
    lineDom.setOption(
        {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {},
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        title: {zoom: '区域缩放',back: '区域缩放还原'}
                    },
                    dataView: { readOnly: false ,title: '数据展示', lang:['数据视图', '关闭', '刷新'] },
                    magicType: { type: ['line', 'bar'],title: { line: '切换为折线图',bar: '切换为柱形图'} },
                    // restore: {title: '重置'},
                    saveAsImage: {title: '下载图表'}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: 
            [
                {
                    name: '打卡率',
                    type: 'line',
                    data: radius,
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max' },
                            { type: 'min', name: 'Min' }
                        ]
                    },
                    markLine: {
                        data: [{ type: 'average', name: 'Avg' }]
                    }
                }
            ]
        }
    )
}
// 获取打卡率
const getRadiusList = async()=>{
    let {data} = await listRadiusByDays(chooseDay.value - 1)
    console.log(data)
    setEchartsData(data)
}
onMounted(()=>{
    getLineEcharts()
    getRadiusList()
    getCircleEcharts()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';

.recordAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .funAll{
        width: 100%;
        @include flex-box;
        justify-content: space-between;
        .imgShow{
            width: 100%;
            #lineImg{
                width: 100%;
                height: 50vh;
            }
        }
        .statistic{
            margin-bottom: 10vh;
            width: 48%;
            height: 50vh;
            #circleImg{
                width: 100%;
                height: 50vh;
            }
        }
    }
}
</style>