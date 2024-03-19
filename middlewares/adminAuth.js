module.exports=((req,res,next)=>{
    if(req.session.logged){
        next()
    }else{
        res.redirect('/adminLogin')
    }
})