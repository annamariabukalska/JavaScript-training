
<script>
  let size = ""
  let font = ""
  let color = ""
  let colorBackground = ""

</script>
<main style="background-color: {colorBackground}; color: {color}">
<h1>Min side</h1>

<input bind:value={size} type="text" placeholder="Size">

<input bind:value={font} type="text" placeholder="Font">

<input bind:value={color} type="color">
<div>{color}</div>

<input bind:value={colorBackground} type="color">
<div>{colorBackground}</div>

</main>

