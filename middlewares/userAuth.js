module.exports=((req,res,next)=>{
    if(req.session.userVerify){
       
        res.redirect('/')
    }else{
        next()
    }
})