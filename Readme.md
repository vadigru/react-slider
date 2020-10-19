# react-common-slider

A Slider/Carousel component for React. Designed and developed by [Vadim Grunenko](https://github.com/vadigru)

[Demo](https://react-common-slider.vercel.app/)

## How to start a project locally:
Install project on local computer (node.js required):
```sh
npm i
```
Run project:
```sh
npm run start
```
Create production build for the project:
```sh
npm run build
```

## Most Simple Use

```
      <Slider props={props}>
        <div>
          <h2>FIRST SLIDE</h2>
          <p>This is the most simple use.</p>
        </div>
      </Slider>
```

## Properties

| property | type | default | description |
|-|-|-|-|
| **width** | `string` | ``| if no props passed width will be 100% |
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
| **slide** | element wrapping all slides |
| **slide__item** | apllied to every child item |
| **slide__background** | add image as slide background |
| **slide__content** | add main slide content with 50% translucent dark background |
| **slide__content--no-bg** | add main slide content without background |
| **slide__avatar** | add rounded image |
| **slide__caption** | add caption for slide |
| **slide__caption--forced** | will show slide caption even if all captions are turned off |
| **arrows** | element wrapping navigation buttons |
| **arrows__prev** | previous button |
| **arrows_next** | next button |
| **indicators** | element wrapping all slide indicators |
| **indicators__item** | outer indicator element |
