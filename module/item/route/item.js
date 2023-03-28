/*
Project : Cryptotrades
FileName : item.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to define all route releated to collecion api request.
*/

var express = require('express')
var router = express.Router();
var itemController = require("./../controller/itemController")
var auth = require("./../../../middleware/auth");
var adminauth = require("./../../../middleware/adminauth");
var optionalauth = require("./../../../middleware/optionalauth");
const { check } = require('express-validator');

router.post('/getMaxId', [check('collection_id').not().isEmpty(), auth], itemController.getMaxTokenId)
router.post('/slotAdd',[check('collection').not().isEmpty(),auth],itemController.slotAdd)
router.post('/add',[check('collection').not().isEmpty(),auth],itemController.add)
router.post('/list',[check('collection').not().isEmpty(), auth],itemController.list)
router.post('/getItem',[check('item_id').not().isEmpty(),auth],itemController.getItem)
router.post('/marketListItem',[check('item_id').not().isEmpty(),auth],itemController.marketListItem)
router.post('/fractionList',[check('chainId').not().isEmpty(),auth],itemController.fractionList)
router.post('/fractionMarketList',[check('chainId').not().isEmpty()],itemController.fractionMarketList)
router.post('/fractionGet',[check('chainId').not().isEmpty()],itemController.fractionGet)
router.post('/createOrder',[check('chainId').not().isEmpty()],itemController.addOrders)
router.post('/updateOrder',[check('chainId').not().isEmpty(),check('orderId').not().isEmpty()],itemController.updateOrders)
router.post('/tradeOrder',[check('orderId').not().isEmpty(),check('account').not().isEmpty()],itemController.tradeOrders)
router.post('/listOrder',[check('baseToken').not().isEmpty(),check('quoteToken').not().isEmpty()],itemController.listOrders)
router.post('/listBuyPrices', [check('bookToken').not().isEmpty(),check('execToken').not().isEmpty()], itemController.minBuyPrice)
router.post('/listSellPrices', [check('bookToken').not().isEmpty(),check('execToken').not().isEmpty()], itemController.maxSellPrice)

module.exports = router