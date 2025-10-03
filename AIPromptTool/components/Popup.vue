<!-- components/Popup.vue -->
<template>
  <div class="popup-container">
    <!-- 分栏切换按钮 -->
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'link' }"
          @click="activeTab = 'link'"
      >
        链接管理
      </button>
      <button
          :class="{ active: activeTab === 'mapping' }"
          @click="activeTab = 'mapping'"
      >
        文字映射
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 链接列表 -->
      <div v-if="activeTab === 'link'" class="list-container">
        <ItemEditor
            v-for="item in links"
            :key="item.id"
            type="link"
            :item="item"
        />
        <button class="add-btn" @click="linkStore.addLink">+ 添加链接</button>
      </div>

      <!-- 文字映射列表 -->
      <div v-if="activeTab === 'mapping'" class="list-container">
        <ItemEditor
            v-for="item in mappings"
            :key="item.id"
            type="mapping"
            :item="item"
        />
        <button class="add-btn" @click="mappingStore.addMapping">+ 添加映射</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ItemEditor from './ItemEditor.vue';

import {useLinkStore} from "@/stores/linkStore.js";
import {useMappingStore} from "@/stores/mappingStore.js";

const linkStore= useLinkStore()
const mappingStore =useMappingStore()
const links = ref(linkStore.links);
const mappings = ref(mappingStore.mappings);

// 激活的标签页
const activeTab = ref('link');

</script>

<style scoped>
.popup-container {
  min-width: 400px;
  max-height: 300px; /* 限制高度，溢出滚动 */
  overflow-y: auto;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
}

.tabs button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.tabs button.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}

.list-container {
  padding: 4px;
}

.add-btn {
  margin-top: 8px;
  width: 100%;
  padding: 6px;
  border: 1px dashed #ddd;
  background: #f9f9f9;
  cursor: pointer;
}

.add-btn:hover {
  background: #f0f0f0;
}
</style>