
<script>
  let bilde = prompt("Hvilke bildet velger du?")
  let width = prompt("Hvor stor bilde vil du ha?")
  let title = prompt("Hvilke titelen velger du?")
</script>

<div>
  <h1>{title}</h1>
  <img src={bilde} alt={title} style=width:{width}px>
</div>



