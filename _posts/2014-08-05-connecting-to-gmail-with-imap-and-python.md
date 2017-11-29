---
layout: post
title: "Connecting to Gmail with IMAP and Python"
date: 2014-08-05 17:00:00 +0100
thumbnail: "2014-08-05-connecting-to-gmail-with-imap-and-python.jpg"
---
## Solving a problem: "auto emails" to remind URLs

I've found myself lots of times sending emails to myself to remind interesting URLs, forgetting to save many of them, and not being able to recover them when I need them.

The solution to this problem that came to my mind was automating the saving URL part, so I'll be able to send URLs to myself and the URLs _will organize by their own_ if I use a common format, something like this:

Email subject: d>travels
Email body: https://www.manytravels.com

This would save www.manytravels.com to "travels" Delicious category.

## Connecting to GMail

I use GMail but I wanted to use something more universal than GMail API, so I chose IMAP to connect to GMail.  

Python has an IMAP library: [imaplib](https://web.archive.org/web/20161023155706/https://docs.python.org/2/library/imaplib.html) that allows us to IMAP very easily, connecting to GMail is:

{%- highlight python -%}
def connect_to_gmail(username, password):
    imap = imaplib.IMAP4_SSL('imap.gmail.com')
    imap.login(username, password)
    imap.select("inbox")

    return imap
{%- endhighlight -%}

## Reading last unread emails

After connecting to GMail we need to get newer emails and check if there is any that meet our format, something like:

{%- highlight python -%}
imap = connect_to_gmail(gmail_username, gmail_password)
result, mails_data = imap.search(None, "(UNSEEN)")

mails_ids = mails_data[0]
mails_id_list = mails_ids.split()

mail_count = 40
for i in reversed(mails_id_list):
    mail_count -= 1
    if mail_count < 1:
        break
{%- endhighlight -%}

with this we go through last 40 unread emails without doing anything more.

## Checking emails titles

Things are going more complicated now, mainly because of text encodings.

first we get the email through Python [email](https://web.archive.org/web/20161023155706/https://docs.python.org/2/library/email.html) library, "i" is the email ID

{%- highlight python -%}
result, mail_data = imap.fetch(i, "(RFC822)")
raw_email = mail_data[0][1]
this_email = email.message_from_string(raw_email)
{%- endhighlight -%}

And then, getting the perfect UTF-8 encoded email:

{%- highlight python -%}
from email.header import decode_header
from email.header import make_header

def get_subject(email):
    h = decode_header(email.get('subject'))
    return unicode(make_header(h)).encode('utf-8')
{%- endhighlight -%}

Now we can integrate everything into the emails loop

{%- highlight python -%}
imap = connect_to_gmail(gmail_username, gmail_password)
result, mails_data = imap.search(None, "(UNSEEN)")

mails_ids = mails_data[0]
mails_id_list = mails_ids.split()

mail_count = 40
for i in reversed(mails_id_list):
    result, mail_data = imap.fetch(i, "(RFC822)")
    raw_email = mail_data[0][1]
    this_email = email.message_from_string(raw_email)

    print get_subject(this_email)

    mail_count -= 1
    if mail_count < 1:
        break
{%- endhighlight -%}

## Reading email body

Things get even more complicated with email body, if there were problems with title encoding with body encoding it gets worst with MIME and multipart joining the party.

The best solution I found was on a [gist](https://gist.github.com/miohtama/5389146) from [Mikko Ohtamaa](https://github.com/miohtama)

{%- highlight python -%}
import email

def get_decoded_email_body(message_body):
    """ Decode email body.

    Detect character set if the header is not set.

    We try to get text/plain, but if there is not one then fallback to text/html.

    :param message_body: Raw 7-bit message body input e.g. from imaplib. Double encoded in quoted-printable and latin-1

    :return: Message body as unicode string
    """

    msg = email.message_from_string(message_body)

    text = ""
    if msg.is_multipart():
        html = None
        for part in msg.get_payload():

            print "%s, %s" % (part.get_content_type(), part.get_content_charset())

            if part.get_content_charset() is None:
                # We cannot know the character set, so return decoded "something"
                text = part.get_payload(decode=True)
                continue

            charset = part.get_content_charset()

            if part.get_content_type() == 'text/plain':
                text = unicode(part.get_payload(decode=True), str(charset), "ignore").encode('utf8', 'replace')

            if part.get_content_type() == 'text/html':
                html = unicode(part.get_payload(decode=True), str(charset), "ignore").encode('utf8', 'replace')

        if text is not None:
            return text.strip()
        else:
            return html.strip()
    else:
        text = unicode(msg.get_payload(decode=True), msg.get_content_charset(), 'ignore').encode('utf8', 'replace')
        return text.strip()
{%- endhighlight -%}

## Checking title format and finding the link in the body

We are already connected to GMail and we are already going through new emails reading titles and bodies, so we only need to find emails meeting our specific format to add links to Delicious.

We'll do this using regular expressions.

To find title tag, like "_d>tag_" we'll use:

{%- highlight python -%}
import re

match_subject = re.match(r'd>([^<]+)', subject, re.I | re.S)

if (match_subject):
    tag = match_subject.group(1)
{%- endhighlight -%}

And to find link in the body

{%- highlight python -%}
import re

url = re.match(r'.*?(https?://[\w\d/\.#_\-=\&\?\n\r]+)', body, re.I | re.M | re.DOTALL)

if (url):
    url = ''.join(url.group(1).split())
{%- endhighlight -%}

we use join to get rid of line breaks that can be in the middle

## Saving the link to Delicious

We'll use Delicious API through [urllib2](https://docs.python.org/2/library/urllib2.html) to save URLs to delicious. Before saving to delicious we need to get URL title using also urllib2.

{%- highlight python -%}
req = urllib2.Request(save_url)
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
html = urllib2.urlopen(req)

if (html):
    html = html.read()
if (html):
    match_title = re.match(r'.*?<title>(.*?)</title>', html, re.I | re.M | re.DOTALL)
    title = match_title.group(1)
    title = title.decode('utf-8')
    title = normalize('NFD', unicode(title)).encode('ascii', 'ignore')
{%- endhighlight -%}

Having URL title there's only one thing left, saving everything to Delicious

{%- highlight python -%}
def save_to_delicious(save_url, username, password, tag):
    req = urllib2.Request(save_url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
    html = urllib2.urlopen(req)

    if (html):
        html = html.read()
    if (html):
        match_title = re.match(r'.*?<title>(.*?)</title>', html, re.I | re.M | re.DOTALL)
        title = match_title.group(1)
        title = title.decode('utf-8')
        title = normalize('NFD', unicode(title)).encode('ascii', 'ignore')
        delicious_url = "https://api.del.icio.us/v1/posts/add?&shared=no&url=" + urllib.quote_plus(save_url) + "&tags=" + tag + "&description=" + urllib.quote_plus(title.encode('ascii', 'ignore'))
    else:
        delicious_url = "https://api.del.icio.us/v1/posts/add?&shared=no&url=" + urllib.quote_plus(save_url) + "&tags=" + tag

    passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
    passman.add_password(None, delicious_url, username, password)
    urllib2.install_opener(urllib2.build_opener(urllib2.HTTPBasicAuthHandler(passman)))

    req = urllib2.Request(delicious_url)
    urllib2.urlopen(req)
{%- endhighlight -%}

## Leaving emails unread again after sending to trash the matching ones

Removing read flag:
{%- highlight python -%}
imap.store(i, '-FLAGS', r'(\Seen)')
{%- endhighlight -%}

Sending to trash delicious saved emails:
{%- highlight python -%}
imap.copy(i, '[Gmail]/Trash')
imap.store(i, '+FLAGS', r'(\Deleted)')
imap.expunge()
{%- endhighlight -%}

## Final code

{%- highlight python -%}
"""
   Copyright (C) 2014 Javier Montes @montesjmm montesjmm.com
   License: http://opensource.org/licenses/MIT

   What does this script do?

   All of your emails with a subject like:
   "d>tag_name"
   and with an url in the body, will be saved to delicious.com

   In other words, you can save links to delicious simply sending emails
   to yourself!!!! 😉
"""
import imaplib
import email
import re
import urllib
import urllib2
from unicodedata import normalize
from email.header import decode_header
from email.header import make_header

gmail_username = ''
gmail_password = ''
delicious_username = ''
delicious_password = ''


def connect_to_gmail(username, password):
    imap = imaplib.IMAP4_SSL('imap.gmail.com')
    imap.login(username, password)
    imap.select("inbox")

    return imap


# this function from: http://i2bskn.hateblo.jp/entry/20120322/1332421932
def get_subject(email):
    h = decode_header(email.get('subject'))
    return unicode(make_header(h)).encode('utf-8')


# this function from: https://gist.github.com/miohtama/5389146
def get_decoded_email_body(message_body):
    """ Decode email body.
    Detect character set if the header is not set.
    We try to get text/plain, but if there is not one then fallback to text/html.
    :param message_body: Raw 7-bit message body input e.g. from imaplib. Double encoded in quoted-printable and latin-1
    :return: Message body as unicode string
    """

    msg = email.message_from_string(message_body)

    text = ""
    if msg.is_multipart():
        html = None
        for part in msg.get_payload():

            #print "%s, %s" % (part.get_content_type(), part.get_content_charset())

            if part.get_content_charset() is None:
                # We cannot know the character set, so return decoded "something"
                text = part.get_payload(decode=True)
                continue

            charset = part.get_content_charset()

            if part.get_content_type() == 'text/plain':
                text = unicode(part.get_payload(decode=True), str(charset), "ignore").encode('utf8', 'replace')

            if part.get_content_type() == 'text/html':
                html = unicode(part.get_payload(decode=True), str(charset), "ignore").encode('utf8', 'replace')

        if text is not None:
            return text.strip()
        else:
            return html.strip()
    else:
        text = unicode(msg.get_payload(decode=True), msg.get_content_charset(), 'ignore').encode('utf8', 'replace')
        return text.strip()


def save_to_delicious(save_url, username, password, tag):
    req = urllib2.Request(save_url)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
    html = urllib2.urlopen(req)

    if (html):
        html = html.read()
    if (html):
        match_title = re.match(r'.*?<title>(.*?)</title>', html, re.I | re.M | re.DOTALL)
        title = match_title.group(1)
        title = title.decode('utf-8')
        title = normalize('NFD', unicode(title)).encode('ascii', 'ignore')
        delicious_url = "https://api.del.icio.us/v1/posts/add?&shared=no&url=" + urllib.quote_plus(save_url) + "&tags=" + tag + "&description=" + urllib.quote_plus(title.encode('ascii', 'ignore'))
    else:
        delicious_url = "https://api.del.icio.us/v1/posts/add?&shared=no&url=" + urllib.quote_plus(save_url) + "&tags=" + tag

    passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
    passman.add_password(None, delicious_url, username, password)
    urllib2.install_opener(urllib2.build_opener(urllib2.HTTPBasicAuthHandler(passman)))

    req = urllib2.Request(delicious_url)
    urllib2.urlopen(req)


imap = connect_to_gmail(gmail_username, gmail_password)
result, mails_data = imap.search(None, "(UNSEEN)")

mails_ids = mails_data[0]
mails_id_list = mails_ids.split()

mail_count = 40
for i in reversed(mails_id_list):

    result, mail_data = imap.fetch(i, "(RFC822)")
    raw_email = mail_data[0][1]
    this_email = email.message_from_string(raw_email)

    subject = get_subject(this_email)
    match_subject = re.match(r'd>([^<]+)', subject, re.I | re.S)

    if (match_subject):
        tag = match_subject.group(1)
        body = get_decoded_email_body(raw_email) + " "

        url = re.match(r'.*?(https?://[\w\d/\.#_\-=\&\?\n\r]+)', body, re.I | re.M | re.DOTALL)

        if (url):
            url = ''.join(url.group(1).split())
            print 'Match found! >' + tag + '>' + url + '<'
            save_to_delicious(url, delicious_username, delicious_password, tag)

            imap.copy(i, '[Gmail]/Trash')
            imap.store(i, '+FLAGS', r'(\Deleted)')
            imap.expunge()

    imap.store(i, '-FLAGS', r'(\Seen)')

    mail_count -= 1
    if mail_count < 1:
        break
{%- endhighlight -%}
