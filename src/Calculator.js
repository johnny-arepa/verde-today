import React, { Component } from 'react';
import './Calculator.css';

class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      input: "1"
    }
  }

  // Focus: marc all input content
  handleFocus = (event) => {
    event.target.select();
  }

  // Change
  handleChange = (event) => {
    // event.target.value.replace(/\D/,'')
    +event.target.value <= 10000000
      && +event.target.value + +this.state.input > 0
      && this.setState({ input: event.target.value },
        () => {
          this.props.changeFactor(this.state.input)
        })
  }

  // Focus out 
  handleBlur = (event) => {
    let value = event.target.value;
    if (value <= 0) value = 1;
    this.setState({ input: +  value },
      () => this.props.changeFactor(this.state.input))
  }

  // Increment 
  handleClick = (num) => {
    +this.state.input + num >= 1
      && +this.state.input + num <= 10000000
      && this.setState(st => ({ input: Math.floor(+st.input) + num }),
        () => this.props.changeFactor(this.state.input))
  }
  render() {
    return (
      <div className="Calculator">
        <label htmlFor="amount">Cantidad:</label>
        <input
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          type="number"
          // pattern="[0-9]*"
          name="amount"
          id="amount"
          value={this.state.input}
          min="1"
          max="100000"
        />
        <button
          onClick={() => this.handleClick(-1)}
          className="btn"
        >
          &minus;
        </button>
        <button
          onClick={() => this.handleClick(1)}
          className="btn">
          +
          </button>
      </div>
    )
  }
}

export default Calculator;