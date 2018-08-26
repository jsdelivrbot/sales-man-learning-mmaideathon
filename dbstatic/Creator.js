const color = {"question" : "#9C27B0", "answer" : "#4CAF50"}
const apis = {"question": "/postQuestion", "answer" : "/postAnswer"}
const headers = {"content-type": "application/json"}
class Node {
    constructor(contentObj, domNode) {
        this.contentObj = contentObj
    }

    addNext(node) {
        this.next = node
    }
}

class QACreator {
    constructor() {
        this.button = document.createElement('button')
        this.text = document.createElement('input')
        this.container = document.createElement('div')
        this.text.placeholder = 'Question?'
        document.body.appendChild(this.button)
        document.body.appendChild(this.text)
        document.body.appendChild(this.container)
        this.curr = null
        this.mode = "question"
        this.initStyle()
        this.addFunctionality()
    }

    initStyle() {
        this.text.style.width = "100%"
        this.text.style.height = "10%"
        this.text.style.position = "absolute"
        this.text.style.left = "0%"
        this.text.style.top = "80%"
        this.text.style.fontSize = "30px"
        this.button.style.width = "50%"
        this.button.style.height = "10%"
        this.button.style.position = "absolute"
        this.button.style.left = "25%"
        this.button.style.top = "90%"
        this.button.style.fontSize = parseInt(this.button.offsetHeight) * 0.8
        this.text.style.fontSize = parseInt(this.text.offsetHeight) * 0.8
        this.container.style.width = "100%"
        this.container.style.height = "80%"
        this.container.style.position = "absolute"
        this.container.style.left = "0%"
        this.container.style.top = "0%"
        this.container.style.overFlowY = 'scroll'
        this.button.innerHTML = "create"
    }

    createNode(content) {
        const node = document.createElement('p')
        node.innerHTML = content
        node.style.display = "block"
        node.style.width = "30%"
        node.style.fontSize = "30px"
        node.style.textAlign = "center"
        node.style.margin = "10%"
        node.style.color = "white"
        node.style.background = color[this.mode]
        node.style.postion = 'relative'
        node.style.left = "40%"
        node.style.borderRadius = "10px"
        this.container.appendChild(node)

        const name = content.split(" ")[0]
        const obj = {content, name}
        var nextMode = "answer"
        if (this.mode != "question") {
            nextMode = "question"
        }
        obj[nextMode] = null
        const curr = new Node(obj, node)
        if (this.curr != null) {
            this.curr.contentObj[this.mode] = obj
            fetch(`http://localhost:9000/db${apis[nextMode]}`,{method : "post", body : JSON.stringify(this.curr.contentObj), headers})
            this.curr.next = curr
            this.curr = this.curr.next
        }
        else {
            this.curr = curr
        }
        this.mode = nextMode
        this.text.placeholder = this.mode
        this.text.value = ""
    }

    addFunctionality() {
        this.button.onclick = () => {
            if (this.text.value.trim() != "") {
                this.createNode(this.text.value)
            }
        }
        this.text.onkeyup = () => {
            if (this.text.value.trim() == "") {
                this.button.setAttribute("disabled", true)
            } else {
                this.button.removeAttribute("disabled")
            }
        }
    }
}
this.qaCreator = new QACreator()
