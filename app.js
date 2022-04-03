const express = require('express')
const app = express()
const port = 3000
const path = require('path')

const htmlDir = path.join(__dirname, 'public')
const scriptDir = path.join(__dirname, 'lib')
const d3Dir = path.join(__dirname, 'node_modules/d3')
const d3RadialDir = path.join(__dirname, 'node_modules/d3-radial-axis')
const lodashDir = path.join(__dirname, 'node_modules/lodash')

app.use('/', express.static(htmlDir))
app.use('/lib', express.static(scriptDir))
app.use('/d3', express.static(d3Dir))
app.use('/d3-radial-axis', express.static(d3RadialDir))
app.use('/lodash', express.static(lodashDir))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

