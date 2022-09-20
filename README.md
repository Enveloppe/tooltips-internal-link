# Tooltips internal links

This little script allow you to "preview" your internal links, using the [TippyJS](https://atomiks.github.io/tippyjs/) Library, ala Wikipedia hovering, or like in Obsidian, for a [material mkdocs](https://squidfunk.github.io/mkdocs-material/) wiki.

Its allow :
- Pop-hover footnote ;
- Link directly a preview of a part of the text using an anchor (title)
- Preview the entire file

Note : Link a particular part of the text doesn't work (ie it doesn't support Obsidian block-id). You need to link a title or a footnote.

Some preview :

![image](https://user-images.githubusercontent.com/30244939/191234915-d1740a94-74c2-4b4b-9f32-520ddecd72e1.png)
![image](https://user-images.githubusercontent.com/30244939/191234951-d247e3e0-39ef-4c69-9462-527eabbe35d2.png)
![image](https://user-images.githubusercontent.com/30244939/191235464-cc0df5fc-4a3e-4f5b-b4ec-97b71a58f3c1.png)

→  See a [Live Preview](https://obsidian-publisher.netlify.app/)
---

## Installation

First, you need to add [wiki_hover.js]() & [tippy.css]() in your assets (`assets/js` & `assets/css`) and edit your `mkdocs.yml` according :
```yaml
extra_javascript:
  - assets/js/wiki_hover.js
extra_css:
  - assets/css/tippy.css
```

The second steps is to override your `main.html`. For more information about [overriding template, check the material Mkdocs documentation](https://squidfunk.github.io/mkdocs-material/customization/#overriding-partials).

So, you need :
1. To create an `overrides` folder
2. Add it to your `mkdocs.yml` in `theme[custom_dir]` as follow :
	```yml
	theme:
		name: 'material'
		# keep the other things here !
	    custom_dir: overrides
	```
3. Create a `main.html` in `overrides`, with adding this contents :
```html
{% extends "base.html" %}

{% block extrahead %}
  <script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
  <script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/animations/scale-subtle.css"/>
  <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/translucent.css"/>
{% endblock %}
```

Now, normally, your good !
