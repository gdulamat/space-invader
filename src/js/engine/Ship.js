class Ship extends EventTarget {
    constructor(ctx, GameEngine, shipData) {
        super();
        this.setVars(ctx, GameEngine, shipData);
        this.addWeapon(SI_GAME.weapons[0]);
        this.setListeners();
    }

    setVars(ctx, GameEngine, { asset, speed, shield }) {
        this.ctx = ctx;
        this.GameEngine = GameEngine;
        this.asset = asset;
        this.speed = speed;
        this.shield = shield;
        this.w = SI_GAME.data.w * 0.08;
        this.h = SI_GAME.data.h * 0.05;
        this.x = 10;
        this.y = SI_GAME.data.h / 2;
        this.moveRight = false;
        this.moveLeft = false;
        this.moveUp = false;
        this.moveDown = false;
        this.reload = false;
        this.weapons = [];
        this.eqWeapon = null;
        this.isGameOver = false;
    }
    
    setListeners() {
        if(SI_GAME.data.isMobile) {
            //listeners for mobile devices
            this.clickHandler = this.clickHandler.bind(this);
            document.addEventListener('click', this.clickHandler);
            this.swipesHandler = this.swipesHandler.bind(this);
            document.addEventListener('touchmove', this.swipesHandler);
            this.touchStartHandler = this.touchStartHandler.bind(this);
            document.addEventListener('touchstart', this.touchStartHandler);
            this.touchEndHandler = this.touchEndHandler.bind(this);
            document.addEventListener('touchend', this.touchEndHandler);
        } else {
            //listeners for deskop devices
            this.keyDownHandler = this.keyDownHandler.bind(this);
            document.addEventListener('keydown', this.keyDownHandler);
            this.keyUpHandler = this.keyUpHandler.bind(this);
            document.addEventListener('keyup', this.keyUpHandler);
        }
    }

    removeListeners() {
        if(SI_GAME.data.isMobile) {
            document.removeEventListener('click', this.clickHandler);
            document.removeEventListener('touchmove', this.swipesHandler);
            document.removeEventListener('touchstart', this.touchStartHandler);
            document.removeEventListener('touchend', this.touchEndHandler);
        } else {
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler)
        }
    }

    //mobile devices controllers
    clickHandler(e) {
        if(!this.GameEngine.playState) return;
        e.clientY * 2 > SI_GAME.data.h ? this.switchWeapon() : this.shot();
    }

    swipesHandler(e) {
        if(!this.GameEngine.playState) return;
        let touch = e.touches[0];

        (touch.clientX > this.touchX) && (this.moveRight = true);
        (touch.clientX < this.touchX) && (this.moveLeft = true);
        (touch.clientY < this.touchY) && (this.moveUp = true);
        (touch.clientY > this.touchY) && (this.moveDown = true);
        (e.touches.length > 1) && this.shot();
        
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
    }

    touchStartHandler() {
        if(!this.GameEngine.playState) return;
        this.touchX = this.x;
        this.touchY = this.y;
    }

    touchEndHandler() {
        if(!this.GameEngine.playState) return;
        this.moveUp = this.moveDown = this.moveRight = this.moveLeft = false;
    }

    // desktop devices controllers
    keyDownHandler(e) {
        if(!this.GameEngine.playState) return;
        (e.key == 'Right' || e.key == 'ArrowRight') && (this.moveRight = true);
        (e.key == 'Left' || e.key == 'ArrowLeft') && (this.moveLeft = true);
        (e.key == 'Up' || e.key == 'ArrowUp') && (this.moveUp = true);
        (e.key == 'Down' || e.key == 'ArrowDown') && (this.moveDown = true);
        e.key === " " && this.shot();
        (e.key === "c" || e.key === "C") && this.switchWeapon();
    }
    
    keyUpHandler(e) {
        if(!this.GameEngine.playState) return;
        (e.key == 'Right' || e.key == 'ArrowRight') && (this.moveRight = false);
        (e.key == 'Left' || e.key == 'ArrowLeft') && (this.moveLeft = false);
        (e.key == 'Up' || e.key == 'ArrowUp') && (this.moveUp = false);
        (e.key == 'Down' || e.key == 'ArrowDown') && (this.moveDown = false);
    }

    addWeapon(weapon) {
        const newWeapon = {...weapon};
        let isDuplicated = false;
        let duplicatedIndex;

        for(const [i, weapon] of this.weapons.entries()) {
            if(weapon.name === newWeapon.name) {
                isDuplicated = true;
                duplicatedIndex = i;
                break;
            };
        }
        
        if(isDuplicated) {
            this.weapons[duplicatedIndex].charges += newWeapon.charges;
        } else {
            this.weapons.push(newWeapon);
            this.eqWeapon = newWeapon;
        }
    }

    switchWeapon() {
        let curentIndex = this.weapons.indexOf(this.eqWeapon);
        let nextIndex = curentIndex === this.weapons.length -1 ? 0 : curentIndex +1;
        this.eqWeapon = this.weapons[nextIndex];
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.asset, this.x, this.y, this.w, this.h);
        this.ctx.closePath();
        this.update();
    }

    update() {
        this.shield <= 0 && !this.isGameOver && this.shipExplosion();
        (this.moveRight && (this.x + this.w < SI_GAME.data.w)) && (this.x += this.speed);
        (this.moveLeft && ( this.x > 0)) && (this.x -= this.speed);
        (this.moveDown && (this.y + this.h < SI_GAME.data.h)) && (this.y += this.speed);
        (this.moveUp && (this.y > 0)) && (this.y -= this.speed);

        (SI_GAME.data.isMobile) && (this.moveUp = this.moveDown = this.moveRight = this.moveLeft = false);
    }

    shipExplosion() {
        this.isGameOver = true;
        const e = new Event('explosion');
        const explosionData = {};
        explosionData.x = this.x;
        explosionData.y = this.y;
        explosionData.w = this.w;
        explosionData.h = this.h;
        explosionData.speedX = 0;
        explosionData.speedY = 0;
        explosionData.time = 10;
        e.explosionData = explosionData;
        this.dispatchEvent(e);
    }

    shot() {
        if(this.reload || this.eqWeapon.charges === 0) return;
        const e  = new Event('shot');
        const missleData = {};
        missleData.asset = this.eqWeapon.asset;
        missleData.w = this.eqWeapon.w;
        missleData.h = this.eqWeapon.h;
        missleData.x = this.x + this.w;
        missleData.y = this.y + Math.round(this.h / 2) - Math.round(this.eqWeapon.h * SI_GAME.data.h / 2);
        missleData.speedX = this.eqWeapon.speedX;
        missleData.speedY = this.eqWeapon.speedY;
        missleData.dmg = this.eqWeapon.damage;
        missleData.owner = 'p1';
        e.missleData = missleData;
        this.dispatchEvent(e);
        this.eqWeapon.charges !== 'UNLIMITED' && this.eqWeapon.charges --;
        this.reload = true;
        setTimeout(() => this.reload = false, this.eqWeapon.reloadTime);
    }
}

export default Ship;