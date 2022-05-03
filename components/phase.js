export class Phase {
    constructor(title, parent, width, x, y) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement("div")
            this.parent.appendChild(this.element)
            this.element.style.position = "absolute"
            this.element.style.backgroundImage = "url(./images/ui/phase.png)"
            this.element.style.backgroundSize = "100%"
            this.element.style.width = this.width
            this.element.style.height = this.width / 356 * 120
            this.element.style.fontSize = Number(this.element.clientHeight / 45 * 100).toString() + "%"
            if (this.title.length >= 6) {
                this.element.style.fontSize = Number(this.element.clientHeight / 45 * 100 * 0.8).toString() + "%"
            }
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"

            let mes = document.createElement("div")
            this.element.appendChild(mes)
            mes.innerHTML = this.title
            mes.style.color = "#000000"
            mes.style.textAlign = "center"
            this.element.style.position = "absolute"
            mes.style.padding = "7% 16% 0 16%"
        }
    }
}
