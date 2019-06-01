const express = require('express')
const app = express()
const port = 3000
var pjson = require('./package.json');
app.get('/version', (req, res) => {
        const obj = {
            'version': pjson.version
        }
        res.send(obj)
    }
)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
