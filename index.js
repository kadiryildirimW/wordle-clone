const express = require('express')
const app = express()

app.use(express.static('./'))

app.use((req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.PORT || 3000)