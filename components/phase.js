export class Phase {
    constructor(title, parent, width, x, y, ratio) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
        this.ratio = ratio
    }

    draw(title) {
        this.title = title
        if (!this.element) {
            this.element = document.createElement("div")
            this.parent.appendChild(this.element)
            this.element.style.position = "absolute"
            this.element.style.backgroundImage = "url(./images/ui/phase.png)"
            this.element.style.backgroundSize = "100%"
            this.element.style.width = this.width
            this.element.style.height = this.width / 356 * 120
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.mes = document.createElement("div")
            this.element.appendChild(this.mes)
            this.mes.style.color = "#000000"
            this.mes.innerHTML = this.title
            this.mes.style.textAlign = "center"
            this.mes.style.position = "absolute"
            this.mes.style.fontSize = (16 * this.ratio).toString() + "px"
        }
        this.mes.innerHTML = this.title
        this.mes.style.left = ((this.width - this.mes.clientWidth) / 2).toString() + "px"
        this.mes.style.top = ((this.width / 356 * 120 - this.mes.clientHeight) / 2).toString() + "px"
    }
}
