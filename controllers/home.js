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
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6ImZkNjI2Mjg3YjkzY2NlYTAyMzc5MjcyZTA0YmJlNDNiZDc0ZDdmNTcxMjNmZjE3YmQwNmVlYTFmMzFhYjkyYzkyYmYyMWMwZWU4YWE1ZWE4IiwiaWF0IjoxNjU0MDM4OTI2LCJuYmYiOjE2NTQwMzg5MjYsImV4cCI6MTY1NDA0MjUyNiwic3ViIjoiIiwic2NvcGVzIjpbXX0.BNro01zSmNaJxHpfkoVEuGXSsgTSs4yzLjnmb9Y7OZ2R2HbCtXNGOf6yvxc6h8bCsKqBQE9i0bUmHdbphQR8p1COCF5V8lpgQ9X-p9YA6ZFAEK4-3WfuqdEXnERSxuHdbX_O7nEjUAhAqEskoO106-cuijag95QZy5emoAqW771jNxC7LUWyxxZxMRolx5vRSyUqmMWpPYuhuZrAClveNh6Hfw7tFAv5dNNhzsOOQ9MbdN9cit579-vHmPJFVLVIitOuT4y40SmxsylehCpwzxFECms2-bYA3mb3JG2j_z1v0wK9CsJzK5gPIzrAE5i7vaOomgFIMJlwflNEvEyDUw",
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
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6ImZkNjI2Mjg3YjkzY2NlYTAyMzc5MjcyZTA0YmJlNDNiZDc0ZDdmNTcxMjNmZjE3YmQwNmVlYTFmMzFhYjkyYzkyYmYyMWMwZWU4YWE1ZWE4IiwiaWF0IjoxNjU0MDM4OTI2LCJuYmYiOjE2NTQwMzg5MjYsImV4cCI6MTY1NDA0MjUyNiwic3ViIjoiIiwic2NvcGVzIjpbXX0.BNro01zSmNaJxHpfkoVEuGXSsgTSs4yzLjnmb9Y7OZ2R2HbCtXNGOf6yvxc6h8bCsKqBQE9i0bUmHdbphQR8p1COCF5V8lpgQ9X-p9YA6ZFAEK4-3WfuqdEXnERSxuHdbX_O7nEjUAhAqEskoO106-cuijag95QZy5emoAqW771jNxC7LUWyxxZxMRolx5vRSyUqmMWpPYuhuZrAClveNh6Hfw7tFAv5dNNhzsOOQ9MbdN9cit579-vHmPJFVLVIitOuT4y40SmxsylehCpwzxFECms2-bYA3mb3JG2j_z1v0wK9CsJzK5gPIzrAE5i7vaOomgFIMJlwflNEvEyDUw",
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
            id: req.body.id
        }, defaults: {
            name: req.body.name
        }
    })
    const user = await db.user.findByPk(res.locals.user.dataValues.id)
    user.addPet(pet)
    console.log(user)
    res.redirect('/home/favorites')
})


module.exports = router