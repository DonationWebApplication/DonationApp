const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const Role = db.role;

db.sequelize.sync().then( () => {
    console.log("created three tabel in database.");
    initial();
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}

app.get('/', (req, res) => {
    res.send({
        message: "adlkjfkjkajdkjfk"
    });
});

require('./app/routes/auth.routes');
require('./app/routes/user.routes');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});