// src/app/theme.store.ts
import { inject, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
    signalStore,
    withState,
    withComputed,
    withMethods,
    patchState,
    withProps,
    withHooks,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

type Theme = 'light' | 'dark';
const KEY = 'preferred-theme';

interface ThemeState {
    theme: Theme;
}

export const ThemeStore = signalStore(
    { providedIn: 'root' },

    withState<ThemeState>({ theme: 'light' }),
    withProps((_store) => ({
        _doc: inject(DOCUMENT),
    })),
    withComputed((store) => ({
        isDark: computed(() => store.theme() === 'dark'),
    })),
    withMethods((store) => ({
        applyToDom() {
            const root = store._doc?.documentElement;
            if (!root) return;
            root.classList.remove('light-theme', 'dark-theme');
            root.classList.add(store.theme() === 'dark' ? 'dark-theme' : 'light-theme');
        },
        persist() {
            try {
                localStorage.setItem(KEY, store.theme());
            } catch { }
        },
        readInitial() {
            let saved = localStorage.getItem(KEY) as Theme | null;
            if (!saved) {
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
        }
    })),
    withHooks({
        onInit(store) {
            store.readInitial();
        }
    }),
    withDevtools('themeStore')
);
