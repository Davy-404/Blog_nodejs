//const { Router } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eAdmin} = require('../helpers/eAdmin')

/*router.get('/',(req, res) => {
    res.render('admin/index')
});

/*router.get('/posts', (req, res) => {
    res.send('Pagina de posts')
});
*/
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
     }).catch((err) => {
         req.flash('error_msg', 'houve um erro ao listar as categorias')
         res.redirect('/admin')
     })
});

router.get('/categorias/add', eAdmin, (req, res) => {
    //res.send('add categorias')
    res.render('admin/addcategorias')
});

router.post('/categorias/nova', eAdmin, (req, res) => {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome invalido"})
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug invalido"})
    };
    /*if(!req.body.nome.length < 2){
        erros.push({texto: "nome da categoria é muito pequeno"})
    };*/
    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
       req.flash('success_msg', 'categoria criada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao salvar a categoria, tente novamente')
        res.redirect("/admin")
    })}
});

router.get('/categorias/edit/:id', eAdmin, (req, res) =>{
    //res.send("pagina de edição")
    Categoria.findOne({where: {id: req.params.id}}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'esta categoria não existe')
        res.redirect('/admin/categorias')
    })
});

router.post('/categorias/edit', eAdmin, (req, res) => {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome invalido"})
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug invalido"})
    };
    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else {

    Categoria.findOne({_id: req.body.id}).then((categoria) =>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() =>{
            req.flash('success_msg', 'categoria cadastrada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'hoouve um erro interno ao salvar a edição')
            res.redirect('/admin/categorias')
        })
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
    }
});

router.post('/categorias/deletar', eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'categoria excluida com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao excluir categoria')
        res.redirect('/admin/categorias')
    })
});

router.get('/postagens', eAdmin,(req, res) => {

    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens) =>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao listar postagem')
        res.redirect('/admin')
    })      
});

router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao carregar o formulario')
        res.render('/admin')
    })
})
router.post('/postagens/nova', eAdmin, (req, res) => {
    var erros = []
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "titulo invalido"})
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug invalido"})
    };
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "descrição invalida"})
    };
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "conteudo invalido"})
    };
    if(req.body.categoria == 0){
        erros.push({texto: 'categoria invalida, registre uma categoria'})
    }

    if (erros.length > 0){
        res.render('admin/addpostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'postagem criada com sucesso')
             res.redirect('/admin/postagens')
         }).catch((err) => {
             req.flash('error_msg', 'houve um erro ao salvar a postagem, tente novamente')
             res.redirect("/admin/postagens")
         })}
})

router.get('/postagens/edit/:id', eAdmin, (req, res) =>{
    
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {

            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})

        }).catch((err) => {
            req.flash('error_msg', 'houve um erro ao listar categorias')
            res.redirect('/admin/postagens')
        })
        
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao carregar o formulario')
        res.redirect('/admin/postagens')
    })
}) 

router.post('/postagem/edit', eAdmin, (req, res) => {

    var erros = []
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "titulo invalido"})
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug invalido"})
    };
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "descrição invalida"})
    };
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "conteudo invalido"})
    };
    if(req.body.categoria == 0){
        erros.push({texto: 'categoria invalida, registre uma categoria'})
    }

    if (erros.length > 0){
        res.render('admin/editpostagens', {erros: erros})
    }else{
        Postagem.findOne({_id: req.body.id}).then((postagem) => {

            postagem.titulo= req.body.titulo
            postagem.slug= req.body.slug
            postagem.descricao= req.body.descricao
            postagem.conteudo= req.body.conteudo
            postagem.categoria= req.body.categoria
            
            postagem.save().then(() => {
                req.flash('success_msg', 'edição salva com sucesso!')
                res.redirect('/admin/postagens')
            }).catch((err) => {
                req.flash('error_msg', 'houve um erro interno')
                res.redirect('/admin/postagens')    
            })
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'houve um erro ao salvar a edição')
            res.redirect('/admin/postagens')
        })

    }
})

router.get('/postagens/deletar/:id', eAdmin, (req, res) =>{
    Postagem.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro ao excluir categoria')
        res.redirect('/admin/postagens')
    })
})

module.exports = router;