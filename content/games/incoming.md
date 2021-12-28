---
title: "Incoming!"
featured_image: "/images/missile_command.jpg"
omit_header_text: true
date: 2021-03-01
tags: ["unity", "game", "incoming"]
type: "games"
layout: "game"
game: "incoming_0.0.4"
---
A "Missile Command" inspired arcade game, built in Unity.
<!--more-->

{{< unity-player >}}

Note you can expand to full screen with the blue button in the bottom right of the game view!

If it doesn't play well on your browser, try Chrome or Firefox, and try disabling or enabling hardware acceleration; I'm not 100% confident that Unity's WebGL API integrations are as well-supported at their other platform targets.

Graphics rendered with [Shapes](https://assetstore.unity.com/packages/tools/particles-effects/shapes-173167) library by [Freya Holmér](https://twitter.com/FreyaHolmer). 

### Current Release
#### 0.0.4 on 2021/03/01
Big feature release time!

Firstly, I've rationalised the city upgrades: after realising that having two upgrades that basically do the same thing - ie, increase the population evacuation rate - I've replaced one with a much more interesting option! Now you can spend an upgrade point to place a shield dome over a city. This effectively gives it an additional hit point :D

Next, I've reconsidered the game difficulty curve and session length. It's not reasonable to ask people to play through a hundred levels, that's just silly for a little web-based game with no checkpoints! The game is now up to 20 levels long, though spending upgrade points early on city evacuation rate can certainly bring that down - as can losing all your cities... This limit is also made clear with a little addition to the UI.

Finally, I've added a bunch of sound effects! :o I've not played around much with sound before, so it's very much a first effort taking advantage of a sound pack I'd purchased years ago, [Universal Sound FX](https://assetstore.unity.com/packages/audio/sound-fx/universal-sound-fx-17256). Fun fact, turns out this is the same pack that the [Among Us](https://innersloth.com/gameAmongUs.php) team used - it was fun to be scrolling though and suddenly hear the "EMERGENCY MEETING!" sound, or the "you're the imposter!" bwaaaaa. Kinda makes you wonder if a successful title can functionally 'claim' an asset in the popular view - like, if you made a game now using one of those effects would you face a wave of negativity for being perceived of ripping of Among Us? Hmm.

Either way, this marks a major milestone where the project not only looks like a game and plays like a game but also sounds like one! It might not be perfect, and could benefit from some polish, but I'm happy with the state I've managed to get it into for now :D

### Previous Release Notes
#### 0.0.3 on 2021/02/08
This release introduces a bunch of new features and fixes.

The most obvious new feature is the addition of an upgrade system, allowing you to enhance your missile batteries' capabilities or the evacuation rate of your cities. This is a foundational system that could be further expanded with more upgradable attributes or even special one-off upgrades.

There's also a new enemy type with a novel attack pattern and explosion-dodging behaviours, and bombers have been upgraded to have some evasive capabilities too! 

Oh, and to help with the feeling of progression, every 5 stages up to 50 there's a title card to accompany a rule change and bonus upgrade point! :D

Behind the scenes, I've completely rebuilt how I define the game progression to make attributes defined by curves that provide a continuous progression throughout the 100 defined levels. This will need to be subjected to some balancing efforts - I've not played much beyond level 20 - but it's a scalable system to provide a long set of gameplay.

I've also done a bunch of tweaks to various other aspects: there are now 2 different visuals for two bomber roles, splitting warheads may make an earlier appearance, EMP screen effects and the background mountains have been tweaked, city population readout bugs addressed, and cursor lines have been made a little more subtle.

Outstanding achievable things: tweak the difficulty progression based on player feedback and add special upgrades (think protective domes for cities, or special warhead type upgrades for missile batteries). 

Stretch goals if I were to maintain focus on this project longer: local high-scores table, to compete with yourself. Share button on end state screens, to compete with others. In-game analytics, to gain player insights and, eg, spot drop-off points or difficulty cliffs. Graphics customisation options; the game has been built in such a way that it should be straightforward to adjust the colour palette before launching a game - it would just require a bunch of ui work, and maybe some local storage integration.

I've got a bunch of other ideas in my head atm though, so I think it's unlikely I'm going to persist on this project much more in the near term. I've reached a pretty good milestone and I'm proud with what I've managed to do getting here. I've learned a whole load, and it feels great to finally bring a project to the point where I feel comfortable to share it with the world!

#### 0.0.2 on 2021/01/21
Having run the initial release past a few friends and welcome guests the most common theme was of not understanding how to play. 

Fair enough, I'd neglected to include even the most rudimentary instructions. With this release, focused mostly around tweaking the UI and the structure beneath it, I've added labels to the missile batteries with the corresponding key above them and added lines from the batteries to the cursor. Hopefully this makes things clearer without needing an explicit tutorial.

It's also pretty hard. This is again fair enough - I've yet to put much time into balancing the progression and this needs more thought. I have managed to complete all 20 waves myself, so it's possible... but yeah, a better ramp up would be more rewarding.

The final key feedback has been requests for more enemy attacks; although splitting MIRV warheads do make their appearance from wave 12 they aren't very obvious and many players aren't getting that far. In addition, they aren't visually distinct. I have plans to expand on the enemy attack roster, but making use of the assets I already have ties into the challenge ramp up from the previous feedback.

#### 0.0.1 on 2021/01/04
This is the first public release of this little side-project. Mostly to prove to myself that I can make a thing, it's also been an opportunity to learn the WebGL build process. Turns out Unity's new Universal Render Pipeline doesn't play so nice with these visuals in WebGL, and there's further issues with WebGL 2.0 and various bits and bobs, so I ended up converting the project from URP to the build-in render pipeline. 

It's always a bit of a pain to have unexpected wrenches thrown at you, and it meant I missed my "end of 2020" target date. However I learnt a lot about both building a WebGL Unity project and a whole bunch about how to create new Hugo pages for special use-cases!
