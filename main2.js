
class ValidatedShips{
    shipCells = {};
    fourDeck = [];
    threeDeck = [];
    doubleDeck = [];
    singleDeck = [];

    deck = [this.fourDeck, this.threeDeck, this.doubleDeck, this.singleDeck]

    constructor(cells){
        this.cells = cells;
        this.diagonalValidate();
        this.decksValidate();
        this.countValidate();
    }
    
    diagonalValidate(){

        this.cells.forEach((cell, i) => {
            if (cell.isShip) {

                const leftTop = this.cells[`${cell.y - 1}${cell.x - 1}`];
                const rightTop = this.cells[`${cell.y - 1}${cell.x + 1}`];
                const diagonalCells = [leftTop, rightTop];

                diagonalCells.forEach((diagonallCell) => {
                    if (diagonallCell && diagonallCell.isShip){
                        throw Error('Расстояние между кораблями должно быть больше!');
                    }
                });

                this.shipCells[i] = cell;
            }
        })
    }

    decksValidate(){

        Object.values(this.shipCells).forEach((cell) => {
            const coords = Number(`${cell.y}${cell.x}`);

            if (!this.shipCells[coords]) return;

            const rights = this.iterateCoords((i) => {
                return `${cell.y}${cell.x + i}`;
            })
            const downs = this.iterateCoords((i) => {
                return `${cell.y + i}${cell.x}`;
            })

            const arr = [cell, ...rights, ...downs];
            switch (arr.length) {
                case 4: {
                    this.fourDeck.push(arr);
                    break;
                }
                case 3: {
                    this.threeDeck.push(arr);
                    break;
                }
                case 2: {
                    this.doubleDeck.push(arr);
                    break;
                }
                case 1: {
                    this.singleDeck.push(arr);
                    break;
                }
                default: {
                    throw Error('слишком длинный корабль');
                }
            }
        })
    }

    iterateCoords(func) {
        const array = []
    
        for (let i = 1; i <= 5; i++) {
            
            const key = Number(func(i));
            const elem = this.shipCells[key];
    
            if (!elem) return array;

            array.push(elem);
            
            delete this.shipCells[key];
        }
    
        return array;
    }

    countValidate(){
     //   if (
     //       this.fourDeck.length !== 1 
     //       || this.threeDeck.length !== 2 
     //       || this.doubleDeck.length !== 3
     //       || this.singleDeck.length !== 4
     //   ) {
     //       throw Error('Неверное количество кораблей')
     //   }
    }//
}



class Player {
    shipsCount = 0;

    constructor(playerName){
        this.playerName = playerName;
        this.button = document.querySelector(`.${playerName} .buttonPrepared`);
        this.board = document.querySelector(`.${playerName} .board`)
        this.cells = this.createCells();
        this.widthHeight();
    }

    widthHeight(){
        let width = this.board.offsetWidth/10;
        this.board.style.gridTemplateRows = `repeat(10, ${width}px)`;
    }

    createCells() {
        const cells = [];
        
        console.log(this.board.offsetWidth);
        console.log(this.board.style.gridTemplateRows)
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++){
                const cell = new Cell(x, y);

                this.board.append(cell.node);
                cells.push(cell);
            }
        }
        return cells;
        
    }

    placeShips() {
        return new Promise((prepared) => {
            this.cells.forEach((cell) => {
                cell.listenClick(this.addShip);
            })

            this.button.addEventListener('click', async () => {
                this.cells.forEach((cell) => {
                    cell.unlistenClick();
                    
                });

                try {
                    const ships = new ValidatedShips(this.cells);

                    this.fourDeck = ships.fourDeck;
                    this.threeDeck = ships.threeDeck;
                    this.doubleDeck = ships.doubleDeck;
                    this.singleDeck = ships.singleDeck;
                    this.deck = ships.deck;
                    console.log(this);

                    this.button.classList.add('hide');
                    this.cells.forEach((cell) => {
                        cell.hide();
                    })
                    prepared();
                } catch ({ message }) {
                    const modal = new Modal();
                    modal.open([message]);
                    await this.placeShips();
                    prepared();
                }
                
            }, {once: true});
        })
    }

    addShip = (cell) => {
        if (cell.isShip){
            cell.setShip(false);
            
            this.shipsCount--;                
        } else {
            cell.setShip(true);
            this.shipsCount++;
        }
    }

    shot() {
        return new Promise((resolve) => {
            const handlerAwaitShot = (cell) => {
                this.checkHit(cell);

                this.cells.forEach((cell) => {
                    cell.unlistenClick();
                });

                resolve();
            }

            this.cells.forEach((cell) => {
                cell.listenClick(handlerAwaitShot);
            })
        })
    }

    checkHit(cell) {
        console.log(cell)
        if (cell.isShip) {
            this.deck.forEach((decks) => {
                decks.forEach((ships) => {
                    ships.forEach((ship) => {
                        if (cell === ship){
                            if (ships.length === 1){
                    
                                cell.kill();
                            } else{
                                cell.hit();
                                ships.splice(ship, 1);
                            }
                            this.shipsCount--;
                        }
                    })
                })
            })
        } else {
            cell.miss();
        }
    }

};

class Ship{
    constructor(){

    }
}

class Cell{
    isShip = false;

    constructor(x, y){
        this.x = x;
        this.y = y;

        this.node = this.createCellNode();

    }

    createCellNode(){
        let cellNode = document.createElement('div');
        cellNode.classList.add("el");
        return cellNode;
    }

    setShip(bool) {
        this.isShip = bool;

        if (this.isShip) {
            this.node.classList.add('ship');
        } else {
            this.node.classList.remove('ship');
        }
    }

    listenClick(func) {
        this.clickListener = this.eventToCell(func)
        this.node.addEventListener('click', this.clickListener)
    }

    unlistenClick() {
        this.node.removeEventListener('click', this.clickListener)
    }

    eventToCell = (callback) => {
        return (event) => callback(this, event);
    }

    hide() {
        //this.node.classList.add('opacity');
    }

    visible() {
        this.node.classList.remove('opacity');
    }

    kill() {
        this.node.classList.add('kill');
        this.node.classList.remove('opacity');
    }

    hit() {
        this.node.classList.add('hit');
        this.node.classList.remove('opacity');
    }

    miss() {
        this.node.classList.add('miss');
        this.node.classList.remove('opacity');
    }
}


class Game{
    step = 1;

    constructor(firstPlayer, secondPlayer){
        this.firstPlayer = new Player(firstPlayer);
        this.secondPlayer = new Player(secondPlayer);
    }

    async start(){
        await this.firstPlayer.placeShips();
        await this.secondPlayer.placeShips();
        
        this.fight();
    }
    
    fight() {
        if (this.step % 2){
            this.checkHitShips(this.firstPlayer, this.secondPlayer);
        } else {
            this.checkHitShips(this.secondPlayer, this.firstPlayer);
        }
    }

    async checkHitShips(playerOne, playerTwo){

        const playerTwoShips = playerTwo.shipsCount;

        await playerTwo.shot();

        if (playerTwo.shipsCount > 0){
            if (playerTwo.shipsCount !== playerTwoShips){
                this.fight();
            } else {
                ++this.step;
                this.fight();
            }
        } else {
            this.gameOver(playerOne);
        }
    }

    gameOver(player){
        player.cells.forEach((cell) => {
            cell.visible();
        })

        const btn = document.createElement('button');
        btn.classList.add('restart-btn');
        btn.innerHTML = 'RESTART';
        btn.addEventListener('click', this.restartButton);

        const content = [`${player.playerName} won`, btn];
        
        const modal = new Modal();
        modal.open(content);
    }

    restartButton = () => {
        location.reload();
    }

}


class Modal {

    constructor(){
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        this.modalBackground = document.createElement('div');
        this.modalBackground.classList.add('modal-background');

        this.modalWindow = document.createElement('div');
        this.modalWindow.classList.add('modal-window');

        this.modal.append(this.modalBackground, this.modalWindow);

        this.modalBackground.addEventListener('click', this.close, {once: true})

    }
    
    open(content){
        this.modalWindow.append(...content);
        document.body.appendChild(this.modal);
    }

    close = () => {
        this.modal.remove();
    }
}

debugger
const game = new Game('firstPlayer', 'secondPlayer');
game.start();

