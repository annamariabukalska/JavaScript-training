<script>

	let movies = [];

	const getMovie = async () => {
		const response = await fetch('https://swapi.co/api/films/');
		const json = await response.json();
		movies = json.results;
	}

	getMovie()

</script>
<main>
	<h1>Star Wars-Movie</h1>

	{#each movies as movie}
		<article>
			<h1>{movie.title}</h1>
			<p>{movie.opening_crawl}</p>
		</article>
	{:else}
		<h2>Laster filmer....</h2>
	{/each}

</main>

<style>
	body {
		background: black;
		color: yellow;
	}
</style>