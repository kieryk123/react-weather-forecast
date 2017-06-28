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
      days: []
    };
  }

  componentWillMount() {
    let url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=Warsaw&cnt=14&units=metric&APPID=a5f75eaf1905f8b2375a0ba961f96e5e';

    fetch(url)
      .then((data) => data.json())
      .then((data) => {
        let tempArray = [];
        let daysArray = [];

        data.list.forEach((item) => {
          tempArray.push(item.temp.day);
          daysArray.push(item.dt);
        });

        this.setState({
          temps: tempArray,
          days: daysArray
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <table>
        <tbody>
          <Temp temp={this.state.temps} />
          <Day day={this.state.days} />
        </tbody>
      </table>
    )
  }
}

class Temp extends Component {
  render() {
    let temps = this.props.temp;

    temps = temps.map((value, index) => {
      value = value.toFixed(1);
      return (
        <td temp={value} key={index}>{value} *C</td>
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
