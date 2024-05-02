<template>
    <button class="iconfont btn" @click="changeBackColorTemp()" :style="{backgroundColor: tempColor}">{{txt}}</button>
</template>

<script setup>
let tempColor = ref('')
function changeBackColorTemp(){
    tempColor.value = 'rgba(221,221,221)'
    setTimeout(()=>{
        tempColor.value = ''
    },200)
}
let props = defineProps({
	actColor: {
		type: String,
		default(){
			return '#4361ee'
		}
	},
    backColor: {
        type: String,
        default(){
            return 'rgb(244,249,255)'
        }
    },
    txt: {
        type: String,
        default(){
            return '按钮'
        }
    },
    textSize:{
        type: String,
        default(){
            return '15px'
        }
    }
})
// 指定按钮动态边框和文字颜色 rgb(244,249,255)
let buttonColor = ref(props.actColor)
let txtSize = ref(props.textSize)
let backColor = ref(props.backColor)
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.btn{
    font-size: v-bind(txtSize);
}
button {
    margin-right: 1vw;
    border-radius: 5px;
    box-shadow: 0px 0px 1px #928c8c64;
    border: 0;
    // background: none;
    background: v-bind(backColor);
    text-align: center;
    text-transform: uppercase;
    color: v-bind(buttonColor);
    font-weight: bold;
    position: relative;
    outline: none;
    padding: 1vh 1vw;
    box-sizing: border-box;
}

button::before, button::after {
    border-radius: 2px;
    box-sizing: inherit;
    position: absolute;
    content: '';
    border: 1px solid transparent;
    width: 0;
    height: 0;
}

button::after {
    bottom: 0;
    right: 0;
}

button::before {
    top: 0;
    left: 0;
}

button:hover::before, button:hover::after {
    width: 100%;
    height: 100%;
}

button:hover::before {
    // background: rgba(221,221,221,0.3);

    border-top-color: v-bind(buttonColor);
    border-right-color: v-bind(buttonColor);
    transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
}

button:hover::after {
    border-bottom-color: v-bind(buttonColor);
    // background: rgba(221,221,221,0.3);
    border-left-color: v-bind(buttonColor);
    transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s, height 0.3s ease-out 1s;
}
</style>