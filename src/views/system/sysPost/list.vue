<template>
    <div class="postAll">
        <div class="funTitle">岗位列表</div>
        <div class="funMode">
            <el-card class="cardOne" shadow="hover" v-for="post in showPosts" :key="post.id" >
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
                        <changeSwitch />
                    </div>
                    <div>
                        表单内容
                    </div>
                </el-card>
                <el-card class="imgShow" shadow="hover">
                    <div>6666</div>
                    6666
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getAllTotalPostList } from '@/api/post';
import enterButton from '@/components/EnterButton.vue';
import changeSwitch from '@/components/ChangeSwitch.vue';
import { onMounted } from 'vue';

// 存显示的岗位
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

onMounted(()=>{
    getAllTotalPosts()
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
            @include flex-box;
            flex-wrap: nowrap;
            justify-content: space-between;
            .fun{
                width: 40%;
                .title{
                    width: 100%;
                }
            }
            .imgShow{
                width: 55%;
            }
        }
    }
}
</style>