'use strict'
var mongoose = require('../db/index');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var id = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');

var articleCategoryList = [
  {
    _id: mongoose.Types.ObjectId('ce0cc9334ae8c66be6db982d'),
    title: 'root',
    uniqueKey: 'root',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 0,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: mongoose.Types.ObjectId('ce0cc9334ae8c66be6db982d'),
    sequence: 1,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce1cc9334ae8c66be6db982d'),
    title: 'logo design',
    uniqueKey: 'logo_design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 1,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce2cc9334ae8c66be6db982d'),
    title: 'industrial design',
    uniqueKey: 'industrial_design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 2,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce3cc9334ae8c66be6db982d'),
    title: 'graphic design',
    uniqueKey: 'graphic_design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 3,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce4cc9334ae8c66be6db982d'),
    title: 'web design',
    uniqueKey: 'web_design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 4,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce5cc9334ae8c66be6db982d'),
    title: 'photograph',
    uniqueKey: 'photograph',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 5,
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce6cc9334ae8c66be6db982d'),
    title: 'jottings',
    uniqueKey: 'jottings',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 1,
    tag: '',
    isBanned: false,
    isPrivate: false,
    isAdminOnly: true,
    articleCategory: 'root',
    sequence: 5,
    createdBy: id,
    updatedBy: id,
  },
];

var ArticleCategorySchema = new Schema({
  title: { type: String, required: true },
  uniqueKey: { type: String, required: true },
  author: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  type: { type: String },
  level: { type: Number },
  tag: { type: String },
  isBanned: { type: Boolean },
  isPrivate: { type: Boolean },
  isAdminOnly: { type: Boolean },
  articleCategory: { type: String, required: true },
  sequence: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: ObjectId, ref: 'Users' },
  updatedBy: { type: ObjectId, ref: 'Users' },
});
var ArticleCategorySchema = mongoose.model('ArticleCategories', ArticleCategorySchema);

exports.up = function(next) {
  ArticleCategorySchema.insertMany(articleCategoryList, function(error, docs) {});
  next();
};

exports.down = function(next) {
  ArticleCategorySchema.remove({}, function (err) {});
  next();
};