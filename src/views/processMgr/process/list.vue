<template>
    <div class="processListAll">
        <div class="funTitle">审批申请列表</div>
        <el-card shadow="hover" class="selectBarAll">
            <el-select
            v-model="chooseData"
            filterable
            placeholder="选择统计的日期"
            style="margin-right: 1vw;"
            >
                <el-option
                v-for="(data,i) in testData"
                :key="i"
                :label="data"
                :value="data"
                />
            </el-select>
            <el-select
            v-model="chooseData"
            filterable
            placeholder="选择统计的日期"
            style="margin-right: 2.5vw;"
            >
                <el-option
                v-for="(data,i) in testData"
                :key="i"
                :label="data"
                :value="data"
                />
            </el-select>
            <el-input
            v-model="input"
            style="width: 42vw"
            placeholder="请输入审批申请的标题或描述"
            clearable
            />
        </el-card>
        <el-card shadow="hover" class="tabCard" style="margin-top: 2.5vh;">
            <div class="tabBar">
                <div class="types">
                    <span class="type" :style="getActStyle(i)" v-for="(it,i) in 3" :key="i" @click="chooseIndex = i">出勤类申请</span>
                </div>
                <div class="block">
                    <el-date-picker
                        v-model="value2"
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
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="Date" width="180" />
                    <el-table-column prop="name" label="Name" width="180" />
                    <el-table-column prop="address" label="Address" />
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import {getAllProcessTypes} from '@/api/processType'

let chooseIndex = ref(0)
function getActStyle(i){
    const actColor = 'rgb(106,183,255)'
    return chooseIndex.value === i ? {color: actColor,borderBottom: `${actColor} 2.5px solid`}: "";
}
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const value2 = ref('')
let chooseData = ref()
let testData = ref(["111111111111111","2222222222222222","33333333333333"])

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
        }
        
    }

}
</style>