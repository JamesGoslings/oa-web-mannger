<template>
        <div class="deptAll">
            <div class="funTitle myTitle">
                <span>部门列表</span>
                <changeSwitch class="changeFun" radius="10px" border-size="10px"
                back-color="rgb(244,247,252)" act-back-color="rgb(254,255,255)"
                act-font-color="rgb(36,47,87)" left-txt="部门信息" right-txt="统计信息"
                @value-sent="changeMode"/>
            </div>
            <div class="funMode baseCard">
                <div class="imgFun" v-show="mode === 0">
                    <div autoresize ref="myEchart" id="myEchart"></div>
                </div>
                <div class="msgShow" v-show="mode === 1">
                    <div class="baseCard iptBar" >
                        <el-autocomplete
                        v-model="chooseName"
                        :fetch-suggestions="querySearch"
                        popper-class="my-autocomplete"  
                        placeholder="请输入部门名称"  
                        @select="handleSelect"  
                        >
                            <template #default="{ item }">  
                                <div class="value">{{ item.name }}</div>  
                                <!-- <div class="value">{{ item.value }}</div>   -->
                                <!-- <span class="link">{{ item.link }}</span>   -->
                            </template>  
                        </el-autocomplete>
                    </div>
                    <div class="msgAll baseCard">
                        6
                    </div>
                    <div class="fun baseCard">
                        7
                    </div>
                </div>
            </div>
            <div class="funTitle">部门组织结构图</div>
            <div class="baseCard treeImg">
                <div style="margin-right: 10px"><el-switch v-model="horizontal"></el-switch> 横向</div>
                <vue3-tree-org
                :data="treeData"
                :horizontal="horizontal"
                :default-expand-level="100"
                center
                :collapsable="true"
                :define-menus="[{ name: '复制文本', command: 'copy' }]"
                :node-draggable="false"
                >
                    <!-- 节点内容 -->
                    <template v-slot="{node}">
                        <div class="nodeOne">
                            <div class="custom-content">{{node.$$data.name}}</div>
                            <div v-if="node.$$data.id !== 0">部门人数：{{node.$$data.totalCount}}</div>
                            <div v-else>公司总人数：{{node.$$data.totalCount}}</div>
                        </div>
                    </template>
                    <!-- 展开按钮 -->
                    <template v-slot:expand="{node}">
                        <div>{{node.children.length}}</div>
                    </template>
                </vue3-tree-org>
            </div>
            
            <!-- 图表设置对话框 -->
            <el-dialog v-model="openSettingDialog" title="配置饼图显示信息" width="400"
            draggable :close-on-click-modal="false">
                <div style="color: rgb(249,190,23);">{{errMsg}}</div>  
                <div class="iptAll">
                    <div class="iptMsg">
                        <span>设置图表根部门：</span>
                        <el-select
                        v-model="settingMsg.rootDeptId"
                        filterable
                        placeholder="选择图表根部门"
                        >
                            <el-option
                            v-for="dept in totalDepts"
                            :key="dept.id"
                            :label="dept.name"
                            :value="dept.id"
                            />
                        </el-select>
                    </div>
                    <div class="iptMsg">
                        <span>设置显示部门数：</span>
                        <el-input style="width: 50%;margin: 1vh 0;" @input="checkIptNum()" v-model="settingMsg.showNum" :placeholder="`请输入显示部门数目 0~${totalDepts.length}`" autocomplete="off" />
                    </div>
                </div>
                <div class="btnAll">
                    <el-button type="primary" @click="applySettingMsg()" :disabled="!checkIptNum()">确定</el-button>
                    <el-button type="primary" plain @click="resetMsg()">恢复默认</el-button>                    
                </div>
            </el-dialog>


        </div>
</template>
<script setup>
import { getTreeDeptList,getAllTotalDeptList } from '@/api/dept';
import { getUserTotalCount } from '@/api/user'
import changeSwitch from '@/components/ChangeSwitch.vue';
import * as echarts from 'echarts'


// 自动补全实现

const chooseName = ref('')
// 将部门中name属性映射成value形成新数组
const mappedArray = computed(() => {  
    return totalDepts.value.map(item => ({  
        ...item, // 展开当前对象以保留所有属性
        value: item.name, // 添加value属性
    }));  
});
// 检索实现
function querySearch(queryString, cb) { 
    // const results = mappedArray.value
    // 使用filter进行检索
    const results = mappedArray.value.filter(obj => {  
        return obj.name.includes(queryString);
    });
    cb(results)
}

// 选中后的逻辑
function handleSelect(item) {
    console.log(item)
}  
  
  

// 恢复默认配置
function resetMsg(){
    settingMsg.value = { rootDeptId: 2,showNum: 6 }
    // applySettingMsg()
}
// 配置完成，应用配置信息
function applySettingMsg(){
    // getAllTotalDepts()
    setEchartsData()
    openSettingDialog.value = false
}
// 显示错误信息
let errMsg = ref('')
// 校验输入字符是否合法
function checkIptNum(){
    const regex = /^\d+$/;
    let iptValue = settingMsg.value.showNum
    if(iptValue === ''){
        errMsg.value = ''
        return false
    }
    if(!(regex.test(iptValue))){
        errMsg.value = "别瞎输,只能输入数字"
        return false
    }
    if(iptValue < 0 || iptValue > totalDepts.value.length){
        errMsg.value = `输入数字只能是 0~${totalDepts.value.length}`
        return false
    }
    return true
}
// 存用户配置的值
let settingMsg = ref({
    rootDeptId: 2,
    showNum: 6
})
// 控制配置图表信息的对话框的开关
let openSettingDialog = ref(false)
// 饼图的dom
const myEchart = ref(null)
// 存部门在职人员的图表数据
let deptTotalCountData = ref([])
// 存部门(含子级)总人数的图表的数据
let deptTotalCountWithChildrernData = ref([])

// 设置图表的数据
function setEchartsData(){
    deptTotalCountData.value = []
    deptTotalCountWithChildrernData.value = []
    for(let i = 0;i < settingMsg.value.showNum;i++){
        deptTotalCountData.value[i] = {value:0,name: ''}
        deptTotalCountData.value[i].value = totalDepts.value[i].myCount
        deptTotalCountData.value[i].name = totalDepts.value[i].name
    }
    let x = 0;
    for(let j = 0;j < totalDepts.value.length;j++){
        if(totalDepts.value[j].parentId === settingMsg.value.rootDeptId){
            deptTotalCountWithChildrernData.value[x] = {value:0,name: ''}
            deptTotalCountWithChildrernData.value[x].value = totalDepts.value[j].totalCount
            deptTotalCountWithChildrernData.value[x].name = totalDepts.value[j].name
            x++;
        }
    }
    getEcharts()
}
// 存列表型的所有完整部门信息
let totalDepts = ref([])
// 获取列表结构的完整部门信息
const getAllTotalDepts = async()=>{
    let {data} = await getAllTotalDeptList()
    totalDepts.value = data
    setEchartsData()
}
// 初始化dom元素及绘画
function getEcharts(){
    const PieDome = echarts.init(myEchart.value)

    PieDome.setOption({
        // 图例设置
        legend: {
            top: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
            show: true,
            feature: {
                mySetting: {
                    show: true,
                    title: '配置显示信息',
                    icon: 'image://src/assets/img/setting.png',
                    onclick: function (){
                        openSettingDialog.value = true
                    }
                },
                mark: { show: true },
                dataView: { show: true, readOnly: true, title: '数据展示',lang:['数据视图', '关闭', '刷新'] },
                restore: { show: true, title: '更新图表信息'},
                saveAsImage: { show: true, title: '下载饼图' },
            }
        },
        // 系列数据设置
        series: [
            {
                name: '根部门下的部门在职人数(含子部门人数)', // 系列名称
                type: 'pie', // 图表类型为饼图
                radius: [30, 150], // 饼图的内外半径
                center: ['25%', '50%'], // 饼图的中心位置
                roseType: 'radius', // 玫瑰图类型为区域玫瑰图
                itemStyle: {
                    borderRadius: 8 // 数据项的样式设置
                },
                // 数据
                data: deptTotalCountWithChildrernData.value
            },
            {
                name: '部门在职人数',
                type: 'pie',
                radius: [20, 140],
                center: ['75%', '50%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 5
                },
                data: deptTotalCountData.value
            }
        ],
    })
}

// 表示当前显示的主要信息的类型
let mode = ref(0)
function changeMode(mod){
    mode.value = mod
}

// 存树型数据
let treeData = ref({
    id: 0,
    name: "牛马科技有限公司",
    totalCount: 0,
    children: []
})
// 获取总人数
const getUserTotal = async()=>{
    let {data:{totalCount}} = await getUserTotalCount()
    treeData.value.totalCount = totalCount
}
// 获取所有的树型信息
const getAllTreeDepts = async()=>{
    let {data} = await getTreeDeptList()
    treeData.value.children = data
    getUserTotal()
}

onMounted(()=>{
    getAllTreeDepts()
    // getEcharts()
    getAllTotalDepts()
})


let horizontal = ref(false)


</script>
<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
#myEchart{
    width: 100%;
    height: 100%;
}
.deptAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    margin-bottom: 10vh;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .myTitle{
        justify-content: space-between;
        margin-top: 2vh;
        margin-bottom: 2.5vh;
        .changeFun{
            width: 20%;
            height: 5vh;
        }
    }
    .funMode{
        width: 100%;
        height: 64vh;
        background: #FFF;
        @include flex-box;
        .msgShow{
            width: 95%;
            height: 90%;
            // border: #000 1px solid;
            @include flex-box;
            justify-content: space-between;
            .iptBar{
                height: 10%;
                width: 100%;
                box-shadow: $common-box-shodow;
                align-self: flex-start;
                @include flex-box;
            }
            .msgAll{
                width: 68%;
                height: 85%;
                box-shadow: $common-box-shodow;
                align-self: flex-end;
            }
            .fun{
                width: 30%;
                height: 85%;
                box-shadow: $common-box-shodow;
                align-self: flex-end;
            }
            .iptBar:hover,.msgAll:hover,.fun:hover{
                box-shadow: $large-box-shadow;
            }
        }
        .imgFun{
            width: 100%;
            height: 100%;
        }
    }
    .treeImg{
        width: 100%;
        height: 80vh;
        // margin-top: 10vh;
        box-shadow: $large-box-shadow;
        .nodeOne{
            // width: 7vw;
            padding: 1vh 1vw;
            background: $third-back-color;
            text-align: center;
            font-size: $common-font-size;
            font-weight: 600;
            color: $title-font-color;
            // box-shadow: 0px 0px 5px #928c8c64;
            .custom-content {
                padding-bottom: 8px;
                margin-bottom: 8px;
                border-bottom: 1px solid currentColor;
            }
        }
    }

    :deep(){
        .el-dialog,.is-draggable{
            .el-dialog__header,.show-close{
                @include flex-box;
                text-align: center;
                color: $title-font-color;
                .el-dialog__title{
                    font-size: $title-font-size;
                }
            }
            .dialog-footer{
                @include flex-box
            }
            .el-select{
                width: 10vw
            }
        }
    }
    .iptAll{
        @include flex-box;
        .iptMsg{
            @include flex-box;
            justify-content: left;
            width: 100%;
        }
    }
    .btnAll{
        @include flex-box;

    }

}
</style>