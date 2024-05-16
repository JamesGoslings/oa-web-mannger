<template>
    <div class="recordAll">
        <div class="funTitle">考勤记录</div>
        <div class="funAll">
            <el-card class="imgShow" shadow="hover">
                <div class="lineTitleBar">
                   <span>{{`最近${chooseDay}天打卡率`}}</span>
                   <el-select
                    v-model="chooseDay"
                    filterable
                    placeholder="选择岗位类型"
                    @change="getRadiusList()"
                    >
                        <el-option
                        v-for="(day,i) in chooseDaysStr"
                        :key="i"
                        :label="`近${day}天内`"
                        :value="day"
                        />
                    </el-select> 
                </div>
                <div autoresize ref="lineImg" id="lineImg"></div>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { listRadiusByDays } from '@/api/attendance'
import { choreDateStr } from '@/utils/stringUtil'

// 获取展示打开率的天数
let chooseDaysStr = ref([7,15,30])
let chooseDay = ref(7)

let lineImg = ref(null)
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
                    restore: {title: '重置'},
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
        .imgShow{
            width: 100%;
            .lineTitleBar{
                width: 100%;
                @include flex-box;
                justify-content: space-between;
                :deep(){
                    .el-select,.el-select__wrapper{
                        width: 10vw;
                    }
                }
            }
            #lineImg{
                width: 100%;
                height: 50vh;
            }
        }
    }
}
</style>