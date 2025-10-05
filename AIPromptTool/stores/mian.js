import {defineStore} from "pinia";
import {useMappingStore} from "./mappingStore.js";


export const useMainStore = defineStore('main', () => {

    // 获取映射存储实例
    const mappingStore = useMappingStore();
    // 处理输入框内容并进行替换
    // 处理输入框内容（仅替换前30和后30字符中的匹配内容）
    const processInputContent = (content) => {
        if (!content || typeof content !== 'string') return content;

        const LENGTH = 20;
        const totalLength = content.length;

        // 1. 拆分内容为三部分：前20字符、中间部分、后20字符
        const prefix = content.slice(0, LENGTH);
        const suffix = content.slice(Math.max(0, totalLength - LENGTH));
        const middle = totalLength > LENGTH * 2 ? content.slice(LENGTH, -LENGTH) : '';

        // 2. 提取需要处理的词语（支持中英文逗号）
        const splitRegex = /[，,]/; // 同时匹配中英文逗号
        const prefixWords = prefix.split(splitRegex).map(word => word.trim()).filter(Boolean);
        const suffixWords = suffix.split(splitRegex).map(word => word.trim()).filter(Boolean);

        // 3. 去重并确保只处理一次
        const uniqueWords = [...new Set([...prefixWords, ...suffixWords])];

        // 4. 构建替换正则表达式（全局匹配）
        let result = content;
        const mappings = mappingStore.mappings;

        uniqueWords.forEach(word => {
            const matchedMapping = mappings.find(m => m.trigger === word);
            if (matchedMapping) {
                // 只替换前20和后20字符中的匹配内容
                // 这里我们用一个更聪明的方法，只替换指定范围内的匹配
                const regex = new RegExp(word, 'g');
                let replacedCount = 0;

                result = result.replace(regex, (match, offset) => {
                    // 检查匹配位置是否在前20或后20字符范围内
                    if (offset < LENGTH || offset >= totalLength - LENGTH) {
                        return matchedMapping.prompt;
                    }
                    return match; // 不在范围内则不替换
                });
            }
        });

        return result;
    };
    //现在是需要遍历，把默认内容追加到输入框中。
    const processDefaultContent=()=>{
        mappingStore.mappings.forEach(mapping=>{
            if(mapping.isDefault){
                console.log("执行了吗？", mapping.prompt)
                window.postMessage({type:'INSERT_TEXT', text: mapping.prompt });
            }
        })
    }
        // 处理输入并发送到页面
        const handleInputProcessing = (content) => {
            if (!content) return;
            // 处理内容
            const processedContent = processInputContent(content);
            console.log("处理后的内容：", processedContent);
            // 发送处理后的内容到页面
            window.postMessage({type:'INPUT_CHANGE',  text: processedContent });
            // processDefaultContent();
            console.log("没执行吗？")
        };



    //匹配规则存储在mappingStore中
    //还要再发送另一条消息，把选中的保底内容作为消息发送给Page
    return {
        handleInputProcessing,
        processInputContent
    };
});