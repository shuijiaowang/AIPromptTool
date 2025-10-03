// src/composables/useDrag.js
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useDrag(elementRef) {
    const isDragging = ref(false);
    const position = ref({ x: 0, y: 0 });
    const dragOffset = ref({ x: 0, y: 0 });

    const onMousedown = (e) => {
        // 判断点击是否在目标元素内部
        if (elementRef.value && elementRef.value.contains(e.target)) {
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
        isDragging.value = false;
    };

    onMounted(() => {
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
    });

    return {
        position,
        onMousedown
    };
}