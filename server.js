//Modules
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({attrkey: "ATTR"});
const util = require('util');

//Constants
const key = 'vtAJU9IzKjZjvyI1yHTlg';

//Setup app
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

app.get('/', function (req,res){
    res.render('home', {error: null, searchVal: null, results: null});
})
app.post('/', function (req,res){
    var searchVal = req.body.search;
    let url = `https://www.goodreads.com/search/index.xml?q=${searchVal}&key=${key}`;
    //console.log(url);
    let responseList = [];
    request(url, function(err, response, body) {
        if(err){
            console.log(error)
            res.render('home', {error: err, searchVal: searchVal, results: null});
        }
        else {
            parser.parseString(body, function(error, result){
                if (error!== null){
                    console.log(error)
                }
                else{
                    var search=result['GoodreadsResponse']['search'];
                    let works=search[0].results[0].work;
                    for(let i=0; i<works.length; i+=1){
                        responseList.push(works[i].best_book[0].title[0]);
                        //console.log(works[i].best_book[0].title[0]);
                    }
                    res.render('home', {error: null, searchVal: searchVal, results: responseList});
                }
            });
        }
    });
})
app.listen(8080, function(){
	console.log('App listening on port 8080');
})