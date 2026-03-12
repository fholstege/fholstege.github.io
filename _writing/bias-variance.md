---
title: Which Bias-Variance Decomposition?
date: 2026-03-04
excerpt: In which I aim to clarify the differences between ML's most famous composition.
use_math: true
---


Every university student that has taken a class will have likely encountered the *bias-variance decomposition* at some point. The core idea is that for some loss functions [\[1\]](#ref-1), we can split up the expected out-of-sample loss (e.g. the loss on samples not in our training data) into three parts. For example, suppose we predict whether a patient has a disease from clinical features (symptoms, lab values, age, etc.): the model outputs a risk score, and we compare it to the true diagnosis.
* The **bias**: in the disease example, this is the squared gap between the true disease signal and the model's average predicted risk for similar patients.
* The **variance**: in the disease example, this is how much the predicted risk changes for the same patient when we retrain on a different sample of patients.
* The **Irreducible noise**: in the disease example, this is randomness/unobserved factors in diagnosis outcomes that are not predictable from the available features.
  
When explaining this concept to students, I frequently encounter confusion about _what is assumed stochastic_ in the bias-variance decomposition. Personally, I also found this confusing, and in various sources the difference is not made very clear. This blog post seeks to clarify this confusion both for myself and others. 

I will first present the bias-variance decomposition in its 'most stochastic' form, then progressively fix different objects to show when the decomposition still holds and how it changes.


## 0. Notation and data-generating process

For simplicity, I will focus on the bias-variance decomposition for the squared error. Let $(\mathbf{x},y) \sim \mathbb{P}$ be a random input-label pair on $\RR^p \times \RR$. In the disease example, $\mathbf{x}$ can be a patient's clinical features, and $y$ can be an indicator for whether that patient truly has the disease. We observe a dataset

$$
\mathcal{D}=\{(\mathbf{x}_i,y_i)\}_{i=1}^n,
$$

where each $(\mathbf{x}_i,y_i)$ is an i.i.d. draw from the same distribution $\mathbb{P}$.

Let $f(\mathbf{x})$ denote the data-generating function, and let $\hat f(\mathbf{x},\mathcal{D})$ denote the fitted model prediction at input $\mathbf{x}$ using dataset $\mathcal{D}$. For squared loss, the prediction risk is

$$
R
= \mathbb{E}_{\mathcal{D},\mathbf{x},y}\!\left[(y-\hat f(\mathbf{x},\mathcal{D}))^2\right].
$$

Write

$$
y=f(\mathbf{x})+\epsilon,
\qquad
\mathbb{E}_{\epsilon\mid \mathbf{x}}[\epsilon]=0,
\qquad
\Var_{\epsilon\mid \mathbf{x}}(\epsilon)=\sigma^2(\mathbf{x}).
$$

## Case A: out-of-sample data and dataset stochastic
Think of this as evaluating a disease-risk model across both random future patients and random training datasets.
We start from

$$
\begin{aligned}
R
&=\mathbb{E}_{\mathcal{D},\mathbf{x}}\!\left[\mathbb{E}_{y \mid \mathbf{x}}\!\left[(y -\hat f(\mathbf{x},\mathcal{D}))^2\right]\right]\\
&= \mathbb{E}_{\mathcal{D},\mathbf{x}}\!\left[\mathbb{E}_{\epsilon\mid \mathbf{x}}\!\left[(f(\mathbf{x})+\epsilon-\hat f(\mathbf{x},\mathcal{D}))^2\right]\right] \\
&= \mathbb{E}_{\mathcal{D},\mathbf{x}}\!\left[(f(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D}))^2\right]
+ \mathbb{E}_{\mathbf{x}}\!\left[\sigma^2(\mathbf{x})\right].
\end{aligned}
$$

where the second line uses $y=f(\mathbf{x})+\epsilon$. Define the expected prediction at each $\mathbf{x}$:

$$
\mu(\mathbf{x})=\mathbb{E}_{\mathcal{D}}\!\left[\hat f(\mathbf{x},\mathcal{D})\right].
$$

Then, for fixed $\mathbf{x}$, add and subtract $\mu(\mathbf{x})$ inside the square:

$$
\begin{aligned}
\mathbb{E}_{\mathcal{D}}\!\left[(f(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D}))^2\right]
&= \mathbb{E}_{\mathcal{D}}\!\left[\big(f(\mathbf{x})-\mu(\mathbf{x})+\mu(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D})\big)^2\right] \\
&= (f(\mathbf{x})-\mu(\mathbf{x}))^2 + \mathbb{E}_{\mathcal{D}}\!\left[(\mu(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D}))^2\right] + 2(f(\mathbf{x})-\mu(\mathbf{x}))\mathbb{E}_{\mathcal{D}}\!\left[\mu(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D})\right] \\
&= (f(\mathbf{x})-\mu(\mathbf{x}))^2 + \Var_{\mathcal{D}}\!\left(\hat f(\mathbf{x},\mathcal{D})\right)
\end{aligned}
$$
Where we use $\mathbb{E}_{\mathcal{D}}[\mu(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D})]=0$.
Now we take the expectation w.r.t $\mathbf{x}$ on both sides:
$$
\mathbb{E}_{\mathcal{D},\mathbf{x}}\!\left[(f(\mathbf{x})-\hat f(\mathbf{x},\mathcal{D}))^2\right]
= \mathbb{E}_{\mathbf{x}}\!\left[(f(\mathbf{x})-\mu(\mathbf{x}))^2\right]
+ \mathbb{E}_{\mathbf{x}}\!\left[\Var_{\mathcal{D}}\!\left(\hat f(\mathbf{x},\mathcal{D})\right)\right].
$$

So the full decomposition is

$$
\boxed{
R
= \underbrace{\mathbb{E}_{\mathbf{x}}\!\left[(f(\mathbf{x})-\mathbb{E}_{\mathcal{D}}\!\left[\hat f(\mathbf{x},\mathcal{D})\right])^2\right]}_{\text{bias}^2}
+ \underbrace{\mathbb{E}_{\mathbf{x}}\!\left[\Var_{\mathcal{D}}\!\left(\hat f(\mathbf{x},\mathcal{D})\right)\right]}_{\text{variance}}
+ \underbrace{\mathbb{E}_{\mathbf{x}}\!\left[\sigma^2(\mathbf{x})\right]}_{\text{irreducible noise}}
}.
$$

In this bias-variance decomposition, the stochastic objects are the out-of-sample inputs $\mathbf{x}$ and the training dataset $\mathcal{D}$ (inside the bias and variance term); $f(\mathbf{x})$ and $\sigma^2(\mathbf{x})$ are deterministic functions once $\mathbf{x}$ is fixed.

## Case B: fixed out-of-sample inputs and stochastic dataset

Sometimes we do not treat the test inputs as stochastic. Instead, we fix one input value $\mathbf{x}_0$ and study the error at that point. In the disease example, this is like focusing on one specific patient profile $\mathbf{x}_0$ and asking how predictions for this patient vary if we would train on a dataset from the same distribution.

$$
R(\mathbf{x}_0)
= \mathbb{E}_{\mathcal{D},y\mid \mathbf{x}_0}\!\left[(y-\hat f(\mathbf{x}_0,\mathcal{D}))^2\right].
$$

Then the decomposition is

$$
\boxed{
R(\mathbf{x}_0)
= \underbrace{(f(\mathbf{x}_0)-\mathbb{E}_{\mathcal{D}}\!\left[\hat f(\mathbf{x}_0,\mathcal{D})\right])^2}_{\text{bias}^2}
+ \underbrace{\Var_{\mathcal{D}}\!\left(\hat f(\mathbf{x}_0,\mathcal{D})\right)}_{\text{variance}}
+ \underbrace{\sigma^2(\mathbf{x}_0)}_{\text{irreducible noise}}
}.
$$

So this is not the error for a fixed pair $(\mathbf{x}_0,y)$; only inputs $\mathbf{x}_0$ is fixed. This is the bias-variance trade-off as presented in Chapter 2 of _An Introduction to Statistical Learning_ [\[2\]](#ref-2).

## Case C: fixed out-of-sample inputs and fixed inputs in the dataset

We can go one step further, and instead of fixing the out-of-sample inputs also fix the inputs in the training data. We collect them in the design matrix. In the disease example, this means we fix the exact patient covariates in the training cohort and the target patient profile, and only outcomes/noise remain random.

$$
\mathbf{X}_0=
\begin{bmatrix}
\mathbf{x}_1^\top\\
\vdots\\
\mathbf{x}_n^\top
\end{bmatrix}.
$$

At a fixed test input $\mathbf{x}_0$, write a general fitted predictor as

$$
\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{y}),
$$

where $\mathbf{X}_0$ is fixed and only $\mathbf{y}$ is random. Define

$$
R(\mathbf{x}_0,  \mathbf{X}_0)
= \mathbb{E}_{\mathbf{y},y_0\mid \mathbf{X}_0,\mathbf{x}_0}
\!\left[(y_0-\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{y}))^2\right].
$$

Because $\mathbf{X}_0$ and $\mathbf{x}_0$ are fixed, we can write

$$
\mathbf{y}=\mathbf{X}_0\beta+\boldsymbol{\epsilon}_{\mathrm{tr}},
\qquad
y_0=\mathbf{x}_0^\top\beta+\epsilon_{\mathrm{oos}}.
$$

So the same risk can be written as

$$
R(\mathbf{x}_0,  \mathbf{X}_0)
= \mathbb{E}_{\boldsymbol{\epsilon}_{\mathrm{tr}},\epsilon_{\mathrm{oos}}\mid \mathbf{X}_0,\mathbf{x}_0}
\!\left[\left(\mathbf{x}_0^\top\beta+\epsilon_{\mathrm{oos}}-\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{X}_0\beta+\boldsymbol{\epsilon}_{\mathrm{tr}})\right)^2\right].
$$

So in this section, expectations are written over $\mathbf{y}$ and $y_0$, but all randomness comes from $\boldsymbol{\epsilon}_{\mathrm{tr}}$ and $\epsilon_{\mathrm{oos}}$. Equivalently,

$$
\Var_{\mathbf{y}\mid \mathbf{X}_0}\!\left(\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{y})\right)
= \Var_{\boldsymbol{\epsilon}_{\mathrm{tr}}\mid \mathbf{X}_0}\!\left(\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{X}_0\beta+\boldsymbol{\epsilon}_{\mathrm{tr}})\right),
$$
$$
\Var(y_0\mid \mathbf{x}_0)=\Var(\epsilon_{\mathrm{oos}}\mid \mathbf{x}_0).
$$

The bias-variance decomposition conditional on fixed $\mathbf{X}_0, \mathbf{x}_0$ is

$$
\boxed{
R(\mathbf{x}_0,  \mathbf{X}_0)
= \underbrace{\left(f(\mathbf{x}_0)-\mathbb{E}_{\mathbf{y}\mid \mathbf{X}_0}\!\left[\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{y})\right]\right)^2}_{\text{bias}^2}
+ \underbrace{\Var_{\boldsymbol{\epsilon}_{\mathrm{tr}}\mid \mathbf{X}_0}\!\left(\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{X}_0\beta+\boldsymbol{\epsilon}_{\mathrm{tr}})\right)}_{\text{variance}}
+ \underbrace{\Var(\epsilon_{\mathrm{oos}}\mid \mathbf{x}_0)}_{\text{irreducible noise}}
}.
$$

To shed a bit more light on this case, let us consider the case where the data-generating process is linear and we use ordinary least squares (OLS).
$$
y=\mathbf{x}^\top\beta+\epsilon_{\mathrm{oos}},\qquad \mathbb{E}[\epsilon_{\mathrm{oos}}\mid \mathbf{x}]=0,\qquad \Var(\epsilon_{\mathrm{oos}}\mid \mathbf{x})=\sigma^2,
$$
$$
\mathbf{y}=\mathbf{X}_0\beta+\boldsymbol{\epsilon}_{\mathrm{tr}},\qquad
\hat\beta=(\mathbf{X}_0^\top\mathbf{X}_0)^{-1}\mathbf{X}_0^\top\mathbf{y},\qquad
\hat f(\mathbf{x}_0;\mathbf{X}_0,\mathbf{y})=\mathbf{x}_0^\top\hat\beta.
$$

For OLS,

$$
\mathbb{E}_{\boldsymbol{\epsilon}_{\mathrm{tr}}\mid \mathbf{X}_0}[\hat\beta]=\beta,
\qquad
\Var_{\boldsymbol{\epsilon}_{\mathrm{tr}}\mid \mathbf{X}_0}(\hat\beta)=\sigma^2(\mathbf{X}_0^\top\mathbf{X}_0)^{-1},
$$

so

$$
\boxed{
R(\mathbf{x}_0,  \mathbf{X}_0)
= \underbrace{0}_{\text{bias}^2}
+ \underbrace{\sigma^2\,\mathbf{x}_0^\top(\mathbf{X}_0^\top\mathbf{X}_0)^{-1}\mathbf{x}_0}_{\text{variance}}
+ \underbrace{\sigma^2}_{\text{irreducible noise}}.
}
$$

If the fitted estimator is not OLS (for example ridge regression or lasso), the bias term generally does not vanish.

## Why do these differences matter? 

All three cases above describe a similar phenomenon: out-of-sample squared error decomposes into bias, variance, and irreducible noise. Returning to our example of disease prediction: **the right bias-variance decomposition depends on what randomness you care about**.
* **Case A**: use this when you want performance that is robust to both random training cohorts and random future patients in the population.
* **Case B**: use this when you care about a fixed set of patients, but still want robustness across different cohort data.
* **Case C**: use this when both training covariates and the target patient profile are fixed, so the remaining uncertainty comes from outcome noise (and estimator noise induced through outcomes).
  


## References

<a id="ref-1"></a>[1] Pfau, David., *A Generalized Bias-Variance Decomposition for
Bregman Divergences*: [arXiv:2511.08789](https://arxiv.org/pdf/2511.08789)

<a id="ref-2"></a>[2] Hastie et al., *An Introduction to Statistical Learning* (official site): [statlearning.com](https://www.statlearning.com/) (see Chapter 2)
