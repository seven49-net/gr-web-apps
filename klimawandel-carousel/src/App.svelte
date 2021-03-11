<script>
	import {
		onMount
	} from 'svelte';
	import utils from "../../defaults/js/utils.js";
	import configs from "../../defaults/js/configs.js";
	const env = "intklimawandel_gr_ch";
	let url = utils.updateQueryStringParameter(configs.url, "tablename", configs[env].contentTable);
	let items = [];

	function makeCarousel(data) {
		//console.log(data);
		if (data.Items.length) {
			items = filterType(data.Items);
		}
	}

  function filterType(data) {
    let o = [];
    const term = "WCAG Blank WebPart Page";
    if (data.length) {
      o = data.filter(d=>d.Inhaltstyp.toLowerCase() !== term.toLocaleLowerCase());
    }
    return o;
  }

	function initCarousel() {
		jQuery(".news-slick-carousel").slick({
			slidesToShow: 3,
			slidesToScroll: 3,
			arrows: true,
			dots: false,
			speed: 500,
			respondTo: "slider",
			prevArrow: "<button type='button' data-role='none' class='slick-prev slick-arrow' aria-label='previous' role='button'><img src=\"https://cdn.gr.ch/redesign2016/images/icons-set/blau/arrows/pfeil-left.svg\" alt=''></button>",
			nextArrow: "<button type='button' data-role='none' class='slick-next slick-arrow' aria-label='next' role='button'><img src=\"https://cdn.gr.ch/redesign2016/images/icons-set/blau/arrows/pfeil-right.svg\" alt=''></button>",
			responsive: [{

				breakpoint: 720,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					arrows: false,
					swipeToSlide: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}

			}]
		});
	}

	fetch(url).then(response => {
		return response.json();
	}).then(data => {
		makeCarousel(data);

	}).then(() => {
		initCarousel();
	}).catch(error => {
		console.log("error: " + error);
	});

	function renderDate(date) {
		let d = new Date(date);
		return d.toLocaleDateString("de-CH");
	}
	onMount(() => {
		console.log('the component has mounted');
	});
</script>

<div class="clima-change-carousel">
	{#if items.length}
		<div class='news-slick-carousel entries'>
			{#each items as item}
				<div class='slide'>
					<a href={item.Url}>
						{#if item.PreviewImage}
						<img src={item.PreviewImage} alt={item.Title} />
						{:else}
						<img src="https://cdn.gr.ch/dev-redesign2016/web-app/placeholder.png" alt={item.Title} />
						{/if}
					<h2 class="lead">{ item.Title }</h2>
					<p class="date">{ renderDate(item.Created) }</p>
					{#if item.Content }
					<p class="summary">
						{@html utils.getText(item.Content,200)}
					</p>

					{/if}
					<span class="more"></span>
					</a>
				</div>
			{/each}
		</div>
	{/if}
	</div>
<style>

.clima-change-carousel {
	font-family: Aria, sans-serif;
}

</style>