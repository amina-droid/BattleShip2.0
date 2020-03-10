class Game {
    constructor(first, second) {
        this.firstPlayer = new Player(first);
        this.secondPlayer = new Player(second);
    }

    async start() {
        await this.prepareStage();
    }

    async prepareStage() {
        await this.firstPlayer.shipPlacementStage();
        await this.secondPlayer.shipPlacementStage();
        return true
    }
}

class Player {
    constructor(playerName) {
        this.playerName = playerName;
        const [mainBoard, rivalBoard, gameButton] = this.getBoardsElements();

        this.mainBoard = mainBoard;
        this.rivalBoard = rivalBoard;
        this.gameButton = gameButton;

        this.mainCells = this.createCellsElements();
        this.rivalCells = this.createCellsElements();

        this.mainBoard.append(...this.mainCells);
        this.rivalBoard.append(...this.rivalCells);
    }

    getBoardsElements() {
        return [
            document.querySelector(`.${this.playerName} .mainBoard`),
            document.querySelector(`.${this.playerName} .rivalBoard`),
            document.querySelector(`.${this.playerName} .buttonPrepared`)
        ]
    }
    
    createCellsElements() {
        const cells = [];
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = document.createElement('div');
                cell.classList.add('el');
                cell.dataset.x = x;
                cell.dataset.y = y;
                cells.push(cell);
            }
        }

        return cells;
    }

    shipPlacementStage = () => new Promise(prepare => {
        this.mainCells.forEach(cell => {
            cell.addEventListener('click', this.handlerAddShip);
        });

        this.gameButton.addEventListener('click', () => {
            this.mainCells.forEach(cell => {
                cell.removeEventListener('click', this.handlerAddShip);
            })

            prepare();
        }, { once: true })
    })

    handlerAddShip(event) {
        event.target.classList.toggle('ship');
    }
}

const game = new Game('firstPlayer', 'secondPlayer');
game.start();