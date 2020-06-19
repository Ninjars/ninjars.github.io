---
title: "Gun Turret"
date: 2020-03-11
featured_image: "/images/turrets-firing.jpg"
tags: [game, turret, unity]
---
Borne of a desire to see if I could wrangle Unity's then brand-new ECS library into some dramatic large-scale interactive battle scene I set out to see about building a gun turret.
<!--more-->
Issues with parenting game objects to each other within ECS, and with collider coordinates being broken for child objects put a damper on my excitement, but I did end up building a basic understanding of the framework. I also had to wrestle with a lot of tricksy trigonometry, coordinate conversions and PID controller logic to work out how to smoothly rotate the turret within gimbal-constrained axis. So much maths.

In the end I decided to drop the ECS aspect and re-implemented the turret in a more traditional Unity way; I wanted to be able to progress with my game design ideas rather than battle with buggy beta software!

{{< tweet-single 1178352548597633024 >}}
{{< tweet-single 1178354917880291331 >}}
{{< tweet-single 1178356905988755457 >}}
{{< tweet-single 1178363029915873281 >}}
{{< tweet-single 1178368679794356225 >}}
{{< tweet-single 1183837502974693376 >}}
{{< tweet-single 1197658465042403328 >}}
{{< tweet-single 1237814028803637248 >}}
{{< tweet-single 1231312874120925186 >}}
