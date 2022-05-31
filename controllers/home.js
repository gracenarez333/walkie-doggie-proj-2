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
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjhkYzliNWYzZjdmZTI2OTIxNjk1OGQ5ZTVkZmUxMDdjZDVlNGJjYzI1Y2QxMWM2MGNlZjYxY2U0NzY3ZjMwY2ZjMGNkNjIyNTRmNDllYTgwIiwiaWF0IjoxNjU0MDMxMDQzLCJuYmYiOjE2NTQwMzEwNDMsImV4cCI6MTY1NDAzNDY0Mywic3ViIjoiIiwic2NvcGVzIjpbXX0.l9ptCdGFVEdLluoaK3RXesS7AmqLuVFFqfCqFLEvif8nWeDlGyymsgJIodcN8YvKibsNCjDtyjpXZ3TlhANVG1iaFAWbmY0FGljOaWEeQ0WYbUifFxF_4qZjXTK-rMMX9kJyojcMXysd7BemM0Lki4T50d6dx8C9TysID_T6xoQ4GvhQdiZxDM5noo3B73zdnqnKl60mvZ38q3bAxojBpmexnhkpaMiBdjBXxVKHfEMyf-jaCmzXCBmyMO1z7KtNFgilqLsU-93fch6iPgZOskkNmTFnAHr1Yw2NlUA5G8xRX86ALidwhh4k9DZXsGKaDjfgiZfqE8-B3N2y3OJGSA",
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
    const url = `https://api.petfinder.com/v2/animals/${ req.params.id }`;
      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ5VlZpbzFGS3UyTmx5M2NPWGUydUJvcHJmQTBXeFQ1aEdqTHg5NklWNU4xNHU5N0pYUiIsImp0aSI6IjhkYzliNWYzZjdmZTI2OTIxNjk1OGQ5ZTVkZmUxMDdjZDVlNGJjYzI1Y2QxMWM2MGNlZjYxY2U0NzY3ZjMwY2ZjMGNkNjIyNTRmNDllYTgwIiwiaWF0IjoxNjU0MDMxMDQzLCJuYmYiOjE2NTQwMzEwNDMsImV4cCI6MTY1NDAzNDY0Mywic3ViIjoiIiwic2NvcGVzIjpbXX0.l9ptCdGFVEdLluoaK3RXesS7AmqLuVFFqfCqFLEvif8nWeDlGyymsgJIodcN8YvKibsNCjDtyjpXZ3TlhANVG1iaFAWbmY0FGljOaWEeQ0WYbUifFxF_4qZjXTK-rMMX9kJyojcMXysd7BemM0Lki4T50d6dx8C9TysID_T6xoQ4GvhQdiZxDM5noo3B73zdnqnKl60mvZ38q3bAxojBpmexnhkpaMiBdjBXxVKHfEMyf-jaCmzXCBmyMO1z7KtNFgilqLsU-93fch6iPgZOskkNmTFnAHr1Yw2NlUA5G8xRX86ALidwhh4k9DZXsGKaDjfgiZfqE8-B3N2y3OJGSA",
        },
      });
    res.render('pages/about', { user: res.locals.user, dog: response.data })
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