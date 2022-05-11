export class Button {
    constructor(title, parent, func, width, x, y, key, confirm_message=null) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.func = func
        this.width = width
        this.x = x
        this.y = y
        this.key = key
        this.confirm_message = confirm_message
    }

    draw(title="", key="") {
        if (title != "") {
            this.title = title
        }
        let last_key = this.key
        if (key != "") {
            this.key = key
        }
        if (!this.element) {
            this.element = document.createElement("input")
            this.element.type = "button"
            this.element.classList.add("button")
            if (!this.key) {
                this.element.addEventListener("click", this.func)
            } else {
                this.element.addEventListener("click", {
                    message: this.key,
                    confirm_message: this.confirm_message,
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
        this.element.value = this.title
        if (this.key != last_key) {
            // イベントを変更
            if (last_key == null) {
                this.element.removeEventListener("click", this.func)
            } else {
                this.element.removeEventListener("click", {
                    message: last_key,
                    confirm_message: this.confirm_message,
                    handleEvent: this.func
                })
            }
            if (this.key == null) {
                this.element.addEventListener("click", this.func)
            } else {
                this.element.addEventListener("click", {
                    message: this.key,
                    confirm_message: this.confirm_message,
                    handleEvent: this.func
                })
            }
        }
    }
}
