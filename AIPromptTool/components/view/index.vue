<script setup>
import { ref, onMounted } from 'vue';

// 控制弹窗显示状态
const showPopup = ref(false);

// 固定的GitHub链接数据
const githubLinks = [
  { id: 1, name: '项目仓库', url: 'https://github.com/shuijiaowang/AIPromptTool.git' },
  { id: 2, name: '文档仓库', url: 'https://github.com/shuijiaowang/shuijiaowangGoService.git' },
  { id: 3, name: 'API仓库', url: 'https://github.com/example/api' }
];

// 接收主世界脚本的消息
onMounted(() => {
  // 监听来自主世界的响应
  window.addEventListener('message', (event) => {
    if (event.source === window && event.data.type === 'LINK_INSERT_RESPONSE') {
      if (event.data.success) {
        console.log('链接已成功插入');
        showPopup.value = false; // 插入成功后关闭弹窗
      } else {
        console.error('插入失败:', event.data.error);
      }
    }
  });
});

// 点击链接触发的事件 - 通过消息发送到主世界
const handleLinkClick = (link) => {
  console.log('准备插入链接:', link.url);

  // 向主世界脚本发送消息
  window.postMessage({
    type: 'INSERT_GITHUB_LINK',
    url: link.url
  }, '*');
};

// 切换弹窗显示状态
const togglePopup = () => {
  showPopup.value = !showPopup.value;
};
</script>

<template>
  <div class="relative inline-block">
    <!-- 触发按钮 -->
    <button
        @click="togglePopup"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
    >
      查看GitHub链接
    </button>

    <!-- 弹窗 (150×120px) -->
    <div
        v-if="showPopup"
        class="absolute top-full left-0 mt-2 w-[150px] h-[120px] bg-white border border-gray-200 rounded-md shadow-lg p-2 overflow-y-auto z-10"
        @click.stop
    >
    <ul class="list-none p-0 m-0">
      <li
          v-for="link in githubLinks"
          :key="link.id"
          @click="handleLinkClick(link)"
          class="px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        {{ link.name }}
      </li>
    </ul>
  </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条样式（可选） */
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}
</style>