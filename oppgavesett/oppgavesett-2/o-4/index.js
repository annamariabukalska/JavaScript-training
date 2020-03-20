const xPos = prompt("Hvilken xpos ønsker du?");
const yPos = prompt("Hvilken ypos ønsker du?");

const box = document.querySelector("#box");


box.style.left =`${xPos}px`;
box.style.top = `${yPos}px`;