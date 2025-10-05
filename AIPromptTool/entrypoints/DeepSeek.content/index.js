// entrypoints/example.content.js
import {createShadowRootUi, defineContentScript} from "#imports";
import {createApp} from "vue";
import Index from "../../view/index.vue";
import pinia from "../../stores/index.js";

export default defineContentScript({
    matches: ['*://*.doubao.com/chat/*','*://*.chat.deepseek.com/*'], //只匹配两个网页怎么写
    cssInjectionMode: 'ui',
    main:async(ctx)=> {
        const ui = await createShadowRootUi(ctx, {
            name: 'example-ui',
            position: "inline",
            anchor: 'body',
            onMount: (container) => {
                container.style.zIndex = '1000'; // Ensure it's on top
                container.style.position = 'fixed'; // Use fixed positioning
                container.style.top = '0px'; // 距离顶部距离
                container.style.left = '0px'; // 距离右侧距离
                container.style.zIndex = '1000';
                container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                container.style.borderRadius = '8px';
                container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                container.style.backdropFilter = 'blur(10px)'; // 毛玻璃效果
                // container.style.position = 'fixed'; // Use fixed positioning
                // Define how your UI will be mounted inside the container
                const app = createApp(Index);
                app.use(pinia); // 使用 Pinia

                app.mount(container);
                return app;
            },
            onRemove: (app) => {
                // Unmount the app when the UI is removed
                app?.unmount();
            },
        });

        // 4. Mount the UI
        ui.mount();
        console.log("Hello content.")
    },
});