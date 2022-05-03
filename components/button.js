export class Button {
    constructor(title, parent, func, width, x, y, key) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.func = func
        this.width = width
        this.x = x
        this.y = y
        this.key = key
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement("input")
            this.element.type = "button"
            this.element.value = this.title
            this.element.classList.add("button")
            if (!this.key) {
                this.element.addEventListener("click", this.func)
            } else {
                this.element.addEventListener("click", {
                    message: this.key,
                    handleEvent: this.func
                })
            }
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width / 132 * 45
            this.element.style.fontSize = Number(this.element.clientHeight / 45 * 100).toString() + "%"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
        }
    }
}
