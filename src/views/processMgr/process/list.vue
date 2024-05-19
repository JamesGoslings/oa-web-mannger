<template>
    <div class="processListAll">
        <div class="funTitle">审批申请列表</div>
        <el-card shadow="hover" class="selectBarAll">
            <el-select
            v-model="searchObj.userId"
            filterable
            placeholder="选择申请人"
            style="margin-right: 1vw;"
            >
                <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="user.name"
                :value="user.userId"
                />
            </el-select>
            <el-select
            v-model="searchObj.processTemplateId"
            filterable
            placeholder="选择申请的模板"
            style="margin-right: 2.5vw;"
            >
                <el-option
                v-for="template in templateAll"
                :key="template.id"
                :label="template.name"
                :value="template.id"
                />
            </el-select>
            <el-input
            v-model="searchObj.keyword"
            style="width: 42vw"
            placeholder="搜索审批申请，请输入审批申请的标题或描述"
            clearable
            />
        </el-card>
        <el-card shadow="hover" class="tabCard" style="margin-top: 2.5vh;">
            <div class="tabBar">
                <div class="types">
                    <span class="type" :style="getActStyle(i)" v-for="(type,i) in allTypes"
                     :key="type.id" @click="()=>{chooseIndex = i;searchObj.processTypeId = type.id}">{{type.name}}申请</span>
                </div>
                <div class="block">
                    <el-date-picker
                        v-model="dateArr"
                        type="datetimerange"
                        start-placeholder="创建时间"
                        end-placeholder="修改时间"
                        format="YYYY-MM-DD HH:mm:ss"
                        date-format="YYYY/MM/DD ddd"
                        time-format="A hh:mm:ss"
                    />
                </div>
            </div>
            <div class="table">
                <el-table :data="pageData" style="width: 100%">
                    <el-table-column prop="createTime" label="申请时间" width="180" />
                    <el-table-column prop="title" label="申请标题"/>
                    <el-table-column prop="description" label="申请描述" />
                    <el-table-column prop="processTemplateName" label="申请模板名称" />
                    <el-table-column prop="processTypeName" label="申请类型" />
                    <el-table-column label="当前申请状态" >
                        <template  v-slot="scope">
                            <div class="statusShow" :style="{background: getStatusObj(scope.row.status).backColor
                            ,color: getStatusObj(scope.row.status).fontColor}"
                            >{{getStatusObj(scope.row.status).name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="currentAuditor" label="当前审批人" />
                    <el-table-column fixed="right" label="操作" width="250">
                    <template v-slot="scope">
                        <div class="tabFooter">
                            <el-button size="small" plain @click="showFormData(scope.row)">查看申请表单</el-button>
                        </div>
                    </template>
                </el-table-column>
                </el-table>
            </div>
            <el-pagination
            class="page"
            background
            :page="page"
            :pageSize="limit"
            layout="prev, pager, next"
            :total="50"
            />
        </el-card>
        <el-dialog @close="thisProcess = {}" v-model="openFormDialog" :title="`查看 “${thisProcess.title}” `" width="400"
        draggable :close-on-click-modal="false" v-if="thisProcess.id">
            <div>
                <form-create
                v-model="thisFormValues"
                :rule="JSON.parse(thisProcess.formProps)"
                :option="JSON.parse(thisProcess.formOptions)"
                ></form-create>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import {getAllProcessTypes} from '@/api/processType'
import {getProcessTemplateAll} from '@/api/processTemplate'
import {listPageProcess} from '@/api/process'
import {getAllUserMsg} from '@/api/user'
import { isSpace,removeWhiteSpaces } from "@/utils/stringUtil";
import { getStatusObj } from '@/utils/staticData'
import { onMounted } from 'vue'


// 存展示的申请的信息
const thisFormValues = computed(() => {
    return JSON.parse(thisProcess.value.formValues);  
});
// 存当前浏览的申请表单的申请对象
let thisProcess = ref({})
// 控制表单对话框的开关
let openFormDialog = ref(false)
// 展示申请表单的数据
function showFormData(process){
    thisProcess.value = process
    console.log('=====================>>>')
    console.log(process)
    console.log('=====================>>>')
    openFormDialog.value = true
}
// 存分页数据
let pageData = ref([])
// 分页条件查询
const selectPageBykey = async()=>{
    // 处理条件查询对象
    searchObj.value.createTimeBegin = dateArr.value[0]
    searchObj.value.createTimeEnd = dateArr.value[1]
    let myKeyword = searchObj.value.keyword
    if(isSpace(myKeyword)){
        searchObj.value.keyword = ""
    }else{
        searchObj.value.keyword = removeWhiteSpaces(myKeyword)
    }
    let {data} = await listPageProcess(page.value,limit.value,searchObj.value)
    pageData.value = data.records
}

// 存分页要求
let page = ref(1)
let limit = ref(5)

let dateArr = ref([])

// 存用于条件查询的对象
let searchObj = ref({})
// 存所有用户
let userList = ref([])
// 获取所有用户的列表
const getUserAll = async()=>{
    let {data} = await getAllUserMsg()
    userList.value = data
}
// 存所有的模板对象
let templateAll = ref([])
// 获取所有的模板对象
const getTemplateAll = async()=>{
    let {data} = await getProcessTemplateAll()
    templateAll.value = data
}
// 存所有的审批类型
let allTypes = ref([{name: '全部',id: -1}])
// 获取所有的审批类型
const listProcessType = async()=>{
    let {data} = await getAllProcessTypes()
    allTypes.value.push(... data)
}
// 设置选中样式
let chooseIndex = ref(0)
function getActStyle(i){
    const actColor = 'rgb(106,183,255)'
    return chooseIndex.value === i ? {color: actColor,borderBottom: `${actColor} 2.5px solid`}: "";
}
onMounted(()=>{
    listProcessType()
    getUserAll()
    getTemplateAll()
    selectPageBykey()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';

.processListAll{
    margin-left: $left-distance;
    padding: $page-padding;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    .selectBarAll{
        width: 100%;
        background: #FFF;
        @include flex-box;
        justify-content: space-between;
        :deep(){
            .el-card__body{
                width: 100%;
            }
            .el-select,.el-select__wrapper,el-select__wrapper{
                width: 15vw;
            }
        }
    }
    .tabCard{
        width: 100%;
        .tabBar{
            margin-bottom: 2vh;
            @include flex-box;
            justify-content: space-between;
            .types{
                user-select: none;
                .type{
                    font-size: $common-font-size;
                    color: $third-show-color;
                    margin-right: 2vw;
                    padding-bottom: 0.8vh;
                }
                .type:hover{
                    color: rgb(106,183,255);
                    border-bottom: rgb(106,183,255) 2.5px solid;
                    border-radius: 2px;
                }
            }
            .block{
                text-align: center;
            }
        }
        .table{
            :deep(){
                .el-table__header{
                    th{
                        background-color: rgb(250,250,250);
                        color: $title-font-color;
                    }
                }
            }
            .statusShow{
                width: 40%;
                text-align: center;
            }
        }
        .page{
            float: right;
            margin: 1.25vh 0;
        }
    }

}
</style>