

var ryu;
var checkingId;
var ga;
var backDrop;
var alex;
function sheetLoaded()
{


    if (ryu.isLoadComplete() == true && backDrop.isLoadComplete() && alex.isLoadComplete())
    {

        clearInterval(checkingId);

        ga.play();
    }

}


function ready()
{

    window.scrollTo(0, 1);
    //set up engine
    ga = new Engine(document.getElementById("gamescreen"), document.getElementById("backbuffer2"));


    //setup a backdrop image
    backDrop = new Sprite("backdrop");
    backDrop.setSpriteType("backdrop");
    backDrop.setup(ga);

    var bdImage = [];
    bdImage.push(new Frame(0, 0, 512, 860, 0));
    backDrop.defineSequence("backdrop", "../../assets/londonsubway/londonSubway.png", bdImage, tc.constants.playInfinite);
    ga.setBackDrop(backDrop);


    //define a ryu (player) sprite
    defineRyuSprite();

    ga.setCollisionHandler(collisionHandler);

    ga.defineSprite(ryu);

    ga.addEventBehavior(ga.gameEvents.Idle, "", ryu, "ryu", null, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyDown, tc.constants.RIGHTARROW, ryu, "walkForward", moveRight, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyDown, tc.constants.LEFTARROW, ryu, "walkBack", moveLeft, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyUp, tc.constants.RIGHTARROW, ryu, "ryu", null, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyUp, tc.constants.LEFTARROW, ryu, "ryu", null, tc.constants.playInfinite);

    ga.addEventBehavior(ga.gameEvents.TouchStart, "", ryu, "walkForward", handleTouch, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.TouchEnd, "", ryu, "ryu", null, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.TouchMove, "", ryu, "walkForward", handleTouch, 1);
 
    ga.addEventBehavior(ga.gameEvents.MouseDown, "", ryu, "walkForward", moveToMouse, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.MouseUp, "", ryu, "ryu", resetMove, tc.constants.playInfinite);
   
    ga.addEventBehavior(ga.gameEvents.KeyDown, tc.constants.UPARROW, ryu, "walkForward", ryu.moveUp, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyDown, tc.constants.DOWNARROW, ryu, "walkBack", ryu.moveDown, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyUp, tc.constants.UPARROW, ryu, "ryu", null, tc.constants.playInfinite);
    ga.addEventBehavior(ga.gameEvents.KeyUp, tc.constants.DOWNARROW, ryu, "ryu", null, tc.constants.playInfinite);

    ga.addEventBehavior(ga.gameEvents.KeyDown, tc.constants.SPACEBAR, ryu, "attack", setRyuAttack, 1);
    ga.addEventBehavior(ga.gameEvents.KeyUp, tc.constants.SPACEBAR, ryu, "ryu", setRyuNormal, tc.constants.playInfinite);

    defineAlexSprite();
    ga.defineSprite(alex);
    ga.addEventBehavior(ga.gameEvents.NPC, "", alex, "alex", npcAlexThink, tc.constants.playInfinite);

    //todo: implement PC health?
    checkingId = setInterval(sheetLoaded, 100);




}


function setRyuAttack()
{
    ryu.setSpriteState("attack");
}

function setRyuNormal()
{
    ryu.setSpriteState("ryu");

}

function collisionHandler(sprite1, sprite2)
{

    
    var valid = false;
    if (sprite1.getSpriteState() == "attack")
    {

        valid = isValidAttack(sprite1.name, sprite1.getFrameCounter());

        if (valid)
        {
            //knock sprite 2 back
            if (sprite1.getSpriteXDirection() == tc.constants.SPRITE_NORMAL)
            {
                sprite2.moveRight(20);
                sprite2.setSpriteState("fall");
            }
            else
            {
                sprite2.moveLeft(20);
                sprite2.setSpriteState("fall");
            }
            return;
        }


    }
    else if (sprite2.getSpriteState() == "attack")
    {

        valid = isValidAttack(sprite2.name, sprite2.getFrameCounter());

        if (valid)
        {
            //knock sprite 2 back
            if (sprite2.getSpriteXDirection() == tc.constants.SPRITE_NORMAL)
            {
                sprite1.moveRight(20);
                sprite1.setSpriteState("fall");
                if (sprite1.name == "alex") {
                    alex.moveUp(10);
                }
            }
            else
            {
                sprite1.moveLeft(20);
                sprite1.setSpriteState("fall");
                if (sprite1.name == "alex") {
                    alex.moveUp(10);
                }
            }
            return;
        }
    }
    else
    {
        //if we have collided, and no one is attacking,
        //do not allow additional movement into the othersprite
        //if sprite1 is to the left of sprite2, set lefts accordingly
        //if sprite2 is to the left of sprite1, set lefts accordingly
        if (sprite1.absoluteLeft() < sprite2.absoluteLeft())
        {
            sprite1.moveLeft();
            sprite2.moveRight();
        }
        else
        {
            sprite1.moveRight();
            sprite2.moveLeft();
        }
    }
        
}

function isValidAttack(name, counter)
{
    if (name == "alex")
    {
        //if alex is attacking ryu, it's only a valid hit 
        //within frames 6-10 because alex is big and slow     
        if (counter > 5 && counter < 10)
        {
            return true;
        }
    }
    else if (name == "ryu") //ryu has a faster window, but still valid only when punch is extended
    {
        if (counter > 1 && counter < 5)
        {
            return true;
        }
    }
    return false;
}

var ALEX_THINKS = 100;
var ALEX_ACTS  = 150;
var thinking = 0;
var acting = 0;
function npcAlexThink()
{

    //this defines how quickly alex thinks about what to do
    thinking++;
    if (thinking < ALEX_THINKS)
    {
        alex.setSpriteState("alex");
        acting = 0;
        return;
    }

    acting++;
    if (acting > ALEX_ACTS) //alex is done acting, time to think things through
    {
        thinking = 0;
        return; 
    }
    
    //where is ryu? get ryu's x/y
    var ryuLeft = ryu.absoluteLeft();
    var ryuTop = ryu.absoluteTop();
    var ryuRight = ryu.absoluteRight();
    
    //where am I? get my x/y
    var myLeft = alex.absoluteLeft();
    var myTop = alex.absoluteTop();
    var myRight = alex.absoluteRight();

  

    //plot a path from me to ryu, move in that direction
    if (ryuLeft < myLeft) //ryu it so my left
    {

        //if I am within N pixels of ryu, strike
        if (myLeft - ryuRight < 30)
        {
            if (myTop - ryuTop < 15)
            {
                alex.setSpriteState("attack");
                return;
            }
        }
        else
        {
            alex.setSpriteState("walkForward");
            alex.setSpriteXDirection(tc.constants.SPRITE_INVERTED);
            alex.moveLeft();
        }
    }
    else if (ryuLeft > myLeft) //ryu is to my right
    {
        if (myRight - ryuLeft > 30)
        {
            if (myTop - ryuTop < 15)
            {
                alex.setSpriteState("attack");
                return;
            }
        }
        else
        {
            alex.setSpriteXDirection(tc.constants.SPRITE_NORMAL);
            alex.setSpriteState("walkForward");
            alex.moveRight();
        }
    }

    if (ryuTop < myTop)
    {
        alex.setSpriteState("walkForward");
        alex.moveUp();
    }
    else if (ryuTop > myTop)
    {
        alex.setSpriteState("walkForward");
        alex.moveDown();
    }
    

}


function defineAlexSprite()
{
    alex = new Sprite("alex");
    alex.setup(ga);
       
    alex.easyDefineSequence("alex", "../../assets/alex/ALEX_STANCE.png", 3, 4, 112, 113, tc.constants.FAST_ACTION, tc.constants.playInfinite);

    
    var sequence = [];
    sequence.push(new Frame(0, 0, 122, 120, tc.constants.LIGHT_ACTION)); 
    sequence.push(new Frame(0, 1, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(0, 2, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(0, 3, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 0, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 1, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 2, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 3, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 0, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 1, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 3, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 3, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(3, 0, 122, 120, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(3, 1, 122, 120, tc.constants.LIGHT_ACTION));
    alex.defineSequence("walkForward", "../../assets/alex/ALEX_WALK_FORWARD.png", sequence, tc.constants.playInfinite);

    sequence = [];
    sequence.push(new Frame(0, 0, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 1, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 2, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 3, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 4, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 0, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 1, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 2, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 3, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 4, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 0, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 1, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 3, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 3, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 4, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 0, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 1, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 2, 120, 172, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 3, 120, 172, tc.constants.FAST_ACTION));
    alex.defineSequence("attack", "../../assets/alex/ALEX_PUNCH.png", sequence, 1);

    sequence = [];    
    sequence.push(new Frame(0, 0, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 1, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 2, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 4, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(0, 5, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 0, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 1, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 2, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 4, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(1, 5, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 0, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 1, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 4, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(2, 5, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 0, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 1, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 3, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 4, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(3, 5, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(4, 0, 150, 218, tc.constants.FAST_ACTION));
    sequence.push(new Frame(4, 1, 150, 218, tc.constants.FAST_ACTION));
    alex.defineSequence("fall", "../../assets/alex/ALEX_FALL.png", sequence, 1);

    
    alex.setRightSpeed(1);
    alex.setLeftSpeed(1);
    alex.setUpSpeed(1);
    alex.setDownSpeed(1);
    alex.setInSpeed(1);
    alex.setOutSpeed(1);
    alex.setTop(ga.getCanvasHeight() * .7);
    alex.setLeft(ga.getCanvasWidth() * .7);
    alex.setTopBorder(ga.getCanvasHeight() * .65);
    alex.setBottomBorder(ga.getCanvasHeight() - 5);
    alex.setLeftBorder(0);
    alex.setRightBorder(ga.getCanvasWidth() * .9);
    
    alex.setSpriteXDirection(tc.constants.SPRITE_INVERTED);

}


function defineRyuSprite() {
    ryu = new Sprite("ryu");
    ryu.setup(ga);

    ryu.setTopBorderMoveStyle("block");
    ryu.setBottomBorderMoveStyle("block");
    ryu.setSpriteType("player");


    //define a single sequence to start - 
    var sequence = [];
    sequence.push(new Frame(0, 0, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(0, 1, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(0, 2, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(0, 3, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 0, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 1, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 2, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(1, 3, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 0, 111, 78, tc.constants.LIGHT_ACTION));
    sequence.push(new Frame(2, 1, 111, 78, tc.constants.LIGHT_ACTION));


    var walkingForward = [];
    walkingForward.push(new Frame(0, 0, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(0, 1, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(0, 2, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(0, 3, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(1, 0, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(1, 1, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(1, 2, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(1, 3, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(2, 0, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(2, 1, 113, 112, tc.constants.FAST_ACTION));
    walkingForward.push(new Frame(2, 2, 113, 112, tc.constants.FAST_ACTION));

    var attack = [];
    attack.push(new Frame(0, 0, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(0, 1, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(0, 2, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(1, 0, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(1, 1, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(1, 2, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(2, 0, 105, 127, tc.constants.FAST_ACTION));
    attack.push(new Frame(2, 1, 105, 127, tc.constants.FAST_ACTION));


    ryu.easyDefineSequence("fall", "../../assets/ryu/RYU_FALL.png", 5, 5, 120, 178, tc.constants.FAST_ACTION, 1);
    ryu.defineSequence("attack", "../../assets/ryu/RYU_PUNCH1.png", attack, 1);
    ryu.defineSequence("ryu", "../../assets/ryu/RYU_STANCE.png", sequence, tc.constants.playInfinite);
    ryu.defineSequence("walkForward", "../../assets/ryu/RYU_WALKING.png", walkingForward, tc.constants.playInfinite);
    ryu.defineSequence("walkBack", "../../assets/ryu/RYU_WALKING2.png", walkingForward, tc.constants.playInfinite);
    


    if (!DetectAppleMobile() && !DetectAndroid()) {
        ryu.setRightSpeed(15);
        ryu.setLeftSpeed(15);
        ryu.setUpSpeed(15);
        ryu.setDownSpeed(15);
        ryu.setInSpeed(15);
        ryu.setOutSpeed(15);
    }
    else {
        ryu.setRightSpeed(50);
        ryu.setLeftSpeed(50);
        ryu.setUpSpeed(50);
        ryu.setDownSpeed(50);
        ryu.setInSpeed(50);
        ryu.setOutSpeed(50);
    }
    ryu.setTop(ga.getCanvasHeight() * .7);
    ryu.setLeft(ga.getCanvasWidth() * .2);
    ryu.setTopBorder(ga.getCanvasHeight() * .65);
    ryu.setBottomBorder(ga.getCanvasHeight() - 5);
    ryu.setLeftBorder(0);
    
    

}




var forwardSteps = 0;
var STEPS_TILL_FLIP = 5;

function handleTouch(tehEvent) {

    if (tehEvent.touches.length > 1) {
        setRyuAttack();
    }
    else {
        var touch = tehEvent.touches[0];
        moveToTouch(touch);
    }


}

function moveToTouch(touch) {
    //get the location of the touch, move ryu toward there
    
    if (touch.pageX < ryu.absoluteLeft()) {
        moveLeft(); 
    }
    if (touch.pageX > ryu.absoluteRight()) {
        moveRight(); 
    }
    if (touch.pageY < ryu.absoluteTop()) {
        ryu.moveUp(); 
    }
    if (touch.pageY > ryu.absoluteTop()) {
        ryu.moveDown(); 
    }
}

var flag = 0;
function moveToMouse(tehEvent) {


    
        if (flag == 0) {
            ga.addEventBehavior(ga.gameEvents.MouseMove, "", ryu, "walkForward", moveToMouse, tc.constants.playInfinite);
            flag = 1;
        }
        
        if (tehEvent.offsetX < ryu.absoluteLeft())
        { moveLeft(); }
        if (tehEvent.offsetX > ryu.absoluteRight())
        { moveRight(); }
        if (tehEvent.offsetY < ryu.absoluteTop())
        { ryu.moveUp(); }
        if (tehEvent.offsetY > ryu.absoluteTop())
        { ryu.moveDown(); }
  
}

function resetMove() {
    if (flag == 1) {
        ga.removeEventBehavior(ga.gameEvents.MouseMove, ryu);
        flag = 0;
    }

}


function moveRight()
{
    if (ryu.getSpriteState() == "attack" || ryu.getSpriteState() == "fall")
    {
        return;
    }


    //check the sprite direction -
    if (ryu.getSpriteXDirection() == tc.constants.SPRITE_INVERTED)
    {
        //if i'm inverted (ie, I'm facing left) then I only want the 
        //walk back animation to play a few times before I invert and then play 
        //walk forward         
        forwardSteps++;
        if (forwardSteps > STEPS_TILL_FLIP)
        {
            //invert
            ryu.setSpriteXDirection(tc.constants.SPRITE_NORMAL);

            //change the walk back animation to walk left animation to walk forward
            ga.modEventBehavior(ga.gameEvents.KeyDown, tc.constants.RIGHTARROW, ryu, "walkForward", moveRight, tc.constants.playInfinite);
            ga.modEventBehavior(ga.gameEvents.KeyDown, tc.constants.LEFTARROW, ryu, "walkBack", moveLeft, tc.constants.playInfinite);
            forwardSteps = 0;
        }
    }

    ryu.moveRight();
}

var backSteps = 0;
 function moveLeft()
{
    if (ryu.getSpriteState() == "attack" || ryu.getSpriteState() == "fall")
    {
        return;
    }

    //check the sprite direction -
    if (ryu.getSpriteXDirection() != tc.constants.SPRITE_INVERTED)
    {
        //if i'm not inverted (ie, I'm facing right) then I only want the 
        //walk back animation to play a few times before I invert and then play 
        //walk forward         
        forwardSteps++;
        if (forwardSteps > STEPS_TILL_FLIP)
        {
            //invert
            ryu.setSpriteXDirection(tc.constants.SPRITE_INVERTED);

            //change the walk back animation to walk left animation to walk forward
            ga.modEventBehavior(ga.gameEvents.KeyDown, tc.constants.RIGHTARROW, ryu, "walkBack", moveRight, tc.constants.playInfinite);
            ga.modEventBehavior(ga.gameEvents.KeyDown, tc.constants.LEFTARROW, ryu, "walkForward", moveLeft, tc.constants.playInfinite);
            forwardSteps = 0;
        }
    }

    ryu.moveLeft();

}


function setAtTopBorder()
{
    ryu.setTop(10);
}

function setAtBottomBorder()
{
    ryu.setTop(400);

}

       

