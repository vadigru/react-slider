import React from "react";
import PropTypes from "prop-types";
import Slider from "../slider/slider.jsx";
import Caption from "../caption/caption.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: this.props.slidesToShow,
      isInfinite: this.props.isInfinite,
      isCaption: this.props.isCaption,
      slides: [],
      // moveToRight: true,
      slidePosition: 100,
      slidesToShow: this.props.slidesToShow,
      slideAnim: ``
    };

    this._handlPrevSlideClick = this._handlPrevSlideClick.bind(this);
    this._handlNextSlideClick = this._handlNextSlideClick.bind(this);
    this._handleSlideIndicatorClick = this._handleSlideIndicatorClick.bind(this);
    this._setSlides = this._setSlides.bind(this);
    this._setSlideAnim = this._setSlideAnim.bind(this);
  }

  _handlPrevSlideClick(slide) {
    let currentSlide = slide;
    let position = this.state.slidePosition;

    if (currentSlide === this.state.slidesToShow && this.state.isInfinite) {
      currentSlide = (this.state.slides.length - 1 - this.state.slidesToShow);
      position = ((this.state.slides.length - 1) - this.state.slidesToShow) * 100 / this.state.slidesToShow;
    } else if (currentSlide > this.state.slidesToShow) {
      currentSlide = slide - 1;
      position -= 100 / this.state.slidesToShow;
    } else {
      currentSlide = this.state.activeSlide;
      position = this.state.slidePosition;
    }

    this.setState({
      activeSlide: currentSlide,
      // moveToRight: false,
      slidePosition: position,
      slideAnim: `slideRight`
    });
  }

  _handlNextSlideClick(slide) {
    let currentSlide = slide;
    let position = this.state.slidePosition;

    if (currentSlide === (this.state.slides.length - 1) - this.state.slidesToShow) {
      currentSlide = this.state.slidesToShow;
      position = 100;
    } else if (currentSlide < this.state.slides.length - 1) {
      currentSlide = slide + 1;
      position += 100 / this.state.slidesToShow;
    } else {
      currentSlide = this.state.activeSlide;
      position = this.state.slidePosition;
    }


    this.setState({
      activeSlide: currentSlide,
      // moveToRight: true,
      slidePosition: position,
      slideAnim: `slideLeft`
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
        // moveToRight: true,
        slidePosition: id * 100 / this.state.slidesToShow,
        slideAnim: `slideLeft`
      });
    } else {
      this.setState({
        activeSlide: id,
        // moveToRight: false,
        slidePosition: id * 100 / this.state.slidesToShow,
        slideAnim: `slideRight`
      });
    }
  }

  _setSlides(data) {
    this.setState({
      slides: data
    });
  }

  _setSlideAnim(className) {
    setTimeout(() => {
      this.setState({
        slideAnim: className
      });
    }, 1);
  }

  render() {
    return (
      <main className="container">
        <section
          className={`slider`}
        >
          <Slider
            isCaption={this.state.isCaption}
            activeSlide={ this.state.activeSlide}
            setSlides={(data) => this._setSlides(data)}
            setSlideAnim={(className) => this._setSlideAnim(className)}
            onIndicatorDotClick={this._handleSlideIndicatorClick}
            onLeftArrowClick={this._handlPrevSlideClick}
            onRightArrowClick={this._handlNextSlideClick}
            // slideDirection={this.state.moveToRight}
            slidePosition={this.state.slidePosition}
            slides={this.state.slides}
            slidesToShow={this.state.slidesToShow}
            slideAnim={this.state.slideAnim}
          >
            <div>
              <div className="slide__quote">
                <p>IRON MAN (Tony Stark)</p>
                &ldquo;My armor, it was never a distraction or a hobby, it was a cocoon. And now, I&apos;m a changed man. You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo;
              </div>
              <img src="https://media.comicbook.com/2020/02/iron-man-marvel-comics-1209184-1280x0.jpeg" alt="Iron Man"/>
              <Caption isCaption={this.state.isCaption}>
                  I am the Iron Man
              </Caption>
            </div>
            <div>
              <div className="slide__quote">
                <p>CAPTAIN AMERICA (Steve Rogers)</p>
              &ldquo;For as long as I can remember, I just wanted to do what was right. I guess I&apos;m not quite sure what that is anymore. And I thought I could throw myself back in and follow orders, serve. It&apos;s just not the same.&rdquo;
              </div>
              <img src="https://townsquare.media/site/622/files/2017/03/captain-america-madbomb.jpg" alt="Iron Man"/>
              <Caption isCaption={this.state.isCaption}>
                Before we get started, does anyone want to get out?
              </Caption>
            </div>
            <div>
              <div className="slide__text">
                <p>THOR (Thor Odinson)</p>
                The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike.
              </div>
              <img src="https://pm1.narvii.com/6652/9b6208181e3272ba71d25a726bd669a20508dfaa_hq.jpg" alt="Iron Man"/>
              <Caption isCaption={this.state.isCaption}>
                Fortunately, I am mighty!
              </Caption>
            </div>
            <div>
              <div className="slide__text">
                <h5>HULK (BRUCE BANNER)</h5>
                Exposed to heavy doses of gamma radiation, scientist Bruce Banner transforms into the mean, green rage machine called the Hulk.
              </div>
              <img src="https://www.wallpapertip.com/wmimgs/5-59448_marvel-tales-hulk.jpg" alt="Iron Man"/>
              <Caption isCaption={this.state.isCaption}>
              No team, only Hulk.
              </Caption>
            </div>
            <div>
              <div className="slide__text">
                <p>The Infinity Gauntlet is an American comic book storyline published by Marvel Comics.</p>
                <a href="https://www.marvel.com/comics/events/29/infinity_war">GO TO COMICS</a>
              </div>
              <img src="https://i.annihil.us/u/prod/marvel/i/mg/3/20/5261633bcd293.jpg" alt="Iron Man"/>
              <Caption isCaption={this.state.isCaption}>
                The Infinity Gauntlet
              </Caption>
            </div>
          </Slider>
        </section>
      </main>
    );
  }
}

App.propTypes = {
  isInfinite: PropTypes.bool.isRequired,
  isCaption: PropTypes.bool.isRequired,
  slidesToShow: PropTypes.number.isRequired
};

export default App;
