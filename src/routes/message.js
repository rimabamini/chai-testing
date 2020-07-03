const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message')

/** Route to get all messages. */
router.get('/', (req, res) => {
    // TODO: Get all Message objects using `.find()`
    // TODO: Return the Message objects as a JSON list
    Message.find()
    .then((msgs) => res.json({ msgs }))
    .catch((err) => console.log('ERR', err));
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    // TODO: Get the Message object with id matching `req.params.id`
    // using `findOne`
    Message.findOne({ _id: req.params.id })
    // TODO: Return the matching Message object as JSON
    .then((msg) => res.json({ msg }))
    .catch((err) => console.log(err));
})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(message => {
        return User.findById(message.author)
    })
    .then(user => {
        // console.log(user)
        user.messages.unshift(message)
        return user.save()
    })
    .then(() => {
        return res.send(message)
    }).catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    // TODO: Update the matching message using `findByIdAndUpdate`
    // TODO: Return the updated Message object as JSON
    Message.findByIdAndUpdate(req.params.id, res.body)
        .then((msg) => res.json({ msg }))
        .catch((err) => console.log(err));
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {
    // TODO: Delete the specified Message using `findByIdAndDelete`. Make sure
    // to also delete the message from the User object's `messages` array
    // TODO: Return a JSON object indicating that the Message has been deleted

    Message.findByIdAndDelete(req.params.id)
    .then((msg) => {
        if (msg === null) res.json({ message: 'Message was not found' });

        return res.json({ message: 'Message has been deleted' });
    })
    .catch((err) => console.log(err));
})

module.exports = router