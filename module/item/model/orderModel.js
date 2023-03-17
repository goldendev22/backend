/*
Project : Cryptotrades
FileName :  orderModel.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to define offer schema that will store and reterive item offer information.
*/

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../../../helper/config')
const Schema = mongoose.Schema;

var orderSchema = mongoose.Schema({
    baseToken: { 
        type: String,
        default: '' 
    },
    baseTokenDecimal: {
        type: Number,
        default: 6
    },
    quoteToken: {
        type: String,
        default: ''
    },
    quoteTokenDecimal: {
        type: Number,
        default: 18
    },
    baseAmount: {
        type: Number,
        default: 0
    },
    quoteAmount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    owner: {
        type: String,
        default: ''
    },
    orderId: {
        type: String,
        default : ''
    },
    typeOrder: {
        type: String,
        default: 'Sell'
    },
    chainId: { 
        type: Number, 
        default: 0xfa2
    },
    trades: {
        type: Array,
        default: []
    }
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('order', orderSchema,config.db.prefix+'order');