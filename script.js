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