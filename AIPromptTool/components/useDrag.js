// src/composables/useDrag.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useDrag(elementRef,storageKey = null) {
    const isDragging = ref(false);
    const position = ref({ x: 0, y: 0 });
    const dragOffset = ref({ x: 0, y: 0 });

    // const onMousedown = (e) => {
    //     // 判断点击是否在目标元素内部
    //     if (elementRef.value && elementRef.value.contains(e.target)) {
    //         isDragging.value = true;
    //         dragOffset.value = {
    //             x: e.clientX - position.value.x,
    //             y: e.clientY - position.value.y
    //         };
    //     }
    // };
    const onMousedown = (e) => {
        const el = elementRef.value;
        if (el && e.target === el) {
            isDragging.value = true;
            dragOffset.value = {
                x: e.clientX - position.value.x,
                y: e.clientY - position.value.y
            };
        }
    };

    const onMousemove = (e) => {
        if (isDragging.value) {
            position.value = {
                x: e.clientX - dragOffset.value.x,
                y: e.clientY - dragOffset.value.y
            };
        }
    };

    const onMouseup = () => {
        if (isDragging.value) {
            savePosition(); // 拖拽结束保存位置
        }
        isDragging.value = false;
    };

    onMounted(() => {
         loadPosition()
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
    });

    // 从 localStorage 读取位置
    const loadPosition = () => {
        if (!storageKey) return; // 没有 key 就不读
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const { x, y } = JSON.parse(saved);
                position.value = { x: Number(x), y: Number(y) };
            } catch (e) {
                console.warn('Failed to parse saved position', e);
            }
        }
    };

    // 保存位置到 localStorage
    const savePosition = () => {
        if (!storageKey) return; // 没有 key 就不保存
        localStorage.setItem(storageKey, JSON.stringify(position.value));
    };



    return {
        position,
        onMousedown
    };
}