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
        autoplayDelay={2000}
        indicators={true}
        arrows={true}
        adaptiveSlides={true}
        animatedSwipe={true}
        slidesCount={3}
      >
        {/* <div>
          <img className="slide__background" src="https://i.pinimg.com/originals/69/a9/0b/69a90b480d82ed3d88978a6260c6bcaa.png" alt="Iron Man background image" />
          <div className="slide__content">
            <img className="slide__avatar" src="https://cdn.gameomg.me/c/gom/cover/4f/iron-man-star-war/iron-man-star-war.jpg?v=1426213902" alt="Iron Man" width="100" heigth="100" />
            <h4>IRON MAN</h4>
            &ldquo;You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo;
          </div>
          <div className="slide__caption">
            I am the Iron Man
          </div>
        </div>
        <div>
          <img className="slide__background" src="https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/c/ce/Camp_Lehigh_%281970%29.png/revision/latest?cb=20190728103840" alt="Captain America background image" />
          <div className="slide__content">
            <img className="slide__avatar" src="https://economicsandethics.typepad.com/.a/6a0120a58aead7970c01a73deecf79970d-200wi" alt="Captain America" width="100" heigth="100" />
            <h4>CAPTAIN AMERICA</h4>
            &ldquo;I don&apos;t want to kill anyone. I don&apos;t like bullies. I don&apos;t care where they&apos;re from.&rdquo;
          </div>
          <div className="slide__caption">
            Before we get started, does anyone want to get out?
          </div>
        </div>
        <div>
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
          <img className="slide__background" src="http://danieltdorrance.com/wp-content/uploads/2013/04/4BannersLabAfter.jpg" alt="Hulk background image" />
          <div className="slide__content">
            <img className="slide__avatar" src="https://avatarfiles.alphacoders.com/121/thumb-121988.png" alt="Hulk" width="100" heigth="100" />
            <h4>HULK</h4>
          Exposed to heavy doses of gamma radiation, scientist Bruce Banner transforms into the mean, green rage machine called the Hulk.
          </div>
          <div className="slide__caption">
            No team, only Hulk.
          </div>
        </div>
        <div>
          <img className="slide__background" src="https://cdnb.artstation.com/p/assets/images/images/014/245/147/large/chris-kesler-6.jpg?1543169029" alt="The Infinity Gautlet background image" />
          <div className="slide__content">
            <img className="slide__avatar" src="https://avatarfiles.alphacoders.com/177/thumb-177423.png" alt="Thanos with the Infinity Gauntlet" width="100" heigth="100" />
            <h4>The Infinity Gauntlet</h4>
            <span><a href="https://www.marvel.com/comics/events/29/infinity_war">The Infinity Gauntlet</a> is an American comic book storyline published by Marvel Comics.</span>
          </div>
          <div className="slide__caption">
            The Infinity Gauntlet
          </div>
        </div> */}
        {/* <div>
          <div className="slide__content content">
            <img className="slide__avatar" src="img/black_hole.webp" alt="Black Hole"/>
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
          <div className="slide__content--no-bg">
            <h2>slide 1</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 2</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 3</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 4</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 5</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 6</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 7</h2>
          </div>
        </div>
        {/* <div>
          <div className="slide__content--no-bg">
            <h2>slide 8</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 9</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 10</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 11</h2>
          </div>
        </div>
        <div>
          <div className="slide__content--no-bg">
            <h2>slide 12</h2>
          </div>
        </div> */}
      </Slider>
    </>
  );
};

export default App;
