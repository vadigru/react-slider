import React from "react";
import Slider from "../slider/slider.jsx";
import VideoPlayer from "../video-player/video-player.jsx";

const App = () => {
  return (
    <>
      <Slider
        width={`500px`}
        height={`200px`}
        // infinite={true}
        caption={true}
        // autoplay={true}
        indicators={true}
        arrows={true}
        adaptiveSlides={true}
        animatedSwipe={true}
        slidesCount={3}
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
            <p>is the world&apos;s largest island chain, and it&apos;s the only U.S. state completely made up of islands.</p>
          </div>
          <div className="slide__caption caption">
            Hawaii
          </div>
        </div>

        <div>
          <VideoPlayer
            src={`https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4`}
            autoPlay={true}
          />
          <div className="slide__caption slide__caption--forced caption">
            Big Buck Bunny
          </div>
        </div>

        <div>
          <img className="slide__background" src="https://cdnb.artstation.com/p/assets/images/images/014/245/147/large/chris-kesler-6.jpg?1543169029" alt="The Infinity Gautlet background image"/>
          <div className="slide__content content">
            <img className="slide__avatar" src="https://avatarfiles.alphacoders.com/177/thumb-177423.png" alt="Thanos with the Infinity Gauntlet" width="100" heigth="100"/>
            <h4>The Infinity Gauntlet</h4>
            <span><a href="https://www.marvel.com/comics/events/29/infinity_war">The Infinity Gauntlet</a> is an American comic book storyline published by Marvel Comics.</span>
          </div>
          <div className="slide__caption caption">
            The Infinity Gauntlet
          </div>
        </div>

        <div>
          <div className="slide__content--no-bg content">
            <p>COVID-19 is an infectious disease. Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment.
            </p>
            <a className="content__btn content__btn--alert" href="https://covid19.who.int/">COVID-19 Dashboard</a>
          </div>
        </div> */}

        <div>
          <h2>Slide 1</h2>
        </div>

        <div>
          <h2>Slide 2</h2>
        </div>

        <div>
          <h2>Slide 3</h2>
        </div>

        <div>
          <h2>Slide 4</h2>
        </div>

        <div>
          <h2>Slide 5</h2>
        </div>

        <div>
          <h2>Slide 6</h2>
        </div>

        <div>
          <h2>Slide 7</h2>
        </div>

        <div>
          <h2>Slide 8</h2>
        </div>

        <div>
          <h2>Slide 9</h2>
        </div>

        <div>
          <h2>Slide 10</h2>
        </div>

        <div>
          <h2>Slide 11</h2>
        </div>

        <div>
          <h2>Slide 12</h2>
        </div>
      </Slider>
    </>
  );
};

export default App;
