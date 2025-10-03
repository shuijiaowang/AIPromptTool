import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLinkStore = defineStore('link', () => {
    // 状态 - 相当于选项式API中的state
    const links = ref([
        { id: 1, text: '项目仓库', url: 'https://github.com/shuijiaowang/AIPromptTool.git' },
        { id: 2, text: '文档仓库', url: 'https://github.com/shuijiaowang/shuijiaowangGoService.git' },
        { id: 3, text: 'API仓库', url: 'https://github.com/example/api' }
    ]);
    const showPopup = ref(false);

    // 计算属性 - 相当于选项式API中的getters
    const linkCount = computed(() => links.value.length);
    const hasLinks = computed(() => linkCount.value > 0);

    // 方法 - 相当于选项式API中的actions
    const togglePopup = () => {
        showPopup.value = !showPopup.value;
    };

    const closePopup = () => {
        showPopup.value = false;
    };

    // 添加链接
    const addLink = (text, url) => {
        links.value.push({
            id: Date.now(), // 使用时间戳作为唯一ID
            text,
            url
        });
    };

    // 更新链接
    const updateLink = (id, updatedData) => {
        const index = links.value.findIndex(link => link.id === id);
        if (index !== -1) {
            links.value[index] = { ...links.value[index], ...updatedData };
        }
    };

    // 删除链接
    const deleteLink = (id) => {
        links.value = links.value.filter(link => link.id !== id);
    };

    // 返回需要暴露的状态和方法
    return {
        links,
        showPopup,
        linkCount,
        hasLinks,
        togglePopup,
        closePopup,
        addLink,
        updateLink,
        deleteLink
    };
});
