export interface LightboxData {
	images?: Images & any;
	image?: Image & ImageExtended;
	properties?: Properties;
	index?: number;
}

export interface Images {
    [index: number]: { path:string; width?:number; height?:number };
}

export interface Image {
    path: string; 
    width?: number; 
    height?: number;
}

export interface ImageExtended {
	fullImage?: Image;
	thumbnailImage?: Image;
    nativeElement?: any; 
}

export interface Properties {
	loop?: boolean,
	index?: number,
	counter?: false,
	imageMaxHeight?: string,
	imageMaxWidth?: string,
	animationDuration?: number,
	animationMode?: 'default' | 'zoom' | 'zoom-blur' | 'zoom-preloader' | 'opacity' | 'none', // можно экспортировать тип
	animationTimingFunction?: string,
	closeButtonText?: string,
	counterSeparator?: string,
	disable?: boolean,
	simpleMode?: boolean,
	backgroundColor?: 'black' | 'white',
	backgroundOpacity?: number,
	hideThumbnail?: boolean,
	imagePathError?: string,
	gestureEnable?: boolean,
}

export const DefaultProperties = {
	loop: false,
	index: 0,
	counter: false,
	imageMaxHeight: "100%",
	imageMaxWidth: "100%",
	animationDuration: 350,
	animationMode: 'zoom-preloader',
	animationTimingFunction: 'cubic-bezier(0.475, 0.105, 0.445, 0.945)',
	closeButtonText: 'Close',
	counterSeparator: '/',
	disable: false,
	simpleMode: false,
	backgroundColor: 'black',
	backgroundOpacity: 1,
	hideThumbnail: true,
}