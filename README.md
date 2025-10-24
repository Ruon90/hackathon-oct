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
    -   [Twump Tower](#twump-tower)
        -   [Introduction](#twump-tower)
        -   [Phaser](#phaser)
        -   [Code breakdown](#code-breakdown)
        -   [bugs](#bugs)
        -   [Conclusion](#conclusion)
    -   [Orb Blasting](#orb-blasting)
    -   [Froggy Game](#froggy-game-development---andy)
    -   [Responsive Design](#responsive-design)
-   [Built With](#built-with)
    -   [Technology and Languages](#technologies-and-languages)
    -   [Libraries and Frameworks](#libraries-and-frameworks)
    -   [Tools & Programs](#tools-and-programs)
-   [Development](#deployment)
    -   [Testing & Validation](#testing-validation)
    -   [AI](#ai)
    -   [Summary](#summary)

## Project outline

# Project planning

# Features

## General features

## Twump Tower

### Introduction

I decided for my game I wanted to produce a third person shooter, I thought this would be an achievable concept as the main systems needed are based on collisions, hit detection and health.

In order to achieve this I made the decision to use a game library called Phaser which has a number of inbuilt classes specifically for javascript gaming.

The theme of the game is based around a modern stylized aesthetic combined with retro game vibes, theres alot of sounds within the game aswell as various animations, these were achieved using sprite 2d animation within the phaser framework.

### Phaser

Phaser is a javascript library developed for game design, it has multiple inbuilt classes that can handle physics calculations, player inputs as well as a host of other things.

The main reasons it was chosen to be used for this project was to do with scalability and efficiency, as we only had a few days to work on the project and it was using new technologies to us being efficient with time was important. Phaser has the capacity to be ported to all platforms meaning if the game was to continue development it could be deployed as a mobile app, offering unlimited scalability.

The game was designed to be modular so each different system can be taken out and used in new projects, which gives the opportunity to prebuild a number of key features in various games as theres projectile, collision, movement, score, player death, enemy death, enemy spawns, player spawns and states, and enemy AI with multiple states including idle and chase.

### Code breakdown

### Bugs

While overall I belive the game to be relatively polished even though it's lacking content,

### Conclusion

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

## Responsive design

<img src="documentation\images\mockup.png">

# Built With

## Technology and languages

## libraries and frameworks

## Tools and programs

## Ai

## Summary
