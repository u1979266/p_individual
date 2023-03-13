const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var a = {easy: 3, normal: 2, hard: 1}

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0,
		game_started: false
	},
	created: function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		options_data = JSON.parse(json);
		this.num_cards = options_data.cards

		console.log(a[options_data.dificulty])
		console.log(json)

		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
	
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: back});
			Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}

		setTimeout(() => {
			for (var i = 0; i < this.items.length; i++){
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
			this.game_started = true
		}, 1000 * a[options_data.dificulty]);
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if (!this.game_started) return;
			if (value.texture === back) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			return 100 - this.bad_clicks * (50 - 10 * a[options_data.dificulty]);
		}
	}
});


//si és hard (1): S'ha de restar 40, si és normal (2): s'ha de restar 30 i si és easy (3): s'ha de restar 20 per cada error.

//f(x) si x = 1, f(x) = 40
//si x = 2, f(x) = 30
//si x = 3, f(x) = 20

//f(x) = 50 - 10 * x