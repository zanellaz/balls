const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ballsArray = []
const trianglesArray = []
let amountOfBalls = 3
let colorMethod = 'randomColor'
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
    amountOfBalls = 1
    changeColorMethod[colorMethod]()
    createTriangle()
})

document.addEventListener('mouseup', () => {
    amountOfBalls = 3
    triangle = false
    changeColorMethod[colorMethod]()
})

class Ball {
    constructor() {
        const { x, y } = mouse
        this.hue = chooseColor[colorMethod]()
        this.vertex = undefined
        this.x = x
        this.y = y
        this.size = Math.random() * 30 + 3
        this.speedX = (Math.random() * 5) - 2.5
        this.speedY = (Math.random() * 5) - 2.5
        this.color = `hsl(${ this.hue + color }, 100%, 50%)`
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.2)
            this.size -= 0.19
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

function createTriangle() {
    const triangle = [new Ball(), new Ball(), new Ball()]
    triangle.forEach(ball => {
        ballsArray.push(ball)
    });
    trianglesArray.push(triangle)
}

function handleTriangles() {
    trianglesArray.forEach(triangle => {
        const [v1, v2, v3] = triangle
        if (v1) {
            context.moveTo(v1.x, v1.y)
        }
        if (v2) {
            context.lineTo(v2.x, v2.y)
        }
        if (v3) {
            context.lineTo(v3.x, v3.y)
        }
        removeTriangle()
        context.closePath()
        // context.fillStyle = `hsl(${ v1.hue }, 100%, 50%)`
        context.fill()
    })
}

function removeTriangle(triangle) {
    for (let i = 0; i < trianglesArray.length; i++) {
        const triangle = trianglesArray[i];
        if (!triangle) {
            trianglesArray.splice(i, 1)
        }
        // console.log(triangle);
    }
    // console.log(trianglesArray);
}

function handleBalls() {
    for (let i = 0; i < ballsArray.length; i++) {
        ballsArray[i].update()
        ballsArray[i].draw()
        ballsArray[i].changeSingleBall()
        ballsArray[i].ballsCollisions()
        if (ballsArray[i].size <= 0.2) {
            ballsArray.splice(i, 1)
            i--
        }
        trianglesArray.forEach(triangle => {
            for (let i = 0; i < triangle.length; i++) {
                const ball = triangle[i];
                if (ball.size <= 0.2) {
                    triangle.splice(i, 1)
                    i--
                }
            }
        });
    }
}

function animateBalls() {
    const { width, height } = canvas
    context.fillStyle='rgba(0,0,0,0.5)'
    context.fillRect(0, 0, width, height)
    handleBalls()
    handleTriangles()
    color++
    requestAnimationFrame(animateBalls)
}
requestAnimationFrame(animateBalls)
