import './style.css'
import { createPop } from './create.js'
import edit  from './edit.js'
const menuToggle = document.getElementById("menu-toggle");
const hamburgerMenu = document.querySelector(".hamburger-menu");

const add = document.querySelector('.add')

document.addEventListener("click", (event) => {
    if (
        !hamburgerMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        menuToggle.checked = false;
    }
});

createPop()
edit()