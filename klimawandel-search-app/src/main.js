import App from './App.svelte';

const app = new App({
	target: document.querySelector(".climate-change-search-app"),
	props: {
		appName: "Klimawandel Suche",
		searchterm: '',
		results: [],
		message: ''
	}
});

export default app;