<template>
  <div class="item-container">
    <!-- 展示状态 -->
    <div v-if="!editMode" class="item-view">
      <!-- 链接类型：文字 + 链接 -->
      <template v-if="type === 'link'">
        <span
            class="text-ellipsis"
            @click="handleLinkClick"
        >
          {{ item.text }}
        </span>
        <a
            :href="item.url"
            target="_blank"
            class="link-ellipsis"
        >
          {{ item.url }}
        </a>
      </template>

      <!-- 文字映射类型：词语 + 句子 -->
      <template v-if="type === 'mapping'">
        <span
            class="text-ellipsis"
            @click="handleTextClick"
        >
          {{ item.trigger }}
        </span>
        <span class="sentence-ellipsis">{{ item.prompt }}</span>
      </template>
      <!-- 新增：默认追加复选框（展示状态） -->
      <div class="default-checkbox">
        <label>
          <input
              type="checkbox"
              v-model="item.isDefault"
          >
        </label>
      </div>

      <div class="item-actions">
        <button @click="handleEdit">修改</button>
        <button @click="handleDelete">删除</button>
      </div>
    </div>

    <!-- 编辑状态 -->
    <div v-else class="item-edit">
      <template v-if="type === 'link'">
        <input v-model="tempItem.text" placeholder="文字">
        <input v-model="tempItem.url" placeholder="链接">
      </template>

      <template v-if="type === 'mapping'">
        <input v-model="tempItem.trigger" placeholder="词语">
        <input v-model="tempItem.prompt" placeholder="句子">
      </template>

      <div class="item-actions">
        <button @click="handleSave">保存</button>
        <button @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {useLinkStore} from "@/stores/linkStore.js";
import {useMappingStore} from "@/stores/mappingStore.js";
const linkStore=useLinkStore()
const mappingStore =useMappingStore()

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => ['link', 'mapping'].includes(v)
  },
  item: {
    type: Object,
    required: true
  }
});

const editMode = ref(false);
const tempItem = ref({});

// 初始化临时数据
onMounted(() => {
  resetTempItem();
});

const resetTempItem = () => {
  tempItem.value = { ...props.item };
};

const handleEdit = () => {
  editMode.value = true;
  resetTempItem();
};

const handleCancel = () => {
  editMode.value = false;
  resetTempItem(); // 重置临时数据
};
//修改保存
const handleSave = () => {
  if (props.type === 'link') {
    console.log("修改保存：t.value是啥", props.item.id, tempItem.value)
    linkStore.updateLink(props.item.id, tempItem.value);
  } else if (props.type === 'mapping') {
    mappingStore.updateMapping(props.item.id, tempItem.value);
  }
  editMode.value = false;
};

const handleDelete = () => {
  if (props.type === 'link') {
    linkStore.deleteLink(props.item.id);
  } else if (props.type === 'mapping') {
    mappingStore.deleteMapping(props.item.id);
  }
};

//点击事假
const handleTextClick = () => {
  //追加文本
  window.postMessage({ type:'INSERT_TEXT',text: props.item.prompt })
};
const handleLinkClick = () => {
  //链接复制到输入框
  window.postMessage({ type:'INSERT_LINK',url: props.item.url })
};
</script>

<style scoped>
.item-container {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}

/* 展示模式使用flex布局 */
.item-view {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 过长隐藏样式 */
.text-ellipsis,
.link-ellipsis,
.sentence-ellipsis {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 短文字样式优化 */
.text-ellipsis {
  width: 65px;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: color 0.2s, background-color 0.2s;
  font-size: 12px;
}

.text-ellipsis:hover {
  color: #42b983;
  background-color: #f0f7ee;
}

.link-ellipsis,
.sentence-ellipsis {
  flex: 1;
  min-width: 0; /* 解决flex子元素不收缩问题 */
  font-size: 10px;
}

/* 按钮区域固定在右侧 */
.item-actions {
  display: flex;
  gap: 4px;
  min-width: 80px; /* 固定按钮区域宽度 */
  justify-content: flex-end;
  margin-left: auto; /* 推到最右侧 */
}

button {
  padding: 2px 6px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 2px;
  background: #fff;
  transition: background-color 0.2s;
}

button:hover {
  background: #f5f5f5;
}

.item-edit {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.item-edit input {
  padding: 4px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 2px;
}

.item-edit input:first-child {
  width: 80px;
}

.item-edit input:last-child {
  flex: 1;
}

/* 链接和句子省略样式 */
.link-ellipsis,
.sentence-ellipsis {
  flex: 1;
  min-width: 0; /* 解决flex子元素不收缩问题 */
}

/* 链接样式美化 */
.item-view .link-ellipsis {
  color: #666;              /* 默认灰色，比黑色柔和 */
  text-decoration: none;    /* 去掉默认下划线 */
  padding: 2px 4px;
  border-radius: 3px;
  transition: color 0.2s, background-color 0.2s, text-decoration 0.2s;
}

.item-view .link-ellipsis:hover,
.item-view .link-ellipsis:focus {
  color: #42b983;           /* hover时的主题色 */
  text-decoration: underline; /* 悬停时下划线 */
  background-color: #f0f7ee;
}

.item-view .link-ellipsis:active {
  color: #359e69;           /* 点击时颜色加深 */
}

/* 新增复选框样式 */
.default-checkbox {
  margin: 0 1px;
  white-space: nowrap; /* 防止文字换行 */
}

.default-checkbox input {
  margin-right: 1px;
  vertical-align: middle;
}

.default-checkbox label {
  font-size: 11px;
  color: #666;
}
</style>