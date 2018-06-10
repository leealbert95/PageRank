# PageRank
A simple implementation of Google's PageRank algorithm. Uses NodeJS server to store the adjacency list state and Python to calculate
the rank of each page.

### What is PageRank?
&nbsp; Whenever you do a Google search, and you see the results appear on the page, do you ever wonder how/why the results are 
ordered the way they are? This is, in part, due to Google's PageRank algorithm! The algorithm, to put it simply, analyzes the number 
of incoming links to each page on the web, and assigns each page a rank determined by the rank of each page linking to it. 
PageRank follows a probabilistic model of a web surfer, who visits a certain page, and then clicks a link on that page
at random. In essence, the rank of each page represents the probability that any web surfer will land on it. Although it is
conceptually simple, PageRank is widely considered to be one of the most important algorithms ever invented in the tech industry.

### The History of PageRank
&nbsp; Although PageRank is popularly associated with Larry Page and Sergey Brin, the founders of Google, an early version of the
eigenvalue problem was explored in 1976 by Gabriel Pinski and Francis Narin in their attempt to rank scientific journals. Thomas Saaty 
explored the same problem in 1977 in his concept of the Analytic Heirarchy Process which weighted decisions, and Bradley Love and Steven
Sloman used it in 1995 as a cognitive model for concepts, too.

&nbsp; However, it wasn't until 1996 that Larry Page and Sergey Brin would adopt the algorithm for use in a search engine. As part of 
a Stanford research project about implementing a new type of search engine, Sergey Brin conceptualized the idea of ranking a web page by
the number of links pointing to it. Their first paper on the subject was published in 1998, which included the intitial prototype of the
Google search engine, and Page and Brin also patented the process (Stanford University holds the patent, but granted Google exclusive
licensing rights in exchange for 1.8 million of its shares). Since then, the algorithm has stayed an integral component of Google's search engine throughout the years, although it is not the only criteria Google uses to rank its search results (In part due to the many vulnerabilities of the algorithm, which you can read about below).

&nbsp; As an algorithm applicable to any graph in general, PageRank has been used in many other applications besides search engines,
including analysis of road networks, neuroscience, bibliometrics, literature, and even sports!
Within the tech industry, variants of the PageRank algorithm remain in use today; Twitter uses it to suggest users to follow, and Facebook implements it behind the scenes as part of its suggested friends algorithm.

### The Algorithm Explained

&nbsp; Imagine the World Wide Web consisted of only five webpages. We can visually represent these pages and their links as vertices and 
edges in a graph:

<img src="https://s3.amazonaws.com/albertpersonal/graph.png" width="300" height="250"/>

&nbsp; To calculate each page's rank, the weights of each incoming link must be calculated using the other page's rank. But in order to do that, we have to calculate each of the other pages' ranks, then the ranks of the pages with links to those other pages, and so on. When you consider the fact that links can be cyclical, too, this task seems practically impossible!

&nbsp; Fortunately, we do have a very effective and relatively simple way of doing this calculation! This is where linear algebra comes to the rescue. We can create a matrix representation of this graph and use iterative vector multiplication to achieve our result.

Here is the example graph represented as an adjacency list:

`[[1],[4],[0,1,3],[],[1]]`
 
Which corresponds to the adjacency matrix below (We will use 0-based indexing for all the matrices):

```
[[0,0,1,0,0],
 [1,0,1,0,1],
 [0,0,0,0,0],
 [0,0,1,0,0],
 [0,1,0,0,0]]
```

&nbsp; Each entry matrix[i][j] represents a link from page j to page i. If the link exists, it is given a value of 1. If not, it is given a value of 0.

From this, we can create the stochastic matrix:

```
[[0, 0, 0.33, 0.2, 0],
 [1, 0, 0.33, 0.2, 1],
 [0, 0, 0.00, 0.2, 0],
 [0, 0, 0.33, 0.2, 0],
 [0, 1, 0.00, 0.2, 0]]
```
&nbsp; What is a stochastic matrix? It is a matrix in which either all the entries of each row or column add up to 1. In this case, the
entries of each column add up to 1, so this matrix is column-stochastic. This type of matrix represents a probability distribution, in which each matrix[i][j] represents the probability that a web surfer who is currently on page j will visit page i.

&nbsp; You may be wondering why column 3 has 0.2 for all its entries, even though Page 3 has no outgoing links! This is because in 
the PageRank algorithm, a page with no outgoing links is assumed to equally distribute its importance among all the existing pages in the network. Effectively, this is the same as saying that the page has links to every page in the network, including itself. The justification for this reasoning is that, using the web surfer model, a user who visits a page with no outbound links will type the url of any of the existing webpages with equal probability. In this example, since there are five pages total in the network, a user on page 3 will have a 1/5 chance of visiting any of the other pages, hence the 0.2.

&nbsp; Here is a snippet of my Python code that creates the stochastic matrix (To save computational time I create the stochastic matrix directly from the adjacency list. I use Python's NumPy library for all matrix operations):

```python
def create_stochastic(adj_list):
  n = len(adj_list)
  matrix = np.zeros((n, n)) #initialize a matrix of zeroes (np is shorthand for NumPy)
  for col, line in enumerate(adj_list):
    if len(line) > 0:
      #case where page has existing links
      for index in line:
        matrix[index][col] = 1/(len(line))
    else:
      #case where page does not have any links
      for index in range(n):
        matrix[index][col] = 1/n
  return matrix
```

&nbsp; After we create the stochastic matrix, we must now consider the damping factor. According to Page and Brin, the PageRank problem
assumes that at some point, the user will grow bored and eventually stop clicking. The damping factor is a constant between 0 and 1, and
represents the probability that the user will continue clicking at any moment. In their paper, Page and Brin used a damping factor of 0.85, which is what I use in my implementation, too. 
[Here's a good explanation about the purpose of the damping factor.](https://www.quora.com/What-is-the-function-of-the-damping-factor-in-PageRank)

The pagerank calculation of any page is as follows:

<img src="http://chart.apis.google.com/chart?cht=tx&chl=PR(A)%20%3D%20%5Cfrac%7B1-d%7D%7BN%7D%2Bd%20%5Cbegin%7Bpmatrix%7D%5Cfrac%7BPR(T_%7B1%7D)%7D%7BL(T_%7B1%7D)%7D%2B%5Cfrac%7BPR(T_%7B2%7D)%7D%7BL(T_%7B2%7D)%7D%2B...%2B%5Cfrac%7BPR(T_%7BN%7D)%7D%7BL(T_%7BN%7D)%7D%5Cend%7Bpmatrix%7D%20">

&nbsp; Where PR = pagerank, N = number of pages in the web, d = damping factor, T = page with link to A, and L = number of outbound links from T.

We can then adapt this formula using the stochastic matrix we created earlier to create the transition matrix:

<img src="http://chart.apis.google.com/chart?cht=tx&chl=A%20%3D%20%5Cfrac%7B1-d%7D%7BN%7DE%2BdS%20">

Where A = transition matrix, E = NxN matrix of 1's, and S = stochastic matrix

Here is my Python function for creating the transition matrix:

```python
def create_transitional(stoch_matrix):
  n = len(stoch_matrix)
  d = 0.85 #damping factor
  E = np.ones((n, n)) #create matrix of 1's
  part1 = np.multiply(((1-d)/n), E)
  part2 = np.multiply(d, stoch_matrix)
  return np.add(part1, part2)
```
The resulting output for this example:

<img src="https://s3.amazonaws.com/albertpersonal/transition_matrix.png">

&nbsp; With this transition matrix (notice that it is still stochastic!), we can now multiply it by an initial column vector p<sub>0</sub> where p<sub>0</sub> has length N, and each p<sub>0</sub>[i] has value 1/N for a total sum of 1.
This vector p happens to be the sole eigenvector of the transition matrix with eigenvalue 1. [You can read about eigenvectors and eigenvalues here.](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors)

&nbsp; The result of this multiplication will be a new column vector p<sub>1</sub>, since multiplying an N x N matrix with a N x 1 matrix (the initial vector) yields an N x 1 matrix. We can multiply the transition matrix with this new vector again, and repeat the process, which can be described with the recursive formula below:

<img src="http://chart.apis.google.com/chart?cht=tx&chl=p_%7Bn%7D%20%3D%20A%20p_%7Bn-1%7D%20%20">

Each of the entries of each new vector will begin converging to a single value after several iterations. We can stop the process after the difference between all p<sub>n</sub>[i] and p<sub>n-1</sub>[i] is within a set error bound.

Here is my Python code that computes and counts the iterations:

```python
def calculate_pagerank(transition_matrix):
  n = len(transition_matrix)
  err_bound = 0.005 #personal error bound that I set for this project, not sure what Page and Brin used for their implementation
  v1 = np.ones(n)
  v1 = np.multiply((1/n), v1)
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
```

&nbsp; You can see the part of the console output for this example [here](https://s3.amazonaws.com/albertpersonal/iterations.png), since it's a bit too long to fit on this page. Even in the first few iterations, you can see the values changing by a smaller amount each time. This particular example takes 22 iterations until the differences fall below the error bound. 
The last vector output in this iterative process is the final pagerank:

<img src="https://s3.amazonaws.com/albertpersonal/final_vector.png" width=100 height=90>

&nbsp; Given this vector, we can see that Page 1 has the highest rank. This is expected because Page 1 has the most inbound links of any page. But notice that Page 4 has a very high rank, too! This is because Page 1 has only one link which points to Page 4, and transfers all of its weight into that single link, thus drastically increasing the rank of Page 4 in the process. 

### Sources
https://en.wikipedia.org/wiki/PageRank

https://arxiv.org/pdf/1407.5107v1.pdf

http://home.ie.cuhk.edu.hk/~wkshum/papers/pagerank.pdf

http://www.stat.cmu.edu/~ryantibs/datamining/lectures/03-pr.pdf
