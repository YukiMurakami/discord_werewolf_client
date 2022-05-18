import {Button} from "./button.js"
import {rolename2token} from "../config.js"


class RoleSetter {
    constructor(infos, rolename, parent, width, x, y, func) {
        this.infos = infos
        this.parent = parent
        this.element = null;
        this.width = width
        this.rolename = rolename
        this.func = func
        this.x = x
        this.y = y
        this.up = null
        this.down = null
        this.num = null
    }

    draw(infos) {
        if (!this.element) {
            let card = document.createElement("div")
            card.style.backgroundImage = "url(" + "./images/cards/" + this.rolename + ".png" + ")"
            card.style.backgroundSize = "100%"
            card.style.position = "absolute"
            card.style.width = this.width
            card.style.height = this.width / 938 * 1125
            card.style.top = 10
            card.style.left = this.x
            this.parent.appendChild(card)
            this.element = card

            let up = new Button(
                    "＋１", this.parent, this.func,
                    80, 9 + this.x, 10 + 124, "+" + this.rolename
            )
            this.up = up

            let down = new Button(
                    "－１", this.parent, this.func,
                80, 9 + this.x, 10 + 154, "-" + this.rolename
            )
            this.down = down

            this.up.draw()
            this.down.draw()

            this.num = document.createElement("div")
            this.num.style.position = "absolute"
            this.num.style.color = "#ffffff"
            this.num.style.top = 197
            this.num.style.left = 45 + this.x
            this.parent.appendChild(this.num)
        }

        this.infos = infos

        let status = this.infos["game_status"]
        let count = status["rule"]["roles"][rolename2token(this.rolename)]
        this.num.innerHTML = count ? count : 0
    }
}


export class RoleMenu {
    constructor(infos, parent, width, x, y, func) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.func = func
        this.x = x
        this.y = y
        this.cards = []
    }

    draw(showflag) {
        let status = this.infos["game_status"]
        let players = status["players"]
        let roles = [
            "villager",
            "werewolf",
            "seer",
            "medium",
            "bodyguard",
            "madman",
            "mason",
            "cultist",
            "fox",
        ]
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.id = "role_menu"
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.2
            this.element.style.borderRadius = "1%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"
            for (let i=0;i<roles.length;i++) {
                let card = new RoleSetter(
                    this.infos, roles[i], this.element, 100, 100 * i, 0, this.func
                )
                this.cards.push(card)
            }
        }
        for (let i=0;i<roles.length;i++) {
            this.cards[i].draw(this.infos)
        }
        this.element.hidden = !showflag
    }
}
