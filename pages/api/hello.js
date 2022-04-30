const express = require('express');
const app = express();
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const cors = require('cors')
const bcrypt = require('bcrypt')
const basicAuth = require('express-basic-auth')

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/login", basicAuth({ users: { 'admin': 'admin123' } }) , function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });


  db.all(`SELECT * FROM Users WHERE username = "${req.query.username}"`, function (err, rows) {
    console.log(rows)
    console.log(err)
    const row = rows[0];
    if (row === undefined) {
      res.json({ status: false })
    }
    else {
      bcrypt.compare(req.query.password, row.password).then(result => {
        if (result) {
          res.json({ status: true, username: row.username, id: row.ID})
        }

        else {
          res.json({ status: false })
        }
      })
    }


  })
})




app.get("/data", basicAuth({ users: { 'admin': 'admin123' } }), function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });
  db.all(`SELECT * FROM Users WHERE username = "${req.query.username}"`, function (err, rows) {
    const row = rows[0]
    res.json({ username: row.username, id: row.ID })
  })

})

app.post("/register", basicAuth({ users: { 'admin': 'admin123' } }), function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  const salt = 10
  bcrypt.hash(req.body.password, salt).then(password => {
    let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
    });
    db.all("SELECT * FROM Users WHERE username =" + "'" + req.body.username + "'" + " OR password = " + "'" + password + "'", function (err, rows) {
      console.log(rows)
      if (rows.length < 1) {
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
          db.run(`INSERT INTO Users (username,password) VALUES ('${req.body.username}','${password}')`);

        })

      }
      else {
        res.json({ exist: true })
      }
    })
  })
})


app.get("/search", (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });
  db.all(`SELECT username FROM Users WHERE username LIKE "%${req.query.username}%" `, function (err, rows) {
    console.log(rows)
    res.json(rows)
  })

})


app.post('/', function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
    db.run(`INSERT INTO Questions (username,title,text,userID) VALUES ('${req.body.name}','${req.body.title}',"${req.body.text}",'${req.body.userID}')`);
  })

  res.json({success: true});

})

app.get('/data/questions', function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });
  db.all(`SELECT * FROM Questions WHERE username LIKE "%${req.query.username}%" `, function (err, rows) {
    console.log(rows)
    res.json(rows)
  })
})

app.get('/question', basicAuth({ users: { 'admin': 'admin123' } }), function (req, res) {
  console.log(req.query)
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });
  db.all(`SELECT * FROM Questions WHERE id ="${req.query.id}" `, function (err, rows) {
    console.log(rows)
    const row = rows[0];
    res.json(row)
  })
})

app.post('/answer', basicAuth({ users: { 'admin': 'admin123' } }), function (req, res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
    db.run(`INSERT INTO Answers (username,answer,questionID,userID) VALUES ('${req.body.name}',"${req.body.answer}",'${req.body.id}','${req.body.userID}')`);
  })

  res.json({success: true});
})

app.get('/answers', function (req,res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {

  });
  db.all(`SELECT * FROM Answers WHERE questionID ="${req.query.id}" `, function (err, rows) {
    res.json(rows)
  })
})

app.get('/search/:keywords', function (req,res) {
  if (req.params.keywords.length < 3) {
    res.json([])
  }
  else {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
      db.all(`SELECT * FROM Questions WHERE title LIKE "%${req.params.keywords}%"`, function (err, rows) {
        db.all(`SELECT * FROM Questions WHERE text LIKE "%${req.params.keywords}%"`, function (err, rowss) {
            const result = rows.concat(rowss)
            console.log(result)
        
            res.json(result)
        })
      })
    });
  }
})

app.get('/user', function (req,res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)
  db.all(`SELECT username,ID FROM Users WHERE ID = "${req.query.id}"`, function (err, rows) {
    const row = rows[0];
    res.json(row)
  })
})

app.delete('/answer', function (req,res) {
  console.log(req.body)
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)
  db.all(`DELETE FROM Answers WHERE questionID = "${req.body.id}"`)

  res.json({success: true})

})

app.delete('/question', basicAuth({ users: { 'admin': 'admin123' } }), function (req,res) {
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE)
  db.all(`DELETE FROM Questions WHERE id = "${req.body.id}"`)
  db.all(`DELETE FROM Answers WHERE questionID = "${req.body.id}"`)

  res.json({success: true})

})
      
    

app.listen(3001)