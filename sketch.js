
//Optimizations to this code
//To run on many sizes of windows the text size should be division of the width, this will give you the same number of lines 
//There is a way to make it many directions, but the following would need to be accounted for: 
//  - Text not just at y position for start and movement
//  - A random set of phases could be used rather than just random letters


//Global 
var symbol; //A single symbol
//var stream; //The stream of symbols 
var streams = []; 

//set the speed that symbols fall. 
var minSpeed = 1; 
var maxSpeed = 3; 
//Set the starting position range (0-1 of screen hight)
var minStart = 0; 
var maxStart = 0.1; 
//Set when the symbols change (measured as frames per seconds)
var minChange = 10; 
var maxChange = 50; 
//Set the number of symbols per stream 
var minSymbol = 5; 
var maxSymbol = 20; 
//Set the first symbol color 
var fRed = 180; 
var fGreen = 255; 
var fBlue = 180; 
//Set the other symbols colors  
var oRed = 0; 
var oGreen = 255; 
var oBlue = 70; 
//Set the chance of having a different color first symbol 
var colorFirst = 0.2;
//Set the blur range 
var blurOpacity = 80;  
//Size of the symbol
var symbolSize = 20;

function setup() {

    createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    background(0);

    //Multiple streams 
    var x = 0; 
    //var y = 0;
    for(var i = 0; i <= width / symbolSize; i++){
        var y = random(minStart, maxStart); //Start at a random position on the top half of the screen        
        var stream = new Stream(); 
        stream.generateSymbols(x, round(y * window.innerHeight)); 
        streams.push(stream); 
        x += symbolSize
    }

    //Single stream 
    // stream = new Stream(); 
    // stream.generateSymbols(); 


    // //create a symbol object (the "Rain Drop")
    //     symbol = new Symbol(
    //         width/2, 0, 
    //         random(3, 7) 
    //         //y is set to 0 so the symbol starts are the top, this can be changed if differnt directions are used. 
    //         //random sets the speed, how many pixels per frame. 
    //     );
    //     symbol.setToRandomSymbol(); 
    textSize(symbolSize);

    streams.forEach(function(streams){
        streams.render(); 
    }); 
}


//Is called 60 fps 
function draw() {
    background(0, blurOpacity); //Create a blur effect for the symbols
    //symbol.render(); //Render single symbol 
    //stream.render(); //Render single stream 

    streams.forEach(function(stream){
        stream.render(); 
    }); 


}

function Symbol(x, y, speed, first) {
    //Position on the screen for the letter to start
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;
    this.switchInterval = round(random(minChange, maxChange));  //This sets the frame variance for switching (how often)
    this.first = first; 

    //Set the character from a random amount 
    this.setToRandomSymbol = function () {
        if (frameCount % this.switchInterval == 0) { //This moderates whent the symbol is switched 
            this.value = String.fromCharCode(
                //This is the first character plus a random int from the next characters, 96 total
                //For mine this should custom sentences that I want to show
                0x30A0 + round(random(0, 96))
            );
        }

    }

    //Used of single symbol, not needed with an array, but can be used again if random phrases are used
    //Render the code to the window
    // this.render = function (){
    //     fill(0, 255, 70); 
    //     text(this.value, this.x, this.y); //this.value is the symbol
    //     this.rain(); 
    //     this.setToRandomSymbol(); //Change to a new random symbol
    // }

    //Makes the symbols move, 
    //var direction = -+y and -+x to change the direction 
    this.rain = function () {
        //Check to see if the symbol has reached the bottom 
        if (this.y >= height) {
            this.y = 0;
        } else {
            this.y += this.speed;
        }

        //turnary operator for above
        //this.y = (this.y >= height) ? 0 : this.y += this.speed; 
    }
}

function Stream() {
    this.symbols = []
    this.totalSymbols = round(random(minSymbol, maxSymbol)); //How many symbols in the stream
    this.speed = random(minSpeed, maxSpeed);

    this.generateSymbols = function (x, y) {
        //Startin position of the symbol stream
        // var y = 0;
        // var x = width / 2;
        //var first = true; 
        var first = random(0,1) <= colorFirst; 
        for (var i = 0; i <= this.totalSymbols; i++) {
            symbol = new Symbol(x, y, this.speed, first);
            symbol.setToRandomSymbol();
            this.symbols.push(symbol); //Push this new symbol into the array
            y -= symbolSize;
            first = false; 
        }
    }

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            if(symbol.first){
                fill(fRed, fGreen, fBlue); 
            } else {
                fill(oRed, oGreen, oBlue);
            }
            text(symbol.value, symbol.x, symbol.y); //this.value is the symbol
            symbol.rain();
            symbol.setToRandomSymbol(); //Change to a new random symbo
        });
    }

}
