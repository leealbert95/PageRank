import sys, json, numpy as np

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def create_stochastic(adj_list):
  n = len(adj_list)
  matrix = np.zeros((n, n))
  for col, line in enumerate(adj_list):
    for index in line:
      matrix[index][col] = 1/(len(line))
  return matrix

def add_damping(stoch_matrix):
  n = len(stoch_matrix)
  d = 0.85 #damping factor
  E = np.ones((n, n)) #create matrix of 1's
  part1 = np.multiply(((1-d)/n), E)
  part2 = np.multiply(d, stoch_matrix)
  return np.add(part1, part2)

def calculate_pagerank(damped_matrix):
  n = len(damped_matrix)
  err_bound = 0.005
  v1 = np.ones(n)
  v1 = np.multiply((1/n), v1)
  v2 = np.matmul(damped_matrix, v1)
  count = 1
  while not within_err_bound(v1, v2, err_bound): 
    #keep iterating multiplication until difference between v1 and v2 for all entries is under err bound
    v1 = v2
    v2 = np.matmul(damped_matrix, v1)
    count += 1
  return v2, count

def within_err_bound(v1, v2, err_bound):
  diff_vector = np.subtract(v2, v1)
  for diff in diff_vector:
    if abs(diff) > err_bound:
      return False
  return True

def main():
  # adj_list = read_in()
  adj_list = [[1,3,4],[4],[0,1],[1],[1]]
  stoch_matrix = create_stochastic(adj_list)
  damped_matrix = add_damping(stoch_matrix)
  result = calculate_pagerank(damped_matrix)
  pagerank_vector = result[0]
  iterations = result[1]
  print(json.dumps(pagerank_vector.tolist()))
  print(iterations)

if __name__ == '__main__':
  main()