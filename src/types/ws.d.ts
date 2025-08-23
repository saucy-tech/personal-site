declare module 'ws' {
  import { EventEmitter } from 'events';

  class WebSocket extends EventEmitter {
    constructor(address: string | URL, options?: WebSocket.ClientOptions);

    static readonly CONNECTING: 0;
    static readonly OPEN: 1;
    static readonly CLOSING: 2;
    static readonly CLOSED: 3;

    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;

    readyState: 0 | 1 | 2 | 3;
    url: string;
    protocol: string;
    extensions: string;

    // Browser WebSocket compatibility
    binaryType: 'blob' | 'arraybuffer';
    bufferedAmount: number;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    onerror: ((this: WebSocket, ev: Event) => any) | null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
    onopen: ((this: WebSocket, ev: Event) => any) | null;

    close(code?: number, reason?: string | Buffer): void;
    ping(data?: any, mask?: boolean, callback?: (error: Error) => void): void;
    pong(data?: any, mask?: boolean, callback?: (error: Error) => void): void;
    send(data: any, options?: WebSocket.SendOptions, callback?: (error?: Error) => void): void;
    terminate(): void;

    addEventListener(
      method: 'message' | 'close' | 'error' | 'open',
      listener: (event: any) => void
    ): void;
    removeEventListener(
      method: 'message' | 'close' | 'error' | 'open',
      listener: (event: any) => void
    ): void;

    on(event: 'close', listener: (code: number, reason: string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
    on(event: 'message', listener: (data: Buffer, isBinary: boolean) => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;

    once(event: 'close', listener: (code: number, reason: string) => void): this;
    once(event: 'error', listener: (err: Error) => void): this;
    once(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
    once(event: 'message', listener: (data: Buffer, isBinary: boolean) => void): this;
    once(event: 'open', listener: () => void): this;
    once(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    off(event: 'close', listener: (code: number, reason: string) => void): this;
    off(event: 'error', listener: (err: Error) => void): this;
    off(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
    off(event: 'message', listener: (data: Buffer, isBinary: boolean) => void): this;
    off(event: 'open', listener: () => void): this;
    off(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;

    addListener(event: 'close', listener: (code: number, reason: string) => void): this;
    addListener(event: 'error', listener: (err: Error) => void): this;
    addListener(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
    addListener(event: 'message', listener: (data: Buffer, isBinary: boolean) => void): this;
    addListener(event: 'open', listener: () => void): this;
    addListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;

    removeListener(event: 'close', listener: (code: number, reason: string) => void): this;
    removeListener(event: 'error', listener: (err: Error) => void): this;
    removeListener(event: 'upgrade', listener: (request: IncomingMessage) => void): this;
    removeListener(event: 'message', listener: (data: Buffer, isBinary: boolean) => void): this;
    removeListener(event: 'open', listener: () => void): this;
    removeListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  }

  namespace WebSocket {
    interface ClientOptions {
      protocol?: string;
      followRedirects?: boolean;
      handshakeTimeout?: number;
      perMessageDeflate?: boolean | PerMessageDeflateOptions;
      localAddress?: string;
      protocolVersion?: number;
      headers?: { [key: string]: string };
      origin?: string;
      agent?: any;
      host?: string;
      family?: number;
      checkServerIdentity?: (servername: string, cert: any) => boolean;
      rejectUnauthorized?: boolean;
      maxRedirects?: number;
    }

    interface PerMessageDeflateOptions {
      serverMaxWindowBits?: number;
      clientMaxWindowBits?: number;
      serverMaxNoContextTakeover?: boolean;
      clientMaxNoContextTakeover?: boolean;
      threshold?: number;
      concurrencyLimit?: number;
      zlibDeflateOptions?: any;
      zlibInflateOptions?: any;
    }

    interface SendOptions {
      mask?: boolean;
      binary?: boolean;
      compress?: boolean;
      fin?: boolean;
    }
  }

  export = WebSocket;
}
