import React, {Component} from 'react';
import './App.scss';

import CardsList from '../CardsList/CardsList';


class App extends Component {
  render() {
    return (
      <div className="App">
        <main>
          <CardsList/>
        </main>
      </div>
    );
  }
}

export default App;
