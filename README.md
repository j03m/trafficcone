Traffic Cone is an isometric tile based game engine written for html5. It makes complex animations of sprites and tiles based worlds fairly simple. 

Traffic Cone is currently client side only, so for multiplayer games you'll have to provide your own server. But expect to see more on this front soon, we're actively working on Traffic Cone server.
===

Features: 

* Easily configurable sprite animations
* Simple to set up tile based worlds
* Mock-3D math for layering, depth and positioning is handled for you via Traffic Cone's world models.
* Basic Isometric pathfinding, AI and collision detection
* Custom draw routines on sprites supported.
* Granular control of sprite sequencing supported for more dramatic animations

===
Examples:


### Create a simple 2D world with 2D sprites
The supporting example for this section can be found in public/examples/streetfighter/canvas.html. This example rips some art assets from Street Fighter 3 and shows you how to wire them together easily with some basic collision detection.

First and foremost, Traffic Cone requires two html 5 canvases to work with. To create a basic engine, you simply create a new instance of the Engine class and supply the canvas elements ala:

```js
    ga = new Engine(document.getElementById("gamescreen"), document.getElementById("backbuffer2"));
```
The canvas is where all of our animations will be drawn. Animations come in the form of Sprites. Sprites are essentially animations which each image in the animation is made of Frames. Depending on how uniform your resources are, there are a few different ways to create a sprite. The assumption behind a sprite is that you are using a sprite sheet, and hence have an image of an animation sequence of some kind. For example see: https://github.com/j03m/trafficcone/blob/master/public/assets/ryu/RYU_PUNCH1.png 

When we define a sprite, we essentially supply the definitions for this animation. Here is the mechanism that gives you the most control, whereby we define each frame of the movement. 

```js
//create a sprite
var ryu = new Sprite("ryu");
var ryu.setup(ga);

//tell traffic cone what the dimensions
var attack = [];
attack.push(new Frame(0, 0, 105, 127, fastAction));
attack.push(new Frame(0, 1, 105, 127, fastAction));
attack.push(new Frame(0, 2, 105, 127, fastAction));
attack.push(new Frame(1, 0, 105, 127, fastAction));
attack.push(new Frame(1, 1, 105, 127, fastAction));
attack.push(new Frame(1, 2, 105, 127, fastAction));
attack.push(new Frame(2, 0, 105, 127, fastAction));
attack.push(new Frame(2, 1, 105, 127, fastAction));

ryu.defineSequence("attack", "../../assets/ryu/RYU_PUNCH1.png", attack, 1);
```
Of course, that's fine if our sprite sheet isn't uniform is terms of spacing and positioning of each frame. If it is, we don't need to be so granular:

```js
    ryu.easyDefineSequence("fall", "../../assets/ryu/RYU_FALL.png", 5, 5, 120, 178, fastAction, 1);
```
Here after the name and image, we simply supply the number of rows and columns. Then the height and width of each frame, the speed at which each frame should be played and the number of times it should played. While we can't control the speed of each frame granularly, we have also had to write much less code.

To tell our game engine about a sprite, we make it aware with:
```js
ga.defineSprite(ryu);
```
We can also define a special sort of sprite to be one solid background image. Now this sort of thing won't be applicable to our isometric games usually (see below for more details) but for games with a solid unmoving background this works:

```js
var bdImage = [];
bdImage.push(new Frame(0, 0, 512, 860, 0));
backDrop.defineSequence("backdrop", "../../assets/londonsubway/londonSubway.png", bdImage, playInfinite);
ga.setBackDrop(backDrop);
```
What I did here is I create a sprite with 1 frame and then told the game engine to use it as a backdrop.s




Creating an isometric game world with mock-3D sprites
Creating a simple composite sprite
Creating a complex composite sprite
Events and Controlling Input
Custom draw routines
Frame level alerting
Collision detection
Path Finding and Behaviors


===

### License:

   Traffic Cone is released under the Traffic Cone License. This
   license is based on the MIT License, but includes the following
   modifications:
   
    * Remove the rights to "sublicense, and/or sell copies of the Software".
    * Permit to use "free of charge" only for non-profit use.
    * Add conditions for commercial use.
   
   As a result, Traffic Cone is available free of charge for non-profit
   use. If you use Traffic Cone for commercial purposes, however, you
   are required to purchase a commercial license. This commercial license
   includes the following rights:
   
    * The licensee can use Traffic Cone as many times as needed.
    * The licensee can download the latest version of Traffic Cone as
      many times as needed.
   
   Commericial licenses are currently available at no charge to select early adopters. 
   
   Please contact us on Github. http://www.github.com/j03m for details.