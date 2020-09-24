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

```jsx
import Slider from "react-common-slider";
import "react-common-slider/public/css/main.css";

      <Slider
        width={`1000px`}
        height={`500px`}
        isInfinite={true}
        isCaption={true}
        isAutoplay={true}
        isIndicators={true}
        slidesCount={0}
      >
        <div>
          <img className="slide__background" src=""/>
          <div className="slide__content">
            <img className="slide__avatar" src=""/>
            <h4>Some title</h4>
              Some text
          </div>
          <div className="slide__caption">
            Caption text
          </div>
        </div>
      </Slider>
```

## Properties

| property | type | default | description |
|-|-|-|-|
| **width** | `string` | ``| if no props passed width will be 100% |
| **height** | `string` | `` | if no props passed height will be 100% |
| **isInfinite** | `boolean` | false | simple slider or infinite |
| **isCaption** | `boolean` | false | show/hide caption in the top of the slide |
| **isAutoplay** | `boolean` | false | slider autoplay |
| **slidesCount** | `number` | 1 | if passed value exceeds the number of slides, the slider will show the maximum possible number of slides |
| **isIndicators** | `boolean` | false | show/hide slide indicators |

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
| **indicators__item-inner** | inner indicator element |

## Components

| component | description |
|-|-|
| **VideoPlayer** | add video to the size of the entire slide using HTML5 video player |

### VideoPlayer properties

| property | type | default | description |
|-|-|-|-|
| **src** | `string` | - | source of video file |
| **autoPlay** | `boolean` | true | video autoplay |
