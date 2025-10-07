---
title: "Preserving Task-Relevant Information Under Linear Concept Removal"
collection: publications
permalink: /publication/removal_oblique
excerpt: 'Modern neural networks often encode unwanted concepts alongside task-relevant information, leading to fairness and interpretability concerns. Existing post-hoc approaches can remove undesired concepts but often degrade useful signals. We introduce SPLICE-Simultaneous Projection for LInear concept removal and Covariance prEservation-which eliminates sensitive concepts from representations while exactly preserving their covariance with a target label. SPLICE achieves this via an oblique projection that "splices out" the unwanted direction yet protects important label correlations. Theoretically, it is the unique solution that removes linear concept predictability and maintains target covariance with minimal embedding distortion. Empirically, SPLICE outperforms baselines on benchmarks such as Bias in Bios and Winobias, removing protected attributes while minimally damaging main-task information.'
date: 2025-06-12
venue: 'NeurIPS'
paperurl: 'https://arxiv.org/abs/2506.10703'
brief_description: '**Summary**: We introduce an oblique projection (SPLICE) that ensures linear guardedness w.r.t a concept of interest, while (linear) information regarding a task of interest. '
brief_description_image: "SPLICE_illustrated.png"
---
