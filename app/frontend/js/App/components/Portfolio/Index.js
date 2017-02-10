import React, { Component } from 'react';
import _ from 'lodash';
import Utils from '../../../common/Utils';

class Portfolio extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  closeSlideModal() {
    $('.slide-modal').removeClass('visible');
  }

  render() {
    let {
      locale,
      list,
    } = this.props;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
    let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');
    let listHtml;
    if (list.length){
      listHtml = list.map((item, key) => {
        return (
          <div title={item.title}>
            <img src={item.cover} />
          </div>
        );
      });
    }
    return(
      <div className="slide-modal-content">
        <div className="close" onClick={this.closeSlideModal.bind(this)}><span className="icon icon-highlight-off"></span></div>
        {listHtml}
      </div>
    );
  }
}

Portfolio.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Portfolio.propTypes = {
  locale: React.PropTypes.string.isRequired,
  changeCaptcha: React.PropTypes.func.isRequired,
}

export default Portfolio;