import {Button} from "./button.js"
import {rolename2token, engname2description} from "../config.js"
import {show_role_description} from "../app.js"

class RoleSetter {
    constructor(infos, rolename, parent, width, x, y, func, show_button) {
        this.infos = infos
        this.parent = parent
        this.element = null;
        this.width = width
        this.rolename = rolename
        this.func = func
        this.show_button = show_button
        this.x = x
        this.y = y
        this.up = null
        this.down = null
        this.num = null
        this.roletext = null
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

            if( this.show_button ){
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
            } else {
                card.addEventListener("mouseover", {
                    showflag: true,
                    role:this.rolename,
                    handleEvent: show_role_description
                })
                card.addEventListener("mouseout", {
                    showflag: false,
                    role:this.rolename,
                    handleEvent: show_role_description
                })

                this.roletext = document.createElement("div")
                this.roletext.style.position = "absolute"
                this.roletext.style.color = "#ffffff"
                this.roletext.style.top = this.width / 938 * 1125 + 20
                this.roletext.style.left = this.x + 30
                this.parent.appendChild(this.roletext)
                this.roletext.innerHTML = engname2description(this.rolename)["name"]
            }

            this.parent.appendChild(card)
            this.element = card

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
        this.num.hidden = !this.show_button
    }
}


export class RoleMenu {
    constructor(infos, parent, width, x, y, func, show_button , message) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.func = func
        this.show_button = show_button
        this.message = message
        this.x = x
        this.y = y
        this.cards = []
        this.height = null;
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
            if(this.show_button) {
                this.height = this.width * 0.22
            } else {
                this.height = this.width * 0.17
            }
            this.element = document.createElement("div")
            this.element.id = "role_menu"
            this.element.style.position = "absolute"
            this.element.style.zIndex = 100
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.height
            this.element.style.borderRadius = "1%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"
            for (let i=0;i<roles.length;i++) {
                let card = new RoleSetter(
                    this.infos, roles[i], this.element, 100, 100 * i, 0, this.func , this.show_button
                )
                this.cards.push(card)
            }
            let close_button = document.createElement("div")
            close_button.id = "close_button"
            close_button.style.position = "absolute"
            close_button.style.zIndex = 100
            close_button.style.width = 20;
            close_button.style.height = 20;
            close_button.style.right = "-10px"
            close_button.style.top = "-40px"
            close_button.style.color = "#eeeeee"
            close_button.style.fontSize = "200%"
            close_button.style.cursor = "pointer"
            close_button.addEventListener("click", {
                message: this.message,
                handleEvent:this.func
            })
            this.element.appendChild(close_button)
            close_button.innerHTML = "×"
        }
        for (let i=0;i<roles.length;i++) {
            this.cards[i].draw(this.infos)
        }
        this.element.hidden = !showflag
    }
}
