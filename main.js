
// Инициализация досок
let firstMainBoard = document.querySelector('.firstPlayer .mainBoard');
let secondMainBoard = document.querySelector('.secondPlayer .mainBoard');
let firstRivalBoard = document.querySelector('.firstPlayer .rivalBoard');
let secondRivalBoard = document.querySelector('.secondPlayer .rivalBoard');

let boards = [firstMainBoard, secondMainBoard, firstRivalBoard, secondRivalBoard]

// Добавление клеток для кораблей
for (let k = 0; k < boards.length; k++){
    boards[k].dataset.shipsCount = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++){
            let boardElem = document.createElement('div');
            boardElem.classList.add("el");
            boardElem.dataset.x = i;
            boardElem.dataset.y = j;
            boards[k].append(boardElem);
        }
    }
}

// Получение массивов ячеек
let boardElemFirst = document.querySelectorAll('.firstPlayer .mainBoard .el');
let boardElemSecond = document.querySelectorAll('.secondPlayer .mainBoard .el');

// Лисенер на активацию корабля в клетке
function addListenersForAddingShip(array){
    array.forEach(function(elem){

        elem.addEventListener('click', handlerAddShip);
    })
}

//Установка лисенеров на поля

function handlerAddShip(event) {

    if (event.target.classList.contains('ship')){
        event.target.classList.remove('ship');
        event.target.parentNode.dataset.shipsCount--;

    }else{
        event.target.classList.add('ship');
        event.target.parentNode.dataset.shipsCount++;
    }
};

// Кнопки для игры
let buttonPreparedFirst = document.querySelector('.firstPlayer .buttonPrepared');
let buttonPreparedSecond = document.querySelector('.secondPlayer .buttonPrepared');


// Удаление лисенеров с определенной доски и установка флага
function removingListeners(button, board){
   return new Promise(function(prepared){

    button.addEventListener('click', function (){
        board.forEach(function(elem){
            elem.removeEventListener('click', handlerAddShip);
        })

        prepared();
    }, {once: true});
   })
}

async function game() {
    addListenersForAddingShip(boardElemFirst);
    await removingListeners(buttonPreparedFirst, boardElemFirst);
    addListenersForAddingShip(boardElemSecond);
    await removingListeners(buttonPreparedSecond, boardElemSecond);
    addingListenersRival(buttonPreparedFirst, boardElemFirstRival, boardElemSecond, secondMainBoard);
    addingListenersRival(buttonPreparedSecond, boardElemSecondRival, boardElemFirst, firstMainBoard);
}


let boardElemFirstRival = document.querySelectorAll('.firstPlayer .rivalBoard .el');
let boardElemSecondRival = document.querySelectorAll('.secondPlayer .rivalBoard .el');


function addingListenersRival(button, board,enemyElemBoard, enemyBoard){
   
    button.addEventListener('click', function (){
    
        if (enemyBoard.dataset.shipsCount > 0){

            board.forEach(function(elem){
                elem.addEventListener('click', (event) => checkShips(event, enemyElemBoard, enemyBoard));
            })
        }else{
            alert('you win:(');
        }

        enemyElemBoard.forEach(function(elem){
            elem.classList.toggle('opacity');
        })
        
        console.log(enemyElemBoard)
    });
}


function checkShips(event, enemyElemBoard, enemyBoard){
    const { x: xOnClick, y: yOnClick } = event.target.dataset;
    const enemyBoardArray = Array.from(enemyElemBoard);

    const findedCell = enemyBoardArray.find(function(enemyCell) {
        if (xOnClick === enemyCell.dataset.x && yOnClick === enemyCell.dataset.y){
            return enemyCell;
        }
    });

    if (findedCell.classList.contains('ship')){
        event.target.classList.add('hit');
        findedCell.classList.add('hit');
        enemyBoard.dataset.shipsCount--;
    } else{
        event.target.classList.add('miss');
        findedCell.classList.add('miss');
    }
    
}



game();