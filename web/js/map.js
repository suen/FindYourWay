
Map = function (controller) {
	this.board = [];
	
	$("#confirm-move-btn").click(function(){
		$(this).text("Wait");
		$(this).addClass("disabled");
		move = Map.instance().lastmove
		Logger.log("Sending move " + move)
		move[0]--;
		move[1]--;
		//Map.instance().controller.connect.socket.send("TTTS PLAYER_MOVE " + move.toString());
		Main.Instance().sendGameMove(move.toString());
	});
	
	this.createBoard = function() {
		for(i=0; i<6; i++) {
			row = [];
			for(j=0; j<6; j++) {
				td_ids = "#" + (i+1).toString() + "-" + (j+1).toString()
				$(td_ids).click(function(evnt) {
					Map.instance().boardClickedEvent(this, evnt);
				});
				row.push("");
			}
			this.board.push(row);
		};
		Logger.log("board initialized");
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

	this.getBoard = function() {
		return JSON.stringigy(this.board);
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
	
}

Map.instance = function() {
	if (typeof(Map.self) == "undefined")
		Map.self = new Map(Map.main)
	return Map.self
}

/**

//b = [["X", "O", "X", "", "", ""],["", "", "", "O", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""]]

$(document).ready(function() {
	m = Main();
});

**/

