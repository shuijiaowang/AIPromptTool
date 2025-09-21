import { defineUnlistedScript } from "#imports";

export default defineUnlistedScript(() => {
    console.log('Hello from the main world');

    // 监听来自内容脚本的消息
    window.addEventListener('message', (event) => {
        if (event.source === window && event.data.type === 'INSERT_GITHUB_LINK') {
            insertLinkIntoInput(event.data.url);
        }
    });

    // 插入链接到输入框的核心函数
    function insertLinkIntoInput(TEXT_TO_INPUT) {
        const input = document.querySelector('[data-testid="chat_input_input"]');

        if (!input) {
            console.error("❌ 未找到输入框");
            // 发送失败响应
            window.postMessage({
                type: 'LINK_INSERT_RESPONSE',
                success: false,
                error: '未找到输入框'
            }, '*');
            return;
        }

        // 获取React组件的props
        const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
        const reactProps = input[reactPropsKey];

        if (!reactProps || !reactProps.onPaste) {
            console.error("❌ 未找到React的onPaste事件");
            window.postMessage({
                type: 'LINK_INSERT_RESPONSE',
                success: false,
                error: '未找到React事件'
            }, '*');
            return;
        }

        // 构造粘贴事件
        const pasteEvent = {
            type: 'paste',
            clipboardData: {
                getData: (type) => {
                    if (type === 'text' || type === 'text/plain') {
                        return TEXT_TO_INPUT;
                    }
                    return '';
                }
            },
            target: input,
            preventDefault: () => {},
            stopPropagation: () => {}
        };

        // 触发粘贴事件
        reactProps.onPaste(pasteEvent);

        console.log("✅ 链接已插入:", TEXT_TO_INPUT);
        // 发送成功响应
        window.postMessage({
            type: 'LINK_INSERT_RESPONSE',
            success: true,
            url: TEXT_TO_INPUT
        }, '*');
    }
});