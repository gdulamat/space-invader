const canvas = document.querySelector('.game');

const canvasHeight = canvas.offsetHeight;
canvas.width = Math.round(canvasHeight * 1.77);
canvas.height = canvasHeight;

export const data = {
    ctx: canvas.getContext('2d'),
    w: canvas.width,
    h: canvas.height,
}

export const assets = {
    bg: "./assets/bg.png",
    ship: "./assets/ship.png",
    missle1: "./assets/missle1.png",
    alien1: "./assets/ship_a1.png",
    missle_a1: "./assets/missle_a1.png",
    explosion: "./assets/explo.png"
}

export const gameObjects = (loadedAssets) => {
    return {
        background: {
            asset: loadedAssets.bg,
            speed: 0.5
        },
        playerShip: {
            asset: loadedAssets.ship,
            speed: 2,
            shield: 100
        },
        alienShips: [
            {
                asset: loadedAssets.alien1,
                speed: 1.2,
                shield: 100,
                weapon: {
                    name: "Blaster WTF-30",
                    asset: loadedAssets.missle_a1,
                    damage: 10,
                    speed: 3,
                    reloadTime: 1000
                },
                reward: 100
            }
        ],
    }
}

export const weapons = (loadedAssets) => {
    return [
        {
            name: "Blaster WTF-40",
            asset: loadedAssets.missle1,
            damage: 20,
            speed: 4,
            reloadTime: 100,
            charges: -1 
        }
    ]
}
