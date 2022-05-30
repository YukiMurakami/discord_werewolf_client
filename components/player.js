import {Button} from "./button.js"
import { jpnname2engname } from "../config.js";

export class Player {
    constructor(infos, index, parent, width, x, y, func, role_func, ratio) {
        this.infos = infos
        this.index = index
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.func = func
        this.role_func = role_func

        this.participateColor = "#eeaa00"
        this.talkingColor = "#33ff33"
        this.outColor = "#cccccc"
        this.disconnectColor = "#dd0000"

        this.death = null;
        this.avator = null;
        this.rolecard = null;
        this.mes = null;
        this.buttons = {}

        this.role_icons = []
        this.hand = null;
        this.counter = null;

        this.vote_counter = null;

        this.ratio = ratio
    }

    draw(x, y) {
        this.x = x
        this.y = y
        let players = this.infos["game_status"]["players"]
        let my_player = null
        for (let i=0;i<players.length;i++) {
            if (players[i]["discord_id"] == this.infos["discord_id"]) {
                my_player = players[i]
            }
        }
        let speak = players[this.index]["speaking"]
        let role = jpnname2engname(players[this.index]["role"])
        if (this.infos["game_status"]["status"] == "ROLE_CHECK") {
            role = jpnname2engname("?")
        }

        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 1.2
            this.element.style.borderRadius = "8%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.borderWidth = (3 * this.ratio).toString() + "px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = this.participateColor
            this.element.id = players[this.index]["discord_id"]

            let image = document.createElement("img")
            image.src = players[this.index]["avator_url"]
            image.style.width = this.width * 0.7
            image.style.position = "absolute"
            image.style.left = this.width * 0.3 / 2
            image.style.top = this.width * 0.3 / 2
            image.style.borderRadius = "50%";
            this.element.appendChild(image)
            this.avator = image

            let death = document.createElement("img")
            death.src = "./images/ui/dead.png"
            death.style.width = this.width * 0.5
            death.style.position = "absolute"
            death.style.left = this.width * 0.5 / 2
            death.style.top = this.width * 0.5 / 2
            death.style.borderRadius = "50%";
            this.element.appendChild(death)
            this.death = death

            let hand = document.createElement("img")
            hand.src = "./images/ui/hand.png"
            hand.style.width = this.width * 0.8
            hand.style.position = "absolute"
            hand.style.left = this.width * -0.2
            hand.style.top = this.width * -0.3
            hand.style.borderRadius = "50%";
            this.element.appendChild(hand)
            this.hand = hand
            let counter = document.createElement("div")
            counter.innerHTML = "12"
            counter.style.textAlign = "center"
            counter.style.fontSize = (12 * this.ratio).toString() + "px"
            counter.style.color = "#000000"
            counter.style.position = "absolute"
            counter.style.width = this.width * 0.3
            counter.style.top = this.width * 0.08
            counter.style.left = this.width * 0.01
            this.element.appendChild(counter)
            this.counter = counter

            let card = document.createElement("div")
            card.style.backgroundImage = "url(" + "./images/cards/" + role + ".png" + ")"
            card.style.backgroundSize = "100%"
            card.style.position = "absolute"
            card.style.width = this.width * 0.3
            card.style.height = this.width * 0.3 / 938 * 1125
            card.style.top = this.width * 0.3 / 938 * 1125 * -0.05
            card.style.left = this.width * 0.7
            card.addEventListener("mouseover", {
                showflag: true,
                role:role,
                handleEvent: this.role_func
            })
            card.addEventListener("mouseout", {
                showflag: false,
                role:role,
                handleEvent: this.role_func
            })
            this.element.append(card)
            this.rolecard = card

            let index = document.createElement("div")
            index.innerHTML = (this.index + 1).toString()
            index.style.textAlign = "center"
            index.style.fontSize = (8 * this.ratio).toString() + "px"
            index.style.fontWeight = "bold"
            index.style.color ="#ffffff"
            // index.style.color = this.participateColor
            index.style.position = "absolute"
            index.style.top = this.width * -0.05
            index.style.right = this.width * -0.3
            index.style.width = this.width * 0.2
            index.style.height = this.width * 0.2
            index.style.borderRadius = "50%"; // 正円
            index.style.backgroundColor = "rgba(0,0,0,0.4)"
            index.style.borderWidth = "1.5px"
            index.style.borderStyle = "solid"
            index.style.borderColor = "#ffffff"
            // index.style.borderColor = this.participateColor
            this.element.appendChild(index)

            let mes = document.createElement("div")
            this.element.appendChild(mes)
            mes.innerHTML = "a"
            mes.style.textAlign = "center"
            mes.style.fontSize = (8 * this.ratio).toString() + "px"
            mes.style.color = "#ffffff"
            mes.style.position = "absolute"
            mes.style.width = this.width
            
            this.mes = mes

            this.vote_counter = document.createElement("div")
            this.element.append(this.vote_counter)
            this.vote_counter.innerHTML = "<b>" + this.index.toString() + "</b>"
            this.vote_counter.style.textAlign = "center"
            this.vote_counter.style.fontSize = (26 * this.ratio).toString() + "px"
            this.vote_counter.className = "fuchidori"
            this.vote_counter.style.position = "absolute"
            this.vote_counter.style.width = this.width
            this.vote_counter.style.top = -24 * this.ratio
        }

        this.element.style.left = this.x.toString() + "px"
        this.element.style.top = this.y.toString() + "px"

        this.element.style.borderColor = this.participateColor
        if (speak) {
            this.element.style.borderColor = this.talkingColor
        }

        if (!players[this.index]["live"]) {
            this.death.hidden = false
            this.avator.style.opacity = 0.2
            this.avator.style.backgroundColor = "#000000"
            this.element.style.borderColor = this.outColor
        } else {
            this.death.hidden = true
            this.avator.style.opacity = 1.0
        }
        this.rolecard.style.backgroundImage = "url(" + "./images/cards/" + role + ".png" + ")"

        if (players[this.index]["voted_count"] > 0) {
            this.vote_counter.innerHTML = "<b>" + players[this.index]["voted_count"].toString() + "</b>"
            this.vote_counter.hidden = false
        } else {
            this.vote_counter.hidden = true
        }
        let already_vote = ""
        if (this.infos["game_status"]["status"] == "VOTE") {
            if (players[this.index]["already_vote"]) {
                already_vote = "<br>(投票済み)"
            }
        }
        let skip = ""
        if (this.infos["game_status"]["status"] == "AFTERNOON") {
            if (players[this.index]["skip"]) {
                skip = "<br>(スキップ済み)"
            }
        }

        this.mes.innerHTML = players[this.index]["name"] + already_vote + skip
        if (already_vote == "" && skip == "") {
            this.mes.style.bottom = this.width * 0.1
        } else {
            this.mes.style.bottom = 0
        }
        this.mes.style.color = this.participateColor
        if (speak) {
            this.mes.style.color = this.talkingColor
        }
        if (!players[this.index]["live"]) {
            this.mes.style.color = this.outColor
            this.element.style.borderWidth = (1.5 * this.ratio).toString() + "px"
        }
        if (players[this.index]["disconnect"]) {
            this.mes.style.color = this.disconnectColor
        }
        let hand = players[this.index]["hand"]
        if (hand != null) {
            this.hand.hidden = false
            this.counter.hidden = false
            this.counter.innerHTML = hand.toString()
        } else {
            this.hand.hidden = true
            this.counter.hidden = true
        }
        let actions = []
        if (my_player) {
            actions = my_player["actions"]
        }
        for (let key in this.buttons) {
            this.buttons[key].element.hidden = true
        }
        for (let j=0;j<actions.length;j++) {
            let action = actions[j]
            let div = action.split(":")
            let dic = {
                "vote": "投票",
                "attack": "噛む",
                "seer": "占う",
                "bodyguard": "守る",
                "excution": "遺言完了",
                "skip": "議論スキップ",
                "kick": "キック",
            }
            if (["vote", "attack", "seer", "bodyguard"].indexOf(div[0]) != -1) {
                if (div[2] == players[this.index]["discord_id"]) {
                    if (action in this.buttons && this.buttons[action]) {
                    } else {
                        let button = new Button(
                            dic[div[0]], this.element, this.func, this.width,
                            0, this.width * 1.2, action, true, this.infos
                        )
                        this.buttons[action] = button
                    }
                    this.buttons[action].draw()
                    this.buttons[action].element.hidden = false
                }
            }
            if (["excution", "skip", "kick"].indexOf(div[0]) != -1) {
                if (div[1] == players[this.index]["discord_id"]) {
                    if (action in this.buttons && this.buttons[action]) {
                    } else {
                        let button = new Button(
                            dic[div[0]], this.element, this.func, this.width,
                            0, this.width * 1.2, action, true, this.infos
                        )
                        this.buttons[action] = button
                    }
                    this.buttons[action].draw()
                    this.buttons[action].element.hidden = false
                }
            }
        }
        for (let key in this.buttons) {
            if (this.buttons[key].element.hidden && this.buttons[key].confirm_flag) {
                if (this.buttons[key].confirm) {
                    this.buttons[key].confirm.draw(false)
                }
            }
        }

        if (players[this.index]["co_list"].length != this.role_icons.length) {
            for (let i=0;i<this.role_icons.length;i++) {
                this.role_icons[i].remove()
            }
            this.role_icons = []
            for (let i=0;i<players[this.index]["co_list"].length;i++) {
                let icon = document.createElement("img")
                let ratio = 0.4
                if (players[this.index]["co_list"].length > 3) {
                    ratio = ratio * 3 / players[this.index]["co_list"].length
                }
                icon.style.width = this.width * ratio
                icon.style.height = this.width * ratio
                icon.style.position = "absolute"
                icon.style.top = this.width * ratio * this.role_icons.length
                icon.style.left = this.width * ratio * -1
                this.element.appendChild(icon)
                this.role_icons.push(icon)
            }
        }
        for (let i=0;i<this.role_icons.length;i++) {
            let role_name = players[this.index]["co_list"][i]
            this.role_icons[i].src = "./images/icons/" + role_name + ".png"
        }
    }
}
