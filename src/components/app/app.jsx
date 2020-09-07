import React from "react";
// import PropTypes from "prop-types";
// import Arrows from "../arrows/arrows.jsx";
// // import slides from "../slides/slides.jsx";
// import SlideIndicators from "../slide-indicators/slide-indicators.jsx";
import Slider from "../slider/slider.jsx";
import Caption from "../caption/caption.jsx";
// import VideoPlayer from "../video-player/video-player.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
      isInfinte: true,
      caption: true,
      slides: [],
      slideToRight: true
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._setSlidesCount = this._setSlidesCount.bind(this);
  }

  _handlPrevSlideClick(currentSlide) {
    let prevSlide = currentSlide;
    if (prevSlide !== 0 && prevSlide <= this.state.slides.length - 1) {
      prevSlide = currentSlide - 1;
    } else if (prevSlide === 0 && this.state.isInfinte) {
      prevSlide = this.state.slides.length - 1;
    } else {
      prevSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: prevSlide,
      slideToRight: true
    });
  }

  _handlNextSlideClick(currentSlide) {
    let nextSlide = currentSlide;
    if (nextSlide < this.state.slides.length - 1) {
      nextSlide = currentSlide + 1;
    } else if (nextSlide === this.state.slides.length - 1 && this.state.isInfinte) {
      nextSlide = 0;
    } else {
      nextSlide = this.state.activeSlide;
    }

    this.setState({
      activeSlide: nextSlide,
      slideToRight: false
    });
  }

  _handleSlideIndicatorClick(evt) {
    const target = evt.target;
    const id = parseInt(target.id, 10);
    if (id === this.state.activeSlide) {
      return;
    }
    if (id > this.state.activeSlide) {
      this.setState({
        activeSlide: id,
        slideToRight: false
      });
    } else {
      this.setState({
        activeSlide: id,
        slideToRight: true
      });
    }
  }

  _setSlidesCount(data) {
    this.setState({
      slides: data
    });
  }

  render() {
    return (
      <main className="container">
        <section className="slider">
          <Slider
            caption={this.state.caption}
            activeSlide={ this.state.activeSlide}
            setSlidesCount={(data) => this._setSlidesCount(data)}
            onIndicatorDotClick={(evt) => this._handleSlideIndicatorClick(evt)}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            slideDirection={this.state.slideToRight}
          >
            <React.Fragment>
              <p className="slide__quote">
                &ldquo;My armor, it was never a distraction or a hobby, it was a cocoon. And now, I&apos;m a changed man. You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo; ―Tony Stark
              </p>
              <img src="https://media.comicbook.com/2020/02/iron-man-marvel-comics-1209184-1280x0.jpeg" alt="Iron Man"/>
              <Caption caption={this.state.caption}>
                  I am the Iron Man
              </Caption>
            </React.Fragment>
            <React.Fragment>
              <img src="https://townsquare.media/site/622/files/2017/03/captain-america-madbomb.jpg" alt="Iron Man"/>
              <div>
                CAPTAIN AMERICA
              </div>
              <Caption caption={this.state.caption}>
                Before we get started, does anyone want to get out?
              </Caption>
            </React.Fragment>
            <React.Fragment>
              <img src="https://pm1.narvii.com/6652/9b6208181e3272ba71d25a726bd669a20508dfaa_hq.jpg" alt="Iron Man"/>
              <Caption caption={this.state.caption}>
                Fortunately, I am mighty!
              </Caption>
            </React.Fragment>
            <React.Fragment>
              <div className="slide__text">
                <p>The Infinity Gauntlet is an American comic book storyline published by Marvel Comics.</p>
                <a href="https://www.marvel.com/comics/events/29/infinity_war">GO TO COMICS</a>
              </div>
              <img src="https://i.annihil.us/u/prod/marvel/i/mg/3/20/5261633bcd293.jpg" alt="Iron Man"/>

              <Caption caption={this.state.caption}>
                The Infinity Gauntlet
              </Caption>
            </React.Fragment>
            {/* <React.Fragment>

              <Caption caption={this.state.caption}>
                Avenger: Infinity War
              </Caption>
            </React.Fragment> */}
          </Slider>
        </section>
      </main>
    );
  }
}

App.propTypes = {
};

export default App;
