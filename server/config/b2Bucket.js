import B2 from 'backblaze-b2'
import dotenv from 'dotenv'

dotenv.config()

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APP_KEY
})

const authorizeB2 = async () => {
    if (!b2.authorizationToken) {
        await b2.authorize()
    }
}

export { b2, authorizeB2 }
