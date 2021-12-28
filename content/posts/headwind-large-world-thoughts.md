---
title: ""
featured_image: ""
omit_header_text: true
date: 2021-05-03
tags: []
draft: true
---
Intro
<!--more-->
I've long thought about mamking a spaceship game
- large scale, free roaming
- unity floating point restrictions on accuracy from around 10,000 units from scene origin

Solutions? 
- "build a double-precision game engine" lol
- "split the world into tiles, each with their own relative coordinate system"
- "reset back to origin", updating the world origin as the player reaches a distance from the center
- "futurama solution", where the player movement is actually moving the world

Building a whole game engine is beyond my competency and not what I want to do with my limited free time. What I've read about the Futurama Solution and the examples I've seen have generally been trivial, relating purely to moving transforms with no consideration of the complexities introduced for physics handling or particle systems, for example. 

Tiling systems are promising, in that you could easily toggle on and off objects registered to tiles that are distant from the player. There's some complexity with managing the transition between tiles, particularly if you're on the boundary between two or possibly 4 different tiles, and with high velocities you'd potentially be crossing tiles at a high rate which could have a cost. Still, with the right game design boundaries this could be viable, and it would lend itself well to a three dimensional data structure to track entity positions and possibly allow for efficient search algorithms.

An progression of the tiling system - which is often referred to as floating origin, but is more like a "stepping" origin - is to update the world origin when the player travels a certain distance from the origin. Rather than having multiple volumes of relative coordinates you keep repositioning a single conceptual volume to contain the player. Reaching the distance threshold presents a natural point to cleanup objects that are now very distant and to spawn new objects ahead of the player. You don't have to worry about boundary conditions between multiple pre-defined tiles, but you do still have the issue of events occurring just as the world origin is moved. There's quite a lot of discussion about this option, with simple sample code being shared widely, eg https://wiki.unity3d.com/index.php/Floating_Origin. The attraction here is that you can build your game as you would do normally, not have to worry overly much about how you're structuring your data, and just slap a script on the scene to keep re-centering everything and instantiate/cleanup entities as appropriate. 

Floating origin is a significant step above this stepping origin approach. It's the "Futurama" idea, that instead of you moving through the world, you move the world around you. There's papers and discussions around this, and as a concept it's quite exciting, but my initial reaction was that it's too alien to how Unity works, both with the physics and with particles. With stepping origin I was already concerned about how to manage rigidbodies when the origin shifted, but floating origin proposes making everything even more complex, at least conceptually! On the plus side if it works you don't have to worry about boundaries or performance hiccups around transitions.

No matter the approach taken I'm going to need a way to track the world state beyond the scope of the player-local physics simulation, and write an inter-op layer to quickly and conveniently spawn and de-spawn entities in the physics sim and port them into this non-physical state as their proximity to the player changes.  

Considerations for moving the entire world by threshold:
- performance: iterating naively over every gameobject in a frame is likely to be an expensive operation to perform. One idea to resolve this is to have the entire world bar the player within a single parent gameobject. When the player's distance from the origin of scene exceeds the threshold, the player is moved back to center and the world is offset by that amount. Downside of this is that you'd then have objects within the world whose positions are now very far from world center, so you'd still have to do a lot of iterating to eg disable or de-instantiate entities.
- particles and trails: I believe native trail renderers are world-space only, so probably non-viable for use with this system. Particles can be world-space, so it'd be important to ensure that they were also updated or that "world space" particles were also spawned within a global parent object. This could add complexity to using particle effects.
- rigidbodies: I can imagine a bunch of ways in which rigidbodies could throw up issues when suddenly jumping say 10,000 units in a single frame. This might be easy to fix but could also cause subtle bugs that would be hard to reproduce, such as timing a high-speed collision right as the world resets.
- global simulation: I'm planning on making heavy use of physically simulated NPCs and projectiles, and physics simulations are one of the big things that start to fail with the floating precision issue. I might end up needing to build a double-precision system to track entities at a certain distance from the player, despawning and respawning their actual physical realisation depending on player proximity. Despawned entities would no longer be able to use the physics engine and so I would be looking at abstracting away a lot of the detail to run a lower-resolution, lower-complexity, simplified world sim, eg ships moving between stations along straight paths with interpolated positions, statistical outcomes of conflicts, etc - or simply drop the idea of a world simulation and fake it with video game smoke and mirrors to craft a more engaging/consistent/crafted player experience, as most games do.

Floating Origin Experiment
I was initially skeptical about the "move the world" approach described by floating origin because I wasn't sure how to handle the phyical movement that I wanted to power the player ship. One solution is to create a root world object with a rigidbody component. Every entity that's not the player is made or instantiated as a child of this world object. If I freeze its rotation, set its mass to match the player's rigidbody, map all forces applied to the player to this world rigidbody instead and read "player" velocity from the world then I'm in a position where player movement at least is perceptually exactly as it was before, except now the player remains at (0,0,0) and the world origin is moving around it.

Every object other than the player that is instantiated needs to be added as a child to the world, which means at this point that the guns and missile launchers need to be refactored to instantiate their projectiles with the right parent, and also with the right launch velocity, as they can no longer simply read the inherited velocity from the parent rigidbody for the player ship. This change to projectiles makes a lot of things more complex, as with the current implementation guns and launchers only need to be aware of their parent rigidbody. With this change they also need to be aware of if they are attached to the player ship - or perhaps, if they are attached to a ship which is currently outside of the world root object, which may be subtly different. 

My initial implementation unearthed several knock-on assumptions baked into how the missile code had be written, and led to me reconsidering the wisdom of the approach. Further more, world space particle effects do not work correctly and instead anything intended to be world space must be attached to the world root object which is, again, a complexity I'd rather do without if possible.

References:
Great stackexchange post listing a bunch of resources: https://gamedev.stackexchange.com/questions/110349/is-a-custom-coordinate-system-possible-in-unity/110369#110369