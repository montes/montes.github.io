---
layout: post
title: "Learning a functional language: Erlang"
date: 2014-08-13 17:00:00 +0100
thumbnail: "2014-08-13-learning-functional-language-erlang.jpg"
categories:
    - erlang

---
Last years I’ve had some contact with Ruby, Python or Objective C, but it never has been something more than a first contact, it’s now since assisting to the WeLovePHP talks at [Softonic](https://www.softonic.com/) (Barcelona) when my interest for a more serious approach to functional languages has come. After some days reading about functional languages Erlang was the chosen, maybe because the hype of this days because of being [used at Facebook](http://www.quora.com/Why-was-Erlang-chosen-for-use-in-Facebook-chat), at [Amazon](http://en.wikipedia.org/wiki/Amazon_SimpleDB), or [Whatsapp](http://www.fastcolabs.com/3026758/inside-erlang-the-rare-programming-language-behind-whatsapps-success), or maybe because some of it’s unique characteristics.

Other functional languages I was considering:

Scala
: Runs on the JVM, access to java libraries, strongly typed, combines functional language with object oriented.

Clojure
: Runs on the JVM, access to java libraries.

Haskell
: Strong static typed.

Some info on Erlang
-------------------

Framework
: [OTP](http://learnyousomeerlang.com/what-is-otp), it comes bundled with Erlang

Web Framework
: [Chicago Boss](https://github.com/ChicagoBoss/ChicagoBoss) is probably the most important

Databases
: We can use relational databases as MySQL through [Erlang ODBC](http://www.erlang.org/doc/man/odbc.html), there are also NoSQL databases created with Erlang, as [CouchDB](http://couchdb.apache.org/) or [Riak](http://basho.com/riak/)

Install Erlang
--------------

Erlang can be installed on Mac (my notebook is a Macbook), but I choose installing it on an Ubuntu’s virtual machine that I already have for Laravel testing. In this case it installs really ease using the terminal, in [Erlang Solutions](https://www.erlang-solutions.com/downloads/download-erlang-otp#tabs-ubuntu) there are the instructions for installing on any Operating System.

Ubuntu (probably Debian is the same) Erlang installation:

{%- highlight bash -%}
wget http://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb
sudo dpkg -i erlang-solutions_1.0_all.deb
{%- endhighlight -%}

{%- highlight bash -%}
wget http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc
sudo apt-key add erlang_solutions.asc
{%- endhighlight -%}

{%- highlight bash -%}
sudo apt-get update
sudo apt-get install erlang
{%- endhighlight -%}

and only with this, we already have the Erlang interpreter working!

![Erlang]({{ "/assets/images/learning-functional-language-erlang-1.png" | absolute_url }})

First steps with the Erlang shell
---------------------------------

### Variable assignment

In Erlang variables can be assigned only once

![Erlang]({{ "/assets/images/learning-functional-language-erlang-2.png" | absolute_url }})

if we try to change it’s value after assign it for the first time, we’ll get an error. Other important thing in Erlang is that the expressions are finished with a dot “.”

![Erlang]({{ "/assets/images/learning-functional-language-erlang-3.png" | absolute_url }})

The “b()” function will show us the variables already assigned:

![Erlang]({{ "/assets/images/learning-functional-language-erlang-4.png" | absolute_url }})

Functions
---------

A simple function in Erlang would be for example to divide any amount by the half:

{%- highlight erlang -%}
TheHalf = fun(Amount) -> Amount / 2 end.
{%- endhighlight -%}

And to call the function:

{%- highlight erlang -%}
TheHalf(5).
{%- endhighlight -%}

On Erlang shell would be something like this:

![Erlang]({{ "/assets/images/learning-functional-language-erlang-5.png" | absolute_url }})

Did you test Erlang? Did you choose any different functional language? leave your comment!!!
