const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const particlesArray = []
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
        return Math.floor(Math.random() * 255 + 1)
    }
}

document.addEventListener('mousemove', ({ x, y }) => {
    mouse.x = x
    mouse.y = y
    createParticle(amountOfBalls)
})

document.addEventListener('mousedown', ({ x, y }) => {
    mouse.x = x
    mouse.y = y
    amountOfBalls = 10
    createParticle(6)
    changeColorMethod[colorMethod]()
})

document.addEventListener('mouseup', () => {
    amountOfBalls = 1
    changeColorMethod[colorMethod]()
})

class Particle {
    constructor() {
        const { width, height } = canvas
        const { x, y } = mouse
        const hue = chooseColor[colorMethod]()
        this.x = x
        this.y = y
        this.size = Math.random() * 15 + 1;
        this.speedX = (Math.random() * 6) - 3
        this.speedY = (Math.random() * 6) - 3
        this.color = `hsl(${ hue }, 100%, 50%)`
    }
    update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.5)
            this.size -= 0.4
    }
    draw() {
        const {x, y, size, color} = this
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2)
        context.fill() 
    }
}

function createParticle(amount) {
    for (let i = 0; i < amount; i++) {
        particlesArray.push(new Particle())
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
        if (particlesArray[i].size <= 0.5) {
            particlesArray.splice(i, 1);
            i--
        }
    }
}

function animate() {
    const { width, height } = canvas
    // context.clearRect(0, 0, width, height);
    context.fillStyle='rgba(0,0,0,0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height)
    handleParticles()
    color++
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)