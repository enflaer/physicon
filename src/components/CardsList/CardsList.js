import React, {Component} from 'react';
import './CardsList.scss';
import Card from '../Card/Card';

class CardsList extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }
  
  componentDidMount() {
    
    const url = 'http://krapipl.imumk.ru:8082/api/mobilev1/update';
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items,
          });
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        },
      );
  }
  
  
  render() {
    
    function grades(el) {
      if (el.length > 2) {
        const splittedGrade = el.split(';');
        const gradeMin = Math.min(...splittedGrade);
        const gradeMax = Math.max(...splittedGrade);
        return gradeMin + ' - ' + gradeMax + ' классы';
      } else {
        return el + ' класс';
      }
    }
    
    if (this.state.error) {
      return <div>Ошибка: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return (
        <div className={'container'}>
          <div className={'row'}>
            <div>Загрузка...</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={'container'}>
          <div className={'row'}>
            {this.state.items.map((value, idx) => (
              <Card key={idx}
                    image={'https://www.imumk.ru/svc/coursecover/' + value.courseId}
                    subject={value.subject}
                    grade={grades(value.grade)}
                    genre={value.genre}
                    more={value.shopUrl}
                    price={value.price}/>
            ))}
          </div>
        </div>
      );
    }
  }
}

export default CardsList;
