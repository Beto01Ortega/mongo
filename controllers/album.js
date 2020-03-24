'use strict'
var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!album) {
                res.status(404).send({message: 'No  existe album'});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar album'});
        } else {
            if (!albumStored) {
                res.status(404).send({message: 'No se ha guardado'});
            } else {
                res.status(200).send({album: albumStored});
            }
        }


    });
}
function getAlbums(req, res){
    var artistId = req.params.artist;

    if (!artistId) {
        //Sacar todos los abums de la base de datos
        var find = Album.find({}).sort('title');
    } else {
        //sacar los albums de un artista en especifico 
        var find = Album.find({artist : artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) =>{
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albums) {
                res.status(404).send({message: 'No hay albums'});
            } else {
                res.status(500).send({albums});
            }
        }

    });
}
function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albumUpdated) {
                res.status(404).send({message: 'No se pudo actualizar'});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}
function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({message: 'error al eliminar album'});
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: 'el album de este artista no ha sido eliminado'});
            } else {
                Song.find({album: albumRemoved._id}).deleteMany((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({message: 'error al eliminar canción'});
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: 'la canción no ha sido eliminada'});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}
function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if (file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif' || file_ext == 'jpg') {
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if (!albumUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar'});
                }else {
                    res.status(200).send({album: albumUpdated});
                }
            });
        } else {
            res.status(404).send({message: 'Extensión invalida'});
        }
    } else {
        res.status(404).send({message: 'No ha subido imagen'});
    }
}
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({message: 'No existe la imagen'});
        }

    });
}
module.exports = {
    getAlbum, 
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum, 
    uploadImage,
    getImageFile
}