const bcrypt = require('bcryptjs')
const cryptoJS = require('crypto-js')

const testBcrypt = () => {
    const password = 'hello_123'
    // turn this password string into a hash
    // when a user signs up, hash their pass and store in our db
    const salt = 12
    const hash = bcrypt.hashSync(password, salt)
    console.log(hash)

    // when a user logs in, use compare sync to match passwords to our dbs hashs
    const compare = bcrypt.compareSync('sisdshf', hash)
    console.log('do they match?', compare)
}
// testBcrypt()

const testCrypto = () => {
    // this passphrase will be known only to the server admins
    const passphrase = '1234_hello'
    // this message will be in the cookie as the user's id
    const message = 'hi i am encrypted'
    //
    const encrypted = cryptoJS.AES.encrypt(message, passphrase).toString()
    console.log(encrypted)
    // in the middleware we will decrypt it
    const decrypted = cryptoJS.AES.decrypt(encrypted, passphrase).toString(cryptoJS.enc.Utf8)
    console.log(decrypted)
}

// testCrypto()