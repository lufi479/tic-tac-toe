const Player = (name, mark) => {
    let winCount = 0;
    const getName = () => name;
    const getMark = () => mark;
    const getWinCount = () => winCount;

    const increaseWinCount = () => {
        winCount++;
    }

    return {
        getName, getMark, getWinCount, increaseWinCount
    };
};

const gameBoard = (() =>{
    let board = [];
    
    const makeBoard = () => {
        board = [];
        for (let i = 0; i < 3; i++){
            board[i] = [];
            for (let j = 0; j < 3; j++){
                board[i].push("");
            }
        }
    }

    const getBoard = () => board;

    const placeMark = (player, position) => {
        const helper = position.split(" ");
        const row = helper[0];
        const col = helper[1];

        board[row][col] = player.getMark();
    }

    const printBoard = () => {
        console.log(board);
    }

    return {
        getBoard, placeMark, printBoard, makeBoard
    };

})();

const gameController = ((playerOneName = "Player One", playerTwoName = "Player Two") => {

    const players = [Player(playerOneName, "X"), Player(playerTwoName, "O")];

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;


    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${activePlayer.getName()}'s turn.`);
    }

    const checkWinner = () => {
        let retVal = " ";
        const board = gameBoard.getBoard();
        console.log(board);
        if ((board[0][0] === board[1][1]) && (board[1][1] === board[2][2])){
            retVal = board[0][0];
        }
        else if ((board[0][2] === board[1][1]) && (board[1][1] === board[2][0])){
            retVal = board[0][2];
        }
        else {
            for (let i = 0; i < 3; i++){
                if ((board[0][i] === board[1][i]) && (board[1][i] === board[2][i])){
                    retVal = board[0][i];
                    break;
                }
                else if ((board[i][0] === board[i][1]) && (board[i][1] === board[i][2])){
                    retVal = board[i][0];
                    break;
                }
            }
        }
        return retVal;

    }

    const playRound = (position) => {
        gameBoard.placeMark(activePlayer, position);

        let check = checkWinner();
        console.log(check);
        if (check === players[0].getMark()){
            console.log(`${players[0].getName()} Wins!`);
            players[0].increaseWinCount();
        }
        else if (check === players[1].getMark()){
            console.log(`${players[1].getName()} Wins!`);
            players[1].increaseWinCount();
        }

        switchActivePlayer();
        printNewRound();
    }

    return {
        playRound,
        getActivePlayer
    };

})();

const displayController = (() => {
    const activePlayerDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateDisplay = () =>{
        boardDiv.textContent = "";
        const board = gameBoard.getBoard();
        const activePlayer = gameController.getActivePlayer();

        activePlayerDiv.textContent = `${activePlayer.getName()}'s Turn`;

        board.forEach((row, rowIndex) => {
            row.forEach((spot, colIndex) => {
                const spotButton = document.createElement("button");
                spotButton.classList.add("spot");
                spotButton.dataset.position = rowIndex + " " + colIndex;
                spotButton.textContent = spot;
                if (spot !== ""){
                    spotButton.classList.add(spot.toLowerCase());
                }
                boardDiv.appendChild(spotButton);
            })
        })
    }

    function clickSpot(e){
        const selectedSpot = e.target.dataset.position;
        if (!selectedSpot || e.target.classList[1]){
            return;
        }
        console.log(e.target.classList[0]);
        gameController.playRound(selectedSpot);
        updateDisplay();
    }

    boardDiv.addEventListener("click", clickSpot);

    return {
        updateDisplay
    };
})();

gameBoard.makeBoard();

displayController.updateDisplay();
