from Firefox import *
from model_find_your_way import *

class Main:	
	def __init__(self):
		self.firefox = Firefox()
		self.simulation = Simulation(0)
	def onNext(self):
		print "onNext called, do your run() stuff here"
		'''Demo '''
		map,mind = self.getNextStep()
		self.firefox.sendMsg("MAP", map)
		self.firefox.sendMsg("ROBOT_MIND", mind)
		pass

	def getNextStep(self):
		self.simulation.run()
		map = self.simulation.get_map()
		mind = self.simulation.get_learning_map()
		x, y = self.simulation.get_position_agent()
		formatedMap = self.getFormatedMap(map,x,y)
		formatedMind = self.getFormatedMind(mind)
		return formatedMap, formatedMind
	#x and y are robot  positionning
	def getFormatedMap(self,map,x_robot,y_robot):
		formatedMap = [[map[y][x]["id"] for x in range(len(map[0]))] for y in range(len(map))]
		#robot
		formatedMap[y_robot][x_robot] = "r" 
		return formatedMap
	def getFormatedMind(self, mind):
		formatedMind = [[str(mind[x][y]) for x in range(len(mind[0]))] for y in range(len(mind))]
		return formatedMind
	def start(self):
		#call this method at the very end, its blocking IO
		self.firefox.setNextListener(self)
		self.firefox.startNetwork()

if __name__ == "__main__":
	main = Main()
	main.start()
