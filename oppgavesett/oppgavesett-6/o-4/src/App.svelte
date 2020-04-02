<script>

	let kaneler = []
	let url = "./kanaler.json"

	const getPerson = async () => {
		const response = await fetch(url)
		const json = await response.json();
		kanaler = json.results;
		console.log(kanaler)

	}

	getKanaler();
	
</script>

<main>
	
	{#each kanaler as kanal}
			<h1>{person.name}</h1>
			<li>{kanaler.title} {kanaler.signal}<li>
	{:else}
		<h2>Laster personer....</h2>
	{/if}
</main>

