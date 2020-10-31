import React from "react";
import Slider from "../slider/slider.jsx";

const App = () => {
  return (
    <Slider
      demoMode={true}
      width={1200}
      height={600}
      // infinite={true}
      // caption={true}
      // autoplay={true}
      // autoplayDelay={5000}
      // indicators={true}
      // arrows={true}
      // adaptiveSlides={true}
      // animatedSwipe={true}
      // animationTime={350}
      // slidesCount={3}
    >
      <div>
        <h2>FIRST SLIDE</h2>
        <p>This is the most simple use.</p>
      </div>

      <div>
        <img className="background" src="img/blackhole.jpg" alt="Black Hole"/>
        <div className="caption--forced">
          <a className="caption-link" href="https://www.space.com/where-do-black-holes-lead.html">Where Do Black Holes Lead?</a>
        </div>
      </div>

      <div>
        <div className="content--bg-light">
          <h3>Hello, World!</h3>
          <img className="image" src="img/world-map.jpg" alt="World map"/>
        </div>
      </div>

      <div>
        <img className="background" src="img/iron-man-home.jpg" alt="Iron Man background image" />
        <div className="content--bg-dark">
          <img className="avatar" src="img/iron-man-ava.jpg" alt="Iron Man" width="100" heigth="100" />
          <h4>IRON MAN</h4>
          &ldquo;You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo;
        </div>
        <div className="caption">
          I am the Iron Man
        </div>
      </div>

      <div>
        <img className="background" src="img/covid19-dashboard.jpg" alt="COVID-19 dashboard"/>
        <div className="caption">
          COVID-19 is an infectious disease.
        </div>
        <div className="content--bg-light">
          <p>
            Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
          </p>
          <a className="content-btn" href="https://covid19.who.int/">COVID-19 Dashboard</a>
        </div>
      </div>

      <div>
        <img className="background" src="img/elbrus.jpg" alt="Elbrus"/>
        <div className="content--bg-dark">
          <h2>Elbrus</h2>
        </div>
      </div>
    </Slider>
  );
};

export default App;
