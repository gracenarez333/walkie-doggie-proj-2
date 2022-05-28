const express = require('express')
const router = express.Router()
const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const axios = require('axios')

router.get('/', (req, res) => {
    res.render('pages/home')
  })

module.exports = router