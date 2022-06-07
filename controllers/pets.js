const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const accessToken = require('../token.js')

// GET /pets/browse -- render results from the search query for browsing
router.get('/browse', async (req, res) => {
    console.log('please for the love of godffkyejhfk')
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

module.exports = router