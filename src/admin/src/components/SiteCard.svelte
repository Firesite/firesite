<script>
  export let site;
</script>

<style>
  .BoxMain {
    padding: 0px;
  }
  .SiteCard {
    overflow: hidden;
    padding: 0px;
  }
  img {
    max-width: 200px;
  }
  a {
		color: #eee7df;
		text-decoration: none;
  }

  .Title {
		padding: 24px;
		font-size: 24px;
  }

  .BottomCard {
    padding: 24px;;
    min-height: 2em;
    font-size: 0.5em;
  }

  .Image {
    background-image: url("https://source.unsplash.com/random");
    background-size: cover;
    width: 510px;
    height: 344px;
  }
</style>

<div class="BoxLgGrey BoxMain">
  <div class="BoxLgDark TextDark SiteCard">
    <div class="Image BoxLgDark SiteCard" />
    <div class="Title">
      <a rel="prefetch" href={`site/${site.id}`}>{site.name}</a>
    </div>
  </div>
  <div class="BottomCard">
    <a href="`https://${site.url}`">{site.url}</a>
  </div>
</div>
