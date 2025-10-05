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
        if (event.source === window && event.data.type === 'INPUT_SUBMIT') {
            //如果点击提交，则调用change函数，先获取输入框中的字符串，解析字符串把特定的词语转化为句子，如 “翻译”->"翻译为中文"，“英语->给这个变量或是函数起几个英语名”
            //但是这种映射规则的数据存储到哪里呢？
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
        TEXT_TO_INPUT = ','+TEXT_TO_INPUT+',';
        const input = document.querySelector('[data-testid="chat_input_input"]');
        if (!input) return;

        // 获取 reactProps
        const reactPropsKey = Object.keys(input).find(key => key.startsWith('__reactProps$'));
        const reactProps = input[reactPropsKey];

        // 构造 InputEvent
        const event = new InputEvent('beforeinput', {
            inputType: 'insertText',
            data: TEXT_TO_INPUT,
            bubbles: true,
            cancelable: true
        });

        // 触发事件
        input.dispatchEvent(event);
    }

    function replaceSelectedText(newText) {
        const input = document.querySelector('[data-testid="chat_input_input"]');
        if (!input) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();

        // 插入新文本
        const textNode = document.createTextNode(newText);
        range.insertNode(textNode);

        // 移动光标到插入文本的末尾
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        // 触发 beforeinput 事件通知 React 更新状态
        const event = new InputEvent('beforeinput', {
            inputType: 'insertText',
            data: newText,
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(event);
    }
    // 如果要替换全部内容，可以先全选再替换
    function replaceAllText(newText) {
        const input = document.querySelector('[data-testid="chat_input_input"]');
        if (!input) return;

        // 全选内容
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection.removeAllRanges();
        selection.addRange(range);

        // 替换选中内容
        replaceSelectedText(newText);
    }
    function replaceTextIntoInput(text) {
        const input = document.querySelector('[data-testid="chat_input_input"]'); //注意每次都要重新获取，会被react改变，所以每次获取都要检查
        if (!input) return;

        // 检查是否是富文本编辑器
        if (input.isContentEditable || input.getAttribute('contenteditable') === 'true') {
            // 富文本编辑器处理
            replaceSelectedText(text);
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
