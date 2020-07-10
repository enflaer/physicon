import React, {Component} from 'react';
import './Card.scss';

class Card extends Component {
  
  render() {
    return (
      <div className={['col-auto', this.props.visibility].join(" ")}>
        <div className={'card'}>
          <img className={'card__image'} src={this.props.image} alt="" />
          <div className={'card-body'}>
            <div className={'card-body__subject'}>{this.props.subject}</div>
            <div className={'card-body__grade'}>{this.props.grade}</div>
            <div className={'card-body__genre'}>{this.props.genre}</div>
            <a href={this.props.more} className={'link card-body__more'}>Подробнее</a>
            <a href={this.props.more} className={'btn btn--primary card-body__price'}>{this.props.price}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
