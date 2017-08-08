const express 	= require('express')
const router 	= express.Router()
const ObjectId 	= require('mongodb').ObjectID
const table 	= 'category'
const uri 		= 'category'
const title 	= 'Category'	

router.get('/', (req, res) => {
	db.collection(table).find().toArray((err, result) => {
	    if(err)
	    {
			var errornya  = ("Error Selecting : %s ",err )   
	    }
		req.flash('msg_error', errornya)  
		res.render( uri + '/list',{ title : title, data : result } )
	})
})

router.get('/add', (req, res) => {
	res.render(	uri + '/add', 
	{ 
		title 		: 'Add New ' + title,
		name 		: '',
		description : '',
	})
})

router.post('/add', (req, res, next) => {
	req.assert('name', 'Please fill the name').notEmpty()
	var errors = req.validationErrors()
	if (!errors) 
	{
		v_name 			= req.sanitize('name').escape().trim()
		v_description 	= req.sanitize('description').escape().trim()

		var post_data = {
			name 		: v_name,
			description : v_description,
		}

		db.collection( table ).save(post_data, (err, result) => {
	    	if (err) return console.log(err)
	    	res.redirect('/' + uri)
	  	})
	}
	else
	{
		errors_detail = " <p> Sory there are error </p> <ul>"
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>' + error.msg + '</li>'
		} 
		errors_detail += "</ul>"

		req.flash('msg_error', errors_detail) 
		res.render( uri +  '/add', 
		{ 
			name 		: req.param('name'), 
			description : req.param('description')
		})
	}
})

router.post('/delete/(:id)', (req, res, next) => {
	var where = { '_id' : ObjectId( req.params.id ) }
	db.collection( table ).remove( where ).then(function(result) {
        if(!result)
		{
			var errors_detail  = ("Error Delete : %s ",err)
			req.flash('msg_error', errors_detail)
			res.redirect( '/' + uri)
		}
		else{
			req.flash('msg_info', 'Delete Data Success')
			res.redirect( '/' + uri)
		}
  	})
})

router.get('/edit/(:id)', (req,res,next) => {
	var where = { '_id' : ObjectId( req.params.id ) }
	db.collection( table ).findOne( where ).then(function(result) {
        if(!result)
        {
            req.flash('msg_error', "Data can't be find!"); 
			res.redirect('/' + uri);
        }
        else
        {
        	res.render( uri + '/edit', { title : "Edit " + title , data : result});
        }
  	})
})

router.post('/edit/(:id)', (req,res,next) => {
	var where = { '_id' : ObjectId( req.params.id ) }
	req.assert('name', 'Please fill the name').notEmpty()
	var errors = req.validationErrors();
	if (!errors) 
	{
		v_name 			= req.sanitize('name').escape().trim()
		v_description 	= req.sanitize('description').escape().trim()

		var post_data = {
			name 		: v_name,
			description : v_description,
		}

		db.collection( table ).update( where, post_data, (err, result) => {
			if(err)
			{
				var errors_detail  = ("Error Update : %s ",err )
				req.flash('msg_error', errors_detail)
				res.render( uri + '/edit', 
				{ 
					name 		: req.param('name'), 
					description : req.param('description'),
				});
			}
			else
			{
				req.flash('msg_info', 'Update data success'); 
				res.redirect('/' + uri);
			}	
	  	})
	}
	else
	{
		errors_detail = "<p> Sory there are error </p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>' + error.msg + '</li>'; 
		} 
		errors_detail += "</ul>" 
		req.flash('msg_error', errors_detail)
		res.render( uri + '/add', 
		{ 
			name 		: req.param('name'), 
			description	: req.param('description')
		})
	}
})

module.exports = router;