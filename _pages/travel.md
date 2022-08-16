---
layout: page
title: Travel memory-bank
permalink: /travel
comments: true
---

<div class="row justify-content-between">
    <div class="col-md-8 pr-5">
        <h4>Nature | Experiences | Food | New Learnings</h4>
        <iframe src="https://www.google.com/maps/d/embed?mid=14Js7Bv6-EkVJpzuRJL5sTxqs25zjgjK6&ehbc=2E312F" width="100%" height="800"></iframe>
        {% for post in site.posts %}
            <div id="{{ post.hash }}">
                {% if post.hidden == false and post.categories[0] == "Travel" %}
                    {% include postlistboxtravel.html %}
                {% endif %}
            </div>
        {% endfor %}
    </div>
    <div class="col-md-4 pr-3">
        <h4>
            Travel Collage
        </h4>
        {% include imageCollage/imageCollage.html %}
    </div>
</div>