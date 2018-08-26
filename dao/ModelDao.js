const Transaction = require('../MongoTransaction')
const transaction = new Transaction()
class ModelDao {
    static save(Model, obj, scb) {
        transaction.start((cb) => {
            const model = new Model(obj)
            model.save(() => {
                scb()
                cb()
            })
        })

    }

    static find(Model, obj, scb) {
        transaction.start((cb) => {
            Model.find(obj).exec((err, data) => {
                if (err == null) {
                    scb(data)
                    cb()
                }
            })
        })
    }

    static update(Model, where, entry, obj, scb) {
        transaction.start((cb) => {
            Model.findOne(where).exec((err, model) => {
                console.log(model)
                cb()
                if (err == null && model) {
                    model[entry] = obj
                    console.log(model)
                    transaction.start((cb1) => {
                      model.save(() => {
                          scb()
                          cb1()
                      })
                    })

                }
            })

        })
    }
}

module.exports = ModelDao
