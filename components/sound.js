export class Volume {
    constructor(parent, width, x, y, sound, infos, ratio) {
        this.parent = parent;
        this.element = null;
        this.width = width
        this.sound = sound
        this.infos = infos
        this.x = x
        this.y = y
        this.ratio = ratio
    }

    callback() {
        console.log(this.sound)
        this.sound.set_volume(this.element.value)
        this.infos["volume"] = this.element.value
        console.log(this.infos)
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement("input")
            this.element.type = "range"
            this.element.min = 0
            this.element.max = 1
            this.element.step = 0.1
            this.element.value = this.infos["volume"]
            this.sound.set_volume(this.infos["volume"])
            this.parent.appendChild(this.element)

            this.element.style.position = "absolute"
            this.element.style.width = this.width
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"

            let mes = document.createElement("div")
            this.parent.appendChild(mes)
            mes.innerHTML = "音量"
            mes.style.fontSize = (14 * this.ratio).toString() + "px"
            mes.style.color = "#000000"
            mes.style.textAlign = "center"
            mes.style.position = "absolute"
            mes.style.left = (this.x - 35 * this.ratio).toString() + "px"
            mes.style.top = this.y.toString() + "px"

            this.element.addEventListener("change", () => { this.callback() })
        }
    }
}



export class Sound {
    constructor() {
        this.dic = {}
        this.dic["craw"] = new Audio("./sounds/craw.mp3")
        this.dic["vote_bell"] = new Audio("./sounds/vote_bell.mp3")
        this.dic["minute_bell"] = new Audio("./sounds/minute_bell.mp3")
        this.dic["lose"] = new Audio("./sounds/lose.mp3")
        this.dic["morning"] = new Audio("./sounds/morning.mp3")
        this.dic["win"] = new Audio("./sounds/win.mp3")
        this.dic["night"] = new Audio("./sounds/night.wav")
        this.dic["detective"] = new Audio("./sounds/detective.mp3")
        this.dic["detective_win"] = new Audio("./sounds/detective_win.mp3")
        this.history = []
    }

    set_volume(volume) {
        for (let key in this.dic) {
            this.dic[key].volume = volume
            if (key == "craw") {
                this.dic[key].volume = volume * 0.5
            }
            if (key == "detective") {
                this.dic[key].volume = volume * 1.2
            }
            if (key == "detective_win") {
                this.dic[key].volume = volume * 1.2
            }
        }
    }

    reset() {
        this.history = []
    }

    stop() {
        for (let key in this.dic) {
            this.dic[key].pause()
            this.dic[key].currentTime = 0
        }
    }

    play(title, infos, option) {
        console.log("play before" + title)
        let game_status = infos["game_status"]
        let day = game_status["day"]
        let status = game_status["status"]
        let minute = game_status["minute"]
        let second = game_status["second"]
        let key = status + day.toString() + "/" + minute.toString() + ":" + second.toString()
        if (option != "") {
            key = status + day.toString() + "/" + option
        }
        if (title in this.dic) {
            console.log("play before2" + title)
            console.log(this.history)
            if (this.history.indexOf(key) == -1) {
                this.dic[title].play()
                console.log("play" + title)
                this.history.push(key)
            }
        }
    }
}
