import { Component, inject } from '@angular/core';
import { MessageService } from './message.service';

@Component({
    selector: 'kl-message-component',
    imports: [],
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
    standalone: true,
})
export class MessageComponent {
    messageService = inject(MessageService);
}
