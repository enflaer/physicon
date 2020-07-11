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
      renderItems: [],
      subjects: [],
      genres: [],
      grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      price: 'rouble',
      currentGrade: 'Все классы',
      currentSubject: 'Все предметы',
      currentGenre: 'Все жанры',
    };
    
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
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
          (result.items).forEach((el) => {
            Object.assign(el, [{visibility: 'visible'}]);
          });
          this.setState({
            isLoaded: true,
            items: result.items,
            renderItems: result.items,
          });
          this.itemsUniqValues();
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        },
      );
  }
  
  itemsUniqValues() {
    let genresInitial = [],
      subjectsInitial = [],
      genresFiltered,
      subjectsFiltered;
    
    this.state.items.map((value, idx) => {
      genresInitial.push(value.genre);
      subjectsInitial.push(value.subject);
    });
    genresFiltered = Array.from(new Set(genresInitial));
    subjectsFiltered = Array.from(new Set(subjectsInitial));
    this.setState({
      genres: genresFiltered,
      subjects: subjectsFiltered,
    });
  }
  
  grades(el) {
    if (el.length > 2) {
      const splittedGrade = el.split(';');
      const gradeMin = Math.min(...splittedGrade);
      const gradeMax = Math.max(...splittedGrade);
      return gradeMin + ' - ' + gradeMax + ' классы';
    } else {
      return el + ' класс';
    }
  }
  
  renderNothing() {
    return (
      <div className={'row'}>
        <h2 className={'col-12 d-flex'}>
          Результаты поиска:
        </h2>
        <div className={'col-12 d-flex justify-content-center mt-3'}>
          <span>Результатов нет</span>
        </div>
      </div>);
  }
  
  renderCards() {
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
        <div className={'row'}>
          <h2 className={'col-12 d-flex mb-5'}>
            Результаты поиска:
          </h2>
          {
            this.state.renderItems.map((value, idx) => (
              <Card key={idx}
                    image={'https://www.imumk.ru/svc/coursecover/' + value.courseId}
                    subject={value.subject}
                    grade={this.grades(value.grade)}
                    genre={value.genre}
                    more={value.shopUrl}
                    price={this.state.price === 'rouble' ? value.price + ' руб.' : value.priceBonus + ' бон.'}
                    visibility={value.visibility}
              />
            ))
          }
        </div>
      );
    }
  }
  
  handleSearchInput(event) {
    const target = event.target;
    const value = target.value;
  
    this.setState({
      renderItems: this.state.items.filter((item) => {
        return (
          item.genre.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.subject.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.grade.toLowerCase().indexOf(value) >= 0
        );
      }),
    });
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({
      [name]: value,
    });
    
    switch (name) {
      case 'currentSubject':
        
        this.state.items.filter((item) => {
          if (item.subject === value &&
            item.genre === this.state.currentGenre &&
            item.grade.indexOf(this.state.currentGrade) >= 0) {
            
            item.visibility = 'visible';
            
          } else if (item.subject === value &&
            this.state.currentGenre === 'Все жанры' &&
            item.grade.indexOf(this.state.currentGrade) >= 0) {
            
            item.visibility = 'visible';
            
          } else if (item.subject === value &&
            item.genre === this.state.currentGenre &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (item.subject === value &&
            this.state.currentGenre === 'Все жанры' &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все предметы' &&
            this.state.currentGenre === 'Все жанры' &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все предметы' &&
            item.genre === this.state.currentGenre &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все предметы' &&
            item.grade === this.state.currentGrade &&
            this.state.currentGenre === 'Все жанры') {
            
            item.visibility = 'visible';
            
          } else {
            item.visibility = 'hidden';
          }
        });
        
        break;
      case 'currentGenre':
        this.state.items.filter((item) => {
          if (item.genre === value &&
            item.subject === this.state.currentSubject &&
            item.grade.indexOf(this.state.currentGrade) >= 0) {
            
            item.visibility = 'visible';
            
          } else if (item.genre === value &&
            this.state.currentSubject === 'Все предметы' &&
            item.grade.indexOf(this.state.currentGrade) >= 0) {
            
            item.visibility = 'visible';
            
          } else if (item.genre === value &&
            item.subject === this.state.currentSubject &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (item.genre === value &&
            this.state.currentSubject === 'Все предметы' &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все жанры' &&
            this.state.currentSubject === 'Все предметы' &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все жанры' &&
            this.state.currentSubject === 'Все предметы' &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все жанры' &&
            item.grade.indexOf(this.state.currentGrade) >= 0 &&
            this.state.currentSubject === 'Все предметы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все жанры' &&
            item.subject === this.state.currentSubject &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else {
            item.visibility = 'hidden';
          }
        });
        break;
      case 'currentGrade':
        this.state.items.filter((item) => {
          if (item.grade.indexOf(value) >= 0 &&
            item.subject === this.state.currentSubject &&
            item.genre === this.state.currentGenre) {
            
            item.visibility = 'visible';
            
          } else if (item.grade.indexOf(value) >= 0 &&
            this.state.currentSubject === 'Все предметы' &&
            item.genre === this.state.currentGenre) {
            
            item.visibility = 'visible';
            
          } else if (item.grade.indexOf(value) >= 0 &&
            item.subject === this.state.currentSubject &&
            this.state.currentGrade === 'Все классы') {
            
            item.visibility = 'visible';
            
          } else if (item.grade.indexOf(value) >= 0 &&
            this.state.currentSubject === 'Все предметы' &&
            this.state.currentGenre === 'Все жанры') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все классы' &&
            item.genre === this.state.currentGenre &&
            this.state.currentSubject === 'Все предметы') {
            
            item.visibility = 'visible';
            
          } else if (value === 'Все классы' &&
            item.subject === this.state.currentSubject &&
            this.state.currentGenre === 'Все жанры') {
            
            item.visibility = 'visible';
            
          } else {
            item.visibility = 'hidden';
          }
        });
        break;
    }
  }
  
  handlePriceChange() {
    this.setState({
      price: this.state.price === 'rouble' ? 'bonus' : 'rouble',
    });
  }
  
  render() {
    return (
      <div className={'container'}>
        <div className={'row'}>
          <div className="col-12 d-flex justify-content-center">
            <h1>Витрина</h1>
          </div>
        </div>
        <div className={'row inputs-row'}>
          <div className="col-3">
            <select name={'currentSubject'} value={this.state.value} onChange={this.handleInputChange}>
              <option value={'Все предметы'}>Все предметы</option>
              {
                this.state.subjects.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <select name={'currentGenre'} value={this.state.value} onChange={this.handleInputChange}>
              <option value={'Все жанры'}>Все жанры</option>
              {
                this.state.genres.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <select name={'currentGrade'} value={this.state.value} onChange={this.handleInputChange}>
              <option value={'Все классы'}>Все классы</option>
              {
                this.state.grades.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <input name={'search'} placeholder={'Поиск'} value={this.state.value} onChange={this.handleSearchInput}/>
          </div>
          <div className="col-3 mt-3">
            <button className={'btn btn--primary'} onClick={this.handlePriceChange}>
              рубли/бонусы
            </button>
          </div>
        
        </div>
        {this.renderCards()}
      </div>
    );
  }
}

export default CardsList;
