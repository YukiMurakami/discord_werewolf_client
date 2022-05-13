import {Button} from "./button.js"

export class Confirmation {
    constructor(action, parent, width, x, y, infos, func, button) {
        this.action = action
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
        this.ok_button = null;
        this.ng_button = null;
        this.infos = infos
        this.func = func
        this.button = button
        this.showflag = false
    }

    button_click(e) {
        this.message.draw(false)
    }

    draw(showflag) {
        this.showflag = showflag
        let message_str = ""
        let div = this.action.split(":")
        let action = div[0]
        let players = this.infos["game_status"]["players"]
        let dic_2 = {
            "vote": "に投票し",
            "attack": "を襲撃し",
            "seer": "を占い",
            "bodyguard": "を守り"
        }
        let dic_1 = {
            "kick": "をキックし"
        }
        for (let key in dic_2) {
            if (action == key) {
                let name = discord_id2name(div[2], players)
                message_str = name + "さん" + dic_2[key] + "ますか？"
            }
        }
        for (let key in dic_1) {
            if (action == key) {
                let name = discord_id2name(div[1], players)
                message_str = name + "さん" + dic_1[key] + "ますか？"
            }
        }
        if (action == "skip") {
            message_str = "議論をスキップしていいですか？"
        }
        if (action == "excution") {
            message_str = "遺言を終了していいですか？"
        }
        if (action == "result") {
            message_str = "ゲームを終了していいですか？"
        }
        if (action == "game_start") {
            message_str = "ゲームを開始していいですか？"
        }
        
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.35
            this.element.style.borderRadius = "8%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"

            this.mes = document.createElement("div")
            this.mes.style.fontSize = "100%"
            this.mes.style.color = "#ffffff"
            this.mes.style.position = "absolute"
            this.mes.style.width = this.width
            this.mes.style.color = "#eeeeee"
            this.mes.style.padding = "0 0 0 10"
            this.element.appendChild(this.mes)

            let base_x = parseInt(this.button.style.left)
            let base_y = parseInt(this.button.style.top)

            this.ok_button = new Button(
                "YES", this.parent, this.func,
                this.width / 2.7, base_x + this.width / 2.7 * -0.66, base_y - this.width / 4.6, this.action
            )
            this.ng_button = new Button(
                "NO", this.parent, this.button_click,
                this.width / 2.7, base_x + this.width / 2.7 * 0.66, base_y - this.width / 4.6, this
            )
        }
        this.mes.innerHTML = message_str
        this.ok_button.draw()
        this.ng_button.draw()
        if (showflag) {
            this.element.hidden = false
            this.mes.hidden = false
            this.ok_button.element.hidden = false
            this.ng_button.element.hidden = false
        } else {
            this.element.hidden = true
            this.mes.hidden = true
            this.ok_button.element.hidden = true
            this.ng_button.element.hidden = true
        }
    }
}

function discord_id2name(discord_id, players) {
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == discord_id) {
            return players[i]["name"]
        }
    }
    return ""
}
