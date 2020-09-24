import React from "react";
import Slider from "../slider/slider.jsx";
import VideoPlayer from "../video-player/video-player.jsx";

const App = () => {
  return (
    <>
      <Slider
        // width={`1000px`}
        // height={`350px`}
        isInfinite={true}
        isCaption={true}
        // isAutoplay={true}
        isIndicators={true}
        // slidesCount={2}
      >
        <div>
          <img className="slide__background" src="/img/asgard.webp" alt="Thor background image"/>
          <div className="slide__content">
            <img className="slide__avatar" src="/img/thor_avatar.webp" alt="Thor" width="100" heigth="100"/>
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
          <img className="slide__background" src="/img/hawaii.webp" alt="Hawaii"/>
          <div className="slide__content">
            <h2>Hawaii</h2>
            is the world&apos;s largest island chain, and it&apos;s the only U.S. state completely made up of islands. But only 7 of its 132 islands are inhabited: Hawaii (also known as the Big Island), Maui, Molokai, Lanai, Oahu, Kauai, and Niihau. The Hawaiian Islands are volcanic islands.
          </div>
          <div className="slide__caption">
            Hawaii
          </div>
        </div>

        <div>
          <img className="slide__background" src="/img/black_hole.webp" alt="Black Hole"/>
          <a href="https://www.universetoday.com/135158/team-creates-negative-effective-mass-lab/">
            <span className="visually-hidden">Black Hole</span></a>
          <div className="slide__caption">
            What is a Black Hole?
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
          <div className="slide__content--no-bg">
            <p>Coronavirus disease (COVID-19) is an infectious disease caused by a newly discovered coronavirus.
              Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
            </p>
            <button>
              <a href="https://covid19.who.int/">Coronavirus Dashboard</a>
            </button>
          </div>
        </div>
      </Slider>
    </>
  );
};

export default App;
