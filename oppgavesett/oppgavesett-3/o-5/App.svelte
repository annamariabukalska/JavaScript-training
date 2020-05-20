
<script>
  let prisutenmoms = prompt("Pris uten moms")
  let moms = "1.25"
  $: prismedmoms = prisutenmoms*moms
</script>

<div>
        <p>Pris uten moms: {prisutenmoms}</p>
        <p>Moms: {moms}</p>
        <p>Pris med moms: {prismedmoms}</p>
</div>

