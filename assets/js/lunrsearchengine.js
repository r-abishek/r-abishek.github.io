---
layout: null
sitemap: false
---

{% assign counter = 0 %}
var documents = [{% for page in site.pages %}{% if page.url contains '.xml' or page.url contains 'assets' or page.url contains 'category' or page.url contains 'tag' %}{% else %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '</h3>', ': ' | replace: '</h4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}",
    "image": "",
    "date": "",
    "category": "",
    "type": "page"{% assign counter = counter | plus: 1 %}
    }, {% endif %}{% endfor %}{% for page in site.without-plugin %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '</h3>', ': ' | replace: '</h4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}",
    "image": "",
    "date": "",
    "category": "",
    "type": "page"{% assign counter = counter | plus: 1 %}
    }, {% endfor %}{% for page in site.posts %}{
    "id": {{ counter }},
    "url": "{{ site.url }}{{site.baseurl}}{{ page.url }}",
    "title": "{{ page.title }}",
    "body": "{{ page.date | date: "%Y/%m/%d" }} - {{ page.content | markdownify | replace: '.', '. ' | replace: '</h2>', ': ' | replace: '</h3>', ': ' | replace: '</h4>', ': ' | replace: '</p>', ' ' | strip_html | strip_newlines | replace: '  ', ' ' | replace: '"', ' ' }}",
    "image": "{% if page.image1 %}{% if page.image1 contains "://" %}{{ page.image1 }}{% else %}{{ site.baseurl }}/{{ page.image1 }}{% endif %}{% else %}{{ site.baseurl }}/assets/images/dpedit04.png{% endif %}",
    "date": "{{ page.date | date: "%B %d, %Y" }}",
    "category": "{% if page.categories[0] %}{{ page.categories[0] }}{% endif %}",
    "type": "post"{% assign counter = counter | plus: 1 %}
    }{% if forloop.last %}{% else %}, {% endif %}{% endfor %}];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
// Live search functionality
var searchTimeout;
var isSearchVisible = false;

function lunr_search(term) {
    // Legacy function for form submission - redirect to live search
    if (term && term.trim()) {
        performLiveSearch(term.trim());
        showSearchResults();
    }
    return false;
}

function performLiveSearch(term) {
    if (!term || term.length < 2) {
        hideSearchResults();
        return;
    }

    var results = idx.search(term + '*'); // Add wildcard for partial matching
    var searchResults = document.getElementById('search-dropdown-results');
    
    if (results.length > 0) {
        var html = '';
        var maxResults = Math.min(results.length, 6); // Limit to 6 results
        
        for (var i = 0; i < maxResults; i++) {
            var ref = results[i]['ref'];
            var doc = documents[ref];
            var title = doc.title;
            var body = doc.body.substring(0, 120) + '...';
            var image = doc.image;
            var date = doc.date;
            var category = doc.category;
            var type = doc.type;
            
            html += '<div class="search-result-item" onclick="window.location.href=\'' + doc.url + '\'">';
            html += '  <div class="search-result-image">';
            html += '    <img src="' + image + '" alt="' + title + '" onerror="this.src=\'{{ site.baseurl }}/assets/images/dpedit04.png\'">';
            html += '  </div>';
            html += '  <div class="search-result-content">';
            html += '    <div class="search-result-title">' + title + '</div>';
            if (type === 'post' && (date || category)) {
                html += '    <div class="search-result-meta">';
                if (category) html += '<span class="search-result-category">' + category + '</span>';
                if (date) html += '<span class="search-result-date">' + date + '</span>';
                html += '    </div>';
            }
            html += '    <div class="search-result-excerpt">' + body + '</div>';
            html += '  </div>';
            html += '</div>';
        }
        
        if (results.length > 6) {
            html += '<div class="search-result-more">+ ' + (results.length - 6) + ' more results</div>';
        }
        
        searchResults.innerHTML = html;
    } else {
        searchResults.innerHTML = '<div class="search-result-empty">No results found for "' + term + '"</div>';
    }
}

function showSearchResults() {
    var dropdown = document.getElementById('search-dropdown');
    dropdown.style.display = 'block';
    isSearchVisible = true;
}

function hideSearchResults() {
    var dropdown = document.getElementById('search-dropdown');
    dropdown.style.display = 'none';
    isSearchVisible = false;
}

function setupLiveSearch() {
    var searchInput = document.getElementById('lunrsearch');
    var searchContainer = document.querySelector('.search-container');
    
    if (!searchInput) return;
    
    // Create dropdown structure
    if (!document.getElementById('search-dropdown')) {
        var dropdown = document.createElement('div');
        dropdown.id = 'search-dropdown';
        dropdown.className = 'search-dropdown';
        dropdown.innerHTML = '<div id="search-dropdown-results"></div>';
        searchContainer.appendChild(dropdown);
    }
    
    // Input event for live search
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        var term = e.target.value.trim();
        
        if (term.length >= 2) {
            searchTimeout = setTimeout(function() {
                performLiveSearch(term);
                showSearchResults();
            }, 300); // Debounce search
        } else {
            hideSearchResults();
        }
    });
    
    // Focus event
    searchInput.addEventListener('focus', function(e) {
        var term = e.target.value.trim();
        if (term.length >= 2) {
            showSearchResults();
        }
    });
    
    // Click outside to close
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideSearchResults();
        }
    });
    
    // Escape key to close
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
        }
    });
}
    
$(function() {
    // Initialize live search when document is ready
    setupLiveSearch();
    
    // Legacy modal close handler (kept for compatibility)
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide( 5 );
        $( "body" ).removeClass( "modal-open" );
    });
});