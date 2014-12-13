
from twisted.internet.error import CannotListenError
from twisted.internet import reactor
from twisted.python import log
import time
from threading import Thread
from patterns import Singleton
import os

from autobahn.twisted.websocket import WebSocketServerProtocol, \
                                       WebSocketServerFactory
                                       
    
class MyWebSocketServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        print("Client connecting: {0}".format(request.peer))
        Network.Instance().setWebClient(self)

    def onOpen(self):
        print("WebSocket connection open.")

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
            self.sendMessage(payload, isBinary)
            return
        msg = payload.decode('utf8')
        #Network.Instance().treat(self, msg)
        #self.sendMessage(msg, isBinary)
        print("Text message received: {0}".format(payload.decode('utf8')))
        print("NOBODY IS LISTENING TO THIS MESSAGE ????")

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


@Singleton
class Network:
    
    def __init__(self):
        self.websocketFactory = None
        self.main = None
    
    def setMain(self, main):
        self.main = main

    def setWebClient(self, webclient):
		self.main.setWebClient(webclient)	
		pass
           
    def setWebSocketPort(self, wsocketPort):
        self.wsocketPort = wsocketPort
            
    def startNetwork(self):
        try:
            self.websocketFactory = WebSocketServerFactory("ws://localhost:" + str(self.wsocketPort), debug = False)
            self.websocketFactory.protocol = MyWebSocketServerProtocol 
            reactor.listenTCP(self.wsocketPort,self.websocketFactory)
            reactor.run()
        except CannotListenError:
            print "Cannot listen to websocket exiting.. "

class Firefox:
	def __init__(self):
		self.net = Network.Instance();
		self.net.setWebSocketPort(9000);
		self.webclient = None
		self.mindmap = [["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""],["", "", "", "", "", ""]]
		self.moves = [(5,5), (5,4), (5,3), (5,2), (5,1), (5,0), (4,0), ( 3,0), ( 2,0), (1,0)]
		self.movemind = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1000]

		t = Thread(target=self.thread)
		t.setDaemon(True)
		#t.start()
		t = Thread(target=self.startBrowser)
		t.setDaemon(True)
		t.start()
	
	def getEnvironment(self):
		list = [["", "", "", "", "", "b1"],["b2", "", "", "", "p1", ""],["", "", "", "", "", ""],["", "", "w", "w", "w", "w"],["", "", "w", "p2", "", ""],["", "", "", "", "", ""]]
		return list

	def startBrowser(self):
		os.system("/usr/bin/firefox ./web/index.html")
		return
	
	def startNetwork(self):
		this = self
		self.net.setMain(this)
		self.net.startNetwork()

	def setWebClient(self, webclient):
		self.webclient = webclient
		self.webclient.onMessage = self.onWebClientMessage

	def onWebClientMessage(self, payload, isBinary):
		print "Message Received " + payload

		if "NEXT" in payload:
			self.next.onNext()
		pass
	
	def moveRobot(self, list):
		self.webclient.sendMessage("LOCAL MAP " + str(list), False)
		pass

	def setNextListener(self, next):
		self.next = next

	def sendMsg(self, type, content):
		if isinstance(content, list):
			con = str(content)
		else:
			con = content

		self.webclient.sendMessage("LOCAL " + type + " " + con, False)
	
	def thread(self):
		while (True):
			time.sleep(1)
			nlist = self.getList()
			if self.webclient is None or len(self.moves) == 0:
				continue
			nlist[self.moves[0][0]][self.moves[0][1]] = "r"
			self.moveRobot(nlist)
			del self.moves[0]
		
class Test:

	def __init__(self):
		self.firefox = Firefox()

	def onNext(self):
		print "onNext called, do your run() stuff here"
		'''Demo '''
		map,mind = self.getNextStep()
		self.firefox.sendMsg("MAP", map)
		self.firefox.sendMsg("ROBOT_MIND", mind)
		pass

	def getNextStep(self):
		map = self.firefox.getEnvironment()
		mind = self.firefox.mindmap

		move = self.firefox.moves
		movemind = self.firefox.movemind

		map[move[0][0]][move[0][1]] = "r"
		mind[move[0][0]][move[0][1]] = str(movemind[0])
		
		del move[0]
		del movemind[0]
		return map, mind


	def start(self):
		#call this method at the very end, its blocking IO
		self.firefox.setNextListener(self)
		self.firefox.startNetwork()

if __name__ == "__main__":
	test = Test()
	test.start()
