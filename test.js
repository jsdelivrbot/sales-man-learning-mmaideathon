const modelDao = require('./dao')
const {Question, Answer} = require('./models')
modelDao.save(Question, {name : 'QZ1', content : "Question z1", answers : []}, () => {
    console.log("saved")
})

modelDao.save(Question, {name : 'QZ2', content : "Question z2", answers : []}, () => {
    console.log("saved")
})

modelDao.save(Question, {name : 'QZ3', content : "Question z3", answers : []}, () => {
    console.log("saved")
})

modelDao.save(Question, {name : 'QZ4', content : "Question z5", answers : []}, () => {
    console.log("saved")
})


modelDao.save(Question, {name : 'QZ6', content : "Question z6", answers : []}, () => {
    console.log("saved")
})
