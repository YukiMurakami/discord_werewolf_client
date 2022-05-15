export class Background {
    constructor(parent, width, height) {
        this.type = null;
        this.parent = parent;
        this.element = null;
        this.width = width
        this.height = height
        this.cover = null;
    }

    draw(type) {
        this.type = type
        //console.log("back draw", this.type)
        if (!this.element) {
            this.element = document.createElement("img")
            this.element.style.width = this.width
            this.element.style.height = this.height

            this.cover = document.createElement("img")
            this.cover.style.width = this.width
            this.cover.style.height = this.height
            this.cover.style.position = "absolute"
            this.cover.style.top = "7.5"
            this.cover.style.left = "7.5"
            this.parent.appendChild(this.element)
            this.parent.appendChild(this.cover)
        }

        if (this.type == "black") {
            this.cover.style.backgroundColor = "rgba(0, 0, 0, 1)"
        } else {
            let image = this.type
            if (this.type == "werewolf_win") {
                image = "afternoon"
            }
            if (this.type == "fox_win") {
                image = "afternoon"
            }
            this.element.src = "./images/backgrounds/" + image + ".jpg"
            this.cover.style.backgroundColor = "rgba(255,255,255,0.1)"
            if (this.type == "werewolf_win") {
                this.cover.style.backgroundColor = "rgba(255,0,0,0.5)"
            }
            if (this.type == "fox_win") {
                this.cover.style.backgroundColor = "rgba(255,255,0,0.5)"
            }
        } 
    }
}
