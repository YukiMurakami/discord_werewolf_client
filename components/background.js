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
            this.element = document.createElement("div")
            this.element.style.width = this.width
            this.element.style.height = this.height

            this.cover = document.createElement("div")
            this.cover.style.width = this.width
            this.cover.style.height = this.height
            this.element.appendChild(this.cover)
            this.parent.appendChild(this.element)
        }

        if (this.type == "black") {
            this.element.style.backgroundColor = "#000000"
            this.cover.style.backgroundColor = "rgba(255,255,255,0.0)"
            this.element.style.backgroundImage = null
        } else {
            let image = this.type
            if (this.type == "werewolf_win") {
                image = "afternoon"
            }
            this.element.style.backgroundImage = "url(" + "./images/backgrounds/" + image + ".jpg" + ")"
            this.element.style.backgroundSize = "100%"

            this.cover.style.backgroundColor = "rgba(255,255,255,0.1)"
            if (this.type == "werewolf_win") {
                this.cover.style.backgroundColor = "rgba(255,0,0,0.5)"
            }
        } 
    }
}
