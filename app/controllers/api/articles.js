import models from '../../models/index';
import _ from 'lodash';

const index = async(ctx, _next) => {
  let {
    page,
    perPage,
    category,
  } = ctx.request.query;
  if (_.isUndefined(page) || page === '') {
    page = 1;
  }
  if (_.isUndefined(perPage) || perPage === '') {
    perPage = 15;
  }
  page = _.toNumber(page);
  perPage = _.toNumber(perPage);
  const currentUser = ctx.state.currentUser;
  let query;
  if (!_.isNull(currentUser) && currentUser.role == 'admin'){
    query = _.merge(query, {uniqueKey: {'$ne': 'root'}});
  }
  else{
    query = _.merge(query, { isBanned: false, isPrivate: false, $and:[{isAdminOnly: false}] });
  }
  console.log(category);
  if (category == 'all'){
    category = '';
  }
  if (category && category != ''){
    query =  _.merge(query, {articleCategory: category});
  }
  console.log('======');
  console.log(query);
  let code = 0;
  let data = [];
  let pages = 0;
  let select = ['title', 'uniqueKey', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'tag', 'isBanned', 'isPrivate', 'isAdminOnly', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'createdBy';
  let sort = { sequence: 1 };
  let res = await getArticles(query, select, sort, true, populate, page, perPage);
  // console.log('======');
  // console.log(res);
  data = res.data;
  pages = res.pages;
  ctx.body = { code, data, page, pages };
};

const show = async(ctx, _next) => {
  let {
    id,
  } = ctx.params;
  let query = {uniqueKey: id};
  let code = 0;
  let data = [];
  let select = ['title', 'uniqueKey', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'level', 'tag', 'isBanned', 'isPrivate', 'isAdminOnly', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'createdBy';
  let res = await getArticles(query, select, '', true, populate);
  let ObjectId = require('mongoose').Types.ObjectId;
  if (!res.data.length && ObjectId.isValid(id)){
    query = { _id: id};
    res = await getArticles(query, select, '', true, populate);
  }
  data = res.data;
  ctx.body = { code, data };
};

const create = async(ctx, _next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_ARTICLE = require('../../locales/' + ctx.session.locale + '/article');
  let LANG_GENERAL = require('../../locales/' + ctx.session.locale + '/general');
  const currentUser = ctx.state.currentUser;
  let mongoose = require('mongoose');
  let userId = mongoose.Types.ObjectId(currentUser.id);
  let {
    title,
    uniqueKey,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    isAdminOnly,
    articleCategory,
    sequence,
  } = ctx.state.articleParams;
  let data = {
    title,
    uniqueKey,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    isAdminOnly,
    articleCategory,
    sequence: _.toNumber(sequence),
    createdBy: userId,
  };
  console.log(1111);
  console.log(data);
  console.log(1111);
  let code = 0;
  let newUniqueKey = '';
  console.log(data);
  let msg = '';
  let isDuplicate = false;
  await models.Article.findOne({uniqueKey: uniqueKey}, (err, res) => {
    if (err) {
      code = 1;
      throw err;
    }
    if (!_.isNull(res)){
      isDuplicate = true;
    }
  });
  if (isDuplicate){
    code = 3;
    msg = LANG_ARTICLE['unique-key'] + LANG_GENERAL['space-en'] + LANG_MESSAGE['already-exist'];
  }
  else{
    await models.Article.create(data, (err, res) => {
      if (err) {
        code = 1;
        throw err;
      }
      console.log(res);
      newUniqueKey = res.uniqueKey;
      // saved!
    });
  }
  ctx.body = { code, uniqueKey: newUniqueKey, msg };
};

const update = async(ctx, _next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_ARTICLE = require('../../locales/' + ctx.session.locale + '/article');
  let LANG_GENERAL = require('../../locales/' + ctx.session.locale + '/general');
  const currentUser = ctx.state.currentUser;
  let mongoose = require('mongoose');
  let userId = mongoose.Types.ObjectId(currentUser.id);
  let {
    id,
    title,
    uniqueKey,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    isAdminOnly,
    articleCategory,
    sequence,
  } = ctx.state.articleParams;
  let data = {
    id,
    title,
    uniqueKey,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    isAdminOnly,
    articleCategory,
    sequence: _.toNumber(sequence),
    createdBy: userId,
  };
  let code = 0;
  let msg = '';
  let isDuplicate = false;
  await models.Article.findOne({uniqueKey: uniqueKey}, (err, res) => {
    if (err) {
      code = 1;
      throw err;
    }
    if (!_.isNull(res) && res._id != id){
      isDuplicate = true;
    }
  });
  if (isDuplicate){
    code = 3;
    msg = LANG_ARTICLE['unique-key'] + LANG_GENERAL['space-en'] + LANG_MESSAGE['already-exist'];
  }
  else{
  console.log(1111);
  console.log(data);
  console.log(1111);
    await models.Article.update({ uniqueKey: uniqueKey }, data, { multi: false }, (err, res) => {
      if (err) {
        console.log('errerrerrerrerr');
        console.log(err);
        console.log('errerrerrerrerr');
        code = 1;
        throw err;
      }
      console.log('resresresresres');
      console.log(res);
      console.log('resresresresres');
      // saved!
    });
  }
  ctx.body = { code, uniqueKey, msg };
};

const remove = async(ctx, _next) => {
  let code = 0;
  let id = ctx.params.id;
  console.log(id);
  await models.Article.findOneAndRemove({ _id: id }, (err, res) => {
    if (err) {
      console.log(err);
      code = 1;
      throw err;
    }
    console.log(res);
    // deleted!
  })
  ctx.body = { code, id };
}

const checkLogin = async(ctx, next) => {
  console.log(ctx.state.isUserSignIn);
  if (!ctx.state.isUserSignIn) {
    ctx.status = 302;
    ctx.redirect('/');
    return;
  }
  await next();
};

const checkArticleOwner = async(ctx, next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  const currentUser = ctx.state.currentUser;
  let id = ctx.params.id;
  let select = ['_id', 'createdBy'];
  let populate = 'createdBy';
  let query = { _id: id };
  let res = await getArticles(query, select, '', true, populate);
  if (res.data.length) {
    console.log(res.data[0]);
    if (res.data[0].createdBy['_id'].equals(currentUser.id)) {
      await next();
    } else {
      ctx.body = { code: 1, data: {}, msg: LANG_MESSAGE['error-on-unauthorized'] };
    }
  } else {
    ctx.body = { code: 1, data: {}, msg: LANG_MESSAGE['error-on-unauthorized'] };
  }
  return;
};

const checkParamsBody = async(ctx, next) => {
  const body = ctx.request.body;
  let {
    id,
    title,
    uniqueKey,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    isAdminOnly,
    articleCategory,
    sequence,
  } = body;
  if (title == '') {
    return false;
  }
  ctx.state.articleParams = {
    id: id,
    title: title,
    uniqueKey: uniqueKey,
    author: author,
    preface: preface,
    desc: desc,
    content: content,
    cover: cover,
    type: type,
    tag: tag,
    isBanned: isBanned,
    isPrivate: isPrivate,
    isAdminOnly: isAdminOnly,
    articleCategory: articleCategory,
    sequence: sequence,
  };
  await next();
};

const getArticles = async(query = '', select, sort = '', lean = true, populate = '', page = 0, perPage = 0) => {

  let data = [];
  let pages;
  let options = {
    select,
    sort,
    lean,
  };
  if (populate != '') {
    options['populate'] = populate;
  }
  if (page != 0) {
    options['page'] = page;
  }
  if (perPage != 0) {
    options['limit'] = perPage;
  }
  await models.Article.paginate(query, options).then((result) => {
    // console.log(result);
    if (result.docs.length) {
      data = result.docs;
      pages = result.pages;
    }
  });
  let result = {
    data,
    pages,
  }
  return result;
}

export default {
  index,
  show,
  create,
  update,
  remove,
  checkLogin,
  checkArticleOwner,
  checkParamsBody,
};
