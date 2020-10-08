import React from "react";
import Slider from "../slider/slider.jsx";
import VideoPlayer from "../video-player/video-player.jsx";

const App = () => {
  return (
    <>
      <Slider
        width={`1000px`}
        height={`500px`}
        // infinite={true}
        caption={true}
        autoplay={true}
        indicators={true}
        arrows={true}
        adaptiveSlides={true}
        // animatedSwipe={true}
        slidesCount={2}
      >
        {/* <div>
          <img className="slide__background" src="img/asgard.webp" alt="Thor background image"/>
          <div className="slide__content content">
            <img className="slide__avatar" src="img/thor_avatar.webp  " alt="Thor" width="100" heigth="100"/>
            <h4>THOR</h4>
            <span>
              <a href="https://www.marvel.com/characters/thor-thor-odinson">The son of Odin</a> uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike.
            </span>
          </div>
          <div className="slide__caption">
            Fortunately, I am mighty!
          </div>
        </div>

        <div>
          <div className="slide__content content">
            <img className="slide__image" src="img/black_hole.webp" alt="Black Hole"/>
          </div>
          <div className="slide__caption caption">
            <a className="caption__btn" href="https://www.universetoday.com/135158/team-creates-negative-effective-mass-lab/">What is a Black Hole?</a>
          </div>
        </div>

        <div>
          <img className="slide__background" src="img/hawaii.webp" alt="Hawaii"/>
          <div className="slide__content content">
            <h2>Hawaii</h2>
            is the world&apos;s largest island chain, and it&apos;s the only U.S. state completely made up of islands.
          </div>
          <div className="slide__caption">
            Hawaii
          </div>
        </div>

        <div>
          <VideoPlayer
            src={`https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4`}
            autoPlay={true}
          />
          <div className="slide__caption slide__caption--forced">
            Big Buck Bunny
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg content">
            <p>COVID-19 is an infectious disease. Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
            </p>
            <a className="content__btn content__btn--alert" href="https://covid19.who.int/">COVID-19 Dashboard</a>
          </div>
        </div>

        <div>
          <div className="slide__content">
            <h2>LAST SLIDE</h2>
          </div>
        </div> */}

        <div>
          <div className="slide__content--no-bg">
            <h2> 1</h2>
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg">
            <h2> 2 </h2>
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg">
            <h2> 3 </h2>
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg">
            <h2> 4 </h2>
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg">
            <h2> 5 </h2>
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg">
            <h2> 6 </h2>
          </div>
        </div>
      </Slider>
    </>
  );
};

export default App;
