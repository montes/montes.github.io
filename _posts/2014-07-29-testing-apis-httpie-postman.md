---
layout: post
title: "Testing APIs, HTTPie y Postman"
date: 2014-07-29 17:00:00 +0100
thumbnail: "2014-07-29-testing-apis-httpie-postman.jpg"
categories:
    - testing
comments: true    
---
Do you do some API testing? some http stuff? If you didn’t know these tools before, you are going to be very happy today!

## HTTPie

[HTTPie](http://www.httpie.org/) is a command-line tool for Windows/Mac/Linux written in Python, is something like a simpler [curl](http://curl.haxx.se/), you type “http” followed by an URL and the magic starts, you can see the answer, headers, parameters, request type…

Better we see an example, let’s try Twitter’s API:

![HTTPie]({{ "/assets/images/testing-apis-httpie-postman-1.png" | absolute_url }})

oops! it seems we have a problem with authentication 😉

Then let’s test Google Maps’ API:

![HTTPie]({{ "/assets/images/testing-apis-httpie-postman-2.png" | absolute_url }})

Better luck now!

You have a lot of examples at [httpie’s github](https://github.com/jakubroztocil/httpie) and the accepted parameters documentation.

## Postman

HTTPie is OK for a lot of jobs, but for an intense API testing our best friend is [Postman](http://www.getpostman.com/), an awesome tool to use right into Google Chrome.

Postman is a Google Chrome extension that will help us with APIs, saving request history, selecting request type, authentification, headers, files… really easy to use and powerful.

This is an example of use, at the right we have the form where we set the options for the next request and at the left the request history.

![Postman]({{ "/assets/images/testing-apis-httpie-postman-3.png" | absolute_url }})

If you know any other tool to test APIs write a comment! 😉
