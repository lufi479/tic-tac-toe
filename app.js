const Player = (name, mark) => {
    let winCount = 0;
    const getName = () => name;
    const getMark = () => mark;
    const getWinCount = () => winCount;

    const setName = (newName) => {
        name = newName;
    }

    const increaseWinCount = () => {
        winCount++;
    }

    return {
        getName, getMark, getWinCount, increaseWinCount, setName
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

    return {
        getBoard, placeMark, makeBoard
    };

})();

const gameController = (() => {

    const players = [Player("Player One", "X"), Player("Player Two", "O")];

    let turn = 0;

    let activePlayer = players[0];

    const setNames = (nameOne, nameTwo) => {
        players[0].setName(nameOne);
        players[1].setName(nameTwo);
    }

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        let retVal = " ";
        const board = gameBoard.getBoard();
        console.log(board);
        if ((board[0][0]!= "") && ((board[0][0] === board[1][1]) && (board[1][1] === board[2][2]))){
            retVal = board[0][0];
            return board[0][0]
            console.log('lol')
        }
        else if ((board[0][2]!= "") && ((board[0][2] === board[1][1]) && (board[1][1] === board[2][0]))){
            retVal = board[0][2];
            return board[0][2];
            console.log('0 2 -> 1 1 ->2 0')
        }
        else {
            for (let i = 0; i < 3; i++){
                console.log(board[0][i] + " " + board[1][i] +" " + board[2][i]);
                if ((board[0][i]!= "") && ((board[0][i] === board[1][i]) && (board[1][i] === board[2][i]))){
                    retVal = board[0][i];
                    return retVal;
                    //break;
                }
                else if ((board[i][0]!= "") && ((board[i][0] === board[i][1]) && (board[i][1] === board[i][2]))){
                    retVal = board[i][0];
                    return retVal;
                    //break;
                }
            }
        }

    }

    const playRound = (position) => {
        gameBoard.placeMark(activePlayer, position);

        let check = checkWinner();
        console.log(check);
        if (check === players[0].getMark()){
            console.log(`${players[0].getName()} Wins!`);
            players[0].increaseWinCount();
            //displayController.playerWin(players[0]);
            return players[0];
        }
        else if (check === players[1].getMark()){
            console.log(`${players[1].getName()} Wins!`);
            players[1].increaseWinCount();
            //displayController.playerWin(players[1]);
            return players[1];
        }

        if (turn === 8){
            return "tie"
        }
    
        switchActivePlayer();
        console.log(turn);
        turn++;
    }

    const resetTurns = () => {
        turn = 0;
    }

    const forcePlayerOne = () =>{
        activePlayer = players[0];
    }

    return {
        playRound,
        getActivePlayer,
        setNames,
        resetTurns, 
        forcePlayerOne
    };

})();

const displayController = (() => {
    const activePlayerDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const beginDiv = document.querySelector(".begin");
    const gameDiv = document.querySelector(".game");
    const restartDiv = document.querySelector(".restart-btn");
    const newGameDiv = document.querySelector(".new-game-btn");

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

    const gameEnd = (result) =>{
        let spots = document.getElementsByClassName("spot");
        if (result === "tie"){
            activePlayerDiv.textContent = "Tie!"
        }
        else{
            activePlayerDiv.textContent = `${result.getName()} Wins!`
            for (let i = 0; i < spots.length; i++){
                spots.item(i).disabled = true;
            }
        }
        
    }

    function clickSpot(e){
        const selectedSpot = e.target.dataset.position;
        if (!selectedSpot || e.target.classList[1]){
            return;
        }
        console.log(e.target.classList[0]);
        const ret = gameController.playRound(selectedSpot);
        updateDisplay();
        if (ret){
            gameEnd(ret)
            return;
        }
        
    }

    function startGame(e){
        e.preventDefault();
        console.log("lmao");
        let formData = new FormData(this);
        const playerOneName = formData.get("one-name");
        const playerTwoName = formData.get("two-name");
        gameController.setNames(playerOneName, playerTwoName);
        gameBoard.makeBoard();
        gameController.forcePlayerOne();
        updateDisplay();
        beginDiv.style.display = "none";
        gameDiv.style.display = "block";
    }

    function clickRestart(e){
        beginDiv.style.display = "block";
        gameDiv.style.display = "none";
        newGameDiv.style.display = "none";
        gameController.resetTurns();
    }

    boardDiv.addEventListener("click", clickSpot);

    document.querySelector(".name-form").addEventListener("submit", startGame);

    restartDiv.addEventListener("click", clickRestart);

    return {
        updateDisplay
    };
})();

//gameBoard.makeBoard();

//displayController.updateDisplay();
