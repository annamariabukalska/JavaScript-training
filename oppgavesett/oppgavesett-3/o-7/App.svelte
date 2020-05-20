<script>
	
	let y;
	$: skala = y / 20;
	
</script>

<svelte:window bind:scrollY={y} />
<main>
	
  <img src="https://images.squarespace-cdn.com/content/v1/5391fac1e4b07b6926545c34/1421428984818-UDPRDNSLGXKFDXXNPH35/ke17ZwdGBToddI8pDm48kO6t_FIigFZlD-2ukJs68NZ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1Ua_Bo-6wCJQLWZitxYCQrUvnjn6LFew3nzFr3QCHcE-zm7cT0R_dexc_UL_zbpz6JQ/image-asset.png" id="earth" style="transform: rotate({y}deg) scale({skala})"> 
  <img src="http://roamenighets.barnehage.no/bilder/RenderResizedImage/0d332c79-aad4-44cf-b88d-aaa6284a303c?size=f600x400" id="mars" style="transform:  scale({skala})">
  

</main>

<style>
  #earth {
		width: 90px;
		height: 90px;
		position: fixed;
		left: calc(50% - 10px);
		top: calc(50% - 10px);
	}
  
	#mars {
		width: 30px;
		height: 30px;
		position: fixed;
		left: calc(30% - 10px);
		top: calc(20% - 10px);
	}

	main {		
		height: 500vh;
	}
	
	
</style>