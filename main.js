const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ballsArray = []
let amountOfBalls = 1
let colorMethod = 'color'
let color = 0

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

const mouse = {
    x: undefined,
    y: undefined
}

const changeColorMethod = {
    color() {
        colorMethod = 'randomColor'
    },
    randomColor() {
        colorMethod = 'color'
    }
}

const chooseColor = {
    color() {
        return color
    },
    randomColor() {
        return Math.floor(Math.random() * 360 + 1)
    }
}

document.addEventListener('mousemove', ({ x, y }) => {
    mouse.x = x
    mouse.y = y
    createBall(amountOfBalls)
})

document.addEventListener('mousedown', ({ x, y }) => {
    mouse.x = x
    mouse.y = y
    amountOfBalls = 10
    createBall(6)
    changeColorMethod[colorMethod]()
})

document.addEventListener('mouseup', () => {
    amountOfBalls = 1
    changeColorMethod[colorMethod]()
})

class Ball {
    constructor() {
        const { width, height } = canvas
        // const hueAdd = chooseColor.color()
        const { x, y } = mouse
        this.hue = chooseColor[colorMethod]()
        this.x = x
        this.y = y
        this.size = Math.random() * 30 + 1
        this.speedX = (Math.random() * 20) - 10
        this.speedY = (Math.random() * 20) - 10
        this.color = `hsl(${ this.hue + color }, 100%, 50%)`
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.05)
            this.size -= 0.04
    }
    draw() {
        const {x, y, size, color} = this
        context.fillStyle = color
        context.beginPath()
        context.arc(x, y, size, 0, Math.PI * 2)
        context.fill() 
    }
    changeSingleBall() {
        this.color = this.color = `hsl(${ this.hue + color*7 }, 100%, 50%)`
    }
    ballsCollisions() {
        const nextBallStepX = this.x + this.speedX
        const nextBallStepY = this.y + this.speedY
        if (nextBallStepX - this.size <= 0) {
            this.speedX *= -1
        }
        if (nextBallStepY - this.size <= 0) {
            this.speedY *= -1
        }
        if (nextBallStepX + this.size >= canvas.width) {
            this.x = canvas.width - this.size
            this.speedX *= -1
        }
        if (nextBallStepY + this.size >= canvas.height) {
            this.y = canvas.height - this.size
            this.speedY *= -1
        }
    }
}

function createBall(amount) {
    for (let i = 0; i < amount; i++) {
        ballsArray.push(new Ball())
    }
}

function handleBalls() {
    for (let i = 0; i < ballsArray.length; i++) {
        ballsArray[i].update()
        ballsArray[i].draw()
        ballsArray[i].changeSingleBall()
        ballsArray[i].ballsCollisions()
        if (ballsArray[i].size <= 0.05) {
            ballsArray.splice(i, 1)
            i--
        }
    }
}

function animateBalls() {
    const { width, height } = canvas
    context.fillStyle='rgba(0,0,0,1)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    handleBalls()
    color++
    requestAnimationFrame(animateBalls)
}
requestAnimationFrame(animateBalls)
