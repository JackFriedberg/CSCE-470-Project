
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
    var objQuery = solrClient.query()
        .q({name: searchText})
        .addParams({
            wt: 'json'
        })
        .start(0)
        .rows(100000)
    ;


    solrClient.search(objQuery, function (err, result) {
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

main();