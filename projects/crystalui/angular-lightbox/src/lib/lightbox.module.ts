import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxCommonComponent } from './lightbox-common.component';
import { LightboxComponent } from './lightbox.component';
import { CrystalLightbox } from'./lightbox.service' 
import { EventService } from './event.service';
import { LightboxDirective } from'./lightbox.directive';
import { LightboxGroupDirective } from'./lightbox-group.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        LightboxCommonComponent,
        LightboxComponent,
        LightboxDirective,
        LightboxGroupDirective
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule
    ],
    exports: [
        LightboxDirective,
        LightboxGroupDirective
    ],
    providers: [
        CrystalLightbox,
        EventService
    ],
    bootstrap: [
        
    ],
    entryComponents: [
        LightboxComponent
    ]
})
export class CrystalLightboxModule { }
