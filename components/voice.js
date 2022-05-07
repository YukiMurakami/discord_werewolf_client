export class Voice {
    constructor(infos, parent, width, x, y) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
    }

    draw() {
        let status = this.infos["game_status"]
        let players = status["players"]
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.3
            this.element.style.borderRadius = "8%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"

            let image = document.createElement("img")
            image.src = "./images/ui/mic.png"
            image.style.position = "absolute"
            image.style.height = this.width * 0.3 * 0.6
            image.style.top = this.width * 0.3 * 0.4 / 2
            image.style.left = this.width * 0.3 * 0.4 / 2
            this.element.appendChild(image)

            this.mes = document.createElement("div")
            this.mes.style.fontSize = "100%"
            this.mes.style.position = "absolute"
            this.mes.style.width = this.width
            this.mes.style.height = this.width * 0.3 * 0.6
            this.mes.style.top = this.width * 0.3 * 0.4 / 2
            this.mes.style.left = this.width * 0.3 * 0.4 / 2 + this.width * 0.3 * 0.6
            this.mes.style.color = "#eeeeee"
            this.element.appendChild(this.mes)
        }
        let message_str = ""
        let voice = ""
        for (let i=0;i<players.length;i++) {
            if (players[i]["discord_id"] == this.infos["discord_id"]) {
                if (players[i]["voice"]) {
                    voice = players[i]["voice"]
                }
            }
        }
        message_str = voice.replace(/[0-9]/gi, "")
        this.mes.innerHTML = message_str
    }
}
