import { Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef } from '@angular/core';
import { LightboxComponent } from './lightbox.component';
import { Properties, LightboxData } from './interfaces';
import { DefaultProperties } from './default-properties';

export interface AdComponent {
	lightboxData: LightboxData; 
	events: any;
}

@Injectable()
export class CrystalLightbox {
	isMobile: boolean;
	_defaultProperties: Properties;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector){ 
	}
 
	appendComponentToBody(component: any, lightboxData: LightboxData) {		
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this.injector);

		(<AdComponent>componentRef.instance).lightboxData = lightboxData;

		this.appRef.attachView(componentRef.hostView);
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

		// Add to body
		document.body.appendChild(domElem);
		
        (<AdComponent>componentRef.instance).events.subscribe((event) => {
        	if (event.type === 'close'){
				this.appRef.detachView(componentRef.hostView);
				componentRef.destroy();
			}
        });
	}


	open(lightboxData: LightboxData){
		lightboxData.properties = this.applyPropertieDefaults(DefaultProperties, lightboxData.properties);
        let component = this.getLightboxComponent();
		this.appendComponentToBody(component, lightboxData);
	}

	getLightboxComponent(){
		return LightboxComponent;
	}

	applyPropertieDefaults(defaultProperties, properties){
		if (!properties) {
			properties = {};
		}

		if (!properties.index){ 
			properties.index = 0;
		}
		this._defaultProperties = Object.assign({}, defaultProperties);
		return Object.assign(this._defaultProperties, properties);
	}
}