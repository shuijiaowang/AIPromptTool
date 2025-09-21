import {defineUnlistedScript} from "#imports";

export default defineUnlistedScript(() => {
    console.log('Hello from the main world');

    setTimeout(() => {
        (function() {
            const TEXT_TO_INPUT = "https://github.com/shuijiaowang/AIPromptTool.git";
            const input = document.querySelector('[data-testid="chat_input_input"]');

            if (!input) {
                console.error("❌ 未找到输入框");
                return;
            }

            // 1. 关键：获取React组件的props（__reactProps$后面的后缀是动态的，用正则匹配）
            const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
            const reactProps = input[reactPropsKey];

            console.log("React props key:", reactPropsKey)
            console.log("React props:", reactProps)

            if (!reactProps || !reactProps.onChange) {
                console.error("❌ 未找到React的onChange事件，可能组件结构已变");
                return;
            }

            // 2. 构造符合React要求的onChange事件对象（必须包含target.value）
            const changeEvent = {
                target: {
                    value: TEXT_TO_INPUT, // 要设置的真实值（同步到React state）
                    name: reactProps.name || '', // 可选：补全组件可能需要的name属性
                    type: 'textarea'
                },
                preventDefault: () => {}, // 模拟事件的默认方法（避免报错）
                stopPropagation: () => {}
            };
            const pasteEvent = {
                type: 'paste', // 明确事件类型为粘贴
                clipboardData: {
                    getData: (type) => {
                        // 当处理函数获取剪贴板数据时，返回要粘贴的内容
                        if (type === 'text' || type === 'text/plain') {
                            return TEXT_TO_INPUT;
                        }
                        return '';
                    }
                },
                target: input, // 可以关联到实际的DOM元素
                preventDefault: () => {},
                stopPropagation: () => {}
            };

            // 3. 直接调用React的onChange事件（这是更新内部state的核心步骤）
            reactProps.onPaste(pasteEvent);

            // 4. 同步更新DOM的value（确保视图和state一致，可选但建议加）
            // input.value = TEXT_TO_INPUT;

            console.log("✅ React内部状态已更新！内容不会再丢失");
            console.log("React props中的value已同步为：", reactProps.value); // 可验证是否更新
        })();
    }, 4000);

});