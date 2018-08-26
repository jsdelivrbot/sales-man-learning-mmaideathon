
class TextDisplayer {
    static displayText(text) {
        const span = document.createElement('span')
        span.style.fontSize = Math.min(window.innerHeight, window.innerWidth) / 15
        span.innerHTML = text
        span.style.position = "absolute"
        span.style.top = window.innerHeight * 0.45
        span.style.left = window.innerWidth / 3 - span.offsetWidth / 2
        span.style.zIndex = 1000
        span.style.color = "white"
        document.body.appendChild(span)
        setTimeout(() => {
            const interval = setInterval(() => {
                span.style.opacity -= 0.1
                if (span.style.opacity == 0) {
                    document.body.removeChild(span)
                    clearInterval(interval)
                }
            }, 300)
        }, 3000)
    }
}
