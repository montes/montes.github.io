---
layout: post
title: "Our own git remote repository with Gitosis and Debian"
date: 2011-11-05 17:00:00 +0100
thumbnail: "2011-11-05-git-remote-repository-gitosis-debian.jpg"
categories:
    - sysadmin
    - git
---
There are many options for having a private remote git repository on the internet like for example Github, that is free for public repositories but not for private ones.

We can pay for one of this services or if we already have a server for our web, why not using it also for our repositories? Here is where Gitosis is going to help, we'll be able to have unlimited private repositories with group access control.

## Installing Gitosis on Debian

Although there are multiple tutorials through the internet for doing this, I haven't been able to find one that covers the whole process. The next steps are the result of testing multiple solutions and applying the best mix.

### 1. Install python-setuptools and download Gitosis

On the server

{%- highlight bash -%}
aptitude install python-setuptools
{%- endhighlight -%}

And download Gitosis (clone it from its Git repository)

{%- highlight bash -%}
cd /data/temp
git clone git://eagain.net/gitosis
{%- endhighlight -%}

(also available from https://github.com/res0nat0r/gitosis)

### 2. Install gitosis

Be careful with "_--home /data/git_" parameter, here you must set git user's home, that is where repositories will be written.

{%- highlight bash -%}
python setup.py install
adduser --system --shell /bin/sh --gecos 'git version control' --group --disabled-password --home /data/git git
{%- endhighlight -%}

### 3. Generate a RSA public key on our local computer

After installing Gitosis on the server, now we need to generate a public key on our local development computer.

On Linux and Mac:

{%- highlight bash -%}
ssh-keygen -t rsa
{%- endhighlight -%}

This will generate public and private keys on our user folder, we need the public one, at "_/home/usuario/.ssh/id_rsa.pub_" on Linux or at "_/Users/usuario/.ssh/id_rsa.pub_" on OSX.

### 4. Install our public key on the server

Back to the server and having uploaded our public key (by ftp for example).

We will need "sudo" that is not installed by default on Debian:

{%- highlight bash -%}
aptitude install sudo
{%- endhighlight -%}

We setup Gitosis with our user as admin (giving it our public key path that in our example is at "_/tmp/id_rsa.pub_")

{%- highlight bash -%}
sudo -H -u git gitosis-init < /tmp/id_rsa.pub
{%- endhighlight -%}

And to finish we mark "_post-update_" as executable for all users.

{%- highlight bash -%}
sudo chmod 755 /data/git/repositories/gitosis-admin.git/hooks/post-update
{%- endhighlight -%}

### 5. Bonus track: Redmine or any web front for Git on the server.

If we are going to use Redmine or any other web viewer for git repositories we'll need to include apache's user "_www-data_" in git's group so it'll be able to access to our repositories.

{%- highlight bash -%}
usermod -a -G git www-data
{%- endhighlight -%}

### 6. We are ready, our first push

And we only need to clone the Gitosis config repository and we will be able to setup permission groups. (change myserver.com by your own server)

{%- highlight bash -%}
git clone git@myserver.com:gitosis-admin.git
{%- endhighlight -%}

and now we can open gitosis config file to add some repositories permissions

{%- highlight bash -%}
cd gitosis-admin
vim gitosis.conf
{%- endhighlight -%}

we'll add "montes" repository as writable

{%- highlight ini -%}
[gitosis]
  [group gitosis-admin]
  writable = gitosis-admin montes
  members = yo@gmail.com
{%- endhighlight -%}

and save and push

{%- highlight bash -%}
git commit -a -m "Giving write permission on montes repository for gitosis-admin group"
git push
{%- endhighlight -%}

With this we have given write permissions on "montes" repository (that still doesn't exist) to our user yo@gmail.com that is the owner of the public key we generated before.

We only have to create the repository on our local computer

{%- highlight bash -%}
cd ..
mkdir montes
cd montes
git init
{%- endhighlight -%}

Add remote

{%- highlight bash -%}
git remote add origin git@miservidor.com:montes
{%- endhighlight -%}

and our first push!

{%- highlight bash -%}
git add .
git commit -a -m "Primer commit!"
git push miservidor master
{%- endhighlight -%}

and we are finish!
