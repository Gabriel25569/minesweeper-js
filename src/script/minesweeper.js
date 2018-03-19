function startGame()
{
    let width = parseInt(document.getElementById("input-width").value);
    let height = parseInt(document.getElementById("input-height").value);
    let mines = parseInt(document.getElementById("input-mines").value);
    let log = document.getElementById("log");
    let canvas = document.getElementById("canvas");

    Game.init(width, height, mines, 20, canvas, log, {src: "src/img/sprite.jpg", 
                                                       r:4 , c:4 , s: 128,
                                                       o: {def: 0, flag: 1, mine: 2, cleared: 3, redMine: 12}});
}


var Game = 
{
    init: function (width, height, mines, tileSize, canvas, log, sprite)
    {
        Game._board = new Board(width, height, mines);
        Game._graphics = new SpriteGraphics(width, height, tileSize, canvas.getContext('2d'));
        
        Game._log = log;
        Game._tileSize = tileSize;
        Game._mines = mines;

        Game._finalMine = 0;
        Game._status = 0;

        Game._mouseDown = 0;
        Game._dontDraw = false;
        Game._mouseUp = 0;
        Game._rightClick = 0;
        Game._firstClick = true;

        let imgSprites = new Image();
        imgSprites.src = "imgs/sprites.jpg";
        Game._graphics.loadSprites(sprite.r, sprite.c, sprite.s, imgSprites);

        Game._so = sprite.o;

        canvas.addEventListener("mousemove", Game.onMouseMove);
        canvas.addEventListener("mousedown", Game.onMouseDown);
        canvas.addEventListener("mouseup", Game.onMouseUp);
        canvas.oncontextmenu = function (e) {Game.onRightClick(e)};

        setTimeout(Game.render, 100);
    },

    onMouseDown: function (e)
    {
        if (Game._status != -1 && e.which == 1)
        {
            Game._mouseDown = {x: Math.floor(e.offsetY / Game._tileSize), y: Math.floor(e.offsetX / Game._tileSize)};
            Game.render();
        }
        
    },

    onMouseUp: function (e)
    {
        if (Game._mouseDown != 0)
        {
            if (Game._firstClick)
            {
                Game._board.start(Game._mouseDown.x, Game._mouseDown.y);
                Game._firstClick = false;
            }
            Game._mouseUp = 1;
            Game.render();
        }
    },

    onMouseMove: function (e)
    {
        if (Game._mouseDown != 0)
        {
            if (!Game._board.getTile(Math.floor(e.offsetY / Game._tileSize), Math.floor(e.offsetX / Game._tileSize)).isCleared)
            {
                Game._mouseDown = {x: Math.floor(e.offsetY / Game._tileSize), y: Math.floor(e.offsetX / Game._tileSize)};
                Game.render();
            }
            else
            {
                Game._dontDraw = true;
            }
        }
    },

    onMouseLeave: function (e)
    {
        if (Game._mouseDown != 0)
        {
            Game._mouseDown = 0;
            Game.render();
        }
    },

    onRightClick: function (e)
    {
        if (!Game._status != -1)
        {
            e.preventDefault();
            Game._rightClick = {x: Math.floor(e.offsetY / Game._tileSize), y: Math.floor(e.offsetX / Game._tileSize), which: e.which};
            Game.render();
        }
    },

    render: function ()
    {
        if (Game._rightClick != 0)
        {
            let tile = Game._board.getTile(Game._rightClick.x, Game._rightClick.y)

            if (!tile.isCleared)
                tile.isFlag = !tile.isFlag;

            Game._rightClick = 0;
        }
        
        if (Game._mouseUp == 1)
        {
            let x = Game._mouseDown.x;
            let y = Game._mouseDown.y;

            let tile = Game._board.getTile(x, y);

            if (tile.isMine)
            {
                Game._status = -1;
                Game._lastMine = {x: x, y: y};
            }
            else if (!tile.isFlag)
                Game._board.expand(x, y);

            Game._mouseUp = 0;
            Game._mouseDown = 0;
        }

        let flags = 0;
        let cleared = 0;

        for (let i = 0; i < Game._board.lines; i++)
            for (let j = 0; j < Game._board.columns; j++)
            {
                let tile = Game._board.getTile(i, j)
                if (tile.isFlag)
                {
                    Game._graphics.drawSprite(i, j, Game._so.flag);
                    flags++;
                }
                else if (tile.isCleared)
                {
                    Game._graphics.drawSprite(i, j, Game._so.cleared);

                    if (tile.value != 0)
                        Game._graphics.drawSprite(i, j, Game._so.cleared + tile.value);

                    cleared++;
                }
                else if (Game._status != -1)
                {
                    Game._graphics.drawSprite(i, j, Game._so.def);
                }
                else if (tile.isMine)
                {
                    Game._graphics.drawSprite(i, j, Game._so.mine);
                }
            }
        
        if (Game._board.lines * Game._board.columns - cleared == Game._mines)
            Game._status = 1;

        if (Game._status == -1)
        {
            Game._graphics.drawSprite(Game._lastMine.x, Game._lastMine.y, Game._so.redMine);
            Game._log.innerHTML = "You lost 2 points! You have to understand that if you miss, you miss!";
        }
        else if (Game._status == 1)
        {
            Game._log.innerHTML = "Você ganhou!";
        }
        else
        {
            Game._log.innerHTML = "Bombas restantes: " + (Game._mines - flags); 
        }

        if (Game._mouseDown != 0)
        {
            let x = Game._mouseDown.x;
            let y = Game._mouseDown.y;

            Game._graphics.drawSprite(x, y, Game._so.cleared);
        }

        // DEBUG
        
        //Game._graphics.drawGrids();
    }
} 

document.getElementById("btn-start").addEventListener("click", startGame);
