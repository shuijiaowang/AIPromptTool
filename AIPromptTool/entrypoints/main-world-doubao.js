//entrypoints/main-world-doubao.js
import { defineUnlistedScript } from "#imports";

export default defineUnlistedScript(() => {
    console.log('Hello from the main world -- 插件插入里世界运行成功');

    // 监听来自内容脚本的消息
    window.addEventListener('message', (event) => {
        console.log('Received message from content script:', event.data);
        //没有生效

        if (event.source === window && event.data.type === 'INSERT_LINK') {
            //如果是链接，则调用粘贴函数
            //还需要判断来源，如果是豆包网页的，则精准执行豆包网页的响应方法，暂时默认就是豆包
            insertLinkIntoInput(event.data.url);
        }
        if (event.source === window && event.data.type === 'INSERT_TEXT') {
            //如果是文本，则调用插入函数
            insertTextIntoInput(event.data.text);
        }
        if (event.source === window && event.data.type === 'INPUT_CHANGE') {
            //如果点击提交，则调用change函数，先获取输入框中的字符串，解析字符串把特定的词语转化为句子，如 “翻译”->"翻译为中文"，“英语->给这个变量或是函数起几个英语名”
            //但是这种映射规则的数据存储到哪里呢？
            replaceTextIntoInput(event.data.text)
        }
    });

    // 插入链接到输入框的核心函数
    function insertLinkIntoInput(TEXT_TO_INPUT) {
        const input = document.querySelector('[data-testid="chat_input_input"]');
        // 获取React组件的props
        const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
        const reactProps = input[reactPropsKey];
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
    }
    function replaceTextIntoInput222(TEXT_TO_INPUT) {
        const input = document.querySelector('[data-testid="chat_input_input"]');

        // 1. 关键：获取React组件的props（__reactProps$后面的后缀是动态的，用正则匹配）
        const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
        const reactProps = input[reactPropsKey];

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

        // 3. 直接调用React的onChange事件（这是更新内部state的核心步骤）
        reactProps.onChange(changeEvent);

        // 4. 同步更新DOM的value（确保视图和state一致，可选但建议加）
        input.value = TEXT_TO_INPUT;
    }
    // 插入文本到输入框的核心函数
    function insertTextIntoInput(TEXT_TO_INPUT) {
        // 保留原有逻辑：文本前后加逗号
        TEXT_TO_INPUT = ',' + TEXT_TO_INPUT + ',';
        const input = document.querySelector('[data-testid="chat_input_input"]');
        if (!input) return;

        // 获取 reactProps（关键：组件内部状态依赖此对象的事件）
        const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
        const reactProps = input[reactPropsKey];

        if (reactProps?.onChange) {
            // 1. 获取输入框当前内容（兼容空值）
            const currentValue = input.value || '';
            // 2. 拼接新文本（可根据需求添加分隔符，如空格、逗号）
            const appendedValue = currentValue + TEXT_TO_INPUT; // 基础拼接
            // 如需加空格分隔：currentValue + ' ' + TEXT_TO_INPUT
            // 如需加逗号分隔：currentValue + ', ' + TEXT_TO_INPUT

            // 3. 构造事件对象（使用拼接后的值）
            const changeEvent = {
                target: {
                    value: appendedValue, // 关键：用拼接后的值
                    name: reactProps.name || '',
                    type: reactProps.type || 'textarea'
                },
                preventDefault: () => {},
                stopPropagation: () => {}
            };

            // 4. 触发更新并同步DOM
            reactProps.onChange(changeEvent);
            input.value = appendedValue; // 同步显示拼接后的值
        } else {
            // 方案2：兼容富文本或其他监听 beforeinput 的组件（降级方案）
            console.log('降级方案：使用 beforeinput 事件?',input.textContent)
            const event = new InputEvent('beforeinput', {
                inputType: 'insertText',
                data: TEXT_TO_INPUT,
                bubbles: true,
                cancelable: true
            });
            input.dispatchEvent(event);
        }
    }
    function replaceAllText(newText) {
        const input = document.querySelector('[data-testid="chat_input_input"]');
        if (!input) return;

        // 移除不可编辑节点（保留你的逻辑）
        const nonEditable = input.querySelectorAll('[contenteditable="false"]');
        nonEditable.forEach(el => el.remove());

        // 全选（已确认选中成功，保留）
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection.removeAllRanges();
        selection.addRange(range);
        // 测试别的都不行，只能用这个了，遍历
        const event2 = new InputEvent('beforeinput', {
            inputType: 'deleteContentBackward',
            data: null, // 删除时 data 一般为 null
            bubbles: true,
            cancelable: true
        });
        for (let i = 0; i < selection.toString().length; i++) {
            input.dispatchEvent(event2);
        }
        // 插入新文本（保留你的逻辑）
        const event = new InputEvent('beforeinput', {
            inputType: 'insertText',
            data: newText,
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(event);

    }
    function replaceTextIntoInput(text) {
        const input = document.querySelector('[data-testid="chat_input_input"]'); //注意每次都要重新获取，会被react改变，所以每次获取都要检查
        if (!input) return;

        // 检查是否是富文本编辑器
        if (input.isContentEditable || input.getAttribute('contenteditable') === 'true') {
            // 富文本编辑器处理
            //走到这里，进行全量替换
            replaceAllText(text)
        } else {
            // 普通文本框处理
            const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
            const reactProps = input[reactPropsKey];

            if (reactProps?.onChange) {
                const event = {
                    target: { value: text },
                    preventDefault: () => {},
                    stopPropagation: () => {}
                };
                reactProps.onChange(event);
                input.value = text;
            } else {
                // 直接设置值作为后备方案
                input.value = text;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }
});
