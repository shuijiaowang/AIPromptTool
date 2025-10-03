import {browser} from '#imports';

// sendMessage 函数
export async function sendMessage(type, data) { // 判断逻辑优化：Background 能访问 browser.tabs，Content 不能
    const isBackground = !!browser.tabs; //经过我的测试这样是可以的。
    if (isBackground) {
        const [tab] = await browser.tabs.query({active: true, currentWindow: true}); //最常用？就这样不用改
        if (!tab?.id) throw new Error('未找到激活的标签页，无法发送消息');
        return browser.tabs.sendMessage(tab.id, {type, data});
    } else {
        // Content → 发给 Background
        return browser.runtime.sendMessage({type, data});
    }
} //向 Page Script 发送消息
export async function sendMessageToPage(type, data) {
    return window.postMessage({type, data}, window.location.origin);
}

// 改进的 onMessage 函数
export function onMessage(targetType, callback) {
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.type === targetType) {
            try {
                const response = await callback(message.data);
                sendResponse(response);
            } catch (error) {
                console.error("处理消息时出错:", error);
                sendResponse({error: error.message});
            }
            return true; // 异步响应
        }
    });
}