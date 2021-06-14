const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = new express();

function getNLUInstance() {
    let api_key=process.env.API_KEY;
    let api_url=process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;


}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    let url = req.query.url;
    const analyzeParams = {
    'url': url,
     'features':{
        'entities': {
            'emotion': true,
            'limit': 1
        }}
    };

    let naturalLanguageUnderstanding=getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults.result.entities[0].emotion, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
         //res.send({'error:': err});
         res.send('error:'+ err);
    });
});

app.get("/url/sentiment", (req,res) => {
    //return res.send("url sentiment for "+req.query.url);
     let url = req.query.url;
    
    const analyzeParams = {
    'url': url,
     'features':{
        'entities': {
            'sentiment': true,
            'limit': 1
        }}
    };

     let naturalLanguageUnderstanding=getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults.result.entities[0].sentiment.label, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
         //res.send({'error:': err});
         res.send('error:'+ err);
    });
});

app.get("/text/emotion", (req,res) => {
    //return res.send({"happy":"10","sad":"90"});
    const analyzeParams = {
    'text': text,
     'features':{
        'entities': {
            'emotion': true,
            'limit': 1
        }}
    };

     let naturalLanguageUnderstanding=getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults.result.entities[0].emotion, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
        // res.send({'error:': err});
        res.send('error:'+ err);
    });
});

app.get("/text/sentiment", (req,res) => {

    let text = req.query.text;
    
    //return res.send("text sentiment for "+req.query.text);
    
    const analyzeParams = {
    'text': text,
    'features':{
        'entities': {
            'sentiment': true,
            'limit': 1
        }}
    };

     let naturalLanguageUnderstanding=getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(JSON.stringify(analysisResults.result.entities[0].sentiment.label, null, 2));
    })
    .catch(err => {
        console.log('error:', err);
         //res.send({'error:': err});
         res.send('error:'+ err);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

