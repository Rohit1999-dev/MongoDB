const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const playerRoutes = express.Router();
const Details = require('./player.model');


const cors = require('cors');
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// mongoose connection from MongoDb Database....

mongoose.connect('mongodb://127.0.0.1:27017/players', { useUnifiedTopology: true, useNewUrlParser: true,  });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("sucessfully connect mongodb database");
})
// get all data from collection.....

playerRoutes.route('/find').get(function(req, res) {
    Details.find(function(err, players) {
        if (err) {
            console.log(err);
        } else {
            res.json(players);
        }
    });
});

// data insert from this routes......

playerRoutes.route('/add').post(function(req, res) {
    let Player = new Details(req.body);
        Player.save()
        .then(Player => {
            res.status(200).json({'player': 'player added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding  failed');
        });
});

// get data from their id....

playerRoutes.route('/:_id').get(function(req, res){
    let id = req.params._id;
    Details.findOne({"_id":id}, function(err,Player){
        res.send(Player)
    })
})
 // update data from id.....

 playerRoutes.route('/update/:_id').put(function(req, res) {
    Details.findById(req.params._id, function(err, Player) {
        if (!Player)
            res.status(404).send("data is not found");
        else
            Player.Player_name = req.body.Player_name;
            Player.Country = req.body.Country;
            Player.Description= req.body.Description;
            
            Player.save().then(Player => {
                res.send('player updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});
// deleted by id....

playerRoutes.route('/:_id').delete(function(req, res){
    var _id=req.params._id        
        Details.deleteOne({'_id':_id})
        .then(data=>{
            Details.find()
            .then(data=>{
                res.send(data)
            }).catch(err=>{
                res.send(err.message)
            })
        }).catch(err=>{
            res.send(err.message)
        })
})

// middleware function....
app.use('/players', playerRoutes);

// here port is working.....
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});