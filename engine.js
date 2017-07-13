"use strict"

$(document).ready(function(){
	const SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
	
	var game_over = false;
	var playing_matrix = [];

	var Engine = function(){
		playing_matrix = this.generate_playing_matrix();
		
		create_field(playing_matrix);
		console.log(playing_matrix);
		
		this.spawn_hero(playing_matrix);		
		console.log('hero created: ' + this.hero_coords);
		
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
	
	function get_random_coord(){
		return Math.round(Math.random() * (FIELD_WIDTH - WALL_WIDTH * 2 - 1)) + WALL_WIDTH;
	}
	
	
	Engine.prototype.spawn_hero = function(playing_matrix){
		let spawn_coord_x = get_random_coord();
		this.hero_coords = [spawn_coord_x, SPAWN_COORD_Y];
		var id = SPAWN_COORD_Y + '-' + spawn_coord_x;
		playing_matrix[this.hero_coords[1]][this.hero_coords[0]] = HERO_INDEX;
		console.log('hero index = ' + playing_matrix[this.hero_coords[1]][this.hero_coords[0]]);
		$('#' + id).addClass('hero');
		
	}
	
	var engine;
	
	$('#play-btn').click(function () {
		console.log('___________');
		console.log(game_over);
		$('#play-btn').hide();	
		$('#loading').show();
		$('#win').hide();
		$('#loose').hide();
		$('#type-choose').hide();
		setTimeout(function(){
			game_over = false;
			$('#id_gamemap').empty();
			console.log('gamemap cleared');
			engine = new Engine();
			$('#menu').hide();
			$('#loading').hide();
			$('#type-choose').show();
			$('#play-btn').show()
		}, 2001);
	});
}); 