---
title: "Optimizing importance weighting in the presence of sub-population shifts"
collection: publications
permalink: /publication/optim_weights
excerpt: 'A distribution shift between the training and test data can severely harm performance of machine learning models. Importance weighting addresses this issue by assigning different weights to data points during training. We argue that existing heuristics for determining the weights are suboptimal, as they neglect the increase of the variance of the estimated model due to the finite sample size of the training data. We interpret the optimal weights in terms of a bias-variance trade-off, and propose a bi-level optimization procedure in which the weights and model parameters are optimized simultaneously. We apply this optimization to existing importance weighting techniques for last-layer retraining of deep neural networks in the presence of sub-population shifts and show empirically that optimizing weights significantly improves generalization performance.'
date: 2025-04-24
venue: 'International Conference on Learning Representations (ICLR)'
paperurl: 'https://arxiv.org/abs/2410.14315'
brief_description: '**Summary**: Many methods addressing spurious correlations rely on a form of importance weighting. We show these weights are frequently sub-optimal, and how to find better ones.'
brief_description_image: "WB_plot_v2.png"
---
