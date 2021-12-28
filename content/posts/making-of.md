---
title: "The Making Of"
featured_image: "/images/sheep-stare.jpg"
omit_header_text: true
date: 2020-06-28
tags: ["web"]
---
My contribution to the noble tradition of the first blog post written by a techie being about how the author set up their blog. Documentation of my process of building this site, using Hugo.
<!--more-->
I have been thinking for a while about how to build a modern static site that I could host on Github Pages. I want something that is easy to author additional content for - so ideally markdown rather than html. I would like to be able to modify or even create new components so I’m not limited to just what the framework provides. I’ve previously looked into a couple of frameworks - React, Wordpress, Ghost.org, Gatsby, NextJS, Jekyll - but I’d been put off either by struggling to understand the trade-offs of each option or not finding accessible entry points to get to the result I wanted quickly enough.

Although I've been an Android developer for a good few years I’ve only dabbled a little with web technologies, and those mostly at the start of my career. Although I want to broaden my skills by learning more about modern web development, I don’t want that to block my ability to get started blogging. At the same time, I feel like I have enough of a technical background that I don’t need to pay for a hosted solution!

Prior to making this site, the only place my side projects have been documented publicly has been Twitter. Twitter is great for its immediacy and simplicity but it’s hard to follow the thread of a project through multiple disparate posts.

## Enter Hugo
One free day off I had the good fortune to spot this post by [@SarahJamieLewis](https://twitter.com/SarahJamieLewis) where she mentions a simple workflow she uses to maintain a journaling blog:

{{< tweet-single 1273511979596955649 >}}

Sarah’s tweet was a little signal that perhaps [Hugo](https://gohugo.io/) was something that would Just Work&#8482;, and it turned out that that was all I needed to cut through the uncertainty and get started making something.

## Getting Started
I started jumping right in with the [quick-start tutorial](https://gohugo.io/getting-started/quick-start/), immediately hitting the first minor hurdle: I'm doing this on Windows. 

According to the [Windows install](https://gohugo.io/getting-started/installing#chocolatey-windows) I should work out how to use the Windows package managers, and when I initially did this that was the rabbit hole I went down, but a) it didn’t work for me and b) the later I stumbled upon [this install guide](https://gohugo.io/getting-started/installing#windows) which instead directed me to simply download the zipped exe from the releases page and stick it in a folder. I was pretty confused as to what went wrong with my Chocolatey install, but sometimes you’ve just gotta stay focused on the prize.

The instructions provided for adding Hugo to the system path also didn’t work for me, but after a bit of research and wrangling I eventually had `hugo` set up as a valid command in my Windows powershell prompt. Victory!

## Create a New Site
Step 2: `hugo new site quickstart` - I do enjoy it when a framework has a “do the setup for me please” instruction! 

Step 3: `git submodule` to add a theme - I didn’t expect to use Git for adding a theme, and at this point hadn’t yet set up a repository for the project. After setting up a repository, the theme didn’t end up actually being a submodule and behaved more like as if I’d just copied the files in. Worst case scenario this just means it will be less obvious to me if there’s an update to the theme later.

A note about themes: coming from a mobile background I’m used to there being a big difference between theming elements and functional elements. The Android framework provides widgets, and the theme just defines what they look like. Here, the themes define not just styling and templates but also functional elements that the templates contain. This blurs the line for me on where the framework ends and the theme begins, and potentially makes choosing a theme a bigger decision than it initially appeared to be.

In completing the theme setup, however, the quick start guide let me down: it instructed me to generate my own `config.toml`, but this was a trap as it left me with a misconfigured theme! I needed to go into the theme's own example config to get the theme-specific params in there, though even this isn't a complete set of options. For that I had to go to the theme's home page to read through the documentation, though later I ended up needing to pour through the Github issues to track down other settings I needed to adjust! There’s a lot of stuff glossed over here that arguably should at least be mentioned in the quickstart guide.

Step 4: `hugo new posts/my-first-post.md` - worked well for me but reading around it looks like this may be very dependent on what theme you’re using, as this method will not take into account any headers that a given theme may require of its articles.

Step 5: `hugo server -D` - I popped open a browser window pointing to the local host address and there was my shiny new website! Changes in the page codes are pretty much immediately shown without needing to manually refresh which is nice. Later I discovered some issues around css changes not being reflected due to browser caching, but in Chrome opening the dev tools disables the browser cache and helps when iterating on styling. Impressively, the theme and framework automagically create a home index page and a category page for the article, using the file hierarchy to generate appropriate tabs and titles and creating a “recent posts” widget on the main index page. Very nice, definitely appreciate the emphasis here on having some sensible and helpful default behaviours.

Step 6: finishing off the configuration took a little while, as the meaning and use of the params (and what theme params there even were) took a while to suss out. Fortunately the fast local server made it very quick to iterate on changes, and it wasn't long before I felt comfortable experimenting with the possibilities here and had a handle on the basics.

## So, What Next?
With all the various tangents and road bumps that working in a new framework bring it's taken me a good while to get to this point. However now the foundations are laid, it’s time to start authoring some content!

My old site linked to a few of my early javascript experiments, but those are really rather old now... and I've got a load of pics and vids on my twitter feed from my subsequent side projects! Turns out Hugo has built-in support for embedding a Tweet in a card, but after trying it out for a bit I discovered that it will sometimes display a second tweet from the thread. I want more control over what tweets are shown than that, so a bit of research later I have my first shortcode:
{{< highlight go "linenos=table" >}}
{{ (getJSON "https://api.twitter.com/1/statuses/oembed.json?hide_thread=1&id=" (index .Params 0)).html | safeHTML }}
{{< / highlight >}}
I recognise the `{{ }}` syntax as being “handlebars”, defining code invocations rather than html markup. There’s clearly a bit of html in there that correlates to the twitter api, but quite why it’s “getJSON” or exactly what “safeHTML” does I don’t know. I’m comfortable leaving that as a little bit of magic for now as my main objective here is to add the functionality now - I can always come back later to deepen my knowledge and understanding later.

With the means to include tweets, building up my initial set of content boils down to going back over my tweets, grabbing the ids, and creating articles that logically group them. Initially I grouped by project, but there proved to be too much for a sensible article in some cases. I then shifted to grouping by focus, as often my projects could be broken down into macro features. This grouping helped me see the flow from one project to another as inspirations shifted and flowed, and was quite rewarding to go over.

## What's In An Article?
At this point I had a bunch of articles chronicling various side projects and evolutions there-of. I had content! Great - but what is all the metadata about, and how can I better present things? Setting the `date` page metadata to that of the last tweet on the page meant that the articles were automatically sorted in chronological order. 

However, the preview summaries were rather verbose and tended to pull in the raw text from the tweet, which wasn't great. A bit of research later indicated that the summary is by default the first 70 words of the article, but that you can also put in a `<!--more-->` annotation to be explicit about where the summary ends. A bit of work later and I'd added editorialised introductions to each of my project articles with a short sentence or two that either summarized the contents or worked well as a hook.

Tags are another little piece of metadata that provide key words used to associate articles with one another, in order to populate the "related articles" list. Working out what tags I should use on a given article is going to be an ongoing process, with a goal of trying to keep the related articles list relevant and interesting.

Next, what about pretty pictures? I assembled pictures for several of the articles, some taken from tweets and others by loading the project back up and taking a new screenshot. Using the `featured_image` metadata I was able to get these to appear relatively easily, but it wasn't quite what I wanted. By default the theme puts the title on top of the image, which is redundant when the article layout also has the title at the top of the content. Fortunately there's already metadata for this: `omit_header_text`. Great. 

However, there's also a 60% opaque black overlay that's applied to the image in order to ensure that the navigation text and other elements are visible even over light images, and this kinda messes with my style - if there's no title text, why should the whole image be masked? Here's where I made my first theme-override partials, getting `page-header.html` and `site-navigation.html` to react to the same property to change their backgrounds. If `omit_header_text` is set then the background will only be on the navigation bar, otherwise it will apply to the whole heading element.

In `page-header` this means changing:
{{< highlight html "linenos=table" >}}
    <div class="pb3-m pb6-l bg-black-60">
{{< / highlight >}}
to:
{{< highlight html "linenos=table" >}}
    {{ if .Params.omit_header_text }}
    <div class="pb3-m pb6-l ">
    {{ else }}
    <div class="pb3-m pb6-l bg-black-60">
    {{ end }}
{{< / highlight >}}
And in `site-navigation`:
{{< highlight html "linenos=table" >}}
    <nav class="pv3 ph3 ph4-ns" role="navigation">
{{< / highlight >}}
becomes:
{{< highlight html "linenos=table" >}}
    {{ if .Params.omit_header_text }}
    <nav class="pv3 ph3 ph4-ns bg-black-60" role="navigation">
    {{ else }}
    <nav class="pv3 ph3 ph4-ns" role="navigation">
    {{ end }}
{{< / highlight >}}

There’s an assumption made here that you’re only setting `omit_header_text` when `featured_image` is set, so I’ve added the potential for me to make a mistake and end up with two semi-transparent backgrounds overlapping each other.

After playing around with a couple of different screen widths I noticed that the image was scaling from the top, which meant on wide displays the middle of the images was being lost, when normally that's where key features are. Easy fix, fortunately - just opened `page-header` back up and changed the header class from `"cover bg-top"` to `"cover bg-center"`, and the Tachyons styling framework does the rest.

## Grouping Articles
With the bulk of the content built out as “project” articles I moved on to add an "About" page. The position of the page in the file hierarchy affects how they are grouped in the website navigation, so by putting the About page next to the Projects folder it appears as a top level navigation item. The theme creates a default page for the Projects category to be the destination of that navigation item, consisting of a list of its contained articles.

Next, I wanted to add another category alongside Projects to hold Posts - writings that aren’t necessarily related to a specific project. I created a new folder and added a draft article, but then noticed that although this new article was the most recently created in the site, it wasn’t popping up in the “recent projects” section on the home page.

That the name was "projects" and not "posts" was a clue, and after a bit of researching I had my answer: by default, the recent articles list is populated from the largest "article category", and I had two - one with all the project summary articles in it, and the other with my draft "first post" article. I started looking into how to write my own partial that would pull articles from multiple categories, but struggled at first to work out how to include my own partial (unfamiliar syntax in a new framework, after all!). Getting any of the code samples I was finding online to actually work was also a challenge. It looks like Hugo has changed quite rapidly over the last few years and it’s not even at a 1.0 release yet, and on top of that there's a lot of conflation between what's a Hugo property or param, and what comes from the unique behaviours of various themes.

Eventually I thought to take a step back, read some documentation, and discovered that there's actually a `mainSections` config param that allows you to declare multiple categories that will be automatically included in the recent articles summary. The “View All” button will take you to the index page for only one of the sections, however, so the UX isn’t perfect for discovering additional content. Still, it's certainly better than it was before.

## Site Logo
Whilst I was working on all this, my supportive girlfriend had been working on a logo image as a surprise for me! Super easy to integrate into the site with an already-declared config param, it replaced the site title in the top left of the navigation bar.

However as I played with the responsive layout I was surprised to see that at the small size bracket the logo became massive, basically full-width, causing the header to expand to fill most of a mobile screen! Clearly that was not a good UX for the home page, so I rolled up my sleeves and prepared to properly get to grips with how the styling works.

## It's All About Tachyons
The theme uses something called [Tachyons](https://tachyons.io/docs/) to abstract away css styling into a bunch of cryptic class acronyms - on first look something like `<div class="tc-l pv6 ph3 ph4-ns">` is just obfuscated gibberish. The docs themselves are a pain for an absolute beginner because it’s not clear which section one should look in to find the definition for a tag. In the end my flow became googling `tachyons <cryptic gibberish>` until I got my bearings.

The key thing to address my layout challenge is how Tachyons handles media queries for pages with dependent styling. A hyphen is used to indicate a property that is only applied when the screen width falls into a certain bracket. The modifiers are `-m` for "medium", `-l` for "large" and `-ns` for "not small", i.e. medium or large. So in the example given above `tc-l pv6 ph3 ph4-ns"`, `tc`, or "text center" is only applied on large layouts. `ph3` (padding horizontal size 3) is applied to small screens, and is overridden by `ph4` on medium and large.

Armed with this understanding I was able to make modifications to `site-navigation.html`, changing widths and flex behaviours to make the logo appear in a way that felt cleaner to me. This was the point where I finally felt like the fog was clearing around how the theme's style framework is configured. I was able to not only query parameters to adjust the behaviour of theme components but also to make intentional and targeted changes to the framework managing the CSS behaviour too.

To improve readability I wanted to modify the styling of inline `<code>` blocks to display with their own styling. Markdown already supports inline code, but the theme’s style is very subtle, making the difference hard to spot. Overriding the style of an element that’s already declared by the theme as fortunately well supported by the theme: :all I needed to do was add my css file to the static folder and add the path to it to a `custom_css` config param like so to have it added to the header of each page:
{{< highlight toml "linenos=table" >}}
[params]
  ...
  custom_css = ["/css/styles.css"]
{{< / highlight >}}
Now I have an easy place to override or define any other styles I might need to.

## Syntactic Highlighting
This brings me to the finishing touch to the styling: I wanted to be able to add code blocks with pretty syntactic highlights. I've used that functionality several times in this post already!

Markdown supports language syntactic highlighting to an extent, but Hugo also has a powerful integration with [Chroma](https://github.com/alecthomas/chroma) [out of the box](https://gohugo.io/content-management/syntax-highlighting/).
First generate the css file:
```
hugo gen chromastyles --style=monokai > syntax.css
```
Then stick it in the `static` folder and add it to the `custom_css` param, and finally invoke it around code blocks, replacing the `` ``` `` markdown syntax with this sort of shortcode: 
```
{{</* highlight html "linenos=table" */>}} 
content goes here 
{{</* / highlight */>}}
```

## Publishing
When I first set up the website in mid 2020 the guidance for getting this all running on github pages was a bit of a pain, involving using a submodule to target the public folder in order to publish that to the main branch.

When I revisited this at the end of 2021 I discovered that Github actions can now make this much less painful by getting github to worry about managing the separate branch to publish on. With this setup all you need to do is push changes to the main branch and within a few minutes the website will be updated. Nice.

[Following the instructions](https://gohugo.io/hosting-and-deployment/hosting-on-github/) went pretty well, though I needed to juggle branches a bit to get everything lined up nicely as I was migrating an existing project. Now I have a much smoother deployment flow than before, requiring much less manual committing and subtree-updating, and without the risk of accidentally deleting the folder that the submodule points at and messing everything up.

## Complete!
All told, this process took up most of a day, with a couple of hours added in to implement the code styling as I started writing this piece. As a point of comparison, previously I’ve spent a couple of days playing around with beginner React tutorials and not gotten to the point where I had anything I could put online, so I’m definitely appreciative of how much work Hugo has put in to deliver quick results. I’m sure several other frameworks could have facilitated a similar effective start, but just throwing caution to the winds and getting on with it meant I’ve avoided the analysis paralysis that had held me back before.

I set out wanting to build a platform upon which I can track my projects and write my thoughts, with an emphasis on ease of use. Hugo has delivered magnificently on this, giving me solid foundations to build on and letting me tweak things where I needed to. There’s enough of a community for answers to be googleable, and not so much framework magic going on that I was ever completely stumped on something. Now the really hard part begins: learning how to write!

