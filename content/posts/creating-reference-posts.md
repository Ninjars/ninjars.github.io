---
title: "Creating Reference Posts with Obsidian"
featured_image: "/images/unsplash/domenico-loia-hGV2TfOh0ns-unsplash.jpg"
date: "2023-01-29"
tags: ["visuals, code"]
draft: true
---
How I turned long lists of Twitter links into web pages of visual references using Obsidian and Kotlin.
<!--more-->
In the dark days immediately after Musk took over Twitter I feared that there was a good chance of the whole site just... 
vanishing - and taking all the cool things I'd seen from the various artists I follow away with it. I'd been keeping a list
with links to tweets of cool or interesting or inspirational things for a while, using [Obsidian](https://obsidian.md/) 
for note-taking in markdown and [DriveSync](https://play.google.com/store/apps/details?id=com.ttxapps.drivesync) to keep
the archive synchronised between phone and computer.

So, given that I had notes in markdown, and I'm using a markdown-based website builder I figured that there might be a
way to plug one into the other and make a more resilient place to hold on to the things that inspire me. With just a little
enforced structure in my notes I realised that I could probably automate extracting the images from tweets and arrange them 
in a page.

I first started with trying to fetch the html web page from the link but realised pretty quickly that using the twitter api
was a better idea. I happened to have a dev account already set up from a hackathon project a few years back so it didn't take
long to get started. Twitter [API v2](https://developer.twitter.com/en/docs/twitter-api)'s Essential tier allows for 500,000
tweet retrievals per month, which should be easily enough for this project for a LONG time! 

All I am really interested in for this project is the [tweets lookup](https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/quick-start) api. 
The core of what I needed to do was first extract the ids of the linked tweets and then use them to build a request 
to the twitter api with params for all the other meta gubbins that I will need to properly reference the content.
{{< highlight html "linenos=table" >}}
    val requestUrl = "https://api.twitter.com/2/tweets?ids=${ids.joinToString(",")}" +
                "&user.fields=id,name,username" +
                "&tweet.fields=author_id,attachments" +
                "&expansions=attachments.media_keys,author_id" +
                "&media.fields=url,type"
{{< / highlight >}}

This is only half the puzzle though, as the connected media are themselves only provided by url. So for each retrieved tweet there 
needs to be a follow-on request - or multiple! - to actually download the images contained within. I also optimise a bit here and check the download location to see if I've already downloaded the image before and save an additional api request.

Once the tweets and their associated media have been wrangled the next step is to see about assembling a Hugo page to display them 
within. Implementation details here include the header block and the `<!--more-->` notation at the top of the page to prevent the page 
preview widget on the website index pages from displaying a huge list of link markup!

Associated repository: [Ninjars/MoodyBoard](https://github.com/Ninjars/MoodyBoard)