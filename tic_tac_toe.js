    //MiniMax Algorithm: https://en.wikipedia.org/wiki/Minimax
    var canvas = document.getElementById("tictactoe");
    var ctx = canvas.getContext("2d");
    ctx.font = "normal 14px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var boardWidth = 180;
    var boardHeight = 180;
    var boardCellWidth = boardWidth / 3.0;
    var boardCellHeight = boardHeight / 3.0;
    var boardStartX = (canvas.width - boardWidth) / 2.0;
    var boardStartY = (canvas.height - boardHeight) / 2.0;
    var board = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);/* board[9] stores number of pieces on the board */
    var infinity = 32000;
    var invalid = -1;
    var win = 100;
    var draw = 10;
    var empty = 0;
    var human = 1;
    var computer = 4;
    var turn = human;
    var gameResult = empty;
    var black = "#000000";
    var grey = "#eeeeee";
    var blue = "#0000ff";
    var darkBlue = "#000080";
    var orange = "#ff7f27";
    var strYourTurn = "Your Turn";
    var strThinking = "Thinking...";
    var strYouWin = "You Win. Click to restart.";
    var strYouLose = "You Lose. Click to restart.";
    var strDraw = "It's a Draw. Click to restart.";
    var aiSimDelay = 1000;
    var logMoves = false;
    
    function tttFindBestMove() {
        var index;
        var bestMoveRCIndex = invalid;
        var bestValue = -Infinity;
        var value;
        //Maximize the first ply
        for (index = 0; index < 9; ++index) {
            if (board[index] == empty) {
                board[index] = computer;
                ++board[9];
                //Apply minimax to other plies
                value = tttMiniMax(board, false, 0);
                if (value > bestValue) {
                    bestValue = value;
                    bestMoveRCIndex = index;
                }
                board[index] = empty;
                --board[9];
            }
        }
        return bestMoveRCIndex;
    }
    
    function tttMiniMax(tttBoard, maximizingPlayer, depth) {
        if ((tttBoard[0] == computer && tttBoard[1] == computer && tttBoard[2] == computer) ||
            (tttBoard[3] == computer && tttBoard[4] == computer && tttBoard[5] == computer) ||
            (tttBoard[6] == computer && tttBoard[7] == computer && tttBoard[8] == computer) ||
            (tttBoard[0] == computer && tttBoard[3] == computer && tttBoard[6] == computer) ||
            (tttBoard[1] == computer && tttBoard[4] == computer && tttBoard[7] == computer) ||
            (tttBoard[2] == computer && tttBoard[5] == computer && tttBoard[8] == computer) ||
            (tttBoard[0] == computer && tttBoard[4] == computer && tttBoard[8] == computer) ||
            (tttBoard[2] == computer && tttBoard[4] == computer && tttBoard[6] == computer)) {
            return (win-depth);
        }
        else if ((tttBoard[0] == human && tttBoard[1] == human && tttBoard[2] == human) ||
            (tttBoard[3] == human && tttBoard[4] == human && tttBoard[5] == human) ||
            (tttBoard[6] == human && tttBoard[7] == human && tttBoard[8] == human) ||
            (tttBoard[0] == human && tttBoard[3] == human && tttBoard[6] == human) ||
            (tttBoard[1] == human && tttBoard[4] == human && tttBoard[7] == human) ||
            (tttBoard[2] == human && tttBoard[5] == human && tttBoard[8] == human) ||
            (tttBoard[0] == human && tttBoard[4] == human && tttBoard[8] == human) ||
            (tttBoard[2] == human && tttBoard[4] == human && tttBoard[6] == human)) {
            return -(win - depth);
        }
        else if (tttBoard[9] == 9) {
            return (0-depth);
        }
        else {
            var value;
            var bestValue;
            var index;
            if (maximizingPlayer) {
                bestValue = -infinity;
				for (index = 0; index < 9; ++index) {
					if (tttBoard[index] == empty) {
						tttBoard[index] = computer;
						++tttBoard[9];
						value = tttMiniMax(tttBoard, false, depth+1);
						if (value > bestValue) {
							bestValue = value;
						}
                        tttBoard[index] = empty;
                        --tttBoard[9];
                    }
				}
				return bestValue;
            }
            else {//minimizing player
                bestValue = infinity;
				for (index = 0; index < 9; ++index) {
					if (tttBoard[index] == empty) {
						tttBoard[index] = human;
						++tttBoard[9];
						value = tttMiniMax(tttBoard, true,depth+1);
						if (value < bestValue) {
							bestValue = value;
						}
						tttBoard[index] = empty;
						--tttBoard[9];
					}
				}
                return bestValue;
            }
        }
    }
    
    function randomCornerAIMove() {
        switch ( Math.floor(Math.random() * 4.0) ) {
            case 0: return 0;
            case 1: return 2;
            case 2: return 6;
            case 3: return 8;
            default: return 0;
        }
    }

    function playAI() {
		if (turn != computer)
			return;
        var index;
        if (board[9] == 0)
            index = randomCornerAIMove();
        else
            index = tttFindBestMove();
		board[index] = computer;
		++board[9];
        if (logMoves) {
            console.log("#"+board[9]+" O: (row="+ (Math.floor(index / 3.0)) +", col="+(index % 3)+") index="+index);
        }
		updateGameStatus();
		reDraw();        
	}    
    
    function onMouseDown(event) {
        if (gameResult != empty) {
            reStartGame();
            return;
        }
		if (turn != human)
			return;
		var c = Math.floor((event.pageX - canvas.offsetLeft - boardStartX) / boardCellWidth);
		var r = Math.floor((event.pageY - canvas.offsetTop - boardStartY) / boardCellHeight);
        if (c < 0 || c > 2 || r < 0 || r > 2)
            return;
        var index = r*3+c;
        if (board[index] != empty)
            return;
        board[index] = human;
        ++board[9];
        if (logMoves) {
            console.log("#"+board[9]+" X: (row="+r+", col="+c+") index="+index);
        }
        updateGameStatus();
        reDraw();
	}
		    
    function updateGameStatus() {
        if (turn == computer) {
            if ((board[0] == computer && board[1] == computer && board[2] == computer) ||
                (board[3] == computer && board[4] == computer && board[5] == computer) ||
                (board[6] == computer && board[7] == computer && board[8] == computer) ||
                (board[0] == computer && board[3] == computer && board[6] == computer) ||
                (board[1] == computer && board[4] == computer && board[7] == computer) ||
                (board[2] == computer && board[5] == computer && board[8] == computer) ||
                (board[0] == computer && board[4] == computer && board[8] == computer) ||
                (board[2] == computer && board[4] == computer && board[6] == computer)) {
                gameResult = computer;
                if (logMoves) {
                    console.log("Result: O Wins");
                }
                turn = empty;
            }
            else if (board[9] == 9) {
                gameResult = draw;
                if (logMoves) {
                    console.log("Result: Draw");
                }
                turn = empty;
            }
            else {
                turn = human;
            }
        }
        else {
            if( (board[0] == human && board[1] == human && board[2]==human) ||
                (board[3] == human && board[4] == human && board[5]==human) ||
                (board[6] == human && board[7] == human && board[8]==human) ||
                (board[0] == human && board[3] == human && board[6]==human) ||
                (board[1] == human && board[4] == human && board[7]==human) ||
                (board[2] == human && board[5] == human && board[8]==human) ||
                (board[0] == human && board[4] == human && board[8]==human) ||
                (board[2] == human && board[4] == human && board[6]==human) )
            {
                gameResult = human;
                if (logMoves) {
                    console.log("Result: X wins");
                }
                turn = empty;
            }
            else if (board[9] == 9) {
                gameResult = draw;
                if (logMoves) {
                    console.log("Result: Draw");
                }
                turn = empty;
            }
            else {
                turn = computer;
                setTimeout(playAI, aiSimDelay);
            }
        }
    }
	
    function drawboard(startX, startY, width, height) {
        ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(boardStartX + boardCellWidth, boardStartY);
		ctx.lineTo(boardStartX + boardCellWidth, boardStartY+boardHeight);
		ctx.moveTo(boardStartX + boardCellWidth*2.0, boardStartY);
		ctx.lineTo(boardStartX + boardCellWidth*2.0, boardStartY+boardHeight);
		ctx.moveTo(boardStartX, boardStartY+boardCellHeight);
		ctx.lineTo(boardStartX+boardWidth, boardStartY+boardCellHeight);
		ctx.moveTo(boardStartX, boardStartY+boardCellHeight*2.0);
		ctx.lineTo(boardStartX+boardWidth, boardStartY+boardCellHeight*2.0);
		ctx.stroke();		
	}
    
	function drawCross(r, c) {
		var d = 6.0;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo((boardStartX +c*boardCellWidth)+d, (boardStartY+r*boardCellHeight)+d);
		ctx.lineTo((boardStartX +(c+1)*boardCellWidth)-d, (boardStartY+(r+1)*boardCellHeight)-d);
		ctx.moveTo((boardStartX +(c+1)*boardCellWidth)-d, (boardStartY+r*boardCellHeight)+d);
		ctx.lineTo((boardStartX +c*boardCellWidth)+d, (boardStartY+(r+1)*boardCellHeight)-d);
		ctx.stroke();
	}
	
	function drawNaught(r, c) {
		var radius = (boardCellWidth / 2.0) - 6.0;
		var centerX = ( (boardStartX +c*boardCellWidth) + (boardStartX +(c+1)*boardCellWidth) ) / 2.0;
		var centerY = ( (boardStartY +r*boardCellHeight) + (boardStartY +(r+1)*boardCellHeight) ) / 2.0;		
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0.0, 2.0 * Math.PI);
		ctx.stroke();
	}
		
	function reDraw() {
		//clear screen
		ctx.fillStyle = grey;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		//draw board
        ctx.strokeStyle = black;
		drawboard(0,0,canvas.width,canvas.height);
		//drawpieces
		for (var r = 0; r < 3; ++r) {
		    for (var c = 0; c < 3; ++c) {
		        var cell = board[r * 3 + c];
		        if (cell == human) {
		            ctx.strokeStyle = blue;
		            drawCross(r, c);
		        }
		        else if (cell == computer) {
		            ctx.strokeStyle = orange;
		            drawNaught(r, c);
		        }
		    }
		}
		//drawtext
		if (turn == empty) {
		    ctx.fillStyle = black;
			if (gameResult == draw) {
				ctx.fillText( strDraw, canvas.width/2, canvas.height-20);
			}
			else {
			    if (gameResult == computer) {
			        ctx.fillText(strYouLose, canvas.width / 2, canvas.height - 20);
			    }
			    else {
                    ctx.fillText(strYouWin, canvas.width/2, canvas.height-20);
                }
			}
		}
		else {
            ctx.fillStyle = darkBlue;
			ctx.fillText( (turn == human) ? strYourTurn : strThinking, canvas.width/2, canvas.height-20);
		}
	}
    
    function reStartGame() {
        for (var i = 0; i < 9; ++i)
            board[i] = empty;
        board[9] = 0;
        gameResult = empty;
        turn = (Math.random() <= 0.5) ? human : computer;
        if (turn==computer) {
            setTimeout(playAI, aiSimDelay);
        }
        reDraw();
    }
    
    canvas.addEventListener("mousedown", onMouseDown, false);
    reStartGame();
