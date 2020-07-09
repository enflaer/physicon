// vendors
import 'babel-polyfill';
// import $ from 'jquery';
// classes
// import {ImgLazy} from './ImgLazy';
// components


document.addEventListener('DOMContentLoaded', () => {
  const url = 'http://krapipl.imumk.ru:8082/api/mobilev1/update';
  let jsonData;

  // eslint-disable-next-line require-jsdoc
  async function postData(url = '') {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',

      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  postData(url)
      .then((data) => {
        jsonData = data;
        console.log(jsonData);
      }).then(() => {
        const cardsListRow = document.querySelector('.cards-list-row');
        jsonData.items.forEach((item, index) => {
          const grade = jsonData.items[index].grade;
          // eslint-disable-next-line require-jsdoc
          function grades() {
            if (grade.length > 2) {
              const splittedGrade = grade.split(';');
              const gradeMin = Math.min(...splittedGrade);
              const gradeMax = Math.max(...splittedGrade);
              return gradeMin + ' - ' + gradeMax + ' классы';
            } else {
              return grade + ' класс';
            }
          }

          const cardTemplate = '<div class="col-auto">' +
        '<div class="card">' +
          '<img class="card__image" src="https://www.imumk.ru/svc/coursecover/'+jsonData.items[index].courseId+'" alt="" />' +
          '<div class="card-body">' +
            '<div class="card-body__subject">' + jsonData.items[index].subject + '</div>' +
            '<div class="card-body__grade">' + grades() + '</div>' +
            '<div class="card-body__genre">' + jsonData.items[index].genre + '</div>' +
            '<a href="'+jsonData.items[index].shopUrl+'" class="link card-body__more">Подробнее</a>' +
            '<a href="'+jsonData.items[index].shopUrl+'" class="btn btn--primary card-body__price">' + jsonData.items[index].price + ' руб.</a>' +
          '</div>' +
          '</div>' +
        '</div>';

          cardsListRow.insertAdjacentHTML('afterbegin', cardTemplate);
        });
      });

  // lazy loading images
  // new ImgLazy([]).lazyInit();
});

