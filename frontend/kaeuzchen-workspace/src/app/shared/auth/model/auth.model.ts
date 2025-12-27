export const AUTH_FEATURE_KEY = 'klAuth';

export type LOGGED_OUT_REASON = 'technical' | 'expired' | 'unauthorized' | 'useraction';

export interface AuthResult {
    expiresAt: number | undefined;
    state: string | undefined;
    nonce: string | undefined;
    idToken: string | undefined;
}

export interface User {
    readonly fullName: string;
    readonly roles: string[];
    readonly anonym: boolean;
}

export interface Session {
    readonly expiresAt: number;
    readonly user: User;
}

const anonymousUser: User = {
    fullName: 'Gast',
    roles: [],
    anonym: true,
};

export const anonymousSession: Session = {
    expiresAt: 0,
    user: anonymousUser,
};
