const mongoose = require('mongoose')

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    options: []
}, {
    timestamps: true,
})


pollSchema.pre('save', async function (next) {
    const poll = this
    if (typeof poll.options[0] !== 'object') {
      
        let newPollArr = []
        poll.options.forEach(option => {
            newPollArr.push({ option: option, vote: 0 })
        });
        poll.options = new Array(...newPollArr)
        console.log("after", poll)
    }
    next()
})
const Poll = mongoose.model('Poll', pollSchema)
module.exports = Poll
