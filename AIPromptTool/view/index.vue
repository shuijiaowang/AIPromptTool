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
import {useLinkStore} from "@/stores/linkStore.js";
import {useTextStore} from "@/stores/textStore.js";
import {useDrag} from "@/components/useDrag.js";
// 控制弹窗显示状态
const showPopup = ref(false);
const linkStore = useLinkStore()
const textStore = useTextStore()

// 接收主世界脚本的消息
onMounted(() => {

});

// 点击链接触发的事件 - 通过消息发送到主世界
const handleLinkClick = (link) => {
  // 向主世界脚本发送消息
  window.postMessage({
    type: 'INSERT_LINK',
    url: link.url
  }, '*');
};
const containerRef = ref(null);
// 切换弹窗显示状态
const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
// 调用拖拽逻辑
const {position, onMousedown} = useDrag(containerRef);
</script>

<template>
  <div class="container"
       ref="containerRef"
       :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      position: 'absolute'
    }"
       @mousedown="onMousedown">
    <!-- 触发按钮 -->
    <button class="btn" @click="togglePopup">
      查看GitHub链接
    </button>



    <!-- 弹窗 (150×120px) -->
    <div v-if="showPopup" class="popup" @click.stop>
      <ul class="link-list">
        <li
            v-for="link in linkStore.links"
            :key="link.id"
            @click="handleLinkClick(link)"
            class="link-item"
        >
          {{ link.name }}{{ link.url }}
        </li>
      </ul>
      <ul class="link-list">
        <li
            v-for="text in textStore.texts"
            :key="text.id"
            @click="handleTextClick(text)"
            class="text-item"
        >
          {{ text.trigger }}{{ text.prompt }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  cursor: move;
  display: inline-block;
}

.btn {

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
  margin-top: 8px;
  width: auto;
  height: auto;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  overflow-y: auto;
  z-index: 10;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-item {
  padding: 6px 8px;
  cursor: pointer;
  font-size: 14px;
  color: #2563eb;
  transition: background-color 0.2s, color 0.2s;
}

.link-item:hover {
  background-color: #f3f4f6;
  color: #1d4ed8;
}

/* 自定义滚动条样式 */
.popup::-webkit-scrollbar {
  width: 4px;
}

.popup::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}
</style>