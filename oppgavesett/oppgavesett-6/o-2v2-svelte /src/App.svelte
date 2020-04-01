<script>

	let personId = 1
	let person;

	const getPerson = async () => {
		

  let headers = new Headers();
  
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:5000');

	const response = await fetch(`https://swapi.co/api/people/${personId}`, {
			mode: 'cors',
        	method: 'POST',
       		headers: headers
		})
		
		const json = await response.json()
		person = json

	}

	getPerson()
	
</script>
<header>
	<input type="number" bind:value={personId} on:input={getPerson}/>
</header>

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

