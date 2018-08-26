
const {Question, Answer} = require('./models')
const sequeue = require('seq-queue')
class DbRouter {
    constructor(modelDao, cb) {
        this.router = require('express').Router()
        this.queue = sequeue.createQueue(1000)
        this.modelDao = modelDao
        cb(this.router)
        this.route()
    }
    update(Model1, Model2, obj, where, entry) {
        this.modelDao.find(Model2, obj, (data) => {
            this.modelDao.update(Model1, where, entry, data, () => {
                //console.log(`updated ${JSON.stringify(obj)} ${JSON.stringify(where)} with ${data}`)
            })
        })
    }
    route() {
        this.router.post('/postQuestion', (req, res) => {
            this.queue.push((task) => {
                this.modelDao.save(Question, req.body, () => {
                    res.json({status : "success"})
                    if (this.aName && this.qName) {
                        this.update(Answer, Question, {name : this.aName}, {name : req.body.name}, "question")
                    }
                    this.qName = req.body.name
                    console.log(task)
                    task.done()
                })
            })
        })

        this.router.post('/postAnswer', (req, res) => {
            this.queue.push((task) => {
                this.modelDao.save(Answer, req.body, () => {
                    res.json({status : "success"})
                    if (this.qName && this.aName) {
                        console.log(this.aName)
                        this.update(Question, Answer, {name : this.aName}, {name : this.qName}, "answer")
                    }
                    this.aName = req.body.name
                    task.done()
                })
            })
        })
        const apiMaps = {'/questions': Question, "/answers" : Answer}
        for (let key of Object.keys(apiMaps)) {
            this.router.get(key, (req, res) => {
                this.queue.push((task) => {
                    this.modelDao.find(apiMaps[key], {} , (data) => {
                        res.json(data)
                        task.done()
                    })
                })
          })
        }

    }
}

module.exports = function(modelDao, cb) {
    return new DbRouter(modelDao, cb)
}
