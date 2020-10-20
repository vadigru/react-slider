# react-common-slider

A Slider/Carousel component for React. Designed and developed by [Vadim Grunenko](https://github.com/vadigru)

[Demo](https://react-common-slider.vercel.app/)

# How to start a project locally:
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

```
      <Slider props={...}>
        <div>
          <h2>Some title</h2>
          <p>Some text</p>
        </div>
      </Slider>
```

### With background image, avatar image, translucent dark background, and caption:

```
    <Slider props={props}>
      <div>
        <img className="background" src="" />
        <div className="content content--bg">
          <img className="avatar" src="" alt="" />
          <h4>Some title</h4>
          <p>Some text</p>
        </div>
        <div className="caption">
          Some caption text
        </div>
      </div>
    </Slider>
```

## Properties

| property | type | default | description |
|-|-|-|-|
| **width** | `string` | `` | if no props passed width will be 100%. example width={`1000`} heigth={`600`} |
| **height** | `string` | `` | if no props passed height will be 100% |
| **infinite** | `boolean` | false | simple slider or infinite |
| **caption** | `boolean` | false | show/hide caption in the top of the slide |
| **autoplay** | `boolean` | false | slider autoplay |
| **autoplayDelay** | `number` | false | slider autoplay interval time in ms|
| **indicators** | `boolean` | false | show/hide slides indicators in the bottom of the slider|
| **arrows** | `boolean` | false | show/hide navigation arrows |
| **adaptiveSlides** | `boolean` | false | if true slider will change number of showed slides accordingly to the screen width. 1 for mobile, 2 for tablet, 3 for desktop. if false slider will always show number of slides based on slidesCount |
| **animatedSwipe** | `boolean` | false | animate when dragging to next/previous slide |
| **slidesCount** | `number` | 1 | if passed value exceeds the number of slides, the slider will show the maximum possible number of slides |

## Classnames

| class | description |
|-|-|
| **slider** | element wrapping the whole Slider |
| **slides** | element wrapping all slides |
|-|-|
| **slide** | apllied to every child item |
| **slide--no-caption** | apllied to every child item if captions are turned off |
| **avatar** | add small rounded image |
| **image** | add image to slide |
| **background** | add image as slide background |
| **content--bg** | add main slide content with 50% translucent dark background |
| **content--no-bg** | add main slide content without background |
| **caption** | add caption for slide |
| **caption--forced** | will show slide caption even if all captions are turned off |
|-|-|
| **arrows** | element wrapping navigation buttons |
| **arrow-prev** | previous button |
| **arrow-next** | next button |
|-|-|
| **indicators** | element wrapping all slide indicators |
| **indicator** | indicator element |
