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
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6ImJiMjlkYTYyY2E1MWY5ZTQ4YWYzOWEzNzczNGJkNTA4OGMxMTQ5MDYzMWNlMGUzZjA1NDljOTdkNGNmYzc0YTZiMDdjM2MyNGM0NTMyNjVkIiwiaWF0IjoxNjU0MDIxOTY4LCJuYmYiOjE2NTQwMjE5NjgsImV4cCI6MTY1NDAyNTU2OCwic3ViIjoiIiwic2NvcGVzIjpbXX0.SHZhHthS23GV6I9Ko1-Bdb1Jvendl4QgDKDnn5yrj33O_6TYPZD5TNyP8Q5BC08vZef91WsezfaHSEIzTmCzKFPPRjoZOaYbCmVzfShzFHVe3ZR0zo8CTsM1ZWM323ZifCrRQw7pjmpNIj4Wkx4opfU_lP30d7DbT2-6ZHsDDM4fwyCiOHIEa_yBQuASu8Se_RHJkofgEJqSJaQEsYX-EwoyZqvzhnotd85ysAWLcMxdu5yLpRJ6l06es9esqiqhPPCp0OQf34evjtWkdvwMORD4ZdNVaB1biLmCmrE8vfNU0xwjdRhDwMF9Q8UxEOjlskStHtcNItCWjOW7PCtu_A",
        },
      });
      allDogs = response.data.animals.filter(dog => dog.type === 'Dog')
      console.log(allDogs)
    res.render('pages/browse', { user: res.locals.user, animals: allDogs })
})

// GET /home/about -- render saved dogs list per user profile
router.get('/about/:id', (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    res.render('pages/about', { user: res.locals.user })
})

// GET /home/favorites -- render saved dogs list per user profile
router.get('/favorites', (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    res.render('pages/favorites', { user: res.locals.user })
})


module.exports = router