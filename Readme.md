# react-common-slider

A Slider/Carousel component for React.

[Demo](https://react-common-slider.vercel.app/)


## Most Simple Use

```jsx
import Slider from "react-common-slider";
import "react-common-slider/public/css/main.css";

      <Slider
        isInfinite={false}
        isCaption={true}
        isAutoplay={false}
        width={`1000px`}
        height={`500px`}
        slidesCount={1}
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
| **width** | `string` | if no props passed width will be 100% |
| **height** | `string` | if no props passed height will be 100% |
| **isInfinite** | `boolean` | false |
| **isCaption** | `boolean` | false |
| **isAutoplay** | `boolean` | false |
| **slidesCount** | `number` | 1 |

### Classnames

| class | description |
|-|-|
| **slider** | element wrapping the whole Slider |
| **slide** | element wrapping all slides |
| **slide__item** | apllied to every child item |
| **slide__background** | add image as slide background |
| **slide__content** | add main slide content with 50% translucent background |
| **slide__content--wo-bg** | add main slide content without background |
| **slide__avatar** | add rounded image |
| **slide__caption** | add caption for slide |
| **arrows__prev** | previous button |
| **arrows_next** | next button |
| **indicators** | element wrapping all slide indicators |
| **indicators__item** | outer indicator element |
| **indicators__item-inner** | inner indicator element |

### Components

| component | description |
|-|-|
| **VideoPlayer** | add video to the size of the entire slide using HTML5 video player |

### VideoPlayer props

| property | type | default | description |
|-|-|-|-|
| **src** | `string` | - | source of video file |
| **autoPlay** | `boolean` | true | enable/disable autoplay video |
