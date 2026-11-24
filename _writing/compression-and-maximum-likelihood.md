---
title: Compression and maximum likelihood
date: 2026-11-24
excerpt: How minimizing the number of bits needed to represent data leads to maximum likelihood.
use_math: true
---

I’d heard people say “compression is intelligence” for a while without quite knowing what they meant. A [3Blue1Brown video](https://members.3blue1brown.com/posts/reinventing-part-160410360) and [an essay by Ryan Greene](https://www.greene.sh/compression-and-intelligence/) got me thinking about it again. I wanted to see if I could understand the idea by connecting compression to something I knew better, maximum likelihood. Below is my best attempt at doing so. 

## 1. Maximum likelihood

Let $x$ be a random variable with $k$ possible outcomes $x_1,\ldots,x_k$. A model with parameters $\theta$ assigns probability $p(x_j\mid\theta)$ to the outcome $x_j$. Suppose we observe $n$ independent draws, and write $x^{(i)}$ for the value of draw $i$. The likelihood $L(\theta)$ is the probability that the model assigns to the whole sequence. Since the draws are independent, we can multiply their probabilities.

$$
L(\theta)=\prod_{i=1}^n p(x^{(i)}\mid\theta).
$$

Maximum likelihood chooses the parameters $\theta$ that give the observed data the highest probability. Taking the logarithm preserves the order of those probabilities and turns their product into a sum. With a minus sign, we can write the same problem as minimizing the negative log-likelihood.

$$
-\log_2 L(\theta)=-\sum_{i=1}^n \log_2 p(x^{(i)}\mid\theta).
$$
Optimizing a sum is easier than a product for a variety of reasons - for instance, the derivative with respect to the probabilities is a lot easier (because of the product rule). Hence why this is used in practice. 

## 2. Compression

Suppose we use a string of bits to represent each outcome of $x$. Let $b(x_j)$ be the number of bits we use to represent outcome $x_j$, and write $b_j=b(x_j)$. If $p_j=\Pr(x=x_j)$, the expected number of bits per outcome is

$$
\mathbb{E}[b(x)] = \sum_{j=1}^k p_j b_j.
$$

Our goal is to minimize this term. The trivial way of doing so would be to set every $b_j$ to zero - but then every outcome $x_j$ would be encoded using the same string of bits.  We need to be able to tell which outcomes occurred, and hence need an additional constraint.

Let $B$ be the most bits we use to represent any of the $k$ outcomes. A bit string is an ordered sequence of zeros and ones. Each of its $B$ positions has two choices, so there are $2^B$ different bit strings of length $B$. Suppose we use $b_j$ bits for outcome $x_j$. There are $2^{B-b_j}$ strings of length $B$ that start with those same bits, because the remaining $B-b_j$ bits can be anything.

Suppose we write the bits for the outcomes $x_1, \dots, x_k$. As we read the strings for each outcome from left to right, we want to recognize an outcome as soon as we have read all its bits. For example, suppose we use `0`, `01`, `10`, and `11` for $x_1$, $x_2$, $x_3$, and $x_4$, respectively. When we see the first `0`, we cannot tell whether we have read $x_1$ or just the first bit of $x_2$. 

To avoid this ambiguity, we choose the bit strings so that we can recognize each outcome as soon as we read its bits. In the example, if we use `0` for $x_1$, we rule out `01` and every other longer string starting with `0` for the remaining outcomes. With this rule, each string of length $B$ can begin with the bits for at most one outcome.

Now if we follow this scheme, outcome $x_j$ takes up $2^{B-b_j}$ of these strings. 
For the same four outcomes, keep `0` for $x_1$ and use `10`, `110`, and `111` for the others. The longest code uses three bits, so $B=3$. Every three-bit string that starts with `0` is reserved for $x_1$. The other outcomes reserve the strings that start with their own codes.

| Outcome | Code | Three-bit strings reserved | Number reserved |
| --- | --- | --- | --- |
| $x_1$ | `0` | `000`, `001`, `010`, `011` | 4 |
| $x_2$ | `10` | `100`, `101` | 2 |
| $x_3$ | `110` | `110` | 1 |
| $x_4$ | `111` | `111` | 1 |

Together, the four outcomes reserve $4+2+1+1=8$ strings, exactly the $2^3$ available. In general, the total number of reserved strings can be at most $2^B$.
$$
\sum_{j=1}^k 2^{B-b_j} \le 2^B.
$$

Divide by $2^B$ to express the same constraint in terms of shares. Each outcome reserves a share of

$$
\frac{2^{B-b_j}}{2^B}
= 2^{(B-b_j)-B}
= 2^{-b_j}.
$$

The shares must add up to at most one.

$$
\sum_{j=1}^k 2^{-b_j} \le 1.
$$

This is the [*Kraft inequality*](https://en.wikipedia.org/wiki/Kraft%E2%80%93McMillan_inequality).

## 3. From bit lengths to maximum likelihood

Assume $p_j>0$ for every outcome. Let $\mathbf{b}=(b_1,\ldots,b_k)$ be the vector of code lengths. Actual codes use a whole number of bits. To find the ideal lengths, we first allow any nonnegative real value.

$$
\mathbf{b}^{\star}
=\operatorname*{arg\,min}_{\mathbf{b}\in[0,\infty)^k}
\mathbb{E}[b(x)]
\qquad \text{subject to} \qquad
\sum_{j=1}^k 2^{-b_j}\le 1.
$$

Write $q_j=2^{-b_j}$ for the share reserved for $x_j$. Taking the base-two logarithm gives $b_j=-\log_2 q_j$. The expected length in terms of the shares is then $F(q_1,\ldots,q_k)=-\sum_{j=1}^k p_j\log_2 q_j$. So we can solve

$$
\min_{q_1,\ldots,q_k>0}\; F(q_1,\ldots,q_k)
\qquad \text{subject to} \qquad
\sum_{j=1}^k q_j\le 1.
$$

If the shares sum to less than one, we can increase one of them. That shortens its code and lowers the expected length, since every $p_j$ is positive. So at the minimum, the shares sum to one. Also, as any share approaches zero, its contribution to the expected length goes to infinity. The minimum is therefore at positive shares, and we can use a Lagrange multiplier $\lambda$ for the sum constraint.

$$
\mathcal{L}(q_1,\ldots,q_k,\lambda)
= -\sum_{j=1}^k p_j\log_2 q_j
+ \lambda\left(\sum_{j=1}^k q_j-1\right).
$$

Differentiating with respect to $q_j$, the term $-p_j\log_2 q_j$ contributes $-p_j/(q_j\ln 2)$ and the constraint term contributes $\lambda$. Setting the partial derivative to zero gives

$$
-\frac{p_j}{q_j\ln 2}+\lambda=0
\qquad\Longrightarrow\qquad
q_j=\frac{p_j}{\lambda\ln 2}.
$$

The shares and the probabilities each sum to one, so

$$
1=\sum_{j=1}^k q_j
=\frac{1}{\lambda\ln 2}\sum_{j=1}^k p_j
=\frac{1}{\lambda\ln 2}.
$$

Thus $\lambda\ln 2=1$, so $q_j=p_j$ for every outcome. Using $b_j=-\log_2 q_j$, we get the ideal length of the string of bits for each outcome.

$$
b_j^{\star}=-\log_2 q_j=-\log_2 p_j
$$

Substituting these lengths into the expected length gives the entropy of $x$.

$$
\mathbb{E}[b(x)] = \sum_{j=1}^k p_j b_j^{\star} = -\sum_{j=1}^k p_j\log_2p_j
$$

If we don’t know the true probabilities $p_j$, we can use a model’s probabilities to set the code lengths. Substituting $p(x_j\mid\theta)$ for $p_j$ in the formula for the ideal length gives $b_\theta(x_j)=-\log_2 p(x_j\mid\theta)$. The true probabilities still tell us how often we expect to use each code, so the expected length per draw is

$$
\mathbb{E}[b_\theta(x)] = -\sum_{j=1}^k p_j\log_2 p(x_j\mid\theta).
$$

For the data we actually observed, we can average the code lengths directly. Each draw contributes one term.

$$
\frac{1}{n}\sum_{i=1}^n b_\theta(x^{(i)})
= -\frac{1}{n}\sum_{i=1}^n \log_2 p(x^{(i)}\mid\theta)
= -\frac{1}{n}\log_2 L(\theta).
$$

In the last step, we use the fact that the sum of the logs of the observed draws’ probabilities equals the log of their product. This last step shows the expected bits needed at the minimum,  is the (average) negative log likelihood.
Maximum likelihood therefore chooses the parameters that in turn give the shortest description. 


## 4. The intuition behind the math

Take the four codes from earlier, with lengths of 1, 2, 3, and 3 bits. If every outcome has probability $0.25$, the expected length is

$$
\mathbb{E}[b(x)] = 0.25(1+2+3+3)=2.25.
$$

Now suppose $x_1$ has probability $0.85$ and each of the other three outcomes has probability $0.05$. With the same codes, the expected number of bits drops to

$$
\mathbb{E}[b(x)] = 0.85\cdot 1+0.05(2+3+3)=1.25.
$$

The average drops because most draws now give $x_1$, which takes just one bit to write down.

Now keep those probabilities fixed and swap the codes for $x_1$ and $x_4$. The most likely outcome now takes three bits, and one of the rare outcomes takes just one. The expected number of bits rises to

$$
\mathbb{E}[b(x)] = 0.85\cdot 3+0.05(2+3+1)=2.85.
$$

Every time $x_1$ appears, we spend two extra bits. We save those two bits whenever $x_4$ appears, but that happens far less often.

A probability model helps us decide which outcomes should get the shorter codes. If we know the true probabilities, we can use them to calculate the ideal lengths. If we have several models, maximum likelihood picks the one whose ideal lengths add up to the fewest bits on the data we observed.

I’m still unconvinced by “compression is intelligence.” What I take from this is that the better you know what’s likely to happen, the fewer bits you need on average to describe what happens.
