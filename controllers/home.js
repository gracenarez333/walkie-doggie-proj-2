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
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjI2YWI1OTNmMTg0YTljZGNjZDNlYmNmZTI3NmRiM2Y5Njc2ZTdjMjk5MThkNDUwZWQ3MGM2ZmRjOTdmMWM4MjAwOTNlNDg4NWRiZTlkMDBkIiwiaWF0IjoxNjU0MTA2OTA5LCJuYmYiOjE2NTQxMDY5MDksImV4cCI6MTY1NDExMDUwOSwic3ViIjoiIiwic2NvcGVzIjpbXX0.gNDyUq5zsO8NdsAFkl1tkYNDMFVydkKn6tXgOhV3TE12hPqzbucTZ2_OU63CgsoHovN48abCOAkTZZDR9tE-lY9GptUXrYgT0W4h8sGVnw6HYEA90wSEeQDK_PHPZcYoFksO-BWJYnDwWI2009e1wTjOhrxOiCLHhdNL8yHp5jDre5d0zc1jDdlKrC6Ut-ww7NJbc4xgnlfHgp4ZpSJMRhBkCmb3AeWin6876hVgEXmLp6l80g4PjEkLAxlUnEbN4srej8vIPV4Gn2QOJYbc2yQgVgQpOiSH6UfNQCNrWpcMshGIOxZIGrBMjQsnulfIx7YB7J8q6KN5j2OsPBSUFQ",
        },
      });
      allDogs = response.data.animals.filter(dog => dog.type === 'Dog')
      console.log(allDogs)
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
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjI2YWI1OTNmMTg0YTljZGNjZDNlYmNmZTI3NmRiM2Y5Njc2ZTdjMjk5MThkNDUwZWQ3MGM2ZmRjOTdmMWM4MjAwOTNlNDg4NWRiZTlkMDBkIiwiaWF0IjoxNjU0MTA2OTA5LCJuYmYiOjE2NTQxMDY5MDksImV4cCI6MTY1NDExMDUwOSwic3ViIjoiIiwic2NvcGVzIjpbXX0.gNDyUq5zsO8NdsAFkl1tkYNDMFVydkKn6tXgOhV3TE12hPqzbucTZ2_OU63CgsoHovN48abCOAkTZZDR9tE-lY9GptUXrYgT0W4h8sGVnw6HYEA90wSEeQDK_PHPZcYoFksO-BWJYnDwWI2009e1wTjOhrxOiCLHhdNL8yHp5jDre5d0zc1jDdlKrC6Ut-ww7NJbc4xgnlfHgp4ZpSJMRhBkCmb3AeWin6876hVgEXmLp6l80g4PjEkLAxlUnEbN4srej8vIPV4Gn2QOJYbc2yQgVgQpOiSH6UfNQCNrWpcMshGIOxZIGrBMjQsnulfIx7YB7J8q6KN5j2OsPBSUFQ",
            },
        });
        res.render('pages/about', { user: res.locals.user, animal: response.data.animal })
    } catch(err) {
    console.log('FIRE', err)
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
    res.redirect('/home/favorites')
})

// DELETE /home/favorites -- deletes a favorite from the list
router.delete('/favorites', async (req, res) => {
    try {
        // find an instance
        const instance = await db.pet.findOne({
            where: {
                id: req.body.id
            }
        })
        console.log(instance)
        await instance.destroy()
        res.redirect('/home/favorites')
    } catch (err) {
        console.log('FIRE', err)
    }
})


module.exports = router