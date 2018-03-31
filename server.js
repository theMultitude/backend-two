const bodyParser = require('body-parser');
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const { pass, user } = require('./src/config.js');

// MONGO MODELS
const Note = require('./api/models/note')

const PORT = process.env.PORT || 5000;

const server = express();

server.use(bodyParser.json());
server.use(cors());

// get all notes
server.get('/notes', (req, res) => {
  Note.find({}) // gets all notes. when users add implemented replace with something like NOTE.find({userID})
  .then(notes => {
    if (notes.length) {
      res.status(200).json(notes);
    } else {
      res.status(404).json({MSG: "No notes found."})
    }
  })
  .catch(err => {
    res.status(500).json({err})
  })
});

// get note by id
server.get('/notes/:id', (req, res) => {
  const id = req.params;
  Note.find({_id: id}).then(note => {
    if (note.length) {
      res.status(200).json(note)
    } else {
      res.status(404).json({msg: `Note with ${id} not found.`})
    }
  })
  .catch(err => {
    res.status(500).json({err})
  })
})


// add note
server.post('/notes', (req, res) => {
  const { title, body } = req.body;

  if (!title) {
    res.status(422).json({err: 'You need a title'});
  } else if (!body) {
    res.status(422).json({err: 'You need a body'})
  } else {
    const newNote = new Note(req.body);
    newNote.save().then(note => {
      Note.find({}) // gets all notes. when users add implemented replace with something like NOTE.find({userID})
      .then(notes => {
        if (notes.length) {
          res.status(200).json(notes);
        } else {
          res.status(404).json({MSG: "No notes found."})
        }
      })
      .catch(err => {
        res.status(500).json({err})
      })
    }).catch(err => {
      res.status(500).json({err: "Error saving to the db. Try again."})
    })
  }
})

server.patch('/notes/:id', (req, res) => {
  const id = req.params;
  Note.findOneAndUpdate({_id: id}, req.body)
  .then(note => {
    Note.find({}).then(notes => {
      if (notes.length) {
        res.status(200).json(notes)
      } else {
        res.status(404).json({msg: "No notes found."})
      }
    }).catch(err => {
      res.status(500).json({err})
    })
  }).catch(err => {
    res.status(500).json({err})
  })
})

// delete note
server.delete('/notes/:id', (req, res) => {
  const id = req.params;
  Note.findOneAndRemove({_id: id})
  .then(note => {
    Note.find({})
    .then(notes => {
      if (notes.length) {
        res.status(200).json(notes)
      } else {
        res.status(404).json({ msg: 'No notes found.'})
      }
    })
    .catch(err => {
      res.status(500).json({err})
    })
  })
  .catch(err => {
    res.status(500).json({err})
  })
})





mongoose
  .connect(`mongodb://${user}:${pass}@ds015879.mlab.com:15879/backendweek`)
  .then(() => {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => console.log(`We have liftoff on ${PORT}`));
  })
  .catch(err => {
    console.log('error connecting to database');
  });
