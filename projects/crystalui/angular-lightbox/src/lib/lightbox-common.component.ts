import { Component, Input, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { LightboxData, Properties } from './interfaces';
import { ShowState, ClosingState } from './types';
import { EventService } from './event.service';
import { Utils } from './utils';

@Component({
    selector: 'lightbox-common',
    template: ''
})

export class LightboxCommonComponent {

    currentImageIndex: number = 0;
    indexCurrentSlide = 1;
    showState: ShowState;
    closingState: ClosingState;
    containerStyles: any = {
        transition: '',
        transform: '',
        width: '',
        height: '',
        opacity: ''
    };
    currImageLoadingState: 'not-loaded' | 'loading' | 'uploaded' | 'error' = 'not-loaded';
    isMobile: boolean;

    @Input() lightboxData: LightboxData;

    @HostBinding('style.backgroundColor') hostStyleBackgroundColor: string;
    @HostBinding('style.transition') hostStyleTransition: string;

    @ViewChild('imageFirst') _imageFirst: ElementRef;
    @ViewChild('imageSecond') _imageSecond: ElementRef;
    @ViewChild('imageLast') _imageLast: ElementRef;
    @ViewChild('lightboxImage') _lightboxImage: ElementRef;

    get lightboxImage(){
        return this._lightboxImage;
    }

    get lightboxImageElement(){
        if (this.lightboxImage){
            return this.lightboxImage.nativeElement;
        }
    }

    get lightboxImageNaturalHeight(){
        if (this.lightboxImageElement){
            return this.lightboxImageElement.naturalHeight;
        }
    }

    get lightboxImageNaturalWidth(){
        if (this.lightboxImageElement){
            return this.lightboxImageElement.naturalWidth;
        }
    }

    get index(){
        return this.currentImageIndex;
    }

    get properties(){
        return this.lightboxData.properties;
    }

    get images(){
        return this.lightboxData.images || [this.lightboxData.image];
    }

    get thumbnailImage(){
        return this.images[this.currentImageIndex].nativeElement;
    }

    get thumbnailImagePosition(){
        return this.thumbnailImage.getBoundingClientRect();
    }

    // Image size if it is larger than the window size
    get virtualImageDimension(){
        let height = this.lightboxImageNaturalHeight;
        let width = height * this.imageAspectRatio;
        const windowWidth = document.body.clientWidth;
        const windowHeight = window.innerHeight;

        if (this.isImageLargerWindow){
            if (height > windowHeight){
                height = windowHeight;
                width = height * this.imageAspectRatio;
            } 

            if (width > windowWidth){
                width = windowWidth;
                height = width / this.imageAspectRatio;
            }
        } else {
            width = this.lightboxImageNaturalWidth;
            height = this.lightboxImageNaturalHeight;
        }

        if (width === 0 || Number.parseInt(height) === 0){
            return {width: 200, height: 200};
        }

        return {width, height};
    }

    get containerInitialPosition(){
        const scale =  (this.showState === 'initial-thumbnail-image') ? 1 : this.containerScale; 
        const top = this.thumbnailImagePosition.top;
        const left = this.thumbnailImagePosition.left;
        return 'matrix('+ scale +', 0, 0, '+ scale +','+ left +','+ top +')';
    }

    get containerFullscreenPosition(){
        const left = (document.body.clientWidth - this.virtualImageDimension.width) / 2;
        const top = (window.innerHeight - this.virtualImageDimension.height) / 2;

        return 'translate3d('+ left +'px, '+ top +'px, 0)';
    }

    get containerScale(){
        return this.thumbnailImagePosition.width / this.virtualImageDimension.width;
    }

    get imageAspectRatio(){
        return this.thumbnailImage.naturalWidth / this.thumbnailImage.naturalHeight;
    }

    get isImageLargerWindow():boolean {
        const imageNaturalWidth = this.lightboxImageNaturalWidth;
        const imageNaturalHeight = this.lightboxImageNaturalHeight;
        const windowWidth = document.body.clientWidth;
        const windowHeight = window.innerHeight;
        return imageNaturalWidth > windowWidth || imageNaturalHeight > windowHeight;
    }

    get isFirstImage(){
        if (this.properties.loop){
            return false;
        } else {
            return this.index === 0;
        }
    }

    get isLastImage(){
        if (this.properties.loop){
            return false;
        } else {
            return this.index === this.latestImageIndex;
        }        
    }

    get latestImageIndex(){
        return this.images.length - 1;
    }

    get backgroundColor(){
        const opacity = this.properties.backgroundOpacity;
        const color = this.properties.backgroundColor;
        if (color === 'black') {
            return 'rgba(0, 0, 0, ' + opacity +')';
        } else {
            return 'rgba(255, 255, 255, ' + opacity +')';
        }
    }

    get animationDuration(){
        const animationDuration = this.properties.animationDuration;

        if (typeof animationDuration === "string"){
            return Number.parseInt(animationDuration);
        } else {
            return animationDuration;
        }
    }

    get animationMode(){
        if (this.currImageLoadingState === 'error'){
            return 'default';
        }
        return this.properties.animationMode;
    }

    get animationTimingFunction(){
        return this.properties.animationTimingFunction;
    }

    get closeButtonText(){
        return this.properties.closeButtonText;
    }

    get counterSeparator(){
        return this.properties.counterSeparator;
    }

    get counter(){
        return this.currentImageIndex + 1 + this.counterSeparator + this.images.length;
    }

    constructor(public eventService: EventService){
        this.isMobile = Utils.mobileCheck();
    }

    emitState(type, state){
        if (state === 'initial-virtual-image' || 
            state === 'initial-styles'){
            return;
        }

        if (state === 'initial-default' || 
            state === 'initial-thumbnail-image'){
            state = 'initial';
        }

        this.eventService.emitChangeEvent({
            type: type+':'+state
        });
    }

    setShowState(state: ShowState){
        this.showState = state;
        this.emitState('show-state', state)
    }

    setClosingState(state: ClosingState){
        this.closingState = state; 
        this.emitState('closing-state', state);
    }

    setAnimationDuration(){
        this.hostStyleTransition = 'background-color '+this.animationDuration+'ms';
        this.containerStyles.transition = 'all '+this.animationDuration+'ms '+this.animationTimingFunction;
    }

    setBackgroundColor(){
        this.hostStyleBackgroundColor = this.backgroundColor;
    }

    getContainerHeight():string {
        return this.thumbnailImagePosition.height / this.containerScale + 'px';
    }

    showThumbnailImage() {
        this.thumbnailImage.style.opacity = '';
    }

    hideThumbnailImage(){
        this.thumbnailImage.style.opacity = 0;
    }

    updateThumbnailPosition(){
        this.containerStyles.transform = this.containerInitialPosition;
    }
} 
