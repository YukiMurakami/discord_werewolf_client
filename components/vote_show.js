export class VoteShow {
    constructor(title, parent, width, x, y, result, ratio) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.width = width
        this.x = x
        this.y = y
        this.mes = null;
        this.result = result
        this.last_result = result
        this.counter = 0;
        this.eventlist = [];
        this.ratio = ratio
    }

    mouseout_vote(e) {
        let elements = document.getElementsByClassName("leader-line")
        while (elements.length) {
            elements.item(0).remove()
        }
    }

    draw(title, result) {
        this.title = title
        this.result = result
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
            this.mes.style.backgroundColor = "rgba(128,128,128,0.5)"
            this.mes.style.textAlign = "center"
            this.mes.style.left = this.width * 0.1
            this.mes.style.width = this.width * 0.8
            this.mes.style.top = this.width / 356 * 120 * 0.1
            this.mes.style.height = this.width / 356 * 120 * 0.8
            this.mes.style.position = "absolute"

            this.addlistener("mouseover", mouseover_vote, {result: this.result})

            this.element.addEventListener("mouseout", {
                handleEvent: this.mouseout_vote
            })
            this.last_result = this.result
        } else {
            if (!is_equal_list(this.result, this.last_result)) {
                this.removelistener(this.counter)
                this.addlistener("mouseover", mouseover_vote, {result: this.result})
                this.last_result = this.result
            }
        }
        this.mes.innerHTML = this.title
        if (this.title.length >= 6) {
            this.mes.style.fontSize = (5 * this.ratio).toString() + "px"
        } else {
            this.mes.style.fontSize = (7 * this.ratio).toString() + "px"
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

function hsvToRgb(H,S,V) {
    //https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0]};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0]};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X]};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C]};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C]};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X]};

    var m = V - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);
    return "rgba(" + R.toString() + "," + G.toString() + "," + B.toString() + ",1)"
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
    for (let i=0;i<this.result.length;i++) {
        let key = this.result[i]
        let H = 0
        if (this.result.length < 16) {
            H = 360 / 15 * i
        } else {
            H = 360 / this.result.length * i
        }
        let div = key.split(":")
        let arrow = new LeaderLine(
            document.getElementById(div[1]),
            document.getElementById(div[2]),
            {
                dash: {animation: true},
                middleLabel: LeaderLine.captionLabel(
                    {
                        text: (i + 1).toString(),
                        fontSize: 30
                    }
                ),
                color: hsvToRgb(H, 1, 1),
                path: "straight",
                size: 6,
                endPlugSize: 1.5,
                dropShadow: true
            }
        );
    }
}