import React from "react";
import slides from "../slides/slides.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      isInfinte: true
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
  }

  _handlPrevSlideClick(currentSlide) {
    let prevSlide = currentSlide;
    if (prevSlide !== 0 && prevSlide <= slides.length - 1) {
      prevSlide = currentSlide - 1;
    } else if (prevSlide === 0 && this.state.isInfinte) {
      prevSlide = slides.length - 1;
    } else {
      prevSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: prevSlide
    });
  }

  _handlNextSlideClick(currentSlide) {
    let nextSlide = currentSlide;
    if (nextSlide < slides.length - 1) {
      nextSlide = currentSlide + 1;
    } else if (nextSlide === slides.length - 1 && this.state.isInfinte) {
      nextSlide = 0;
    } else {
      nextSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: nextSlide
    });
  }

  _handleSlideIndicatorClick(evt) {
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === this.state.activeSlide) {
      return;
    }
    this.setState({
      activeSlide: id
    });
  }

  render() {
    return (
      <main className="container">
        <section className="slider">
          <h1>SLIDER</h1>
          {slides.map((Slide, index) => {
            return (
              <div key={index} className="slide">
                <Slide id={index} activeSlide={this.state.activeSlide}/>
              </div>
            );
          })}
          <div className="slider__buttons">
            <button className="slider__button slider__button-prev" onClick={() => this._handlPrevSlideClick(this.state.activeSlide)}>
              <svg className="slider__prev-icon" viewBox="0 0 20 20">
                <path fill="#ffffff" d="M8.388,10.049l4.76-4.873c0.303-0.31,0.297-0.804-0.012-1.105c-0.309-0.304-0.803-0.293-1.105,0.012L6.726,9.516c-0.303,0.31-0.296,0.805,0.012,1.105l5.433,5.307c0.152,0.148,0.35,0.223,0.547,0.223c0.203,0,0.406-0.08,0.559-0.236c0.303-0.309,0.295-0.803-0.012-1.104L8.388,10.049z"></path>
              </svg>
            </button>
            <button className="slider__button slider__button-next" onClick={() => this._handlNextSlideClick(this.state.activeSlide)}>
              <svg className="slider__next-icon" viewBox="0 0 20 20">
                <path fill="#ffffff" d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path>
              </svg>
            </button>
          </div>
          <div className="slider__indicators">
            {slides.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`slide__indicator ${index === this.state.activeSlide ? `slide__indicator--active` : ``}`}
                  id={index}
                  onClick={(evt) => this._handleSlideIndicatorClick(evt)}
                >
                  <div
                    className={`slide__indicator-inner ${index === this.state.activeSlide ? `slide__indicator-inner--active` : ``}`}
                    id={index}
                    onClick={(evt) => this._handleSlideIndicatorClick(evt)}
                  >
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}

export default React.memo(App);
