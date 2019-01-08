import { Component, Input, EventEmitter, OnInit, HostBinding, HostListener, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef, ContentChildren, QueryList } from '@angular/core';
import { LightboxData } from './interfaces';
import { ShowState, ClosingState } from './types';
import { EventService } from './event.service';
import { LightboxCommonComponent } from './lightbox-common.component';

@Component({
    selector: 'crystal-lightbox',
    templateUrl: './lightbox.component.html',
    styleUrls: ['./css/lightbox.component.sass']
})

export class LightboxComponent extends LightboxCommonComponent {
    prevIndex: number;
    spinnerHeight: number = 30;
    isZoomIn: boolean;
    minTimeout: number = 30;
    preloaderTimeout: number = 100;
    spinnerStyles: any = {
        transform: ''
    };
    configThumbnailPreloader = true;
    events = new EventEmitter();

    @HostBinding('class.lightbox-shown') hostShown: boolean = false;
    @HostBinding('class.lightbox-hide-controls') hideControls: boolean = false;
    @HostBinding('class.lightbox-animation') hostAnimation: boolean;
    @HostBinding('class.lightbox-simple-mode')
    get simpleMode(){
        return this.properties.simpleMode;
    }

    @HostBinding('class.lightbox-light') get hostLightTheme(){
        return this.properties.backgroundColor === 'white';
    }

    @HostBinding('style.backgroundColor') hostStyleBackgroundColor: string;

    @ViewChild('prevImageElem') prevImageElem: ElementRef;
    @ViewChild('lightboxContainer') lightboxContainerElem: ElementRef;

    get currImagePath(){
        let image = this.images[this.index];
        let path;

        if (!image){
            return false;
        }

        if (image.fullImage && image.fullImage.path){
            path =  image.fullImage.path;
        } else if (image.thumbnailImage && image.thumbnailImage.path) {
            path = image.thumbnailImage.path;
        } else if (image.path){
            path = image.path;
        }

        return path;
    }

    get prevImagePath(){
        return this.images[this.prevIndex];
    }

    set prevImagePath(value: any){
        this.images[this.prevIndex] = value;
    }

    get isHiddenPrevArrow(){
        return this.isFirstImage && !this.properties.loop || this.isZoomIn;
    }
    get isHiddenNextArrow(){
        return this.isLastImage && !this.properties.loop || this.isZoomIn;
    }

    get isPreloader(){
        return this.animationMode === 'zoom-preloader' && 
           this.showState != 'animation-end' && 
           this.currImageLoadingState === 'loading';
    }

    get imageOrientation():'vertical' | 'horizontal' {
        if (this.thumbnailImage.naturalWidth > this.thumbnailImage.naturalHeight){
            return 'horizontal';
        } else {
            return 'vertical';
        }
    }

    @HostListener('window:scroll') scrolling(){
        if (this.showState === 'initial-thumbnail-image' ||
            this.showState === 'initial-virtual-image' ||
            this.closingState === 'animation'){
            this.updateThumbnailPosition();
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: any) {
        switch(event.key) {
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
            case 'Escape':
                this.closeLightbox();
                break;
        }
    }

    @HostListener("mouseenter", ['$event'])
    onMouseEnter(event: any) {
        this.hideControls = false;
    }

    @HostListener('transitionend', ['$event'])
    transitionEnd(event) {
        if (event.propertyName === "transform" && this.hostAnimation){
            this.hostAnimation = false;
        }
    }

    constructor(
        private elementRef: ElementRef, 
        private ref: ChangeDetectorRef,
        public eventService: EventService){
        super(eventService);
    }

    ngOnInit(){
        this.currentImageIndex = this.properties.index;
        this.initialLightbox();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.currImageLoadingState === 'not-loaded'){
                this.currImageLoadingState = 'loading';
            }
        }, this.preloaderTimeout);

        // Mode: default
        if (this.animationMode === 'default'){ 
            setTimeout(() => {
                this.showLightboxAnimation();
            }, this.minTimeout);
        }
    }

    onImageLoaded(){
        // When opening lightbox
        if (this.animationMode === 'zoom-preloader' && 
            this.showState === 'initial-thumbnail-image'){
            this.initialLightboxVirtualImage();
            setTimeout(() => {
                this.currImageLoadingState = 'uploaded';
                this.showLightboxAnimation();
                if (this.properties.hideThumbnail){
                    this.hideThumbnailImage();
                }
            }, this.minTimeout);
        }

        // When opening next / previous image
        if (this.showState === 'animation-end'){
            this.currImageLoadingState = 'uploaded';
            if (this.properties.hideThumbnail){
                this.hideThumbnailImage();
            }
        }

        this.ref.detectChanges();
    }

    onImageError(event){
        this.currImageLoadingState = 'error';
        this.initialLightboxDefault();

        setTimeout(() => {
            this.showLightboxAnimation();
        }, this.minTimeout);
    }

    onContainerClick(event){
        if (event.target === this.lightboxContainerElem.nativeElement || this.simpleMode){
            this.closeLightbox();
        }
    }

    initialLightbox(){
        this.setMaxDimensions();
        this.setAnimationDuration();

        switch (this.animationMode) {
            case 'zoom-preloader':
                this.initialLightboxThumbnailImage();
                break;
            case 'default':
                this.initialLightboxDefault();
                break;
        }
    }

    initialLightboxDefault(){
        this.showState = 'initial-default';
        this.containerStyles = {
            transform: 'translate3d(0, 0, 0)',
            height: '100%',
            width: '100%',
            opacity: '0'
        }
        // next step: AfterViewInit
    }

    initialLightboxVirtualImage(){
        this.setShowState('initial-virtual-image');
        this.containerStyles = {
            transform: this.containerInitialPosition,
            height: this.virtualImageDimension.height + 'px',
            width: this.virtualImageDimension.width + 'px'
        }
        // next step: onImageLoaded() -> showLightboxAnimation()
    }

    initialLightboxThumbnailImage(){
        this.setShowState('initial-thumbnail-image');
        this.containerStyles = {
            transform: this.containerInitialPosition,
            height: this.thumbnailImagePosition.height + 'px',
            width: this.thumbnailImagePosition.width + 'px'
        }
        // next step: onImageLoaded()
    }

    showLightboxAnimation(){
        this.hostAnimation = true;
        this.setShowState('animation');
        this.hostShown = true;
        this.setBackgroundColor();
        this.setAnimationDuration();
        
        // Mode: zoom preloader
        if (this.animationMode === 'zoom-preloader' &&
            this.currImageLoadingState !== 'error'){ 
            this.containerStyles.transform = this.containerFullscreenPosition;
        } 

        // Mode: default
        if (this.animationMode === 'default'){
            this.containerStyles.opacity = '1';
        }
        // next step: handleLightboxTransitionEnd
    }

    showLightboxAnimationEnd(){
        this.setShowState('animation-end');
        this.containerStyles = {
            transform: 'translate3d(0, 0, 0)',
            height: '100%',
            width: '100%',
        }
    }

    closeLightbox(){
        this.setClosingState('initial');
        this.hostShown = false;
        this.closeLightboxInitial();
    }

    closeLightboxInitial(){
        this.setClosingState('initial-styles');

        // Mode: zoom preloader
        if (this.animationMode === 'zoom-preloader'){
            this.containerStyles = {
                transform: this.containerFullscreenPosition,
                height: this.virtualImageDimension.height + 'px',
                width: this.virtualImageDimension.width + 'px',
            }
        }

        // Mode: default
        if (this.animationMode === 'default'){
            this.containerStyles.opacity = '1';
        }

        setTimeout(() => {
            this.closeLightboxAnimation();
        }, this.minTimeout);
    }

    closeLightboxAnimation(){
        this.setClosingState('animation');

        // Mode: zoom preloader
        if (this.animationMode === 'zoom-preloader'){
            this.hostAnimation = true;
            this.containerStyles = {
                transform: this.containerInitialPosition,
                height: this.getContainerHeight(),
                width: this.getContainerWidth(),
            }

            this.hostStyleBackgroundColor = '';
        }

        // Mode: default
        if (this.animationMode === 'default'){
            this.hostAnimation = true;
            this.containerStyles.opacity = '0';
            this.hostStyleBackgroundColor = '';
        }

        this.setAnimationDuration();
        // next step: handleLightboxTransitionEnd

        if (this.animationDuration === 0){ // in the future, change to a type conversion getter
            this.closeLightboxAnimationEnd();
        }
    }

    closeLightboxAnimationEnd(){
        this.setClosingState('animation-end');
        this.events.emit({type: 'close'});

        // Mode: zoom preloader
        if (this.animationMode === 'zoom-preloader'){
            this.showThumbnailImage();
        }
    }

    /*
     * Transition End
     */

    handleLightboxTransitionEnd(event){
        if (this.showState === 'animation'){
            this.showLightboxAnimationEnd();
        }

        // Last close step
        if (this.closingState === 'animation'){
            this.closeLightboxAnimationEnd();
        }
    }

    next(){
        if (this.animationMode === 'zoom-preloader'){
            this.showThumbnailImage();
        }

        if (this.isLastImage){
            if (this.properties.loop){
                this.currentImageIndex = 0;
            } else {
                return;
            }
        } else {
            this.currentImageIndex++;
            this.currImageLoadingState = 'loading';
        }

        setTimeout(() => {
            if (this.currImageLoadingState !== 'uploaded'){
                this.currImageLoadingState = 'loading';
            }
        }, this.preloaderTimeout);
    }

    prev(){
        if (this.animationMode === 'zoom-preloader'){
            this.showThumbnailImage();
        }

        if (this.isFirstImage){
            if (this.properties.loop){
                this.currentImageIndex = this.latestImageIndex;
            } else {
                return;
            }
        } else {
            this.currentImageIndex--;
            this.currImageLoadingState = 'loading';
        }

        setTimeout(() => {
            if (this.currImageLoadingState !== 'uploaded'){
                this.currImageLoadingState = 'loading';
            }
        }, this.preloaderTimeout);
    }

    setMaxDimensions(){
        this.lightboxImage.nativeElement.style.maxHeight = 'calc(' + this.properties.imageMaxHeight + ')';
        this.lightboxImage.nativeElement.style.maxWidth = this.properties.imageMaxWidth;
    }

    handlePinchZoomEvents(event){
        if (event.type === "zoom-in"){
            this.isZoomIn = true;
        }

        if (event.type === "zoom-out"){
            this.isZoomIn = false;
        }
    }

    getContainerWidth():string {
        return this.thumbnailImagePosition.width / this.containerScale + 'px';
    }
} 