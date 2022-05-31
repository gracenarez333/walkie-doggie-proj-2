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
    const url = "https://api.petfinder.com/v2/animals";
      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjQ4ODhkOGI1ODQ1ZTQ5MjMxNjhhYzBiOGFmMGVjZTE0M2M0ODJjMzZlNjRlMzExNGNiOGI5MDAyMGUwYjAxYjAwNzBkNDMwYmU5Yjk0NGNhIiwiaWF0IjoxNjUzOTY3ODU2LCJuYmYiOjE2NTM5Njc4NTYsImV4cCI6MTY1Mzk3MTQ1Niwic3ViIjoiIiwic2NvcGVzIjpbXX0.U5oyULC3yr6C97qF8vx59ONrqyXoF5oxlCqAxtNW6VhtVvN5-5o8JMAHlrpGEDLwzfDoEhN3ave-E7wtVOsCsny9d07biCsdsMF39YmvSNFs430QlIbS3DGlljr41AzvKplrs6NmJCMl24TOarDcTUajrH8ldAwgXRE1S2fL3wKWJDi2ubaRwGMouQqx89aVF2nV0-_sK1hADPU8a6J_WJklfeeiROUJQyZo720WmUsUFoDB49OXO9tnWR99Jzv0xJPKklQpM3hNb1m28j5enAvEPxS4Ovtka2xdkzEgKxkj_dcbwbkonyXFi1AdLHlvSbn_91BOppHAoDwoBFcpPg",
        },
      });
      const animals = await response.data.animals
    res.render('pages/home', { user: res.locals.user })
})

// GET /home/browse -- render results from the search query for browsing
router.get('/browse', (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    res.render('pages/browse', { user: res.locals.user })
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

// GET /home/about -- render saved dogs list per user profile
router.get('/about/:id', (req, res) => {
    // check if user is authorized
    if (!res.locals.user) {
        res.render('users/login', { msg: 'please log in to continue' })
        return // end the route here
    }
    res.render('pages/about', { user: res.locals.user })
})

module.exports = router