"use strict"

var FIELD_WIDTH = 18;
var FIELD_HEIGHT = 12;

const WALL_WIDTH = 3;
const EMPTY_BLOCK_INDEX = 4;
const CELL_WIDTH = 44;
const CELL_HEIGTH = 44;
const BLOCKS = {SOLID : {BLOCK: 0, DYNAMITE: 0, BARREL: 0, WALL: 0, GRASS: 0},
		ABSTRACT: {SKY: 0, HOLE: 0, BOOM: 0},
		MOVE: {BLOCK: 0, DYNAMITE: 0, BARREL: 0},
		NOT_DESTROYED : {WALL: 0, GRASS: 0}}


console.log('LevelGeneration loading');
console.log('__________________');
console.log('FIELD_WIDTH = '  + FIELD_WIDTH);
console.log('FIELD_HEIGHT = ' + FIELD_HEIGHT);
console.log('WALL_WIDTH = '   + WALL_WIDTH);
console.log('CELL_WIDTH = '   + CELL_WIDTH);
console.log('CELL_HEIGTH = '  + CELL_HEIGTH);

var create_field = function(playing_field){
	console.log('creating field...');
	$("#id_gamemap").css({
			'width': CELL_WIDTH * FIELD_WIDTH + 'px',
			'height': CELL_HEIGTH * FIELD_HEIGHT + 'px'
		});
	for (let i = 0; i < FIELD_HEIGHT; ++i) {
		for (let j = 0; j < FIELD_WIDTH; ++j) {
			var id = i + '-' + j;
			$( '#id_gamemap').append( '<div id="' + id +'" class="cell">');

			let class_name;
			switch (playing_field[i][j]) {
				case ('SKY')  : { class_name = 'sky';   break }
			    case ('WALL') : { class_name = 'wall';  break }
				case ('HOLE') : { class_name = 'hole';  break }
				case ('GRASS'): { class_name = 'grass'; break }
			}
			$('#' + id).addClass(class_name);
			console.log(document.getElementById(id).className);
			$('#' + id).css({
				'width': CELL_WIDTH + 'px',
				'height': CELL_HEIGTH + 'px'
			});
		}
	}
	console.log('creating field sucsesfull');
};

var repaint_field = function(playing_field){
	for (let i = 0; i < FIELD_HEIGHT; ++i) {
		for (let j = 0; j < FIELD_WIDTH; ++j) {

			var id = i + '-' + j;
			document.getElementById(id).className = 'cell';

			let class_name;
			switch (playing_field[i][j]) {
				case ('SKY')      : { class_name = 'sky';      break }
				case ('WALL')     : { class_name = 'wall';     break }
				case ('HOLE')     : { class_name = 'hole';     break }
				case ('GRASS')    : { class_name = 'grass';    break }
				case ('HERO')     : { class_name = 'hero';     break }
				case ('DYNAMITE') : { class_name = 'dynamite'; break }
				case ('BLOCK')    : { class_name = 'block';    break }
				case ('BARREL')   : {(i < EMPTY_BLOCK_INDEX + 2) ?  class_name = 'barrel_sky' :  class_name = 'barrel_hole';  break }
				case ('BOOM')     : {(i < EMPTY_BLOCK_INDEX + 2) ?  class_name = 'boom_sky' :  class_name = 'boom_hole';  break }
			}
			$('#' + id).addClass(class_name);
		}
	}
	console.log('field repainted');
}
console.log('LevelGeneration loaded');