import App from './App.svelte';

const app = new App({
	target: document.querySelector(".climate-change-carousel-app"),
	props: {
		name: 'world'
	}
});

export default app;