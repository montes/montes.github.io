---
layout: post
title: "Free movie conversion for iPad"
date: 2014-06-27 17:00:00 +0100
thumbnail: "2014-05-27-free-movie-conversion-for-ipad.jpg"
categories:
    - apple
comments: true    
---
Do you have movies that you want to see in your iPad with the best quality/compression? Aren't you afraid of OSX terminal? Then let's go to learn something new!

If you still don't have installed brew on your Mac, start with that: [http://brew.sh/](http://brew.sh/)

And after install brew, we must install _ffmpeg_, this is the tool we'll use for conversion:

{%- highlight bash -%}
sudo brew install ffmpeg
{%- endhighlight -%}

Now we must download ffmpeg presets from here: [https://web.archive.org/web/20161023155542/https://github.com/joeyblake/FFmpeg-Presets](https://web.archive.org/web/20161023155542/https://github.com/joeyblake/FFmpeg-Presets)

And we are ready to go, with the next two command lines we'll be able to have mp4 iPad ready from our avi files (**update filenames with your own**):

{%- highlight bash -%}
ffmpeg -vsync 1 -y -i "pelicula.avi" -an -vcodec libx264 -vf scale="640:trunc(ow/a/2)*2" -vpre libx264-medium_firstpass -threads 0 -b 400k pelicula.mp4 -pass 1
ffmpeg -vsync 1 -y -i "pelicula.avi" -ab 48k -vcodec libx264 -vf scale="640:trunc(ow/a/2)*2" -metadata artist="montesjmm\!" -acodec libfaac -vpre libx264-medium -threads 0 -b 400k pelicula.mp4 -pass 2
{%- endhighlight -%}
