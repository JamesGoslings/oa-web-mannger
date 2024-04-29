<template>
    <span class="iptBox">
        <div class="ico iconfont">&#xe740;</div>
        <input class="ipt" type="text" placeholder="搜索"/>
    </span>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
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
        height: 80%;
        font-size: 8px;
        font-weight: bold;
        color: rgb(194,202,226);
    }
}
</style>