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

import { ref, onMounted } from 'vue';
// 控制弹窗显示状态
const showPopup = ref(false);

// 固定的GitHub链接数据
const githubLinks = [
  { id: 1, name: '项目仓库', url: 'https://github.com/shuijiaowang/AIPromptTool.git' },
  { id: 2, name: '文档仓库', url: 'https://github.com/shuijiaowang/shuijiaowangGoService.git' },
  { id: 3, name: 'API仓库', url: 'https://github.com/example/api' }
];
let textRule = [
  { id: 1, trigger: '翻译', prompt: '翻译为中文' },
  { id: 2, trigger: '英语', prompt: '给这个变量或是函数起几个英语名' },
  { id: 3, trigger: '解释', prompt: '解释这段代码的功能' }
];

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

// 切换弹窗显示状态
const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
</script>

<template>
  <div class="container">
    <!-- 触发按钮 -->
    <button class="btn" @click="togglePopup">
      查看GitHub链接
    </button>

    <!-- 弹窗 (150×120px) -->
    <div v-if="showPopup" class="popup" @click.stop>
      <ul class="link-list">
        <li
            v-for="link in githubLinks"
            :key="link.id"
            @click="handleLinkClick(link)"
            class="link-item"
        >
          {{ link.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: inline-block;
}

.btn {
  padding: 8px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.btn:hover {
  background-color: #4338ca;
}

.popup {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  width: 150px;
  height: 120px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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