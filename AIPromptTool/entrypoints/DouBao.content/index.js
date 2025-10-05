// entrypoints/DouBao.content.js
import {defineContentScript, injectScript} from "#imports";

export default defineContentScript({
    matches: ['*://*.doubao.com/chat/*'],
    async main() {
        window.addEventListener('load', async () => {
            console.log('Page loaded, injecting script...');
            await injectScript('/main-world-doubao.js', {
                keepInDom: true,
            });
            console.log('Done!');
        });
    },
});