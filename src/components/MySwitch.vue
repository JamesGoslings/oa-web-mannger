<template>
    <input type="checkbox"/>
</template>

<script setup>
let props = defineProps({
    rightBackColor:{
        type: String,
		default(){
			return 'limegreen'
		}
	},
    rightFontColor:{
        type: String,
		default(){
			return 'blank'
		}
	},

    wrongBackColor:{
        type: String,
		default(){
			return '#777'
		}
	},
    wrongFontColor:{
        type: String,
		default(){
			return '#FFF'
		}
	},
    btnColor: {
        type: String,
        default(){
            return '#FFF'
        }
    }
})
let rightBackColor = ref(props.rightBackColor)
let rightFontColor = ref(props.rightFontColor)
let wrongBackColor = ref(props.wrongBackColor)
let wrongFontColor = ref(props.wrongFontColor)
let btnColor = ref(props.btnColor)
</script>

<style lang="scss" scoped>

input[type="checkbox"] {
        box-shadow: 0px 0px 1px #928c8c64;
        appearance: none;
        width: 3vw;
        height: 3vh;
        position: relative;
        border-radius: 16px;
        cursor: pointer;
        background-color: v-bind(wrongBackColor);
}
input[type="checkbox"]:before {
        content: "";
        position: absolute;
        width: 1.2vw;
        height: 2.2vh;
        background: v-bind(btnColor);
        left: 2px;
        top: 2px;
        border-radius: 50%;
        transition: left cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
 }
 input[type="checkbox"]:after {
        // content: "√ ×";
        // text-indent: 12px;
        word-spacing: 4px;
        display: inline-block;
        white-space: nowrap;
        // color: white;
        color: v-bind(wrongFontColor);
        // font: 14px/30px monospace;
        font: 9px monospace;
        font-weight: bold;
}
input[type="checkbox"]:hover:before {
        // box-shadow: inset 0px 0px 5px 0px black;
}
input[type="checkbox"]:checked {
        background-color: v-bind(rightBackColor);
}
input[type="checkbox"]:checked:before {
        left: 1.8vw;
}
input[type="checkbox"]:checked:after {
        // color: black;
        color: v-bind(rightFontColor);
}
</style>