import React from "react";

const SlideOne = (props) => {
  return (
    <React.Fragment>
      <p className="slide__quote">
        <q>
          My armor, it was never a distraction or a hobby, it was a cocoon. And now, I&apos;m a changed man. You can take away my house, all my tricks and toys. But one thing you can&apos;t take away... I am Iron Man.
        </q>
        <cite>
          ―Tony Stark
        </cite>
      </p>

      <img src="https://media.comicbook.com/2020/02/iron-man-marvel-comics-1209184-1280x0.jpeg" alt="Iron Man"/>
      <span className="slide__caption">
        I am the Iron Man
      </span>
    </React.Fragment>
  );
};

const SlideTwo = (props) => {
  return (
    <React.Fragment>
      <img src="https://cdn.vox-cdn.com/thumbor/ROvPemKpM4zcAjdPJjRXZDRXzj0=/0x47:600x447/1400x788/filters:focal(0x47:600x447):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/35708452/Bst7rv7CAAAn15W.0.jpg" alt="Iron Man"/>
      <span className="slide__caption">
        Before we get started, does anyone want to get out?
      </span>
    </React.Fragment>
  );
};

const SlideThree = (props) => {
  return (
    <React.Fragment>
      <img src="https://pm1.narvii.com/6652/9b6208181e3272ba71d25a726bd669a20508dfaa_hq.jpg" alt="Iron Man"/>
      <span className="slide__caption">
       Fortunately, I am mighty!
      </span>
    </React.Fragment>
  );
};

const SlideFour = (props) => {
  return (
    <React.Fragment>
      <p className="slide__text-only">
      The Infinity Gauntlet is an American comic book storyline published by Marvel Comics. In addition to an eponymous, six-issue limited series written by Jim Starlin and pencilled by George Pérez and Ron Lim, cross over chapters appeared in related comic books. Since its initial serialization from July to December 1991, the series has been reprinted in various formats and editions.
      </p>
      <span className="slide__caption">
        Infinity War
      </span>
    </React.Fragment>
  );
};

export default [
  SlideOne,
  SlideTwo,
  SlideThree,
  SlideFour
];
