"use strict"

$(document).ready(function(){

	const HERO_FALLING_SPEED = 100;
	const WALL_START_INDEX = EMPTY_BLOCK_INDEX + 1;
	const HOLE_BORDER = EMPTY_BLOCK_INDEX + 2;
	const BOOM_ANIGILETE = BLOCK_FALLING_SPEED-200;
	var BOOM_DELAY = 500;
	var timeouts_id = [];
	var BLOCK_SPAWN_SPEED = 2000;
	var BLOCK_FALLING_SPEED = 500;
	var DYNAMITE_CHANCE = 10;
	var BARREL_CHANCE = 20;
	var Difficulty;
	var SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
	var game_over = false;
	var playing_field = [];
	var engine;
	var IS_ARCADE = false;
	var DYNAMITE_SPAWNED = false;

	var Engine = function(){
		playing_field = this.generate_playing_field();
		
		create_field(playing_field);
		console.log(playing_field);
		
		this.spawn_hero(playing_field);		
		console.log('hero created: ' + this.hero_coords);
		
		console.log('engine loaded.');

		this.spawn_block(playing_field);
		this.lowering_of_blocks(playing_field);
		if (IS_ARCADE)
			timeouts_id.push(setTimeout(function(){
				engine.arcade_annihilate(playing_field)
			}, 500));
	
	}

	var move_block = function(x, y, dx) {
		if (game_over) return;

		if (playing_field[y - 1][x] in BLOCKS.SOLID || playing_field[y][x + dx] in BLOCKS.SOLID) // условие, что блок нельзя двигать
				return;

		let dy = 0;
		if (playing_field[y + 1][x + dx] in BLOCKS.ABSTRACT)
				dy++;

		if (playing_field[y][x] in BLOCKS.SOLID)
				playing_field[y + dy][x + dx] = playing_field[y][x]; // сдвигаем блок
			
		playing_field[y][x] = (y < HOLE_BORDER) ? 'SKY' : 'HOLE';
	
		repaint_field(playing_field);
	}
	
	var drop_hero = function() {
		if (game_over) return;
		
		for (let i = engine.hero_coords[1]; i < FIELD_HEIGHT; ++i)
			if (playing_field[i][engine.hero_coords[0]] in BLOCKS.ABSTRACT) { // если под порсонажем находятся абстрактные блоки
				console.log('drop hero')
				timeouts_id.push(setTimeout(function() {
					move_to(0, 1);
					drop_hero();
				}, HERO_FALLING_SPEED));
				return;
			}
	}
			
	move_to = function(dx, dy) {
		if (game_over) return;
		
		console.log('move to: ' + dx + ' ' + dy);

		let x = engine.hero_coords[0], y = engine.hero_coords[1];

		if (dy < 0 && playing_field[y + 1][x] in BLOCKS.ABSTRACT) // нельзя отпрыгнуть от воздуха
			return;

		if (playing_field[y + dy][x + dx] in BLOCKS.MOVE) // если на пути персонажа блок или динамит или бочка пытаемся сдвинуть
				move_block(x + dx, y + dy, dx);
		
		if (playing_field[y + dy][x + dx] in BLOCKS.SOLID) // если на пути персонажа несдвигаемый блок
			return;
		
		if (y < HOLE_BORDER)
			playing_field[y][x] = 'SKY';
		else
			playing_field[y][x] = 'HOLE';

		engine.hero_coords[0] += dx;
		engine.hero_coords[1] += dy;
		
		playing_field[y + dy][x + dx] = 'HERO';
		
		repaint_field(playing_field);
		
		drop_hero();

		if (engine.hero_coords[0] === 1 || engine.hero_coords[0] === FIELD_WIDTH - 2){ // условия победы
			stop_game('win');
		}
		
		
	}
	
	Engine.prototype.generate_playing_field = function(){
		let result = [];
		for (let i = 0; i < FIELD_HEIGHT; ++i) {
			let tmArr = [];
			for (let j = 0; j < FIELD_WIDTH; ++j){
				if (i <= EMPTY_BLOCK_INDEX || 
				(i == WALL_START_INDEX && 
				(j >= WALL_WIDTH && j < FIELD_WIDTH - WALL_WIDTH))){
					tmArr.push('SKY');
					continue;
				}	
				if (i == WALL_START_INDEX && (j < WALL_WIDTH || j >= FIELD_WIDTH - WALL_WIDTH)){
					tmArr.push('GRASS');
					continue;
				}
				if (((i > WALL_START_INDEX && j < WALL_WIDTH) || (i > WALL_START_INDEX && j >= FIELD_WIDTH - WALL_WIDTH)) || (i == FIELD_HEIGHT - 1)){
					tmArr.push('WALL');
					continue;
				}
				tmArr.push('HOLE');				
			}
				
			result.push(tmArr);
		}
		console.log('playing_field loaded');
		return result;
	}
	
	

	function get_random_coord(){
		return Math.round(Math.random() * (FIELD_WIDTH - WALL_WIDTH * 2 - 1)) + WALL_WIDTH;
	}
	
	Engine.prototype.spawn_hero = function(playing_field){
		let spawn_coord_x = get_random_coord();
		this.hero_coords = [spawn_coord_x, SPAWN_COORD_Y];
		var id = SPAWN_COORD_Y + '-' + spawn_coord_x;
		playing_field[this.hero_coords[1]][this.hero_coords[0]] = 'HERO';
		console.log('hero index = ' + playing_field[this.hero_coords[1]][this.hero_coords[0]]);
		$('#' + id).addClass('hero');
		
	}

  	Engine.prototype.lowering_of_blocks = function(playing_field) { // функция пробегает по всем блокам и опускает их
		if (game_over) return;
		for (let i = FIELD_HEIGHT - 2; i >= 0; i--)
			for (let j = WALL_WIDTH; j < FIELD_WIDTH - WALL_WIDTH; j++) {

				// для динамита //

				if ((playing_field[i][j] == 'DYNAMITE') && (playing_field[i + 1][j] in BLOCKS.SOLID)){  // условия взрыва
					if (IS_ARCADE){
					(i != FIELD_HEIGHT - 2) ? detanete(i, j) : 
					(DYNAMITE_SPAWNED ? DYNAMITE_SPAWNED = false : detanete(i, j));  //setTimeout(function(){detanete(i, j)}, BLOCK_SPAWN_SPEED)	
						
					}
					else
						detanete(i, j);
				}

				//////////////////

				// для бочки //

				if (playing_field[i][j] == 'BARREL' && playing_field[i + 1][j] in BLOCKS.SOLID) {   // если бочка на чём-то стоит

					if (playing_field[i][j - 1] in BLOCKS.ABSTRACT      &&
						(playing_field[i + 1][j - 1] in BLOCKS.ABSTRACT ||
						playing_field[i + 1][j - 1] == 'HERO')) {          // столкнём бочу вбок, а дольше будет падать сама
							playing_field[i][j - 1] = playing_field[i][j];
							if (i < HOLE_BORDER)
								playing_field[i][j] = 'SKY';
							else
								playing_field[i][j] = 'HOLE';
						}
						else {
							if (playing_field[i][j + 1] in BLOCKS.ABSTRACT &&
							(playing_field[i + 1][j + 1] in BLOCKS.ABSTRACT ||
							(playing_field[i + 1][j + 1] == 'HERO'))) {          // столкнём бочу вбок, а дольше будет падать сама
								playing_field[i][j + 1] = playing_field[i][j];
								if (i < HOLE_BORDER)
									playing_field[i][j] = 'SKY';
								else
									playing_field[i][j] = 'HOLE';
								j += 2;
							}						
						}
						drop_hero();
					}

				////////////////

				if (playing_field[i][j] in BLOCKS.MOVE &&            // условия падения
				(playing_field[i + 1][j] in BLOCKS.ABSTRACT || 
				(playing_field[i + 1][j] == 'HERO'))) {
					if (playing_field[i + 1][j] == 'HERO') 
						stop_game('loose');
					playing_field[i + 1][j] = playing_field[i][j];
					playing_field[i][j] = (i < HOLE_BORDER ? 'SKY' : 'HOLE');
				}
			}

		repaint_field(playing_field);

		timeouts_id.push(setTimeout(function(){
			Engine.prototype.lowering_of_blocks(playing_field)
		}, BLOCK_FALLING_SPEED));
	}
	
	function detanete(i, j){
		
		if (IS_ARCADE) FLAG = false;
		
		if (playing_field[i][j + 1] == 'HERO' || playing_field[i][j - 1] == 'HERO' ||
		playing_field[i + 1][j] == 'HERO' || playing_field[i - 1][j] == 'HERO')
			timeouts_id.push(setTimeout(function(){stop_game('loose')}, BOOM_ANIGILETE));
		
		playing_field[i][j] = 'BOOM';
		playing_field[i - 1][j] = 'BOOM';

		if (!(playing_field[i + 1][j] in BLOCKS.NOT_DESTROYED))
			playing_field[i + 1][j] = 'BOOM';

		if (!(playing_field[i][j + 1] in BLOCKS.NOT_DESTROYED))
			playing_field[i][j + 1] = 'BOOM';

		if (!(playing_field[i][j - 1] in BLOCKS.NOT_DESTROYED))
			playing_field[i][j - 1] = 'BOOM';
		
		timeouts_id.push(setTimeout(function(){
			if (i < HOLE_BORDER) {

				if (playing_field[i][j] == 'BOOM')	
				playing_field[i][j] = 'SKY';
			
				if (playing_field[i - 1][j] == 'BOOM') 
					playing_field[i - 1][j] = 'SKY';

				(i + 1 < HOLE_BORDER) ? playing_field[i + 1][j] = 'SKY' : playing_field[i + 1][j] = 'HOLE';

				if (playing_field[i][j + 1] == 'BOOM')
					playing_field[i][j + 1] = 'SKY';

				if (playing_field[i][j - 1] == 'BOOM')
					playing_field[i][j - 1] = 'SKY';

			} else {

				if (playing_field[i][j] == 'BOOM')
					playing_field[i][j] = 'HOLE';

				if (i - 1 < HOLE_BORDER){
					if (playing_field[i - 1][j] == 'BOOM')
						playing_field[i - 1][j] = 'SKY';
				}
				else
					if (playing_field[i - 1][j] == 'BOOM')
						playing_field[i - 1][j] = 'HOLE';

				if (playing_field[i + 1][j] == 'BOOM')
					playing_field[i + 1][j] = 'HOLE';

				if (playing_field[i][j + 1] == 'BOOM')
					playing_field[i][j + 1] = 'HOLE';

				if (playing_field[i][j - 1] == 'BOOM')
					playing_field[i][j - 1] = 'HOLE';
			}
		},BOOM_ANIGILETE/* + BOOM_DELAY*/));

		drop_hero();
	}


	function get_random_block(){
		return Math.round(Math.random() * 100);
	}

 	Engine.prototype.spawn_block = function(playing_field) {
	if (game_over) return;

		let spawn_block_coord = get_random_coord();

		let random_block = get_random_block();

		if (random_block < DYNAMITE_CHANCE)
			playing_field[0][spawn_block_coord] = 'DYNAMITE';
		else
			playing_field[0][spawn_block_coord] = (random_block > (100 - BARREL_CHANCE) ? 'BARREL' : 'BLOCK');

		repaint_field(playing_field);

		timeouts_id.push(setTimeout(function(){
			Engine.prototype.spawn_block(playing_field)
		}, BLOCK_SPAWN_SPEED));
	} 
	
	Engine.prototype.arcade_annihilate = function(playing_field){
		if (game_over) return;
		timeouts_id.push(setTimeout(function(){
			DYNAMITE_SPAWNED = true;
			let floor_index = FIELD_HEIGHT - 2;
			for (let j = WALL_WIDTH; j < FIELD_WIDTH - WALL_WIDTH - 1; j++)
				if ((j % 2) == 0)
					playing_field[floor_index][j] = 'DYNAMITE';
			repaint_field(playing_field);
			console.log(playing_field);
			Engine.prototype.arcade_annihilate(playing_field);
		}, BLOCK_SPAWN_SPEED * 12));
	}
	
	function stop_game(result){
		$('#menu').show();
		$('#' + result).show();
		game_over = true;
		return;
	}

	var set_diff = function(){
		switch (Difficulty) {
			case ('easy'): {
				IS_ARCADE = false;
				BARREL_CHANCE = 20;
				DYNAMITE_CHANCE = 10;				
				BLOCK_SPAWN_SPEED = 2000;
				BLOCK_FALLING_SPEED = 500;
				FIELD_WIDTH = 18;
				FIELD_HEIGHT = 12;
				BOOM_DELAY = 0;
				SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
				break; 
			}    
			case ('medium'): { 
				IS_ARCADE = false;
				BARREL_CHANCE = 10;
				DYNAMITE_CHANCE = 20;
				BLOCK_SPAWN_SPEED = 1300;
				BLOCK_FALLING_SPEED = 400;
				BOOM_DELAY = 0;
				FIELD_WIDTH = 12;
				FIELD_HEIGHT = 16;
				SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
				break; 
			}     
			case ('hard'): { 
				IS_ARCADE = false;
				BARREL_CHANCE = 5;
				DYNAMITE_CHANCE = 25;
				BLOCK_SPAWN_SPEED = 800;
				BLOCK_FALLING_SPEED = 350;
				FIELD_WIDTH = 12;
				FIELD_HEIGHT = 20;
				BOOM_DELAY = 0;
				SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
				break; 
			}
			case ('arcade'): {
				IS_ARCADE = true;
				BARREL_CHANCE = 20;
				DYNAMITE_CHANCE = 30;
				BLOCK_SPAWN_SPEED = 800;
				BLOCK_FALLING_SPEED = 400;
				FIELD_WIDTH = 16;
				FIELD_HEIGHT = 20;
				BOOM_DELAY = 500;
				SPAWN_COORD_Y = (FIELD_HEIGHT - 2);
				break; 
			}
		}
	}

	$('#play-btn').click(function () {
		console.log('___________');
		console.log(game_over);
		$('#play-btn').hide();	
		$('#loading').show();
		$('#win').hide();
		$('#loose').hide();
		$('#type-choose').hide();
		set_diff();
		timeouts_id.forEach(function(item, i, timeouts_id){
			console.log('timeout: ' + item + ' stoped');
			clearTimeout(item);
		});
		console.log('timeouts stoped');
		timeouts_id = [];
		game_over = false;
		$('#id_gamemap').empty();
		console.log('gamemap cleared');
		engine = new Engine();
		$('#menu').hide();
		$('#loading').hide();
		$('#type-choose').show();
		$('#play-btn').show();
	});
	
	$("#type-choose button").click(function(event) {
        $("#type-choose button").removeClass('active-btn');
        $(this).addClass('active-btn');
        Difficulty = ($(this).attr("id"));
    });
}); 