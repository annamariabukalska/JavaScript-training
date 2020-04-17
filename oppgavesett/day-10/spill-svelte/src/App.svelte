<script>
	
	let klasse = "faller"
	
	let tall1 = 9
	let tall2 = 5
	$: fasit = tall1 * tall2
	let svar = ""
	let theGameIsOn = true
	$: riktigsvar = (fasit === svar)
	$: regnestykke = `${tall1} x ${tall2}`
	let poeng = 0
	
	const lagNyeTall = () => {
		tall1 =  Math.ceil(Math.random() * 10)
		tall2 =  Math.ceil(Math.random() * 10)
	}
	
	const sjekkSvar = () => {
		if(riktigsvar && theGameIsOn) {
			lagNyeTall()
			svar = ""	
			klasse = ""
			poeng++
			setTimeout( () => { klasse = "faller" }, 50 )
		}
		
	}
	
	const gameOver = () => {
		theGameIsOn = false
		console.log("GAME OVER")
	}
	
</script>


<section>
	<header>
		<div class="poeng">
			<label>Poeng</label>
			<p>{poeng}</p>
		</div>
		<div class="poeng">
			<label>Highscore</label>
			<p>0</p>
		</div>
	</header>	
	
	<main>
		<div on:animationend={gameOver} class="{klasse}">{regnestykke}</div>	
	</main>
	
	<footer>
		<input type="number" bind:value={svar} on:input={sjekkSvar}>
	</footer>
	
</section>

<style>

	*{
		margin: 0;
	}


	.faller{
		animation: fallNed 5s linear forwards;
	}

	.poeng p{
		font-weight: 700;

	}

	.poeng{
		text-align: center;
		font-size: 2rem;
		
	}

	@keyframes fallNed{
		to{
			transform: translateY(250px);
		}
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
		display: grid;
		grid-template-rows: auto 300px auto;
		font-size: 5rem;
		padding: 20px
	}

	footer{
		background-color: lightgreen;
	}

	input{
		width: 50%
	}

	header{
		background-color: lightblue;
		padding: 0.5rem;
		display: grid; 
		grid-template-columns: 1fr 1fr;	
	}

	main{
		background-image: url("/img/bakgrunn.png");

	}
	
</style>