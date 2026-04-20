---
title: An attempt to uncensor an Chinese open-source LLM on political topics
date: 2025-04-01
excerpt: Removing a linear subspace from the representations helps, but also uncensors the LLM on other topics
use_math: false
---

Current Large Language Models (LLMs) are sometimes censored on political topics. Examples of this have come from models created in China, which were censored on topics such as Taiwan or Tiananmen square [1](#ref-1). Other examples include the censoring of critiques on Russia and Vladimir Putin [2](#ref-2). This censorship can either be intentional [3](#ref-3), or unintentional [4](#ref-4), but in either case it can lead to LLMS propagating false information, given their capacity to generate realistic text [5](#ref-5). This has led to companies attempting to ‘uncensor’ LLMs with regards to particular topics [6](#ref-6). 

Previous work finds that key characteristics of LLMs can be altered via interventions in their activations. For example, Arditi et al. [7](#ref-7) found that the likelihood of an LLM refusing to answer ‘harmful’ questions (e.g. how do I make a bomb?) can be changed by removing a direction from its activations. Burns et al. [8](#ref-8) identify parts of the activations related to logical consistency. Inspired by this previous work this document is a preliminary investigation into two questions:
Can the degree of  political censorship be altered via interventions in an LLM its activations?
E.g. whether there is a direction in the activations space dedicated to political censorship.
How does this affect the likelihood of an LLM to refuse to answer ‘harmful’ questions? does this direction overlap with the ‘refusal’ direction identified by Arditi et al. [7](#ref-7)?

To answer these questions, I created a dataset with prompts to elicit political censorship from an Qwen 1.8B model on controversial topics related to China. I use techniques from Arditi et al. [7](#ref-7) to remove a ‘political censorship’ direction from all layers of this model. I also remove an ‘refusal direction’ similar to Aridit et al. [3](#ref-3) to see if there are any differences. After this, I find that
The rate of censorship of an Qwen 1.8B chat model can be altered by removing a ‘political censorship direction (A)’ from its activations. This provides an avenue to reduce political censorship in open-source LLMs.
However, removing this direction also alters the likelihood of the Qwen 1.8B model to respond to ‘harmful’ prompts (B),  based on prompts from Arditi et al. [7](#ref-7). This appears that there might be some kind of trade-off between uncensoring an LLM and making it safer. 

<figure class="post-figure" id="fig-key-results">
  <img src="{{ '/images/writing/uncensoring_key_plot.png' | relative_url }}" alt="Two bar charts comparing political censorship and refusal-to-harmful-prompt rates before and after removing the political censorship and refusal directions in Qwen 1.8B." />
  <figcaption>
    Results summary for Qwen 1.8B: removing the political censorship direction reduces political censorship, and both interventions affect refusal rates on harmful prompts.
  </figcaption>
</figure>


All code is available [here](https://github.com/fholstege/uncensoringllms).

*Dataset & Model*: I craft a small dataset of 111 English prompts. I aimed to craft these prompts on controversial political topics related to China. All the prompts can be found here. I expanded on an open-source set of prompts [9](#ref-9), and aimed to set prompts from a diverse set of subjects including (but not limited to): geopolitics, historical events, internet/media censorship. I then gather the responses from a Qwen 1.8B model as provided by Huggingface [10](#ref-10). I selected this model due to computational (& time) constraints, and because the Qwen series of models has previously shown political censorship [9](#ref-9). For responses of the model I use greedy decoding similar to Arditi et al. [7](#ref-7).  

I hand-coded a response as ‘political censorship’ under two criteria:

<ol>
  <li><strong>When the model is unwilling to answer or discuss a topic</strong>. See an example below:</li>
</ol>

<figure class="post-figure">
  <img src="{{ '/images/writing/uncensoring_response1.png' | relative_url }}" alt="Example response where the model refuses to discuss the Hong Kong student demonstrations, followed by the response after removing the political censorship direction." />
  <figcaption>
    Example of refusal to answer a political prompt before the intervention, followed by the response after removing the political censorship direction.
  </figcaption>
</figure>


<ol start="2">
  <li><strong>When the model misinforms the user</strong>. See an example below.</li>
</ol>

<figure class="post-figure">
  <img src="{{ '/images/writing/uncensoring_response2.png' | relative_url }}" alt="Example response denying forced labor allegations in Xinjiang, followed by the response after removing the political censorship direction." />
  <figcaption>
    Example of misinformation on a political topic before the intervention, followed by the response after removing the political censorship direction.
  </figcaption>
</figure>


This definition of ‘political censorship’ is not perfect (See the limitation section), but it broadly captures the behaviour I am interested in: whether or not the LLM is willing to discuss politically controversial topics, or misinforms a user on them. From the 111 prompts, I end up with 61 cases of censorship (50 where the model is unwilling to discuss a topic, and 11 where it misinforms the user). I split this set into a training set of 80 prompts  (40 where the model showed censorship, 40 where it did not) and keep the remaining 31 prompts for testing. 

 I use the methodology from Aridit et al [3](#ref-3). I feed prompts from our training set to the model, and measure for each prompt the activations of the model at its 23 layers. For the sake of time and ease, in contrast to Arditi et al. [7](#ref-7), I only focus on the activation for the last token. In future work, I hope to calculate the activation per token, and then use the algorithm from Arditi et al. [7](#ref-7) to select the one per layer. I then take the average over the two categories of prompts, per layer, resulting in (2 x 23) averages. I then take the difference between these averages, resulting in 23 vectors. See the images below for the first two PCA components of the activations.

<div class="image-grid image-grid-two">
  <figure class="post-figure">
    <img src="{{ '/images/writing/uncensoring_layer_plots/layer_8_position_-1_pca.png' | relative_url }}" alt="PCA scatter plot of last-token hidden states at layer 8, with censorship examples in blue and no-censorship examples in red." />
    <figcaption>
      PCA of hidden states at layer 8.
    </figcaption>
  </figure>

  <figure class="post-figure">
    <img src="{{ '/images/writing/uncensoring_layer_plots/layer_12_position_-1_pca.png' | relative_url }}" alt="PCA scatter plot of last-token hidden states at layer 12, with censorship examples in blue and no-censorship examples in red." />
    <figcaption>
      PCA of hidden states at layer 12.
    </figcaption>
  </figure>

  <figure class="post-figure">
    <img src="{{ '/images/writing/uncensoring_layer_plots/layer_16_position_-1_pca.png' | relative_url }}" alt="PCA scatter plot of last-token hidden states at layer 16, with censorship examples in blue and no-censorship examples in red." />
    <figcaption>
      PCA of hidden states at layer 16.
    </figcaption>
  </figure>

  <figure class="post-figure">
    <img src="{{ '/images/writing/uncensoring_layer_plots/layer_20_position_-1_pca.png' | relative_url }}" alt="PCA scatter plot of last-token hidden states at layer 20, with censorship examples in blue and no-censorship examples in red." />
    <figcaption>
      PCA of hidden states at layer 20.
    </figcaption>
  </figure>
</div>

I then project out these vectors  at  each token, similar to Arditi et al. [7](#ref-7) (Equation 4). This leads to a 50% reduction in political censorship (from 68% to 35%) on the test set. For some successful examples of the removal of political censorship, see the examples on the previous page. While this is a small test set, this provides an indication that we can combat political censorship in LLMs via this simple technique. 

 While formulating my criterion for political censorship, I became interested in whether or not removing this direction would affect the likelihood of the model refusing to answer in general. I selected 60 prompts from the ‘harmful’ dataset from Arditi et al. [7](#ref-7) where the model would refuse to respond. I keep 40 of these prompts as a training set. and add  40 ‘harmless prompts to compute the ‘refusal’ direction, following the same methodology as for the ‘political censorship’ direction. 

To see whether or not these directions overlap, I compute their cosine similarity per layer. For the latter layers, there is a relatively high positive cosine similarity, and earlier there is a relatively high negative cosine similarity. In both cases, this implies that when we project out the ‘refusal’ direction, we also project out part of the ‘political censorship’ direction (since the sign of the direction is irrelevant)

<figure class="post-figure">
  <img src="{{ '/images/writing/uncensoring_cosine_plot.png' | relative_url }}" alt="Line plot of cosine similarity between the refusal and political censorship directions across the 23 layers of Qwen 1.8B." />
  <figcaption>
    Cosine similarity between the refusal and political censorship directions across layers in Qwen 1.8B.
  </figcaption>
</figure>


 to further validate that the ‘political censorship’ direction and ‘refusal’ direction, I check whether or not projecting out the refusal direction leads to a reduction in political censorship. Projecting out this direction leads to a similar reduction in political censorship ([Figure A](#fig-key-results)). This likely is because our definition of political censorship includes the unwillingness to answer certain prompts. 

In addition, if we remove the ‘political censorship’ direction, it also becomes more likely to respond to harmful prompts (see [Figure B](#fig-key-results)), although the refusal rate decreases much more after removing the ‘refusal’ direction. This implies that (at least for this methodology) there is somewhat of a trade-off between removing political censorship and the refusal rate to harmful prompts. This provides an interesting avenue for future research: how can we disentangle the likelihood an LLM does not respond to harmful prompts from the likelihood that it engages in censorship on controversial political topics? 

There are several obvious limitations to this idea, such as the small datasets used, and its narrow focus on censorship on controversial topics for a Chinese LLM. In addition, the results now strongly rely on my own interpretation of responses by the LLM, and the set of prompts I have crafted. While I have tried to be objective here, future work should consider a much more sound methodology in terms of creating prompts and encoding responses. In the future, I would like to consider methods to automate the measurement of censorship to ensure scalability.



<ol class="reference-list">
  <li id="ref-1"><a href="https://www.wired.com/story/deepseek-censorship/">https://www.wired.com/story/deepseek-censorship/</a></li>
  <li id="ref-2"><a href="https://www.sciencedirect.com/science/article/pii/S0736585324001151">https://www.sciencedirect.com/science/article/pii/S0736585324001151</a></li>
  <li id="ref-3"><a href="https://www.geopolitechs.org/p/whats-in-chinas-new-national-standard">https://www.geopolitechs.org/p/whats-in-chinas-new-national-standard</a></li>
  <li id="ref-4"><a href="https://arxiv.org/pdf/2101.09294">https://arxiv.org/pdf/2101.09294</a></li>
  <li id="ref-5"><a href="https://arxiv.org/abs/2406.18841">https://arxiv.org/abs/2406.18841</a></li>
  <li id="ref-6"><a href="https://www.perplexity.ai/nl/hub/blog/open-sourcing-r1-1776">https://www.perplexity.ai/nl/hub/blog/open-sourcing-r1-1776</a></li>
  <li id="ref-7"><a href="https://arxiv.org/pdf/2406.11717">https://arxiv.org/pdf/2406.11717</a></li>
  <li id="ref-8"><a href="https://arxiv.org/abs/2212.03827">https://arxiv.org/abs/2212.03827</a></li>
  <li id="ref-9"><a href="https://huggingface.co/blog/leonardlin/chinese-llm-censorship-analysis">https://huggingface.co/blog/leonardlin/chinese-llm-censorship-analysis</a></li>
  <li id="ref-10"><a href="https://huggingface.co/Qwen/Qwen-1_8B">https://huggingface.co/Qwen/Qwen-1_8B</a></li>
</ol>
