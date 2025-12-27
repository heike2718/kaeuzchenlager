import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '@core/services';

@Component({
    selector: 'kl-loading-indicator',
    imports: [MatProgressSpinnerModule],
    templateUrl: './loading-indicator.component.html',
    styleUrl: './loading-indicator.component.scss',
})
export class LoadingIndicatorComponent {
    loadingService = inject(LoadingService);
}
