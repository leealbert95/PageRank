import sys, json, numpy as np

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def create_stochastic(adj_list):
  size = len(adj_list)
  matrix = np.zeros((size, size))
  for col, line in enumerate(adj_list):
    for index in line:
      matrix[index][col] = 1/(len(line))
  return matrix

def with_damping(stoch_matrix):
  n = len(stoch_matrix)
  d = 0.85 #damping factor
  E = np.ones((n, n))
  part1 = np.multiply(((1-d)/n), E)
  part2 = np.multiply(d, stoch_matrix)
  return np.add(part1, part2)

def main():
  # read_in()
  adj_list = [[1,4,2],[2],[0],[4],[3]]
  stoch_matrix = create_stochastic(adj_list)
  damped_matrix = with_damping(stoch_matrix)
  print(damped_matrix)

if __name__ == '__main__':
  main()