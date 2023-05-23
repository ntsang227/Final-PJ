const express = require('express');
const User = require('../../db/models/users');
const router = express.Router();

//Post Method
router.post('/post', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    console.log(req.body.name);
    console.log(req.body.email);
    try {
        const newUser = await user.save();
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedUser, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id)
        res.send(`Document with ${user.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


module.exports = router;