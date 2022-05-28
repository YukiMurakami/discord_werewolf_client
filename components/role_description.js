import {engname2description} from "../config.js"

export class RoleDescription {
    constructor(parent, width, x, y, ratio) {
        this.parent = parent;
        this.element = null;
        this.width = width;
        this.x = x;
        this.y = y;
        this.title = null;
        this.mes = null;
        this.ratio = ratio
    }

    draw(showflag, role) {
        if(!showflag){
            this.element = document.getElementById("role_description")
            this.element.remove();
            return;
        }
        let role_description = engname2description(role)
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.id = "role_description"
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.96
            this.element.style.borderRadius = "3%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"
            console.log(this.element)

            let card = document.createElement("div")
            card.style.backgroundImage = "url(" + "./images/cards/" + role + ".png" + ")"
            card.style.backgroundSize = "100%"
            card.style.position = "absolute"
            card.style.width = this.width * 0.24
            card.style.height = this.width * 0.24 / 938 * 1125
            card.style.top = 4 * this.ratio
            card.style.left = this.width * 0.65
            this.element.append(card)

            this.title = document.createElement("div")
            this.title.style.fontSize = (30 * this.ratio).toString() + "px"
            this.title.style.position = "absolute"
            this.title.style.textAlign = "center"
            this.title.style.width = this.width * 0.6
            this.title.style.height = this.width * 0.24 / 938 * 1125
            this.title.style.top = 20 * this.ratio
            this.title.style.left = 0
            this.title.style.color = "#eeeeee"
            this.title.style.padding = "0 0 0 10"
            this.element.appendChild(this.title)
            console.log(this.title)

            this.mes = document.createElement("p")
            this.mes.style.fontSize = (10 * 0.9 * this.ratio).toString() + "px"
            this.mes.style.position = "absolute"
            this.mes.style.width = this.width * 0.95
            this.mes.style.top = this.width * 0.24 / 938 * 1125 + 5 * this.ratio
            this.mes.style.color = "#eeeeee"
            this.mes.style.padding = "0 0 0 10"
            this.element.appendChild(this.mes)
            console.log(this.mes)

        }
        this.title.innerHTML = role_description["name"]
        this.mes.innerHTML = role_description["description"]
            + "<br>"
            + "<br>陣営：" + role_description["team"]
            + "<br>勝利条件：" + role_description["victory_condition"]
    }
}