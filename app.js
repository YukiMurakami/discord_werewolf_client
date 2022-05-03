import {Button} from "./components/button.js";
import { Account } from "./components/account.js";
import { Background } from "./components/background.js";
import { Phase } from "./components/phase.js";
import { Player } from "./components/player.js";
import { Rule } from "./components/rule.js";
import { Explain } from "./components/explain.js";
import { RoleMenu } from "./components/role_menu.js";
import { Voice } from "./components/voice.js";
import { config, jpnname2engname } from "./config.js";

// 画面サイズ
const SCREEN_W = 1600 * 0.8;
const SCREEN_H = 900 * 0.8;

const URI = config["URI"]
let client_status = "offline"
let connection = ""
let infos = {
    "send_id": -1,
    "roleset_open": false,
    "rolecard_rotate": false
}

function loadAllImages() {
    let images = [
        "./images/backgrounds/afternoon.jpg",
        "./images/backgrounds/evening.jpg",
        "./images/backgrounds/night.jpg",
    ]
    let buttons = document.getElementById("buttons")
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

function cleanup() {
    let buttons = document.getElementById("buttons")
    while (buttons.firstChild) {
        buttons.removeChild(buttons.firstChild);
    }
    let mes = document.getElementById("message")
    mes.innerText = ""
}

function drawBackground(type) {
    let buttons = document.getElementById("buttons")
    let back = new Background(
        type, buttons, SCREEN_W, SCREEN_H
    )
    back.draw()
}

function drawTitle() {
    loadAllImages()
    let buttons = document.getElementById("buttons")

    drawBackground("black")
    
    let mes = document.getElementById("message")
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
            console.log("connect ok");
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
    let buttons = document.getElementById("buttons")

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
            100, 120 * (i % 7 + 2), 200 + 140 * parseInt(i / 7, 10)
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

    //今のフェーズ情報
    let phase = new Phase(
        message, buttons, 180, 20, 20
    )
    phase.draw()

    let status = infos["game_status"]
    let players = status["players"]

    //ボイスチャンネル情報
    let voice = new Voice(
        infos, buttons, 130, 220, 28
    )
    voice.draw()

    //プレイヤー情報
    if (status["status"] != "ROLE_CHECK") {
        let radiusW = SCREEN_W * 0.4
        let radiusH = SCREEN_H * 0.4
        let playerC = players.length * 4
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
            let player = new Player(
                infos,
                i % (playerC / 4),
                buttons,
                100,
                SCREEN_W / 2 - 52 + radiusW * Math.cos(Math.PI * 2 / playerC * i + adjust),
                SCREEN_H / 2 - 62 + radiusH * Math.sin(Math.PI * 2 / playerC * i + adjust),
                button_click
            )
            player.draw()
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
    let rule = new Rule(
        infos, buttons, ruleW, (SCREEN_W - ruleW) / 2, y, time_only
    )
    rule.draw()

    //その他情報
    if (status["status"] != "RESULT") {
        let explain = new Explain(
            infos, buttons, ruleW * 1.4, (SCREEN_W - ruleW * 1.4) / 2, y + 170
        )
        explain.draw()
    }
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
}

function drawMorning() {
    drawBackground("afternoon")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目朝")
}

function drawAfternoon() {
    drawBackground("afternoon")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目昼")
}

function drawVote() {
    drawBackground("evening")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目夕")
}

function drawExcution() {
    drawBackground("evening")
    let status = infos["game_status"]
    drawStatus(status["day"].toString() + "日目夕処刑")
}

function drawResult() {
    let status = infos["game_status"]
    let players = status["players"]

    if (status["result"] == "WEREWOLF" || status["result"] == "FOX") {
        drawBackground("werewolf_win")
    } else {
        drawBackground("afternoon")
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
    let dic = {}
    //先頭プレイヤーはゲーム結果閉じるアクション付き
    if (players.length > 0 && players[0]["discord_id"] == infos["discord_id"]) {
        dic["result:"] = "ゲーム終了"
    } else {
        dic = {}
    }
    let count = 1
    for (let key in dic) {
        let button = new Button(
            dic[key], buttons, button_click,
            120,
            count % 3 * 120 + (SCREEN_W - 300) / 2 - 30,
            (count / 3 | 0) * 40 + (SCREEN_H - 200) / 2 + 160,
            key
        )
        button.draw()
        count += 1;
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
            if (!document.getElementById("role_menu")) {
                let rolemenu = new RoleMenu(
                    infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 100, button_click
                )
                rolemenu.draw()
                infos["roleset_open"] = true
            } else {
                let rolemenu = document.getElementById("role_menu")
                buttons.removeChild(rolemenu)
                infos["roleset_open"] = false
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
            dic["first_seer_no"] = "初日占い:お告げ"
        }
        if (status["rule"]["first_seer"] == "NO") {
            dic["first_seer_free"] = "初日占い:なし"
        }
        if (status["rule"]["first_seer"] == "FREE") {
            dic["first_seer_random_white"] = "初日占い:自由"
        }
        if (status["rule"]["bodyguard"] == "CONSECUTIVE_GUARD") {
            dic["bodyguard_rule_no"] = "連続ガード:あり"
        }
        if (status["rule"]["bodyguard"] == "CANNOT_CONSECUTIVE_GUARD") {
            dic["bodyguard_rule_yes"] = "連続ガード:なし"
        }
        dic["role_set"] = "役職"
        dic["game_start"] = "ゲーム開始"
    } else {
        dic = {}
    }
    let count = 0;
    for (let key in dic) {
        let button = new Button(
            dic[key], buttons, button_click,
            120,
            count % 3 * 120 + (SCREEN_W - 300) / 2 - 30,
            (count / 3 | 0) * 40 + (SCREEN_H - 200) / 2 + 160,
            key
        )
        button.draw()
        count += 1;
    }

    let button = new Button(
        "退出", buttons, button_click,
        120, SCREEN_W - 140, SCREEN_H - 50, "logout")
    button.draw()

    if (infos["roleset_open"]) {
        let rolemenu = new RoleMenu(
            infos, buttons, SCREEN_W * 0.9, SCREEN_W * 0.05, 100, button_click
        )
        rolemenu.draw()
    }
}

// メッセージ受信イベント
function onMessage(event) {
    if (event && event.data) {
        var json = JSON.parse(event.data)
        console.log(json)
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
    }
}

function sendData(data) {
    var json = JSON.stringify(data);
    console.log("send")
    console.log(json)
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