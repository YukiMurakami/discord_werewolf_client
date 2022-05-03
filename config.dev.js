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
        "?": "back_card"
    }
    return dic[rolename]
}
