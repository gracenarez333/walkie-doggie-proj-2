const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const accessToken = require('../token.js')

// GET /pets/browse -- render results from the search query for browsing
router.get('/browse', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const header = await accessToken()
        const url = "https://api.petfinder.com/v2/animals";
          const response = await axios({
            method: "get",
            url: url,
            headers: {
              Authorization:
                header,
            },
          });
          allDogs = response.data.animals.filter(dog => dog.type === 'Dog')
          console.log(allDogs)
        res.render('pets/browse', { user: res.locals.user, animals: allDogs })   
    } catch (err) {
        console.log(err, 'FIRE')
    }
})

// GET /pets/:id -- render about page
router.get('/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const header = await accessToken()
        const url = `https://api.petfinder.com/v2/animals/${ req.params.id }`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization:
                header,
            },
        });
        const walkComments = await db.comment.findAll({
            where: {
                petId: req.params.id
            },
            include: [db.user]
        })
        res.render('pets/about', { user: res.locals.user, animal: response.data.animal, walkComments })
    } catch(err) {
    console.log('FIRE', err)
    }
})

// POST /home/favorites -- create a new favorite
router.post('/favorites', async (req, res) => {
    // check if usser is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    const [pet, created] = await db.pet.findOrCreate({
        where: {
            id: req.body.id,
            photos: req.body.photos ? req.body.photos : 'https://place.dog/300/200'
        }, defaults: {
            name: req.body.name
        }
    })
    const user = await db.user.findByPk(res.locals.user.dataValues.id)
    user.addPet(pet)
    res.redirect('/users/pets/favorites')
})

// DELETE /home/favorites -- deletes a favorite from the list
router.delete('/favorites/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        // find an instance
        const instance = await db.pet.findOne({
            where: {
                id: req.body.id
            }
        })
        await instance.destroy()
        res.redirect('/users/pets/favorites')
    } catch (err) {
        console.log('FIRE', err)
    }
})

// POST /pets/:id -- posts comments from annonymous users
router.post('/:id', async (req, res) => {
    try {
        await db.comment.create({
            content: req.body.content,
            userId: res.locals.user.dataValues.id,
            petId: req.params.id
        })
        res.redirect(`/pets/${req.params.id}`)
    } catch (err) {
        console.log('FIREER', err)
    }
})

// DELETE /pets/:id/comments/:id -- deletes a comment from the list
router.delete('/:petId/comments/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        // find an instance
        const instanceComment = await db.comment.findOne({
            where: {
                userId: res.locals.user.dataValues.id,
                id: req.params.id,
                petId: req.params.petId
            }
        })
        await instanceComment.destroy()
        res.redirect('back')
    } catch (err) {
        console.log('FIRE', err)
    }
})


module.exports = router