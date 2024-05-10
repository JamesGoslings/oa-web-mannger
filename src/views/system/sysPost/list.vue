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
                <enterButton class="more" txt="查看全部" @click="openDialog = true"/>
            </div>
            <div class="modes">
                <el-card class="fun" shadow="hover">
                    <div class="title">
                        <changeSwitch @value-sent="changeType" :type="funType"/>
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
                                <el-button v-if="funType === 1" :disabled="!checkedPost.id"
                                @click="removeThisPost()" type="danger">删除</el-button>
                                <el-button type="primary" @click="saveOrUpdateOPost()"
                                 :disabled="!checkedPost.id && funType === 1">保存</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-card>
                <!-- </el-card> -->
                <el-card class="imgShow" shadow="hover">
                    <div autoresize ref="pieone" id="pieone"></div>
                </el-card>
            </div>
        </div>

        <!-- 查看所有岗位时的弹窗界面 -->
        <el-dialog v-model="openDialog" title="全部岗位" width="900">
            <myInputBar class="myIpt" radius="10px" text="搜索岗位，请输入名称或编码"
            @on-enter="handleEnter" v-model="iptKeyword" />
            <el-radio-group v-model="choosePostIndex">
                <el-radio :value="post.id" v-for="post in totalPosts" :key="post.id" @click="choosecard(post)">
                    <div class="myCard">
                        <div class="msg">
                            <div class="cardTitle">{{post.name}}</div>
                            <div class="myCardField">{{`部门：${post.deptName}`}}</div>
                            <div class="myCardField">{{`编码：${post.postCode}`}}</div>
                        </div>
                        <span class="iconfont ico">&#xe641;</span>
                    </div> 
                </el-radio>
            </el-radio-group>
        </el-dialog>

    </div>
</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue"
import { getAllTotalPostList,getNewCode,updatePost,getTotalPostsByKeyword,removeOnePostById,savePost } from '@/api/post';
import enterButton from '@/components/EnterButton.vue';
import changeSwitch from '@/components/ChangeSwitch.vue';
import { getAllDept } from '@/api/dept'
import { postTypeList } from '@/utils/staticData'
import{useSimpleConfirm,useTips} from '@/utils/msgTip'
import { isSpace } from "@/utils/stringUtil";
import * as echarts from 'echarts'


// 存饼图数据
let pieData = [{value: 0,name: ''}]
// 设置饼图数据
function setEchartsData(){
    let posts = totalPosts.value
    for(var i = 0;i < 5;i++){
        pieData[i] = {value: 0,name: ''}
        pieData[i].value = posts[i].count
        pieData[i].name = posts[i].name
    }
    pieData.forEach(data=>{
        console.log(data)
    })
    // 加载数据
    getEcharts()
}

const pieone = ref(null)
// 定义方法
function getEcharts(){
// 初始化Dom元素进行绘图
    const PieDome = echarts.init(pieone.value)

    PieDome.setOption({
        // 图例设置
        legend: {
            top: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 系列数据设置
        series: [{
            name: '岗位在职人数占比', // 系列名称
            type: 'pie', // 图表类型为饼图
            radius: [30, 150], // 饼图的内外半径
            center: ['50%', '50%'], // 饼图的中心位置
            roseType: 'area', // 玫瑰图类型为区域玫瑰图
            itemStyle: {
                borderRadius: 8 // 数据项的样式设置
            },
            // 数据
            data: pieData
        }]
    })
}






// 存输入的值
let iptKeyword = ref('')
function handleEnter(){
    if(isSpace(iptKeyword.value)){
        getAllTotalPosts()
    }else{
        getPostsByKey()
    }
}
// 进行条件查询并显示数据
const getPostsByKey = async()=>{
    let {data} = await getTotalPostsByKeyword(iptKeyword.value)
    totalPosts.value = data
}
// 在对话框中选中时的方法
function choosecard(post){
    openDialog.value = false
    showPostMsg(post)
}
// 绑定单选框的index
let choosePostIndex = ref(-1)
// 控制列表弹窗的打开
let openDialog = ref(false)


// 删除单个岗位
function removeThisPost(){
    useSimpleConfirm(`你确定要删除岗位 “${checkedPost.value.name}” 吗？？？`).then(async()=>{
        let data = await removeOnePostById(checkedPost.value.id)
        // 清除编辑数据
        checkedPost.value = {}
        // 刷新页面数据
        await getAllTotalPosts()
        useTips(`成功删除 “${checkedPost.value.name}” `,data)
    })
}
// 进入修改，新建的总方法
function saveOrUpdateOPost(){
    if(funType.value === 0){
        saveThisPost()
    }else{
        updateThisPost()
    }
}
// 新建岗位的具体方法
function saveThisPost(){
    useSimpleConfirm('你确定要添加该岗位吗？').then(async ()=>{
        checkedPost.value.id = null
        let data = await savePost(checkedPost.value);
        useTips('成功添加岗位',data)
    })
}
// 修改岗位的具体方法
function updateThisPost(){
    useSimpleConfirm(`你确定保存对 “${checkedPost.value.name}” 的修改吗？`).then(async ()=>{
        checkedPost.value.updateTime = null
        let data = await updatePost(checkedPost.value);
        useTips(`成功修改 “${checkedPost.value.name}” `,data)
    })
}

// 动态更新code码
const changePostCode = async()=>{
    let post = checkedPost.value
    if( funType.value === 0 && (!post.deptId) || (post.type == null)){
        return;
    }
    if(post.id === undefined || post.id === null){
        post.id = -1;
    }
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
    // 设置饼图数据
    pieData.value = setEchartsData()
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
    // 更新恢复数据，避免未完成修改时，显示信息有误
    getAllTotalPosts()
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
                #pieone{
                    width: 50vw;
                    height: 50vh;
                }
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
            .el-radio{
                height: auto;
                margin: 1vh 0;
            }
        }
    }
    .myIpt{
        margin: 1vh 0;
        width: 80%;
        height: 3vh;
    }
    .myCard{
        display: flex;
        justify-content: space-between;
        width: 20vw;
        min-height: 5vh;
        box-shadow: $small-box-shadow;
        padding: 1vh 1vw;
        .msg{
            user-select: auto;
            margin: 0 1vw;
            .cardTitle{
                color: $title-font-color;
                font-size: $title-font-size;
                font-weight: bold;
                margin: 0.5vh 0;
            }
            .myCardField{
                color: $third-show-color;
                font-size: $common-font-size;
                user-select: auto;
            }
        }
        .ico{
            color: $ipt-font-color;
            font-size: $title-font-size * 2.5;
            user-select: none;
        }
    }
    .myCard:hover{
        box-shadow: $large-box-shadow;
    }
    .myCard:active{
        background: $main-back-color;
    }
}

</style>