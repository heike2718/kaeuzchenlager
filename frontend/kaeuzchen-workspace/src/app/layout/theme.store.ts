import { inject, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { signalStore, withState, withComputed, withMethods, patchState, withProps, withHooks } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

type Theme = 'light' | 'dark';
export const PREFERRED_THEME_KEY = 'kl-preferred-theme';

interface ThemeState {
    theme: Theme;
    tooltip: string;
}

export const ThemeStore = signalStore(
    { providedIn: 'root' },

    withState<ThemeState>({ theme: 'light', tooltip: 'Design umschalten' }),
    withProps(() => ({
        _doc: inject(DOCUMENT),
    })),
    withComputed(store => ({
        isDark: computed(() => store.theme() === 'dark'),
        icon: computed(() => (store.theme() === 'dark' ? 'light_mode' : 'dark_mode')),
        caption: computed(() => (store.theme() === 'dark' ? 'heller Stil' : 'dunkler Stil')),
        ariaLabel: computed(() =>
            store.theme() === 'dark' ? 'auf hellen Stil umschalten' : 'auf dunklen Stil umschalten'
        ),
    })),
    withMethods(store => ({
        applyToDom() {
            const root = store._doc?.documentElement;
            if (!root) return;
            root.classList.remove('light-theme', 'dark-theme');
            root.classList.add(store.theme() === 'dark' ? 'dark-theme' : 'light-theme');
        },
        persist() {
            try {
                localStorage.setItem(PREFERRED_THEME_KEY, store.theme());
            } catch {
                console.warn('Could not persist theme preference');
            }
        },
        readInitial() {
            let saved = localStorage.getItem(PREFERRED_THEME_KEY) as Theme | null;
            if (!saved || (saved !== 'light' && saved !== 'dark')) {
                saved = 'dark'; // default
            }
            patchState(store, { theme: saved });
            this.applyToDom();
        },
        toggle() {
            const theTheme = store.theme() === 'dark' ? 'light' : 'dark';
            patchState(store, { theme: theTheme });
            this.applyToDom();
            this.persist();
        },
    })),
    withHooks({
        onInit(store) {
            store.readInitial();
        },
    }),
    withDevtools('themeStore')
);
