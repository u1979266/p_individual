class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.totalPunts=0;
		this.correct = 0;
		this.level=0;
		this.user="";
		this.mostrantError=false;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
		this.load.image('boton', '../resources/boton.png');
	}
	
    create (){	
		let cartes = ['co', 'co', 'cb', 'cb', 'sb', 'sb', 'so', 'so', 'tb', 'tb', 'to', 'to'];
		this.cameras.main.setBackgroundColor(0x323C3C);
		let l_game = null;
		if (sessionStorage.idPartida && localStorage.partides){
			let vecPartides = JSON.parse(localStorage.partides);
			if (sessionStorage.idPartida < vecPartides.length)
				l_game = vecPartides[sessionStorage.idPartida];
		}
		if (l_game){
			this.level=l_game.nivell;
			this.user=l_game.username;
			var cartes_d = l_game.nCartes;
			var amplada = cartes_d/2 * 96;
			var altura = cartes_d/2 * 128;
			if (cartes_d > 5){ var f = 3; var c = 4;}
			else{var f = 2; var c = cartes_d;}
			this.correct=l_game.correct;
			this.totalPunts=l_game.totalP;
			var puntuacio_a_restar = l_game.restaPunts_s;
			var temporitzador = l_game.temps_s;
			var arraycards = cartes.slice(0, cartes_d * 2)
			arraycards = l_game.arraycards_s;
			let cart=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					this.add.image(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, arraycards[cart]);
					cart += 1;	
				}
			}
		}
		else{
			var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","rPunts":10}';
			this.user = sessionStorage.getItem("username","unknown");
			var options_data = JSON.parse(json);
			var cartes_d = options_data.cards;
			var dificultat = options_data.dificulty;
			var puntuacio_a_restar = options_data.rPunts;
			var amplada = cartes_d/2 * 96;
			var altura = cartes_d/2 * 128;
			if (cartes_d > 5){ var f = 3; var c = 4;}
			else{var f = 2; var c = cartes_d;}
			var puntuacio_a_restar = null;
			var temporitzador = null;
			if (dificultat == "easy"){
				puntuacio_a_restar = 5;
				temporitzador = 2000;
			}
			else if (dificultat == "normal"){
				puntuacio_a_restar = 10;
				temporitzador = 1000;
			}
			else {
				puntuacio_a_restar = 20;
				temporitzador = 500;
			}
			var arraycards = cartes.slice(0, cartes_d * 2)
			arraycards.sort((a, b) => 0.5 - Math.random());
			let cart=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					this.add.image(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, arraycards[cart]);
					cart += 1;	
				}
			}
		}
		setTimeout(() => {
			this.cards = this.physics.add.staticGroup();
			let carta=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					if(l_game){
						if(l_game.cards_s[carta]==true){
							this.cards.create(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, 'back');
						}
					}else{
						this.cards.create(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, 'back');
					}
					carta++;
				}
			}
			let i = 0;
			this.cards.children.iterate((card)=>{
				if(l_game){
					while(l_game.cards_s[i]==false){
						i++;
					}
					card.card_id = arraycards[i];	
					i++;
				}
				else{
					card.card_id = arraycards[i];	
					i++;
				}				
				card.setInteractive();
				card.on('pointerup', () => {
					if(!this.mostrantError){
						card.disableBody(true,true);
						if (this.firstClick){
							if (this.firstClick.card_id !== card.card_id){
								this.score -= puntuacio_a_restar;
								this.mostrantError=true;
								setTimeout(()=> {
									this.firstClick.enableBody(false, 0, 0, true, true);
									card.enableBody(false, 0, 0, true, true);
									this.mostrantError=false;
									this.firstClick = null;
								},temporitzador)
								if (this.score <= 0){
									alert("Game Over");
									var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","rPunts":10}';
									var options_data = JSON.parse(json);
									options_data.cards = 2;
									options_data.dificulty = "easy";
									options_data.rPunts = 10;	
									localStorage.setItem("config", JSON.stringify(options_data));
									let scoreF = {
										punts: this.totalPunts,
										username: this.user
									 };
									let arrayScores = [];
									if (localStorage.scores) {
									arrayScores = JSON.parse(localStorage.scores);
									if (!Array.isArray(arrayScores)) {
										arrayScores = [];
									} else {
										let scoreExistente = arrayScores.find(scoreF => this.user === scoreF.username && this.score > scoreF.punts);
										if (scoreExistente) {
										Object.assign(scoreExistente, scoreF);
										} else {
											arrayScores.push(scoreF);
										}
									}
									} else {
										arrayScores.push(scoreF);
									}
									arrayScores.sort((a, b) => b.punts - a.punts);
									console.log(arrayScores);
									localStorage.scores = JSON.stringify(arrayScores);
									alert(this.user + " has fet " +this.totalPunts+" punts");
									loadpage("../");
								}
							}
							else{
								this.correct++;
								if (this.correct >= cartes_d){
									this.totalPunts+=this.score;
									this.score=100;
									this.level++;
									this.correct=0;
									if (cartes_d < 6) cartes_d++;
									if (dificultat == "easy"){dificultat = "normal";}
									else if (dificultat == "normal"){dificultat = "hard";}
									puntuacio_a_restar += 1;
									sessionStorage.idPartida=null;
									var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","rPunts":10}';
									var options_data = JSON.parse(json);
									options_data.cards = cartes_d;
									options_data.dificulty = dificultat;
									options_data.rPunts = puntuacio_a_restar;	
									localStorage.setItem("config", JSON.stringify(options_data));
									this.scene.restart();
								}
								this.firstClick = null;
							}
						}
						else{
							this.firstClick = card;
						}
					}
				}, card);
			});
		}, temporitzador)

		var text = this.add.text(this.cameras.main.centerX, 0, 'Level ' + this.level, { fontSize: '64px', fill: '#000' ,fontWeight: 'bold'});
		text.setOrigin(0.5, 0);
		text.setY(text.height / 2);

        const button = this.add.sprite(this.cameras.main.centerX , this.cameras.main.height - 200, 'boton');
		button.scaleX = 0.4;
		button.scaleY = 0.4;
        button.setInteractive();
        const buttonText = this.add.text(0, 0, 'SAVE', { fontSize: '64px', fill: '#000', fontWeight: 'bold'});
        Phaser.Display.Align.In.Center(buttonText, button);
        button.on('pointerdown', () => {
			let cards_p = {};
			let i=0;
			this.cards.children.iterate((card) => {
				cards_p[i] = card.active;
				i++;
			});
			let partida = {
				username: this.user,
				arraycards_s:arraycards,
				nCartes:cartes_d,
				restaPunts_s:puntuacio_a_restar,
				temps_s:temporitzador,
				cards_s: cards_p,
				correct:this.correct,
				score: this.score,
				totalP: this.totalPunts,
				nivell: this.level,
				infinite: true
			};
			let vecPartides = [];
			if (localStorage.partides) {
				vecPartides = JSON.parse(localStorage.partides);
			   	if (!Array.isArray(vecPartides)) {
					vecPartides = [];
				} 
				else {
					let partidaExistente = vecPartides.find(partida => this.user === partida.username);
					if (partidaExistente) {
						Object.assign(partidaExistente, partida);
					} else {
						arrayPartides.push(partida);
					}
				}	
			} else arrayPartides.push(partida);

			localStorage.partides = JSON.stringify(vecPartides);
			loadpage("../");
        });
	}
	
	update (){	}
}

