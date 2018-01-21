---
layout: post
title:  "Sublime Text 2: Bracket Highlighter"
date:   2012-09-19 20:01:15 +0100
thumbnail: "2012-09-19-sublime-text-2-bracket-highlighter.jpg"
categories:
    - frontend
comments: true    
---
[Bracket Highlighter][bracket-highlighter] is a very nice Sublime Text 2 plugin that does exactly what it’s name suggest, here is an example:

![Bracket Highlighter]({{ "/assets/images/bracket-highlighter-1.png" | absolute_url }})

But customizing colors is a bit complicated task, so I’ve written down how to customize colors in “Bracket Highlighter”:

Go to “Sublime Text 2 -> Preferences -> Package Settings -> Bracket Highlighter -> Settings – User”

![Bracket Highlighter]({{ "/assets/images/bracket-highlighter-2.png" | absolute_url }})

Paste this, save & close:

{% highlight javascript %}
{
    "quote_scope" : "bracket.quote",
    "curly_scope" : "bracket.curly",
    "round_scope" : "bracket.round",
    "square_scope": "bracket.square",
    "angle_scope" : "bracket.angle",
    "tag_scope"   : "bracket.tag"
}
{% endhighlight %}

Go to “Sublime Text 2 -> Preferences -> Browse Packages“, then in “Color Scheme – Default” folder open your theme file (Monokai in my case)

![Bracket Highlighter]({{ "/assets/images/bracket-highlighter-3.png" | absolute_url }})

Add this at the end of the file, just before “</array>” (and customize as you want)

{% highlight xml %}
<dict>
    <key>name</key>
    <string>Bracket quote</string>
    <key>scope</key>
    <string>bracket.quote</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#F00</string>
        <key>foreground</key>
        <string>#FFF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket curly</string>
    <key>scope</key>
    <string>bracket.curly</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#0F0</string>
        <key>foreground</key>
        <string>#000</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket round</string>
    <key>scope</key>
    <string>bracket.round</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#00F</string>
        <key>foreground</key>
        <string>#FFF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket square</string>
    <key>scope</key>
    <string>bracket.square</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#FF0</string>
        <key>foreground</key>
        <string>#FFF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket angle</string>
    <key>scope</key>
    <string>bracket.angle</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#0FF</string>
        <key>foreground</key>
        <string>#FFF</string>
    </dict>
</dict>
<dict>
    <key>name</key>
    <string>Bracket tag</string>
    <key>scope</key>
    <string>bracket.tag</string>
    <key>settings</key>
    <dict>
        <key>background</key>
        <string>#FFF</string>
    </dict>
</dict>
{% endhighlight %}

[bracket-highlighter]: https://github.com/facelessuser/BracketHighlighter
