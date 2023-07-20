import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consume() {
    const response = await axios({url, method: 'get', responseType: 'stream'})
    return response.data
}

const stream = await consume()

stream
    .pipe(
        new Transform({
            transform(chunk, enc, cb) {
                const item = JSON.parse(chunk)
                const myName = /\d+/.exec(item.name)[0]
                

                if (myName % 2 === 0) item.name +=  ' é par'
                else item.name +=' é ímpar'

                cb(null, JSON.stringify(item))
            }
        })
)
.pipe(
    new Transform({
        transform(chunk, enc, cb) {
            const item  = JSON.parse(chunk)
            item.name = item.name.toUpperCase()
            cb(null, JSON.stringify(JSON.stringify(item)))
        }
    })
).pipe(
    new Writable({
        write(chunk, enc, cb) {
            console.log('Chegou', chunk.toString())
            
            cb()
        }
    })
)
