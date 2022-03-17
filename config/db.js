if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: 'mongodb+srv://davy:<password>@blogapp.eojy2.mongodb.net/database?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}
