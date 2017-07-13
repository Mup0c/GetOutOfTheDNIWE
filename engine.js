"use strict"

$(document).ready(function(){
	const SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
	const HERO_FALLING_SPEED = 100;
	
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
	
	move_to = function(dx, dy) {
		if (game_over) return;
		
		console.log('move to: ' + dx + ' ' + dy);

		let x = engine.hero_coords[0], y = engine.hero_coords[1];

		if (dy < 0 && ((playing_matrix[y + 1][x]) == HOLE_INDEX || playing_matrix[y + 1][x] == SKY_INDEX))
			return;

		if (playing_matrix[y + dy][x + dx] == BLOCK_INDEX)
			move_block(x + dx, y + dy, dx);
		
		if (playing_matrix[y + dy][x + dx] == GRASS_INDEX || playing_matrix[y + dy][x + dx] == WALL_INDEX || playing_matrix[y + dy][x + dx] == BLOCK_INDEX)
			return;
		
		playing_matrix[y][x] = (y < EMPTY_BLOCK_INDEX + 2) ? SKY_INDEX : HOLE_INDEX;

		engine.hero_coords[0] += dx;
		engine.hero_coords[1] += dy;
		
		playing_matrix[y + dy][x + dx] = HERO_INDEX;
		
		repaint_field(playing_matrix);
		
		drop_hero();

		if (engine.hero_coords[0] === 1 || engine.hero_coords[0] === FIELD_WIDTH - 2){ // win
			$('#menu').show();
			$('#win').show();
			game_over = true;
		}
	}
	
	var drop_hero = function() {
		for (let i = engine.hero_coords[1]; i < FIELD_HEIGHT; ++i)
			if (playing_matrix[i][engine.hero_coords[0]] == SKY_INDEX || playing_matrix[i][engine.hero_coords[0]] == HOLE_INDEX) {
				
				setTimeout(function(){
					move_to(0, 1);
					drop_hero();
				}, HERO_FALLING_SPEED);
			}
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