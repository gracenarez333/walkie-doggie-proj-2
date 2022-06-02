const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios = require('axios')


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
    const url = "https://api.petfinder.com/v2/animals";
      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6ImJiYzk3MWNkZDVjM2U3M2UxNTEyZWQ2OTZkYTdjYTliZDM0YzJhMzA0MWNjNzk1MGNkMjBkMDAxOTFmYjM0N2I4ZjhmYjkzYzU5MjBkMzZjIiwiaWF0IjoxNjU0MTk0OTIzLCJuYmYiOjE2NTQxOTQ5MjMsImV4cCI6MTY1NDE5ODUyMywic3ViIjoiIiwic2NvcGVzIjpbXX0.tLTm0nADy4BscX__Nd-fHC_a_V247Bm_mCwBfmj68SeEfKLh8E4OhiaqvqqnB8WZWKDru1Pb6m469f3WYoYyMRD1L2PuWDsdhH_ZzY8ZYWdV08YB7QkLXFWKd1ZkE8BVFok7yytXyVnLllOGeiK35GGq5gLT5s2o5I6odt0VZWZd6NNUwxCaGnfWtxFcchDv3VlioawYrZLkZfAI8g7_Nd8tAeWQADEBfgkJGEUw9qfBJ9A-lRR6LF-0wqqC5nM3LIjd6dC1eDLRMbrusGy7aHJhhimh_w6jZDJrkyTaH07RsTvX7QTxw6Rp2mRViZHM9TeblLFBuDj8XVHDW0rBWg",
        },
      });
      allDogs = response.data.animals.filter(dog => dog.type === 'Dog')
    res.render('pages/browse', { user: res.locals.user, animals: allDogs })
})

// GET /home/about -- render saved dogs list per user profile
router.get('/about/:id', async (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    try {
        const url = `https://api.petfinder.com/v2/animals/${ req.params.id }`;
        const response = await axios({
            method: "get",
            url: url,
            headers: {
                Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6ImJiYzk3MWNkZDVjM2U3M2UxNTEyZWQ2OTZkYTdjYTliZDM0YzJhMzA0MWNjNzk1MGNkMjBkMDAxOTFmYjM0N2I4ZjhmYjkzYzU5MjBkMzZjIiwiaWF0IjoxNjU0MTk0OTIzLCJuYmYiOjE2NTQxOTQ5MjMsImV4cCI6MTY1NDE5ODUyMywic3ViIjoiIiwic2NvcGVzIjpbXX0.tLTm0nADy4BscX__Nd-fHC_a_V247Bm_mCwBfmj68SeEfKLh8E4OhiaqvqqnB8WZWKDru1Pb6m469f3WYoYyMRD1L2PuWDsdhH_ZzY8ZYWdV08YB7QkLXFWKd1ZkE8BVFok7yytXyVnLllOGeiK35GGq5gLT5s2o5I6odt0VZWZd6NNUwxCaGnfWtxFcchDv3VlioawYrZLkZfAI8g7_Nd8tAeWQADEBfgkJGEUw9qfBJ9A-lRR6LF-0wqqC5nM3LIjd6dC1eDLRMbrusGy7aHJhhimh_w6jZDJrkyTaH07RsTvX7QTxw6Rp2mRViZHM9TeblLFBuDj8XVHDW0rBWg",
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
            photos: req.body.photos
        }, defaults: {
            name: req.body.name
        }
    })
    const user = await db.user.findByPk(res.locals.user.dataValues.id)
    user.addPet(pet)
    console.log(user)
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
        console.log(instance)
        await instance.destroy()
        res.redirect('/pages/favorites')
    } catch (err) {
        console.log('FIRE', err)
    }
})


module.exports = router