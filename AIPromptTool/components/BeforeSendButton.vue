<template>
  <div
      ref="buttonContainer"
      class="before-send-button"
      :style="buttonStyle"
  >
    <button class="custom-btn" @click="mainStore.handleInputProcessing(getInputText())" @keydown="handleKeyDown">
      <span role="img" class="btn-icon">✨</span>
      <span class="btn-text">快捷发送</span>
    </button>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useMainStore} from "@/stores/mian.js";
import { SITE_CONFIGS } from '@/config/siteConfig.js';
const mainStore=useMainStore()
const buttonContainer = ref(null);
const buttonStyle = ref({
  position: 'fixed', // 改为fixed定位，相对于视口
  zIndex: '9999',
  display: 'none'
});

function handleClick() {
  mainStore.handleInputProcessing(getInputText())
}
const keyHistory = ref([]) // 记录最近按键时间
function handleKeyDown(e) {
  if (e.code === 'Space') {
    e.preventDefault() // 防止页面滚动
    const now = Date.now()
    keyHistory.value.push(now)
    // 只保留最近 3 次按键，且在 500ms 内
    keyHistory.value = keyHistory.value
        .filter(t => now - t < 500)
        .slice(-3)

    if (keyHistory.value.length >= 3) {
      handleClick() // 触发点击事件
      keyHistory.value = [] // 重置
    }
  }
}

// 1. 根据当前URL获取匹配的网站配置
const getCurrentSiteConfig = () => {
  const currentUrl = window.location.href;

  // 优先匹配具体网站规则
  for (const config of SITE_CONFIGS) {
    const isMatch = typeof config.url === 'string'
        ? currentUrl.includes(config.url)
        : config.url.test(currentUrl);

    if (isMatch) return config;
  }

  // 未匹配到任何规则时返回null（可根据需求设置默认配置）
  return null;
};

// 2. 查找目标发送按钮（基于当前网站配置）
const findTargetButton = () => {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return null;

  // 使用配置中的发送按钮选择器查找元素
  return document.querySelector(siteConfig.sendButtonSelector);
};
//3.获取目标输入框中的内容
const getInputText = () => {
  const siteConfig = getCurrentSiteConfig();
  if (!siteConfig) return null;
  return document.querySelector(siteConfig.inputSelector).textContent.trim(); //这里对吗
}
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

  document.addEventListener('keydown', handleKeyDown)
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
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
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