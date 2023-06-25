var menu = new Vue({
	el: "#menu_id",
	methods: {
		start_game(mode) {
			sessionStorage.clear();
			name = prompt("User name");
			sessionStorage.setItem("username", name);
			
			if (mode == "standard") loadpage("html/standard.html");
			else if (mode == "infinite") loadpage("html/infinite.html");
			//Podria haver fet un loadpage("html/" + mode + ".html") o algo aixi però per simplicitat i perquè no depengui del nom del html 
			//(ja que per qualsevol motiu si vulgués seguir en el projecte i decidís canviar noms dels html no tingui problemes.)
		},
		load() {
			loadpage("html/load.html");
		},
		options() {
			loadpage("html/options.html");
		},
		scoreboard(){
			loadpage("html/scoreboard.html");
		},
		exit() {
			if (name != ""){
				alert("Leaving " + name + "'s game");
			}
			name = "";
			localStorage.clear();
			loadpage("../index.html");
		}
	}
});