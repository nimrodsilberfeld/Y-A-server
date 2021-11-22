
const express = require('express')
const Poll = require("../model/poll")
const router = new express.Router()

router.post('/api/poll/add-poll', async (req, res) => {
   
    if (process.env.POLL_API_KEY !== req.header("poll-api-key")) {
        res.send("invalid header")
    }
    try {
        const poll = new Poll(req.body)
        await poll.save()
        res.status(201).send({ poll })
    } catch (err) {
        console.log("post err", err)
    }
})

router.patch('/api/poll/:id/vote/:option', async (req, res) => {
    const id = req.params.id
    const option = req.params.option

    try {
        const poll = await Poll.findById(id)
        if (!poll) {
            return res.status(404).send("Poll not found")
        }
        const foundOption = poll.options[option].option
        const vote = poll.options[option].vote

        await Poll.findOneAndUpdate({ id: id, 'options.option': foundOption }, {
            $set: {
                'options.$.vote': vote + 1
            }
        }).exec()
        // await poll.save()
        res.send({ poll })
    } catch (err) {
        console.log("patch err", err)
    }
})

router.get('/api/polls', async (req, res) => {
    let pageNumber = req.query.page
    const number = await Poll.countDocuments();
    console.log("count", number);
    console.log(pageNumber)
    try {
        const polls = await Poll.find({})
            .limit(3)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * 3) : 0)
        res.send({ polls, number })
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

module.exports = router
