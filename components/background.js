export class Background {
    constructor(type, parent, width, height) {
        this.type = type
        this.parent = parent;
        this.element = null;
        this.width = width
        this.height = height
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.width = this.width
            this.element.style.height = this.height
            if (this.type == "black") {
                this.element.style.backgroundColor = "#000000"
            } else {
                let image = this.type
                if (this.type == "werewolf_win") {
                    image = "afternoon"
                }
                this.element.style.backgroundImage = "url(" + "./images/backgrounds/" + image + ".jpg" + ")"
                this.element.style.backgroundSize = "100%"

                let back2 = document.createElement("div")
                back2.style.width = this.width
                back2.style.height = this.height
                back2.style.backgroundColor = "rgba(255,255,255,0.1)"
                if (this.type == "werewolf_win") {
                    back2.style.backgroundColor = "rgba(255,0,0,0.5)"
                }
                this.element.appendChild(back2)
            }

            this.parent.appendChild(this.element)
        }
    }
}
