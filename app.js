
const SolrNode = require('solr-node');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const hostname = '127.0.0.1';
const port = 3000;

async function main() {
    makeWebpage();
}

async function makeWebpage(){

    app.use(express.static(__dirname + '/public'));

    io.on('connection', function(socket){
        socket.on('search', function(searchText){
            searchSolr(searchText);
        });
    });

    const port = process.env.PORT || 3000;
    http.listen(port, function(){
        console.log('listening on *:3000');
    });
}

async function searchSolr(searchText){

    //console.log("Searching for: " + searchText)
    var strQuery = solrClient.query().q(searchText);
    solrClient.search(strQuery, function (err, result) {
        if (err) {
           console.log(err);
           return;
        }
        //console.log(result)
        io.emit('sendResults', result);
     });
}

var solrClient = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'NBA_shard1_replica_n2',
    protocol: 'http'
});

app.get('/', function(req, res) {
    io.on('connection', function(socket){
        socket.on('search', function(searchText){
            searchSolr(searchText);
        });
    });

    res.render('index');
})

app.post('/', function(req, res) {
    let query = req.body.city;
    var strQuery = solrClient.query().q(searchText);
    solrClient.search(strQuery, function (err, result) {
        if (err) {
            res.render('index', {results: null, error: 'Error, please try
again.'});
        } else {
           //io.emit('sendResults', result);
           res.render('index' {results: result, error: null});
        }
    });
    res.render('index');
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

app.set('view engine', 'ejs')
app.use(express.static('public')

//main();
