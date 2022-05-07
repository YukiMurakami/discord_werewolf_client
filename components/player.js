import {Button} from "./button.js"
import { jpnname2engname } from "../config.js";

export class Player {
    constructor(infos, index, parent, width, x, y, func) {
        this.infos = infos
        this.index = index
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.func = func

        this.participateColor = "#ffbb00"
        this.talkingColor = "#33ff33"
        this.outColor = "#cccccc"
        this.disconnectColor = "#dd0000"

        this.death = null;
        this.avator = null;
        this.rolecard = null;
        this.mes = null;
        this.buttons = {}
    }

    draw() {
        let players = this.infos["game_status"]["players"]
        let my_player = null
        for (let i=0;i<players.length;i++) {
            if (players[i]["discord_id"] == this.infos["discord_id"]) {
                my_player = players[i]
            }
        }
        let my_room = my_player["voice"]
        let voice_on = false
        if (my_room) {
            if (players[this.index]["voice"]) {
                let voice = players[this.index]["voice"]
                if (my_room == voice) {
                    voice_on = true
                }
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
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "4px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = this.participateColor

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

            let card = document.createElement("div")
            card.style.backgroundImage = "url(" + "./images/cards/" + role + ".png" + ")"
            card.style.backgroundSize = "100%"
            card.style.position = "absolute"
            card.style.width = this.width * 0.3
            card.style.height = this.width * 0.3 / 938 * 1125
            card.style.top = this.width * 0.3 / 938 * 1125 * -0.05
            card.style.left = this.width * 0.7
            this.element.append(card)
            this.rolecard = card

            let mes = document.createElement("div")
            mes.innerHTML = ""
            mes.style.textAlign = "center"
            mes.style.fontSize = "70%"
            mes.style.color = "#ffffff"
            mes.style.position = "absolute"
            mes.style.width = this.width
            this.element.appendChild(mes)
            this.mes = mes
        }
        
        this.element.style.borderColor = this.participateColor
        if (!voice_on) {
            this.element.style.borderColor = this.outColor
            this.element.style.borderWidth = "2px"
        } else if (speak) {
            this.element.style.borderColor = this.talkingColor
        }

        if (!players[this.index]["live"]) {
            this.death.hidden = false
            this.avator.style.opacity = 0.2
            this.avator.style.backgroundColor = "#000000"
        } else {
            this.death.hidden = true
            this.avator.style.opacity = 1.0
        }
        this.rolecard.style.backgroundImage = "url(" + "./images/cards/" + role + ".png" + ")"

        let vote_count = ""
        if (players[this.index]["voted_count"] > 0) {
            vote_count = "(" + players[this.index]["voted_count"].toString() + "票)"
        }
        let already_vote = ""
        if (this.infos["game_status"]["status"] == "VOTE") {
            if (players[this.index]["already_vote"]) {
                already_vote = "<br>(投票済み)"
            }
        }

        this.mes.innerHTML = players[this.index]["name"] + vote_count + already_vote
        if (already_vote == "") {
            this.mes.style.bottom = this.width * 0.1
        } else {
            this.mes.style.bottom = 0
        }
        this.mes.style.color = this.participateColor
        if (!voice_on) {
            this.mes.style.color = this.outColor
        } else if (speak) {
            this.mes.style.color = this.talkingColor
        }
        if (players[this.index]["disconnect"]) {
            this.mes.style.color = this.disconnectColor
        }

        let actions = my_player["actions"]
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
            }
            if (["vote", "attack", "seer", "bodyguard"].indexOf(div[0]) != -1) {
                if (div[2] == players[this.index]["discord_id"]) {
                    if (action in this.buttons && this.buttons[action]) {
                    } else {
                        let button = new Button(
                            dic[div[0]], this.element, this.func, this.width, 0, this.width * 1.2, action
                        )
                        this.buttons[action] = button
                    }
                    this.buttons[action].draw()
                    this.buttons[action].element.hidden = false
                }
            }
            if (["excution"].indexOf(div[0]) != -1) {
                if (div[1] == players[this.index]["discord_id"]) {
                    if (action in this.buttons && this.buttons[action]) {
                    } else {
                        let button = new Button(
                            dic[div[0]], this.element, this.func, this.width, 0, this.width * 1.2, action
                        )
                        this.buttons[action] = button
                    }
                    this.buttons[action].draw()
                    this.buttons[action].element.hidden = false
                }
            }
        }
    }
}
