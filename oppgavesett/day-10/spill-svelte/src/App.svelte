<script>

	let klasse = "faller"
	let svar = ""

	$: riktigsvar = (fasit === svar)
	$: regnestykke = `${tall1} * ${tall2} = ${fasit}`


	const sjekkSvar = () => {
		if(riktigsvar){
		klasse = ""       /*tar bort tall fra rammen*/
		setTimeout( () => { klasse = "faller" }, 1000)
		}
	}


		const gameOver = () => {
			console.log("GAME OVER")
	}
	let tall1 = Math.random() 
	let tall2 = Math.random() 

	$:t1 = Math.ceil(tall1)
	$:t2 = Math.ceil(tall2)

	$ : fasit = t1 * t2 

	const lahNyeTall = () => {
		let tall1 = Math.random()
		let tall2 = Math.random()

	}

</script>

<svelt:window on:click={lahNyeTall} />
<section>
<header>
	Fasit: {fasit} 
	Svar:  {svar}
	Har du svar riktig: {riktigsvar}
</header>
<main>
	<div on:animationed={gameOver} class="{klasse}"> {regnestykke} {t1} * {t2} = ?</div>

	
</main>

<footer>
	<input type="numer" bind:value={svar} on:input={sjekkSvar}>

</footer>
</section>

<style>

	@keyframes fallNed{
		to{
			transform: translateY(250px);
		}
	}


	.faller{
		animation: fallNed 5s linear forwards;
	}
 	main div {
	 width: 200px;
	height: 50px;
	line-height: 50px;
	margin: 10px auto;
	background-color: orange;
	text-align: center;
	font-size: 2rem;


 }

	section{
		background-image: ("bakgrunn.png");
	}
</style>