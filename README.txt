Operation Desert Storm
15-237 S13 HW 1

Authors:
Joseph Carlos (jcarlos)
Kunal Desai (kunald)
James Grugett (jgrugett)

How to play
Click the PLAY! button, and move the mouse up and down to move your character.
Hold down the mouse button to move faster. You are constantly growing, and
eating cakes will make you smaller. Avoid the cacti. Be sure to have your sound
on.

Use of course ideas in our code
1. Git
We used a private GitHub repo to merge all our code.

2. Debugging
I saw James using the debugging tools in Chrome a few times and Kunal used the
profiler.

3. First-class functions
Our main use of first-class functions was in callbacks. For example, the Menu
object/class takes a "startGameCallback" which is actually a function that it
calls when the PLAY! button is pressed. This particular function starts the
game.

4. Object-oriented design
We used object-oriented design in a variety of places. GameObjects all have an
x, y, width, and height, and are all transformed and drawn generally without
regards to whether they are a barrier, or cake, or player. Our camera design
also has some kind of inheritance, where the InfiniCamera and BaseCamera are
"subclasses" of the Camera "class" that is made from a GameObject passed into
Camerify.

5. Canvas transformations
These are used extensively. We achieve a "horizon" effect by transforming each
object on screen individually based on it's world coordinates relative to the
player.

6. Other stuff
Canvas images are used extensively, and so are things like functions and math.

Resource credits
terrain.png (sand, cactus, and cake textures)
sand2.png (sand background texture)
    Minecraft, copyright 2009 Notch Development AB

Doom-LostSoul.png (explosion sprites)
    DOOM, copyright 1993 id Software
    from http://spritedatabase.net/, user harsh29
    
trainersprites.png (Pokémon trainer sprites)
    Pokémon Sapphire, copyright 2002 Nintendo, Creatures Inc., GAME FREAK Inc.
    from http://img388.imageshack.us/img388/9500/cityspritesheet20lj.png found
    on the Serebii.net forums at http://www.serebiiforums.com/showthread.php?
        109428-Sprites-Sprites-Sprites!!!
    posted by user Munch!
    
