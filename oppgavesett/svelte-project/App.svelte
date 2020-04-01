<script>

	let person = []

	const getPerson = async () => {
		const response = await fetch('https://swapi.co/api/people/1/')
		const json = await response.json()
		persons = json.results
	}
	
	getPerson()
	
</script>
<main>
	
	{#each persons as person}
		<article>
			<img src={user.picture} alt={user.name} title={user.name}>
			<h1>{user.name} {user.name}</h1>
		</article>
	{:else}
		<h2>Laster personer....</h2>
	{/each}
		
</main>

