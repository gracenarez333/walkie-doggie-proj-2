require('dotenv').config()
// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser = require('cookie-parser')
const db = require('./models')
const cryptoJS = require('crypto-js')

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// DIY middlewaare
// happens on every rewuest
app.use((req, res, next) => {
  // handy dandy debug request logger
  console.log(`[${ new Date().toLocaleString()}] incoming request: ${req.method} ${req.url}`)
  console.log('request-body:', req.body)
  // modify the response to give data to the routes/middleware that is 'downstream'
  res.locals.myData = 'hi i cam from a middleware'
  // tell express that the middleware is done
  next()
})

// auth middleware
 app.use( async (req, res, next) => {
   try {
     // if there is a cookie
     if (req.cookies.userId) {
       // try to find the user in the database
       const userId = req.cookies.userId
       const decryptedId = cryptoJS.AES.decrypt(userId, process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
       const user = await db.user.findByPk(decryptedId)
       // mount the found user on the res.locals so that the later routes can access the logged in user
       // any value on the res.locals is available to the layout.ejs
       res.locals.user = user
     } else {
       // the user is explicitly not logged in
       res.locals.user = null
     }
     next()
   } catch (err) {
     console.log('FIRE', err)
   } 
 })

// routes
app.get('/', (req, res) => {
  res.render('index')
})

// controllers
app.use('/users', require('./controllers/users'))

// 404 error handler needs to go last
// app.get('/*', (req, res) => {
//   // render your 404 temp here
// })
app.use((req, res, next) => {
  // render a 404 tempy
  res.status(404).render('404')
})
// 500 error handler
// needs to have all 4 params
app.use((error, req, res, next) => {
  // log the error
  console.log(error)
  // send a 500 error tempy
  res.status(500).render('500')
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})
