<template>
    <button class="iconfont my-button canClick" v-html="content" :title="title"></button>
</template>

<script setup>
let props = defineProps({
    content:{
        type: String,
		default(){
			return '&#xe8b6;'
		}
	},
    fontSize:{
        type: String,
        default(){
            return '20px'
        }
    },
    mainBackColor:{
        type: String,
        default(){
            return '#1676FF'
        }
    },
    fontColor: {
        type: String,
        default(){
            return '#FFF'
        }
    },
    radius:{
        type: String,
        default(){
            return '2px'
        }
    },
    title:{
        type: String,
        default(){
            return '按钮'
        }
    },
})
let mainBackColor = ref(props.mainBackColor)
let fontSize = ref(props.fontSize)
let fontColor = ref(props.fontColor)
let radius = ref(props.radius)
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.my-button{
    border: 0;
    cursor: pointer;
	position: relative;
	// width: 200px;
	// height: 40px;
	// line-height: 40px;
	background: #ddd;
	// border-radius: 80px;
    border-radius: v-bind(radius);
	font-family: PingFang-SC-Heavy;
	// font-weight: 500;
	color: v-bind(fontColor);
	// color: rgb(143, 150, 172);
    padding-top: 0.25vw;
    padding-bottom: 0.25vw;
	letter-spacing: 0;
	text-align: center;
	font-size: v-bind(fontSize);
	overflow: hidden;
    user-select: none;
    box-shadow: 0px 0px 1px #928c8c64;
}
.my-button.canClick{
	background: v-bind(mainBackColor);
}
.my-button::after {
  content: "";
  background: #f1f1f1;
  display: block; 
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width:1000px;
  height:1000px;
  border-radius: 100%;
  opacity: 0;
  transition: all 0.8s
}
.my-button.canClick:active:after {
  width: 0.5vw;
  height: 0.5vw;
  opacity: 0.6;
  transition: 0s
}
</style>