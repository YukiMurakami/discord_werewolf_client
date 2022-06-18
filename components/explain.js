export class Explain {
    constructor(infos, parent, width, x, y, ratio) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
        this.ratio = ratio
    }

    draw(infos) {
        this.infos = infos
        let status = this.infos["game_status"]
        let players = status["players"]

        let message_str = ""
        if (status["status"] == "EXCUTION") {
            let excution_id = status["excution"]
            let name = discord_id2name(excution_id, players)
            message_str = "本日処刑されるのは" + name + "さんです。遺言をどうぞ。<br>遺言が完了したら遺言完了ボタンを押してください。"
        }
        if (status["status"] == "NIGHT") {
            let companions = status["companions"]
            for (let i=0;i<companions.length;i++) {
                let div = companions[i].split(":")
                if (div[0] == "cat") {
                    let name = discord_id2name(div[1], players)
                    if (message_str != "") {
                        message_str += "<br>"
                    }
                    message_str += name + "さんが猫又の道連れで死亡しました。"
                }
                if (div[0] == "immoralist") {
                    let name = discord_id2name(div[1], players)
                    if (message_str != "") {
                        message_str += "<br>"
                    }
                    message_str += name + "さんが後を追って自殺しました。"
                }
                if (div[0] == "queen") {
                    let name = discord_id2name(div[1], players)
                    if (message_str != "") {
                        message_str += "<br>"
                    }
                    message_str += name + "さんが後を追って死亡。"
                }
            }
        }
        if (status["status"] == "VOTE") {
            let vote_count = status["vote"]
            if (vote_count == 0) {
                message_str = "今日も誰か一人を処刑する時間がやってきました。一人ずつ順番に、軽く意見を述べた上で投票を行ってください。"
            } else if (vote_count > 0) {
                let vote_targets = []
                for (let i=0;i<status["vote_candidates"].length;i++) {
                    vote_targets.push(discord_id2name(status["vote_candidates"][i], players) + "さん")
                }
                message_str = vote_targets.join("、") + "が同数で最多得票となったため決選投票を行います。好きな順で弁明をした後再度投票を行ってください。決選投票は終了後一斉に開示します。"
            }
        }
        let action_results = status["action_results"]
        for (let i = 0; i < action_results.length; i++) {
            let div = action_results[i].split(":")
            if (div[0] == "seer") {
                let name = discord_id2name(div[2], players)
                let result = ""
                if (div[3] == "WEREWOLF") {
                    result = "<font color='red'>人狼</font>です。"
                } else {
                    result = "人狼ではありません。"
                }
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += "占い結果、" + name + "さんは" + result
            }
            if (div[0] == "medium") {
                let name = discord_id2name(div[2], players)
                let result = ""
                if (div[3] == "WEREWOLF") {
                    result = "<font color='red'>人狼</font>です。"
                } else {
                    result = "人狼ではありません。"
                }
                if (message_str != "") {
                    message_str += "<br>"
                }
                message_str += "霊媒結果、" + name + "さんは" + result
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
            if (status["status"] == "AFTERNOON") {
                if (div[0] == "detective_show") {
                    let dist_name = discord_id2name(div[2], players)
                    if (message_str != "") {
                        message_str += "<br>"
                    }
                    message_str += dist_name + "議論終了後に推理ショーをします。推理の準備をしましょう。"
                }
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
                message_str += "朝になりました。昨晩の犠牲者はいませんでした。"
            } else {
                message_str += "朝になりました。" + name + "が無惨な姿で発見されました。"
            }
            if (status["live_baker_flag"] == "live") {
                message_str += "<br>今日も美味しいパンが焼けました。"
            }
            if (status["live_baker_flag"] == "dead") {
                message_str += "<br>今日はパンが焼けませんでした。"
            }
        }
        if (status["status"] == "DETECTIVE") {
            let detective_id = status["detective"]
            let name = discord_id2name(detective_id, players)
            message_str += name + "さんの推理ショーです。" + name + "さんは推理を披露しながら役職を並び替え、最後に完了ボタンを押してください。正解で単独勝利、不正解で恥ずか死します。"
        }
        if (status["status"] == "DETECTIVE_READY") {
            let detective_id = status["detective"]
            let name = discord_id2name(detective_id, players)
            message_str += name + "さんの推理の判定は、、、"
        }
        
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.26
            this.element.style.borderRadius = "8%";
            this.element.style.backgroundColor = "rgba(0,0,0,0.7)"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.element.style.borderWidth = "2px"
            this.element.style.borderStyle = "solid"
            this.element.style.borderColor = "#eeeeee"

            this.mes = document.createElement("div")
            this.mes.style.fontSize = (12 * this.ratio).toString() + "px"
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