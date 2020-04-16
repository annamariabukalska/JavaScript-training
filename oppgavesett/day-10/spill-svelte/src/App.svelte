<script>
 	let klasse = "faller"


	tall1 = Math.ceil(tall1)
	tall2 = Math.ceil(tall2)

	$ : fasit = tall1 * tall2 

	let svar = ""
	let theGameIsOn = true
	$: riktigsvar = (fasit === svar)
	$: regnestykke = `${tall1} * ${tall2}`
    let poeng = 0

	const lagNyeTall = () => {
		tall1 = Math.ceil(Math.random())
		tall2 = Math.ceil(Math.random())

	}

	const sjekkSvar = () => {
		if(riktigsvar && theGameIsOn){
			lagNyeTall()  
			svar = ""
			klasse = ""       /*tar bort tall fra rammen*/
			poeng ++
			setTimeout( () => { klasse = "faller" }, 1000)
		}
	}


		const gameOver = () => {
			console.log("GAME OVER")
	}
	

	

</script>

<svelt:window on:click={lagNyeTall} />
<section>
<header>
	<div>Poeng: {poeng}</div>
</header>
<main> 
	<div on:animationed={gameOver} class="{klasse}"></div>

	
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