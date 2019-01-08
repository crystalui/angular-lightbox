import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxCommonComponent } from './lightbox-common.component';
import { LightboxComponent } from './lightbox.component';
import { LightboxMobileComponent } from './lightbox-mobile.component';
import { CrystalLightbox } from'./lightbox.service' 
import { EventService } from './event.service';
import { PinchZoomComponent } from './pinch-zoom.component'; 
import { LightboxDirective } from'./lightbox.directive';
import { LightboxGroupDirective } from'./lightbox-group.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        LightboxCommonComponent,
        LightboxComponent,
        LightboxMobileComponent,
        PinchZoomComponent,
        LightboxDirective,
        LightboxGroupDirective
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    exports: [
        LightboxDirective,
        LightboxGroupDirective,
        PinchZoomComponent
    ],
    providers: [
        CrystalLightbox,
        EventService
    ],
    bootstrap: [
        
    ],
    entryComponents: [
        LightboxComponent,
        LightboxMobileComponent,
        PinchZoomComponent
    ]
})
export class CrystalLightboxModule { }
