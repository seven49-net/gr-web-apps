<script>
	// import { watchResize } from "svelte-watch-resize";
	export let tags;
	export let clickedtag;
	export let pages;
	import utils from "../../defaults/js/utils.js";
	import configs from "../../defaults/js/configs.js";

  const langIso = utils.getLangIso(".climate-change-tag-cloud");
	const env = utils.getTableSuffix();
	const urlTags = utils.updateQueryStringParameter(utils.updateQueryStringParameter(configs.url, "tablename", configs.tagTable + env),"language", langIso);
	const urlPages = utils.updateQueryStringParameter(utils.updateQueryStringParameter(configs.url, "tablename", configs.contentTable + env), "language", langIso);
	export let list = [];

	function randomFs(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function makeObject(tags) {
	  let updatedTags = [];
	  tags.forEach((v) => {
	    //console.log(v);
	    let pages = JSON.parse(v.pages);
	    //console.log(v.pages);
	    v.pages = pages;
	    updatedTags.push(v);
	  });
	  return updatedTags;
	}
  function sortAZ(arr) {
    let out = arr.sort((a,b) => {
      let na = a.name.toLowerCase();
      let nb = b.name.toLowerCase();
      if (na < nb) {
        return -1;
      }
      if (na > nb) {
        return 1;
      }
      return 0;
    });
    return out;
  }
	fetch(urlTags).then(response => {
	  return response.json();
	}).then(data => {
	  //console.log("tablename: "+ utils.getUrlParameter("tablename"))
	  console.log(data);
	  if (data.Items.length) {
	    tags = makeObject(data.Items);
	  }
	}).then(() => {

    sortAZ(tags);
    //console.log(tags);
    // tags = tags.sort((a,b) => {
    //   let na = a.name.toLowerCase();
    //   let nb = b.name.toLowerCase();
    //   if (na < nb) {
    //     return -1;
    //   }
    //   if (na > nb) {
    //     return 1;
    //   }
    //   return 0;
    // });

	  tags.forEach(function (t) {
	    console.log(t);
	    list.push(["#" + t.name, randomFs(20, 72), t.pages])
	  });
	  //console.log(list);
	  wordcloud(list);
	});

	function getPages(tag, url) {
	  fetch(utils.updateQueryStringParameter(url, "tag", tag.replace("#", "")))
	    .then(response => response.json())
	    .then(data => {
	      console.log(data);
        let unfiltered = data.Items;

        // let filtered = unfiltered.filter( o => {
        //   let url = o.Url;
        //   let pattern = new RegExp("/" + langIso + "/", "gmi");

        //   return pattern.test(url);
        // });

	      pages = unfiltered;
	    });
	}

	function wordcloud(list) {
	  WordCloud(document.querySelector("#tag-cloud"), {
	    list: list,
	    fontWeight: "bold",
	    fontFamily: "Arial, sans-serif",
	    backgroundColor: "#e6f0f8",
	    minSize: 18,
	    color: function (word, weight, fontSize) {
	      let color = "rgba(0, 104, 180, 0.75)";
	      if (fontSize >= 32) color = "rgba(0, 104, 180, 0.875)";
	      if (fontSize >= 48) color = "rgba(0, 104, 180, 1)";
	      return color;
	    },
	    classes: function (word, weight, fontSize) {
	      return "wc wc-" + word.toLowerCase().replace(/ /gmi, "-") + " wc-weight-" + weight + " wc-fs-" + fontSize;
	    },
	    click: function (item) {
	      getPages(item[0], urlPages); //item[2];
	      clickedtag = item[0];
	    },
	    gridSize: 5,
	    rotateRatio: 0,
      shuffle: 0,
	    shape: "diamond",
	    ellipticity: 1,
	    shrinkToFit: true
	  });

    //gridSize: 10,
	  //  rotateRatio: 0.75,
	  //  shape: "circle",
	}
</script>

<div class="tag-app">
  <div id="tag-cloud" class="tag-cloud"></div>

  {#if pages.length}
	<div class="clicked-tag">{ clickedtag }</div>
	<div class="page-list row">
		{#each pages as page}
			<div class="page column">
				<a href={page.Url}>
					{#if page.PreviewImage}<div class='image'><img src={page.PreviewImage} alt='' /></div>{/if}
				<span class="title">{page.Title}</span>
				{#if page.Content}<div class="summary">{@html utils.getText(page.Content, 200)}</div>{/if}
				</a>
			</div>
		{/each}
	</div>

		{/if}

</div>

<style type="text/scss">
	$primar-color: #0069b4;
	$secondary-color: #e6f0f8;
	$tag-cloud-width: 500px;

	:root {
	  --primary-color: #0069b4;
	  --secondary-color: #e6f0f8;
	}

	.tag-app {

	  font-family: Arial, sans-serif;
	}

	.tag-cloud {
	  width: $tag-cloud-width;
	  max-width: 100%;
	  position: relative;
	  display: block;
	  margin-bottom: .75rem;
	}

	.tag-cloud:before {
	  content: "";
	  display: block;
	  padding-bottom: 100%;
	}

	.clicked-tag {
	  font-weight: bold;
	}

</style>