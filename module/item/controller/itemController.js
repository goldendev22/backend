/*
Project : Cryptotrades
FileName : itemController.js
Author : LinkWell
File Created : 02/03/2023
CopyRights : LinkWell
Purpose : This is the file which used to define all item related api function.
*/

var items = require('../model/itemModel');
var slots = require('../model/slotModel');
const { validationResult } = require('express-validator');
var collections = require('./../../collection/model/collectionModel');
var users = require('./../../user/model/userModel');
var orders = require('../model/orderModel')

exports.getMaxTokenId = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var query = items.find();
    query = query.where('collection_id',req.body.collection_id);
    query = query.sort('-token_id');
    query = query.limit(1);
    var fields = ['token_id'];
    items.find(query, fields).then(function (result) {
        if(result.length == 0) {
            res.json({
                status: true,
                message: "Items retrieved successfully",
                data: 0
            });
        } else {
            res.json({
                status: true,
                message: "Items retrieved successfully",
                data: result[0].token_id
            });
        }
    }); 
}

/*********************************************************
* This is the function which used to add slot in database
**********************************************************/
exports.slotAdd = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var slot = new slots();
    slot.collection_id = req.body.collection;
    slot.image = req.body.slotImage;
    slot.slot_id = req.body.slotId;
    slot.slot_val = req.body.slot;

    slot.save(function (err ,slotObj) {
        if (err) {
            console.log(err)
            res.json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        } else {
            res.json({
                status: true,
                message: "slot created successfully",
                result: slotObj
            });
        }
    })
}

/*********************************************************
* This is the function which used to add item in database
**********************************************************/
exports.add = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var item = new items();
    item.collection_id = req.body.collection;
    item.current_owner = req.decoded.user_id;
    item.creator = req.decoded.user_id;
    item.detail = req.body.nft_detail;
    item.token_id = req.body.tokenId;
    item.lazy_minting = req.body.lazy_minting;
    item.status = "active";

    collections.findOne({_id:req.body.collection}, function (err, collection) {
        if (err || !collection) {
            res.json({
                status: false,
                message: "Collection not found",
                errors:err
            });
            return;
        }
        item.save(function (err ,itemObj) {
            if (err) {
                console.log(err)
                res.json({
                    status: false,
                    message: "Request failed",
                    errors:err
                });
                return;
            }
            collection.item_count = collection.item_count + 1;
            collection.save(function (err ,collectionObj) {
                res.json({
                    status: true,
                    message: "Item created successfully",
                    result: itemObj
                });
            });
        })
    });
}

/***********************************************************
* This is the function which used to list item in database
***********************************************************/
exports.list = function(req,res) {
    var keyword = req.body.searchName ? req.body.searchName : '';
    var limit = req.body.paginationLimit ? parseInt(req.body.paginationLimit) : 10;
    var offset = req.body.offset ? parseInt(req.body.offset) : 0;
    var collection = req.body.collection;
    var query = items.find();

    if ( keyword != '' ) {
        search = { $or: [ { 
            name :   {
                $regex: new RegExp(keyword, "ig")
        }  } , {
            description : {
                $regex : new RegExp ( keyword , "ig")
            }
        }] }
       query = query.or(search)
    } 
   
    query = query.where('collection_id',collection)
    query = query.where('status','active')
    query = query.sort('-create_date');

    var fields = ['token_id', 'current_owner', 'creator', 'detail', 'lazy_minting']
    users.findOne({account:req.body.owner}, function (err, user) {
        if (err || !collection) {
            res.json({
                status: false,
                message: "Collection not found",
                errors:err
            });
            return;
        }
        query = query.where('current_owner',user._id)
        items.find(query, fields, {skip: offset, limit: limit}).populate('collection_id').populate('current_owner').populate('creator').then(function (result) {
            res.json({
                status: true,
                message: "Items retrieved successfully",
                data: result
            });
        }); 
    });
}

/***********************************************************
* This is the function which used to get a item in database
***********************************************************/
exports.getItem = function(req,res) {
    var item_id = req.body.item_id;
    var query = items.find();
    query = query.where('_id', item_id)

    var fields = ['token_id', 'current_owner', 'creator', 'detail', 'lazy_minting']
    items.find(query, fields).populate('collection_id').populate('current_owner').populate('creator').then(function (result) {
        res.json({
            status: true,
            message: "Items retrieved successfully",
            data: result
        });
    }); 
}

/***************************************************************
* This is the function which used to add fractions in database
***************************************************************/
exports.addFractions = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    var fraction = new fractions();
    fraction.item_id = req.body.item_id;
    fraction.name = req.body.name;
    fraction.symbol = req.body.symbol;
    fraction.decimals = req.body.decimals;
    fraction.fractionCount = req.body.totalSupply;
    fraction.fractionPrice = req.body.price;
    fraction.fractionAddress = req.body.fractionAddress;
    fraction.paymentToken = req.body.paymentToken;
    fraction.type = req.body.type;
    fraction.chainId = req.body.chainId;

    if(fraction.type == 'auction'){
        fraction.fee = req.body.fee;
        fraction.days = req.body.days;
    }
    items.findOne({_id:req.body.item_id}, function (err, item) {
        if (err || !item) {
            res.json({
                status: false,
                message: "Item not found",
                errors:err
            });
            return;
        }
        fraction.collection_id = item.collection_id;
        fraction.save(function (err ,fractionObj) {
            if (err) {
                res.json({
                    status: false,
                    message: "Request failed",
                    errors:err
                });
                return;
            }
            item.frac_id = fractionObj._id;
            item.save(function (err ,itemObj) {
                if (err) {
                    console.log(err)
                    res.json({
                        status: false,
                        message: "Item not saved",
                        errors:err
                    });
                    return;
                }
                res.json({
                    status: true,
                    message: "fractionalized successfully",
                    result: fractionObj
                });
            });
        })
    })
}

/**************************************************************
* This is the function which used to list fractions of owner in database
**************************************************************/
exports.fractionList = function(req,res) {
    var chainId = req.body.chainId;
    var query = items.find();
    if(req.decoded.user_id != null) {
        query = query.where('current_owner',req.decoded.user_id)
        query = query.where('chainId',chainId)
        query = query.sort('-create_date');
    }

    var fields = ['token_id', 'cid']
    items.find(query, fields).populate('collection_id').populate('frac_id').then(function (result) {
        res.json({
            status: true,
            message: "fracs retrieved successfully",
            data: result
        });
    }); 
}

/*
* This is the function which used to list fractions in database
*/
exports.fractionMarketList = function(req,res) {
    var keyword = req.body.searchName ? req.body.searchName : '';
    var chainId = req.body.chainId;
    var paginationLimit = req.body.paginationLimit;
    var offset = req.body.offset;
    var orderField = req.body.orderField;
    var orderDirection = req.body.orderDirection;
    var query = items.find();
    if(orderDirection == 'desc')
        orderField = '-' + orderField;

    if ( keyword != '' ) {
        search = { $or: [ { 
            name :   {
                $regex: new RegExp(keyword, "ig")
        }  } , {
            description : {
                $regex : new RegExp ( keyword , "ig")
            }
        }] }
       query = query.or(search)
    } 

    query = query.where('chainId',chainId)
    query = query.sort('create_date');

    var fields = ['token_id', 'cid']
    items.find(query, fields,{skip: offset, limit: paginationLimit}).populate('collection_id').populate('frac_id').then(function (result) {
        res.json({
            status: true,
            message: "fracs retrieved successfully",
            data: result
        });
    }); 
}

/*
* This is the function which used to get frac of target item in database
*/
exports.fractionGet = function(req,res) {
    var itemId = req.body.target;
    var query = items.find();
    
    query = query.where('_id',itemId)

    var fields = ['token_id', 'cid']
    items.find(query, fields).populate('collection_id').populate('frac_id').then(function (result) {
        res.json({
            status: true,
            message: "frac retrieved successfully",
            data: result
        });
    }); 
}

/***************************************************************
* This is the function which used to add orders in database
***************************************************************/
exports.addOrders = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }  
    
    var order = new orders();
    order.typeOrder = req.body.typeOrder;
    order.baseToken = req.body.baseToken;
    order.baseTokenDecimal = req.body.baseTokenDecimal
    order.quoteToken = req.body.quoteToken;
    order.quoteTokenDecimal = req.body.quoteTokenDecimal
    order.baseAmount = req.body.baseAmount;
    order.quoteAmount = req.body.quoteAmount;
    order.owner = req.body.owner;
    order.orderId = req.body.orderId;
    order.price = req.body.price;
    order.chainId = req.body.chainId;
  
    order.save(function (err ,orderObj) {
        if (err) {
            res.json({
                status: false,
                message: "Request failed",
                errors:err
            });
            return;
        }
        
        res.json({
            status: true,
            message: "creating order successfully",
            result: orderObj
        });
    })
}

/***************************************************************
* This is the function which used to update orders in database
***************************************************************/
exports.updateOrders = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
  
    orders.findOne({orderId:req.body.orderId, chainId:req.body.chainId}, function (err, order) {
        if (err || !item) {
            res.json({
                status: false,
                message: "Item not found",
                errors:err
            });
            return;
        }

        order.typeOrder = req.body.typeOrder;
        order.baseAmount = req.body.baseAmount;
        order.quoteAmount = req.body.quoteAmount;
        order.owner = req.body.owner;
        order.price = req.body.price;

        order.save(function (err ,orderObj) {
            if (err) {
                res.json({
                    status: false,
                    message: "Request failed",
                    errors:err
                });
                return;
            }
            res.json({
                status: true,
                message: "update order successfully",
                result: orderObj
            });
        })
    })
}

/***************************************************************
* This is the function which used to add tradeorders in database
***************************************************************/
exports.tradeOrders = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }

    var trade = {};
    trade.baseAmount = req.body.baseAmount;
    trade.quoteAmount = req.body.quoteAmount;
    trade.fee = req.body.fee;
    trade.taker = req.body.account;
    trade.trade_date = new Date();

    orders.findOne({orderId:req.body.orderId, chainId:req.body.chainId}, function (err, order) {
        if (err || !item) {
            res.json({
                status: false,
                message: "Item not found",
                errors:err
            });
            return;
        }
        order.trades.push(trade)
        order.save(function (err ,orderObj) {
            if (err) {
                res.json({
                    status: false,
                    message: "Request failed",
                    errors:err
                });
                return;
            }
            res.json({
                status: true,
                message: "add tradeorder successfully",
                result: orderObj
            });
        })
    })
}

/***************************************************************
* This is the function which used to get orders list from database
***************************************************************/
exports.listOrders = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    var query = orders.find();

    query = query.where('baseToken',req.body.baseToken)
    query = query.where('quoteToken',req.body.quoteToken)
    query = query.sort('typeOrder')
    query = query.sort('-create_date')

    var bids = []
    var bid = {}
    var asks = []
    var ask = {}
    var trades = []
    var trade = {}
    var market = {}

    orders.find(query).then(function (results) {
        results.map(result=>{
            if(result.typeOrder == 'Sell')
            {
                ask['id'] = result.orderId
                ask['price'] = result.price
                ask['baseAmount'] = result.baseAmount
                ask['quoteAmount'] = result.quoteAmount
                ask['owner'] = owner

                result.trades.map(tradeObj=>{
                    trade['id'] = tradeObj.trade_date
                    trade['orderId'] = result.orderId
                    let w_market = {}
                    let w_baseCurrency = {}
                    let w_quoteCurrency = {}
                    w_baseCurrency['id'] = result.baseToken
                    w_quoteCurrency['id'] = result.quoteToken
                    w_market['baseCurrency'] = w_baseCurrency
                    w_market['quoteCurrency'] = w_quoteCurrency
                    trade['market'] = w_market
                    trade['side'] = result.typeOrder
                    trade['maker'] = result.owner
                    trade['taker'] = tradeObj.taker
                    trade['price'] = result.price
                    trade['baseAmount'] = tradeObj.baseAmount
                    trade['baseFeeAmount'] = tradeObj.baseAmount * tradeObj.fee / 100
                    trade['quoteAmount'] = tradeObj.quoteAmount
                    trade['quoteFeeAmount'] = 0
                    trade['timestamp'] = tradeObj.trade_date
                    trades.push(trade)
                })
                asks.push(ask)
            } else {
                bid['id'] = result.orderId
                bid['price'] = result.price
                bid['baseAmount'] = result.baseAmount
                bid['quoteAmount'] = result.quoteAmount
                bid['owner'] = owner

                result.trades.map(tradeObj=>{
                    trade['id'] = tradeObj.trade_date
                    trade['orderId'] = result.orderId
                    let w_market = {}
                    let w_baseCurrency = {}
                    let w_quoteCurrency = {}
                    w_baseCurrency['id'] = result.baseToken
                    w_quoteCurrency['id'] = result.quoteToken
                    w_market['baseCurrency'] = w_baseCurrency
                    w_market['quoteCurrency'] = w_quoteCurrency
                    trade['market'] = w_market
                    trade['side'] = result.typeOrder
                    trade['maker'] = result.owner
                    trade['taker'] = tradeObj.taker
                    trade['price'] = result.price
                    trade['baseAmount'] = tradeObj.baseAmount
                    trade['baseFeeAmount'] = 0
                    trade['quoteAmount'] = tradeObj.quoteAmount
                    trade['quoteFeeAmount'] = tradeObj.quoteAmount * tradeObj.fee / 100
                    trade['timestamp'] = tradeObj.trade_date
                    trades.push(trade)
                })
                bids.push(bid)
            }
        })
        market['asks'] = asks
        market['bids'] = bids
        market['trades'] = trades
        res.json({
            status: true,
            message: "fracs retrieved successfully",
            data: market
        });
    }); 
}

/***************************************************************
* This is the function which used to get min buy price from database
***************************************************************/
exports.minBuyPrice = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    var query = orders.find();

    query = query.where('baseToken',req.body.execToken)
    query = query.where('quoteToken',req.body.bookToken)
    query = query.where('typeOrder', 'Buy')
    query = query.sort('price')

    orders.find(query).then(function (results) {
        res.json({
            status: true,
            message: "buy price retrieved successfully",
            data: results[0].price
        });
    }); 
}

/***************************************************************
* This is the function which used to get max sell price from database
***************************************************************/
exports.maxSellPrice = function(req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            status: false,
            message: "Request failed",
            errors:errors.array()
        });
        return;
    }
    var query = orders.find();

    query = query.where('baseToken',req.body.bookToken)
    query = query.where('quoteToken',req.body.execToken)
    query = query.where('typeOrder', 'Sell')
    query = query.sort('-price')

    orders.find(query).then(function (results) {
        res.json({
            status: true,
            message: "sell price retrieved successfully",
            data: results[0].price
        });
    }); 
}