<script>

	let kanaler = [];
	let url = "kanaler.json"

	const getKanaler = async () => {
		const response = await fetch(url);
		const json = await response.json();
		kanaler = json.results;
	}

	getKanaler();
	
</script>
<main>
<h1>Mine radiokanaler</h1>
<ul>
	{#each kanaler as kanal}
			<li>{kanal.title} {kanal.signal}</li>
	{:else}
		<li>Laster mine radiokanaler....</li>
	{/each}
</ul>
</main>

<style>
	main {
		margin: 250px;
	}
</style>

