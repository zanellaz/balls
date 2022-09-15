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
    if (colorMethod == 'randomColor') {
        createLineBall(amountOfBalls)
    }
    else {
        createBall(amountOfBalls)
    }
})

document.addEventListener('mousedown', ({ x, y }) => {
    mouse.x = x
    mouse.y = y
    amountOfBalls = 4
    changeColorMethod[colorMethod]()
    createLineBall(amountOfBalls)
})

document.addEventListener('mouseup', () => {
    amountOfBalls = 1
    triangle = false
    changeColorMethod[colorMethod]()
})

class Ball {
    constructor() {
        const { x, y } = mouse
        this.hue = chooseColor[colorMethod]()
        this.line = false
        this.x = x
        this.y = y
        this.size = Math.random() * 30 + 10
        this.speedX = (Math.random() * 15) - 7.5
        this.speedY = (Math.random() * 15) - 7.5
        this.color = `hsl(${ this.hue + color }, 100%, 50%)`
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.3)
            this.size -= 0.2
    }
    draw() {
        const {x, y, size, color} = this
        context.fillStyle = color
        context.beginPath()
        context.arc(x, y, size, 0, Math.PI * 2)
        context.fill() 
    }
    changeSingleBall() {
        this.color = this.color = `hsl(${ this.hue + color*3 }, 100%, 50%)`
    }
    ballsCollisions() {
        const nextBallStepX = this.x + this.speedX
        const nextBallStepY = this.y + this.speedY
        if (nextBallStepX - this.size <= 0) {
            this.x = this.size
            this.speedX *= -1
        }
        if (nextBallStepY - this.size <= 0) {
            this.y = this.size
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

function createLineBall(amount) {
    for (let i = 0; i < amount; i++) {
        const ballLine = new Ball()
        ballLine.line = true
        ballsArray.push(ballLine)
    }
}

function handleBalls() {
    for (let i = 0; i < ballsArray.length; i++) {
        ballsArray[i].update()
        ballsArray[i].draw()
        ballsArray[i].changeSingleBall()
        ballsArray[i].ballsCollisions()
        for (let j = 1; j < ballsArray.length; j++) {
            const ball = ballsArray[j];
            const xDistance = ballsArray[i].x - ball.x
            const yDistance = ballsArray[i].y - ball.y
            const distance = Math.sqrt(yDistance * yDistance + xDistance * xDistance)
            if (distance < 100) {
                context.beginPath()
                if (ball.line && ballsArray[i].line) {
                    context.strokeStyle = ballsArray[i].color;
                    context.moveTo(ballsArray[i].x, ballsArray[i].y)
                    context.lineTo(ball.x, ball.y)
                }
                context.stroke()   
            }
        }
        if (ballsArray[i].size <= 0.3) {
            ballsArray.splice(i, 1)
            i--
        }
    }
}

function animateBalls() {
    const { width, height } = canvas
    context.fillStyle='rgba(0,0,0,0.4)'
    context.fillRect(0, 0, width, height)
    handleBalls()
    color++
    requestAnimationFrame(animateBalls)
}
requestAnimationFrame(animateBalls)
