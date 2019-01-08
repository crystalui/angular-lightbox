# Lightbox for Angular

A simple, responsive lightbox component.

## Demo 

http://crystalui.org/components/lightbox

## Installation

Install the npm package.

	npm i @crystalui/angular-lightbox

Import module:

```ts
import {CrystalLightboxModule} from '@crystalui/angular-lightbox';

@NgModule({
    imports: [CrystalLightboxModule]
})
```

## Usage
You can cluster images into group.

```html
<div lightbox-group>
    <img src="path_to_image" lightbox [fullImage]="{path: 'path_to_fullimage' }" />
</div>
```

Or keep them as separate images.

```html
<img src="path_to_image" lightbox [fullImage]="{path: 'path_to_fullimage' }" />
```

You don’t need to specify the path to the large image, it’ll work either way.

```html
<img src="path_to_image" lightbox />
```

## Properties

```ts
imageMaxHeight: string = "100%"
// Maximum image height.

imageMaxWidth: string = "100%"
// Maximum image width.

counter: boolean = false
// Image counter.

counterSeparator: string = "/"
// The text separator counter.

backgroundColor: "black" | "white" = "black"
// Background color. Inverts the black and white colors of the controls and the background.

backgroundOpacity: number = "0.85"
// Lightbox background opacity.

animationDuration: number = "400"
// Speed of opening and closing animation.

animationTimingFunction: string = "cubic-bezier(0.475, 0.105, 0.445, 0.945)"
// Smooth opening and closing animation function.

closeButtonText: string = "Close"
// The Close button text.

hideThumbnail: boolean = true
// Hide the thumbnail when opening the lightbox.

disable: boolean = false
// Disable the lightbox.
```

## Events

```ts
thumbnail:click
{type: "thumbnail:click"}
// Click on the thumbnail.

show-state:initial
{type: "show-state:initial"}
// Preparing styles for starting the lightbox display animation and the preloader display.

show-state:animation
{type: "show-state:animation"}
// Starting the lightbox display animation.

show-state:animation-end
{type: "show-state:animation-end"}
// Ending the lightbox display animation.

closing-state:initial
{type: "closing-state:initial"}
// Preparing styles for starting the lightbox closing animation.

closing-state:animation
{type: "closing-state:animation"}
// Starting the lightbox closing animation.

closing-state:animation-end
{type: "closing-state:animation-end"}
// Ending the lightbox closing animation.
```

## Browser support
|------------------------|-------------------------|
| Chrome / Chrome for Android | 50+ / Android 4.4+ |
| FireFox | 48+ |
| Opera | 44+ |
| Safari / iOS Safari | 10.1, 11.1 / iOS 9+ |
| Internet Explorer | Edge 15+ |