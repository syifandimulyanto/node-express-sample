const express 	= require('express')
const router 	= express.Router()
const ObjectId 	= require('mongodb').ObjectID

router.get('/', (req, res) => {
	res.render('dashboard');
})


module.exports = router;