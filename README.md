# hackathon-oct

<img src="documentation\images\header.png">
<p align="center">
    <a href="https://ruon90.github.io/hackathon-oct/" target="_blank">Live site</a>
</p>

## Introduction

As part of the october hackathon we were tasked with building a games website, the team opted to build three seperate games and collectively work together to produce the html elements.

<h2 align="center" id="TOC">Table of contents</h2>

-   [Arcade Legends](#arcade-legends)
    -   [Introduction](#introduction)
    -   [Table of Contents](#TOC)
    -   [Project Outline](#project-outline)
-   [Project Planning](#project-planning)
-   [Features](#features)

    -   [General Features](#general-features)
    -   [Responsive Design](#responsive-design)
    -   [Twump Tower](#twump-tower)
        -   [Introduction](#twump-tower)
        -   [Phaser](#phaser)
        -   [Code breakdown](#code-breakdown)
        -   [bugs](#bugs)
        -   [Conclusion](#conclusion)
    -   [Orb Blasting](#orb-blasting)
    -   [Froggy Game](#froggy-game-development---andy)
        -   [Gameplay & Mechanics](#gameplay-&-mechanics)
        -   [Sound & Immersion](#sound--immersion)
        -   [Technical Highlights](#technical-highlights)
        -   [Technical Difficulties](#technical-difficulties)
        -   [Programming & AI Usage](#programming-and-ai-usage)

-   [Built With](#built-with)
    -   [Technology and Languages](#technologies-and-languages)
    -   [Libraries and Frameworks](#libraries-and-frameworks)
    -   [Tools & Programs](#tools-and-programs)

## Project outline

The main goal of the project was to produce JavaScript games, as we decided to produce a game each and then have a webpage to display them all it meant each person developed their own game independently.

# Project planning

Overall we didn't do much written planning for this project, as the subject matter was new to all of us we didn't know what would be a realistic target to set and instead opted to try and push our JavaScript games as far as we could to gauge what we could achieve, so instead we had ad-hoc planning during regular video calls as we had to adapt our approach multiple times.

This meant that when the games were first pushed onto a webpage Andy developed for prototyping, the site has remained largely the same excluding a few refinements and tweaks to finish everything off.

For this reason we have not generated user stories or wireframes as the HTML side of the project largely just came together and the JavaScript was pushed to the very end of our time frame.

# Features

## General features

The website itself is built upon the bootstrap framework, is interactive and responsive and does a good job in showing off our work as well as a container to be able to play the games within.

The whole site has a consistent style and is intuitive to use following web development norms.

## Responsive design

<img src="documentation\images\mockup.png">

## Twump Tower

### Introduction

Originally I had intended on doing a beat 'em up game modelled after streets of rage, after some research I realised this would likely be unachievable within the timeframe of the hackathon and so I decided for my game I wanted to produce a third person shooter, I thought this would be an achievable concept as the main systems needed are based on collisions, hit detection and health.

In order to achieve this I made the decision to use a game library called Phaser which has a number of inbuilt classes specifically for JavaScript gaming.

The theme of the game is based around a modern stylized aesthetic combined with retro game vibes, there's a lot of sounds within the game as well as various animations, these were achieved using sprite 2d animation within the phaser framework.

### Phaser

Phaser is a JavaScript library developed for game design, it has multiple inbuilt classes that can handle physics calculations, player inputs as well as a host of other things.

The main reasons it was chosen to be used for this project was to do with scalability and efficiency, as we only had a few days to work on the project and it was using new technologies to us being efficient with time was important. Phaser has the capacity to be ported to all platforms meaning if the game was to continue development it could be deployed as a mobile app, offering unlimited scalability.

The game was designed to be modular so each different system can be taken out and used in new projects, which gives the opportunity to pre-build a number of key features in various games as there's projectile, collision, movement, score, player death, enemy death, enemy spawns, player spawns and states, and enemy AI with multiple states including idle and chase.

### Code breakdown

#### Scene & collision physics

The game is divided up into multiple scripts with game.js essentially acting as a config file and staging area for the other components. The first scene rendered is the loading screen, this is used to preload all of the assets used within the game to make the experience smoother as well as require the player to interact with the canvas enabling sounds.

The rest of the game is divided up amongst the game scene, menu scene and death scene. The enemy AI logic also has it's own script as its a hefty class that would otherwise need to be replicated in all game scenes.

Collision is handled using phaser inbuilt library, collision classes are added for each object, the player, enemies, bullets and finally walls. The player enemy and bullet collisions are based on the image properties, however as the walls are placed on top of a flat level image each wall has been created using an invisible box that has had collision properties assigned to it mapped out across the level image, an array was used to add in all the x and y values that had been gathered.

<img src="documentation\images\wall-c.png"><img src="documentation\images\wall-cb.png">

#### Player movement

Player movement is handled largely by phasers inbuilt systems, the WASD keys are remapped to up/left/down/right respectively and this input is then used to increase or decrease velocity across an axis.

in order to stop player models from 'sliding' I added code to set the player model back to 0 velocity once the movement key input has stopped.

Again using phasers inbuilt library I assigned an event listener for the mouse cursor position and then aligned my sprite based on this x, y co-ordinate, this then angles the player model in the desired direction, with WASD handling movement.

<img src="documentation\images\move-keys.png"><img src="documentation\images\move-velo.png">

#### Animation and images

All animations used within the game use phaser library for sprite sheets and animations, the sprites are loaded on a frame by frame basis and then animated in a flip book style simulating movement.
bullet spawn and projection

Images have been generated with AI, edited in Krita and turned into sprite sheets using the piskelapp online platform to centre and sequence the images correctly.

For example, the shoot animation is four images cycling through as shown below.

<img src="documentation\images\sprites.png">

#### Sprite animations and sounds

While sprite sheets are used for animations for movement and shooting, some animations are using prebaked elements of phaser, for example the screen shake and lightning flash effect on the main menu use inbuilt functions, the enemy respawn flash and player damage flash are all using tweens and alpha modifiers to give the retro feel of taking damage, the knockback and screen flash has also been implemented this way.

Most animations are basic and used multiple times to give the desired effect without taking too much time to implement.

#### Damage system

The damage system implemented is fairly basic but is modular and can be expanded on. The player is assigned a lives value (can also be translated to health as calculations remain the same) upon collision between an enemy and a player one life is taken and the damage animations and sound play, as the lives decrease to 0 the player is then sent to the death scene and and can restart the game loop.

<img src="documentation\images\take-damage.png">

#### Enemy spawn

Enemy spawn logic is handled using an array of X and Y co-ordinates giving them preset spawn locations as the previous random generation could interfere with walls and make the game seem off.

There is a max enemies spawn variable to ensure the game doesn't get overloaded with sprites (primarily due to a decrease in performance) the max enemy variable will also increase based on the difficulty modifier, this has been implemented using logic containing a reference to the player score in the calculation, as the score increases so does the difficulty modifier, this is used in the spawn frequency as well as the max enemies variable.

<img src="documentation\images\spawn.png">

#### Enemy AI

The enemy AI has a relatively straight forward function, first it patrols a set area, then when the player is within range it chases them, finally when close enough to the player it has an attack function.

In order to achieve this a multi-state AI is used, there are a total of 3 states, IDLE, CHASE, ATTACK. A switch is used to determine which state is the correct one for the sprite.

-   Idle - when idle is played the enemy sprite will execute the patrol function which increases or decreases the sprites velocity across an axis for a set period of time, this was a simplistic way to implement it but with the collisions set up the enemy still appears to patrol a route, its set to a 3.5 second loop per direction.

-   Chase - The chase function is also quite simple, the game calculates the distance from the player to the enemy if the player gets within the range of the enemy the enemy will get the players x and y location then run towards this location. A difficulty modifier has also been implemented here, the logic to handle the enemy speed is effected by the score, as the score gets higher both the detection range and the speed of enemies will increase.

-   Attack - The attack function currently just stops movement for the enemy sprite, the damage is calculated within the game logic and is quite basic so there was no need to implement further code into the attack function, however as this was designed to be modular it can be scaled up into more advanced projects.

<img src="documentation\images\ai-switch.png">

#### Death sequence

The death sequence is initialised when the enemy collides with the player and the initial check of <= 1 lives remaining is true, the player is then restricted from movement and firing, the game over fade begins and the game over sound plays, this then fades into the death scene which is the final scene for the game which incorporates a restart function to start the game loop over.

#### AI usage

AI has been used to aide the creation of this game, however this has been through asking co-pilots online service questions regarding the phaser framework and using AI to search documentation and produce the functions required as per the prompt given.

There is an example of how a prompt used below.

<img src="documentation\images\ai.png">

### Bugs

While overall I believe the game to be relatively polished even though it's lacking content, this was addressed by creating an infinitely looping game mode but there are some known bugs remaining.

-   Wall collision ignored on knockback effect.
-   Unmute icon displays for mute button on start up but rectifies on third use.
-   Can move through walls if pushed by enemies in certain circumstances.
-   Particular wall collision is off, found after a git merge changed a co-ordinate but no time to fix.
-   Enemy sprite does not stop moving when appearing stationary due to collision or a pause period.
-   Not mobile friendly due to use of WASD movement keys, intended to implement movement stick but not enough time.

None of these are game breaking and as such I believe the game is still complete, while further development can easily rectify these issues.

### Conclusion

Overall I'm happy with my game and feel I have learned a tremendous amount and would like to think I will continue with this trip into phaser and develop more java based games with the potential of turning one into a mobile app.

I think the website as an overall is of good quality and I'm happy with how my game turned out, I think our hackathon in general while not perfect in terms of planning has gone well and there's been plenty of good teamwork across our team and that is reflected in our final product.

## Orb Blasting

## Froggy Game Development - Andy

The Froggy game was developed as part of our hackathon project, we decided to a create a retro themed website that contained 3 games. Froggy was designed as a throwback to retro arcade gameplay while integrating modern web features. Inspired by classic cross-the-road mechanics, Froggy challenges players to guide a cheerful frog across busy traffic lanes using intuitive controls and immersive sound design.

### Gameplay & Mechanics

The game loop is built around a simple structure: the frog moves in discrete steps across the canvas, dodging procedurally generated cars that increase in speed and density with each level. Collision detection resets the frog’s position, while successful crossings trigger level progression and celebratory sound effects. The game culminates in a win screen after four levels, reinforcing the arcade-style challenge-reward loop.
Mobile-Friendly Controls

To ensure accessibility across devices, I implemented both keyboard and touch controls. Arrow keys and spacebar work on desktop, while mobile users interact via on-screen directional buttons and a single toggle button for starting or pausing the game. I added this quite late in the development This unified control scheme was a key focus during development, balancing responsiveness with simplicity, but given more time I would look to change the layout.

### Sound & Immersion

Sound effects play a central role in Froggy’s atmosphere. From the ambient traffic loop to hop and level-up cues, each audio element was timed and layered to enhance feedback and immersion. I also added logic to reset and replay sounds during transitions, keeping the experience tight and satisfying.

### Technical Highlights

-   Modular JavaScript structure for easy expansion and debugging
-   Dynamic car generation with lane-based spacing logic
-   Responsive canvas rendering with sprite-based visuals
-   Synthwave-inspired UI overlays and flicker effects for retro flair

### Technical Difficulties

In the game the cars often overlap and i tried many times to fix this. The game is still playable, but if I had more time I would rectify this

### Programming and AI usage

As this is the first time I have designed a game using JavaScript, I leaned heavily into using Co-pilot to give me a step by step walkthrough on how to build and implement the game. Firstly i asked to design a very simple frog-crossing the road-game and to do it in simple steps so I could implement each part myself. Initially it used code that generated the cars and frog as red and green blocks, but as the development went on I made my own assets for the game and added more features.

# Built With

## Technology and languages

-   JavaScript
-   HTML
-   CSS

## libraries and frameworks

-   Bootstrap
-   Phaser

## Tools and programs

-   VSCode
-   Github
