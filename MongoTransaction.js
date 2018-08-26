const mongoose = require('mongoose')
class Transaction {
    constructor() {
        this.tasks = []
    }

    start(cb) {
        if (this.tasks.length == 0) {
            this.doTransaction(cb)
        }
        this.tasks.push(cb)
    }

    doTransaction(cb) {
        var db = mongoose.connect('mongodb://localhost:27017/sl-db', { useNewUrlParser: true })
        cb(() => {
            mongoose.connection.close(() => {
                console.log("connection closed")
                this.tasks.splice(0, 1)
                if (this.tasks.length > 0) {
                    this.doTransaction(this.tasks[0])
                }
            })
        })
    }
}

module.exports = Transaction
