if(process.env.NODE_env == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://davy:gokussj@blogapp.eojy2.mongodb.net/blogApp?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}