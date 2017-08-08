const express 	= require('express')
const router 	= express.Router()
const ObjectId 	= require('mongodb').ObjectID

router.get('/', (req, res) => {
	db.collection('customers').find().toArray((err, result) => {
	    if(err)
			var errornya  = ("Error Selecting : %s ",err );   
		req.flash('msg_error', errornya);   
		res.render('customer/list',{title:"Customers",data:result});
	})
})

router.get('/add', (req, res) => {
	res.render(	'customer/add-customer', 
	{ 
		title: 'Add New Customer',
		name: '',
		email: '',
		phone:'',
		address:''
	})
})

router.post('/add', (req, res, next) => {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) 
	{
		v_name 		= req.sanitize( 'name' ).escape().trim(); 
		v_email 	= req.sanitize( 'email' ).escape().trim();
		v_address 	= req.sanitize( 'address' ).escape().trim();
		v_phone 	= req.sanitize( 'phone' ).escape();

		var customer = {
			name 	: v_name,
			address : v_address,
			email 	: v_email,
			phone 	: v_phone
		}

		db.collection('customers').save(customer, (err, result) => {
	    	if (err) return console.log(err)
	   		console.log('saved to database')
	    	res.redirect('/customers')
	  	})
	}
	else
	{
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}
})

router.post('/delete/(:id)', (req, res, next) => {
	db.collection('customers').remove({ "_id" : ObjectId(req.params.id) }).then(function(result) {
        if(!result)
		{
			var errors_detail  = ("Error Delete : %s ",err);
			req.flash('msg_error', errors_detail); 
			res.redirect('/customers');
		}
		else{
			req.flash('msg_info', 'Delete Customer Success'); 
			res.redirect('/customers');
		}
  	});
})

router.get('/edit/(:id)', (req,res,next) => {
	db.collection('customers').findOne({ "_id" : ObjectId(req.params.id) }).then(function(result) {
        if(!result)
        {
            req.flash('msg_error', "Customer can't be find!"); 
			res.redirect('/customers');
        }
        else
        {
        	res.render('customer/edit',{title:"Edit ",data:result});
        }
  	});
})

router.post('/edit/(:id)', (req,res,next) => {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) 
	{
		v_name 		= req.sanitize( 'name' ).escape().trim(); 
		v_email 	= req.sanitize( 'email' ).escape().trim();
		v_address 	= req.sanitize( 'address' ).escape().trim();
		v_phone 	= req.sanitize( 'phone' ).escape();

		var customer = {
			name: v_name,
			address: v_address,
			email: v_email,
			phone : v_phone
		}

		db.collection('customers').update({ "_id" : ObjectId(req.params.id) }, customer, (err, result) => {
			if(err)
			{
				var errors_detail  = ("Error Update : %s ",err );   
				req.flash('msg_error', errors_detail); 
				res.render('customer/edit', 
				{ 
					name 	: req.param('name'), 
					address : req.param('address'),
					email 	: req.param('email'),
					phone 	: req.param('phone'),
				});
			}
			else
			{
				req.flash('msg_info', 'Update customer success'); 
				res.redirect('/customers');
			}	

	  	})

	}
	else
	{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}
})

module.exports = router;