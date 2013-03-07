# toc

Linkify HTML headers and generate a TOC.

## Getting Started
Install the module with: `npm install toc`

```js
var toc = require('toc');
```

## Documentation

### toc.untag
Strip HTML tags from a string.

```js
var stripped = toc.untag(html);
```

### toc.anchor
Convert a string of text into something URL-friendly and not too fugly.

```js
var anchor = toc.anchor(arbitraryText);
```


### toc.unique
Get a unique name and store the returned name in names for future unique-name-gettingness.

```js
var names = {};
var guaranteedUniqueAnchor1 = toc.unique(names, toc.anchor(arbitraryText));
var guaranteedUniqueAnchor2 = toc.unique(names, toc.anchor(arbitraryText));
```


### toc.process

```js
var htmlWithAnchorsAndTOC = toc.process(html [, options]);
```

#### options

* **tocMin** - `Number` - Min header level to add to TOC. Defaults to `2`.
* **tocMax** - `Number` - Max header level to add to TOC. Defaults to `6`.
* **anchorMin** - `Number` - Min header level to anchorize. Defaults to `2`.
* **anchorMax** - `Number` - Max header level to anchorize. Defaults to `6`.
* **header** - `String` | `Function` - Lodash template string or function used to anchorize a header.
* **toc** - `String` | `Function` - Lodash template string or function used to wrap the generated TOC.
* **openUL** - `String` | `Function` - Lodash template string or function used to generate the TOC.
* **closeUL** - `String` | `Function` - Lodash template string or function used to generate the TOC.
* **openLI** - `String` | `Function` - Lodash template string or function used to generate the TOC.
* **closeLI** - `String` | `Function` - Lodash template string or function used to generate the TOC.
* **placeholder** - `RegExp` - Used to match TOC placeholder. Defaults to `/<!--\s*toc\s*-->/gi`.


## Examples

You can customize the hell out of the generated HTML, eg.

```js
var htmlWithAnchorsAndTOC = toc.process(html, {
  header: '<h<%= level %><%= attrs %> id="<%= anchor %>"><%= header %></h<%= level %>>',
  toc: '<div class="toc"><%= toc %></div>',
  openUL: '<ul data-depth="<%= depth %>">',
  closeUL: '</ul>',
  openLI: '<li data-level="H<%= level %>"><a href="#<%= anchor %>"><%= text %></a>',
  closeLI: '</li>',
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 "Cowboy" Ben Alman  
Licensed under the MIT license.
