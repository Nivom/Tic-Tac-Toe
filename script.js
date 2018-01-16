"use strict";

$(document).ready(function() {
    const AI_REACTION_TIME = 750;

    var isPlayerOneTurn;
    var playerOneMark = "X";
    var playerTwoMark = "O"; 
    var isPvP = false;
    var isGamePlaying = false;
    var turnCount = 1;
    var firstPlayerMove;
    
    var btnSettingsAnimationTime = 93.75;
    var baseBtnBackgroundColor = $(".btn-settings").css("background-color");
    var highlightBtnColor = "#33c7d2";


    /* Grid layout:
    T = Top
    B = Bottom
    L = Left
    R = Right

    corner-TL . edge-T . corner-TR
    ..............................
       edge-L . center . edge-R
    ..............................
    corner-BL . edge-B . corner-BR
     */
    var grid = {
        "corner-TL": null,
        "edge-T": null,
        "corner-TR": null,
        "edge-L": null,
        "center": null,
        "edge-R": null,
        "corner-BL": null,
        "edge-B": null,
        "corner-BR": null
    };


    $("#player-1-mark").html("Player 1: " + playerOneMark);
    $("#player-2-mark").html("Player 2: " + playerTwoMark);



    /* ---- AI behaviors ---- */

    /* Checks if a win is going to happen next square. If there is, return that square */
    function findNextWinningSquare(playerMark) {

        // Checking if can win from the center        
        if (grid["center"] == playerMark) {
            
            if (grid["edge-L"] == playerMark && !grid["edge-R"]) {
                return "edge-R";

            } else if (grid["edge-R"] == playerMark && !grid["edge-L"]) {
                return "edge-L";

            } else if (grid["edge-T"] == playerMark && !grid["edge-B"]) {
                return "edge-B";

            } else if (grid["edge-B"] == playerMark && !grid["edge-T"]) {
                return "edge-T";

            } else if (grid["corner-TL"] == playerMark && !grid["corner-BR"]) {
                return "corner-BR";

            } else if (grid["corner-BR"] == playerMark && !grid["corner-TL"]) {
                return "corner-TL";

            } else if (grid["corner-TR"] == playerMark && !grid["corner-BL"]) {
                return "corner-BL";

            } else if (grid["corner-BL"] == playerMark && !grid["corner-TR"]) {
                return "corner-TR";

            }
        } else if (grid["corner-TL"] == playerMark) {

            if (grid["corner-TR"] == playerMark && !grid["edge-T"]) {
                return "edge-T";
                
            } else if (grid["edge-T"] == playerMark && !grid["corner-TR"]) {
                return "corner-TR";

            } else if (grid["corner-BL"] == playerMark && !grid["edge-L"]) {
                return "edge-L";

            } else if (grid["edge-L"] == playerMark && !grid["corner-BL"]) {
                return "corner-BL";

            }
    
        } else if (grid["corner-TR"] == playerMark) {

            if (grid["edge-T"] == playerMark && !grid["corner-TL"]) {
                return "corner-TL";

            } else if (grid["edge-R"] == playerMark && !grid["corner-BR"]) {
                return "corner-BR";

            } else if (grid["corner-BR"] == playerMark && !grid["edge-R"]) {
                return "edge-R";

            } 
        } else if (grid["corner-BL"] == playerMark) {

            if (grid["edge-L"] == playerMark && !grid["corner-TL"]) {
                return "corner-TL";

            } else if (grid["edge-B"] == playerMark && !grid["corner-BR"]) {
                return "corner-BR";

            } else if (grid["corner-BR"] == playerMark && !grid["edge-B"]) {
                return "edge-B";

            }
        } else if (grid["corner-BR"] == playerMark) {

            if (grid["edge-B"] == playerMark && !grid["corner-BL"]) {
                return "corner-BL";

            } else if (grid["edge-R"] == playerMark && !grid["corner-TR"]) {
                return "corner-TR";
                
            }
        }
        return false;
    }


    function decideAI() {

        // When we refer to the player, we assume playerOne as AI is always playerTwo

        if (!grid["center"]) {
            setTimeout(() => {
                checkSquare("center");
            }, AI_REACTION_TIME);
            return;
        }

        /* If the AI can win this turn, it does. 
        If it can't but the player can win next turn,
        don't let him win */
        var myNextWinSquare = findNextWinningSquare(playerTwoMark);
        var playerNextWinSquare = findNextWinningSquare(playerOneMark);
        if (myNextWinSquare) {
            setTimeout(() => {
                checkSquare(myNextWinSquare);
            }, AI_REACTION_TIME);
            return;

        } else if (playerNextWinSquare) {
            setTimeout(() => {
                checkSquare(playerNextWinSquare);
            }, AI_REACTION_TIME);
            return;
        }

        if (turnCount == 4) {
            if (grid["center"] == playerOneMark) {
                if (grid["corner-BL"] == playerOneMark) {
                    setTimeout(() => {
                        checkSquare("corner-TL");
                    }, AI_REACTION_TIME);
                    return;
                } else if (grid["corner-TL"] == playerOneMark) {
                    setTimeout(() => {
                        checkSquare("corner-BL");
                    }, AI_REACTION_TIME);
                    return;
                } else if (grid["corner-TR"] == playerOneMark) {
                    setTimeout(() => {
                        checkSquare("corner-BR");
                    }, AI_REACTION_TIME);
                    return;
                } else if (grid["corner-BR"] == playerOneMark) {
                    setTimeout(() => {
                        checkSquare("corner-TR");
                    }, AI_REACTION_TIME);
                    return;
                }
            }
        }
    

        /* If the AI decides on turn 3, it is playerOne.
        Also the AI will ALWAYS go for the center as a first play */
        if (turnCount == 3) { // Assuming that the AI plays first at the start of the game.
            // If player1 played an edge, start the trap and win next turn or the turn after that
            if (grid["edge-L"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-BR");
                }, AI_REACTION_TIME);
                
            } else if (grid["edge-T"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-BL");
                }, AI_REACTION_TIME);
                
            } else if (grid["edge-R"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-TL");
                }, AI_REACTION_TIME);
                
            } else if (grid["edge-B"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-TR");
                }, AI_REACTION_TIME);
                
            } 
            // If the player didn't start with an edge, then it's a bit more difficult
            else if (grid["corner-TL"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-BR");
                }, AI_REACTION_TIME);
                
            } else if (grid["corner-TR"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-TL");
                }, AI_REACTION_TIME);
                
            } else if (grid["corner-BL"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-TR");
                }, AI_REACTION_TIME);
                
            } else if (grid["corner-BR"] == playerOneMark) {
                setTimeout(() => {
                    checkSquare("corner-TL");
                }, AI_REACTION_TIME);
            }
            return;
        } else {
            // If player1 tried to stop our win attempt, trap him and win next turn
            if (grid["edge-L"] == playerOneMark && grid["corner-TL"] == playerOneMark) {
                if (!grid["corner-BL"]) {
                    setTimeout(() => {
                        checkSquare("corner-BL");
                    }, AI_REACTION_TIME);
                    return;
                }
            }
            
            if (grid["edge-T"] == playerOneMark && grid["corner-TR"] == playerOneMark) {
                if (!grid["corner-TL"]) {
                    setTimeout(() => {
                        checkSquare("corner-TL");
                    }, AI_REACTION_TIME);
                    return;
                }
            }
            
            if (grid["edge-R"] == playerOneMark && grid["corner-BR"] == playerOneMark) {
                if (!grid["corner-TR"]) {
                    setTimeout(() => {
                        checkSquare("corner-TR");
                    }, AI_REACTION_TIME);
                    return;
                }
            }
            
            if (grid["edge-B"] == playerOneMark && grid["corner-BL"] == playerOneMark) {
                if (!grid["corner-BR"]) {
                    setTimeout(() => {
                        checkSquare("corner-BR");
                    }, AI_REACTION_TIME);
                    return;
                }
            } 

            for (var square in grid) {
                if (!grid[square]) {
                    setTimeout(() => {
                        checkSquare(square);
                    }, AI_REACTION_TIME);
                    break;
                }
            }
            return;
        }

    }


    /* ---- Custom functions ---- */

    function clearGrid() {
        var squares = document.getElementsByClassName("grid-square");
        for (var i = 0; i < squares.length; i++) {
            $(squares[i]).html(" ");
        }
        Object.keys(grid).forEach(function(key){
            grid[key] = null;
        });
    }


    function startGame() {
        if (playerOneMark == "X") {
            isPlayerOneTurn = true;
        } else {
            isPlayerOneTurn = false;
        }
        turnCount = 1;
        isGamePlaying = true;
        clearGrid();

        if (!isPlayerOneTurn && !isPvP) { 
            $("#turn").html("Turn: AI");
            decideAI(); 
        } else if (!isPlayerOneTurn) {
            $("#turn").html("Turn: Player 2");
        } else {
            $("#turn").html("Turn: Player 1");
        }
    }

    function checkSquare(squareID) { 
        var squareMark = $(squareID).html();

        if (isPlayerOneTurn) {
            grid[squareID] = playerOneMark;
            if (turnCount == 1) {
                firstPlayerMove = squareID;
            }
            $("#" + squareID).html("<div class=\"marked\">" + playerOneMark + "</div>");
        } else {
            grid[squareID] = playerTwoMark;
            $("#" + squareID).html("<div class=\"marked\">" + playerTwoMark + "</div>");
        }
        turnCount++;
        if (isGameWon()) {
            isGamePlaying = false;

            setTimeout(() => {
                if (isPlayerOneTurn) {
                    alert("Player One won the game");
                } else {
                    alert("Player Two won the game");
                }
            }, 1000);
            
            

            setTimeout(() => {
                $("#turn").html(" ");
                clearGrid();
                $("#btn-play-game").html("PLAY");
            }, 1000);

        } else {
            switchTurns();
        }
    }


    function switchTurns() {
        var numberOfMarkedSquares = 0;

        for (var square in grid) {
            if (grid[square] == playerOneMark || grid[square] == playerTwoMark) {
                numberOfMarkedSquares++;
            }
        }
        // If all squares are taken and this function was called, then the game is a draw
        if (numberOfMarkedSquares == Object.keys(grid).length) {
            isGamePlaying = false;
            $("#turn").html(" ");

            setTimeout(() => {
                alert("The game is a draw.");
                clearGrid();
                $("#btn-play-game").html("PLAY");
            }, 1000);
        }
        
        isPlayerOneTurn = !isPlayerOneTurn;

        if (!isPlayerOneTurn && !isPvP) {
            $("#turn").html("Turn: AI");
            decideAI();
        } else if (!isPlayerOneTurn) {
            $("#turn").html("Turn: Player 2");
        } else {
            $("#turn").html("Turn: Player 1");
        }
    }


    function isGameWon() { 
        var curMark;

        if (isPlayerOneTurn) {
            curMark = playerOneMark;
        } else {
            curMark = playerTwoMark;
        }
        
        // We don't need to check every square for adjacents marks, only certain key squares because of redundance 
        if (grid["center"] === curMark) {
            if (grid["corner-TL"] === curMark && grid["corner-BR"] === curMark) {
                return true;
            } else if (grid["edge-T"] === curMark && grid["edge-B"] === curMark) {
                return true;
            } else if (grid["corner-TR"] === curMark && grid["corner-BL"] === curMark) {
                return true;
            } else if (grid["edge-L"] === curMark && grid["edge-R"] === curMark) {
                return true;
            }
        }
        
        if (grid["edge-T"] === curMark) {
            if (grid["corner-TL"] === curMark && grid["corner-TR"] === curMark) {
                return true;
            }
        }
        
        if (grid["edge-L"] === curMark) {
            if (grid["corner-TL"] === curMark && grid["corner-BL"] === curMark) {
                return true;
            }
        }
        
        if (grid["edge-R"] === curMark) {
            if (grid["corner-TR"] === curMark && grid["corner-BR"] === curMark) {
                return true;
            }
        }
        
        if (grid["edge-B"] === curMark) {
            if (grid["corner-BL"] === curMark && grid["corner-BR"] === curMark) {
                return true;
            }
        }

        return false;
    }


    /* ---- JQuery events ---- */

    $("#btn-play-game").click(function() {
        if (!isGamePlaying) {
            startGame();
            $(this).html("STOP");
        } else {
            isGamePlaying = false;
            $("#turn").html(" ");
            clearGrid();
            $(this).html("PLAY");
            console.log("Game is already playing");
        }
        
    });


    $(".btn-settings").click(function() {

        $(this).css("background-color", highlightBtnColor);
        setTimeout(() => {
            $(this).css("background-color", baseBtnBackgroundColor);
        }, btnSettingsAnimationTime);
    });


    $("#btn-mark").click(function() {
        if (!isGamePlaying) {
            if (playerOneMark == "X") {
                playerOneMark = "O";
                playerTwoMark = "X";
            } else {
                playerOneMark = "X";
                playerTwoMark = "O";
            }
    
            $("#player-1-mark").html("Player 1: " + playerOneMark);
            $("#player-2-mark").html("Player 2: " + playerTwoMark);
        }
        
    });


    $("#btn-play-mode").click(function() {
        if (!isGamePlaying) {
            if ($(this).html() == "Player vs AI") {
                $(this).html("Player vs Player");
                isPvP = true;
            } else {
                $(this).html("Player vs AI");
                isPvP = false;
            }
        }
        
    });


    $(".grid-square").click(function() {
        var contents = $(this).html();

        if (isGamePlaying) {

            // Can't play if it's the AI's turn
            if ((!isPvP && !isPlayerOneTurn) || (contents != " ")) { return; }

            let squareID = $(this).attr("id");
            checkSquare(squareID);
        }

    });

});