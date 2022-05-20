export class Rule {
    constructor(infos, parent, width, x, y) {
        this.infos = infos
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
    }

    draw(only_time) {
        let status = this.infos["game_status"]
        let players = status["players"]
        if (!this.element) {
            this.element = document.createElement("div")
            this.element.style.position = "absolute"
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width * 0.55
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
        }
        if (only_time) {
            this.element.style.height = this.width * 0.2
        } else {
            this.element.style.height = this.width * 0.55
        }

        let role_n = 0
        let role_str = ""
        for (let key in status["rule"]["roles"]) {
            let num = status["rule"]["roles"][key]
            role_n += num
            role_str += key + num.toString()
        }
        let first_seer_str = "自由占い"
        if (status["rule"]["first_seer"] == "RANDOM_WHITE") {
            first_seer_str = "お告げ"
        }
        if (status["rule"]["first_seer"] == "NO") {
            first_seer_str = "なし"
        }
        let guard_str = "あり"
        if (status["rule"]["bodyguard"] == "CANNOT_CONSECUTIVE_GUARD") {
            guard_str = "なし"
        }
        let minute_str = status["minute"].toString()
        let second_str = status["second"].toString()
        if (status["second"] < 10) {
            second_str = "0" + status["second"].toString()
        }
        let rule_str = "<font size='6'>" + minute_str + ":" + second_str + "</font>"
        if (status["timer_stop"]) {
            rule_str = "<font size='6' color='orange'>" + minute_str + ":" + second_str + "</font>"
        }
        let live_count = 0
        for (let i=0;i<players.length;i++) {
            if (players[i]["live"]) {
                live_count += 1
            }
        }
        if (!only_time) {
            rule_str += "<br>人数：" + live_count + "/" + role_n.toString()
            rule_str += "<br>役職：" + role_str
            rule_str += "<br>初日占い：" + first_seer_str
            rule_str += "<br>連続ガード：" + guard_str
        }

        this.mes.innerHTML = rule_str
    }
}
