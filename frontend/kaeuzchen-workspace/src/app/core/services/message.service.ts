import { Injectable, signal } from '@angular/core';
import { AppMessage } from '@core/model';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    readonly message = signal<AppMessage | null>(null);

    info(text: string, dismissAfterMs = 3000): void {
        this.#show({ type: 'info', text, dismissAfterMs });
    }

    warn(text: string): void {
        this.#show({ type: 'warn', text });
    }

    error(text: string): void {
        this.#show({ type: 'error', text });
    }

    clear(): void {
        this.message.set(null);
    }

    #show(msg: AppMessage): void {
        this.message.set(msg);

        if (msg.type === 'info' && msg.dismissAfterMs) {
            window.setTimeout(() => {
                // Nur löschen, wenn noch dieselbe Message angezeigt wird
                if (this.message() === msg) {
                    this.clear();
                }
            }, msg.dismissAfterMs);
        }
    }
}
