<!-- 角色页面 -->
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



            <!-- 显示可 编辑/删除 角色的对话框 -->
            <el-dialog v-model="openChoiseDialog" :title="editOrSaveDialogTitle" width="400"
                    draggable :close-on-click-modal="false">
                        <!-- 处理编辑选项的单选框列表 -->
                        <el-radio-group v-model="chooseRoleIndex" v-if="funType === 2">
                            <div v-for="(role,i) in allRoles" :key="role.id" class="choiceRow"
                            :title="getRoleMsgStr(role)">
                        <el-radio :value="i">{{role.roleName}}</el-radio>
                    </div>
                </el-radio-group>
                <el-checkbox-group v-model="chooseRoles" v-else>
                    <div class="choiceRow" v-for="role in allRoles" :key="role.id" 
                    :title="getRoleMsgStr(role)">
                        <el-checkbox :value="role.id">
                            {{role.roleName}}
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
                <!-- 处理删除选项的复选框列表 -->
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="openChoiseDialog = false">取消</el-button>
                        <el-button type="primary" @click="goToEditInitOrRemoveChooseRole()" 
                        :disabled="(chooseRoleIndex < 0 && funType === 2)">确定</el-button>
                    </div>
                </template>
            </el-dialog>

            <!-- 编辑角色的对话框 -->

            <el-dialog v-model="openDialog" :title="editOrSaveDialogTitle" width="400"
            draggable :close-on-click-modal="false">
                <el-form :model="form">
                    <el-form-item label="角色名称">
                        <el-input v-model="changedRole.roleName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="changedRole.description" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="角色编码">
                        <el-input v-model="changedRole.roleCode" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="openDialog = false">取消</el-button>
                        <el-button type="primary" @click="editOrSaveRole()">保存</el-button>
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
                    <span class="funCard" v-for="(card,i) in cards" :key="i" >
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
import { getAllProcessTypes,getProcessTypePage,removeOneProcessType } from '@/api/processType'
import { isSpace,removeWhiteSpaces } from "@/utils/stringUtil";
import { Check, Close } from '@element-plus/icons-vue'
import{useSimpleConfirm,useTips} from '@/utils/msgTip'
import { onMounted } from "vue"

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
// let keyword = ref('')
let queryObj = ref({keyword: ''})
// 获取分页数据
const getPageData = async()=>{
    let keyword = queryObj.value.keyword
    queryObj.value.keyword = removeWhiteSpaces(keyword)
    let {data} = await getProcessTypePage(page.value,limit.value,queryObj.value)
    processTypePage.value = data.records
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
            .myTitle{
            }
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
