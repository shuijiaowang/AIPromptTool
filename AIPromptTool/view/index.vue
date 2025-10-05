<script setup>

//我现在需要一个好看些的UI和一些功能。是否需要拆分组件？
//首先是一个button，点击后，会弹出一个弹窗，弹窗里面还有分栏切换按钮那种？
//默认页是链接页（主要是github，其他链接也可以）。文字+链接，然后提供一个修改按钮，点击后，文字变成输入框可以修改文字或链接。
//另一个页是文字映射，展示，词语+句子，同样可以修改。
//还缺少增删改，不需要查
//溢出了就滚动条，不用分页，查询所有。

//目前还有一个问题就是数据存储？数据都可以存到哪些地方？
//content脚本可以存储数据吗
//background脚本存储到本地数据和page网页的存储的数据的位置相同吗？好像是不同
//还是存到远程数据库中，实现数据同步？好像也可以，我需要在家和公司不同的电脑上使用。

//还需要一个按钮，点击之后把input输入框中的词语映射成相应的句子这样一个功能，还是绑定网页原有的发送按钮？

import {onMounted, ref} from 'vue';
import {useDrag} from "@/components/useDrag.js";
import Popup from "@/components/Popup.vue";
import BeforeSendButton from "@/components/BeforeSendButton.vue";
// 控制弹窗显示状态
const isShowPopup = ref(false);
// 切换弹窗显示状态
const togglePopup = () => {
  isShowPopup.value = !isShowPopup.value;
};
// 接收主世界脚本的消息
onMounted(() => {

});

const containerRef = ref(null);
const dragHandleRef = ref(null); // 拖拽把手

// 调用拖拽逻辑
const {position, onMousedown} = useDrag(dragHandleRef,'containerPos');
</script>
<template>
  <div class="container"
       ref="containerRef"
       :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      position: 'fixed',

    }"
       @mousedown="onMousedown">
    <!-- 拖拽把手 -->

    <!-- 触发按钮 -->
    <button class="btn" @click="togglePopup">
      AI快捷回复
    </button>
    <div class="drag-handle" ref="dragHandleRef" @mousedown="onMousedown">
    </div>
    <!-- 弹窗 (150×120px) -->
    <div v-if="isShowPopup" class="popup" @click.stop>
      <popup></popup>
    </div>
<!--    添加一个按钮，这个按钮的位置靠近页面原有的button附近？感觉需要通过js来操作？点击之后会触发一个方法-->
    <before-send-button/>
  </div>
</template>

<style scoped>
.container {
  display: inline-block;
}

.btn {
  width: 100px;
  background-color: white;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background-color: #d3e3fd;
}

.popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  width: auto;
  height: auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 4px;
  overflow-y: auto;
  z-index: 10;
}

/* 自定义滚动条样式 */
.popup::-webkit-scrollbar {
  width: 4px;
}

.popup::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}
.drag-handle {
  cursor: move;
  background: #f0f0f0;
  padding: 4px;
}

</style>