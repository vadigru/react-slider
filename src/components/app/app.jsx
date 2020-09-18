import React from "react";
import Slider from "../slider/slider.jsx";


const App = () => {
  return (
    <Slider
      isInfinite={false}
      isCaption={true}
      isAutoplay={false}
      width={100} // in percent
      height={100} // in vh
      slidesCount={1}
    >
      <div>
        <div className="slide__content">
          <img className="slide__image" src="https://cdn.gameomg.me/c/gom/cover/4f/iron-man-star-war/iron-man-star-war.jpg?v=1426213902" alt="Iron Man" width="100" heigth="100"/>
          <h4>IRON MAN</h4>
          &ldquo;You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.&rdquo;
        </div>
        <img className="slide__background" src="https://i.pinimg.com/originals/69/a9/0b/69a90b480d82ed3d88978a6260c6bcaa.png" alt="Iron Man background image"/>
        <div className="slide__caption">
          I am the Iron Man
        </div>
      </div>
      <div>
        <div className="slide__content">
          <img className="slide__image" src="https://economicsandethics.typepad.com/.a/6a0120a58aead7970c01a73deecf79970d-200wi" alt="Captain America" width="100" heigth="100"/>
          <h4>CAPTAIN AMERICA</h4>
          &ldquo;I don&apos;t want to kill anyone. I don&apos;t like bullies. I don&apos;t care where they&apos;re from.&rdquo;
        </div>
        <img className="slide__background" src="https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/c/ce/Camp_Lehigh_%281970%29.png/revision/latest?cb=20190728103840" alt="Captain America background image"/>
        <div className="slide__caption">
          Before we get started, does anyone want to get out?
        </div>
      </div>
      <div>
        <div className="slide__content">
          <img className="slide__image" src="https://avatarfiles.alphacoders.com/185/thumb-185526.jpg" alt="Thor" width="100" heigth="100"/>
          <h4>THOR</h4>
          The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike.
        </div>
        <img className="slide__background" src="https://i.pinimg.com/originals/cd/21/f3/cd21f3c362faa00a9f948fa804043e29.png" alt="Thor background image"/>
        <div className="slide__caption">
          Fortunately, I am mighty!
        </div>
      </div>
      <div>
        <div className="slide__content">
          <img className="slide__image" src="https://avatarfiles.alphacoders.com/121/thumb-121988.png" alt="Hulk" width="100" heigth="100"/>
          <h4>HULK</h4>
          Exposed to heavy doses of gamma radiation, scientist Bruce Banner transforms into the mean, green rage machine called the Hulk.
        </div>
        <img className="slide__background" src="http://danieltdorrance.com/wp-content/uploads/2013/04/4BannersLabAfter.jpg" alt="Hulk background image"/>
        <div className="slide__caption">
        No team, only Hulk.
        </div>
      </div>
      <div>
        <div className="slide__content">
          <img className="slide__image" src="https://avatarfiles.alphacoders.com/177/thumb-177423.png" alt="" width="100" heigth="100"/>
          <h4>The Infinity Gauntlet</h4>
          The Infinity Gauntlet is an American comic book storyline published by Marvel Comics.
          <a href="https://www.marvel.com/comics/events/29/infinity_war">OPEN</a>
        </div>
        <img className="slide__background" src="https://cdnb.artstation.com/p/assets/images/images/014/245/147/large/chris-kesler-6.jpg?1543169029" alt="The Infinity Gautlet background image"/>
        <div className="slide__caption">
          The Infinity Gauntlet
        </div>
      </div>
    </Slider>
  );
};

export default App;
