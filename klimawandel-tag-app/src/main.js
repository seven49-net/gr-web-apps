import App from './App.svelte';

const app = new App({
	target: document.querySelector(".climate-change-tag-cloud"),
	props: {
		tags: [],
		pages: [],
		clickedtag: ''
	}
});

export default app;