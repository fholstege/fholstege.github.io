---
title: How many samples does it take to detect a violation?
date: 2026-11-26
excerpt: One violation can establish that a behaviour occurs. How many tests give us a good chance of finding one?
use_math: true
---

Suppose we want to test whether an AI model can exhibit a prohibited behaviour. One genuine violation is enough
to classify the model as problematic (e.g. generating non-consensual intimate imagery).
Having many interactions without violations does not mean the model is incapable of this behaviour - it might simply be rare. How many interactions should you test?

Let $y_i\in\{0,1\}$ indicate whether interaction $i$ contains a violation. Assume that we identify violations perfectly, keep the model fixed, and draw interactions independently from the same evaluation distribution. Then $y_i\overset{\mathrm{i.i.d.}}{\sim}\operatorname{Bernoulli}(\mu)$, where $\mu$ is the violation probability.

A standard approach would be to compare the null hypothesis $H_0:\mu=\mu_0$ with an alternative $H_A:\mu\neq\mu_0$, for a reference probability $\mu_0$. Here we consider the special case $\mu_0=0$. Since probabilities cannot be negative, the hypotheses become

$$
H_0:\mu=0,\qquad H_A:\mu>0.
$$

We reject $H_0$ as soon as we observe a violation: $\sum_{i=1}^n y_i>0$.

### No type I error

A **type I error** means rejecting a null hypothesis that is true. Under our assumptions, this cannot happen, because
$$
\mathbb P(y_i=1\mid\mu=0)=0.
$$
Consequently, $\mathbb P(\text{reject }H_0\mid\mu=0)=0$, for any sample size. This means we only have to focus on controlling the type II error.

### Controlling type II error

A **type II error** means accepting $H_0$ when $H_A$ is true. Here, accepting means that we found no violations, not that we have proved $H_0$. Each interaction has probability $1-\mu$ of containing no violation. Since interactions are independent, we multiply these probabilities to obtain

$$
\mathbb P_\mu(\text{accept }H_0)
=\prod_{i=1}^n\mathbb P_\mu(y_i=0)
=(1-\mu)^n.
$$

Choose $\beta\in(0,1)$ as the largest probability of accepting $H_0$ under $H_A$ that we are willing to allow. This probability depends on $\mu$: rarer violations are easier to overlook. We therefore also choose $\mu_{\min}\in(0,1)$, the lowest violation probability we want to detect. For example, $\mu_{\min}=0.01$ means we want to detect behaviour that occurs in at least 1% of interactions; we do not require the same guarantee for rarer behaviour.

Among probabilities $\mu\geq\mu_{\min}$, violations are hardest to detect at $\mu=\mu_{\min}$. Thus, to keep the probability of accepting $H_0$ at most $\beta$ for every such $\mu$, we need

$$
(1-\mu_{\min})^n\leq\beta.
$$

Taking logarithms on both sides gives

$$
n\log(1-\mu_{\min})\leq\log\beta.
$$

Because $0<\mu_{\min}<1$, we have $\log(1-\mu_{\min})<0$. Dividing by this negative number reverses the inequality:

$$
n\geq\frac{\log\beta}{\log(1-\mu_{\min})}.
$$

Finally, the number of interactions must be an integer, so we round up. The exact minimum sample size is $n^*$, and the guarantee holds whenever

$$
n\geq n^*=\left\lceil\frac{\log\beta}{\log(1-\mu_{\min})}\right\rceil.
$$

This is an exact guarantee for any sample size. For small $\mu_{\min}$, $n^*\approx-\log(\beta)/\mu_{\min}$. If we choose $\beta=0.05$, this is roughly $3/\mu_{\min}$ samples. Below, you can exactly calculate how much samples are needed.


### Try it

<form id="sample-size-calculator" style="border: 1px solid currentColor; border-radius: 8px; padding: 1rem;">
  <p><label for="beta-probability">Maximum probability of accepting $H_0$ under $H_A$, $\beta$ (%)</label><br><input id="beta-probability" type="number" value="5" min="0" max="100" step="any" required style="font: inherit; max-width: 100%; box-sizing: border-box;"></p>
  <p><label for="violation-probability">Lowest violation probability to reliably detect, $\mu_{\min}$ (%)</label><br><input id="violation-probability" type="number" value="1" min="0" max="100" step="any" required style="font: inherit; max-width: 100%; box-sizing: border-box;"></p>
  <p><output id="sample-size-result" aria-live="polite" aria-atomic="true"></output></p>
  <noscript>Enable JavaScript to calculate sample sizes, or use the formula above.</noscript>
</form>

<script>
(() => {
  const form = document.getElementById('sample-size-calculator');
  const betaInput = document.getElementById('beta-probability');
  const muInput = document.getElementById('violation-probability');
  const result = document.getElementById('sample-size-result');

  function update() {
    const beta = betaInput.valueAsNumber / 100;
    const mu = muInput.valueAsNumber / 100;
    if (!(beta > 0 && beta < 1 && mu > 0 && mu < 1)) {
      result.textContent = 'Enter both percentages strictly between 0 and 100.';
      return;
    }
    const logBeta = Math.log(beta);
    const logMiss = Math.log1p(-mu);
    let n = Math.ceil(logBeta / logMiss);
    if (!Number.isSafeInteger(n)) {
      result.textContent = 'The required sample size is too large to calculate reliably. Increase the minimum violation probability.';
      return;
    }
    // Correct rounding at integer boundaries using the defining inequality.
    if (n > 1 && (n - 1) * logMiss <= logBeta) n -= 1;
    if (n * logMiss > logBeta) n += 1;
    result.textContent = `${n.toLocaleString('en-US')} ${n === 1 ? 'interaction gives' : 'interactions give'} at least ${(100 * (1 - beta)).toLocaleString('en-US', { maximumFractionDigits: 8 })}% chance of detecting a violation when its probability per interaction is at least ${muInput.value}%.`;
  }

  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  update();
})();
</script>
