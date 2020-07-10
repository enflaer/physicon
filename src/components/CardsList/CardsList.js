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
      subjects: [],
      genres: [],
      grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      price: "rouble",
      currentGrade: "Все классы",
      currentSubject: "Все предметы",
      currentGenre: "Все жанры"
    };
    
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
          })
          this.setState({
            isLoaded: true,
            items: result.items,
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
          {
            this.state.items.map((value, idx) => (
              <Card key={idx}
                    image={'https://www.imumk.ru/svc/coursecover/' + value.courseId}
                    subject={value.subject}
                    grade={this.grades(value.grade)}
                    genre={value.genre}
                    more={value.shopUrl}
                    price={this.state.price === "rouble" ? value.price + " руб." : value.priceBonus + " бон."}
                    visibility={value.visibility}
              />
            ))
          }
        </div>
      );
    }
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    });
    
    switch (name) {
      case "currentSubject":
        if (value === "Все предметы") {
          this.state.items.filter((item) => {
            item.visibility = 'visible';
            if ((item.grade === this.state.currentGrade && this.state.currentGrade !== undefined) &&
              (item.genre === this.state.currentGenre && this.state.currentGenre !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        } else {
          this.state.items.filter((item) => {
            if (item.subject === value &&
              (item.genre === this.state.currentGenre && this.state.currentGenre !== undefined) &&
              (item.grade === this.state.currentGrade && this.state.currentGrade !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        }
        
        break;
      case "currentGenre":
        if (value === "Все жанры") {
          this.state.items.filter((item) => {
            item.visibility = 'visible';
            if ((item.subject === this.state.currentSubject && this.state.currentSubject !== undefined) &&
              (item.grade === this.state.currentGrade && this.state.currentGrade !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        } else {
          this.state.items.filter((item) => {
            if (item.genre === value &&
              (item.subject === this.state.currentSubject && this.state.currentSubject !== undefined) &&
              (item.grade === this.state.currentGrade && this.state.currentGrade !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        }
        break;
      case "currentGrade":
        if (value === "Все классы")  {
          this.state.items.filter((item) => {
            item.visibility = 'visible';
            if ((item.subject === this.state.currentSubject && this.state.currentSubject !== undefined) &&
              (item.genre === this.state.currentGenre && this.state.currentGenre !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        } else {
          this.state.items.filter((item) => {
            if (item.grade === value &&
              (item.subject === this.state.currentSubject && this.state.currentSubject !== undefined) &&
              (item.genre === this.state.currentGenre && this.state.currentGenre !== undefined)) {
              item.visibility = 'visible';
            } else {
              item.visibility = 'hidden';
            }
          });
        }
        break;
    }
  }
  
  handlePriceChange() {
    this.setState({
      price: this.state.price === "rouble" ? "bonus" : "rouble",
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
            <select name={"currentSubject"} value={this.state.value} onChange={this.handleInputChange}>
              <option value={"Все предметы"}>Все предметы</option>
              {
                this.state.subjects.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <select name={"currentGenre"} value={this.state.value} onChange={this.handleInputChange}>
              <option value={"Все жанры"}>Все жанры</option>
              {
                this.state.genres.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <select name={"currentGrade"} value={this.state.value} onChange={this.handleInputChange}>
              <option value={"Все классы"}>Все классы</option>
              {
                this.state.grades.map((value, idx) => (
                  <option key={idx} value={value}>{value}</option>
                ))
              }
            </select>
          </div>
          <div className="col-3">
            <input name={"search"} value={this.state.value} onChange={this.handleInputChange} />
          </div>
          <div className="col-3 mt-3">
            <button className={"btn btn--primary"} onClick={this.handlePriceChange}>
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
