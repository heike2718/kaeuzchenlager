import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessageService],
        });
        service = TestBed.inject(MessageService);
        vi.useFakeTimers(); // Fake Timer für setTimeout
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.clearAllMocks();
        service.clear();
    });

    describe('info', () => {
        it('should set info message with default dismiss timeout', () => {
            // arrange
            const text = 'Test info message';

            // act
            service.info(text);

            // assert
            const message = service.message();
            expect(message).not.toBeNull();
            expect(message?.type).toBe('info');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBe(3000);
        });

        it('should set info message with custom dismiss timeout', () => {
            // arrange
            const text = 'Test info message';
            const customTimeout = 2000;

            // act
            service.info(text, customTimeout);

            // assert
            const message = service.message();
            expect(message?.dismissAfterMs).toBe(customTimeout);
        });

        it('should auto-clear info message after dismiss timeout', () => {
            // arrange
            const text = 'Test info message';

            // act
            service.info(text, 4000);

            // assert before timeout
            expect(service.message()).not.toBeNull();

            // Zeit vorrücken
            vi.advanceTimersByTime(4000);

            // assert after timeout
            expect(service.message()).toBeNull();
        });

        it('should not auto-clear if message was changed before timeout', () => {
            // arrange
            const firstText = 'First message';
            const secondText = 'Second message';

            // act
            service.info(firstText, 4000);
            const firstMessage = service.message();

            // Message ändern bevor Timeout abläuft
            vi.advanceTimersByTime(2000);
            service.info(secondText, 4000);

            // Timeout der ersten Message ablaufen lassen
            vi.advanceTimersByTime(2000); // Jetzt bei 4000ms total

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.text).toBe(secondText);
            expect(service.message()).not.toBe(firstMessage);
        });
    });

    describe('warn', () => {
        it('should set warn message without auto-dismiss', () => {
            // arrange
            const text = 'Test warning message';

            // act
            service.warn(text);

            // assert
            const message = service.message();
            expect(message?.type).toBe('warn');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBeUndefined();

            // Kein Timeout sollte gesetzt sein
            vi.advanceTimersByTime(10000);
            expect(service.message()).not.toBeNull();
        });
    });

    describe('error', () => {
        it('should set error message without auto-dismiss', () => {
            // arrange
            const text = 'Test error message';

            // act
            service.error(text);

            // assert
            const message = service.message();
            expect(message?.type).toBe('error');
            expect(message?.text).toBe(text);
            expect(message?.dismissAfterMs).toBeUndefined();

            // Kein Timeout sollte gesetzt sein
            vi.advanceTimersByTime(10000);
            expect(service.message()).not.toBeNull();
        });
    });

    describe('clear', () => {
        it('should clear current message', () => {
            // arrange
            service.info('Test message');
            expect(service.message()).not.toBeNull();

            // act
            service.clear();

            // assert
            expect(service.message()).toBeNull();
        });

        it('should not throw when clearing already cleared message', () => {
            // act & assert
            expect(() => service.clear()).not.toThrow();
        });
    });

    describe('message signal', () => {
        it('should initially be null', () => {
            expect(service.message()).toBeNull();
        });

        it('should update when message changes', () => {
            // act & assert
            service.info('First message');
            expect(service.message()?.text).toBe('First message');

            service.warn('Second message');
            expect(service.message()?.text).toBe('Second message');

            service.clear();
            expect(service.message()).toBeNull();

            service.error('Third message');
            expect(service.message()?.text).toBe('Third message');
        });
    });

    describe('edge cases', () => {
        it('should handle multiple rapid calls correctly', () => {
            // arrange
            vi.spyOn(window, 'setTimeout');

            // act
            service.info('Message 1', 1000);
            service.info('Message 2', 2000);
            service.warn('Message 3');
            service.info('Message 4', 3000);

            // assert
            expect(service.message()?.text).toBe('Message 4');
            // Timeouts sollten gesetzt worden sein
            expect(setTimeout).toHaveBeenCalledTimes(3);
        });

        it('should not auto-dismiss warn messages', () => {
            // arrange
            service.warn('Warning message');

            // act
            vi.advanceTimersByTime(60000);

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.type).toBe('warn');
        });

        it('should not auto-dismiss error messages', () => {
            // arrange
            service.error('Error message');

            // act
            vi.advanceTimersByTime(60000);

            // assert
            expect(service.message()).not.toBeNull();
            expect(service.message()?.type).toBe('error');
        });

        it('should not clear new message when old timeout fires', () => {
            // Dieser Test stellt sicher, dass wenn:
            // 1. Message A gesetzt wird mit Auto-Dismiss
            // 2. Message B gesetzt wird, bevor A's Timeout abläuft
            // 3. Dann A's Timeout abläuft
            // → Message B sollte NICHT gelöscht werden

            // arrange
            service.info('Message A', 1000);

            // 500ms später wechseln wir zu Message B
            vi.advanceTimersByTime(500);
            service.warn('Message B'); // Kein Auto-Dismiss

            // act - Jetzt läuft der Timeout von Message A ab
            vi.advanceTimersByTime(500);

            // assert - Message B sollte noch da sein
            expect(service.message()?.text).toBe('Message B');
            expect(service.message()?.type).toBe('warn');
        });

        it('should clear message when timeout fires and no new message was set', () => {
            // Wenn keine neue Message gesetzt wurde, sollte die alte gelöscht werden

            // arrange
            service.info('Standalone message', 1000);

            // act - Timeout komplett ablaufen lassen
            vi.advanceTimersByTime(1000);

            // assert - Message sollte gelöscht sein
            expect(service.message()).toBeNull();
        });
    });
});
