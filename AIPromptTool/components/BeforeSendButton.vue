<template>
  <div
      ref="buttonContainer"
      class="before-send-button"
      :style="buttonStyle"
  >
    <button class="custom-btn" @click="mainStore.handleInputProcessing('翻译，翻译,翻译')">
      <span role="img" class="btn-icon">✨</span>
      <span class="btn-text">快捷发送</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useMainStore} from "@/stores/mian.js";
const mainStore=useMainStore()
// 1. URL与选择器的映射关系配置
// 支持字符串匹配、正则匹配两种方式
const URL_SELECTOR_MAP = [
  {
    url: 'doubao.com/chat', // 豆包聊天页
    selectors: ['[data-testid="chat_input_send_button"]']
  },
  {
    url: /deepseek\.com/, // DeepSeek网站（正则匹配）
    selectors: ['#flow-end-msg-send']
  },
  {
    url: 'default', // 现在默认测试豆包聊天页
    selectors: ['[data-testid="chat_input_send_button"]']
  }
];

const buttonContainer = ref(null);
const buttonStyle = ref({
  position: 'fixed', // 改为fixed定位，相对于视口
  zIndex: '9999',
  display: 'none'
});

// 2. 根据当前URL获取对应的选择器
const getSelectorsByUrl = () => {
  const currentUrl = window.location.href;

  // 优先匹配具体规则
  for (const item of URL_SELECTOR_MAP) {
    if (item.url === 'default') continue;

    // 支持字符串包含和正则匹配
    const isMatch = typeof item.url === 'string'
        ? currentUrl.includes(item.url)
        : item.url.test(currentUrl);

    if (isMatch) return item.selectors;
  }

  // 匹配默认规则
  return URL_SELECTOR_MAP.find(item => item.url === 'default').selectors;
};

// 3. 查找目标发送按钮
const findTargetButton = () => {
  const selectors = getSelectorsByUrl();
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
};

// 4. 计算按钮位置（悬浮在目标按钮上方）
const calculatePosition = (targetButton) => {
  if (!targetButton || !buttonContainer.value) return;

  const targetRect = targetButton.getBoundingClientRect();
  const customBtnRect = buttonContainer.value.getBoundingClientRect();

  // 定位在目标按钮正上方，间距8px
  return {
    left: `${targetRect.left-12}px`, // 与目标按钮左对齐
    top: `${targetRect.top- 38}px`, // 上方偏移
    display: 'block',
    position: 'fixed'
  };
};

// 5. 初始化与监听
onMounted(() => {
  // 定位更新函数
  const updatePosition = () => {
    const targetButton = findTargetButton();
    if (targetButton) {
      buttonStyle.value = calculatePosition(targetButton);
    } else {
      buttonStyle.value.display = 'none'; // 未找到目标按钮时隐藏
    }
  };

  // 初始定位
  updatePosition();

  // 监听窗口变化
  window.addEventListener('resize', updatePosition);

  // 监听滚动（处理页面滚动时的位置更新）
  window.addEventListener('scroll', updatePosition);

  // 监听DOM变化（处理动态加载的按钮）
  const observer = new MutationObserver(updatePosition);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true, // 监听属性变化（如按钮显示/隐藏）
    attributeFilter: ['style', 'class']
  });

  // 清理函数
  return () => {
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition);
    observer.disconnect();
  };
});
</script>

<style scoped>
.before-send-button {
  /* 保持容器基础样式 */
}

.custom-btn {
  display: inline-flex;
  align-items: center;
  padding: 1px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  width: 36px;
}

.custom-btn:hover {
  background-color: #359e69;
  transform: translateY(-1px);
}

.custom-btn:active {
  transform: translateY(0);
}

</style>