class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
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
			var cartes_d = l_game.nCartes;
			var amplada = cartes_d/2 * 96;
			var altura = cartes_d/2 * 128;
			if (cartes_d > 5){ var f = 3; var c = 4;}
			else{var f = 2; var c = cartes_d;}
			this.correct=l_game.correct;
			var puntuacio_a_restar = l_game.restaPunts_s;
			var temporitzador = l_game.temps_s;
			var vecCards = cartes.slice(0, cartes_d * 2)
			vecCards = l_game.arraycards_s;
			let cart=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					this.add.image(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, vecCards[cart]);
					cart += 1;	
				}
			}
		}
		else{
			var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
			var user = sessionStorage.getItem("username","unknown");
			var options_data = JSON.parse(json);
			var cartes_d = options_data.cards;
			var dificultat = options_data.dificulty;
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
			var vecCards = cartes.slice(0, cartes_d * 2)
			vecCards.sort((a, b) => 0.5 - Math.random());
			let cart=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					this.add.image(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, vecCards[cart]);
					cart += 1;	
				}
			}
		}
		setTimeout(() => {
			this.cards = this.physics.add.staticGroup();
			let car=0;
			for (let i = 0; i < c; i++){
				for (let j = 0; j < f; j++){
					if(l_game){
						if(l_game.cards_s[car]==true){
							this.cards.create(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, 'back');
						}
					}else{
						this.cards.create(i*125 + this.cameras.main.centerX - amplada, j*150 + this.cameras.main.centerY - altura/2, 'back');
					}
					car++;
				}
			}
			let i = 0;
			this.cards.children.iterate((card)=>{
				if(l_game){
					while(l_game.cards_s[i]==false){
						i++;
					}
					card.card_id = vecCards[i];	
					i++;
				}
				else{
					card.card_id = vecCards[i];	
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
									loadpage("../");
								}
							}
							else{
								this.correct++;
								if (this.correct >= cartes_d){
									alert("You Win with " + this.score + " points.");
									loadpage("../");
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
        const button = this.add.sprite(this.cameras.main.centerX , this.cameras.main.height - 200, 'boton');
		button.scaleX = .4;
		button.scaleY = .4;
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
				username: user,
				arraycards_s:vecCards,
				nCartes:cartes_d,
				restaPunts_s:puntuacio_a_restar,
				temps_s:temporitzador,
				cards_s: cards_p,
				correct:this.correct,
				score: this.score,
				infinite: false
			 };
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			arrayPartides.push(partida);
			localStorage.partides = JSON.stringify(arrayPartides);
			loadpage("../");
        });
	}
	
	update (){	}
}

