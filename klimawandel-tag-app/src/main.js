import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		tags: [],
		pages: [],
		clickedtag: ''
	}
});

export default app;