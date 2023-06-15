const db = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(require('./routes'));


db.connect(process.env.MONGODB_URI || 'mongodb://localhost/API-Social-Network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


db.set('debug', true);


app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));