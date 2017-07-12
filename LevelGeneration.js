"use strict"

const FIELD_WIDTH = 18;
const FIELD_HEIGHT = 12;
const WALL_WIDTH = 3;
const EMPTY_BLOCK_INDEX = 4;
const CELL_WIDTH = 44;
const CELL_HEIGTH = 44;
const SKY_INDEX = 0;
const WALL_INDEX = 1;
const BLOCK_INDEX = 2;
const HOLE_INDEX = 3;
const GRASS_INDEX = 4;
const HERO_INDEX = 5;
const WALL_START_INDEX = EMPTY_BLOCK_INDEX + 1;

console.log('LevelGeneration loading');
console.log('__________________');
console.log('FIELD_WIDTH = ' + FIELD_WIDTH);
console.log('FIELD_HEIGHT = ' + FIELD_HEIGHT);
console.log('WALL_WIDTH = ' + WALL_WIDTH);
console.log('CELL_WIDTH = ' + CELL_WIDTH);
console.log('CELL_HEIGTH = ' + CELL_HEIGTH);

var create_field = function(playing_matrix){
	console.log('creating field...');
	$("#id_gamemap").css({
			'width': CELL_WIDTH * FIELD_WIDTH + 'px',
			'height': CELL_HEIGTH * FIELD_HEIGHT + 'px'
		});
	for (let i = 0; i < FIELD_HEIGHT; ++i) {
		for (let j = 0; j < FIELD_WIDTH; ++j) {
			var id = i + '-' + j;
			$( '#id_gamemap').append( '<div id="' + id +'" class="cell">');
			switch (playing_matrix[i][j]) {
				case (SKY_INDEX)  : { $('#' + id).addClass('sky');   break }
			    case (WALL_INDEX) : { $('#' + id).addClass('wall');  break }
				case (HOLE_INDEX) : { $('#' + id).addClass('hole');  break }
				case (GRASS_INDEX): { $('#' + id).addClass('grass'); break }
			}
			console.log(document.getElementById(id).className);
			$('#' + id).css({
				'width': CELL_WIDTH + 'px',
				'height': CELL_HEIGTH + 'px'
			});
		}
	}
	console.log('creating field sucsesfull');
};

var repaint_field = function(playing_matrix){
	for (let i = 0; i < FIELD_HEIGHT; ++i) {
		for (let j = 0; j < FIELD_WIDTH; ++j) {
			var id = i + '-' + j;
			document.getElementById(id).className = 'cell';
			 
			switch (playing_matrix[i][j]) {
				case (SKY_INDEX)  : {$('#' + id).addClass('sky');   break }
				case (WALL_INDEX) : {$('#' + id).addClass('wall');  break }
				case (HOLE_INDEX) : {$('#' + id).addClass('hole');  break }
				case (GRASS_INDEX): {$('#' + id).addClass('grass'); break }
				case (HERO_INDEX) : {$('#' + id).addClass('hero');  break }
				case (BLOCK_INDEX): {$('#' + id).addClass('block'); break }
			}
		}
	}
	console.log('field repainted');
}
console.log('LevelGeneration loaded');