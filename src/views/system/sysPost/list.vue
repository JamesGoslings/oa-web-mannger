<template>
    <div class="postAll">
        <div class="funTitle">岗位列表</div>
        <div class="funMode">
            <el-card class="cardOne" shadow="hover" v-for="post in showPosts" :key="post.id" @click="showPostMsg(post)" >
                <div class="msg">
                    <div class="cardTitle funTitle">{{post.name}}</div>
                    <div class="cardField">{{`部门: ${post.deptName}`}}</div>
                    <div class="cardField">{{`编码: ${post.postCode}`}}</div>
                </div>
                <span class="iconfont ico">&#xe641;</span>
            </el-card>
            <div style="width: 100%;margin: 1vh 0;">
                <enterButton class="more" txt="查看全部"/>
            </div>
            <div class="modes">
                <el-card class="fun" shadow="hover">
                    <div class="title">
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
                                <el-form-item :label="item.label" v-if="funType === 1 || (funType === 0 && item.type !== 2)">
                                    <el-input v-model="checkedPost[item.field]" autocomplete="off"
                                    v-if="item.type !== 1 && item.type !== 3" :disabled="item.type === 2"/>
                                    <el-select
                                    v-model="checkedPost.deptId"
                                    filterable
                                    placeholder="选择直接所属部门"
                                    @change="changePostCode()"
                                    v-else-if="item.type === 1"
                                    >
                                        <el-option
                                        v-for="dept in deptList"
                                        :key="dept.id"
                                        :label="dept.name"
                                        :value="dept.id"
                                        />
                                    </el-select>

                                    <el-select
                                    v-model="checkedPost.type"
                                    filterable
                                    placeholder="选择岗位类型"
                                    @change="changePostCode()"
                                    v-else-if="item.type === 3"
                                    >
                                        <el-option
                                        v-for="(postType,i) in postTypeList"
                                        :key="i"
                                        :label="postType"
                                        :value="i"
                                        />
                                    </el-select>
                                </el-form-item>
                            </div>

                            <div class="footer">
                                <el-button v-if="funType === 1" type="danger">删除</el-button>
                                <el-button type="primary" @click="saveOrUpdateOPost()" >保存</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-card>
                <!-- </el-card> -->
                <el-card class="imgShow" shadow="hover">
                    <div>6666</div>
                    6666
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getAllTotalPostList,getNewCode } from '@/api/post';
import enterButton from '@/components/EnterButton.vue';
import changeSwitch from '@/components/ChangeSwitch.vue';
import { getAllDept } from '@/api/dept'
import { postTypeList } from '@/utils/staticData'
import { onMounted } from 'vue';

// 动态更新code码
const changePostCode = async()=>{
    let post = checkedPost.value
    let {data:{newPostCode}} = await getNewCode(post.id,post.deptId,post.type)
    checkedPost.value.postCode = newPostCode
}
// 设置提示框信息
function getTipContent(){
    const SaveTip = '岗位编码在选择部门和类型之后会自动生成，推荐使用自动生成的编码'
    const updateTip = '默认修改岗位类型或部门后编码会自动更改'
    return funType.value === 0 ?  SaveTip : updateTip
}
// 点击卡片展示信息
function showPostMsg(post){
    funType.value = 1
    checkedPost.value = post
}
// type确定当前显示形式 修改时 0: 输入框; 1: 选择框; 2: 只显示
const formMsgField = ref([
    {label: "岗位名称",field: 'name',type: 0},
    {label: "岗位编码",field: 'postCode',type: 0},
    {label: "所属部门",field: 'deptName',type: 1},
    {label: "岗位类型",field: 'type',type: 3},
    {label: "岗位人数",field: 'count',type: 2},
    {label: "创建时间",field: 'createTime',type: 2},
    {label: "修改时间",field: 'updateTime',type: 2},
])
// 存当前 查看/新建 的岗位
let checkedPost = ref({})
// 存显示的岗位列表
let showPosts = ref([])
// 存所有的岗位
let totalPosts = ref([])
const getAllTotalPosts = async()=>{
    let {data} = await getAllTotalPostList()
    totalPosts.value = data
    for(var i = 0;i < 4;i++){
        showPosts.value[i] = totalPosts.value[i]
    }
}
// 用于表明当前使用哪个表单 1: 查看/修改; 0: 新建
let funType = ref(0)
// 接收子组件值来确定当前表单
function changeType(type){
    funType.value = type
    // 如果是新建岗位就清空显示信息
    if(type === 0){
        checkedPost.value = {}
    }
}
// 存所有的部门的列表
let deptList = ref([])
const getDeptList = async()=>{
    let {data} = await getAllDept()
    deptList.value = data
}
onMounted(()=>{
    getAllTotalPosts()
    getDeptList()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';

.postAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .funMode{
        @include flex-box;
        justify-content: space-between;
        // border: #000 1px solid;
        width: 100%;
        .cardOne{
            @include flex-box;
            width: 17vw;
            height: 15vh;
            .msg{
                width: 70%;
                @include flex-box;
                justify-content: left;
                margin: 1vh 0;
                .cardTitle{
                    // width: auto;
                    margin: 1vh 0;
                    font-size: $common-font-size + 2px;
                    user-select:auto;
                }
                .cardField{
                    color: $third-show-color;
                    font-size: $common-font-size;
                    width: 100%;
                }
            }
            .ico{
                margin: 1vh 0;
                color: $ipt-font-color;
                font-size: $title-font-size * 2.5;
                user-select: none;
            }
            :deep(){
                .el-card__body{
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
        .more{
            float: right;
            background: #FFF;
            color: $title-font-color;
        }
        .modes{
            width: 100%;
            // margin-top: 7vh;
            // @include flex-box;
            // flex-wrap: nowrap;
            display: flex;
            justify-content: space-between;
            .fun{
                width: 30%;
                .title{
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
                    margin-top: 2vh;
                    .footer{
                        @include flex-box;
                    }
                }
            }
            .imgShow{
                width: 65%;
            }
        }
    }
}
</style>