import { Directive, HostBinding, ContentChildren, QueryList, ElementRef } from '@angular/core';
import { EventService } from './event.service';
import { LightboxDirective } from'./lightbox.directive' 
import { CrystalLightbox } from'./lightbox.service';
import { Properties, ImageExtended } from './interfaces';

@Directive({
    selector: '[lightbox-group]'
})

export class LightboxGroupDirective {
    thumbnailImageElement;
    thumbnailLightboxDirective: LightboxDirective;
    thumbnailImageIndex: number;
    thumbnailImages = [];
    images = [];
    properties: Properties = {}; 
    globalEventsSubscription;

    get lightboxDirectiveList(){
        if (this._lightboxDirectiveList){
            return this._lightboxDirectiveList.toArray();
        } else {
            return [];
        }
    }

    @HostBinding('class.lightbox-group') hostLightboxGroup: boolean = true;
    @ContentChildren(LightboxDirective, {descendants: true}) _lightboxDirectiveList: QueryList<LightboxDirective>; 
    constructor(
        private eventService: EventService,
        private lightbox: CrystalLightbox) {

        this.globalEventsSubscription = this.eventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event); 
            }
        );
    }

    handleGlobalEvents(event){
        if (event.type === 'thumbnail:click'){
            this.thumbnailImageElement = event.elementRef.nativeElement;
            this.thumbnailImages = this.getThumbnailImages();
            this.thumbnailImageIndex = this.getThumbnailImageIndex(this.thumbnailImageElement);

            if (this.thumbnailImageIndex == undefined){
                return;
            }

            this.thumbnailLightboxDirective = this.getThumbnailLightboxDirective(this.thumbnailImageIndex);
            this.images = this.getImages();
            this.properties = event.properties;
            this.properties.index = this.thumbnailImageIndex;

            this.lightbox.open({
                images: this.images,
                //index: this.thumbnailImageIndex,
                properties: this.properties
            });
        }
    }

    getThumbnailImageIndex(element){
        const images = this.thumbnailImages;
        for (var i = 0; i < images.length; i++) {
            if (element === images[i]){
                return i;
            }
        }
    }

    getThumbnailLightboxDirective(index){
        return this.lightboxDirectiveList[index];
    }

    getThumbnailImages(){
        let thumbnailImages = [];
        this.lightboxDirectiveList.forEach(el => {
            thumbnailImages.push(el['elementRef'].nativeElement);
        });
        return thumbnailImages;
    }

    getImages(){
        let images = [];
        this.lightboxDirectiveList.forEach(el => {
            let image: ImageExtended = {};
            const nativeElement = el['elementRef'].nativeElement;

            if (el.fullImage){
                image.fullImage = el.fullImage;
            }

            image.thumbnailImage = {
                path: nativeElement.src,
                height: nativeElement.naturalHeight,
                width: nativeElement.naturalWidth
            }

            image.nativeElement = nativeElement;
            images.push(image);
        });

        return images;
    }
}
