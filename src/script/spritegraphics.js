class SpriteGraphics 
{
    constructor (width, height, tileSize, ctx)
    {
        this._ctx = ctx;
        this._ts = tileSize;

        this._l = height;
        this._c = width;

        this._ctx.canvas.width = width * this._ts;
        this._ctx.canvas.height = height * this._ts;
    }

    loadSprites (r, c, s, img)
    {
        this._spriteImg = img;
        this._spriteSize = s;

        this._sprites = new Array();
        for (let i = 0; i < r; i++)
            for (let j = 0; j < c; j++)
                this._sprites.push({x: j * s, y: i * s});
    }

    drawSprite (x, y, i)
    {
        let tx = y * this._ts;
        let ty = x * this._ts;

        this._ctx.drawImage(this._spriteImg, this._sprites[i].x, this._sprites[i].y, this._spriteSize, this._spriteSize, tx, ty, this._ts, this._ts);
    }
}