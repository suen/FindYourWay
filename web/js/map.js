
Map = function (controller) {
	this.board = [];
	this.mindmap = [];
	
	this.createBoard = function() {
		for(i=0; i<6; i++) {
			this.board.push(["","","","","",""]);
			this.mindmap.push(["","","","","",""]);
		};
		this.displayBoard()
		this.displayMindmap()
		Logger.log("boards initialized");
	};

	this.setBoard = function(board) {
		if (typeof(board) == "string") {
			board = board.replace(/\'/g, "\"")
			newBoard = JSON.parse(board)
		} else {
			newBoard = board;
		}
		this.board = newBoard
		this.displayBoard()
	};

	this.setMindmap = function(mindmap) {
		if (typeof(mindmap) == "string") {
			mindmap = mindmap.replace(/\'/g, "\"")
			newMindmap = JSON.parse(mindmap)
		} else {
			newMindmap = mindmap
		}
		this.mindmap = newMindmap
		this.displayMindmap()
	};

	this.displayBoard = function() {
		for(i=0; i<6; i++) {
			row = this.board[i]
			for(j=0; j<6; j++) {
				td_ids = "#" + (i+1).toString() + "-" + (j+1).toString()
				$(td_ids).removeClass("portal")
				$(td_ids).removeClass("wall")
				$(td_ids).removeClass("but")
				$(td_ids).removeClass("robto")
				
				$(td_ids).text(row[j])
				if (row[j][0]=="b")
					$(td_ids).addClass("but")
				else if (row[j][0]=="p")
					$(td_ids).addClass("portal")
				else if (row[j][0]=="w")
					$(td_ids).addClass("wall")
				else if (row[j][0]=="r")
					$(td_ids).addClass("robot")
			}
		} 
	}
	
	this.displayMindmap = function() {
		for(i=0; i<6; i++) {
			row = this.mindmap[i]
			for(j=0; j<6; j++) {
				td_ids = "#t" + (i+1).toString() + "-" + (j+1).toString()
				$(td_ids).text(row[j])
			}
		} 
	}
}

Map.instance = function() {
	if (typeof(Map.self) == "undefined")
		Map.self = new Map(Map.main)
	return Map.self
}
