
Main = function() {

	this.connect = new Connect(this);
	this.map = new Map()
	this.map.createBoard()
	/**
	b = [["", "", "", "", "", "b1"],["b2", "", "", "", "p1", ""],["", "", "", "", "", ""],["", "", "w", "w", "w", "w"],["", "", "w", "p2", "", ""],["", "", "", "", "r", ""]]
	this.map.setBoard(b);
	**/	

	this.onSocketDisconnect = function() {
		$("#thickbox").show();
		$("#thickbox-message").text("Disconnected")
	}
	
	this.onSocketConnect = function() {
		this.connect.sendMessage("local READY");	
	}
	
	this.onMessageReceived = function(msg) {
		console.log("Received Msg : " + msg)
		
		message = new Message(msg);
		prefix = message.getPrefix();
		sender = message.getSender();
		content = message.getContent();
		console.log("Prefix: [" + prefix + "] Sender: [" + sender.getId() + "] Content: [" + content + "]");
		
		switch (prefix) {
			case "MAP":
				Logger.log("MAP received: " + content );
				this.map.setBoard(content)
				break;
			case "ROBOT_MIND":
				Logger.log("ROBOT_MIND received : " + content);
				this.map.setMindmap(content)
				break;
		}
	};
	
	conn = this.connect;
	$("#next").click(function(evt){
		conn.sendMessage("local NEXT");
	});	
	
}
Main.self = null;

Main.Instance = function(){
	if (Main.self == null)
		Main.self = new Main();
	return Main.self;
}

m = null;
console.log(m)
$(document).ready(function() {
	m = Main.Instance();
});
