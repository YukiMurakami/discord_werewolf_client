export class Explain {
    constructor(infos, parent, width, x, y) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
    }

    draw(infos) {
        this.infos = infos
        let status = this.infos["game_status"]
        let players = status["players"]

        let message_str = ""
        if (status["status"] == "EXCUTION") {
            let excution_id = status["excution"]
            let name = discord_id2name(excution_id, players)
            message_str = "本日処刑されるのは" + name + "さんです。遺言をどうぞ。"
        }
        if (status["status"] == "VOTE") {
            let vote_count = status["vote"]
            if (vote_count == 0) {
                message_str = "今日も誰か一人を処刑する時間が来ました。一人ずつ順番に軽く意見を述べた上で投票を行ってください。"
            } else if (vote_count > 0) {
                let vote_targets = []
                for (let i=0;i<status["vote_candidates"].length;i++) {
                    vote_targets.push(discord_id2name(status["vote_candidates"][i], players) + "さん")
                }
                message_str = vote_targets.join("、") + "が最多得票となったので決選投票を行います。好きな順で３０秒程度ずつ弁明をしていただき、その後再度投票を行ってください。決選投票は終了後一斉に開示します。"
            }
        }
        let action_results = status["action_results"]
        for (let i = 0; i < action_results.length; i++) {
            let div = action_results[i].split(":")
            if (div[0] == "seer") {
                let name = discord_id2name(div[2], players)
                let result = ""
                if (div[3] == "WEREWOLF") {
                    result = "人狼"
                } else {
                    result = "人狼ではない"
                }
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += "占い結果、" + name + "さんは" + result + "です。"
            }
            if (div[0] == "medium") {
                let name = discord_id2name(div[2], players)
                let result = ""
                if (div[3] == "WEREWOLF") {
                    result = "人狼"
                } else {
                    result = "人狼ではない"
                }
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += "霊媒結果、" + name + "さんは" + result + "です。"
            }
            if (div[0] == "attack") {
                let src_name = discord_id2name(div[1], players)
                let dist_name = discord_id2name(div[2], players)
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += src_name + "さんが" + dist_name + "さんを噛みます。"
            }
            if (div[0] == "bodyguard") {
                let dist_name = discord_id2name(div[2], players)
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += dist_name + "さんを守ります。"
            }
        }
        if (status["status"] == "MORNING") {
            let action_results = status["action_results"]
            let name = ""
            for (let i = 0; i < action_results.length; i++) {
                let div = action_results[i].split(":")
                if (div[0] == "victim") {
                    let vic_name = discord_id2name(div[1], players)
                    if (name == "") {
                        name = vic_name + "さん"
                    } else {
                        name += "、" + vic_name + "さん"
                    }
                }
            }
            if (message_str != "") {
                message_str += "<br>"
            }
            if (name == "") {
                message_str += "朝になると、誰も死亡していませんでした。"
            } else {
                message_str += "朝になると" + name + "が無惨な姿で発見されました。"
            }
        }
        
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.3
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
            this.mes.style.width = this.width * 0.95
            this.mes.style.color = "#eeeeee"
            this.mes.style.padding = "10 10 10 10"
            this.element.appendChild(this.mes)
        }
        this.mes.innerHTML = message_str
        if (message_str != "") {
            this.element.hidden = false
            this.mes.hidden = false
        } else {
            this.element.hidden = true
            this.mes.hidden = true
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