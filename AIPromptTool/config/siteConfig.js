export const SITE_CONFIGS = [
    {
        // 网站标识（用于区分）
        name: 'doubao',
        // URL匹配规则（支持字符串包含或正则）
        url: 'doubao.com/chat',
        // 输入框选择器
        inputSelector: '[data-testid="chat_input_input"]',
        // 发送按钮选择器
        sendButtonSelector: '[data-testid="chat_input_send_button"]',
    },
    {
        name: 'deepseek',
        url: /deepseek\.com/, // 正则匹配
        inputSelector: '#chat-input',
        sendButtonSelector: '#flow-end-msg-send',
    },
    // 其他网站配置...
];

// 还可以存储通用常量
export const COMMON_CONSTANTS = {
    DEFAULT_INPUT_LENGTH: 20, // 例如之前用到的LENGTH变量
    MAX_RETRY_COUNT: 3,
}