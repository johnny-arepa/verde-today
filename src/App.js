import React, { Component } from 'react';
import './App.css';
import Spinner from './Spinner';
import Calculator from './Calculator';
import svgRefresh from './img/refresh-icon.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      fetchInterval: null,
      isLoaded: false,
      upToDate: false,
      dolartoday: {
        timestamp: null,
        dol: {
          dolartoday: 0,
          bcv: 0,
          idv: 0
        },
        eur: {
          dolartoday: 0,
          bcv: 0,
          idv: 0
        }
      },
      factor: 1
    }
  }

  componentDidMount() {
    // If local storage data available load first
    if (JSON.parse(window.localStorage.getItem('dolartoday'))) {
      const dolartoday = JSON.parse(window.localStorage.getItem('dolartoday'));
      this.setState({ dolartoday, upToDate: false, isLoaded: true })
    }
    this.updateRates();
    // Fetch new data every 5 minutes
    this.setState({
      fetchInterval: setInterval(() => {
        this.updateRates();
      }, 300000)
    });
  }

  componentWillUnmount() {
    this.fetchInterval = null;
  }

  // Update rates
  updateRates = () => {
    let dolartoday = {}
    this.setState({ isLoaded: false })
    fetch('https://s3.amazonaws.com/dolartoday/data.json')
      .then(res => res.json())
      .then(data => {
        dolartoday = {
          timestamp: data._timestamp.fecha,
          dol: {
            dolartoday: data.USD.dolartoday,
            bcv: data.USD.sicad2,
            idv: 0
          },
          eur: {
            dolartoday: data.EUR.dolartoday,
            bcv: data.EUR.sicad2,
            idv: 0
          }
        }
        localStorage.setItem("dolartoday", JSON.stringify(dolartoday))
        this.setState({ dolartoday, upToDate: true, isLoaded: true })
      })
      .catch(err => {
        if (JSON.parse(window.localStorage.getItem('dolartoday'))) {
          dolartoday = JSON.parse(window.localStorage.getItem('dolartoday'))
          this.setState({
            dolartoday, upToDate: false,
            isLoaded: true
          })
        }
        console.log("ERROR: ", err.message);
      });
  }

  // Click Handler
  handleClick = () => {
    this.updateRates();
  }

  // Format Currency
  formatCur = (amount, countryCode) => amount.toLocaleString(countryCode, { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  // Calculator
  changeFactor = input => {
    // console.log(input)
    this.setState({ factor: +input })
  }

  render() {
    const timestamp = this.state.dolartoday.timestamp;
    const upToDate = this.state.upToDate;
    const factor = this.state.factor;
    const amountDol = this.formatCur(factor, 'us-US')
    const amountEur = this.formatCur(factor, 'de-DE')
    const dolDolartoday = this.formatCur(+this.state.dolartoday.dol.dolartoday * factor, 'de-DE');
    const eurDolartoday = this.formatCur(+this.state.dolartoday.eur.dolartoday * factor, 'de-DE');

    const dolBcv = this.formatCur(+this.state.dolartoday.dol.bcv * factor, 'de-DE');
    const eurBcv = this.formatCur(+this.state.dolartoday.eur.bcv * factor, 'de-DE');
    // const dolIdv = this.formatBol(this.state.dol.idv);
    // const eurIdv = this.formatBol(this.state.eur.idv);

    return (
      <div className="App">

        {/* Loading Spinner */}
        {!this.state.isLoaded && <Spinner />}

        {/* Header */}
        <header className="App-header">
          <div className="container-header">
            <h1> +++ Verde Today +++<span className="speed"></span></h1>
            <p className={upToDate ? 'online' : 'offline'}>
              {timestamp} </p>
            <button onClick={this.handleClick} className="refresh">
              <img src={svgRefresh} alt="refresh" />
            </button>
          </div>
        </header>
        <main className="App-main">

          {/* Rates Display Dolartoday */}
          <section className="section section-dollar">
            <div className="rate-source">Dolartoday</div>
            <div className="rates">
              <div className={`rates-container dolartoday ${this.state.upToDate ? ' updated' : ''} `}>
                <div className="rate foreign">{amountDol}&nbsp;$&nbsp;=</div>
                <div className="rate bolivar">{dolDolartoday}<span className="bss">&nbsp;Bs</span></div>
              </div>
              <div className="rates-container">
                <div className="rate foreign">{amountEur}&nbsp;€&nbsp;=</div>
                <div className="rate bolivar">{eurDolartoday}<span className="bss">&nbsp;Bs</span></div>
              </div>
            </div>
          </section>

          {/* Rates Display BCV */}
          <section className="section section-euro">
            <div className="rate-source">BCV</div>
            <div className="rates">
              <div className="rates-container">
                <div className="rate foreign">{amountDol}&nbsp;$&nbsp;=</div>
                <div className="rate bolivar">{dolBcv}<span className="bss">&nbsp;Bs</span></div>
              </div>
              <div className="rates-container">
                <div className="rate foreign">{amountEur}&nbsp;€&nbsp;=</div>
                <div className="rate bolivar">{eurBcv}<span className="bss">&nbsp;Bs</span></div>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <Calculator changeFactor={this.changeFactor} />

          {/* Linklist */}
          <ul className="links">
            <li>
              <a href="https://bit.ly/venezuela911" rel="noopener noreferrer" target="_blank">www.dolartoday.com</a>
            </li>
            <li>
              <a href="https://monitordolarvenezuela.com/" rel="noopener noreferrer" target="_blank">www.monitordolarvenezuela.com</a>
            </li>
            <li>
              <a href="http://www.bcv.org.ve/" rel="noopener noreferrer" target="_blank">www.bcv.org.ve</a>
            </li>

          </ul>
        </main>
      </div >
    );
  }
}

export default App;
