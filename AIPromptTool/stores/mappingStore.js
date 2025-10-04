
import { defineStore } from 'pinia';
import {ref, watch, onMounted} from 'vue';
import {storage} from "#imports";

export const useMappingStore = defineStore('mapping', () => {
    // 状态 - 相当于选项式API中的state

    let mappings = ref([]);
    // 添加文本
    const addMapping = (trigger, prompt) => {
        console.log('Adding mapping:????', trigger, prompt);
        mappings.value.push({
            id: Date.now(), // 使用时间戳作为唯一ID
            trigger,
            prompt
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
    // 持久化相关
    const STORAGE_KEY = 'local:ai-prompt-tool-mappings';

    // 从 storage 加载数据
    const init = async () => {
        try {
            const raw = await storage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    mappings.value = parsed;
                }
            }
        } catch (e) {
            console.error('Failed to load mappings from storage', e);
        }
    };

    // 保存到 storage
    const save = async () => {
        try {
            await storage.setItem(STORAGE_KEY, JSON.stringify(mappings.value));
        } catch (e) {
            console.error('Failed to save mappings to storage', e);
        }
    };
    // 在组件挂载时初始化
    onMounted(async () => {
        await init();
    });
    // 监听数据变化自动保存
    watch(
        mappings, // 直接监听 ref
        async (newValue) => {
            await save();
        },
        { deep: true }
    );


    // 返回需要暴露的状态和方法
    return {
        mappings,
        addMapping,
        updateMapping,
        deleteMapping
    };
});