/*
Project : Cryptotrades
FileName : itemModel.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to define collection schema that will communicate and process collection information with mongodb through mongoose ODM.
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('./../../../helper/config')
const Schema = mongoose.Schema;
// Setup schema

var itemSchema = mongoose.Schema({
    has_offer: {
        type: Boolean,
        default: false
    },
    view_count: {
        type: Number,
        default:0
    },
    like_count: {
        type: Number,
        default:0
    },
    price: {
        type: Number,
        default:0
    },
    token_id:{
        type: Number,
        default:0
    },
    collection_id: { type: Schema.Types.ObjectId, ref: 'collection' },
    current_owner: { 
        type: Schema.Types.ObjectId, ref: 'users'
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'users'
    },
    lazy_minting: {
        type: Boolean,
        default: false
    },
    detail: {
        type: String
    },
    status:{
        type: String,
        enum : ['active','inactive'],
        default: 'inactive'
    },
    minted_date: {
        type: Date,
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

//itemSchema.plugin(uniqueValidator);
itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('item', itemSchema,config.db.prefix+'item');