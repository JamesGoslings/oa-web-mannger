<!-- 悬停出现箭头的按钮 -->
<template>
    <div class="btn4"><span>{{txt}}</span></div>
</template>

<script setup>
let props = defineProps({
	txt: {
		type: String,
		default(){
			return '进入'
		}
	},
    fontSize: {
        type: String,
        default(){
            // return '20px'
            return '15px'
        }
    },
    height: {
        type: String,
        default(){
            return '40px'
        }
    }
})
let fontSize = ref(props.fontSize)
let height = ref(props.height)
</script>

<style lang="scss" scoped>
@import '/src/styles/commonStyles.scss';
.btn4 {
//   display: inline-block;
    @include flex-box;
    border-radius: 20px;
    background-color: #1676FF;
    border: none;
    color: #ffff;
    text-align: center;
    font-size: v-bind(fontSize);
    width: 80px;
    width: 8vw;
    height: v-bind(height);
    line-height: v-bind(height);
    transition: all 0.5s;
    cursor: pointer;
    vertical-align: middle;
    user-select: none;
}
 
.btn4 span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}
 
.btn4 span::after {
  content: ">>";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}
 
.btn4:hover span {
  padding-right: 30px;
}
 
.btn4:hover span::after {
  opacity: 1;
  right: 0;
}
.btn4:active span:active{
    color: #1676FF;
    // box-shadow: 0px 0px 7px #928c8c64;
}
</style>