# react-slider

A Slider app written on React. Designed and developed by [Vadim Grunenko](https://github.com/vadigru)

- [Demo](https://react-slider-six.vercel.app)

## Features
- for mobile and desktop
- any HTML content
- swipes
- multiple slides on screen
- infinite option
- scrolling to a selected slide

# How to start a project locally:
Download or clone:
```sh
git@github.com:vadigru/react-slider.git
```
Install project on local computer (node.js required):
```sh
npm install
```
Run project:
```sh
npm run start
```
Create production build:
```sh
npm run build
```

# Usage
### Most simple use:

```jsx
const App = () => {
  return (
    <Slider>
      <div>
        <h2>FIRST SLIDE</h2>
        <p>This is the most simple use.</p>
      </div>
    </Slider>
  );
};
```

### With background image, avatar image, semi-transparent dark background, caption and setted slider size:

```jsx
const App = () => {
  return (
    <Slider
      width={1200}
      height={600}
    >
      <div>
        <img className="background" src="" />
        <div className="content--bg">
          <img className="avatar" src="" alt="" />
          <h4>Some title</h4>
          <p>Some text</p>
        </div>
        <div className="caption">
          Some caption text
        </div>
      </div>
    </Slider>
  );
};
```

## Properties

| property | type | default | description |
|-|-|-|-|
| **demoMode** | `boolean` | false | start application with visualized settings |
| **width** | `number` | window.innerWidth | if no prop is passed, slider will take full width of the screen |
| **height** | `number` | window.innerHeight | if no prop is passed, slider will take full height of the screen |
| **infinite** | `boolean` | false | simple or infinite slider |
| **caption** | `boolean` | false | show/hide caption in the top of the slide |
| **autoplay** | `boolean` | false | slider autoplay |
| **autoplayDelay** | `number` | 3000 | slider autoplay interval time in ms|
| **indicators** | `boolean` | false | show/hide slides indicators in the bottom of the slider|
| **arrows** | `boolean` | false | show/hide navigation arrows |
| **adaptiveSlides** | `boolean` | false | if `true` is passed slider will change number of showed slides on screen resize  |
| **animatedSwipe** | `boolean` | false | animate when dragging to a next/previous slide |
| **animationTime** | `number` | 350 | speed of scrolling to a next/previous slide |
| **slidesCount** | `number` | 1 | number of displayed slides. maximum number of displayed slides is limited to a three* |

> *if `adaptiveSlides` is on, the number of displayed slides will be changed accordingly to the screen width and value passed in `slidesCount`.
> - if 1 is passed slider will show 1 for all screen sizes
> - if 2 is passed slider will show 1 for a mobile, 2 for both a tablet and desktop
> - if 3 is passed slider will show 1 for a mobile, 2 for a tablet, 3 for a desktop

## Class names that can be used when adding a new slide

| class | description |
|-|-|
| **avatar** | add a small rounded image |
| **background** | add image as slide background. image used for background should not be wrapped to any tag |
| **caption** | add caption for a slide in the top of the slide |
| **caption-link** | add link as caption for a slide |
| **caption--forced** | will show a slide caption even if all captions are turned off |
| **content--bg-dark** | add a main slide content with 50% semi-transparent dark background and white text |
| **content--bg-light** | add a main slide content with 50% semi-transparent dark background and black text |
| **content-btn** | add a link as a grey button |
| **image** | add an image to slide |
