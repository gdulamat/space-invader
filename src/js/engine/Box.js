class Box extends EventTarget {
    constructor(ctx, boxObj) {
        super();
        this.setVars(ctx, boxObj);
        this.createContent();
    }
    
    setVars(ctx, { asset, speed, type }) {
        this.ctx = ctx;
        this.asset = asset
        this.speed = speed;
        this.type = type;
        this.w = SI_GAME.data.w * 0.04;
        this.h = this.w;
        this.x = SI_GAME.data.w;
        this.y = 1 + Math.floor(Math.random() * (SI_GAME.data.h - this.h));
        this.content = {}
    }

    createContent() {
        if(this.type === 'shield') {
            this.content = { shield: 10 + Math.round(Math.random() * 30) };
        } else if(this.type === 'weapon') {
            let i = Math.floor(Math.random() * (SI_GAME.weapons.length - 1)) + 1;
            this.content = { weapon: SI_GAME.weapons[i] };
        };
    }
    
    draw() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.asset, this.x, this.y, this.w, this.h);
        this.ctx.closePath();
        this.update();
    }

    update() {
        this.x -= this.speed;

        if (this.x + this.w < 0) {
            let e = new Event('remove');
            this.dispatchEvent(e);
        }
    }
}

export default Box;