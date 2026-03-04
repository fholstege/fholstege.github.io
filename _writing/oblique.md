---
title: Orthogonal and Oblique Projections
date: 2026-03-04
excerpt: A short note on how a projection is determined by its kernel and range, and what makes the oblique case special.
use_math: true
---

In our paper [Preserving Task-Relevant Information Under Linear Concept Removal](https://arxiv.org/abs/2506.10703), we use an **oblique projection** to remove an unwanted direction from deep neural network (DNN) representations, while preserving task-relevant information. In this note, I want to clarify the difference between the oblique projection and the (more well-known) orthogonal projection. 

Before diving into the math, let's start with the core intuition: <u>a projection keeps one component of a vector and discards another</u>. The discarded part is the *kernel*. The retained part is the *range*. Orthogonal and oblique projections differ only in the range.

Formally, let $\proj : \RR^d \to \RR^d$ be a linear map. We call $\proj$ a projection if

$$
\proj^2 = \proj.
$$

This algebraic condition already tells us how to think about $\proj$. For any $\vx \in \RR^d$,

$$
\vx = \proj \vx + (\vx - \proj \vx).
$$

The first term lies in $\range(\proj)$. The second term lies in $\kernel(\proj)$, since

$$
\proj(\vx - \proj \vx) = \proj \vx - \proj^2 \vx = \boldsymbol{0}.
$$

So every vector decomposes as

$$
\vx = \vr + \vn,
\qquad
\vr \in \range(\proj),
\qquad
\vn \in \kernel(\proj),
$$

and the projection returns exactly the range component:

$$
\proj \vx = \vr.
$$

This is the general definition in geometric form. A projection is specified by its kernel and its range, with

$$
\RR^d = \range(\proj) \oplus \kernel(\proj).
$$


The orthogonal projection is a special case, where the basis vectors spanning the range are orthogonal to $\kernel(\proj)$, e.g.

$$
\range(\proj) = \kernel(\proj)^\perp,
$$

and $\proj$ is an orthogonal projection. That is the whole distinction.
* A projection is defined by its kernel and the basis vectors for its range.
* If those basis vectors are orthogonal to the kernel, the projection is orthogonal.
* If they are not, the projection is oblique.

The next two figures show the same idea geometrically. In both cases, the vector $\vx$ is moved parallel to the same kernel direction. What changes is the basis used to characterize the range. In the orthogonal case, that basis is orthogonal to the kernel. In the oblique case, it is a different complement of the same kernel.



<div class="image-grid image-grid-two">
  <figure class="post-figure">
    <img src="{{ '/images/writing/orthogonal-projection.png' | relative_url }}" alt="Orthogonal projection of a vector onto a range orthogonal to the kernel." />
    <figcaption>
      Orthogonal projection: the range is $\kernel(\proj)^\perp$, so $\vx$ lands on the perpendicular complement of the kernel.
    </figcaption>
  </figure>

  <figure class="post-figure">
    <img src="{{ '/images/writing/oblique-projection.png' | relative_url }}" alt="Oblique projection of a vector onto a slanted complement of the kernel." />
    <figcaption>
      Oblique projection: $\vx$ is still projected parallel to the same kernel direction, but onto a different basis for the range.
    </figcaption>
  </figure>
</div>
