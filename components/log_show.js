import {rolename2token} from "../config.js"

export class LogShow {
    constructor(title, parent, width, x, y, result, screen_w, screen_h, infos) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.screen_w = screen_w
        this.screen_h = screen_h
        this.mes = null;
        this.result = result
        this.last_result = result
        this.counter = 0;
        this.eventlist = [];
        this.infos = infos
    }

    mouseout_vote(e) {
        for (let i=0;i<100;i++) {
            let element = document.getElementById("logview")
            if (element) {
                element.remove()
            } else {
                break
            }
        }
    }

    draw(title, result, infos) {
        this.title = title
        this.result = result
        this.infos = infos
        if (!this.element) {
            this.element = document.createElement("div")
            this.parent.appendChild(this.element)
            this.element.style.position = "absolute"
            this.element.style.backgroundImage = "url(./images/ui/phase.png)"
            this.element.style.backgroundSize = "100%"
            this.element.style.width = this.width
            this.element.style.height = this.width / 356 * 120
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"
            this.mes = document.createElement("div")
            this.element.appendChild(this.mes)
            this.mes.style.color = "#000000"
            this.mes.style.textAlign = "center"
            this.element.style.position = "absolute"
            this.mes.style.padding = "7% 16% 0 16%"

            this.addlistener("mouseover", mouseover_vote, {result: this.result, width: this.screen_w, height: this.screen_h, infos: this.infos})

            this.element.addEventListener("mouseout", {
                handleEvent: this.mouseout_vote
            })
            this.last_result = this.result
        } else {
            if (!is_equal_list(this.result, this.last_result)) {
                this.removelistener(this.counter)
                this.addlistener("mouseover", mouseover_vote, {result: this.result, width: this.screen_w, height: this.screen_h, infos: this.infos})
                this.last_result = this.result
            }
        }
        this.mes.innerHTML = this.title
        if (this.title.length >= 6) {
            this.mes.style.fontSize = Number(this.element.clientHeight / 45 * 100 * 0.1).toString() + "%"
        } else {
            this.mes.style.fontSize = Number(this.element.clientHeight / 45 * 100).toString() + "%"
        }
        if (this.result.length <= 0) {
            this.element.hidden = true
        } else {
            this.element.hidden = false
        }
    }

    addlistener(type, handleEvent, arg = {}, option = null) {
        this.counter++;
        const eventlistner = {handleEvent, ...arg};
        const array = [type, eventlistner, option];
        this.eventlist[this.counter] = array;
        this.element.addEventListener(type, eventlistner, option);
    }

    removelistener(num) {
        const type = this.eventlist[num][0]
        const eventlistner = this.eventlist[num][1]
        const option = this.eventlist[num][2]
        this.element.removeEventListener(type, eventlistner, option);
    }
}


function is_equal_list(a, b) {
    if (!a) {
        return false
    }
    if (!b) {
        return false
    }
    if (a.length != b.length) {
        return false
    }
    for (let i=0;i<a.length;i++) {
        if (a[i] != b[i]) {
            return false
        }
    }
    return true
}


function mouseover_vote() {
    let logview = document.createElement("div")
    logview.id = "logview"
    document.getElementById("root").appendChild(logview)
    console.log(this.result)

    logview.style.position = "absolute"
    logview.style.width = this.width * 0.9
    logview.style.height = this.height * 0.9
    logview.style.left = this.width * 0.05 + "px"
    logview.style.top = this.height * 0.05 + "px"
    logview.style.backgroundColor = "rgba(0,0,0,0.8)"

    let table = document.createElement("table")
    logview.appendChild(table)

    let name_tr = document.createElement("tr")
    table.appendChild(name_tr)
    let role_tr = document.createElement("tr")
    table.appendChild(role_tr)

    let players = this.infos["game_status"]["players"]
    let roles = this.infos["game_status"]["roles"]
    let discord_ids = []
    let colors = {
        "人狼": "#ff4444",
        "村人": "#00ff00",
        "占い師": "#ff00ff",
        "霊媒師": "#0099ff",
        "狩人": "#00ffff",
        "狂人": "#ff9900",
        "妖狐": "#ffff00",
        "共有者": "#ff88ff",
        "狂信者": "#ff9900",
        "猫又": "#ff8888",
    }
    for (let i=0;i<players.length + 1;i++) {
        let td = document.createElement("td")
        if (i != 0) {
            let role = roles[players[i - 1]["discord_id"]]
            if (role in colors) {
                td.innerHTML = "<font color='" + colors[role] + "'>" + players[i - 1]["name"] + "</font>"
            } else {
                td.innerHTML = players[i - 1]["name"]
            }
        } else {
            td.innerHTML = "プレイヤー"
        }
        name_tr.appendChild(td)
        let rtd = document.createElement("td")
        rtd.innerHTML = "役職"
        if (i != 0) {
            let role = roles[players[i - 1]["discord_id"]]
            if (players[i - 1]["discord_id"] in this.infos["game_status"]["roles"]) {
                if (role in colors) {
                    rtd.innerHTML = "<font color='" + colors[role] + "'>" + role + "</font>"
                } else {
                    rtd.innerHTML = role
                }
            }
            discord_ids.push(players[i - 1]["discord_id"])
        }
        role_tr.appendChild(rtd)
    }
    let phases = ["昼", "夕", "夜"]
    let lives = []
    for (let i=0;i<discord_ids.length;i++) {
        lives.push(true)
    }
    let last_excution = null
    let attack_ids = []
    for (let day=0;day <= 40;day++) {
        if (this.infos["game_status"]["day"] < day) {
            break
        }
        for (let k=0;k<phases.length;k++) {
            let phase = phases[k]
            if (this.infos["game_status"]["day"] == day) {
                let now_status = this.infos["game_status"]["phase"]
                if (phase == "夜") {
                    if (now_status != "NIGHT") {
                        break
                    }
                }
            }
            if (day == 0 && (phase == "夕" || phase == "昼")) {
                continue
            }
            let phase_name = day.toString() + "日目" + phase
            let status = []
            for (let i=0;i<discord_ids.length;i++) {
                if (lives[i]) {
                    status.push("↓")
                } else {
                    status.push("")
                }
            }

            if (phase == "夜") {
                attack_ids = []
                let fox_id = null
                let guard_id = null
                let cat_attack_wolf_id = null
                let attack_cat_id = null
                let key = day.toString() + "-NIGHT"
                if (key in this.result) {
                    for (let i=0;i<this.result[key].length;i++) {
                        let action = this.result[key][i]
                        let div = action.split(":")
                        if (div[0] == "seer") {
                            let src = discord_ids.indexOf(div[1])
                            let result = get_result(div[2], roles)
                            status[src] = get_name(div[2], players) + result
                            if (roles[div[2]] == "妖狐") {
                                fox_id = div[2]
                            }
                        }
                        if (div[0] == "attack") {
                            let src = discord_ids.indexOf(div[1])
                            status[src] = get_name(div[2], players)
                            if (roles[div[2]] != "妖狐") {
                                attack_ids.push(div[2])
                            }
                            if (roles[div[2]] == "猫又") {
                                cat_attack_wolf_id = div[1]
                                attack_cat_id = div[2]
                            }
                        }
                        if (div[0] == "bodyguard") {
                            let src = discord_ids.indexOf(div[1])
                            status[src] = get_name(div[2], players)
                            guard_id = div[2]
                        }
                    }
                }
                if (last_excution) {
                    for (let i=0;i<discord_ids.length;i++) {
                        let role = roles[discord_ids[i]]
                        if (lives[i] && role == "霊媒師") {
                            let result = get_result(last_excution, roles)
                            status[i] = get_name(last_excution, players) + result
                        }
                    }
                }
                if (guard_id) {
                    if (attack_ids.indexOf(guard_id) != -1) {
                        console.log(attack_ids, attack_ids.indexOf(guard_id))
                        attack_ids.splice(attack_ids.indexOf(guard_id), 1)
                        console.log(attack_ids)
                    }
                    if (attack_cat_id) {
                        if (attack_cat_id == guard_id) {
                            cat_attack_wolf_id = null
                        }
                    }
                }
                if(cat_attack_wolf_id) {
                    attack_ids.push(cat_attack_wolf_id)
                }
                if(fox_id) {
                    attack_ids.push(fox_id)
                }
            }
            if (phase == "夕") {
                let key = day.toString() + "-EXCUTION"
                if (key in this.result) {
                    for (let i=0;i<this.result[key].length;i++) {
                        let action = this.result[key][i]
                        let div = action.split(":")
                        if (div[0] == "excution") {
                            let src = discord_ids.indexOf(div[1])
                            status[src] = "処刑死"
                            lives[src] = false
                            last_excution = div[1]
                        }
                        if (div[0] == "companion") {
                            if (div[1] == "immoralist") {
                                let src = discord_ids.indexOf(div[2])
                                if (lives[src]) {
                                    status[src] = "後追い"
                                }
                                lives[src] = false
                            }
                            if (div[1] == "cat") {
                                let src = discord_ids.indexOf(div[2])
                                if (lives[src]) {
                                    status[src] = "道連れ"
                                }
                                lives[src] = false
                            }
                        }
                    }
                }
            }
            if (phase == "昼") {
                if (attack_ids.length > 0) {
                    for (let i=0;i<attack_ids.length;i++) {
                        let src = discord_ids.indexOf(attack_ids[i])
                        status[src] = "襲撃死"
                        lives[src] = false
                    }
                }
                let key2 = day.toString() + "-MORNING"
                if (key2 in this.result) {
                    for (let i=0;i<this.result[key2].length;i++) {
                        let action = this.result[key2][i]
                        let div = action.split(":")
                        if (div[0] == "companion") {
                            if (div[1] == "immoralist") {
                                let src = discord_ids.indexOf(div[2])
                                status[src] = "襲撃死"
                                lives[src] = false
                            }
                        }
                    }
                }
                for (let i=0;i<7;i++) {
                    let key = day.toString() + "-" + ["AFTERNOON", "VOTE-0", "VOTE-1", "VOTE-2", "VOTE-3", "VOTE-4", "EXCUTION"][i]
                    if (key in this.result) {
                        for (let i=0;i<this.result[key].length;i++) {
                            let action = this.result[key][i]
                            let div = action.split(":")
                            if (div[0] == "co") {
                                let src = discord_ids.indexOf(div[2])
                                let role = rolename2token(div[1])
                                status[src] = role + "CO"
                            }
                            if (div[0] == "noco") {
                                let src = discord_ids.indexOf(div[2])
                                let role = rolename2token(div[1])
                                if (status[src] == role + "CO") {
                                    status[src] = "↓"
                                }
                            }
                        }
                    }
                }
            }

            let tr = document.createElement("tr")
            table.appendChild(tr)
            
            for (let i=0;i<status.length + 1;i++) {
                let td = document.createElement("td")
                if (i != 0) {
                    let role = roles[players[i - 1]["discord_id"]]
                    if (role in colors) {
                        td.innerHTML = "<font color='" + colors[role] + "'>" + status[i - 1] + "</font>"
                    } else {
                        td.innerHTML = status[i - 1]
                    }
                } else {
                    td.innerHTML = phase_name
                }
                tr.appendChild(td)
            }
        }
    }
}

function get_name(discord_id, players) {
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == discord_id) {
            return players[i]["name"]
        }
    }
    return ""
}

function get_result(discord_id, roles) {
    let role = roles[discord_id]
    if (role == "人狼") {
        return "●"
    }
    return "◯"
}