export const config = {
    "URI": "ws://127.0.0.1:60000"
}

export function rolename2token(rolename) {
    let dic = {
        "villager": "村",
        "werewolf": "狼",
        "seer": "占",
        "medium": "霊",
        "bodyguard": "狩",
        "madman": "狂",
        "mason": "共",
        "cultist": "信",
        "fox": "狐",
        "baker": "パ"
    }
    return dic[rolename]
}

export function jpnname2engname(rolename) {
    let dic = {
        "村人": "villager",
        "人狼": "werewolf",
        "占い師": "seer",
        "霊媒師": "medium",
        "狩人": "bodyguard",
        "狂人": "madman",
        "共有者": "mason",
        "狂信者": "cultist",
        "妖狐": "fox",
        "パン屋": "baker",
        "?": "back_card"
    }
    return dic[rolename]
}

export function engname2description(rolename) {
    let victory_condition = {
        "human":"人狼陣営を全滅させる。",
        "werewolf":"村人陣営と人狼の数が同数になる。",
        "fox":"いずれかの陣営の勝利条件を満たした時に妖狐が生き残っている。"
    }
    let team = {
        "human":"村人陣営",
        "werewolf":"人狼陣営",
        "fox":"妖狐陣営"
    }
    let dic = {
        "villager": {
            "name":"村人",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"何も能力を持たない村人。<br>議論の中心となり人狼を見つけ出そう。"
        },
        "werewolf": {
            "name":"人狼",
            "team":team["werewolf"],
            "victory_condition":victory_condition["werewolf"],
            "description":"毎晩、仲間の人狼と作戦会議を行い、1人を指定し襲撃を行う。",
        },
        "seer": {
            "name": "占い師",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"毎晩、生存者のうち1人が「人狼」か「人狼以外」かを知ることができる。<br>初日占いが「お告げ」の場合、占い先を選択できず、人間がランダムで一人告げられる。",
        },
        "medium": {
            "name": "霊媒師",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"毎晩、昼時間に処刑された者が「人狼」か「人狼以外」かを知ることができる。",
        },
        "bodyguard": {
            "name": "狩人",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"夜時間毎に1人だけ人狼の襲撃から護衛することができる。<br>護衛した先と人狼の襲撃先が一致した場合、襲撃は失敗し平和な朝を迎える。<br>自分自身を守ることは出来ない。",
        },
        "madman": {
            "name": "狂人",
            "team":team["werewolf"],
            "victory_condition":victory_condition["werewolf"],
            "description":"人狼の味方をする狂った人間。人狼陣営の勝利を目指す。<br>狂人は人狼が誰か知らず、人狼も狂人が誰か知らない。",
        },
        "mason": {
            "name": "共有者",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"毎晩仲間の共有者と作戦会議を行うことができる村人。",
        },
        "cultist": {
            "name": "狂信者",
            "team":team["werewolf"],
            "victory_condition":victory_condition["werewolf"],
            "description":"人狼の味方をする狂った人間。人狼陣営の勝利を目指す。<br>狂信者は人狼が誰か知っているが、人狼は狂信者が誰か知らない。",
        },
        "fox": {
            "name": "妖狐",
            "team":team["fox"],
            "victory_condition":victory_condition["fox"],
            "description":"占い師に占われると死ぬが、人狼に襲撃されても死なない。また人間にも人狼にもカウントされない。<br>気付かれずに最後まで生き残ろう。",
        },
        "baker": {
            "name":"パン屋",
            "team":team["human"],
            "victory_condition":victory_condition["human"],
            "description":"生存していれば毎朝「今日も美味しいパンが焼けました」と表示される。"
        }
    }
    return dic[rolename]
}