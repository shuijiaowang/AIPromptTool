// -------------------------- 1. 封装为函数（核心修复：给return提供函数上下文） --------------------------
function triggerReactElementClick() {
    // -------------------------- 配置项：根据你的实际元素修改选择器 --------------------------
    const TARGET_ELEMENT_SELECTOR = '[data-testid="upload_file_button"] button'; // 替换为你的目标元素选择器
    // -----------------------------------------------------------------------------

    // 1. 查找目标点击元素
    const targetElement = document.querySelector(TARGET_ELEMENT_SELECTOR);
    if (!targetElement) {
        console.error("❌ 未找到目标点击元素");
        window.postMessage({
            type: 'LINK_INSERT_RESPONSE',
            success: false,
            error: '未找到目标点击元素'
        }, '*');
        return; // 此时return在函数内部，合法
    }

    // 2. 获取目标元素的React Props
    const reactPropsKey = Object.keys(targetElement).find(key => key.startsWith('__reactProps$'));
    const reactProps = targetElement[reactPropsKey];
    if (!reactProps || !reactProps.onClick) {
        console.error("❌ 未找到React组件的onClick事件");
        window.postMessage({
            type: 'LINK_INSERT_RESPONSE',
            success: false,
            error: '未找到React组件的点击事件'
        }, '*');
        return; // 函数内return，合法
    }

    // 3. 构造模拟的Click事件对象
    const clickEvent = {
        type: 'click',
        target: targetElement,
        bubbles: true,
        cancelable: true,
        preventDefault: () => {},
        stopPropagation: () => {},
        // 可选：如需鼠标位置等属性，可补充
        // clientX: 150,
        // clientY: 250,
        // button: 0 // 0 = 鼠标左键（默认）
    };

    // 4. 触发React的onClick事件
    reactProps.onClick(clickEvent);

    // 5. 成功反馈
    console.log("✅ 目标元素已触发React点击事件");
    window.postMessage({
        type: 'LINK_INSERT_RESPONSE',
        success: true,
        message: '目标元素已触发React点击事件'
    }, '*');
}

// -------------------------- 2. 调用函数执行逻辑 --------------------------
triggerReactElementClick();