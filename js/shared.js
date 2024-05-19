const ramme_w = 1550
const ramme_h = 900


let cloud1 = {
    html: document.getElementById('cloud1'),
    x: 223,
    diameter: 200,
    x_v: 1,
}
let cloud2 = {
    html: document.getElementById('cloud2'),
    x: 700,
    diameter: 200,
    x_v: 1.3,
}

let cloud3 = {
    html: document.getElementById('cloud3'),
    x: 233,
    diameter: 200,
    x_v: 0.5,
}

let cloud4 = {
    html: document.getElementById('cloud4'),
    x: 540,
    diameter: 200,
    x_v: 1.8,
}
let cloud5 = {
    html: document.getElementById('cloud5'),
    x: 800,
    diameter: 200,
    x_v: 0.6,
}
let cloud6 = {
    html: document.getElementById('cloud6'),
    x: 100,
    diameter: 200,
    x_v: 0.3,
}

function floatySky(cloud) {
    cloud.x += cloud.x_v

    if (cloud.x > ramme_w) {
        cloud.x = 0 // Tilordne 0 til cloud.x
    }
    cloud.html.style.left = Math.floor(cloud.x) + 'px'
}

function tegn() {
    floatySky(cloud1)
    floatySky(cloud2)
    floatySky(cloud3)
    floatySky(cloud4)
    floatySky(cloud5)
    floatySky(cloud6)
    requestAnimationFrame(tegn)
}

tegn()


const settingsBtn = document.getElementById("settings")
const changeSet = document.getElementById('changeSet')

settingsBtn.onclick = function () {
    changeSet.style.display = 'block'
}

const exitBtn = document.getElementById('exit')
exitBtn.onclick = function () {
    changeSet.style.display = 'none'
}

document.addEventListener('keydown', function (event) {
    const esc_key = 27
    const keyPress = event.keyCode
    changeSet.style.display = 'none'

    if (keyPress === esc_key) {
        changeSet.style.display = 'none'
    }
})

let volumeChange = document.getElementById('volume')
let volumeValue = document.getElementById('volumeValue')
const sound = document.getElementById('sound')
let volumeImage = document.getElementById('music')

// Function to update volume based on slider value
function updateVolume(value) {
    volumeValue.innerHTML = value
    let volumePercentage = value / 100
    sound.volume = volumePercentage

    if (value == 0) {
        volumeImage.src = 'images/music-off.png'
    } else if (value > 0 && value < 40) {
        volumeImage.src = 'images/music-low.png'
    } else if (value >= 40 && value < 70) {
        volumeImage.src = 'images/music-medium.png'
    } else {
        volumeImage.src = 'images/music-on.png'
    }

    // Save the volume to localStorage
    localStorage.setItem('volumeLevel', value)
}

// Update volume when the slider value changes
volumeChange.oninput = function () {
    updateVolume(volumeChange.value)
}

// Mute sound when the volume image is clicked
volumeImage.onclick = function () {
    volumeImage.src = 'images/music-off.png'
    volumeValue.innerHTML = 0
    sound.volume = 0
    volumeChange.value = 0
    localStorage.setItem('volumeLevel', 0)
}

// Load the saved volume level from localStorage when the page loads
window.onload = function () {
    // Load saved volume
    let savedVolume = localStorage.getItem('volumeLevel')
    if (savedVolume !== null) {
        volumeChange.value = savedVolume
        updateVolume(savedVolume)
    } else {
        updateVolume(volumeChange.value) // Set to default if no saved volume
    }

    // Play sound automatically
    sound.play();

    // Restart sound when it ends
    sound.addEventListener('ended', function () {
        sound.currentTime = 0; // Set playback time to the beginning
        sound.play()
    })
}