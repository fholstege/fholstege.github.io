---
title: "The Bias-Variance Trade-off of Importance Weighting"
collection: publications
permalink: /publication/optim_weights
excerpt: '**Working paper coming soon**: In machine learning, we often have training data from different subgroups. However, the extent to which these groups occur in our training data often does not reflect our test distribution of interest.  A common practice for dealing with this problem is _importance weighting_, which gives greater weight to datapoints from certain groups (and lower to others). With importance weighting, the estimated ML model can become sensitive to a small number of datapoints that are given (too) much weight. We investigate how importance weighting affects the bias-variance trade-off. We find that existing heuristics for determining the weights aim to minimize the bias, but drastically increase the variance of the estimated model (e.g. overfitting), leading to suboptimal performance. We cast finding the optimal weights as a bi-level optimization problem, and show that solving this problem can lead to weights that perform better than commonly used heuristics.'
---
