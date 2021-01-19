<script>
	import { onMount } from 'svelte';
	import utils  from "../../defaults/js/utils.js";
	import configs from "../../defaults/js/configs.js";
	const env = "www_gr_ch";
	let url = utils.updateQueryStringParameter(configs.url, "tablename", configs[env].contentTable);
	let items = [];
	function makeCarousel(data) {
		//console.log(data);
		if (data.Items.length) {
			items = data.Items;
			
		}
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

		}).then(()=> {
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
						{#if item.PageImage}
						<img src={item.PageImage} alt={item.Title} />
						{:else}
						<img src="https://cdn.gr.ch/dev-redesign2016/web-app/placeholder.png" alt={item.Title} />
						{/if}
					<h2 class="lead">{ item.Title }</h2>
					<p class="date">{ renderDate(item.Created) }</p>
					{#if item.Summary }
					<p class="summary">
						{item.Summary}
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