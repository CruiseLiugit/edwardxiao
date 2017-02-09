import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchArticleCategoryList,
  setArticleCategoryList,
  setIsNotFound,
} from '../../actions/index';

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/index';
import Nav from '../../components/Nav/index';
import Footer from '../../components/Footer/index';
import NotFound from '../NotFound';
import '../../../../css/articles.css';
import ArticleCategoryItem from './components/ArticleCategoryItem';

class ArticleCategoryList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    this.props.fetchArticleCategoryList(this.props.articleCategoryListCurrentPage + 1);
    if (!_.isNull(this.props.articleCategoryList)){
      this.setState({isLoading: false});
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isNull(prevProps.articleCategoryList) && !_.isNull(this.props.articleCategoryList)){
      this.setState({isLoading: false});
    }
    // if (!_.isNull(prevProps.articleCategoryList)){
    //   if (prevProps.articleCategoryList != this.props.articleCategoryList){
    //     this.props.fetchArticleCategoryList(this.props.articleCategoryListCurrentPage + 1);
    //   }
    // }
  }

  go(url) {
    this.context.router.push(url);
  }

  remove(id) {
    Utils.initSpin('spin-loader');
    this.removeApi(id).then((res) => {
      console.log(res);
      if (res.code === 0){
        let newArticleCategoryList = [];
        this.props.articleCategoryList.map((item, key) => {
          if (item.id != res.id){
            newArticleCategoryList.push(item);
          }
        });
        this.props.setArticleCategoryList(newArticleCategoryList);
        Utils.stopSpin('spin-loader');
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
    });
  }

  removeApi(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/article_categories/' + id,
        type: 'delete',
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  fetchArticleCategoryList(nextPage) {
    this.props.fetchArticleCategoryList(nextPage);
  }

  render() {
    let content;
    let {
      locale,
      isNotFound,
      articleCategoryList,
      userInfo,
    } = this.props;
    let {
      isLoading
    } = this.state;
    if (isNotFound){
      content = (<NotFound />);
    }
    else{
      let LANG_USER = require('../../../../../locales/' + locale + '/user');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let articleCategoryListHtml;
      let newArticleCategoryButton;
      if (!isLoading){
        if (!_.isNull(userInfo) && userInfo.role == 'admin'){
          newArticleCategoryButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/article_categories/new')}>{LANG_ACTION['add']}{LANG_ARTICLE['article-category']}</div>
          );
        }
        if (articleCategoryList.length){
          articleCategoryListHtml = articleCategoryList.map((item, key) => {
            return (
              <ArticleCategoryItem
                locale={locale}
                id={item.id}
                title={item.title}
                author={item.author}
                preface={item.preface}
                desc={item.desc}
                content={item.content}
                cover={item.cover}
                type={item.type}
                level={item.level}
                isShow={item.isShow}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                createdBy={item.createdBy}
                updatedBy={item.updatedBy}
                go={this.go.bind(this)}
                remove={this.remove.bind(this)}
                userInfo={userInfo}
              />
            );
          });
        }
      }
      let backUrl = this.state.backUrl;
      content = (
        <div className="page-content background-white">
          <MobileNav isIndex={false} activeTab=""/>
          <Nav isIndex={false} activeTab=""/>
          <div className="core-content background-white">
            <div className="core">
              <div className="my-button my-button--red mgr-10" onClick={this.go.bind(this, '/articles')}>{LANG_NAV['back']}</div>
              {newArticleCategoryButton}
              {articleCategoryListHtml}
              <div className="push"></div>
            </div>
          </div>
          <Footer/>
        </div>
      );
    }
    return(
      <div className="page">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    articleCategoryList,
    isNotFound,
    userInfo,
    articleCategoryListCurrentPage,
    articleCategoryListTotalPage,
  } = state;
  return {
    locale,
    articleCategoryList,
    isNotFound,
    userInfo,
    articleCategoryListCurrentPage,
    articleCategoryListTotalPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleCategoryList: (nextPage) => {
      dispatch(fetchArticleCategoryList(nextPage));
    },
    setArticleCategoryList: (articleCategoryList) => {
      dispatch(setArticleCategoryList(articleCategoryList));
    },
  };
}

ArticleCategoryList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ArticleCategoryList.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  articleCategoryListCurrentPage: React.PropTypes.number.isRequired,
  articleCategoryListTotalPage: React.PropTypes.number.isRequired,
  articleCategoryList: React.PropTypes.array.isRequired,
  fetchArticleCategoryList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
  setArticleCategoryList: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoryList);