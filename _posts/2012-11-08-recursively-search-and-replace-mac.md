---
layout: post
title: "Recursively search & replace that works on mac"
date: 2012-11-08 17:00:00 +0100
thumbnail: "2012-11-08-recursively-search-and-replace-mac.jpg"
categories:
    - apple
comments: true
redirect_from: /apple/2012/11/08/recursively-search-and-replace-mac.html
redirect_to: https://webdevjuice.com/recursively-search-replace-that-works-on-mac/
---
After testing a lot of combinations, at last one that works perfect!

tested on OSX 10.8.2 + iTerm + zsh

{%- highlight bash -%}
find . -name "*.html" -print0 | xargs -0 sed -i '' -e 's/search/replace/g'
{%- endhighlight -%}

(from: [this superuser.com question](http://superuser.com/questions/428493/how-can-i-do-a-recursive-find-and-replace-from-the-command-line))
