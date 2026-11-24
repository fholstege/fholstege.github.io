---
title: Compression and maximum likelihood
date: 2026-11-24
excerpt: How minimizing the number of bits needed to represent data leads to maximum likelihood.
use_math: true
---

For some time I have heard ‘compression is intelligence’ as a sort of throwaway comment. I never really understood what this meant, even after watching a [great 3Blue1Brown video](https://members.3blue1brown.com/posts/reinventing-part-160410360). After reading an [amazing essay by Ryan Greene](https://www.greene.sh/compression-and-intelligence/) I finally had enough, and decided that I needed to understand this statement a bit more. Below is my best attempt, by connecting compression to something I understand much better (maximum likelihood).

## 1. Maximum likelihood

Let $x$ be a random variable with $k$ possible outcomes $x_1,\ldots,x_k$. We write $p(x\mid\theta)$ for the probability the model assigns to an outcome. In particular, $p(x_j\mid\theta)$ is the probability that $x=x_j$ under a model with parameters $\theta$. For example, if $x$ is the outcome of a coin toss, $\theta$ could be the probability of heads.

Suppose we observe $n$ independent draws of $x$. Let $x^{(i)}$ denote the value of draw $i$. Each draw takes one of the possible values $x_1,\ldots,x_k$. The likelihood $L(\theta)$ is the probability the model assigns to the observed sequence. By independence,

$$
L(\theta)=\prod_{i=1}^n p(x^{(i)}\mid\theta).
$$

Maximum likelihood chooses the parameters $\theta$ that maximize $L(\theta)$. Since the logarithm is increasing, this is equivalent to minimizing the negative log-likelihood.

$$
-\log_2 L(\theta)=\sum_{i=1}^n -\log_2 p(x^{(i)}\mid\theta).
$$

Taking the log turns the product into a sum, which is easier to optimize in practice.

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

Together, the four outcomes reserve $4+2+1+1=8$ strings, exactly the $2^3$ available.

In generality, if we add over all outcomes, we cannot take up more than the $2^B$ strings available.
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

This is the so-called *Kraft inequality*.

## 3. From bit lengths to maximum likelihood

For simplicity, assume $p_j>0$ for every outcome. Let $\mathbf{b}=(b_1,\ldots,b_k)$ collect the bit lengths for each outcome. To find the ideal lengths, we allow nonnegative real values and solve

$$
\mathbf{b}^{\star}
=\operatorname*{arg\,min}_{\mathbf{b}\in[0,\infty)^k}
\mathbb{E}[b(x)]
\qquad \text{subject to} \qquad
\sum_{j=1}^k 2^{-b_j}\le 1.
$$

Write $q_j=2^{-b_j}$ for the share that outcome $x_j$ reserves. Taking the base-two logarithm gives $b_j=-\log_2 q_j$. Substituting this into the expected length gives $F(q_1,\ldots,q_k)=-\sum_{j=1}^k p_j\log_2 q_j$. We can now write the constrained optimization problem in terms of the shares.

$$
\min_{q_1,\ldots,q_k>0}\; F(q_1,\ldots,q_k)
\qquad \text{subject to} \qquad
\sum_{j=1}^k q_j\le 1.
$$

If the shares add up to less than one, we can increase one of them and lower the expected length. So at the minimum, the shares must add up to one. We thus do not have to account for the constraint that $q_k>0$, and can use this Lagrange multiplier $\lambda$ to find the minimum.

$$
\mathcal{L}(q_1,\ldots,q_k,\lambda)
= -\sum_{j=1}^k p_j\log_2 q_j
+ \lambda\left(\sum_{j=1}^k q_j-1\right).
$$

Differentiating with respect to $q_j$, the term $-p_j\log_2 q_j$ contributes $-p_j/(q_j\ln 2)$ and the constraint term contributes $\lambda$.

Setting the partial derivative to zero gives

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

Thus $\lambda\ln 2=1$ and $q_j=p_j$ for every outcome. Substituting this back into the constrained optimization problem, the solution for each outcome is given by:

$$
b_j^{\star}=-\log_2 q_j=-\log_2 p_j=-\log_2\Pr(x=x_j).
$$
Notice that if we substitute this back into the expectation, we get

$$
\mathbb{E}[b(x)] = \sum_{j=1}^k p_j b_j^{\star} = -\sum_{j=1}^k p_j\log_2\Pr(x=x_j)
$$

Now in some cases, we might know $\Pr(x=x_j)$ (for instance when rolling a dice), but often we do not. Instead, we use a model with parameters $\theta$ to estimate it. The model gives draw $i$ an ideal length of $-\log_2 p(x^{(i)}\mid\theta)$. Adding these lengths gives the ideal length for the observed sequence.

$$
\sum_{i=1}^n -\log_2 p(x^{(i)}\mid\theta)
= -\log_2 L(\theta).
$$

Maximum likelihood therefore chooses the parameters that in turn give the shortest description. 


## 4. The intuition behind the math

What is the intuition behind all of this? If an outcome is very likely, it makes sense to encode it with a shorter bit string. Take the four outcomes from earlier, whose codes use 1, 2, 3, and 3 bits. If each outcome has probability $0.25$, the expected number of bits is

$$
\mathbb{E}[b(x)] = 0.25(1+2+3+3)=2.25.
$$

Now suppose $x_1$ has probability $0.85$ and each of the other three outcomes has probability $0.05$. With the same codes, the expected number of bits drops to

$$
\mathbb{E}[b(x)] = 0.85\cdot 1+0.05(2+3+3)=1.25.
$$

We use fewer bits on average because most draws give $x_1$, the outcome that takes just one bit to write down.

Now keep those probabilities fixed and swap the codes for $x_1$ and $x_4$. The most likely outcome now takes three bits, and one of the rare outcomes takes just one. The expected number of bits rises to

$$
\mathbb{E}[b(x)] = 0.85\cdot 3+0.05(2+3+1)=2.85.
$$

Every time $x_1$ appears, we spend two unecessary extra bits!

This is how a probability model helps us compress. Assigning the correct probability to an outcome means we can subsequently assign the correct code length. Maximum likelihood chooses the model that uses the fewest bits in total, under these ideal code lengths.

However, for what it's worth, I do not believe this shows 'compression is intelligence' - it shows for good compression, you need to know what is likely to happen (which some associate with intelligence).
