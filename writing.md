---
layout: default
title: Writing
permalink: /writing/
---

<section class="writing-index">
  <h2>Writing beyond the training set</h2>
  <p class="writing-intro">
    I use this place to write short posts about things I find interesting or learned throughout my training set (research). I do this because 
     the process of writing helps to better understand these concepts, and 
     I hope that someone else might find it useful. 
  </p>

  {% assign posts = site.writing | sort: "date" | reverse %}
  {% if posts.size > 0 %}
    <div class="post-list">
      {% for post in posts %}
        <article class="post-card">
          <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
          <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
          {% if post.excerpt %}
            <p>{{ post.excerpt | strip_html | truncate: 180 }}</p>
          {% endif %}
          <a class="read-more" href="{{ post.url | relative_url }}">Read post</a>
        </article>
      {% endfor %}
    </div>
  {% else %}
    <p>No posts published yet.</p>
  {% endif %}
</section>
