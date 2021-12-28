---
title: "Quick Reference"
featured_image: "/images/unsplash/fallon-michael-VUWDlBXGogg-unsplash.jpg"
omit_header_text: false
date: 2021-12-05
tags: ["web"]
---
A quick reference doc for reminders on how to update this site.
<!--more-->
I can go for far too long between posts here, and one blocker for coming back is forgetting the admittedly simple steps to getting back up and committing. I end up referring back to the Making Of post, but the key info's pretty far down in there. So, without further ado, reference notes for editing and deploying the website.

### Developing
- Execute `hugo server -D` in the project directory to create a local server, hosting by default at [localhost:1313](http://localhost:1313/)
- The `-D` argument means it will show unpublished pages, ie ones with `draft: true` in their metadata.
- The website will be updated and refreshed automatically as content is modified.

### Publishing
- Project uses Github Actions for deployment. See `gh-pages.yml` for the configuration and see [Github Pages Action](https://github.com/marketplace/actions/github-pages-action) and [Hugo Setup](https://github.com/marketplace/actions/hugo-setup) for more info on the particulars available
- To publish an update simply push changes made to `main` branch and wait for Github to build and deploy it.
- Action execution can be verified [on the github actions page](https://github.com/Ninjars/ninjars.github.io/actions).
- The updated website content is pushed to the `gh-pages` branch by the Github Action and served from there, as per configuration in the Github Pages settings.

### Project Layout
- Pages live inside the folders within `/content`
- css, images and source code for hosted games live inside `/static`
- The code used for the boids simulation lives in `/assets` - it might make sense to try moving them to static, but there may have been something going on with how Hugo references them.
- `/layouts` contains the custom components I've defined for showing Unity and Twitter frames, including the boids animation on the home screen, customising the headers on pages, and similar.
- `/themes` contains all the components the theme provides. Defining files with the same name and directory structure in the project root will override theme files, as I've done in `/layouts`
