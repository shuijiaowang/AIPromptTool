
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMappingStore = defineStore('mapping', () => {
    // 状态 - 相当于选项式API中的state

    let mappings = ref([
        { id: 1, trigger: '翻译', prompt: '翻译为中文' },
        { id: 2, trigger: '英语', prompt: '给这个变量或是函数起几个英语名' },
        { id: 3, trigger: '解释', prompt: '解释这段代码的功能' }
    ]);
    // 添加链接
    // 添加文本
    const addMapping = (name, content) => {
        mappings.value.push({
            id: Date.now(), // 使用时间戳作为唯一ID
            name,
            content
        });
    };

    // 更新文本
    const updateMapping = (id, updatedData) => {
        const index = mappings.value.findIndex(mapping => mapping.id === id);
        if (index !== -1) {
            mappings.value[index] = { ...mappings.value[index], ...updatedData };
        }
    };

    // 删除文本
    const deleteMapping = (id) => {
        mappings.value = mappings.value.filter(mapping => mapping.id !== id);
    };


    // 返回需要暴露的状态和方法
    return {
        mappings,
        addMapping,
        updateMapping,
        deleteMapping
    };
});