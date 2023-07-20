import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

function* run () { //generator returns processed data before the whole data is finished to process.
    for (let index = 0; index <=99; index++) {
        const data = {
            id: randomUUID(),
            name: `Test ${index}`             
        }
        yield data
    }
}

async function handler (request, response) {
    const readable = new Readable({
        read() {
            for (const data of run()) {
                console.log('sending', data)
                this.push(JSON.stringify(data) + '\n')
            }
            // to stop data
            this.push(null)
        }
    })
    
    readable
       .pipe(response)
}



http.createServer(handler)
.listen(3000)
.on('listening', () => console.log("Server running at 3000."))

//readable stream -> generate
// Transform -> transform (processing)
//writeable strem -> finalize

// request is a readable stream, get the data from the client
// response is a writable stream, post the data to the client
