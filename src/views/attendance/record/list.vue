<template>
    <div class="recordAll">
        <div class="funTitle">考勤打卡率统计</div>
        <div class="funAll">
            <el-card class="imgShow" shadow="hover">
                <div class="myBar">
                   <span class="barTitle">{{`最近${chooseDay}天打卡率`}}</span>
                   <SelectDaysBar @change-days="getDays" />
                </div>
                <div autoresize ref="lineImg" id="lineImg"></div>
            </el-card>
            <div class="funTitle">考勤详细记录</div>
            
            <!-- 部门打卡率统计 -->
            <el-card class="statistic" shadow="hover">
                <div class="myBar">
                    <div class="barTitle">部门打卡率统计</div>
                    <div>
                        <el-button style="margin-right: 1vw;" @click="openDialog = true">选择部门</el-button>
                        <SelectDaysBar @change-days="getDeptDays" bar-width="7vw"  :chooseDaysStr="[1,7,15,30]" />
                    </div>
                </div>
                <div autoresize ref="circleImg" id="circleImg"></div>
            </el-card>

            <el-card class="statistic" shadow="hover" style="overflow: auto;">
                <div class="myBar">
                    <div class="barTitle">未打卡员工统计</div>
                    <div>
                        <!-- 打卡类型选择框 -->
                        <el-select
                        v-model="chooseType"
                        filterable
                        placeholder="选择打卡类型"
                        class="typeSelect"
                        style="width: 7vw;margin-right: 1vw;"
                        @change="getNotUsers()"
                        >
                            <el-option
                            v-for="(typeOne,i) in [{type: 0, label: '上班打卡'},{ type: 1,label: '下班打卡'}]"
                            :key="i"
                            :label="typeOne.label"
                            :value="typeOne.type"
                            />
                        </el-select>
                        <!-- 选择天数 -->           
                        <el-select
                        v-model="chooseUserDay"
                        filterable
                        placeholder="选择统计的日期"
                        style="width: 5vw;;margin-right: 1vw;"
                        @change="getNotUsers()"
                        >
                            <el-option
                            v-for="dayObj in myDays"
                            :key="dayObj.num"
                            :label="dayObj.label"
                            :value="dayObj.num"
                            />
                        </el-select> 
                        <!-- 部门选择框 -->
                        <el-select
                        v-model="chooseDeptId"
                        filterable
                        placeholder="选择员工部门"
                        class="userSelect"
                        style="width: 10vw;"
                        @change="getNotUsers()"
                        >
                            <el-option
                            v-for="(dept,i) in allDept"
                            :key="i"
                            :label="dept.name"
                            :value="dept.id"
                            />
                        </el-select>
                    </div>
                </div>
                <div>总计：{{notUsers.length}}人</div>
                <div class="userCard" v-for="user in notUsers" :key="user.id">
                    <el-avatar class="avatar" :src="getAvatar(user.avatarUrl)" />
                    <div class="userMsg">
                        <div class="name">{{user.name}}</div>
                        <div>{{user.post}}</div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 多选部门的对话框 -->
        <el-dialog v-model="openDialog" title="选择显示打卡率的部门（多选）" width="400"
            draggable :close-on-click-modal="false">
                <el-checkbox-group v-model="chooseDeptIds">
                    <div class="choiceRow" v-for="dept in allDept" :key="dept.id">
                        <el-checkbox :value="dept.id">
                            {{dept.name}}
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
                <!-- 处理删除选项的复选框列表 -->
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="openDialog = false">取消</el-button>
                        <el-button type="primary" @click="getDeptsRadius()" 
                        :disabled="chooseDeptIds.length === 0">确定</el-button>
                    </div>
                </template>
            </el-dialog>

    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { listRadiusByDays,listDeptRadius,listNotUsersInDept} from '@/api/attendance'
import { choreDateStr } from '@/utils/stringUtil'
import { getAllTotalDeptList } from '@/api/dept'
import SelectDaysBar from '@/components/SelectDaysBar.vue'


// 存获取的员工
let notUsers = ref([])
// 设置头像
function getAvatar(avatarUrl){
    if(avatarUrl == null || avatarUrl === ''){
        return 'src/assets/img/default_avatar.png'
    }
    return avatarUrl
}
// 获取某一天某个部门的未打卡员工名单
const getNotUsers = async()=>{
    let {data} = await listNotUsersInDept(chooseDeptId.value,chooseType.value,chooseUserDay.value)
    notUsers.value = data
}


// 存天与描述的映射
let myDays = ref([
    {num: 0,label: '今天'},{num: 1,label: '昨天'},{num: 2,label: '前天'},{num: 3,label: '大前天'}
])
//存查具体哪天
let chooseUserDay = ref(0)

// 存选中的打卡类型
let chooseType = ref(0)
// 存选中的部门id
let chooseDeptId = ref(11)


// 获取选中部门的打卡率
const getDeptsRadius = async()=>{
    let {data} = await listDeptRadius(chooseDeptIds.value,chooseDeptDay.value - 1)
    openDialog.value = false
    setCircleEcharts(data)
}

// 加载环形图数据
function setCircleEcharts(data){
    let deptData = []
    data.forEach(item => {
        deptData.push({value: item.recordRadius, name: item.deptName})
    });
    getCircleEcharts(deptData)
}

let chooseDeptDay = ref(7)
// 存中的部门id列表
let chooseDeptIds = ref([2,5,10,11,12,13])
// 控制部门选择的对话框的开启
let openDialog = ref(false)

// 存所有的部门
let allDept = ref([])
// 获取所有部门列表
const getAllDept = async()=>{
    let {data} = await getAllTotalDeptList()
    allDept.value = data;
}
// 更新部门环形统计图信息
function getDeptDays(days){
    chooseDeptDay.value = days
    getDeptsRadius()
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
function getCircleEcharts(deptData){
    const circleDom = echarts.init(circleImg.value)
    circleDom.setOption(
        {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                // top: '5%',
                bottom: '2%',
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
                    data: deptData,
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
    getAllDept()
    getLineEcharts()
    getRadiusList()
    getDeptsRadius()
    getNotUsers()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';

::-webkit-scrollbar {
    width: 0px;
}
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
            .typeSelect{
                :deep(){
                    .el-select,.el-select__wrapper{
                        width: 7vw;
                    }
                }
            }
            .userSelect{
                :deep(){
                    .el-select,.el-select__wrapper{
                        width: 10vw;
                    }
                }
            }
            #circleImg{
                width: 100%;
                height: 45vh;
            }
            .userCard{
                width: 98%;
                box-shadow: $common-box-shodow;
                margin: 2vh 0;
                @include flex-box;
                justify-content: left;
                padding: 0.5vh 1%;
                .avatar{
                    height: 60px;
                    width: 60px;
                }
                .userMsg{
                    margin-left: 1.5vw;
                    font-size: $common-font-size - 2;
                    color: $third-show-color;
                    .name{
                        font-size: $common-font-size;
                        color: rgb(36,47,87);
                        font-weight: 550;
                    }
                }
            }
            .userCard:hover{
                box-shadow: $large-box-shadow;
            }
        }
    }
    :deep(){
        .el-dialog__title,.dialog-footer{
            @include flex-box;

        }
        .el-checkbox-group{
            @include flex-box;
            justify-content: space-between;
            .choiceRow{
                width: 45%;
            }
        }
    }
}
</style>