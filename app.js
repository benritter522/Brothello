// black always moves first in othello
// less experienced player should choose black

// modal

// set up players 1 and 2
// player 1 readout
// player 2 readout

let player1 = true; //black plays first

let player1CanMove = true;
let player2CanMove = true;

let canPlace = false;

let blackCount = 0;
let whiteCount = 0;



// ==============================================================================================================
// START Declare neighbor direction arrays. Left-right, top-bottom.

const x_neighborDirections = [ 0,
    -1,     // neigbor 1
    -1,     // neigbor 2
    -1,     // neigbor 3
    0,      // neigbor 4
    0,      // neigbor 5 = SELF
    0,      // neigbor 6
    1,      // neigbor 7
    1,      // neigbor 8
    1,      // neigbor 9
]

const y_neighborDirections = [ 0,
    -1,     // neigbor 1
    0,      // neigbor 2
    1,      // neigbor 3
    -1,     // neigbor 4
    0,      // neigbor 5 = SELF
    1,      // neigbor 6
    -1,     // neigbor 7
    0,      // neigbor 8
    1,      // neigbor 9
]
// END Declare neighbor direction arrays
// ==============================================================================================================


// ==============================================================================================================
// ==============================================================================================================
// START Board Class

class Board {
    constructor() {
        // this.array2D = [];
    }
    createGrid() {      // intial board setup as a 2D array of divs
        for(let x = 0; x < 10; x ++) {
            for(let y = 0; y < 10; y ++) {
                const piece = new Piece(x, y);
                piece.makePieceDiv();//piece.x, piece.y);
            }
        }
    }
    setUpStart() {      // set up the 4 starting pieces

        const starterWhitePieces = [
            document.getElementById('R4C4'),
            document.getElementById('R5C5')
        ]

        const starterBlackPieces = [
            document.getElementById('R4C5'),
            document.getElementById('R5C4')
        ]

        starterBlackPieces.forEach(element => {
            element.classList.add('black');
            blackCount ++;
        });

        starterWhitePieces.forEach(element => {
            element.classList.add('white');
            whiteCount ++;
        });
        updatePieceCounters();            

    }
}
// END Board Class
// ==============================================================================================================


// ==============================================================================================================
// ==============================================================================================================
// START Piece Class

class Piece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    makePieceDiv() { 
        const spaceDiv = document.createElement('div');
        const pieceDiv = document.createElement('div');
        const gridDiv = document.querySelector('.grid');
        
        spaceDiv.classList.add('spaces');
        pieceDiv.classList.add('pieces');
        // pieceDiv.classList.add('empty');
        
        // weeds out the edge layer of the board
        if(this.x === 0 || this.y === 0 || this.x === 9 || this.y === 9) {
            spaceDiv.classList.add('edgeSpaces');

            if(!(this.x === 0 && this.y === 0)) {
                if(this.x === 0 && this.y !== 9) {
                    spaceDiv.innerText = this.y;
                } else if (this.y === 0 && this.x !== 9) {
                    spaceDiv.innerText = this.x;
                } 
            } 
        
        } else {
            // if piece is not an edge space, adds a piece with an event listener
            spaceDiv.classList.add('gameSpaces'); 
            spaceDiv.appendChild(pieceDiv);
            pieceDiv.addEventListener("click", this.placePiece);
        }

        // the id's are columns in the grid
        spaceDiv.id = `R${this.x}C${this.y}Space`;
        pieceDiv.id = `R${this.x}C${this.y}`;
        
        gridDiv.appendChild(spaceDiv);
        // console.log(spaceDiv.classList.item(1)); // THIS IS IMPORTANT FOR ANOTHER IDEA  
    }

    placePiece() { 
        
        // if using 'e' MUST USE .TARGET BEFORE DOING STUFF!!!!!!!!
        // console.log(e.target);
        if(player1CanMove || player2CanMove) {

            if(this.classList.contains('black') || this.classList.contains('white')) {
                // invalidMoveAlert();
                // canPlace = false;
            }
            else {
                // console.log("new piece being placed");
                
                // need to make this alternate every other turn.....that's a later problem for now, use black
                if(player1) {
                    this.classList.add('black'); 
                    
                } else { 
                    this.classList.add('white'); // if invalid space, must do this.classList.remove('white') later
                }
                
                // grab center element's x and y indicies. right-left, top-bottom. 5 is center, AKA the piece being placed
                const x_center = grabSecondCharAsNumber(this.id);
                const y_center = grabFourthCharAsNumber(this.id);
                
                // for each neighbor
                console.log(this.id + " played");
                for(let i = 1; i <= 9; i++) {
                    if(i !== 5) {
                        // console.log('neighbor ' + i);
                        const arr = [];
                        checkDirectionMove(i, x_center + x_neighborDirections[i], y_center + y_neighborDirections[i], arr);
                        // console.log(arr);
                    }
                }
                
                if(canPlace) {
                    document.querySelector('.whatsPlayed').innerText = `${this.id} was played.`;
                    
                    if(player1) {
                        player1 = false;
                        blackCount ++;
                        document.querySelector('.whosTurn').innerText = 'It\'s player 2\'s turn. \nPlay a white piece.';
                    } 
                    else { 
                        player1 = true;
                        whiteCount ++;
                        document.querySelector('.whosTurn').innerText = 'It\'s player 1\'s turn. \nPlay a black piece.';
                    }
                    canPlace = false;
                } else {
                    // invalidMoveAlert();
                    this.classList.remove('black');
                    this.classList.remove('white');
                }
                updatePieceCounters();    
                // checkEndCondition();        
            }
        } else {
            gameOver();
        }
    }

    // checkNeighbors() {}

    // flipSandwhichMeats(){}

    // becomeBlack() {}

    // becomeWhite() {}

}
// END Piece Class
// ==============================================================================================================



// ==============================================================================================================
// Functions outside of classes
// ==============================================================================================================

    // const isValidSpace = (x,y) => {
    //     console.log("hello world");
    //     // const center = document.getElementById(`R${x}C${y}Piece`);
    //     // console.log(center.id);
    // }

const checkDirectionMove = (indexDir, xDir, yDir, arr) =>{
    const neighbor = document.getElementById(`R${xDir}C${yDir}`);

    if(isPiece(neighbor)) {
        if(player1 && neighbor.classList.contains('white')) {   
            arr.push(neighbor.id);
            // console.log(neighbor.id);
            // console.log(arr);
            checkDirectionMove(indexDir, xDir + x_neighborDirections[indexDir], yDir + y_neighborDirections[indexDir], arr);
        } else if (!player1 && neighbor.classList.contains('black')) {
            arr.push(neighbor.id);
            // console.log(neighbor.id);
            // console.log(arr);
            checkDirectionMove(indexDir, xDir + x_neighborDirections[indexDir], yDir + y_neighborDirections[indexDir], arr);
        } else if (arr.length > 0 && ((player1 && neighbor.classList.contains('black')) || (!player1 && neighbor.classList.contains('white')))) {
            document.querySelector('.whatFlipped').innerText = `${arr} were flipped.`;
            flipSandwhichMeats(arr);
            canPlace = true;
            return arr;
        }
    } 
}

const flipSandwhichMeats = (arr) => {
    arr.forEach(element => {
        document.getElementById(element).classList.toggle('black');
        document.getElementById(element).classList.toggle('white');
        if(player1) {
            blackCount ++;
            whiteCount --;
        } else { 
            whiteCount ++;
            blackCount --;
        }
    });
}

const isPiece = (location) => {
    if(location && (location.classList.contains('black') || location.classList.contains('white'))) {      // if not null 
        return true;
    }
}

// const checkDirectionForEnd = (indexDir, xDir, yDir, arr) =>{
//     const neighbor = document.getElementById(`R${xDir}C${yDir}`);

//     if(isPiece(neighbor)) {
//         if(player1 && neighbor.classList.contains('white')) {   
//             arr.push(neighbor.id);
//             checkDirectionForEnd(indexDir, xDir + x_neighborDirections[indexDir], yDir + y_neighborDirections[indexDir], arr);
//         } else if (!player1 && neighbor.classList.contains('black')) {
//             arr.push(neighbor.id);
//             checkDirectionForEnd(indexDir, xDir + x_neighborDirections[indexDir], yDir + y_neighborDirections[indexDir], arr);
//         } else if (arr.length > 0 && (player1 && neighbor.classList.contains('black'))) {
//             player1CanMove = true;
//             return arr;
//         } else if (arr.length > 0 && (!player1 && neighbor.classList.contains('white'))) {
//             player2CanMove = true;
//             return arr;
//         } 
//     }
// }

// const checkEndCondition = () => {
//     player1CanMove = false;
//     player2CanMove = false;
//     // need to loop through whole 2D array, elements 1 to 8 at least for just game pieces 
//     for(let x = 1; x <= 8; x++) {
//         for(let y = 1; y <= 8; y ++) {

//             pieceDiv = document.getElementById(`R${x}C${y}`);
            
//             // const x_center = grabSecondCharAsNumber(pieceDiv.id);
//             // const y_center = grabFourthCharAsNumber(pieceDiv.id);
//             if(!pieceDiv.classList.contains('black') && !pieceDiv.classList.contains('white')) {
//                 for(let i = 1; i <= 9; i++) {
//                     if(i !== 5) {
//                         // console.log('neighbor ' + i);
//                         const arr = [];
//                         checkDirectionForEnd(i, x + x_neighborDirections[i], y + y_neighborDirections[i], arr);
//                     }
//                 }
//             }
//         }
//     }
//     if((!player1CanMove && !player2CanMove) || (blackCount + whiteCount === 64)) {
//         gameOver();
//     }

// }

const gameOver = () => {
    if(blackCount > whiteCount) {
        alert(`Game over! Player 1 wins with ${blackCount} black pieces!`)
    } else if (whiteCount > blackCount) {
        alert(`Game over! Player 2 wins with ${whiteCount} white pieces!`)
    } else {
        alert(`Game over! It's a tie!`)
    }
}

const updatePieceCounters = () => {
    document.getElementById('blackCount').innerText = `Player 1 has ${blackCount} black pieces.`;
    document.getElementById('whiteCount').innerText = `Player 2 has ${whiteCount} white pieces.`;
}

const grabSecondCharAsNumber = (str) => {
    return Number(str[1]);
}
const grabFourthCharAsNumber = (str) => {
    return Number(str[3]);
}

const invalidMoveAlert = () => {
    alert('Please select a valid move.');

}

const board = new Board();
board.createGrid();
board.setUpStart();


// player tries to make a move
    // isValidMove()

        // checkSpaceIsAvailable()
            // Seeing if space is empty--has a value of 0. value of 1 means white, value of 2 means black, value of null means out of bounds

        // checkNeighbors()
            // checkSingleNeighbor() // --in given direction as parameter? --maybe temporarily assign ids to help with logistics if it gets messy // WHILE neighbor.value !== null ?? maybe??
                // if neighbor.value = 0 // || neighbor.value = null // -- could I just do if neighbor.value == 0 bc that's 'falsey' and so is null?
                    // return false for this neighbor
                // else if neighbor.value = this.value //if both black or both white
                    // return false for this neighbor
                // else
                    //  call checkSingleNeighbor() from this neighbor -- RECURSIONNNN

                    /*  going to need to make conditions for the end boundary 
                        that's the same value as the placed piece. 
                        Keep track of 'last piece checked in line' or something */

                    /*  if just one of the directions is valid for the move,
                        the move is valid. can return when that is true and exit the function*/

    // if move is valid
        // flip pieces() // check all possible directions, don't stop after one direction is valid. Can sandwich in multiple directions with one move.

            

// end condition
    // loop through all elements of both arrays AFTER EVERY PIECE IS PLACED
        // if checkSpaceIsAvailable() (if value is 0)
            // if any move is valid for placing a value 1 piece (white) OR if any move is valid for placing value 2 (black)
                // return false, gameOver is not true yet
            // else --so if there is no valid move for this space
                // continue through the loop....if you get through the whole look return true game is over...
                // maybe decided by the current element being checked being the last in the array? this loop
                // should never get to the end of the board if ANY move is possible bc it returns as soon
                // as it finds a valid move, so that should be airtight.....hopefully :)
            




// ==============================================================================================================
// ==============================================================================================================
// 11/19/20 CODE WITH COMMENTED OUT APPROACHES
// ==============================================================================================================
// ==============================================================================================================

// // black always moves first in othello
// // less experienced player should choose black

// // modal

// // set up players 1 and 2
// // player 1 readout
// // player 2 readout


// class Board {
//     constructor() {
//         // this.array2D = [];
//     }
//     createGrid() {

//         // intial board setup
//         // const gridDiv = document.querySelector('.grid');
        
//         // create 10x10 2D array
//         // const gridArray = [];
//         for(let x = 0; x < 10; x ++) {
//             for(let y = 0; y < 10; y ++) {
//                 const piece = new Piece(x, y);
//                 piece.makePieceDiv();//piece.x, piece.y);
//             }
//         }
//         // console.log(gridArray);
//         // outer row/column of the arrays = null
//         // 8x8 'active' spaces
//     }
//     setUpStart() {
//         // set up the 4 starting pieces
//         const starterWhitePieces = [
//             document.getElementById('R4C4Piece'),
//             document.getElementById('R5C5Piece')
//             // document.querySelector('.R4 .C4'), //couldn't use classes that start with numbers?
//             // document.querySelector('.R5 .C5')
//         ]

//         const starterBlackPieces = [
//             document.getElementById('R4C5Piece'),
//             document.getElementById('R5C4Piece')
//             // document.querySelector('.R4 .C5'),
//             // document.querySelector('.R5 .C4'),
//         ]

//         starterBlackPieces.forEach(element => {
//             element.classList.add('black');
//         });

//         starterWhitePieces.forEach(element => {
//             element.classList.add('white');
//         });
//     }
// }

// // Going to make a js class for player pieces
// class Piece {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }
//     makePieceDiv() { //x, y) {
//         const spaceDiv = document.createElement('div');
//         const pieceDiv = document.createElement('div');
//         const gridDiv = document.querySelector('.grid');
        
//         spaceDiv.classList.add('spaces');
//         pieceDiv.classList.add('pieces');
//         pieceDiv.classList.add('empty');
        
//         // weeds out the edge layer of the board
//         if(this.x === 0 || this.y === 0 || this.x === 9 || this.y === 9) {
//             spaceDiv.classList.add('edgeSpaces'); 
//         } else {
//             // if piece is not an edge space, adds a piece with an event listener
//             spaceDiv.classList.add('gameSpaces'); 
//             spaceDiv.appendChild(pieceDiv);
//             pieceDiv.addEventListener("click", this.placePiece);
//         }
        
//         // the id's are columns in the grid
//         spaceDiv.id = `R${this.x}C${this.y}Space`;
//         pieceDiv.id = `R${this.x}C${this.y}Piece`;
        
//         gridDiv.appendChild(spaceDiv);
//         /*
//         // // the classes are rows 
//         // spaceDiv.classList.add(`R${x}`);
//         // ghostPiece.classList.add(`R${x}`);
        
//         // //making class names that aren't purely numerical for debugging's sake
//         // spaceDiv.classList.add(`C${y}`);
//         // ghostPiece.classList.add(`C${y}`);
//         */
//         // console.log(spaceDiv.classList.item(1)); // THIS IS IMPORTANT FOR ANOTHER IDEA  
//     }

//     placePiece() { //could use e if needed for something, but what??

//         // alert(`you've clicked piece ${this.id}`); //  BIG MAN AT THE RIIIMMMMMMM

//         // isValidSpace(this.id);
        
//         // grab center element's x and y indicies
//         // going to refer to things as 1-9 with center being 5, top left being 1
//         const x_center = grabSecondCharAsNumber(this.id);
//         const y_center = grabFourthCharAsNumber(this.id);

//         const x_neighbors = [ 0,
        
//             x_center - 1,   // neigbor 1
//             x_center - 1,   // neigbor 2
//             x_center - 1,   // neigbor 3
//             x_center,       // neigbor 4
//             x_center,       // neigbor 5 = SELF
//             x_center,       // neigbor 6
//             x_center + 1,   // neigbor 7
//             x_center + 1,   // neigbor 8
//             x_center + 1,   // neigbor 9
//         ]

//         const y_neighbors = [ 0,
        
//             y_center - 1,   // neigbor 1
//             y_center,       // neigbor 2
//             y_center + 1,   // neigbor 3
//             y_center - 1,   // neigbor 4
//             y_center,       // neigbor 5 = SELF
//             y_center + 1,   // neigbor 6
//             y_center - 1,   // neigbor 7
//             y_center,       // neigbor 8
//             y_center + 1,   // neigbor 9
//         ]

//         for(let i = 1; i <= 9; i++) {
//             // console.log(x_neighbors[i],y_neighbors[i]);
//             if(i !== 5) {
//                 checkDirection(x_neighbors[i],y_neighbors[i]);
//             }
//         }


//         // isValidSpace(x,y);
        
//         /*  BRUTE FORCE IS NOT THE WAY TO GO I REFUUUUUUUSE
//             MUST FIND WAY TO LOOP, PASSING IN THE DIFFERENCE IN INDEX

//         const upLeftDiv = document.getElementById(`R${x-1}C${y-1}Piece`);
//         const upMidDiv = document.getElementById(`R${x-1}C${y}Piece`);
//         const upRightDiv = document.getElementById(`R${x-1}C${y+1}Piece`);
//         const leftMidDiv = document.getElementById(`R${x}C${y-1}Piece`);
//         // const center = document.getElementById(`R${x}C${y}Piece`);
//         const rightMidDiv = document.getElementById(`R${x}C${y+1}Piece`);
//         const downLeftDiv = document.getElementById(`R${x+1}C${y-1}Piece`);
//         const downMidDiv = document.getElementById(`R${x+1}C${y}Piece`);
//         const downRightDiv = document.getElementById(`R${x+1}C${y+1}Piece`);

//         // console.log(" ");
//         // console.log(center.id + " center"); //this.id
//         // console.log(" ");

        

//         if(upLeftDiv.classList.contains('white') || upLeftDiv.classList.contains('black')) { //if it's truthy AKA it exists :)
//             console.log(upLeftDiv.id + " up Left");
//             const xUpLeft = grabSecondCharAsNumber(upLeftDiv.id) - x;
//             const yUpLeft = grabFourthCharAsNumber(upLeftDiv.id) - y;
//             console.log(xUpLeft + " " + yUpLeft);

            
//             // checkDirection(xUpLeft, yUpLeft);
//             // while () {} // want this to run while upLeft piece's classList contains black or white
//                 // const upperleftdiv = document.getElementById(`R${x + xUpLeft}C${y + yUpLeft}Piece`)
            

//             this.classList.toggle('black');
//             this.classList.toggle('white');
//         }
//         if(upMidDiv) {
//             console.log(upMidDiv.id + " up Mid");
//         }
//         if(upRightDiv) {
//             console.log(upRightDiv.id + " up Right");
//         }
//         if(leftMidDiv) {
//             console.log(leftMidDiv.id + " left Mid");
//         }
//         if(rightMidDiv) {
//             console.log(rightMidDiv.id + " right Mid");
//         }
//         if(downLeftDiv) {
//             console.log(downLeftDiv.id + " down Left");
//         }
//         if(downMidDiv) {
//             console.log(downMidDiv.id + " down Mid");
//         }
//         if(downRightDiv) {
//             console.log(downRightDiv.id + " down Right");
//         }

//         */

//         // this.flipSandwhichMeats();

//         // this.classList.toggle('black'); // these need to be more specific...
//         // this.classList.toggle('white'); // shouldn't allow something to have both black and white classes at the same time
//     }
//     // // flipSandwhichMeats(){}
//     // becomeBlack() {}
//     // // toggle black class
//     // // toggle white class
//     // becomeWhite() {}
//     // // toggle black class
//     // // toggle white class
// }
    
//     // const isValidSpace = (x,y) => {
//     //     console.log("hello world");
//     //     // const center = document.getElementById(`R${x}C${y}Piece`);
//     //     // console.log(center.id);
//     // }
    
//     const checkDirection = (xDir, yDir) =>{

//         const neighbor = document.getElementById(`R${xDir}C${yDir}Piece`)
//         if(neighbor) {
//             console.log(neighbor.id);
//         }
//         // console.log(xUpLeft + " " + yUpLeft);
//     }

// const board = new Board();
// board.createGrid();
// board.setUpStart();

// const grabSecondCharAsNumber = (str) => {
//     return Number(str[1]);
// }
// const grabFourthCharAsNumber = (str) => {
//     return Number(str[3]);
// }
// // console.log(grabFirstCharAsNumber("5row")+5);

// // player tries to make a move
//     // isValidMove()

//         // checkSpaceIsAvailable()
//             // Seeing if space is empty--has a value of 0. value of 1 means white, value of 2 means black, value of null means out of bounds

//         // checkNeighbors()
//             // checkSingleNeighbor() // --in given direction as parameter? --maybe temporarily assign ids to help with logistics if it gets messy // WHILE neighbor.value !== null ?? maybe??
//                 // if neighbor.value = 0 // || neighbor.value = null // -- could I just do if neighbor.value == 0 bc that's 'falsey' and so is null?
//                     // return false for this neighbor
//                 // else if neighbor.value = this.value //if both black or both white
//                     // return false for this neighbor
//                 // else
//                     //  call checkSingleNeighbor() from this neighbor -- RECURSIONNNN

//                     /*  going to need to make conditions for the end boundary 
//                         that's the same value as the placed piece. 
//                         Keep track of 'last piece checked in line' or something */

//                     /*  if just one of the directions is valid for the move,
//                         the move is valid. can return when that is true and exit the function*/

//     // if move is valid
//         // flip pieces() // check all possible directions, don't stop after one direction is valid. Can sandwich in multiple directions with one move.

            

// // end condition
//     // loop through all elements of both arrays AFTER EVERY PIECE IS PLACED
//         // if checkSpaceIsAvailable() (if value is 0)
//             // if any move is valid for placing a value 1 piece (white) OR if any move is valid for placing value 2 (black)
//                 // return false, gameOver is not true yet
//             // else --so if there is no valid move for this space
//                 // continue through the loop....if you get through the whole look return true game is over...
//                 // maybe decided by the current element being checked being the last in the array? this loop
//                 // should never get to the end of the board if ANY move is possible bc it returns as soon
//                 // as it finds a valid move, so that should be airtight.....hopefully :)
            













// ==============================================================================================================
// ==============================================================================================================
// EARLY PURE PSEUDOCODE
// ==============================================================================================================
// ==============================================================================================================


// modal

// set up players 1 and 2
    // player 1 readout
    // player 2 readout


// Going to make a js class for player pieces

// intial board setup

    // create 10x10 2D array

        // outer row/column of the arrays = null
        // 8x8 'active' spaces

    // set up the 4 starting pieces

// player tries to make a move
    // isValidMove()

        // checkSpaceIsAvailable()
            // Seeing if space is empty--has a value of 0. value of 1 means white, value of 2 means black, value of null means out of bounds

        // checkNeighbors()
            // checkSingleNeighbor() // --in given direction as parameter? --maybe temporarily assign ids to help with logistics if it gets messy // WHILE neighbor.value !== null ?? maybe??
                // if neighbor.value = 0 // || neighbor.value = null // -- could I just do if neighbor.value == 0 bc that's 'falsey' and so is null?
                    // return false for this neighbor
                // else if neighbor.value = this.value //if both black or both white
                    // return false for this neighbor
                // else
                    //  call checkSingleNeighbor() from this neighbor -- RECURSIONNNN

                    /*  going to need to make conditions for the end boundary 
                        that's the same value as the placed piece. 
                        Keep track of 'last piece checked in line' or something */

                    /*  if just one of the directions is valid for the move,
                        the move is valid. can return when that is true and exit the function*/

    // if move is valid
        // flip pieces() // check all possible directions, don't stop after one direction is valid. Can sandwich in multiple directions with one move.

            

// end condition
    // loop through all elements of both arrays AFTER EVERY PIECE IS PLACED
        // if checkSpaceIsAvailable() (if value is 0)
            // if any move is valid for placing a value 1 piece (white) OR if any move is valid for placing value 2 (black)
                // return false, gameOver is not true yet
            // else --so if there is no valid move for this space
                // continue through the loop....if you get through the whole look return true game is over...
                // maybe decided by the current element being checked being the last in the array? this loop
                // should never get to the end of the board if ANY move is possible bc it returns as soon
                // as it finds a valid move, so that should be airtight.....hopefully :)