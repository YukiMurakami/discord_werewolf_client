import {Button} from "./button.js"
import {rolename2token, engname2description, token2engname} from "../config.js"
import {show_role_description} from "../app.js"

var global_start_index = null

class DetectiveRoleSetter {
    constructor(infos, playername, rolename, parent, width, x, y, ratio, reorder_callback, detective_flag) {
        this.infos = infos
        this.parent = parent
        this.element = null;
        this.roletext = null;
        this.width = width
        this.rolename = rolename
        this.playername = playername
        this.x = x
        this.y = y
        this.ratio = ratio
        this.reorder_callback = reorder_callback
        this.detective_flag = detective_flag
    }

    drag_start(e) {
        let index = Math.floor((parseInt(e.target.style.left) / this.width) + 0.5)
        global_start_index = index
    }

    drag_end(e) {
        let end = Math.floor((parseInt(e.target.style.left) / this.width) + 0.5)
        let start = global_start_index
        let answer = this.result["now_detective_answer"]
        let a = answer[start]
        answer[start] = answer[end]
        answer[end] = a
        console.log(start, end, answer)
        this.func(answer)
        /*
        let a = this.result["now_detective_answer"][start]
        this.result["now_detective_answer"][start] = this.result["now_detective_answer"][end]
        this.result["now_detective_answer"][end] = a
        console.log(this.result)
        console.log(this.cards)
        for (let i=0;i<this.result["now_detective_answer"].length;i++) {
            this.cards[i].rolename = this.result["now_detective_answer"][i]
            this.cards[i].draw(this.result)
        }
        */
    }

    draw(infos) {
        if (!this.element) {
            let card = document.createElement("img")
            card.src = "./images/cards/" + this.rolename + ".png"
            card.style.backgroundSize = "100%"
            card.style.position = "absolute"
            card.style.width = this.width
            card.style.height = this.width / 938 * 1125
            card.style.top = 10 * this.ratio
            card.style.left = this.x
            card.draggable = this.detective_flag
            this.element = card

            if (this.detective_flag) {
                card.addEventListener("dragstart", {
                    handleEvent: this.drag_start, width: this.width})
                card.addEventListener("dragover", function(e) {
                    e.preventDefault()
                })
                card.addEventListener("drop", {
                    handleEvent: this.drag_end,
                    width: this.width,
                    func: this.reorder_callback,
                    result: this.infos
                })
            }

            this.roletext = document.createElement("div")
            this.roletext.style.position = "absolute"
            this.roletext.style.color = "#ffffff"
            this.roletext.style.top = this.width / 938 * 1125 + 20 * this.ratio
            this.roletext.style.left = this.x
            this.roletext.style.width = this.width
            this.roletext.style.fontSize = (14 * this.ratio).toString() + "px"
            this.roletext.style.textAlign = "center"
            this.roletext.innerHTML = this.playername

            this.parent.appendChild(card)
            this.parent.appendChild(this.roletext)
        }
        this.element.src = "./images/cards/" + this.rolename + ".png"
        console.log("draw", this.element.backgroundImage)
        this.infos = infos
    }
}

export class DetectiveMenu {
    constructor(infos, parent, width, x, y, ratio, reorder_callback, complete_callback, detective_flag) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.result = []
        this.x = x
        this.y = y
        this.cards = []
        this.height = null;
        this.ratio = ratio
        this.reorder_callback = reorder_callback
        this.complete_callback = complete_callback
        this.detective_flag = detective_flag //自分が推理中の探偵かどうか
        this.button = null;
        console.log(this.infos)
    }

    draw(showflag) {
        this.infos["now_detective_answer"] = this.infos["game_status"]["now_detective_answer"]
        let status = this.infos["game_status"]
        let players = status["players"]
        if (!this.element) {
            this.height = this.width * 0.17 // 0.22
            this.element = document.createElement("div")
            this.element.id = "detective_menu"
            this.element.style.position = "absolute"
            this.element.style.zIndex = 1000000
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
            console.log(this.infos)
            let card_w = 64 * this.ratio
            for (let i=0;i<players.length;i++) {
                let card = new DetectiveRoleSetter(
                    this.infos, players[i]["name"], this.infos["now_detective_answer"][i],
                    this.element,
                    card_w, card_w * i, 0, this.ratio,
                    this.reorder_callback, this.detective_flag
                )
                this.cards.push(card)
                console.log(this.cards)
            }

            this.button = new Button(
                "推理確定", this.element, this.complete_callback, card_w,
                (this.width - card_w) / 2 - this.ratio * 5,
                this.width * 0.17 - card_w / 132 * 45 * 1.05 ,
                "detective_complete:", true, this.infos
            )
        }
        console.log(players, this.cards)
        for (let i=0;i<players.length;i++) {
            this.cards[i].rolename = this.infos["now_detective_answer"][i]
            this.cards[i].draw(this.infos)
        }
        if (this.detective_flag) {
            this.button.draw("推理確定", "detective_complete:")
            this.button.element.hidden = false
        } else {
            this.button.element.hidden = true
        }
        this.element.hidden = !showflag
    }
}
