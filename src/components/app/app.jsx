import React from "react";
import Slider from "../slider/slider.jsx";

const App = () => {
  return (
    <Slider
      width={`1150px`}
      height={`600px`}
      infinite={true}
      caption={true}
      autoplay={true}
      autoplayDelay={5000}
      indicators={true}
      arrows={true}
      adaptiveSlides={true}
      animatedSwipe={true}
      slidesCount={3}
    >
      <div>
        <h2>FIRST SLIDE</h2>
        <p>This is the most simple use.</p>
      </div>

      <div>
        <img className="slide__background" src="img/hawaii.jpg" alt="Hawaii"/>
        <div className="slide__content content">
          <h2>Hawaii</h2>
          <p>is the world&apos;s largest island chain, and it&apos;s the only U.S. state completely made up of islands.</p>
        </div>
      </div>

      <div>
        <img className="slide__background" src="img/iron-man-home.jpg" alt="Iron Man background image" />
        <div className="slide__content">
          <img className="slide__avatar" src="img/iron-man-ava.jpg" alt="Iron Man" width="100" heigth="100" />
          <h4>IRON MAN</h4>
          &ldquo;You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo;
        </div>
        <div className="slide__caption">
          I am the Iron Man
        </div>
      </div>

      <div>
        <div className="slide__content--no-bg content">
          <p>
            COVID-19 is an infectious disease. Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
          </p>
          <a className="content__btn content__btn--alert" href="https://covid19.who.int/">COVID-19 Dashboard</a>
        </div>
      </div>

      <div>
        <div className="slide__content content">
          <img className="slide__image" src="img/black_hole.jpg" alt="Black Hole"/>
        </div>
        <div className="slide__caption caption">
          <a className="caption__btn" href="https://www.universetoday.com/135158/team-creates-negative-effective-mass-lab/">What is a Black Hole?</a>
        </div>
      </div>

    </Slider>
  );
};

export default App;
