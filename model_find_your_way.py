import sys
import random
import unittest
import numpy as np
from  math import sqrt, pow
""" Describe a map that store a double matrix
	used by Robot as mind map et simulation as teritoral map
"""
class Map:
	matrix = []

	def __init__(self,number_rows, number_cols,init_value):
		self.matrix = [[init_value for i in range(number_rows)] for j in range(number_cols)]
	
	"""Return True if x and y are in the correct range for the matrix
	"""
	def coord_is_in_map(self,x,y):
		if(len(self.matrix) <= y or y < 0):
			return False
		if(len(self.matrix[y]) <= x or x < 0):
			return False
		return True

class Robot:
	_directions = [
			{"x":-1,"y":0},
			{"x":1,"y":0},
			{"x":0,"y":-1},
			{"x":0,"y":1}]
	_memory = None
	_x = 0
	_y = 0
	_goals = None
	def __init__(self):
		self._memory = Map(6,6,None)
		#p1, p2, Dep
		self._goals = [{"x":5,"y":0},{"x":0,"y":1},{"x":5,"y":5}]
		self._x = 5
		self._y = 5
	def get_x(self):
		return self._x
	def get_y(self):
		return self._y
	def set_x(self,x):
		self._x = x
	def set_y(self,y):
		self._y = y
	def know_all_adjacent_case(self):
		number_case_know = 0
		for direction in self._directions:
			vector_direction_x = self._x + direction["x"]
			vector_direction_y = self._y + direction["y"]
			if(self._memory.coord_is_in_map(vector_direction_x, vector_direction_y)):	
				if(self._memory.matrix[vector_direction_x][vector_direction_y] != None):
					number_case_know = number_case_know + 1
			#handle border
			else:
				number_case_know = number_case_know + 1
		return number_case_know == 4

	def get_memory(self,x,y):
		if(self._memory.coord_is_in_map(x,y)):
			return self._memory.matrix[x][y]
		else:
			return -200
	
	def set_memory(self,x,y,value):
		self._memory.matrix[x][y] = value
	
	def move_robot(self,map):
		#if we already process all the adjacent case we only got 50% chance of making a no random move
		if(self.know_all_adjacent_case() and random.randrange(0,11) > 5):
			#exploitation
			self.exploitation_move()
		else:
			self.random_move(map)

	def renforcement_calcul(self,map):
		x = self.get_x()
		y = self.get_y()
		if(self.get_memory(x,y) == None):
			self.set_memory(x,y,0)
		#how much we must value old knowledge
		alpha = 0.2
		#how much we must value opportunity granted by this action
		gamma = 0.4
		#distance from current position to goal p1 
		x_p1 = self._goals[0]["x"]
		y_p1 = self._goals[0]["y"]
		x_p2 = self._goals[1]["x"]
		y_p2 = self._goals[1]["y"]
		distance_p1 = sqrt(pow(x_p1 - x,2) + pow(y_p1 - y,2)) 
		#distance from current position to goal p2
		distance_p2 = sqrt(pow(x_p2 - x,2) + pow(y_p2 - y,2)) 
		recompense = map.matrix[y_p1][x_p1]["value"] / (distance_p1+0.01) + map.matrix[y_p2][x_p2]["value"] / (distance_p2+0.01)
		q_learning = (1 - alpha) *  self.get_memory(x,y) + gamma*(recompense + max([self.get_memory(x+self._directions[i]["x"],y+self._directions[i]["y"]) for i in range(4)])) 
		self.set_memory(x,y,int(q_learning))		


	def exploitation_move(self):
		#calcul best_move
		value_best_move = -100
		for direction in self._directions:
			x_move = self.get_x() + direction["x"]
			y_move = self.get_y() + direction["y"]
			if(self._memory.coord_is_in_map(x_move,y_move)):
				if(self.get_memory(x_move,y_move)  > value_best_move):
					x_best_move = self.get_x() + direction["x"]
					y_best_move = self.get_y() + direction["y"]
					value_best_move = self.get_memory(x_move,y_move)
		self.set_x(x_best_move)
		self.set_y(y_best_move)
	#do a random for the robot, can include case that are already been visited and take in account matrix border	
	def random_move(self, map):
		valid_move = False
		while valid_move == False:	
			move = random.randrange(0,4)	
			valid_move = self.do_valid_move(move,map)	

	def do_valid_move(self, move, map):
		
		direction_x,direction_y = self._directions[move]["x"], self._directions[move]["y"]
		vector_x = direction_x + self._x
		vector_y = direction_y + self._y
		if(map.coord_is_in_map(vector_x,vector_y)):
			self._x = vector_x
			self._y = vector_y
			return True
		else:
			return False
			
class Simulation:
	counter_run = 0
	map = None
	robot = None
	def __init__(self,mode):
		self.map = self.init_map(0)
		self.robot = Robot()
	#initialisation de la map
	def init_map(self,mode):
		map = Map(6,6,None)
		#init empty map 
		if(mode == 0):
			for x in range(0,6):
				for y in range(0,6):
					map.matrix[y][x] = {"id": "","value": 0}
			#goal
			map.matrix[0][5] = {"id":"b1","value":50}
			map.matrix[1][0] = {"id":"b2","value":1000}
			#special point
			map.matrix[4][3] = {"id":"p1","value":0}
			map.matrix[1][4] = {"id":"p2","value":0}


			#walls
			for x in range(2,6):
				map.matrix[3][x] = {"id":"w","value":-10}
			map.matrix[4][2] = {"id":"w","value":-10}

		return map
	def run(self):
		self.robot.move_robot(self.map)
		print("x : " + str(self.robot.get_x()) + " , y : " + str(self.robot.get_y()))
		self.robot.renforcement_calcul(self.map)
	
		print("run : " + str(self.counter_run))
		self.counter_run = self.counter_run + 1
	def get_map(self):
		return self.map.matrix
	def get_learning_map(self):
		return self.robot._memory.matrix

	def get_position_agent(self):
		return self.robot.get_x(), self.robot.get_y()
#def renforcement_action():
class TestRobot(unittest.TestCase):

	def test_robot_construction(self):
		robot = Robot()
		#initial position
		self.assertEqual(robot.get_x(),5)
		self.assertEqual(robot.get_y(),5)

	def test_getter_and_setter(self):
		robot = Robot()
		robot.set_x(9)
		robot.set_y(2)
		self.assertEqual(robot.get_x(),9)
		self.assertEqual(robot.get_y(),2)
		
	def test_know_all_adjacent_case(self):
		robot = Robot()
		self.assertFalse(robot.know_all_adjacent_case())
		robot.set_memory(5,4,0)
		robot.set_memory(4,5,0)
		self.assertTrue(robot.know_all_adjacent_case())

	def test_random_move(self):
		robot = Robot()
		robot.random_move(Map(6,6,None))
		self.assertTrue(robot.get_x() != 5 or robot.get_y() != 5)

class TestMap(unittest.TestCase):
	def test_creation_map(self):
		truc = Map(6,4,0)
		self.assertEqual(len(truc.matrix),4)
		self.assertEqual(len(truc.matrix[0]),6)
	def test_coord_is_in_map(self):
		map = Map(6,6,0)
		self.assertTrue(map.coord_is_in_map(4,2))
		self.assertFalse(map.coord_is_in_map(-2,3))

class TestSimulation(unittest.TestCase):
	def test_creation(self):
		simulation = Simulation(0)
if __name__ == '__main__':
	unittest.main()
#	if(len(sys.argv) == 2):
#		mode = sys.args[1]
#	else:
#		mode = 0				
#	init_map(0)
#	run()
#	#main = Firefox()
#	#main.startNetwork()
