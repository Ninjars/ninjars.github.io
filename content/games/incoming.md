---
title: "Incoming!"
featured_image: "/images/missile_command.jpg"
omit_header_text: true
date: 2021-01-11
tags: ["unity", "game", "incoming"]
type: "games"
layout: "game"
game: "incoming_0.0.2"
---
A "Missile Command" inspired arcade game, built in Unity.
<!--more-->

{{< unity-player src_folder="incoming_0.0.2" >}}

Graphics rendered with [Shapes](https://assetstore.unity.com/packages/tools/particles-effects/shapes-173167) library by [Freya Holmér](https://twitter.com/FreyaHolmer).

### Current Release
#### 0.0.2
Having run the initial release past a few friends and welcome guests the most common theme was of not understanding how to play. 

Fair enough, I'd neglected to include even the most rudimentary instructions. With this release, focused mostly around tweaking the UI and the structure beneath it, I've added labels to the missile batteries with the corresponding key above them and added lines from the batteries to the cursor. Hopefully this makes things clearer without needing an explicit tutorial.

It's also pretty hard. This is again fair enough - I've yet to put much time into balancing the progression and this needs more thought. I have managed to complete all 20 waves myself, so it's possible... but yeah, a better ramp up would be more rewarding.

The final key feedback has been requests for more enemy attacks; although splitting MIRV warheads do make their appearance from wave 12 they aren't very obvious and many players aren't getting that far. In addition, they aren't visually distinct. I have plans to expand on the enemy attack roster, but making use of the assets I already have ties into the challenge ramp up from the previous feedback.

### Previous Release Notes
#### 0.0.1 on 2021/01/04
This is the first public release of this little side-project. Mostly to prove to myself that I can make a thing, it's also been an opportunity to learn the WebGL build process. Turns out Unity's new Universal Render Pipeline doesn't play so nice with these visuals in WebGL, and there's further issues with WebGL 2.0 and various bits and bobs, so I ended up converting the project from URP to the build-in render pipeline. 

It's always a bit of a pain to have unexpected wrenches thrown at you, and it meant I missed my "end of 2020" target date. However I learnt a lot about both building a WebGL Unity project and a whole bunch about how to create new Hugo pages for special use-cases!
