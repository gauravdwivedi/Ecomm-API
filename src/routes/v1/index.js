const express = require('express');
const router= express.Router();

const menu = require('./menu');
const video = require('./video');
const comment = require('./comment');
const users = require('./users');
const reviews = require('./reviews');
const product = require('./product');
const common = require('./common');
const sitemap = require('./sitemap');
const userAuth = require('./userAuth');
const category = require('./category');
const cart = require('./cart');
const orders = require('./orders');

router.use('/auth', userAuth);
router.use('/menu', menu);
router.use('/video', video);
router.use('/comment', comment);
router.use('/cart', cart);
router.use('/users', users);
router.use('/reviews', reviews);
router.use('/product', product);
router.use('/category', category);
router.use('/common', common);
router.use('/sitemap', sitemap);
router.use('/orders', orders);
router.use('/liveSessions', require("./liveSessions"));
// router.use('/productMenu', require("./productMenus"));
router.use('/config', require("./config"));
router.use('/upload', require("./upload"));
router.use('/banners',require("./banner"));

module.exports= router;