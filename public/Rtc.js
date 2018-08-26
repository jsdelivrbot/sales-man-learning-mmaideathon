const api_key = "7ab80c4e412148fca61dce3719ea8865"
const w = window.innerWidth, h = window.innerHeight
class RTC {
    constructor(mode, channel) {
        this.initLoader()
        this.channel = channel
        this.agaroClient = AgoraRTC.createClient({mode:'interop'})
        if (mode == 0) {
            this.send()
        } else {
            this.receive()
        }
    }

    initLoader() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = w
        this.canvas.height = h
        const context = this.canvas.getContext('2d')
        this.canvasText = "Loading..."
        setInterval(() => {
            context.fillStyle = '#212121'
            context.fillRect(0, 0, w, h)
            context.font = context.font.replace(/\d{2}/, Math.min(w,h) / 10)
            context.fillStyle = 'white'
            context.fillText(this.canvasText, w/2 - context.measureText(this.canvasText).width/2, h/2)
        }, 100)
        document.body.appendChild(this.canvas)
    }

    initVideoDom() {
        this.video = document.createElement('video')
        this.video.width = w
        this.video.height = h * 0.9
        document.body.appendChild(this.video)
    }
    initAgora(cb) {
      this.agaroClient.init(api_key, () =>{
          this.agaroClient.join(null, this.channel, null, (uid) => {
              if (cb) {
                  cb()
              }
          })
      })
    }
    send() {
        const uid = lil.uuid()
        var stream = AgoraRTC.createStream({
            streamID: uid,
            audio:true,
            video:true,
            screen:false
        })
        this.initAgora(() => {
            stream.init(() => {

                this.agaroClient.publish(stream, (err) => {

                    if (err == null) {
                        console.log("successfully published")
                    }
                })
                this.agaroClient.on('stream-published', (evt) => {
                    console.log("stream")
                    console.log(evt)
                    this.canvasText = "click to play"
                    this.canvas.onmousedown = () => {
                        document.body.removeChild(this.canvas)
                        this.initVideoDom()
                        this.video.src = window.URL.createObjectURL(stream.stream)
                        this.video.volume = 0
                        this.video.play()

                    }
                })
            })

        })
    }

    receive() {
        this.initAgora(() => {
            this.agaroClient.on('stream-added', (evt) => {
                console.log(evt.stream)
                this.agaroClient.subscribe(evt.stream)
            })
            this.agaroClient.on('stream-subscribed', (event) => {
                const stream = event.stream
                console.log(stream)
                this.canvasText = "click to play"
                this.canvas.onmousedown = () => {

                    document.body.removeChild(this.canvas)
                    this.initVideoDom()
                    this.video.src = window.URL.createObjectURL(stream.stream)
                    this.video.play()
                }

            })
        })
    }
}
