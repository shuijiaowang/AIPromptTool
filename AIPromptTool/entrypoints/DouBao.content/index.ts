export default defineContentScript({
    matches: ['*://*.doubao.com/chat/*'],
    main() {
        console.log('Hello content.');
    },
});
