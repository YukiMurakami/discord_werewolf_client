import {Button} from "./components/button.js";
import { Account } from "./components/account.js";
import { Background } from "./components/background.js";
import { Phase } from "./components/phase.js";
import { Player } from "./components/player.js";
import { Rule } from "./components/rule.js";
import { Explain } from "./components/explain.js";
import { RoleMenu } from "./components/role_menu.js";
import { DetectiveMenu } from "./components/detective_menu.js";
import { RoleDescription } from "./components/role_description.js";
import { Voice } from "./components/voice.js";
import { config, jpnname2engname, rolename2token } from "./config.js";
import { Sound, Volume } from "./components/sound.js";
import { VoteShow } from "./components/vote_show.js";
import { LogShow } from "./components/log_show.js";

// 画面サイズ
const SCREEN_H = document.documentElement.clientHeight - 20;
const SCREEN_W = SCREEN_H * 16 / 9;
const RATIO = SCREEN_W / 1000

const URI = config["URI"]
let client_status = "offline"
let connection = ""
let infos = {
    "send_id": -1,
    "roleset_open": false,
    "rolelist_open": false,
    "rolecard_rotate": false,
    "volume": 0.5,
    "now_status": "offline",
    "playerids": [],
    "zindex": 10000,
    "now_detective_answer": []
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
    "rolelist_button": null,
    "rolemenu": null,
    "detectivemenu": null,
    "rolelist": null,
    "result_button": null,
    "role_description":null,
    "timer_stop_button": null,
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
    mes.innerText = "Discord 人狼ツール v1.0.2"
    mes.style.color = "#ffffff"
    mes.style.fontSize = (RATIO * 30).toString() + "px"
    mes.style.position = "absolute"
    mes.style.textAlign = "center"
    mes.style.left = ((SCREEN_W - mes.clientWidth) / 2).toString() + "px"
    mes.style.top = ((SCREEN_H - mes.clientHeight) / 2 - 70 * RATIO).toString() + "px"

    let mode = [["開始", "get_free_account"], ["観戦", "observe"]]
    for (let i=0;i<mode.length;i++) {
        let button = new Button(mode[i][0], buttons, () => {
            connection = new WebSocket(URI);
            if (mode[i][1] == "observe") {
                connection.onopen = function(event) {
                    //console.log("connect ok");
                    sendData({
                        "message": mode[i][1],
                        "discord_id": "observe"
                    });
                }
            } else {
                connection.onopen = function(event) {
                    //console.log("connect ok");
                    sendData({
                        "message": mode[i][1],
                    });
                }
            }
            connection.onmessage = onMessage;
            connection.onclose = onClose;
            connection.onerror = onError;
            }, 150 * RATIO,
            (SCREEN_W - 150 * RATIO) / 2,
            (SCREEN_H - 150 * RATIO / 132 * 45) / 2 + (20 + 80 * i) * RATIO, null)
        button.draw()
    }
}

function drawAccountSelect() {
    let buttons = document.getElementById("tmp")

    drawBackground("black")

    let mes = document.createElement("div")
    mes.innerText = "使用するアカウントを選択\n (自分のアカウントがない場合は、Discordにログインすること）"
    mes.style.color = "#ffffff"
    mes.style.fontSize = (20 * RATIO).toString() + "px"
    mes.style.position = "absolute"
    mes.style.textAlign = "center"
    mes.style.top = 60 * RATIO
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

    let width = 70 * RATIO
    let height = width * 1.2
    let margin = 20 * RATIO
    let side_count = 9

    for (let i = 0; i < infos["accounts"].length; i++) {
        let account = infos["accounts"][i]

        let account_div = new Account(
            account["name"] + "#" + account["discriminator"],
            account["avator_url"],
            account["discord_id"],
            buttons,
            account_select_button_click,
            width,
            (SCREEN_W - width * side_count - margin * (side_count - 1)) / 2 + (width + margin) * (i % side_count),
            150 * RATIO + (height + margin) * parseInt(i / side_count, 10), RATIO
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
    if (infos["game_status"]["status"] == "DETECTIVE") {
        drawDetective()
    }
    if (infos["game_status"]["status"] == "DETECTIVE_READY") {
        drawDetectiveReady()
    }
}

function drawStatus(message) {
    let buttons = document.getElementById("buttons")

    function button_click(e) {
        if (this.message == "rolelist") {
            if (!infos["rolelist_open"]) {
                if (!elements["rolelist"]) {
                    let rolemenu = new RoleMenu(
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 80 * RATIO, button_click, false ,this.message, RATIO
                    )
                    elements["rolelist"] = rolemenu
                }
                infos["rolelist_open"] = true
                elements["rolelist"].draw(infos["rolelist_open"])
            } else {
                if (!elements["rolelist"]) {
                    let rolemenu = new RoleMenu(
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 80 * RATIO, button_click, false , this.message, RATIO
                    )
                    elements["rolelist"] = rolemenu
                }
                infos["rolelist_open"] = false
                elements["rolelist"].draw(infos["rolelist_open"])
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
    //今のフェーズ情報
    if (!elements["phase"]) {
        let phase = new Phase(
            message, buttons, 110 * RATIO,
            15 * RATIO, 15 * RATIO, RATIO
        )
        elements["phase"] = phase
    }
    elements["phase"].draw(message)

    let status = infos["game_status"]
    let players = status["players"]

    //ボリューム操作
    if (!elements["volume"]) {
        let volume = new Volume(
            buttons, 66 * RATIO, 56 * RATIO, 63 * RATIO, sound, infos, RATIO
        )
        elements["volume"] = volume
    }
    elements["volume"].draw()

    //ボイスチャンネル情報
    if (!elements["voice"]) {
        let voice = new Voice(
            infos, buttons, 110 * RATIO, 135 * RATIO, 16 * RATIO, RATIO
        )
        elements["voice"] = voice
    }
    elements["voice"].draw()

    //プレイヤー情報
    let keys = []
    if (status["status"] != "ROLE_CHECK") {
        let radiusW = SCREEN_W * 0.415
        let radiusH = SCREEN_H * 0.4 - 20 * RATIO
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
            let x = SCREEN_W / 2 - 38 * RATIO + radiusW * Math.cos(Math.PI * 2 / playerC * i + adjust)
            let y = SCREEN_H / 2 - 38 * RATIO + radiusH * Math.sin(Math.PI * 2 / playerC * i + adjust) - 10 * RATIO
            let key = "player" + players[i]["discord_id"]
            keys.push(key)
            if (key in elements && elements[key]) {
            } else {
                let player = new Player(
                    infos,
                    i % playerC,
                    buttons,
                    65 * RATIO,
                    x,
                    y,
                    button_click,
                    show_role_description,
                    RATIO
                )
                elements[key] = player
            }
            elements[key].draw(x, y)
        }
    }

    //ルール情報
    let ruleW = 230 * RATIO
    let y = (SCREEN_H - ruleW * 0.6) / 2 - 30 * RATIO
    let time_only = false
    if (status["status"] == "ROLE_CHECK") {
        y = 50
        time_only = true
    }
    if (!elements["rule"]) {
        let rule = new Rule(
            infos, buttons, ruleW, (SCREEN_W - ruleW) / 2, y, RATIO
        )
        elements["rule"] = rule
    }
    elements["rule"].draw(time_only)

    //その他情報
    if (!elements["explain"]) {
        let explain = new Explain(
            infos, buttons, ruleW * 1.4, (SCREEN_W - ruleW * 1.4) / 2, y + 133 * RATIO, RATIO
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
                key, buttons, 50 * RATIO, SCREEN_W - 50 * RATIO,
                20 + SCREEN_W * 0.05 / 356 * 122 * count, result, RATIO
            )
            elements[key] = phase
        }
        elements[key].draw(key, result)
        count += 1
    }
    // 役職一覧ボタン
    if (!elements["rolelist_button"]) {
        let button = new Button(
            "役職一覧", buttons, button_click,
            80 * RATIO, SCREEN_W - 80 * RATIO * 1.2, SCREEN_H - 80 * RATIO / 132 * 45 * 1.2 , "rolelist")
        elements["rolelist_button"] = button
    }
    elements["rolelist_button"].draw()
    let rolelist_w = 900 * RATIO
    if (!elements["rolelist"]) {
        let rolemenu = new RoleMenu(
            infos, buttons, rolelist_w, (SCREEN_W - rolelist_w) / 2,
            80 * RATIO, button_click, false, "rolelist", RATIO
        )
        elements["rolelist"] = rolemenu
    }
    elements["rolelist"].draw(infos["rolelist_open"])

    //死亡時 or ゲーム終了時はログ表示
    let showflag = false
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == infos["discord_id"]) {
            if (!players[i]["live"]) {
                showflag = true
            }
        }
    }
    if (status["status"] == "RESULT") {
        showflag = true
    }
    if (showflag) {
        let key = "logshow"
        if (!elements[key]) {
            let logshow = new LogShow(
                "ログ表示", buttons, SCREEN_W * 0.05, SCREEN_W * 0.02, SCREEN_H - SCREEN_W * 0.05 / 356 * 122 - 20,
                status["log"], SCREEN_W, SCREEN_H, infos
            )
            elements[key] = logshow
        }
        elements[key].draw("ログ表示", status["log"], infos)
    }

    drawHandButton()
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

function drawDetective() {
    drawBackground("detective")
    let status = infos["game_status"]
    drawStatus("推理ショー")

    sound.play("detective", infos, status["detective"])

    function reorder_callback(answer) {
        let mes = "now_detective_answer:" + infos["discord_id"] + ":"
        for (let i=0;i<answer.length;i++) {
            if (i != 0) {
                mes += ","
            }
            mes += answer[i]
        }
        sendData(
            {
                "message": mes,
                "discord_id": infos["discord_id"]
            }
        )
    }

    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }

    //役職並べ替えメニューを表示
    if (!elements["detectivemenu"]) {
        let rolemenu = new DetectiveMenu(
            infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05,
            80 * RATIO, RATIO, reorder_callback, button_click,
            status["detective"] == infos["discord_id"]
        )
        elements["detectivemenu"] = rolemenu
    }
    elements["detectivemenu"].draw(true)
}

function drawDetectiveReady() {
    drawBackground("detective")
    let status = infos["game_status"]
    drawStatus("推理ショー")

    sound.stop()

    //役職並べ替えメニューを表示
    if (!elements["detectivemenu"]) {
        let rolemenu = new DetectiveMenu(
            infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05,
            80 * RATIO, RATIO, reorder_callback, button_click,
            false
        )
        elements["detectivemenu"] = rolemenu
    }
    elements["detectivemenu"].draw(true)
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
    drawSideActionButton()

    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }

    // タイマー停止ボタン
    if (infos["discord_id"].indexOf("observe_") == -1) {
        if (!elements["timer_stop_button"]) {
            let button = new Button(
                "一時停止", buttons, button_click,
                80 * RATIO, SCREEN_W - 80 * RATIO * 1.2,
                SCREEN_H - 80 * RATIO / 132 * 45 * 1.2 * 2, "timer_stop:true")
            elements["timer_stop_button"] = button
        }
        if (status["timer_stop"]) {
            elements["timer_stop_button"].draw("再開", "timer_stop:false")
        } else {
            elements["timer_stop_button"].draw("一時停止", "timer_stop:true")
        }
    }
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
    } else if (status["result"] == "DETECTIVE") {
        drawBackground("detective")
        sound.play("detective_win", infos, "first")
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
    if (status["result"] == "DETECTIVE") {
        title = "名探偵勝利"
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

function drawSideActionButton() {
    function button_click(e) {
        sendData(
            {
                "message": this.message,
                "discord_id": infos["discord_id"]
            }
        )
    }
    for (let key in elements) {
        if (key.indexOf("detective_show:") == 0) {
            if (elements[key]) {
                elements[key].element.hidden = true
                if (elements[key].confirm) {
                    elements[key].confirm.element.hidden = true
                    elements[key].confirm.ok_button.element.hidden = true
                    elements[key].confirm.ng_button.element.hidden = true
                }
            }
        }
    }
    let players = infos["game_status"]["players"]
    for (let i=0;i<players.length;i++) {
        if (players[i]["discord_id"] == infos["discord_id"]) {
            let actions = players[i]["actions"]
            let count = 1
            for (let j=0;j<actions.length;j++) {
                let button_key = ""
                let title = ""
                if (actions[j].indexOf("detective_show:") == 0) {
                    button_key = "detective_show:"
                    title = "推理ショー"
                }
                if (button_key == "") {
                    continue
                }
                let ruleW = 230 * RATIO
                let y = (SCREEN_H - ruleW * 0.6) / 2 - 30 * RATIO
                if (!elements[button_key]) {
                    let button = new Button(
                        title, buttons, button_click,
                        80 * RATIO,
                        (SCREEN_W - ruleW) / 2 - 80 * RATIO * 1.1 - 80 * RATIO * Math.floor(count / 4),
                        y + 10 * RATIO + (count % 4) * (80 * RATIO / 132 * 45),
                        actions[j], true, infos
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
                let ruleW = 230 * RATIO
                let y = (SCREEN_H - ruleW * 0.6) / 2 - 30 * RATIO
                if (!elements[button_key]) {
                    let button = new Button(
                        title, buttons, button_click,
                        80 * RATIO,
                        (SCREEN_W - ruleW) / 2 - 80 * RATIO * 1.1 - 80 * RATIO * Math.floor(count / 4),
                        y + 10 * RATIO + (count % 4) * (80 * RATIO / 132 * 45),
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
                let ruleW = 230 * RATIO
                let y = (SCREEN_H - ruleW * 0.6) / 2 - 30 * RATIO
                let role = rolename2token(actions[j].split(":")[1])
                let button_w = 60 * RATIO
                if (!elements[button_key]) {
                    let button = new Button(
                        role + title, buttons, button_click,
                        button_w,
                        (SCREEN_W - ruleW) / 2 + ruleW + button_w * 0.1 + button_w * Math.floor(count / 5),
                        y + 10 * RATIO + (count % 5) * (button_w / 132 * 45),
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
    let card_w = 340 * RATIO
    let card_h = card_w / 938 * 1125
    div.style.width = card_w
    div.style.height = card_h
    div.style.left = ((SCREEN_W - card_w)/2).toString() + "px"
    div.style.top = ((SCREEN_H - card_h)/2 + 50 * RATIO).toString() + "px"

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
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 80 * RATIO, button_click, true, this.message, RATIO
                    )
                    elements["rolemenu"] = rolemenu
                }
                infos["roleset_open"] = true
                elements["rolemenu"].draw(infos["roleset_open"])
            } else {
                if (!elements["rolemenu"]) {
                    let rolemenu = new RoleMenu(
                        infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 80 * RATIO, button_click, true, this.message, RATIO
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
        if (status["rule"]["first_victim"]) {
            dic["first_victim_no"] = ["役かけ:あり", "first_victim_button"]
        } else {
            dic["first_victim_yes"] = ["役かけ:なし", "first_victim_button"]
        }
        dic["role_set"] = ["役職", "role_button"]
        dic["game_start"] = ["ゲーム開始", "start_button"]
    } else {
        dic = {}
        infos["roleset_open"] = false
    }
    let count = 0;
    let rule_w = 230 * RATIO
    let rule_h = rule_w * 0.55
    let y = (SCREEN_H - rule_w * 0.6) / 2 - 30 * RATIO
    for (let key in dic) {
        if (!elements[dic[key][1]]) {
            //console.log("make new button", key)
            if (key == "game_start") {
                let button = new Button(
                    dic[key][0], buttons, button_click,
                    90 * RATIO,
                    (-1.5 + count % 3) * 90 * RATIO * 1.1 + SCREEN_W / 2,
                    (count / 3 | 0) * 90 * RATIO / 132 * 45 * 1.1 + y + 10 * RATIO + rule_h,
                    key, true, infos
                )
                elements[dic[key][1]] = button
            } else {
                let button = new Button(
                    dic[key][0], buttons, button_click,
                    90 * RATIO,
                    (-1.5 + count % 3) * 90 * RATIO * 1.1 + SCREEN_W / 2,
                    (count / 3 | 0) * 90 * RATIO / 132 * 45 * 1.1 + y + 10 * RATIO + rule_h,
                    key
                )
                elements[dic[key][1]] = button
            }
        }
        elements[dic[key][1]].draw(dic[key][0], key)
        count += 1;
    }
    // 退出ボタン
    if (infos["discord_id"].indexOf("observe_") == -1) {
        if (!elements["logout_button"]) {
            let button = new Button(
                "退出", buttons, button_click,
                80 * RATIO, SCREEN_W - 80 * RATIO * 1.2,
                SCREEN_H - 80 * RATIO / 132 * 45 * 1.2 * 2, "logout", true, infos)
            elements["logout_button"] = button
        }
        elements["logout_button"].draw()
    }

    if (!elements["rolemenu"]) {
        let rolemenu = new RoleMenu(
            infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 80 * RATIO, button_click, true, "role_set", RATIO
        )
        elements["rolemenu"] = rolemenu
    }
    elements["rolemenu"].draw(infos["roleset_open"])

}
// 役職説明を表示する
export function show_role_description(e){
    if(this.role != "back_card"){
        let descriptionW = 250 * RATIO;
        let y = SCREEN_H - descriptionW * 0.9 - 30 * RATIO
        let roledescription = new RoleDescription(
            document.getElementById("buttons"),
            descriptionW,
            33 * RATIO,
            y, RATIO)
        roledescription.draw(this.showflag,this.role);
    }
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
