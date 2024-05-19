let r_w = 1550
const r_h = 900

let sun = {
    html: document.getElementById('sun'),
    x: 0,
    y: 280,
    diameter: 150,
    x_v: 0.2,
}

function risingSun() {
    sun.x += sun.x_v

    if (sun.x > r_w) {
        sun.x = 0
    }
    sun.html.style.left = Math.floor(sun.x) + 'px'
    sun.html.style.top = Math.floor(sun.y) + 'px'
}

function tegnSol() {
    risingSun(sun)
    requestAnimationFrame(tegnSol)
}
tegnSol()

let saldo = document.getElementById('saldo')
let priceSeed = document.getElementById('priceS')
let priceWater = document.getElementById('priceW')
let flower = document.getElementById("flower")
const seed = document.getElementById('seed')
const watering = document.getElementById('watering-can')
const pooring = document.getElementById('pooring')

// verdier og saldo
let penger = parseInt(localStorage.getItem("penger")) || 0
saldo.innerHTML = penger
let progress = 0

let openGame = document.getElementById('openGame')
let playGame = document.getElementById('playGame')
let gameInstructions = document.getElementById('gameInstructions')
let exitGame = document.getElementById('exitGame')
let canvas = document.getElementById('gameCanvas')
let snakeGame = document.getElementById('snakeGame')
let gameOver = document.getElementById('loss')
let newRound = document.getElementById('newRound')
let backBtn = document.getElementById('back')

openGame.onclick = function () {
    snakeGame.style.display = 'flex'
    gameInstructions.style.display = 'block'
    hurra.style.zIndex = 'block'
}

exitGame.onclick = function () {
    canvas.style.display = 'none'
    snakeGame.style.display = 'none'
}
const canvas_border_color = 'rgb(8,46,10)'
const canvas_background_color = 'rgb(231,235,214)'
const snake_color = 'rgb(171,185,112)'
const sun_color = 'rgb(242,214,71)'
const sun_border_color = 'rgb(201,170,14)'

let snake = [
    { x: 240, y: 240 },
    { x: 220, y: 240 },
    { x: 200, y: 240 },
    { x: 180, y: 240 },
    { x: 160, y: 240 },
]

// horisontal fart
let dx = 20
// vertikal fart
let dy = 0

let v = 0.5 // Startfarten
let acceleration = 0.5 // Økningsverdi for farten


let sunX, sunY

let gameCanvas = document.getElementById('gameCanvas')
let ctx = gameCanvas.getContext('2d')

ctx.fillStyle = canvas_background_color
ctx.strokestyle = canvas_border_color

ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)

// start spillet
playGame.onclick = function () {
    gameInstructions.style.display = 'none'
    canvas.style.display = 'block'
    main()
}

createSun()
// kaller på funksjonen som lar deg styre slangen
document.addEventListener('keydown', changeDirection)

function main() {
    if (didGameEnd()) return

    setTimeout(function onTick() {
        clearCanvas()
        drawSun()
        advanceSnake()
        drawSnake()

        main()
    }, 120)
}

// fjerner "sporet" etter slangen
function clearCanvas() {
    ctx.fillStyle = canvas_background_color
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (didCollide) {
            showGameOverMessage()
            return true
        }
    }
    const hitLeftWall = snake[0].x < 0
    const hitRightWall = snake[0].x > gameCanvas.width - 20
    const hitTopWall = snake[0].y < 0
    const hitBottomWall = snake[0].y > gameCanvas.height - 20

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        showGameOverMessage()
        return true
    }

    return false
}

function showGameOverMessage() {
    // viser game over melding når slangen kolliderer mer noe
    penger += score // Oppdater saldoen med den nåværende scoren
    localStorage.setItem("penger", penger)
    saldo.innerHTML = penger
    setTimeout(function () {
        gameOver.style.display = 'block'
    }, 1000)
    v = 0.5
}

function drawSun() {
    ctx.fillStyle = sun_color
    ctx.strokeStyle = sun_border_color
    ctx.fillRect(sunX, sunY, 20, 20)
    ctx.strokeRect(sunX, sunY, 20, 20)
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }
    snake.unshift(head)

    const didEatSun = snake[0].x === sunX && snake[0].y === sunY
    if (didEatSun) {
        score = parseInt(document.getElementById('score').innerText)
        if (score < 10) {
            score += 1
        }else if(score > 10 || score < 20) {
            score += 2
        } else{
            score += 5
        }
        document.getElementById('score').innerText = score
        createSun()
        v += acceleration
        console.log(v)
    } else {
        snake.pop()
    }
}

newRound.onclick = function () {
    score = 0 // Nullstill score
    document.getElementById('score').innerHTML = score // Oppdater visning av score
    snake = [ // Sett slangen tilbake til startposisjonen
        { x: 240, y: 240 },
        { x: 220, y: 240 },
        { x: 200, y: 240 },
        { x: 180, y: 240 },
        { x: 160, y: 240 },
    ]
    gameOver.style.display = 'none' // Skjul game over-skjermen
    main()// Start spillet på nytt
}

backBtn.onclick = function () {
    score = 0 // Nullstill score
    document.getElementById('score').innerHTML = score // Oppdater visning av score
    snake = [ // Sett slangen tilbake til startposisjonen
        { x: 240, y: 240 },
        { x: 220, y: 240 },
        { x: 200, y: 240 },
        { x: 180, y: 240 },
        { x: 160, y: 240 },
    ]
    snakeGame.style.display = 'none'
    gameInstructions.style.display = 'none'
    canvas.style.display = 'none'
    gameOver.style.display = 'none'
}

// finner random plass til vann, tegner vann, og passer på at vann ikke er likt som planten
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 20) * 20
}

function createSun() {
    sunX = randomTen(0, gameCanvas.width - 20)
    sunY = randomTen(0, gameCanvas.height - 20)

    snake.forEach(function isOnSnake(part) {
        if (part.x == sunX && part.y == sunY) createSun()
    })
}

// tegner slange
function drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = snake_color

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20)
}

function changeDirection(event) {
    const left_key = 37
    const right_key = 39
    const up_key = 38
    const down_key = 40

    const keyPressed = event.keyCode

    const goingUp = dy === -20
    const goingDown = dy === 20
    const goingRight = dx === 20
    const goingLeft = dx === -20

    if (keyPressed === left_key && !goingRight) {
        dx = -20
        dy = 0
    }

    if (keyPressed === up_key && !goingDown) {
        dx = 0
        dy = -20
    }

    if (keyPressed === right_key && !goingLeft) {
        dx = 20
        dy = 0
    }

    if (keyPressed === down_key && !goingUp) {
        dx = 0
        dy = 20
    }
}

priceSeed.onclick = function () {
    let saldoVerdi = parseInt(saldo.innerText) // Konverter saldo til et tall

    if (saldoVerdi === 0 || saldoVerdi <= 25) {
        priceSeed.style.color = 'rgb(188, 29, 29)'
    } else {
        seed.style.left = (window.innerWidth / 2 - 50) + 'px' // Center horizontally
        seed.style.top = (window.innerHeight * 0.65 - 50) + 'px'
        seed.style.transition = '3s'
        setTimeout(function () {
            seed.style.display = 'none'
        }, 4000)

        progress += 25 // Oppdater fremdrift
        // localStorage.setItem("progress", progress) // Lagre fremdrift som et tall
        if (progress === 25) {

            setTimeout(function () {
                flower.src = 'images/growing.png'

            }, 4100)

            if (progress >= 25) {
                penger -= 25
                localStorage.setItem("penger", penger) // Lagre penger som et tall
            }
        }

        if (saldoVerdi <= 25 && saldoVerdi < 10) {
            priceSeed.style.color = 'rgb(188, 29, 29)'
            priceWater.style.color = 'rgb(188, 29, 29)'
        }

        if (saldoVerdi < 25 || penger === 0) {
            priceSeed.style.color = 'rgb(188, 29, 29)'
        }

        saldo.innerHTML = penger
    }
}

let hurra = document.getElementById('hurra')
let finished = new Audio ('audio/finished.mp3')
priceWater.onclick = function () {
    let saldoVerdi = parseInt(saldo.innerText) // Konverter saldo til et tall
    if (saldoVerdi === 0 || saldoVerdi < 20) {
        // Do nothing
    } else {
        penger -= 20
        localStorage.setItem("penger", penger) // Lagre penger som et tall
        priceWater.style.color = 'black'
        if (progress >= 25) {
            progress += 20 // Oppdater fremdrift
        }

        setTimeout(function () {
            if (progress === 25) {
                flower.src = 'images/growing.png'
            }
            if (progress === 45) {
                flower.src = 'images/no-flower.png'

            }
            if (progress === 65) {
                flower.src = 'images/sad-center.png'
                flower.classList.add("sad-flower")
            }
            if (progress === 85) {
                flower.src = 'images/happy1.png'
                flower.classList.remove("sad-flower")
                hurra.style.display = 'block'
                finished.play()

            }
        }, 4100)


    }

    watering.style.left = (window.innerWidth * 0.55 - 125) + 'px'
    watering.style.top = (window.innerHeight * 0.35 - 125) + 'px'
    watering.style.transition = '3s'
    setTimeout(function () {
        watering.style.display = 'none'
        pooring.style.display = 'block'
        pooring.style.transition = '3s'
    }, 4000)
    setTimeout(function () {
        pooring.style.display = 'none'
        watering.style.display = 'block'
        watering.style.left = (window.innerWidth * 0.85 - 125) + 'px'
        watering.style.top = (window.innerHeight * 0.60 - 125) + 'px'
        watering.style.transition = '3s'
    }, 5000)


    if (saldoVerdi < 20 || penger === 0) {
        priceWater.style.color = 'rgb(188, 29, 29)'
    }
    if (saldoVerdi < 25 && saldoVerdi < 20) {
        priceSeed.style.color = 'rgb(188, 29, 29)'
    }
    saldo.innerHTML = penger
}



let info = document.querySelectorAll('.slider')
let dots = document.querySelectorAll('.dot')
let currentInfo = 0

function changeSlide(n) {
    for (let i = 0; i < info.length; i++) { // reset
        info[i].style.opacity = 0;
        dots[i].className = dots[i].className.replace(' active', '')
    }

    currentInfo = n

    info[currentInfo].style.opacity = 1
    dots[currentInfo].className += ' active'

}

changeSlide(0)
// Event listener for piltaster
document.addEventListener('keydown', function (event) {
    const left_key = 37
    const right_key = 39
    const keyPress = event.keyCode

    if (keyPress === left_key) {
        if (currentInfo > 0) {
            changeSlide(currentInfo - 1)
        }
    } else if (keyPress === right_key) {
        if (currentInfo < info.length - 1) {
            changeSlide(currentInfo + 1)
        }
    }
})

// Legg til event listeners for knappene
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        changeSlide(index)
    })
})


// Initialize the first slide as visible
changeSlide(0)

let exitAndPlay = document.getElementById('exitAndPlay')
let howTo = document.getElementById('howTo')

exitAndPlay.onclick = function () {
    howTo.style.display = 'none'
}
document.addEventListener('keydown', function (event) {
    const esc_key = 27
    const keyPress = event.keyCode
    const howTo = document.getElementById('howTo')

    if (keyPress === esc_key) {
        howTo.style.display = 'none'
    }
})


let helpBtn = document.getElementById('help')

helpBtn.onclick = function () {
    howTo.style.display = 'block'
    changeSlide(0)
}
