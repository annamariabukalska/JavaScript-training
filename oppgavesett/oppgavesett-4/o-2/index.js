const listVenn = document.querySelector("#listVenn");

const inpNyVenn = document.querySelector("#inpNyVenn");
const inpNyAlder = document.querySelector("#inpNyAlder");
const btn = document.querySelector("#btn");
btn.onclick = addVenn;

let allVenner = [
    { navn: "Olga", alder: 28 },
    { navn: "Idar", alder: 24 },
    { navn: "Markus", alder: 32 }
  ]

  const table = document.getElementById("myTable");
  const row = table.insertRow(0);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

function viewVenn(){

    listVenn.innerHTML = "";

    for(const venn of allVenner) {
        listVenn.innerHTML += `<li>${venn.navn} (${venn.alder})</li>`;

    }
}

function addVenn() {

    const newFriend = { navn: inpNyVenn.value, alder: inpNyAlder.value }
    allVenner = [...allVenner, newFriend];
    viewVenn();
    inpNyVenn.value = "";
    inpNyAlder.value = "";

}

viewVenn();
