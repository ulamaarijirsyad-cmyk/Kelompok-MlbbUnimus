// SEARCH HERO
function searchHero() {

let input = document.getElementById("searchHero").value.toLowerCase();

let heroes = document.querySelectorAll(".hero-card");

heroes.forEach(function(hero){

let name = hero.querySelector("h3").textContent.toLowerCase();

if(name.includes(input)){
hero.style.display = "";
}else{
hero.style.display = "none";
}

});

}


// DRAG & DROP HERO TIER

// ambil hero
const heroes = document.querySelectorAll(".hero-card");

// ambil semua area drop (tier + hero pool)
const dropZones = document.querySelectorAll(".tier, .hero-pool");

heroes.forEach(hero => {

hero.setAttribute("draggable", true);

hero.addEventListener("dragstart", function(){
this.classList.add("dragging");
});

hero.addEventListener("dragend", function(){
this.classList.remove("dragging");
});

});


// semua area bisa menerima drop
dropZones.forEach(zone => {

zone.addEventListener("dragover", function(e){
e.preventDefault();
});

zone.addEventListener("drop", function(){

const hero = document.querySelector(".dragging");

if(hero){
this.appendChild(hero);
}

});

});