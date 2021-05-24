var express = require('express');

var app = express();
var http = require('http');
var handlebars = require('express-handlebars')
var bodyParser = require('body-parser');
var fs = require('fs')
var createError = require('http-errors');
var path = require('path');

app.use(express.static(path.resolve('./public')));
// app.use('/public', express.static(path.resolve('./public')));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');



//Creates the JSON File for easy use from other pages
function Pet(name, breed, careLevel, careLevelNumeric, gender) {
  this.name = name;
  this.breed = breed;
  this.careLevel = careLevel;
  this.careLevelNumeric = careLevelNumeric;
  this.gender = gender;
}

var Pets = [
  new Pet("molly", "giraffe", "moderate", 1, "female"),
  new Pet("goony", "panda", "low", 2, "female"),
  new Pet("lolli", "unicorn", "very high", 3, "female"),
  new Pet("zack", "puppy", "high", 2,"male"),
  new Pet("yammy", "spider", "very low", 2,"male"),
  new Pet("sally", "brontosaurus", "high", 3, "female")]

let data = JSON.stringify(Pets)
fs.writeFileSync('animals.json', data)

// app.set('port', 3000);
//
// app.listen(app.get('port'), function(){
//     console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
// });

const port = process.env.PORT || 3001;
app.get('/',function(req,res){
    res.render('index')
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

// When filtered on available page, only animals of chosen breed will be shown. Loads to same page.
app.get('/available', function(req, res){
    let breed = req.query.pickBreed
    let petslistRaw = fs.readFileSync('animals.json')
    let petsList = JSON.parse(petslistRaw)
    if (breed) {
        petsList = petsList.filter(obj => obj.breed == breed)
    }
    let context = {"list": petsList, "title": breed};

    res.render('available', context)
})

// Learn More page that is reached by clicking on a Available Animal
app.get('/learnMore',function(req,res){
    var context = {}
    context.animalName=req.query.about
    res.render('learnMore', context)})

// Adopt Page used when user has selected animal through the Available Page flow
app.get('/adoptPageAnimalPicked', function (req,res) {
    var context = {}
    context.animalName = req.query.about;
    console.log(context.animalName)
    res.render('adoptPageAnimalPicked', context)
})

// After user has completed the adopt page, will go to successful page that is customized for animal adopted and first Name
app.post('/adoptPageAnimalPicked', function (req,res){
        var context = {}
        context.animalName = req.body.id;
        context.firstName = req.body.firstName
        res.render('successful', context)
    })

// Loads Adopt Page page
app.get('/adoptpage',function(req,res){
  res.render('adoptpage')
})

//Upon submitting adopt page, will go to successful page that is customized for animal adopted and first Name
app.post('/adoptpage', function (req,res){
    var context = {}
    context.animalName = req.body.animaladopting;
    context.firstName = req.body.firstName

    res.render('successful', context)
    })

// Loads About Us page
app.get('/aboutus',function(req,res){
    res.render('aboutus')})

//catch 404 and forward to error handler
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

//error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


