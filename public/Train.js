const input = document.getElementById('t1')
const cont = document.getElementById('cont')
class ChatBox {
    constructor(type) {
        this.div = document.createElement('div')
        cont.appendChild(this.div)
        this.initStyle(type)
        this.type = type

    }

    initStyle(type) {
        this.div.innerHTML = "..."

        const styleObj = {display:'inline-block', padding:"12px", fontSize:window.innerHeight/30,
        color : 'white', 'borderRadius':'5px'}
        if (type == 'mine') {
            styleObj.backgroundColor = '#94C2ED'
            styleObj.marginLeft = '5px'
        } else {
            styleObj.backgroundColor = '#4CAF50'
            styleObj.marginLeft = window.innerWidth - this.div.offsetWidth
            console.log(styleObj)
        }
        for (let key of Object.keys(styleObj)) {
            this.div.style[key] = styleObj[key]
        }

    }

    setText(text) {
        this.div.innerHTML = text
        if (this.type != 'mine') {
            this.div.style.marginLeft = window.innerWidth - this.div.offsetWidth
        }
    }
}




class ChatBotStiml {
    constructor() {
        this.questions = []
        this.answers = []
        this.init()
    }

    init() {
      fetch('http://localhost:8000/app/questions').then((res) => res.json()).then((obj) => {
          this.questions = obj
          console.log(this.questions)
          fetch('http://localhost:8000/app/answers').then((res) => res.json()).then((obj1) => {
              this.answers = obj1
              console.log(this.answers)
              this.size = this.answers.length + this.questions.length
              this.start()
          })
      })
    }

    start() {
        if (this.questions.length > 0) {
            const yChat = new ChatBox('yours')
            if (this.answers.length > 0) {
                input.value = this.answers[0].content
            }
            setTimeout(() => {
                yChat.setText("You:" + this.questions[0].content)
                document.getElementById('line').style.width = parseInt(document.getElementById('line').style.width) + (window.innerWidth) / this.size
                if (this.answers.length > 0) {
                    const answer = this.answers[0]
                    const mChat = new ChatBox('mine')

                    setTimeout(() => {
                        mChat.setText("Me:" + answer.content)
                        document.getElementById('line').style.width = parseInt(document.getElementById('line').style.width) + (window.innerWidth) / this.size
                        this.answers.splice(0, 1)
                        this.questions.splice(0, 1)
                        this.start()
                    }, 1000)
                }
                else {
                    this.questions.splice(0, 1)
                    this.start()
                }
            }, 1000)
        }

    }
}

const siml = new ChatBotStiml()
