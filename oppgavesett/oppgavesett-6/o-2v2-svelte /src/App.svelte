<script>

	let personId = 1;
	let person;

	const getPerson = async () => {

		const response = await fetch(`https://swapi.co/api/people/${personId} /`);
		const json = await response.json();
		person = json;
		console.log(person)

	}

	getPerson();
	
</script>


<main>
	
	{#if person}
		<article>
			<h1>{person.name}</h1>
			<p><strong>Height: </strong> {person.height}</p>
			<p><strong>Mass: </strong> {person.mass}</p>
			<p><strong>Eye color: </strong> {person.eye_color}</p>
			<p><strong>Birth Year: </strong> {person.birth_year}</p>
			<p><strong>Gender: </strong> {person.gender}</p>
		</article>
	{:else}
		<h2>Laster personer....</h2>
	{/if}
</main>

