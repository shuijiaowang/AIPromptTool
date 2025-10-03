// entrypoints/DouBao.content.js
import {defineContentScript, injectScript} from "#imports";

export default defineContentScript({
    matches: ['*://*.doubao.com/chat/*'],
    async main() {
        console.log('Injecting script...');
        await injectScript('/main-world-doubao.js', {
            keepInDom: true,
        });
        console.log('Done!');
    },
});