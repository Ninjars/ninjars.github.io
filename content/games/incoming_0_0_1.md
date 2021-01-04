---
title: "Incoming! 0.0.1"
featured_image: "/images/missile_command.jpg"
omit_header_text: true
date: 2021-01-04
tags: ["unity", "game", "incoming"]
type: "games"
layout: "game"
game: "incoming_0.0.1"
---
A "Missile Command" inspired arcade game, built in Unity.
<!--more-->
{{< unity-player src_folder="incoming_0.0.1" >}}

This is the first public release of this little side-project. Mostly to prove to myself that I can make a thing, it's also been an opportunity to learn the WebGL build process. Turns out Unity's new Universal Render Pipeline doesn't play so nice with these visuals in WebGL, and there's further issues with WebGL 2.0 and various bits and bobs, so I ended up converting the project from URP to the build-in render pipeline. 

It's always a bit of a pain to have unexpected wrenches thrown at you, and it meant I missed my "end of 2020" target date. However I learnt a lot about both building a WebGL Unity project and a whole bunch about how to create new Hugo pages for special use-cases!

Graphics rendered with [Shapes](https://assetstore.unity.com/packages/tools/particles-effects/shapes-173167) library by [Freya Holmér](https://twitter.com/FreyaHolmer).
