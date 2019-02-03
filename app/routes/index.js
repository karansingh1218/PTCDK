var express = require('express');
var router = express.Router();

const {Client, Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1', 
  database: 'NOT FOR YOU',
  password: 'NOT FOR YOU',
  port: 5431,
})

// Home
router.get('/', (req, res) => {
  pool.query("SELECT DISTINCT publication FROM editor")
    .then((data) => {
      res.render('main', {
        title: "Pitchdeck",
        data: data.rows
      })
    })
    .catch(e => {
      console.log(e)
    })
})

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'Pitchdeck' });
});

router.get('/publication/:publication', (req, res) => { // Unique Publications
  pool.query(`SELECT * FROM editor WHERE publication LIKE '%${req.params.publication}%'`)
    .then((data) => {
      res.render('publication', {
        title: "Pitchdeck",
        data: data.rows,
        publisher: req.params.publication
      })
    }) 
    .catch(e => {
      console.log(e)
    })
})

router.get('/person/:persona', (req, res) => { // Unique Editors
  pool.query(`SELECT * FROM writer WHERE editorname LIKE '%${req.params.persona}%'`) // Need to do a join...z
    .then((data) => {
      res.render('persona', {
        title: "Pitchdeck",
        data: data.rows,
        person: req.params.persona
      })
    })
    .catch(e => {
      console.log(e)
    })
})

router.get('/person', (req, res) => {
  res.render('personForm', {
    title: "Pitchdeck"
  })
})

router.post('/person', function(req, res) {
  let editorname = req.body.editorname
  let amount = req.body.amount
  let responsetime = req.body.responsetime
  let publication = req.body.publication
  let rating = req.body.rating
  let notes = req.body.notes

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')

  // amount = parseFloat(amount)
  amount = parseFloat(amount)
  responsetime = parseFloat(responsetime)
  rating = parseInt(rating)

  console.log(`${editorname} ${amount} ${responsetime} ${publication} ${rating} ${notes} ${date}`)
  const values = [editorname, amount, responsetime, publication, rating, notes, date] // Error is at amount... 
  
  pool.query(`INSERT INTO writer(
    editorname, amount, responsetime, publication, rating, notes, time) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values, (error, results) => {
      if (error) {
        console.log(error)
      }
      console.log(results)
      res.redirect('/person')
    })
})

router.get('/editor', (req, res) => {
  res.render('editorForm', {
    title: 'Pitchdeck'
  })
})

router.post('/editor', (req, res) => {
  let editorname = req.body.editorname
  let publication = req.body.publication
  let paymentaverage = req.body.paymentaverage
  let responseaverage = req.body.responseaverage
  let ratingaverage = req.body.ratingaverage

  const date = new Date().toISOString().slice(0, 19).replace('T', ' ')

  paymentaverage = parseFloat(paymentaverage)
  responseaverage = parseFloat(responseaverage)
  ratingaverage = parseInt(ratingaverage)

  const values = [editorname, publication, paymentaverage, responseaverage,ratingaverage, date]

  pool.query(`INSERT INTO editor(
    editorname, publication, paymentaverage, responseaverage, ratingaverage, time) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values, (error, results) => {
      if (error) {
        console.log(error)
      }
      console.log(results)
      res.redirect('/editor')
    })
})

module.exports = router;

