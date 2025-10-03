//entrypoints/main-world-doubao.js
import { defineUnlistedScript } from "#imports";

export default defineUnlistedScript(() => {
    console.log('Hello from the main world -- 插件插入里世界运行成功');

    // 监听来自内容脚本的消息
    window.addEventListener('message', (event) => {
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
    // 插入文本到输入框的核心函数
    function insertTextIntoInput(TEXT_TO_INPUT) {
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
});