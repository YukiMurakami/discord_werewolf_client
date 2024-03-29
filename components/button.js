import { Confirmation } from "./confirmation.js";

export class Button {
    constructor(title, parent, func, width, x, y, key, confirm_flag=false, infos=null) {
        this.title = title;
        this.parent = parent;
        this.element = null;
        this.func = func
        this.width = width
        this.x = x
        this.y = y
        this.key = key
        this.confirm_flag = confirm_flag
        this.confirm = null;
        this.infos = infos

        this.counter = 0;
        this.eventlist = [];
    }

    click_confirm_show(e) {
        this.message.draw(true)
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
/*
    add_eventlistener(key) {
        if (!this.confirm_flag) {
            if (!key) {
                this.element.addEventListener("click", this.func)
            } else {
                this.element.addEventListener("click", {
                    message: key,
                    handleEvent: this.func
                })
            }
        } else {
            //console.log(this.confirm)s
            this.element.addEventListener("click", {
                message: this.confirm,
                handleEvent: this.click_confirm_show
            })
        }
    }

    remove_eventlistener(key) {
        if (!this.confirm_flag) {
            if (key == null) {
                this.element.removeEventListener("click", this.func)
            } else {
                this.element.removeEventListener("click", {
                    message: key,
                    handleEvent: this.func
                })
            }
        } else {
            this.element.removeEventListener("click", {
                message: this.confirm,
                handleEvent: this.click_confirm_show
            })
        }
    }
*/
    draw(title="", key="") {
        //console.log(this.confirm, this.title, this.element)
        if (title != "") {
            this.title = title
        }
        let last_key = this.key
        if (key != "") {
            this.key = key
        }
        if (!this.element) {
            this.element = document.createElement("input")
            this.element.type = "button"
            this.element.classList.add("button")
            this.parent.appendChild(this.element)
            this.element.style.width = this.width
            this.element.style.height = this.width / 132 * 45
            this.element.style.fontSize = Number(this.element.clientHeight / 45 * 100).toString() + "%"
            this.element.style.left = this.x.toString() + "px"
            this.element.style.top = this.y.toString() + "px"

            if (this.confirm_flag) {
                this.confirm = new Confirmation(
                    this.key,
                    this.parent,
                    this.width * 2.7,
                    parseInt(this.element.style.left) + this.width * -0.9,
                    parseInt(this.element.style.top) - this.width * 1.1,
                    this.infos, this.func, this.element
                )
            }
            if (!this.confirm_flag) {
                if (!this.key) {
                    this.addlistener("click", this.func)
                } else {
                    this.addlistener("click", this.func, {message: this.key})
                }
            } else {
                this.addlistener("click", this.click_confirm_show, {message: this.confirm})
            }
        }
        if (this.key != last_key) {
            // イベントを変更
            console.log("change", last_key, this.key)
            this.removelistener(this.counter)
            if (!this.confirm_flag) {
                if (!this.key) {
                    this.addlistener("click", this.func)
                } else {
                    this.addlistener("click", this.func, {message: this.key})
                }
            } else {
                this.confirm.remove()
                this.confirm = new Confirmation(
                    this.key,
                    this.parent,
                    this.width * 2.7,
                    parseInt(this.element.style.left) + this.width * -0.9,
                    parseInt(this.element.style.top) - this.width * 1.1,
                    this.infos, this.func, this.element
                )
                this.addlistener("click", this.click_confirm_show, {message: this.confirm})
            }
        }
        this.element.value = this.title
        if (this.confirm_flag) {
            this.confirm.draw(this.confirm.showflag)
        }
    }
}
