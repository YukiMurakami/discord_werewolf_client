import {Button} from "./components/button.js";
import { Account } from "./components/account.js";
import { Background } from "./components/background.js";
import { Phase } from "./components/phase.js";
import { Player } from "./components/player.js";
import { Rule } from "./components/rule.js";
import { Explain } from "./components/explain.js";
import { RoleMenu } from "./components/role_menu.js";
import { RoleDescription } from "./components/role_description.js";
import { Voice } from "./components/voice.js";
import { config, jpnname2engname, rolename2token } from "./config.js";
import { Sound, Volume } from "./components/sound.js";
import { VoteShow } from "./components/vote_show.js";

// 画面サイズ
// const SCREEN_W = document.documentElement.clientWidth;
const SCREEN_H = document.documentElement.clientHeight - 20;
const SCREEN_W = SCREEN_H * 16 / 9;

const URI = config["URI"]
let client_status = "offline"
let connection = ""
let infos = {
    "send_id": -1,
    "roleset_open": false,
    "rolecard_rotate": false,
    "volume": 0.2,
    "now_status": "offline",
    "playerids": []
}
let elements = {
    "background": null,
    "phase": null,
    "volume": null,
    "voice": null,
    "rule": null,
    "explain": null,
    "first_seer_button": null,
    "bodyguard_rule_button": null,
    "role_button": null,
    "start_button": null,
    "logout_button": null,
    "rolemenu": null,
    "result_button": null,
    "role_description":null
}
const sound = new Sound()

function loadAllImages() {
    let images = [
        "./images/backgrounds/afternoon.jpg",
        "./images/backgrounds/afternoon0200.jpg",
        "./images/backgrounds/afternoon0130.jpg",
        "./images/backgrounds/afternoon0100.jpg",
        "./images/backgrounds/afternoon0030.jpg",
        "./images/backgrounds/evening.jpg",
        "./images/backgrounds/night.jpg",
    ]
    let buttons = document.getElementById("tmp")
    for (let i=0;i<images.length;i++) {
        let image = document.createElement("img")
        image.src = images[i]
        image.style.width = "1px"
        image.style.height = "1px"
        buttons.appendChild(image)
    }
}

function draw() {
    cleanup()
    if (client_status == "offline") {
        drawTitle()
        infos["send_id"] = -1
    } else if (client_status == "account_select") {
        drawAccountSelect()
    } else if (client_status == "game_status") {
        drawGame()
    }
}

function convert_status(status) {
    if (status == "game_status") {
        return infos["game_status"]["status"]
    }
    return status
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

function cleanup() {
    let buttons = document.getElementById("tmp")
    while (buttons.firstChild) {
        buttons.removeChild(buttons.firstChild);
    }
    let now_status = convert_status(client_status)

    let reset_elements = false
    //console.log("change " + infos["now_status"] + " -> " + now_status)
    if (infos["now_status"] != now_status) {
        infos["now_status"] = now_status
        reset_elements = true
    }
    if ("game_status" in infos) {
        let playerids = []
        let players = infos["game_status"]["players"]
        for (let i=0;i<players.length;i++) {
            playerids.push(players[i]["discord_id"])
        }
        if (!is_equal_list(infos["playerids"], playerids)) {
            infos["playerids"] = playerids
            reset_elements = true
            //console.log("playerids changed", infos["playerids"], playerids)
        }
    }
    //console.log("cleanup", reset_elements)
    if (reset_elements) {
        let buttons = document.getElementById("buttons")
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
        for (let key in elements) {
            if (key != "background") {
                elements[key] = null;
            }
        }
    }
}

function drawBackground(type) {
    let buttons = document.getElementById("back")
    if (!elements["background"]) {
        let back = new Background(
            buttons, SCREEN_W, SCREEN_H
        )
        elements["background"] = back
    }
    elements["background"].draw(type)
}

function drawTitle() {
    loadAllImages()
    let buttons = document.getElementById("tmp")

    drawBackground("black")
    
    let mes = document.createElement("div")
    buttons.appendChild(mes)
    mes.innerText = "Discord 人狼ツール v1.0"
    mes.style.color = "#ffffff"
    mes.style.fontSize = "30px"
    mes.style.position = "absolute"
    mes.style.textAlign = "center"
    mes.style.left = ((SCREEN_W - mes.clientWidth) / 2).toString() + "px"
    mes.style.top = "250px"
    
    let button = new Button("開始", buttons, () => {
        connection = new WebSocket(URI);
        connection.onopen = function(event) {
            //console.log("connect ok");
            sendData({
                "message": "get_free_account",
            });
        }
        connection.onmessage = onMessage;
        connection.onclose = onClose;
        connection.onerror = onError;
    }, 200, (SCREEN_W - 200) / 2, 350, null)
    button.draw()
}

function drawAccountSelect() {
    let buttons = document.getElementById("tmp")

    drawBackground("black")
    
    let mes = document.createElement("div")
    mes.innerText = "使用するアカウントを選択\n (自分のアカウントがない場合は、Discordにログインすること）"
    mes.style.color = "#ffffff"
    mes.style.fontSize = "30px"
    mes.style.position = "absolute"
    mes.style.textAlign = "center"
    mes.style.top = "50px"
    buttons.appendChild(mes)
    mes.style.left = ((SCREEN_W - mes.clientWidth) / 2).toString() + "px"

    function account_select_button_click(e) {
        infos["discord_id"] = this.message
        sendData(
            {
                "message": "login",
                "discord_id": this.message
            }
        )
    }

    for (let i = 0; i < infos["accounts"].length; i++) {
        let account = infos["accounts"][i]

        let account_div = new Account(
            account["name"] + "#" + account["discriminator"],
            account["avator_url"],
            account["discord_id"],
            buttons,
            account_select_button_click,
            100, (SCREEN_W - 820) / 2 + 120 * (i % 7), 200 + 140 * parseInt(i / 7, 10)
        )
        account_div.draw()
    }
}

function drawGame() {
    if (infos["game_status"]["status"] == "SETTING") {
        drawSetting()
    }
    if (infos["game_status"]["status"] == "ROLE_CHECK") {
        drawRolecheck()
        sound.reset()
    }
    if (infos["game_status"]["status"] == "NIGHT") {
        drawNight()
    }
    if (infos["game_status"]["status"] == "MORNING") {
        drawMorning()
    }
    if (infos["game_status"]["status"] == "AFTERNOON") {
        drawAfternoon()
    }
    if (infos["game_status"]["status"] == "VOTE") {
        drawVote()
    }
    if (infos["game_status"]["status"] == "EXCUTION") {
        drawExcution()
    }
    if (infos["game_status"]["status"] == "RESULT") {
        drawResult()
    }
}

function drawStatus(message) {
    let buttons = document.getElementById("buttons")

    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }
    function role_mouseover(e){
        if(this.role != "back_card"){

            let descriptionW = 250;
            let y = (SCREEN_H - descriptionW * 0.6) / 2 -60
            console.log("role_mouseover:" + this.showflag)
            let roledescription = new RoleDescription(
                document.getElementById("buttons"),
                descriptionW * 1.4,
                30,
                y)
            roledescription.draw(this.showflag,this.role);
        }
    }

    //今のフェーズ情報
    if (!elements["phase"]) {
        let phase = new Phase(
            message, buttons, 180, 20, 20
        )
        elements["phase"] = phase
    }
    elements["phase"].draw(message)

    let status = infos["game_status"]
    let players = status["players"]

    //ボリューム操作
    if (!elements["volume"]) {
        let volume = new Volume(
            buttons, 100, 70, 90, sound, infos
        )
        elements["volume"] = volume
    }
    elements["volume"].draw()

    //ボイスチャンネル情報
    if (!elements["voice"]) {
        let voice = new Voice(
            infos, buttons, 130, 220, 28
        )
        elements["voice"] = voice
    }
    elements["voice"].draw()

    //プレイヤー情報
    let keys = []
    if (status["status"] != "ROLE_CHECK") {
        let radiusW = SCREEN_W * 0.4
        let radiusH = SCREEN_H * 0.4 - 20
        let playerC = players.length
        for (let i=0;i<playerC;i++) {
            let sin = Math.sin(Math.PI * 2 / playerC * i)
            let cos = Math.cos(Math.PI * 2 / playerC * i)
            let adjust = Math.abs(cos) * 0.15
            if (sin * cos > 0) {
                adjust = adjust
            } else if (sin * cos < 0) {
                adjust = adjust * -1
            }
            if (playerC % 2 == 0 && i == playerC / 2) {
                adjust = 0
            }
            if (i == 0) {
                adjust = 0
            }
            let x = SCREEN_W / 2 - 52 + radiusW * Math.cos(Math.PI * 2 / playerC * i + adjust)
            let y = SCREEN_H / 2 - 62 + radiusH * Math.sin(Math.PI * 2 / playerC * i + adjust) - 10
            let key = "player" + players[i]["discord_id"]
            keys.push(key)
            if (key in elements && elements[key]) {
            } else {
                let player = new Player(
                    infos,
                    i % playerC,
                    buttons,
                    100,
                    x,
                    y,
                    button_click,
                    role_mouseover
                )
                elements[key] = player
            }
            elements[key].draw(x, y)
        }
    }

    //ルール情報
    let ruleW = 300
    let y = (SCREEN_H - ruleW * 0.6) / 2 - 30
    let time_only = false
    if (status["status"] == "ROLE_CHECK") {
        y = 50
        time_only = true
    }
    if (!elements["rule"]) {
        let rule = new Rule(
            infos, buttons, ruleW, (SCREEN_W - ruleW) / 2, y
        )
        elements["rule"] = rule
    }
    elements["rule"].draw(time_only)

    //その他情報
    if (!elements["explain"]) {
        let explain = new Explain(
            infos, buttons, ruleW * 1.4, (SCREEN_W - ruleW * 1.4) / 2, y + 170
        )
        elements["explain"] = explain
    }
    elements["explain"].draw(infos)

    //投票履歴
    let vote_result = getVoteLog()
    let count = 0
    for (let key in vote_result) {
        let result = []
        for (let i=0;i<vote_result[key].length;i++) {
            if (vote_result[key][i].indexOf("vote:") == 0) {
                result.push(vote_result[key][i])
            }
        }
        if (!elements[key]) {
            let phase = new VoteShow(
                key, buttons, SCREEN_W * 0.05, SCREEN_W * 0.946,
                20 + SCREEN_W * 0.05 / 356 * 122 * count, result
            )
            elements[key] = phase
        }
        elements[key].draw(key, result)
        count += 1
    }
}

function getVoteLog() {
    let result = {}
    let logs = infos["game_status"]["log"]
    for (let key in logs) {
        if (key.indexOf("VOTE") != -1) {
            let day = key.split("-")[0]
            let count = key.split("-")[2]
            let k = "投票" + day + "日目"
            if (count != "0") {
                k = day + "日目" + "決戦" + count
            }
            result[k] = logs[key]
        }
    }
    return result
}

function drawNight() {
    if (infos["rolecard_rotate"]) {
        infos["rolecard_rotate"] = false
        let buttons = document.getElementById("no_cleanup")
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
    }
    drawBackground("night")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目夜")
    sound.play("night", infos, "first")
}

function drawMorning() {
    drawBackground("afternoon")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目朝")
    sound.play("morning", infos, "first")
}

function drawAfternoon() {
    let status = infos["game_status"]
    let minute = status["minute"]
    let second = status["second"]

    let back = "afternoon"
    if (minute == 1) {
        if (second >= 30) {
            back = "afternoon0200"
        } else {
            back = "afternoon0130"
        }
    }
    if (minute == 0) {
        if (second >= 30) {
            back = "afternoon0100"
        } else {
            back = "afternoon0030"
        }
    }
    drawBackground(back)
    
    drawStatus(status["day"].toString() + "日目昼")
    sound.play("minute_bell", infos, "first")
    
    if (minute == 1 && second == 0) {
        sound.play("minute_bell", infos, "")
    }
    if (minute == 2 && second == 0) {
        sound.play("minute_bell", infos, "")
    }
    if (minute == 3 && second == 0) {
        sound.play("minute_bell", infos, "")
    }
    if (minute == 0 && second == 30) {
        sound.play("craw", infos, "")
    }
    if (minute == 0 && second == 20) {
        sound.play("craw", infos, "")
    }
    if (minute == 0 && second == 10) {
        sound.play("craw", infos, "")
    }
    drawCoButtons()
    drawHandButton()
}

function drawVote() {
    drawBackground("evening")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目夕")
    sound.play("vote_bell", infos, "first")
    drawCoButtons()
    drawHandButton()
}

function drawExcution() {
    drawBackground("evening")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目夕処刑")
    drawCoButtons()
}

function drawResult() {
    let status = infos["game_status"]
    let players = status["players"]

    if (status["result"] == "WEREWOLF") {
        drawBackground("werewolf_win")
        sound.play("lose", infos, "first")
    } else if (status["result"] == "FOX") {
        drawBackground("fox_win")
        sound.play("lose", infos, "first")
    } else {
        drawBackground("afternoon")
        sound.play("win", infos, "first")
    }
    
    let title = ""
    if (status["result"] == "WEREWOLF") {
        title = "人狼チーム勝利"
    }
    if (status["result"] == "VILLAGER") {
        title = "村人チーム勝利"
    }
    if (status["result"] == "FOX") {
        title = "妖狐チーム勝利"
    }
    drawStatus(title)

    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }
    //先頭プレイヤーはゲーム結果閉じるアクション付き
    if (players.length > 0 && players[0]["discord_id"] == infos["discord_id"]) {
        if (!elements["result_button"]) {
            let count = 1
            let button = new Button(
                "ゲーム終了", buttons, button_click,
                120,
                count % 3 * 120 + (SCREEN_W - 300) / 2 - 30,
                (count / 3 | 0) * 40 + (SCREEN_H - 200) / 2 + 160,
                "result:", true, infos
            )
            elements["result_button"] = button
        }
        elements["result_button"].draw()
    } else {
    }
}

function drawHandButton() {
    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }
    for (let key in elements) {
        if (key.indexOf("hand:") == 0) {
            if (elements[key]) {
                elements[key].element.hidden = true
            }
        }
    }
    let players = infos["game_status"]["players"]
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == infos["discord_id"]) {
            let actions = players[i]["actions"]
            let count = 0
            for (let j=0;j<actions.length;j++) {
                let button_key = ""
                let title = ""
                if (actions[j].indexOf("hand_raise:") == 0) {
                    button_key = "hand:"
                    title = "手を挙げる"
                }
                if (actions[j].indexOf("hand_down:") == 0) {
                    button_key = "hand:"
                    title = "手を下げる"
                }
                if (button_key == "") {
                    continue
                }
                if (!elements[button_key]) {
                    let button = new Button(
                        title, buttons, button_click,
                        120,
                        (SCREEN_W - 300) / 2 - 30 - 120 - 120 * Math.floor(count / 4),
                        (SCREEN_H - 200) / 2 - 30 + (count % 4) * 40,
                        actions[j]
                    )
                    elements[button_key] = button
                }
                elements[button_key].draw(title, actions[j])
                elements[button_key].element.hidden = false
                count += 1;
            }
        }
    }
}

function drawCoButtons() {
    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }
    for (let key in elements) {
        if (key.indexOf("co:") == 0) {
            if (elements[key]) {
                elements[key].element.hidden = true
            }
        }
    }
    let players = infos["game_status"]["players"]
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == infos["discord_id"]) {
            let actions = players[i]["actions"]
            let count = 0
            for (let j=0;j<actions.length;j++) {
                let button_key = ""
                let title = ""
                if (actions[j].indexOf("co:") == 0) {
                    button_key = actions[j]
                    title = "CO"
                }
                if (actions[j].indexOf("noco:") == 0) {
                    button_key = actions[j].substring(2)
                    title = "CO撤回"
                }
                if (button_key == "") {
                    continue
                }
                let role = rolename2token(actions[j].split(":")[1])
                if (!elements[button_key]) {
                    let button = new Button(
                        role + title, buttons, button_click,
                        120,
                        (SCREEN_W - 300) / 2 + 300 + 30 + 120 * Math.floor(count / 4),
                        (SCREEN_H - 200) / 2 - 30 + (count % 4) * 40,
                        actions[j], true, infos
                    )
                    elements[button_key] = button
                }
                elements[button_key].draw(role + title, actions[j])
                elements[button_key].element.hidden = false
                count += 1;
            }
        }
    }
}

function roleCheckAnimation() {
    if (infos["rolecard_rotate"]) {
        return
    }
    infos["rolecard_rotate"] = true
    let buttons = document.getElementById("no_cleanup")

    let div = document.createElement("div")
    div.classList.add("card")
    div.style.left = ((SCREEN_W - 400)/2).toString() + "px"
    div.style.top = ((SCREEN_H - 400 / 938 * 1125)/2 + 70).toString() + "px"

    let omote = document.createElement("div")
    omote.classList.add("omote")
    let omote_img = document.createElement("img")
    omote_img.src="./images/cards/back_card.png"
    omote.appendChild(omote_img)

    let ura = document.createElement("div")
    ura.classList.add("ura")
    let ura_img = document.createElement("img")

    let my_role = "none"
    let status = infos["game_status"]
    let players = status["players"]
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == infos["discord_id"]) {
            my_role = players[i]["role"]
        }
    }
    if (my_role != "none") {
        ura_img.src="./images/cards/" + jpnname2engname(my_role) + ".png"
    }
    ura.appendChild(ura_img)

    div.appendChild(omote)
    div.appendChild(ura)

    buttons.appendChild(div)

    window.setTimeout(rotate, 1500)
}

function rotate() {
    let card = document.getElementsByClassName("card")[0]
    card.classList.add("card_hover")
}

function drawRolecheck() {
    drawBackground("night")
    drawStatus("役職確認")
    roleCheckAnimation()
}

function drawSetting() {
    drawBackground("afternoon")
    drawStatus("準備中")

    let status = infos["game_status"]
    let players = status["players"]
    let buttons = document.getElementById("buttons")

    function button_click(e) {
        if (this.message == "role_set") {
            if (!infos["roleset_open"]) {
                if (!elements["rolemenu"]) {
                    let rolemenu = new RoleMenu(
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 100, button_click
                    )
                    elements["rolemenu"] = rolemenu
                }
                infos["roleset_open"] = true
                elements["rolemenu"].draw(infos["roleset_open"])
            } else {
                if (!elements["rolemenu"]) {
                    let rolemenu = new RoleMenu(
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 100, button_click
                    )
                    elements["rolemenu"] = rolemenu
                }
                infos["roleset_open"] = false
                elements["rolemenu"].draw(infos["roleset_open"])
            }
        } else {
            sendData(
                {
                    "message": this.message,
                    "discord_id": infos["discord_id"]
                }
            )
        }
    }

    //先頭プレイヤーはルール編集権限がある
    let dic = {}
    if (players.length > 0 && players[0]["discord_id"] == infos["discord_id"]) {
        if (status["rule"]["first_seer"] == "RANDOM_WHITE") {
            dic["first_seer_no"] = ["初日占い:お告げ", "first_seer_button"]
        }
        if (status["rule"]["first_seer"] == "NO") {
            dic["first_seer_free"] = ["初日占い:なし", "first_seer_button"]
        }
        if (status["rule"]["first_seer"] == "FREE") {
            dic["first_seer_random_white"] = ["初日占い:自由", "first_seer_button"]
        }
        if (status["rule"]["bodyguard"] == "CONSECUTIVE_GUARD") {
            dic["bodyguard_rule_no"] = ["連続ガード:あり", "bodyguard_rule_button"]
        }
        if (status["rule"]["bodyguard"] == "CANNOT_CONSECUTIVE_GUARD") {
            dic["bodyguard_rule_yes"] = ["連続ガード:なし", "bodyguard_rule_button"]
        }
        dic["role_set"] = ["役職", "role_button"]
        dic["game_start"] = ["ゲーム開始", "start_button"]
    } else {
        dic = {}
        infos["roleset_open"] = false
    }
    let count = 0;
    for (let key in dic) {
        if (!elements[dic[key][1]]) {
            //console.log("make new button", key)
            if (key == "game_start") {
                let button = new Button(
                    dic[key][0], buttons, button_click,
                    120,
                    count % 3 * 120 + (SCREEN_W - 300) / 2 - 30,
                    (count / 3 | 0) * 40 + (SCREEN_H - 200) / 2 + 160,
                    key, true, infos
                )
                elements[dic[key][1]] = button
            } else {
                let button = new Button(
                    dic[key][0], buttons, button_click,
                    120,
                    count % 3 * 120 + (SCREEN_W - 300) / 2 - 30,
                    (count / 3 | 0) * 40 + (SCREEN_H - 200) / 2 + 160,
                    key
                )
                elements[dic[key][1]] = button
            }
        }
        elements[dic[key][1]].draw(dic[key][0], key)
        count += 1;
    }

    if (!elements["logout_button"]) {
        let button = new Button(
            "退出", buttons, button_click,
            120, SCREEN_W - 140, SCREEN_H - 50, "logout")
        elements["logout_button"] = button
    }
    elements["logout_button"].draw()

    if (!elements["rolemenu"]) {
        let rolemenu = new RoleMenu(
            infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 100, button_click
        )
        elements["rolemenu"] = rolemenu
    }
    elements["rolemenu"].draw(infos["roleset_open"])
}

// メッセージ受信イベント
function onMessage(event) {
    if (event && event.data) {
        var json = JSON.parse(event.data)
        //console.log(json)
        if(json["message"] == "free_account") {
            client_status = "account_select"
            infos["accounts"] = json["accounts"]
            draw()
        }
        if(json["message"] == "game_status") {
            let send_id = json["send_id"]
            if (send_id > infos["send_id"]) {
                infos["send_id"] = send_id
                client_status = "game_status"
                infos["game_status"] = json["status"]
                draw()
            }
        }
        if(json["message"] == "kicked") {
            sendData(
                {
                    "discord_id": infos["discord_id"],
                    "message": "logout"
                }
            )
        }
    }
}

function sendData(data) {
    var json = JSON.stringify(data);
    //console.log("send")
    //console.log(json)
    connection.send(json);
}

// エラーイベント
function onError(event) {
    console.log("エラー")
}

// 切断イベント
function onClose(event) {
    console.log("切断しました。")
    connection = null;
    client_status = "offline"
    draw()
}

draw()
