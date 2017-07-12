"use strict"

$(document).ready(function(){
	
	var playing_matrix = [];

	var Engine = function(){
		playing_matrix = this.generate_playing_matrix();
		
		create_field(playing_matrix);
		console.log(playing_matrix);
		
		console.log('engine loaded.');
	}
	
	Engine.prototype.generate_playing_matrix = function(){
		let result = [];
		for (let i = 0; i < FIELD_HEIGHT; ++i) {
			let tmArr = [];
			for (let j = 0; j < FIELD_WIDTH; ++j){
				if (i <= EMPTY_BLOCK_INDEX || 
				(i == WALL_START_INDEX && 
				(j >= WALL_WIDTH && j < FIELD_WIDTH - WALL_WIDTH))){
					tmArr.push(SKY_INDEX);
					continue;
				}	
				if (i == WALL_START_INDEX && (j < WALL_WIDTH || j >= FIELD_WIDTH - WALL_WIDTH)){
					tmArr.push(GRASS_INDEX);
					continue;
				}
				if (((i > WALL_START_INDEX && j < WALL_WIDTH) || (i > WALL_START_INDEX && j >= FIELD_WIDTH - WALL_WIDTH)) || (i == FIELD_HEIGHT - 1)){
					tmArr.push(WALL_INDEX);
					continue;
				}
				tmArr.push(HOLE_INDEX);				
			}
				
			result.push(tmArr);
		}
		console.log('playing_matrix loaded');
		return result;
	}
	
	var engine = new Engine;
}); 