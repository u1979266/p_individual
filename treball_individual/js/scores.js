var load_objS = function(){
	var vue_instance = new Vue({
		el: "#scores_id",
		data: {
			scores: []
		},
		created: function(){
			let arrayScores = [];
			if(localStorage.scores){
				arrayScores = JSON.parse(localStorage.scores);
				if(!Array.isArray(arrayScores)) arrayScores = [];
			}
			this.scores = arrayScores;
		},
	});
	return {}; 
}();

