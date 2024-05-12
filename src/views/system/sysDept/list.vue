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
                        style="width: 80%;"
                        v-model="chooseName"
                        :fetch-suggestions="querySearch"
                        popper-class="my-autocomplete"  
                        placeholder="请输入部门名称"  
                        @select="handleSelect"
                        >
                            <template #default="{ item }">  
                                <div>{{ item.name }}</div>  
                            </template>  
                        </el-autocomplete>
                        <enterButton txt="查看全部" @click="openDialog = true"/>
                    </div>
                    <div class="msgAll baseCard">
                        <div class="deptMsg">
                            <div class="titleMsg">
                                <span class="iconfont ico">&#xe61a;</span>
                                <span class="funTitle msgTitle">部门信息</span>
                            </div>
                            <div v-for="(item,i) in deptMsgFields" :key="i">
                                <div class="msgOne" v-if="item.field !== '__none'">{{`${item.label}：${checkedDept[item.field]}`}}</div>
                                <div class="msgOne" v-else-if="item.type === 1">{{getCountStr(item)}}</div>
                                <div class="msgOne" v-else>{{`${item.label}：${checkedDept.leader.name}`}}</div>
                            </div>
                        </div>
                        <div class="userMsg">
                            <div class="titleMsg">
                                <el-avatar class="userIco" :src="getAvatar()" />
                                <span class="funTitle msgTitle">负责人信息</span>
                            </div>
                            <div v-for="(item,i) in userMsgFields" :key="i">
                                <div class="msgOne">{{`${item.label}：${checkedDept.leader[item.field]}`}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="fun baseCard">
                        <div class="myFunTitle">
                            <changeSwitch left-txt="修改" @value-sent="changeType" :type="funType"/>
                            <el-popover
                            placement="left"
                            title="提示"
                            :width="200"
                            trigger="hover"
                            :content="getTipContent()"
                            >
                            <template #reference>
                                <span class="tip iconfont" title="注意看">&#xe677;</span>
                            </template>
                            </el-popover>
                        </div>
                        <div class="formFun">
                           

                            <el-form :model="form">
                            <div v-for="(item,i) in formMsgField" :key="i">
                                <el-form-item :label="item.label">

                                    <el-input v-model="editDept[item.field]" autocomplete="off"
                                    v-if="item.type === 0"/>

                                    <el-select
                                    v-model="editDept.parentId"
                                    filterable
                                    placeholder="选择上级部门"
                                    @change="getThisNewDeptCode()"
                                    v-else-if="item.type === 1"
                                    >
                                        <el-option
                                        v-for="dept in totalDeptsWithNull"
                                        :key="dept.id"
                                        :label="dept.name"
                                        :value="dept.id"
                                        />
                                    </el-select>

                                    <el-select
                                    v-model="editDept.leaderId"
                                    filterable
                                    placeholder="选择负责人"
                                    v-else-if="item.type === 2"
                                    >
                                        <el-option
                                        v-for="user in userList"
                                        :key="user.id"
                                        :label="user.name"
                                        :value="user.userId"
                                        />
                                    </el-select>
                                    
                                    <el-radio-group v-model="editDept.isAddChildrenCount" v-else-if="item.type === 3">
                                        <el-radio :value=1 size="small">是</el-radio>
                                        <el-radio :value=0 size="small">否</el-radio>
                                    </el-radio-group>
                                    
                                </el-form-item>
                            </div>

                            <div class="footer">
                                <el-button v-if="funType === 1" :disabled="!editDept.id"
                                type="danger" @click="removeThisDept()">删除</el-button>
                                <el-button type="primary" :disabled="isDisAbled()" @click="saveOrUpDateDept()">保存</el-button>
                            </div>
                        </el-form>

                        </div>
                    </div>
                </div>
            </div>
            <div class="funTitle" @click="fun()">部门组织结构图</div>
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
import { getTreeDeptList,getAllTotalDeptList,updateDept,saveDept,getNewDeptCode,removeOneDeptById } from '@/api/dept';
import { getUserTotalCount,getAllUserMsg } from '@/api/user'
import {deepCopy} from '@/utils/objUtil'
import{useSimpleConfirm,useTips} from '@/utils/msgTip'
import changeSwitch from '@/components/ChangeSwitch.vue';
import enterButton from '@/components/EnterButton.vue';
import * as echarts from 'echarts'

// 刷新页面方法
function flushPage(){
    getAllTotalDepts()
    getAllTreeDepts()
    editDept.value = {}
}
// 实现删除单个部门
function removeThisDept(){
    useSimpleConfirm(`你真的确定要删除部门：${editDept.value.name} 吗？`).then(async()=>{
        let data = await removeOneDeptById(editDept.value.id);
        useTips(`成功删除部门：${editDept.value.name} `,data)
        // 刷新数据
        flushPage()
    })
}
// 用于确定当前"保存"按钮是否应该被使用
function isDisAbled(){
    let myDept = editDept.value
    return (!myDept.id && funType.value === 1) || 
    (funType.value === 0 && !(myDept.parentId != null && myDept.name && 
    myDept.deptCode && myDept.leaderId && myDept.isAddChildrenCount))
}
// 动态获取新的编码
const getThisNewDeptCode = async()=>{
    let parentId = editDept.value.parentId
    let deptId = editDept.value.id
    if(parentId == null){
        return;
    }
    if(deptId === null || deptId === undefined){
        editDept.value.id = -1
        deptId = -1
    }
    let {data:{newDeptCode}} = await getNewDeptCode(deptId,parentId)
    editDept.value.deptCode = newDeptCode
}
// 用于存有占位对象的所有部门的列表(便于选择无父级操作)
let totalDeptsWithNull = ref([{id:0,name:'无'}])
// 新建和修改部门的总方法
function saveOrUpDateDept(){
    if(funType.value === 0){
        saveThisDept()
    }else{
        updateThisDept()
    }
}
// 新建的具体方法
function saveThisDept(){
    useSimpleConfirm('你确定要添加该部门吗？').then(async()=>{
        editDept.value.id = null
        let data = await saveDept(editDept.value)
        useTips('成功添加新部门',data)
        // 刷新页面
        flushPage()
    })
}
// 修改的具体方法
function updateThisDept (){
    useSimpleConfirm(`你确定要修改部门：${editDept.value.name} 吗？？？`).then(async()=>{
        editDept.value.updateTime = null
        let data = await updateDept(editDept.value)
        useTips(`成功修改部门 ${editDept.value.name} `,data)
        // 刷新页面
        flushPage()
    })
}
// 存正在操作的部门（赋值时要深拷贝）
let editDept = ref({})
function fun(){
    alert(checkedDept.value.isAddChildrenCount)
}
// 存所有用户
let userList = ref([])
// 获取用户信息
const getUserAll = async()=>{
    let {data} = await getAllUserMsg()
    userList.value = data
}

// type确定当前显示形式 修改时 0: 输入框; 1: 选择框1; 2: 选择框2; 3: 单选
const formMsgField = ref([
    {label: "部门名称",field: 'name',type: 0},
    {label: "部门编码",field: 'deptCode',type: 0},
    {label: "上级部门",field: 'deptName',type: 1},
    {label: "负责人",field: 'type',type: 2},
    {label: "计算属性",field: 'count',type: 3},
])


// 获取切换后的类型
function changeType(type){
    funType.value = type
    // 深拷贝对象到编辑对象中
    if(type === 0){
        editDept.value = {
            leader:{}
        }
    }else{
        editDept.value = deepCopy(checkedDept.value)
    }
}
// 用于确定当前是修改还是新建
let funType = ref(0)
// 获取提示文本信息的方法
function getTipContent(){

    return funType.value === 1 ? '修改提示' : '新建提示'
}
// 设置计算部门人数的字符串的方法
function getCountStr(item){
    if(checkedDept.value.parentId === 0){
        checkedDept.value.parentName ='无'
    }
    let myCount = checkedDept.value.myCount
    let totalCount = checkedDept.value.totalCount
    let baseStr =  `${item.label}：${totalCount}`
    if(checkedDept.value.isAddChildrenCount === 0){
        return baseStr
    }
    return `${baseStr} (直接人数: ${myCount})`
}
// 对负责人头像的处理
function getAvatar(){
    let leader = checkedDept.value.leader
    if(leader == null || leader.avatarUrl == null || leader.avatarUrl === ''){
        return "/src/assets/img/default_avatar.png"
    }
    return leader.avatarUrl
}
// 用于显示部门信息
let deptMsgFields = ref([
    {label: '部门名称',field: 'name'},
    {label: '部门编码',field: 'deptCode'},
    {label: '上级部门',field: 'parentName'},
    {label: '负责人',field: '__none'},
    {label: '部门人数',field: '__none',type: 1},
    {label: '创建时间',field: 'createTime'},
    {label: '修改时间',field: 'updateTime'},
])
// 用于显示负责人信息
let userMsgFields = ref([
    {label: '姓名',field: 'name'},
    {label: '用户名',field: 'username'},
    {label: '联系电话',field: 'phone'},
    {label: '岗位',field: 'post'},
    {label: '创建时间',field: 'createTime'},
    {label: '修改时间',field: 'updateTime'},
])
// 存当前查看/修改的部门
let checkedDept = ref({
    isAddChildrenCount: 1,
    leader:{}
})
// 控制查看全部对话框的开关
let openDialog = ref(false)
// 自动补全实现
const chooseName = ref('')
// 将部门中name属性映射成value形成新数组
const mappedArray = computed(() => {  
    return totalDepts.value.map(item => ({  
        ...item,
        value: item.name, // 添加value属性
    }));
});
// 检索实现
function querySearch(queryString, cb) { 
    // const results = mappedArray.value
    // 使用filter进行检索
    const results = mappedArray.value.filter(dept => {  
        return dept.name.includes(queryString);
    });
    cb(results)
}

// 选中后的逻辑
function handleSelect(item) {
    checkedDept.value = item
    if(funType.value === 1){
        editDept.value = deepCopy(item)
    }

    // console.log(item)
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
    // 将数据copy到一个带null元素的数组中
    totalDeptsWithNull.value.push(...data)
    // 默认显示第一个数据
    checkedDept.value = data[0]
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
    getUserAll()
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
                justify-content: space-between;
                padding: 0 1vw;
            }
            .msgAll{
                width: 63%;
                height: 75.3%;
                box-shadow: $common-box-shodow;
                align-self: flex-end;
                @include flex-box;
                justify-content: space-between;
                padding: 2% 2%;
                .userMsg,.deptMsg{
                    height: 95%;
                    width: 36%;
                    box-shadow: $common-box-shodow;
                    padding: 1vh 2vw;
                    .titleMsg{
                        width: 100%;
                        @include flex-box;
                        justify-content: left;
                        margin: 1vh 0;
                        .userIco{
                            // margin: 1vh 0;
                            width: 50px;
                            height: 50px;
                        }
                        .ico{
                            color: $ipt-font-color;
                            font-size: $title-font-size * 2;
                        }
                        .msgTitle{
                            width: 8vw;
                            margin: 0;
                            font-size: $title-font-size - 1;
                            margin-left: 2vw;
                        }
                    }
                    .msgOne{
                        color: $third-show-color;
                        // font-family: "幼圆";
                        margin: 2vh 0;
                        // margin-left: 5vw;
                        font-size: $common-font-size + 1px;
                    }
                    
                }
            }
            .fun{
                width: 25%;
                height: 81.25%;
                box-shadow: $common-box-shodow;
                align-self: flex-end;
                padding: 1vh 1vw;
                .myFunTitle{
                    width: 100%;
                    @include flex-box;
                    justify-content: space-between;
                    .tip{
                        user-select: none;
                        font-size: $title-font-size * 2;
                        color: $secend-show-color;
                    }
                }
                .formFun{
                    width: 100%;
                    margin-top: 2vh;
                    .footer{
                        width: 100%;
                        @include flex-box;
                    }
                }
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