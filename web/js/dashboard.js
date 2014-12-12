Dashboard = function(main) {
	
	this.peerListTableNode = $("#peer-list");
	this.stats = null;
	this.main = main
	
	this.peerListTableNode.text("");

	this.addNewPeer = function(peer) {
		
		td = $("<td>").text(peer.getName());
		td[0]['peer'] = peer;
		tr = $("<tr>");
		tr.append(td);
		
		td.click(function(evt){
			console.log("clicked")
			peer = this['peer'];
			Chat.getChat(peer).showChatBox();
		});
		
		this.peerListTableNode.append(tr);
	}
	
	this.erasePeerList = function(peer) {
		this.peerListTableNode.text("");	
	}
	
	this.peerListUpdate = function() {
		this.erasePeerList();
		for (p in Peer.list) {
			this.addNewPeer(Peer.list[p]);
		}
	}
	
	this.createNewRoomDOM = function() {
		divcontainer = $("<div>")
		h2 = $("<h2>").text("New Room")
		
		table = $("<table>").attr("class", "table");
		
		tr1 = $("<tr>");
		tr2 = $("<tr>")
		
		td11 = $("<td>").text("Room Name");
		inputName = $("<input>").attr("type", "text");
		td12 = $("<td>").append(inputName);
		
		tr1.append(td11).append(td12);
		
		td21 = $("<td>").attr("colspan", "2");
		createButton = $("<button>").attr("class", "btn btn-primary btn-lg btn-success");
		createButton.text("Create")
		td21.append(createButton);
		
		tr2.append(td21);
		
		table.append(tr1).append(tr2);
		
		divcontainer.append(h2).append(table);
		
		$("#content").append(divcontainer)
		
		createButton.click(function(evt) {
			roomName = $(this).parent().parent().prev().children().last().children().val()
			Main.Instance().createRoom(roomName);
		});
	}
	
	this.broadcastReplyTable = null;
	this.createRoomJoinListenerDOM = function(roomName){
		divcontainer = $("<div>")
		h2 = $("<h2>").text("New Room Join request")
		tablecontainer = $("<div>").attr("class", "broadcast-reply-table-container");
		table = $("<table>").attr("class", "table");

		tablecontainer.append(table)
		
		rebroadcastBtn = $("<button>").text("RE-BROADCAST");
		startGameBtn = $("<button>").text("START GAME");
		startGameBtn[0]['room'] = roomName
		
		
		rebroadcastBtn.click(function(evt) {
			Main.Instance().reBroadcastLastMessage();
		})
		
		startGameBtn.click(function(evt){
			roomName = this['room']
			Main.Instance().sendStartGame(roomName)
		})	
		
		this.broadcastReplyTable = table;
		
		divcontainer.append(h2).append(rebroadcastBtn).append(startGameBtn).append(tablecontainer);
		$("#content").html(divcontainer);
	}
	
	this.addNewBroadcastReply = function(peer, roomName) {
		d = new Date();
		hour = d.getHours().toString();
		minute = d.getMinutes().toString();
		second = d.getSeconds().toString();
	
		
		acceptBtn = $("<button>").attr("class", "btn btn-primary btn-success");
		acceptBtn.text("Accept");
		acceptBtn[0]['room'] = roomName;
		acceptBtn[0]['peer'] = peer

		canWatchBtn = $("<button>").attr("class", "btn btn-primary btn-success");
		canWatchBtn.text("Can Watch");
		canWatchBtn[0]['room'] = roomName;
		canWatchBtn[0]['peer'] = peer
		
		acceptBtn.click(function() {
			roomName = this['room'];
			peer = this['peer'];
			Main.Instance().acceptPeer(peer, roomName);
		});
		
		canWatchBtn.click(function() {
			roomName = this['room'];
			peer = this['peer'];
			Main.Instance().canWatchPeer(peer, roomName);
		});
		
		tr = $("<tr>");
		tdtime = $("<td>").text(hour + ":" + minute + ":" + second)
		td = $("<td>").text(msg);
		tdbtn = $("<td>").append(acceptBtn);
		tdbtn2 = $("<td>").append(canWatchBtn);
		tr.append(tdtime)
		tr.append(td).append(tdbtn).append(tdbtn2);
		
		this.broadcastReplyTable.prepend(tr);	
	}
	
	this.joinRoomDOM = function() {
		divcontainer = $("<div>")
		h2 = $("<h2>").text("Join Room")
		h4 = $("<h4>").text("Listening to NEW_GAME broadcast")
		tablecontainer = $("<div>").attr("class", "broadcast-reply-table-container");
		table = $("<table>").attr("class", "table");
		
		this.broadcastReceivedTable = table;
		tablecontainer.append(table)
		divcontainer.append(h2).append(h4).append(tablecontainer);
		$("#content").html(divcontainer);		
	}
	this.broadcastReceivedTable = null;
	this.onNewRoomBroadcastReceived = function(peer, roomName){
		
		tr = $("<tr>");
		tdtime = $("<td>").text(hour + ":" + minute + ":" + second);
		
		td = $("<td>").text("Room: " +roomName + " peer: " + peer.getName());
		
		joinBtn = $("<button>").attr("class", "btn btn-primary btn-success");
		joinBtn[0]['peer'] = peer;
		joinBtn[0]['room'] = roomName;
		joinBtn.text("Join Room");
		
		dashboard = this
		joinBtn.click(function() {
			peer = this['peer'];
			roomName = this['room']
			console.log(this)
			dashboard.main.joinRoom(peer, roomName);
		});
		
		tdb = $("<td>").append(joinBtn)
		tr.append(tdtime)
		tr.append(td)
		tr.append(tdb)
		
		this.broadcastReceivedTable.prepend(tr);	
	}
	
	this.roomAcceptedDOM = function(roomName, peer, type) {
		console.log(peer)
		if (type == "PLAY") {
			displayText = "You have been accepted to PLAY in '";
		} 
		if (type == "WATCH") {
			displayText = "You have been accepted to WATCH the play in '"
		}
		
		displayText += roomName + "' by '" + peer.getName() + "'"
		
		Logger.log(displayText)
		divcontainer = $("<div>")
		h2 = $("<h2>").text("Join Room")

		divaccepted = $("<div>").attr("class", "small-container");

		readyBtn = $("<button>").attr("class", "btn btn-primary btn-success")
		readyBtn.text("Ready");
		divaccepted.append($("<p>").css("text-align", "center")
				.text(displayText)
		)
		divaccepted.append($("<p>").css("text-align", "center").append(readyBtn));
		
		dashboard = this;
		readyBtn.click(function(evt) {
			$(this).text("Waiting..")
			$(this).prop('disabled', true);
			Main.Instance().readyForGame(peer, roomName)
		});
		
		divcontainer.append(h2).append(divaccepted)
		$("#content").html(divcontainer);		
	}
	
	this.onCanWatch = function(peer, roomName) {
		this.roomAcceptedDOM(roomName, peer, "WATCH")
	}

	this.onAcceptedForRoom = function(peer, roomName) {
		this.roomAcceptedDOM(roomName, peer, "PLAY")
	}
	
	this.createGameDOM = function(msg) {
		
	}

	
//	this.roomAcceptedDOM("hi", "accepted");
	
	//$("#chatbox").hide();
}

Main2 = function() {

	this.dashboard = new Dashboard(this);
	TicTacToe.setMain(this)
	this.tic = TicTacToe.instance();
	
	this.onSocketConnect = function() {
		this.connect.sendMessage("PEER_LIST");		
	}
	this.connect = new Connect(this);
	this.onSocketDisconnect = function() {
		$("#thickbox").show();
		$("#thickbox-message").text("Disconnected")
	}
	
	this.chats = [];
	
	this.createChatInstance = function(peerIdentity) {
		chat = new Chat(peerIdentity, this);
		this.chats.push(chat);
		return chat;
	}
	
	this.getChatInstance = function(peerIdentity){
		for (i in this.chats){
			//console.log(this.chats[i].getPeerIdentity() + " == " + peerIdentity)
			if (this.chats[i].getPeerIdentity() == peerIdentity){
				return this.chats[i];
			}
			//Logger.log("no instance found in " + this.chats.size())
		}

		return this.createChatInstance(peerIdentity);
	}
	
	this.showChatBox = function(peerId){
		peerChatIns = this.getChatInstance(peerId);
		peerChatIns.showChatBox()
	}

	
	this.onMessageReceived = function(msg) {
		console.log("Received Msg : " + msg)

		if (msg.substr(0, 19) == "DUPLICATE_WEBCLIENT") {
			$("#thickbox").show();
			$("#thickbox-message").text("Another webclient logged in, Please use your last client")
		}
		
		if (msg.substr(0, 9) == "PEER_LIST") {
			peerList = msg.substr(10);
			console.log(peerList)
			peerObj = JSON.parse(peerList);
			
			this.dashboard.erasePeerList();
			for (i in peerObj) {
				this.dashboard.addNewPeer(peerObj[i]);
			}
			Logger.log("Peer list obtained");
			console.log("Peer list obtained")
			console.log(peerObj)
		};
		
		if (msg.substr(0, 4) == "CHAT") {
			msg = msg.substr(5)
			pIndex = msg.indexOf(" ")
			chatPeer = msg.substr(0, pIndex)
			msg.substr(pIndex+1)
			chatMessage = msg.substr(msg.indexOf(" ")+1)
			
			peerChatIns = this.getChatInstance(chatPeer);
			peerChatIns.onMessageReceived(chatMessage);
		}
		
		if (msg.trim() == "NEW_ROOM BROADCAST DONE") {
			this.dashboard.createBroadcastReplyDOM();
		}
		
		if (msg.substr(0,9) == "JOIN_ROOM") {
			msg = msg.substr(10);
			this.dashboard.addNewBroadcastReply(msg);
		}
		
		if (msg.substr(0,8) == "NEW_ROOM") {
			msg = msg.substr(9)
			this.dashboard.onNewRoomBroadcastReceived(msg);
		}
		
		if (msg.substr(0,12)=="ACCEPTED_FOR") {
			msg = msg.substr(13)
			this.dashboard.onAcceptedForRoom(msg);			
		}
		if (msg.substr(0,9)=="CAN_WATCH") {
			msg = msg.substr(10)
			this.dashboard.onCanWatch(msg);			
		}
		
		this.gameStarted = false;
		if (msg.substr(0,10)=="START_GAME") {
			msg = msg.substr(11)
			if (!this.gameStarted) {
				this.startGame();
				this.gameStarted = true;
			} 
			msg = msg.split(" ");
			this.connect.sendMessage("START_OK " + msg[1] + " " + msg[0]);
		}

		if (msg.substr(0,8)=="START_OK") {
			msg = msg.substr(9)
			if (!this.gameStarted) {
				this.dashboard.createGameDOM(msg);
				this.gameStarted = true;
			} 
		}
		
	};
	
	this.startGame = function() {
		this.tic.createBoard();
		this.tic.show();
	}
	
	this.sendChat = function(peer, msg) {
		this.connect.sendMessage("CHAT " + peer + " " + msg)
	}
	
	this.createRoom = function(roomName) {
		this.connect.sendMessage("CREATE_ROOM " + roomName);
	}
	
	this.joinRoom = function(peer, roomName) {
		this.connect.sendMessage("JOIN_ROOM " + roomName + " " + peer)
	}
	
	this.acceptPeer = function(peerId, roomName){
		this.connect.sendMessage("ACCEPT_PEER " + roomName + " " + peerId)
	}
	
	this.canWatchPeer = function(peerId, roomName){
		this.connect.sendMessage("CAN_WATCH " + roomName + " " + peerId)
	}
	
	this.startGame = function(peerId, roomName) {
		this.connect.sendMessage("START_GAME " + roomName + " " + peerId)
	}
	
	this.reBroadcastLastMessage = function() {
		this.connect.sendMessage("REANNOUNCE_CREATED_ROOM");
	}
	
	
	this.onPlayerMove = function(move) {
		this.connect.sendMessage("GAME PLAYER_MOVE " + move.toString())
	}
	
	this.send = function() {
		
	}
	
	that = this
	
	$("#broadcast-btn").click(function(evt){ 
		that.connect.sendMessage("BROADCAST")
	});
	
	$("#create-room-form-btn").click(function(evt){ 
		that.dashboard.createNewRoomDOM();
	});

	$("#join-room-btn").click(function(evt){
		that.dashboard.joinRoomDOM();
	});	
	
}



//b = [["X", "O", "X", "", "", ""],["", "", "", "O", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""]]


