class Tile 
{
    constructor ()
    {
        this._mine = false;
        this._flag = false;
        this._cleared = false;
        this._value = 0;
    }
    
    addValue()
    {
        this._value++;
    }

    get isMine()
    {
        return this._mine;
    }

    set isMine(mine)
    {
        this._mine = mine;
    }

    get isFlag()
    {
        return this._flag;
    }

    set isFlag(flag)
    {
        this._flag = !!flag;
    }

    get isCleared()
    {
        return this._cleared;
    }

    set isCleared(clear)
    {
        this._cleared = !!clear;
    }

    get value()
    {
        return this._value;
    }
}

class Board {
    
    constructor (width, height, mines) 
    {
        if (mines <= 0)
            throw new Error("Número de minas inválido");

        if (width <= 0 || height <= 0)
            throw new Error("Tamanho de jogo inválido");

        if (width * height <= mines)
            throw new Error("Número de bombas inválido para tamanho do tabuleiro!");

        this._lines = height || Board.DEFAULT_HEIGHT;
        this._columns = width || Board.DEFAULT_WIDTH;
        this._mines = mines || Board.DEFAULT_MINES;

        this._gameOver = false;

        // Inicialização das matrizes
        this._board = new Array(this._lines);
        for (let i = 0; i < this._lines; i++)
        {
            this._board[i] = new Array(this._columns);
            for (let j = 0; j < this._columns; j++)
                this._board[i][j] = new Tile();
        }
    }

    start (x, y)
    {
        // Selecionar minas
        let numbers = new Array(this._lines * this._columns);
        for (let i = 0; i < this._lines * this._columns; i++)
            numbers[i] = i;
    
        numbers.splice(x * this._lines + y, 1);
        let selectedNumbers = new Array(this._mines);
        for (let i = 0; i < this._mines; i++)
        {
            let selectedIndex = Math.floor(Math.random() * (numbers.length));
            selectedNumbers[i] = numbers.splice(selectedIndex, 1)[0];
        }

        for (let i = 0; i < this._mines; i++)
        {
            let number = selectedNumbers[i];
            let l = Math.floor(number / this._columns);
            let c = number % this._lines;
            console.log(l + " " + c);
            this._board[l][c].isMine = true;
        }

        // Indicar número de minas adjacentes
        for (let x = 0; x < this._lines; x++) 
            for (let y = 0; y < this._columns; y++)
                for (let i = -1; i < 2; i++)
                    for (let j = -1; j < 2; j++)
                        if (x + i >= 0 && x + i < this._columns && y + j >= 0 && y + j < this._lines && !(i == 0 && j == 0))
                            if (this._board[x + i][y + j].isMine)
                                this._board[x][y].addValue();
        
    }

    expand(firstX, firstY)
    {
        let expandQueue = Array();   
        expandQueue.push({x: firstX, y: firstY});

        while (expandQueue.length != 0)
        {
            //DEBUG
            // let debug = new Array(this._lines); 
            // for (let i = 0; i < this._lines; i++)
            // {
            //     debug[i] = new Array(this._columns)
            //     for (let j = 0; j < this._columns; j++)
            //     {
            //         if (this._board[i][j].isMine)
            //             debug[i][j] = 'X';
            //         else if (this._board[i, j].isCleared)
            //         {
            //             debug[i][j] = 'C' + this._board[i][j].value;
            //         }
            //         else
            //             debug[i][j] = this._board[i][j].value;
            //     }
            // }

            //console.log(debug);

            let current = expandQueue.shift();
            let cx = current.x;
            let cy = current.y;

                if (this._board[cx][cy].value == 0)
                {
                    this._board[cx][cy].isCleared = true;
                    for (let i = -1; i < 2; i++)
                        for (let j = -1; j < 2; j++)
                            if (cx + i >= 0 && cx + i < this._columns && cy + j >= 0 && cy + j < this._lines 
                                && !(i == 0 && j == 0) && !this._board[cx + i][cy + j].isCleared && !this._board[cx + i][cy + j].isMine 
                                && expandQueue.findIndex(a => a.x == cx + i && a.y == cy + j) == -1)
                                {
                                    let a = expandQueue.indexOf({x: cx + i, y: cy + j});
                                    expandQueue.push({x: cx + i, y: cy + j});
                                }

                }
                else
                {
                    this._board[cx][cy].isCleared = true;
                }
                
        }
    }

    getTile (x, y)
    {
        return this._board[x][y];
    }

    get lines()
    {
        return this._lines;
    }

    get columns()
    {
        return this._columns;
    }
}

Board.DEFAULT_HEIGHT = 10;
Board.DEFAULT_WIDTH = 10;
Board.DEFAULT_MINES = 10;