if (exports!=undefined)
{
	exports.getDungeon=function()
	{
		var grid = new dungeon({
				room_layout:		'Scattered',
				n_rows:				31,
				n_cols:				31,
				room_min:			3,
				room_max:			9,
				corridor_layout:	'Bent',
				remove_deadends:	50, // percent
				add_stairs:			2,
				map_style:			'Standard'
			}).getGrid();		
	}
	
	var dungeon = require('dungeon');
	var WORLD = "WORLD";
	
	exports.getRandomWorld = function(id)
	{
		var key = this.makeWorldKey(id);
		var grid = dungeon.getDungeon();
		return {"key":key, "grid":grid};
	}
	
	exports.makeWorldKey(id)
	{
		return makeKey(WORLD, id);
	}
	
	
	function makeKey(prefix, value)
	{
		return prefix + ":" + value;
	}
	
}


// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// dungeon.js
//
// Random Dungeon Generator by drow, ported to js by nagy.pite
// http://donjon.bin.sh/
//
// This code is licensed under a
// Creative Commons Attribution-NonCommercial 3.0 Unported License
// http://creativecommons.org/licenses/by-nc/3.0/

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
"use strict";

var dungeon = function(settings) {

	// CONFIGURATION

	this.layout = {
		'Box':		[[1,1,1],[1,0,1],[1,1,1]],
		'Cross':	[[0,1,0],[1,1,1],[0,1,0]]
	}

	this.door_table = {
		'Arch'        :  15,
		'Door'        :  45,
		'Locked'      :  15,
		'Trapped'     :  15,
		'Secret'      :  10,
		'Porticullis' :  10
	}

	this.corridor_layout = {
		'Labyrinth'   :   0,
		'Bent'        :  50,
		'Straight'    : 100
	}

	this.map_style = {
		'Standard' : {
			'fill'      : '000000',
			'open'      : 'FFFFFF',
			'open_grid' : 'CCCCCC',
		}
	}

	// CELL BITS

	this.NOTHING     = 0x00000000;

	this.BLOCKED     = 0x00000001;
	this.ROOM        = 0x00000004;
	this.CORRIDOR    = 0x00000004;
	//                 0x00000008;
	this.PERIMETER   = 0x00000010;
	this.ENTRANCE    = 0x00000020;
	this.ROOM_ID     = 0x0000FFC0;

	this.ARCH        = 0x00010000;
	this.DOOR        = 0x00020000;
	this.LOCKED      = 0x00040000;
	this.TRAPPED     = 0x00080000;
	this.SECRET      = 0x00100000;
	this.PORTICUL    = 0x00200000;
	this.STAIR_DN    = 0x00400000;
	this.STAIR_UP    = 0x00800000;

	this.LABEL       = 0xFF000000;

	this.OPENSPACE   = this.ROOM | this.CORRIDOR;
	this.DOORSPACE   = this.ARCH | this.DOOR | this.LOCKED | this.TRAPPED | this.SECRET | this.PORTICUL;
	this.ESPACE      = this.ENTRANCE | this.DOORSPACE | 0xFF000000;
	this.STAIRS      = this.STAIR_DN | this.STAIR_UP;

	this.BLOCK_ROOM  = this.BLOCKED | this.ROOM;
	this.BLOCK_CORR  = this.BLOCKED | this.PERIMETER | this.CORRIDOR;
	this.BLOCK_DOOR  = this.BLOCKED | this.DOORSPACE;

	// DOOR TABLE
	this.doorTypes = {};
	this.doorTypes[this.ARCH]		= {label:'',	key:'arch',		type:'Archway'};
	this.doorTypes[this.DOOR]		= {label:'o',	key:'open',		type:'Unlocked door'};
	this.doorTypes[this.LOCKED]		= {label:'x',	key:'lock',		type:'Locked door'};
	this.doorTypes[this.TRAPPED]	= {label:'t',	key:'trap',		type:'Trapped door'};
	this.doorTypes[this.SECRET]		= {label:'s',	key:'secret',	type:'Secret door'};
	this.doorTypes[this.PORTICUL]	= {label:'#',	key:'portic',	type:'Porticullis'};

	// DIRECTIONS
	this.di = { 'north' : -1, 'south' :  1, 'west' :  0, 'east' :  0 };
	this.dj = { 'north' :  0, 'south' :  0, 'west' : -1, 'east' :  1 };
	this.dj_dirs = ['east', 'north', 'south', 'west'];

	this.opposite = {
		'north'       : 'south',
		'south'       : 'north',
		'west'        : 'east',
		'east'        : 'west'
	};

	// STAIRS
	this.stair_end = {
		'north' : {
			'walled'    : [[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],
			'corridor'  : [[0,0],[1,0],[2,0]],
			'stair'     : [0,0],
			'next'      : [1,0]
		},
		'south' : {
			'walled'    : [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]],
			'corridor'  : [[0,0],[-1,0],[-2,0]],
			'stair'     : [0,0],
			'next'      : [-1,0]
		},
		'west' : {
			'walled'    : [[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1]],
			'corridor'  : [[0,0],[0,1],[0,2]],
			'stair'     : [0,0],
			'next'      : [0,1]
		},
		'east' : {
			'walled'    : [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1]],
			'corridor'  : [[0,0],[0,-1],[0,-2]],
			'stair'     : [0,0],
			'next'      : [0,-1]
		}
	};

	// CLEANING
	this.close_end = {
		'north' : {
			'walled'    : [[0,-1],[1,-1],[1,0],[1,1],[0,1]],
			'close'     : [[0,0]],
			'recurse'   : [-1,0],
		},
		'south' : {
			'walled'    : [[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]],
			'close'     : [[0,0]],
			'recurse'   : [1,0],
		},
		'west' : {
			'walled'    : [[-1,0],[-1,1],[0,1],[1,1],[1,0]],
			'close'     : [[0,0]],
			'recurse'   : [0,-1],
		},
		'east' : {
			'walled'    : [[-1,0],[-1,-1],[0,-1],[1,-1],[1,0]],
			'close'     : [[0,0]],
			'recurse'   : [0,1],
		},
	};

	// REPRESENTATION

	this.color_chain = {
		'door'        : 'fill',
		'label'       : 'fill',
		'stair'       : 'wall',
		'wall'        : 'fill',
		'fill'        : 'black',
	};

	////////////////////////////////////////////
	// SHOWTIME, it is

	this.init = function(settings) {
		this.getSettings(settings);
		this.createDungeon();
	}

	this.getSettings = function(settings) {
		// Map Style, Dungeon Size, Layout, Room Size,
		// Room Layout, Doors, Cooridors,
		// Remove Deadends, Add Stairs

		// defaults
		var opts = {
			n_rows:				31,
			n_cols:				31,
			room_min:			3,
			room_max:			9,
			room_layout:		'Scattered',
			corridor_layout:	'Bent',
			remove_deadends:	50, // percent
			add_stairs:			2,
			map_style:			'Standard'
		}

		// merging settings
		for (var st in settings) {
			if (st in opts) opts[st] = settings[st];
		}

		self.opts = opts;
	}

	this.createDungeon = function() {
		self.dungeon = {};
		self.dungeon.n_i =		parseInt(self.opts.n_rows / 2);
		self.dungeon.n_j =		parseInt(self.opts.n_cols / 2);
		self.dungeon.n_rows =	self.dungeon.n_i * 2;
		self.dungeon.n_cols =	self.dungeon.n_j * 2;
		self.dungeon.max_row = 	self.dungeon.n_rows - 1;
		self.dungeon.max_col =	self.dungeon.n_cols - 1;
		self.dungeon.nRooms =	0;

		self.dungeon.room_base =  parseInt((self.opts.room_min + 1)/2);
		self.dungeon.room_radix = parseInt((self.opts.room_max - self.opts.room_min)/2) + 1;

		self.dungeon.rooms = {};

		self.initCells();
		self.emplaceRooms();
		self.openRooms();
		self.labelRooms();
		self.corridors();
		if (self.opts.add_stairs)
			self.emplaceStairs();
		self.cleanDungeon();
	}

	// function to roll with a n-sided dice
	this.d = function(n) {
		return parseInt(1 + Math.random()*n);
	}

	// function to get a room id from the cell value
	this.roomId = function(cell) {
		// false if no room
		if (!(cell & self.ROOM))
			return false;

		return (cell & self.ROOM_ID >> 6);
	}

	this.initCells = function() {
		self.cells = [];
		for (var r=0; r<=self.dungeon.n_rows; r++) {
			self.cells[r] = [];
			for (var c=0; c<=self.dungeon.n_cols; c++) {
				self.cells[r][c] = self.NOTHING;
			}
		}
	}

	this.emplaceRooms = function() {
		switch (self.opts.room_layout) {
			case 'Packed':
				self.packRooms();
				break;

			default:
				self.scatterRooms();
		}
	}

	////
	// room placement function: packed
	this.packRooms = function() {
		for (var i=0; i<self.dungeon.n_i; i++) {
			var rowId = (i*2)+1;
			for (var j=0; j<self.dungeon.n_j; j++) {
				var colId = (j*2)+1;

				// skip if actual cell is already a room
				if (self.cells[rowId][colId] & self.ROOM)
					continue;

				// skip every second cell at the edge
				if ((i==0 || j==0) && self.d(2) > 1)
					continue;

				// emplace!
				self.emplaceRoom({i:i, j:j});
			}
		}
	}

	////
	// room placement function: scattered
	this.scatterRooms = function() {
		// allocate number of rooms
		var dungeonArea	= self.dungeon.n_cols * self.dungeon.n_rows;
		var roomArea	= self.opts.room_max  * self.opts.room_max;

		var nRooms = parseInt(dungeonArea / roomArea);

		// emplace them
		for (var i=0; i<nRooms; i++)
			self.emplaceRoom();
	}

	////
	// emplace a room (to specified coordinates)
	this.emplaceRoom = function(proto) {
		// refuse if there's too much already
		if (self.dungeon.nRooms == 999)
			return;

		// room position & size
		proto = self.setRoom(proto);

		// room boundaries
		var rowStart = ( proto.i					* 2) + 1;
		var colStart = ( proto.j					* 2) + 1;
		var rowStop  = ((proto.i + proto.height)	* 2) - 1;
		var colStop  = ((proto.j + proto.width )	* 2) - 1;

		// refuse if out of bounds
		if (rowStart < 1
			|| colStart < 1
			|| rowStop > self.dungeon.max_row
			|| colStop > self.dungeon.max_col)
			return;

		// any collisions?
		var hit = self.soundRoom(rowStart, colStart, rowStop, colStop);
		if (hit.blocked)
			return;

		var hits = 0;
		for (var room in hits) hits++;
		
		// refuse if it overlaps a room
		if (hits > 0)
			return;

		var roomId = self.dungeon.nRooms += 1;

		// emplace!
		for (var row=rowStart; row<=rowStop; row++) {
			for (var col=colStart; col<=colStop; col++) {
				if (self.cells[row][col] & self.ENTRANCE) {
					self.cells[row][col] &= ~ self.ESPACE;
				} else if (self.cells[row][col] & self.PERIMETER) {
					self.cells[row][col] &= ~ self.PERIMETER;
				}
				self.cells[row][col] |= self.ROOM | (roomId << 6);
			}
		}

		var height = ((rowStop - rowStart) + 1)*10;
		var width  = ((colStop - colStart) + 1)*10;

		var roomData = {
			id:		roomId,
			row:	rowStart,
			col:	colStart,
			north:	rowStart,
			south:	rowStop,
			west:	colStart,
			east:	colStop,
			height:	height,
			width:	width,
			area:	height*width
		};
		self.dungeon.rooms[roomId] = roomData;

		// check perimeter, neighbouring rooms
		var rowPeris = [rowStart-1, rowStop+1];
		var colPeris = [colStart-1, colStop+1];
		for (var row=rowPeris[0]; row<=rowPeris[1]; row++) {
			for (var col=colPeris[0]; col<=colPeris[1]; col++) {
				// if not a perimeter cell, skip it
				if (row != rowPeris[0] && row != rowPeris[1]
					&& col != colPeris[0] && col != colPeris[1])
					continue;

				if (!(self.cells[row][col] & (self.ROOM | self.ENTRANCE))) {
					self.cells[row][col] |= self.PERIMETER;
				}
			}
		}
	}

	this.setRoom = function(proto) {
		if (!proto) proto = {};
		// set height
		if (!('height' in proto)) {
			if ('i' in proto) {
				var a = Math.max(0, self.dungeon.n_i - self.dungeon.room_base - proto.i);
				var r = Math.min(a, self.dungeon.room_radix);
				proto.height = self.d(r) + self.dungeon.room_base;
			} else {
				proto.height = self.d(self.dungeon.room_radix) + self.dungeon.room_base;
			}
		}
		// same for width
		if (!('width' in proto)) {
			if ('j' in proto) {
				var a = Math.max(0, self.dungeon.n_j - self.dungeon.room_base - proto.j);
				var r = Math.min(a, self.dungeon.room_radix);
				proto.width = self.d(r) + self.dungeon.room_base;
			} else {
				proto.width = self.d(self.dungeon.room_radix) + self.dungeon.room_base;
			}
		}
		// set coordinates
		if (!('i' in proto)) {
			proto.i = self.d(self.dungeon.n_i - proto.height);
		}
		if (!('j' in proto)) {
			proto.j = self.d(self.dungeon.n_j - proto.width);
		}

		return proto;
	}

	////
	// check the given area for blocks and rooms
	this.soundRoom = function(rowStart, colStart, rowStop, colStop) {
		var hit = {};

		for (var row=rowStart; row<=rowStop; row++) {
			for (var col=colStart; col<=colStop; col++) {
				// it hits a blocked cell
				if (self.cells[row][col] & self.BLOCKED)
					return {blocked:true}

				// overlaps with another room
				if (self.cells[row][col] & self.ROOM) {
					var roomId = self.cells[row][col] & self.ROOM_ID;
					hit[roomId] = (hit[roomId] || 0) + 1;
				}
			}
		}

		return hit;
	}

	////
	// open rooms with doors & corridors
	this.openRooms = function() {
		for (var roomId in self.dungeon.rooms) {
			self.openRoom(self.dungeon.rooms[roomId]);
		}
	};

	////
	// open a room
	this.openRoom = function(roomData) {
		// check for available openings
		var sillList = self.doorSills(roomData);
		if (sillList.length < 1)
			return;

		roomData.doors = {'east':[], 'north':[], 'south':[], 'west':[]};

		// calculate number of doors
		var roomH = ((roomData.south - roomData.north) / 2)+1;
		var roomW = ((roomData.east  - roomData.west ) / 2)+1;
		var flumph = parseInt(Math.sqrt(roomW * roomH));
		var nOpens = flumph + self.d(flumph) - 1;

		// create doors
		var sillId = 0;
		while (sillId < nOpens) {
			var sill = sillList.splice(self.d(sillList.length), 1)[0];
			if (!sill)
				break;

			// skip if cell already door
			var doorCell = self.cells[sill.doorRow][sill.doorCol];
			if (doorCell & self.DOORSPACE)
				continue;

			// skip if already connected to outRoom
			if (sill.outId) {
				var connect = [roomData.id, sill.outId].sort().join(',');
				if (connect in this.connected)
					break;

				this.connected[connect] = true;
			}

			// sesame!

			var openRow = sill.sillRow;
			var openCol = sill.sillCol;
			var openDir = sill.sillDir;

			// build a 3 cell entrance in the door's direction
			for (var x=0; x<3; x++) {
				var row = openRow + self.di[openDir]*x;
				var col = openCol + self.dj[openDir]*x;

				self.cells[row][col] &= ~self.PERIMETER;
				self.cells[row][col] |= self.ENTRANCE;
			}

			// determine the type of the door, set the cell values
			var doorType = self.doorType();
			var door = {
				row:		sill.doorRow,
				col:		sill.doorCol,
				key:		self.doorTypes[doorType].key,
				type:		self.doorTypes[doorType].type,
				dir:		sill.sillDir
			};
			if (sill.outId) {
				door.outId = sill.outId;
			}
			self.cells[door.row][door.col] |= doorType;
			self.cells[door.row][door.col] |= (ord(self.doorTypes[doorType].label) << 24);

			// assign the door to the room
			roomData.doors[sill.sillDir].push(door);
			self.dungeon.rooms[roomData.id] = roomData;

			sillId++;
		}
	}

	////
	// list potential doors for a room
	this.doorSills = function(room) {
		var list = [];

		if (room.north > 2) {
			for (var col=room.west; col<=room.east; col+=2) {
				var sill = self.checkSill(room, room.north, col, 'north');
				if (sill) list.push(sill);
			}
		}
		if (room.south < (self.dungeon.n_rows - 2)) {
			for (var col=room.west; col<=room.east; col+=2) {
				var sill = self.checkSill(room, room.south, col, 'south');
				if (sill) list.push(sill);
			}
		}
		if (room.west > 2) {
			for (var row=room.north; row<=room.south; row+=2) {
				var sill = self.checkSill(room, row, room.west, 'west');
				if (sill) list.push(sill);
			}
		}
		if (room.east < (self.dungeon.n_cols - 2)) {
			for (var row=room.north; row<=room.south; row+=2) {
				var sill = self.checkSill(room, row, room.east, 'east');
				if (sill) list.push(sill);
			}
		}

		return shuffle(list);
	}

	this.checkSill = function(room, sillRow, sillCol, sillDir) {
		var doorRow = sillRow + self.di[sillDir];
		var doorCol = sillCol + self.dj[sillDir];

		if (doorRow <= 0 || doorRow >= self.opts.n_rows
			|| doorCol <= 0 || doorRow >= self.opts.n_cols)
			return

		var doorCell = self.cells[doorRow][doorCol];

		// skip if cell is no perimeter or is block door
		if (!(doorCell & self.PERIMETER) || (doorCell & self.BLOCK_DOOR))
			return;

		var outRow = doorRow + self.di[sillDir];
		var outCol = doorCol + self.dj[sillDir];
		var outCell = self.cells[outRow][outCol];

		// skip if out cell is blocked
		if (outCell & self.BLOCKED)
			return;

		// skip if it'd lead to the same room
		var outId = self.roomId(outCell);
		if (outId && (outId = room.id))
			return;

		// return sill parameters
		return {
			sillRow	: sillRow,
			sillCol	: sillCol,
			sillDir	: sillDir,
			doorRow	: doorRow,
			doorCol	: doorCol,
			outId	: outId
		}
	}

	this.doorType = function() {
		var rnd = self.d(110);

		if (rnd < 16)  return self.ARCH;
		if (rnd < 61)  return self.DOOR;
		if (rnd < 76)  return self.LOCKED;
		if (rnd < 91)  return self.TRAPPED;
		if (rnd < 101) return self.SECRET;
		               return self.PORTICUL;
	}

	this.labelRooms = function() {
		for (var roomId in self.dungeon.rooms) {
			var room = self.dungeon.rooms[roomId];
			var label = ""+room.id;
			var labelRow = parseInt((room.north + room.south) / 2);
			var labelCol = parseInt((room.west  + room.east - label.length) / 2) + 1;

			for (var chr in label) {
				chr = parseInt(chr);
				self.cells[labelRow][labelCol + chr] |= (ord(label[chr]) << 24);
			}
		}
	};

	this.corridors = function() {
		for (var i=1; i<self.dungeon.n_i; i++) {
			var row = i*2 + 1;
			for (var j=1; j<self.dungeon.n_j; j++) {
				var col = j*2 + 1;

				if (self.cells[row][col] & self.CORRIDOR)
					continue;

				self.tunnel(i, j);
			}
		}
	};

	this.tunnel = function(i, j, lastDir) {
		var dirs = self.tunnelDirs(lastDir);

		for (var d in dirs) {
			var dir = dirs[d];
			if (self.openTunnel(i, j, dir)) {
				self.tunnel(i + self.di[dir], j + self.dj[dir], dir);
			}
		}
	}

	////
	// get possible tunnel directions & curve!
	this.tunnelDirs = function(lastDir) {
		var curviness = self.corridor_layout[self.opts.corridor_layout];

		var outDirs = [];
		for (var d in self.dj_dirs) {
			var dir = self.dj_dirs[d];
			if (lastDir
				&& dir == lastDir
				&& curviness > 0
				&& (self.d(100) <= curviness))
				continue;

			outDirs.push(dir);
		}

		return shuffle(outDirs);
	}

	////
	// open tunnel at given place in given direction
	this.openTunnel = function(i, j, dir) {
		var thisRow = i*2 + 1;
		var thisCol = j*2 + 1;
		var nextRow = (i+self.di[dir])*2 + 1;
		var nextCol = (j+self.dj[dir])*2 + 1;
		var midRow = (thisRow + nextRow) / 2;
		var midCol = (thisCol + nextCol) / 2;

		// check if tunnel is safe

		// out of bounds?
		if (nextRow < 0 || nextRow > self.dungeon.n_rows)
			return;
		if (nextCol < 0 || nextCol > self.dungeon.n_cols)
			return;

		// sort coords
		if (midRow > nextRow)	var row1=nextRow, row2=midRow;
		else					var row1=midRow,  row2=nextRow;
		if (midCol > nextCol)	var col1=nextCol, col2=midCol;
		else					var col1=midCol,  col2=nextCol;

		// check for obstacles
		for (var row=row1; row<=row2; row++) {
			for (var col=col1; col<=col2; col++) {
				if (self.cells[row][col] & self.BLOCK_CORR)
					return;
			}
		}

		// dig!

		// sort coords
		if (thisRow > nextRow)	var row1=nextRow, row2=thisRow;
		else					var row1=thisRow, row2=nextRow;
		if (thisCol > nextCol)	var col1=nextCol, col2=thisCol;
		else					var col1=thisCol, col2=nextCol;

		for (var row=row1; row<=row2; row++) {
			for (var col=col1; col<=col2; col++) {
				self.cells[row][col] &= ~ self.ENTRANCE;
				self.cells[row][col] |= self.CORRIDOR;
			}
		}

		return true;
	}

	////
	// emplace stairs
	this.emplaceStairs = function() {
		if (self.opts.add_stairs < 1)
			return;

		var list = self.stairEnds();
		if (list.length < 1)
			return;

		self.dungeon.stairs = [];

		for (var i=0; i<self.opts.add_stairs; i++) {
			var stair = list.splice(self.d(list.length), 1)[0];
			if (!stair)
				break;

			var type = i < 2 ? i : self.d(2)-1;

			if (type == 0) {
				self.cells[stair.row][stair.col] |= self.STAIR_DN;
				self.cells[stair.row][stair.col] |= (ord('d') << 24);
				stair.key = 'down';
			} else {
				self.cells[stair.row][stair.col] |= self.STAIR_UP;
				self.cells[stair.row][stair.col] |= (ord('u') << 24);
				stair.key = 'up';
			}

			self.dungeon.stairs.push(stair);
		}
	};

	////
	// list available stair ends
	this.stairEnds = function() {
		var list = [];

		for (var i=0; i<self.dungeon.n_i; i++) {
			var row = i*2 + 1;
			for (var j=0; j<self.dungeon.n_j; j++) {
				var col = j*2 + 1;

				if (!(self.cells[row][col] == self.CORRIDOR))
					continue;
				if (self.cells[row][col] & self.STAIRS)
					continue;

				for (var dir in self.stair_end) {
					if (self.checkTunnel(row, col, self.stair_end[dir])) {
						var end = {row: row, col: col};
						var n = self.stair_end[dir].next;
						end.next_row = end.row + n[0];
						end.next_col = end.col + n[1];

						list.push(end);
						break;
					}
				}
			}
		}

		return list;
	}

	////
	// check a tunnel
	this.checkTunnel = function(row, col, check) {
		if (!check) return true;

		var list = check.corridor || [];
		for (var i in list) {
			var p = list[i];
			if (!(self.cells[row+p[0]][col+p[1]] == self.CORRIDOR))
				return;
		}

		var list = check.walled || [];
		for (var i in list) {
			var p = list[i];
			if (self.cells[row+p[0]]
				&& self.cells[row+p[0]][col+p[1]] & self.OPENSPACE)
				return;
		}

		return true;
	}

	this.cleanDungeon = function() {
		if (self.opts.remove_deadends)
			self.removeDeadends();

		self.fixDoors();
		self.emptyBlocks();
	};

	this.removeDeadends = function() {
		var remove = self.opts.remove_deadends;
		var all = (remove == 100);
		
		for (var i=0; i<self.dungeon.n_i; i++) {
			var row = i*2 + 1;
			for (var j=0; j<self.dungeon.n_j; j++) {
				var col = j*2 + 1;

				if (!(self.cells[row][col] & self.OPENSPACE))
					continue;
				if (self.cells[row][col] & self.STAIRS)
					continue;
				if (!(all || self.d(100) < remove))
					continue;

				self.collapse(row, col);
			}
		}
	}

	this.collapse = function(row, col) {
		var xc = self.close_end;

		for (var dir in xc) {
			if (self.checkTunnel(row, col, xc[dir])) {
				for (var i in xc[dir].close) {
					var p = xc[dir].close[i];
					if (self.cells[row+p[0]]
						&& self.cells[row+p[0]][col+p[1]])
						self.cells[row+p[0]][col+p[1]] = self.NOTHING;
				}

				var p = xc[dir].open;
				if (p && self.cells[row+p[0]] && self.cells[row+p[0]][col+p[1]]) {
					self.cells[row+p[0]][col+p[1]] |= self.CORRIDOR;
				}

				var p = xc[dir].recurse;
				if (p && self.cells[row+p[0]] && self.cells[row+p[0]][col+p[1]]) {
					self.collapse(row+p[0], col+p[1]);
				}
			}
		}
	}

	this.fixDoors = function() {
		var fixed = {};

		for (var roomId in self.dungeon.rooms) {
			var room = self.dungeon.rooms[roomId];
			for (var dir in room.doors) {
				for (var doorId in room.doors[dir]) {
					var door = room.doors[dir][doorId];
					var shiny = [];
					console.log('door', door);

					var doorCell = self.cells[door.row][door.col];
					if (!(doorCell & self.OPENSPACE))
						continue;

					if (fixed[door.row] && fixed[door.row][door.col]) {
						shiny.push(door);
					} else {
						var outId = door.outId;
						if (outId) {
							var outDir = self.opposite[dir];
							self.dungeon.rooms[outId].doors[outDir].push(door);
						}
						shiny.push(door);
						if (!fixed[door.row]) fixed[door.row] = {};
						fixed[door.row][door.col] = 1;
					}
				}
				if (shiny) {
					room.doors[dir] = shiny;
				} else {
					delete room.doors[dir];
				}
			}
		}
	}

	this.emptyBlocks = function() {
		for (var row=0; row<=self.dungeon.n_rows; row++) {
			for (var col=0; col<=self.dungeon.n_cols; col++) {
				if (self.cells[row][col] & self.BLOCKED)
					self.cells[row][col] = self.NOTHING;
			}
		}
	}

	this.getGrid = function() {
		var grid = [];
		for (var row=0; row<=self.dungeon.n_rows; row++) {
			var cells = [];
			for (var col=0; col<=self.dungeon.n_cols; col++) {
				var cell = self.cells[row][col];

				var type = 0;
				if (cell & self.STAIR_DN) {
					type = 21;
				} else if (cell & self.STAIR_UP) {
					type = 22;
				} else if (cell & self.OPENSPACE) {
					type = 1;
				} else if (cell & self.DOORSPACE) {
					if (cell & self.DOOR)		type = 11;
					else if (cell & self.LOCKED)	type = 12;
					else if (cell & self.TRAPPED)	type = 13;
					else if (cell & self.SECRET)	type = 14;
					else if (cell & self.PORTICUL)	type = 15;
					else				type = 10;
				}

				cells.push(type);
			}
			grid.push(cells);
		}

		return grid;
	}

	var self = this;
	this.init(settings);
}


///////////////////////////
/// MISC //////////////////

if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fun /*, thisp */)
	{
		"use strict";

		if (this === void 0 || this === null)
			throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function")
			throw new TypeError();

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in t)
			{
				var val = t[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, t))
					res.push(val);
			}
		}

		return res;
	};
}

var shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
};

function ord (string) {
	// Returns the codepoint value of a character  
	// 
	// version: 1103.1210
	// discuss at: http://phpjs.org/functions/ord
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Onno Marsman
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// +   input by: incidence
	// *     example 1: ord('K');
	// *     returns 1: 75
	// *     example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
	// *     returns 2: 65536
	var str = string + '',
		code = str.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
		var hi = code;
		if (str.length === 1) {
			return code; // This is just a high surrogate with no following low surrogate, so we return its value;
			// we could also throw an error as it is not a complete character, but someone may want to know
		}
		var low = str.charCodeAt(1);
		return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	}
	if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
		// we could also throw an error as it is not a complete character, but someone may want to know
	}
	return code;
}

function chr (codePt) {
	// Converts a codepoint number to a character  
	// 
	// version: 1103.1210
	// discuss at: http://phpjs.org/functions/chr
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// *     example 1: chr(75);
	// *     returns 1: 'K'
	// *     example 1: chr(65536) === '\uD800\uDC00';
	// *     returns 1: true
	if (false && codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
		//   enough for the UTF-16 encoding (JavaScript internal use), to
		//   require representation with two surrogates (reserved non-characters
		//   used for building other characters; the first is "high" and the next "low")
		codePt -= 0x10000;
		return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
	}
	return String.fromCharCode(codePt);
}
