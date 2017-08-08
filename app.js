const path 				     = require('path')
const express 			   = require('express')
const flash 			     = require('express-flash')
const session 			   = require('express-session')
const expressValidator = require('express-validator')
const bodyParser 		   = require('body-parser')
const app 				     = express()
const MongoClient 		 = require('mongodb').MongoClient
const methodOverride   = require('method-override')
const customers        = require('./routes/customers')
const dashboard        = require('./routes/dashboard')
const category         = require('./routes/category')
const item 		         = require('./routes/item')

app.use(session({secret:"pass4fandi"}))
app.use(flash())
app.use(expressValidator())

app.use(methodOverride(function(req, res){
 	if (req.body && typeof req.body == 'object' && '_method' in req.body) 
  	{ 
      	var method = req.body._method;
      	delete req.body._method;
      	return method;
    } 
 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', dashboard)
app.use('/customers', customers)
app.use('/category', category)
app.use('/item', item)

var database
MongoClient.connect('mongodb://localhost:27017/dbtest', (err, database) => {	
	if (err) return console.log(err)
	db = database
	app.listen(4000, () => {
	    console.log('listening on 3000')
	})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


	
