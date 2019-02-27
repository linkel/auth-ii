const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userDB = require('./dataaccess/users')

const secret =
  process.env.JWT_SECRET || 'life is absolutely insane and i am impressed'

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("Just proof that it's functional.")
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    if (user.username && user.password) {
        const hash = bcrypt.hashSync(user.password, 2);
        user.password = hash;
        userDB.add(user)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json(err);
        })

    } else {
        res.status(400).json({error: "Please provide both username and password"})
    }
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const options = {
        expiresIn: '1d',
    };
    return jwt.sign(payload, secret, options)
}

server.post('/api/login', (req, res) => {
    let {username, password} = req.body;
    userDB.findBy({username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res.status(200).json({
                message: `You are logged in, ${user.username}.`,
                token,
                secret
            });
        } else {
            res.status(401).json({message: "Invalid credentials!"})
        }
        
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

function restricted(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message : "Problem decoding token."})
            } else {
                req.decodedJwt = decodedToken;
                next();
            }
        });
    } else {
        req.status(401).json({message: "Unauthorized credentials."})
    }
}

server.get('/api/users', restricted, (req, res) => {
    userDB.find()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running awayyyyy on pork ${port}`))