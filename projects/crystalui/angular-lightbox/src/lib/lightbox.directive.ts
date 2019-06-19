import { Directive, ElementRef, Input, Output, HostListener, HostBinding, OnInit, EventEmitter } from '@angular/core';
import { EventService } from './event.service';
import { CrystalLightbox } from'./lightbox.service';
import { Properties, ImageExtended, Image } from './interfaces';

@Directive({
    selector: '[lightbox]'
})

export class LightboxDirective {

    globalEventsSubscription;
    image: ImageExtended;
    @Input() fullImage: Image;
    @Input() properties: Properties = {};
    @Input() loop: boolean;
    @Input() backgroundOpacity: number;
    @Input() counter: boolean;
    @Input() imageMaxHeight: string;
    @Input() imageMaxWidth: string;
    @Input() animationDuration: number;
    @Input() animationMode: 'default' | 'zoom' | 'zoom-blur' | 'zoom-preloader' | 'opacity' | 'none'; 
    @Input() animationTimingFunction: string;
    @Input() closeButtonText: string;
    @Input() counterSeparator: string;
    @Input() disable: boolean;
    @Input() simpleMode: boolean;
    @Input() backgroundColor: 'black' | 'white';
    @Input() hideThumbnail: boolean;
    @Input() gestureEnable: boolean;

    @Output() events: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class.lightbox-single') hostLightboxGroup: boolean = true;
    @HostBinding('class.lightbox-simple-mode') 
    get hostSimpleMode(){
        return this.simpleMode;
    }

    get isGroupImage():boolean {
        return this.elementRef.nativeElement.closest(".lightbox-group");
    }

    constructor( 
        private lightbox: CrystalLightbox, 
        private eventService: EventService,
        private elementRef: ElementRef) {
        this.globalEventsSubscription = this.eventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event);
            }
        );
    }

    @HostListener('click', ['$event'])
    onClick(event){
        if (this.disable){
            return;
        }

        if (this.isGroupImage){
            this.eventService.emitChangeEvent({
                type: 'thumbnail:click',
                elementRef: this.elementRef,
                properties: this.properties
            });
        } else {
            this.image = this.getImage();

            this.lightbox.open({
                images: [this.image],
                properties: this.properties,
                index: 0
            });
        }
    }

    ngOnChanges(changes) {
        this.properties = Object.assign({}, this.properties, this.getProperties(changes));
    }

    handleGlobalEvents(event){
        this.events.emit(event);
    }

    getImage(){
        let image: ImageExtended = {};
        const nativeElement = this.elementRef.nativeElement;

        if (this.fullImage){
            image.fullImage = this.fullImage;
        }

        image.thumbnailImage = {
            path: nativeElement.src,
            height: nativeElement.naturalHeight,
            width: nativeElement.naturalWidth
        }

        image.nativeElement = nativeElement;
        return image;
    };

    getProperties(changes){
        let properties = {};

        for (var prop in changes) {
            if (prop !== 'fullImage'){
                properties[prop] = changes[prop].currentValue;
            }
        }
        return properties;
    }
}
