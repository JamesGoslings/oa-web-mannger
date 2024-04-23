<template>
    <div class="globalSty">
        <div class="bigCard">
            <div class="imgBox">
                <img class="img" src="/src/assets/oa-img.png"/>
            </div>
            <div class="msgCardBox">
                <div class="msgCard">
                    <div class="title">登录账号</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.globalSty{
    position: fixed;
	top: 0;
	left: 0;
	width: 100%; 
	height: 100%;
	overflow: hidden;
    background: url('/src/assets/back.png');
    display: flex;
    justify-content: center;
    align-items: center;
    .bigCard{
        width: 60%;
        height: 60%;
        background: #FFF;
        border-radius: 10px;
        box-shadow: 0px 0px 10px #928c8c64;
        display: flex;
        .imgBox{
            width: 60%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .img{
                width: 280px;
                height: 280px;
            }
        }
        .msgCardBox{
            width: 40%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .msgCard{
                padding: 20px 10px;
                height: 70%;
                width: 70%;
                box-shadow: 0px 0px 8px #928c8c64;
                border-radius: 5px;
                .title{
                    width: 100%;
                    text-align: center;
                    color: rgb(235,229,225);
                }
            }
        }
    }
}
</style>