<template>
    <div class="topAll">
        <span class="iptBox">
            <div class="ico iconfont">&#xe740;</div>
            <input class="ipt" type="text" placeholder="搜索"/>
        </span>
        <span class="user">
            <img class="avatar" src="/src/assets/img/avatar.jpg"/>
            <span class="name">admin</span>
            <span class="open iconfont">&#xe656;</span>
        </span>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.topAll{
    position: fixed;
	top: 0;
	right: 0;
	width: 80%;
    height: 8vh;
    padding-left: 2%;
	overflow: hidden;
    background: #FFF;
    border-radius: 2px;
    box-shadow: 0px 0px 3px #928c8c64;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    .iptBox{
        width: 40%;
        height: 50%;
        border: rgb(228,229,237) 1px solid;
        border-radius: 7px;
        background: rgb(250,252,254);
        display: flex;
        // justify-content: center;
        align-items: center;
        .ico{
            width: 10%;
            font-size: 10px;
            color: rgb(169,175,191);
            text-align: center;
        }
        input::placeholder{
            font-size: 8px;
            font-weight: bold;
            color: rgb(194,202,226);
        }
        .ipt{
            border: 0px;
            background: rgb(253,253,254);
            outline: none;
            width: 80%;
            height: 90%;
            font-size: 8px;
            font-weight: bold;
            color: rgb(194,202,226);
        }
    }
    .user{
        height: 100%;
        display: flex;
        align-items: center;
        .avatar{
            height: 60%;
            border-radius: 50%;
        }
        .name{
            padding: 0 1.8rem;
            font-size: 2vh;
            font-weight: bold;
            color: rgb(52,62,99);
        }
        .open{
            font-size: 1.5vh;
            margin-right: 0.6rem;
            color: rgb(161,169,198);
        }
    }
}
</style>