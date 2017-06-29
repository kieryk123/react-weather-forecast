import React, { Component } from 'react';
import Moment from 'react-moment';
import './App.css';

class App extends Component {
  render() {
    return <WeatherTable />
  }
}

export default App;

class WeatherTable extends Component {
  constructor() {
    super();
    this.state = {
      temps: [],
      days: [],
      descs: []
    };
  }

  componentWillMount() {
    this.update();
  }

  update(city = 'Warsaw') {
    let url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=14&units=metric&APPID=a5f75eaf1905f8b2375a0ba961f96e5e`;

    fetch(url)
      .then((data) => data.json())
      .then((data) => {
        let tempArray = [],
            daysArray = [],
            descArray = [],
            location = `${data.city.name}, ${data.city.country}`

        data.list.forEach((item) => {
          tempArray.push(item.temp.day);
          daysArray.push(item.dt);
          descArray.push(item.weather[0].description);
        });

        this.setState({
          temps: tempArray,
          days: daysArray,
          descs: descArray,
          location: location
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <h1>Weather forecast for: {this.state.location}</h1>
        <SearchForm onSearch={this.update.bind(this)} />
        <table>
          <thead></thead>
          <tbody>
            <Temp temp={this.state.temps} desc={this.state.descs} />
            <Day day={this.state.days} />
          </tbody>
        </table>
      </div>
    )
  }
}

class Temp extends Component {
  render() {
    // store array of descriptions in Temp props
    let desc = this.props.desc;

    let temps = this.props.temp;
    temps = temps.map((value, index) => {
      value = value.toFixed(1);
      return (
        <td temp={value} key={index}>{value} *C <br />
          <span value={desc[index]}>{desc[index]}</span>
        </td>
      )
    });

    return (
      <tr>{temps}</tr>
    )
  }
}

class Day extends Component {
  render() {
    let days = this.props.day;

    days = days.map((value, index) => {
      return (
        <td day={value} key={index}><Moment unix tz="Europe/Warsaw" format="ddd DD.MM">{value}</Moment></td>
      )
    });

    return (
      <tr>{days}</tr>
    )
  }
}

class SearchForm extends Component {
  handleSubmit(e) {
    e.preventDefault();

    let value = this.refs.cityName.value;
    this.props.onSearch(value);

    // clear input after submit
    this.refs.cityName.value = '';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input ref="cityName" type="text" required />
        <input type="submit" value="search" />
      </form>
    )
  }
}
