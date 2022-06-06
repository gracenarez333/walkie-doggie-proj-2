const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const accessToken = require('../token.js')


// GET /home/home -- render a home page with a search query
router.get('/home', (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    res.render('pages/home', { user: res.locals.user })
})

// GET /home/browse -- render results from the search query for browsing
router.get('/browse', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const header = await accessToken()
        const url = "https://api.petfinder.com/v2/animals&limit=100";
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
        res.render('pages/browse', { user: res.locals.user, animals: allDogs })   
    } catch (err) {
        console.log(err, 'FIRE')
    }
})

// GET /home/about -- render saved dogs list per user profile
router.get('/about/:id', async (req, res) => {
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
        res.render('pages/about', { user: res.locals.user, animal: response.data.animal, walkComments })
    } catch(err) {
    console.log('FIRE', err)
    }
})

// POST /home/about/:id -- posts comments from annonymous users
router.post('/about/:id', async (req, res) => {
    try {
        await db.comment.create({
            content: req.body.content,
            userId: res.locals.user.dataValues.id,
            petId: req.params.id
        })
        res.redirect(`/pages/about/${req.params.id}`)
    } catch (err) {
        console.log('FIREER', err)
    }
})

// DELETE /home/about/:id -- deletes a comment from the list
router.delete('/about/:id', async (req, res) => {
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
                id: req.body.id
            }
        })
        await instanceComment.destroy()
        res.redirect(`/pages/about/${req.params.id}`)
    } catch (err) {
        console.log('FIRE', err)
    }
})

// GET /home/edit/:id -- renders a form page to edit a comment
router.get('/edit/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const foundComment = await db.comment.findOne({
            where: {
                id: req.params.id,
            }
        })
        res.render('pages/edit', {user: res.locals.user, foundComment})  
    } catch (err) {
        console.log(err, 'FIREREIR')
    }
})

// PUT /home/edit -- edits a comment
router.put('/edit/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const foundComment = await db.comment.findOne({
            where: {
                id: req.params.id,
            }
        })
        await foundComment.set({
            content: req.body.content
        })
        await foundComment.save()
        res.redirect(`/pages/about/${ foundComment.petId }`)
    } catch (err) {
        console.log(err, 'FIRERERER')
    }
})

// GET /home/favorites -- render saved dogs list per user profile
router.get('/favorites', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    const animal = await db.user.findAll({
        where: {
            id: res.locals.user.dataValues.id
        }, include:[db.pet]
    })
    dog = animal[0].pets
    console.log(dog)
    res.render('pages/favorites', { user: res.locals.user, animal: dog })
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
    res.redirect('/pages/favorites')
})

// DELETE /home/favorites -- deletes a favorite from the list
router.delete('/favorites', async (req, res) => {
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
        res.redirect('/pages/favorites')
    } catch (err) {
        console.log('FIRE', err)
    }
})


module.exports = router