// Module declarations for Next.js 16 (which ships types via TypeScript plugin, not .d.ts files)
// These stubs prevent TS7016 "Could not find declaration file" errors when running tsc directly.
// At runtime and during Next.js builds, the real types are provided by the Next.js TypeScript plugin.

declare module 'next' {
  import type { NextConfig } from 'next/types';
  export type { NextConfig };

  export interface Metadata {
    title?: string;
    description?: string;
    manifest?: string;
    appleWebApp?: {
      capable?: boolean;
      statusBarStyle?: string;
      title?: string;
    };
    icons?: {
      icon?: string;
      apple?: string;
    };
    [key: string]: unknown;
  }

  export interface Viewport {
    themeColor?: string;
    width?: string;
    initialScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    [key: string]: unknown;
  }

  export default function next(options?: Record<string, unknown>): unknown;
}

declare module 'next/server' {
  export class NextRequest extends Request {
    readonly url: string;
    readonly nextUrl: URL;
    readonly headers: Headers;
    readonly method: string;
    readonly cookies: {
      get(name: string): { value: string } | undefined;
      set(name: string, value: string): void;
    };
    readonly searchParams?: URLSearchParams;
  }

  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    readonly cookies: {
      get(name: string): { value: string } | undefined;
      set(name: string, value: string): void;
    };
  }
}

declare module 'next/font/google' {
  interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    style?: string | string[];
    variable?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  }

  type FontResult = {
    className: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
    variable?: string;
  };

  export function Inter(options: FontOptions): FontResult;
  export function Roboto(options: FontOptions): FontResult;
  export function Outfit(options: FontOptions): FontResult;
  export function Poppins(options: FontOptions): FontResult;
  export function Nunito(options: FontOptions): FontResult;
  export function Geist(options: FontOptions): FontResult;
  export function Geist_Mono(options: FontOptions): FontResult;
}

declare module 'next/types' {
  export interface NextConfig {
    reactStrictMode?: boolean;
    experimental?: Record<string, unknown>;
    images?: Record<string, unknown>;
    [key: string]: unknown;
  }
}

declare module 'next/types.js' {
  export type ResolvingMetadata = Promise<Record<string, unknown>>;
  export type ResolvingViewport = Promise<Record<string, unknown>>;
}

declare module 'next/server.js' {
  export { NextRequest, NextResponse } from 'next/server';
}

