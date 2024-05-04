<!-- 角色页面 -->
<template>
    <div class="roleSty">
        <div class="funTitle allTitle">角色列表</div>
        <div class="tableBox baseCard">
            <div class="iptBar">
                <myInputBar v-model="iptObj.keyword" class="ipt" font-color="rgb(9,82,200)" holder-color="rgb(211,227,253)" text="搜索角色，请输入角色名称或编码" />
                <el-button type="primary" plain @click="getPageData()">搜索</el-button>
            </div>
            <el-table class="tab" :data="pageRoles" style="width: 90%" stripe :border="true">
                <el-table-column fixed prop="roleName" label="角色名称"/>
                <el-table-column prop="roleCode" label="角色编码" />
                <el-table-column prop="description" label="描述" />
                <el-table-column prop="createTime" label="创建时间"  />
                <el-table-column prop="updateTime" label="修改时间" />
                <el-table-column fixed="right" label="操作" >
                    <template  v-slot="scope">
                        <div class="tabFooter">
                            <el-button type="success" size="small" plain @click="removeOne(scope.row)">删除</el-button>
                            <el-button type="primary" size="small" plain>编辑</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
            6666
        </div>
    </div>
</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue"
import { getAllRoles,getRolePage,removeOneRoleById } from "@/api/role";
import { onMounted } from "vue";
import { Check, Close } from '@element-plus/icons-vue'
import{useConfirm,useTips} from '@/utils/msgTip'


// 分页数据
let page = ref(1)
let total = ref(10)
let limit = ref(3)
let iptObj = ref({keyword: ''})
// 存当前页面拿到的roles
let pageRoles = ref([])
const getPageData = async()=>{
    let {data} = await getRolePage(page.value,limit.value,iptObj.value)
    pageRoles.value = data.records
    total.value = data.total
}
// 接收全部的角色
let allRoles = ref([])
const getAllRoloList = async()=>{
    let {data} = await getAllRoles()
    allRoles.value = data
}
// 删除角色
const removeOne = async(role)=>{
    useConfirm(`你确定要删除角色 “${role.roleName}” 吗？`, '友情提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(()=>{
        removeOneRoleById(role.id).then(res=>{
            // 删除完成刷新页面并给出提示
            getPageData()
            useTips(`你已成功删除角色 “${role.roleName}”`,res)
        })
    }).catch(()=>{
        console.log('点击了取消')
    })
}
onMounted(()=>{
    getAllRoloList()
    getPageData()
})
</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.roleSty{
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
    }
    .footer{
        // margin-top: 50vh;
        padding-left: $left-distance;
        width: 100%;
        height: 10vh;
        background: #FFF;
        position: absolute;
        bottom: 0;
    }
}
</style>