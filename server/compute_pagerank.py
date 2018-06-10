import sys, json, numpy as np
from flask import Flask, request

app = Flask(__name__)

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def create_stochastic(adj_list):
  n = len(adj_list)
  matrix = np.zeros((n, n))
  for col, line in enumerate(adj_list):
    if len(line) > 0:
      for index in line:
        matrix[index][col] = 1/(len(line))
    else:
      for index in range(n):
        matrix[index][col] = 1/n
  return matrix

def create_transitional(stoch_matrix):
  n = len(stoch_matrix)
  d = 0.85 #damping factor
  E = np.ones((n, n)) #create matrix of 1's
  part1 = np.multiply(((1-d)/n), E)
  part2 = np.multiply(d, stoch_matrix)
  return np.add(part1, part2)

def calculate_pagerank(transition_matrix):
  n = len(transition_matrix)
  err_bound = 0.005
  v1 = np.full((n, 1), 1/n)
  v2 = np.matmul(transition_matrix, v1)
  count = 1
  while not within_err_bound(v1, v2, err_bound): 
    #keep iterating multiplication until difference between v1 and v2 for all entries is under err bound
    v1 = v2
    v2 = np.matmul(transition_matrix, v1)
    count += 1
  return {'vector': v2.tolist(), 'iterations': count}

def within_err_bound(v1, v2, err_bound):
  diff_vector = np.subtract(v2, v1)
  for diff in diff_vector:
    if abs(diff) > err_bound:
      return False
  return True

@app.route('/', methods=['POST'])
def post():
  adj_list = request.get_json()
  adj_list2 = [[1,3,4],[4],[0,1],[1],[1]]
  stoch_matrix = create_stochastic(adj_list)
  transition_matrix = create_transitional(stoch_matrix)
  result = calculate_pagerank(transition_matrix)
  return json.dumps(result)

if __name__ == '__main__':
  app.run(debug=True)
