/*
 * toc
 * https://github.com/cowboy/node-toc
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

var toc = exports;

// Strip HTML tags from a string.
toc.untag = function(s) {
  return s.replace(/<[^>]*>/g, '');
};

// Convert a string of text into something URL-friendly and not too fugly.
toc.anchor = function(s) {
  var slug = require('slug');
  var entities = require('entities');

  s = toc.untag(s);
  s = s.toLowerCase();
  s = entities.decode(s);
  s = s.replace(/['"]/g, '');
  s = slug(s);
  s = s.replace(/^-+|-+$/g, '');
  return s;
};

// Get a unique name and store the returned name in names for future
// unique-name-gettingness.
toc.unique = function(names, name) {
  var result = name;
  var count = 0;
  while (names[result]) {
    result = name + (--count);
  }
  names[result] = true;
  return result;
};

// Default options.
toc.defaults = {
  // Min and max headers to add to TOC.
  tocMin: 2,
  tocMax: 6,
  // Min and max headers to anchorize.
  anchorMin: 2,
  anchorMax: 6,
  // Anchorized header template.
  header: '<h<%= level %><%= attrs %>><a href="#<%= anchor %>" name="<%= anchor %>"><%= header %></a></h<%= level %>>',
  // Main TOC template.
  toc: '<div class="toc"><%= toc %></div>',
  // TOC part templates.
  openUL: '<ul>',
  closeUL: '</ul>',
  openLI: '<li><a href="#<%= anchor %>"><%= text %></a>',
  // openLI: '<li><a href="#<%= anchor %>"><%= text %></a> (<%= depth %> / H<%= level %>)',
  closeLI: '</li>',
  // RegExp to replace with generated TOC.
  placeholder: /<!--\s*toc\s*-->/gi,
};

// Match some headers and all their contents.
var headersRe = /<h(\d)(\s*[^>]*)>([\s\S]+?)<\/h\1>/gi;

// Process HTML.
toc.process = function(html, options) {
  // Options override toc methods and toc defaults.
  options = _.defaults({}, options, toc, toc.defaults);
  delete options.defaults;
  delete options.process;

  // Compile string templates into functions.
  var templates = ['header', 'toc', 'openUL', 'closeUL', 'openLI', 'closeLI'];
  templates.forEach(function(prop) {
    if (typeof options[prop] === 'string') {
      options[prop] = _.template(options[prop]);
    }
  });

  var datas = [];

  // Process all headers.
  var names = {};
  html = html.replace(headersRe, function(all, level, attrs, header) {
    level = Number(level);
    var data = {
      level: level,
      attrs: attrs,
      header: header,
      text: options.untag(header),
      anchor: options.unique(names, options.anchor(header)),
    };
    if (level >= options.tocMin && level <= options.tocMax) {
      datas.push(data);
    }
    if (level >= options.anchorMin && level <= options.anchorMax) {
      return options.header(data);
    } else {
      return all;
    }
  });

  // Build TOC.
  var cursor = 0;
  var levels = [];
  var htmls = [''];
  datas.forEach(function(data) {
    while (data.level < levels[0]) {
      levels.shift();
      cursor++;
    }
    if (levels.length === 0 || data.level > levels[0]) {
      levels.unshift(data.level);
      data.depth = levels.length;
      htmls[cursor] += options.openUL(data);
      htmls.push(options.closeLI(data) + options.closeUL(data));
    } else {
      data.depth = levels.length;
      htmls[cursor] += options.closeLI(data);
    }
    htmls[cursor] += options.openLI(data);
  });

  // Actually stick the TOC somewhere.
  html = html.replace(options.placeholder, options.toc({toc: htmls.join('')}));

  return html;
};
