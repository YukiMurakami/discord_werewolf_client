export class Account {
    constructor(name, avator_url, discord_id, parent, func, width, x, y, ratio) {
        this.name = name
        this.avator_url = avator_url
        this.discord_id = discord_id
        this.parent = parent;
        this.element = null;
        this.func = func
        this.width = width
        this.x = x
        this.y = y
        this.ratio = ratio
    }

    draw() {
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 1.2
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"

            let image = document.createElement("img")
            image.src = this.avator_url
            image.style.width = this.width
            image.style.borderRadius = "50%";
            this.element.appendChild(image)

            let mes = document.createElement("div")
            mes.innerHTML = this.name
            mes.style.textAlign = "center"
            mes.style.fontSize = (10 * this.ratio).toString() + "px"
            mes.style.color = "#ffffff"

            this.element.appendChild(mes)

            this.element.addEventListener(
                "click", {
                    message: this.discord_id,
                    handleEvent: this.func
                }
            )
        }
    }
}
