<!-- 审批类型页面 -->
<template>
    <div class="processTypeAll">
        <div class="funTitle allTitle">审批类型列表</div>
        <div class="tableBox baseCard">
            <div class="iptBar">
                <myInputBar v-model="queryObj.keyword" class="ipt" font-color="rgb(9,82,200)"
                 holder-color="rgb(211,227,253)" text="搜索审批类型，请输入类型名称或描述" />
                <el-button type="primary" plain @click="getPageData()">搜索</el-button>
            </div>
            <el-table class="tab" :data="processTypePage" style="width: 90%" stripe :border="true">
                <el-table-column fixed prop="name" label="审批类型名称"/>
                <el-table-column prop="description" label="描述" />
                <el-table-column prop="createTime" label="创建时间"  />
                <el-table-column prop="updateTime" label="修改时间" />
                <el-table-column fixed="right" label="操作" width="250">
                    <template  v-slot="scope">
                        <div class="tabFooter">
                            <el-button type="success" size="small" plain @click="removeOne(scope.row)">删除</el-button>
                            <el-button type="primary" size="small" plain @click="editDialogInit(scope.row)">编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>



            <!-- 显示可 编辑/删除 审批类型的对话框 -->
            <el-dialog v-model="openChoiseDialog" :title="funDialogTitle" width="400"
                    draggable :close-on-click-modal="false" append-to-body>
                        <!-- 处理编辑选项的单选框列表 -->
                        <el-radio-group v-model="chooseProcessTypeIndex" v-if="funType === 2">
                            <div v-for="(processType,i) in allProcessTypes" :key="processType.id" class="choiceRow"
                            :title="getTypeMsgStr(processType)">
                        <el-radio :value="i">{{processType.name}}</el-radio>
                    </div>
                </el-radio-group>
                <!-- 处理删除选项的复选框列表 -->
                <el-checkbox-group v-model="chooseTypes" v-else>
                    <div class="choiceRow" v-for="processType in allProcessTypes" :key="processType.id" 
                    :title="getTypeMsgStr(processType)">
                        <el-checkbox :value="processType.id">
                            {{processType.name}}
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="openChoiseDialog = false">取消</el-button>
                        <el-button type="primary" @click="goToEditInitOrRemoveChooseType()" 
                        :disabled="(chooseProcessTypeIndex < 0 && funType === 2)">确定</el-button>
                    </div>
                </template>
            </el-dialog>

            <!-- 编辑审批类型的对话框 -->

            <el-dialog v-model="openDialog" :title="funDialogTitle" width="400"
            draggable :close-on-click-modal="false" append-to-body>
                <el-form :model="form">
                    <el-form-item label="类型名称">
                        <el-input v-model="checkedProcessType.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="类型描述">
                        <el-input v-model="checkedProcessType.description" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="openDialog = false">取消</el-button>
                        <el-button type="primary" @click="editOrSaveType()">保存</el-button>
                    </div>
                </template>
            </el-dialog>

            <!-- 分页 -->
            <el-pagination
            v-model:current-page="page"
            :total="total"
            :page-size="limit"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getPageData"
            />
        </div>
        <div class="footer baseCard">
            <div class="mode">
                <div class="funTitle myTitle">审批类型操作模块</div>
                <div class="funCards">
                    <span class="funCard" v-for="(card,i) in cards" :key="i" @click="runFunMode(i)">
                        <div class="funIco iconfont" v-html="card.icon"></div>
                        <div class="funText">
                            <div class="funTitle aFunTitle">{{card.text}}</div>
                            <div class="description">{{card.description}}</div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue"
import { getAllProcessTypes,getProcessTypePage,removeOneProcessType,saveProcessType,updateProcessType,batchRemoveProcessTypes } from '@/api/processType'
import { isSpace,removeWhiteSpaces } from "@/utils/stringUtil";
import { Check, Close } from '@element-plus/icons-vue'
import{useSimpleConfirm,useTips} from '@/utils/msgTip'
import { onMounted } from "vue"

// 存多选选中的类型idList
let chooseTypes = ref([])
// 存单选选中的索引
let chooseProcessTypeIndex = ref(-1)
// 跳转编辑或删除的方法
function goToEditInitOrRemoveChooseType(){
    if(funType.value === 2){
        openChoiseDialog.value = false
        editDialogInit(allProcessTypes.value[chooseProcessTypeIndex.value])
        chooseProcessTypeIndex.value = -1
    }else if(funType.value === 3){
        batchRemoveTypes(chooseTypes.value)
    }
}
// 批量删除的具体方法
function batchRemoveTypes(idList){
    console.log('===================>>>>>')
    console.log(idList)
    console.log('===================>>>>>')
    useSimpleConfirm('你确定要删除以上勾选的审批类型吗？').then(async ()=>{
        let data = await batchRemoveProcessTypes(idList)
        chooseTypes.value = []
        // 关闭 选项的对话框
        openChoiseDialog.value = false
        // 给出提示
        useTips('成功删除选中的审批类型~', data)
        // 刷新页面以及总类型记录
        getAllProcessTypeData()
        getPageData()
    })
}
// 获取审批类型信息字符串
function getTypeMsgStr(processType){
    let description = (processType.description == null || processType.description === '') ? '（没写描述）': processType.description
    return `描述: “${description}”`
}
// 处理操作模块的总方法
function runFunMode(i){
    if(i === 0){
        saveDialogInit()
    }else if(i === 1){
        funDialogTitle.value = '请选择要编辑的审批类型'
        funType.value = 2
        openChoiseDialog.value = true
    }else{
        funDialogTitle.value = '请选择要删除的审批类型（可多选）'
        funType.value = 3
        openChoiseDialog.value = true
    }
}
// 控制选择的对话框
let openChoiseDialog = ref(false)
// 初始化新建对话框
function saveDialogInit(){
    checkedProcessType.value = {}
    funDialogTitle.value = '新建审批类型'
    funType.value = 0
    openDialog.value = true
}
// 新建和编辑的总方法
function editOrSaveType(){
    if(funType.value === 1){
        editThisType()
    }else{
        saveThisType()
    }
}
// 新建的具体方法
function saveThisType(){
    useSimpleConfirm('你确定要添加该审批类型吗？').then(async ()=>{
        let data = await saveProcessType(checkedProcessType.value)
        openDialog.value = false
        flushPage()
        useTips(`成功新建类型：“${checkedProcessType.value.name}”`,data)
    })
}
// 编辑的具体方法
function editThisType(){
    useSimpleConfirm(`你确定要保存对类型：“${checkedProcessType.value.name}”的修改吗？？？`).then(async ()=>{
        let data = await updateProcessType(checkedProcessType.value)
        openDialog.value = false
        flushPage()
        useTips(`成功修改类型：“${checkedProcessType.value.name}”`,data)
    })
}
// 初始化编辑对话框
function editDialogInit(typeOne){
    checkedProcessType.value = typeOne
    funDialogTitle.value = `编辑类型：“${typeOne.name}” 中`
    funType.value = 1
    openDialog.value = true
}

// 用于确定当前是修改还是新建
let funType = ref(0)
// 存新建/编辑/删除对话框的title
let funDialogTitle = ref('')
// 控制编辑/新建的对话框的开关
let openDialog = ref(false)
// 刷新页面
function flushPage (){
    getPageData()
}
// 存当前正在修改/查看/新建的单个类型
let checkedProcessType = ref({})
// 删除单个类型
function removeOne(typeOne){
    useSimpleConfirm(`你真的要删除审批类型：“${typeOne.name}” 吗？？？`).then(async()=>{
        let data = await removeOneProcessType(typeOne.id)
        useTips(`成功删除类型：“${typeOne.name}” `,data)
        flushPage()
    })
}
// 用于显示操作功能卡片
let cards = ref([
    {
        icon: '&#xe619;',
        text: '添加审批类型',
        description: '点击此处添加新的审批类型'
    },
    {
        icon: '&#xe603;',
        text: '编辑审批类型',
        description: '点击此处编辑已有的审批类型'
    },
    {
        icon: '&#xe64d;',
        text: '删除审批类型',
        description: '点击此处删除已有的审批类型'
    }
])
// 存分页数据
let page = ref(1)
let total = ref(5)
let limit = ref(3)
let processTypePage = ref([])
// 存输入的关键值
let queryObj = ref({keyword: ''})
// 获取分页数据
const getPageData = async()=>{
    let keyword = queryObj.value.keyword
    queryObj.value.keyword = removeWhiteSpaces(keyword)
    let {data} = await getProcessTypePage(page.value,limit.value,queryObj.value)
    processTypePage.value = data.records
    total.value = data.total
}
// 存所有的类型
let allProcessTypes = ref([])
// 获取所有数据
const getAllProcessTypeData = async()=>{
    let {data} = await getAllProcessTypes()
    allProcessTypes.value = data
}
onMounted(()=>{
    getPageData()
    getAllProcessTypeData()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.processTypeAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    .allTitle{
        padding: $page-padding;
    }
    .tableBox{
        margin: $page-padding;
        margin-bottom: 5vh;
        width: 100%;
        background: #FFF;
        @include flex-box;
        .iptBar{
            width: 90%;
            @include flex-box;
            justify-content: space-between;
            margin: 2vh 0;
            .ipt{
                width: 90%;
                height: 4vh;
            }
        }
        .tab{
            margin-bottom: 2vh;
            :deep(){
                .is-leaf{
                    background-color: rgb(229,231,235);
                }
                .el-table__cell{
                    color: $title-font-color;
                    text-align: center;
                    font-size: $common-font-size;
                }
            }
            .tabFooter{
                @include flex-box;
            }
        }
        :deep(){
                .el-dialog__header{
                    text-align: center;
                    margin-left: 48px;
                    color: $title-font-color;
                }
                .el-form{
                    @include flex-box;
                    .el-form-item{
                        width: auto;
                        min-width: 0;
                        @include flex-box;
                    }
                }
                .dialog-footer{
                    @include flex-box
                }
        }
    }
    .choiceRow{
        width: 100%;
        @include flex-box
    }
    .footer{
        // margin-top: 50vh;
        padding-left: $left-distance;
        width: 100%;
        height: 30vh;
        background: #FFF;
        position: absolute;
        bottom: 0;
        user-select: none;
        .mode{
            width: 79%;
            background: #FFF;
            padding: $page-padding;
            // .myTitle{
            // }
            .funCards{
                width: 100%;
                @include flex-box;
                justify-content: space-between;
                .funCard{
                    padding: 15px;
                    padding-left: 10px;
                    padding-right: 10px;
                    width: 25%;
                    background: rgb(243,244,246);
                    box-shadow:  0px 0px 4px $box-shadow-color;
                    .funIco{
                        color: $main-show-color;
                        font-size: $title-font-size;
                    }
                    .funText{
                        .description{
                            color: $third-show-color;
                        }
                    }
                }
                .funCard:active{
                    background: #fefcfc;
                    .funIco,.aFunTitle,.description{
                        color: $holder-font-color;
                    }
                }
            }
        }
    }
}
</style>
