import { state } from 'lit-element';
import { delay } from '../common/utils';

declare type PendingStateEventData = {
  promise: Promise<void>;
};

declare type PendingStateErrorEventData = {
  message?: string;
  error: Error;
};

export enum PendingStateEvents {
  state = 'pending-state',
  error = 'pending-state-error',
}

export declare type PendingStateEvent = CustomEvent<PendingStateEventData>;
export declare type PendingStateErrorEvent = CustomEvent<PendingStateErrorEventData>;

declare global {
  interface HTMLElementEventMap {
    [PendingStateEvents.state]: PendingStateEvent;
    [PendingStateEvents.error]: PendingStateErrorEvent;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = { new (...args: any[]): T };

export interface CustomElement extends HTMLElement {
  connectedCallback(): void;
  disconnectedCallback(): void;
}

/**
 * Pending container mixin (pattern).
 *
 * @param base The base class to extend
 * @param promiseDelay An optional delay (in ms) to wait after the pending state promise has been resolved
 */
// We cannot use a named export here since Typescript seems to have trouble with mixins
// @see https://github.com/microsoft/TypeScript/issues/30355#issuecomment-671095933
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default <C extends Constructor<CustomElement>>(base: C, promiseDelay = 0) => {
  class PendingContainerMixin extends base {
    @state()
    _hasPendingChildren = false;

    @state()
    pendingCount = 0;

    @state()
    resolvedCount = 0;

    get progress() {
      return this.resolvedCount / this.pendingCount;
    }

    get hasPendingChildren() {
      return this._hasPendingChildren;
    }

    connectedCallback() {
      this.addEventListener(PendingStateEvents.state, this.onPendingState);
      super.connectedCallback();
    }

    disconnectedCallback() {
      this.removeEventListener(PendingStateEvents.state, this.onPendingState);
      super.disconnectedCallback();
    }

    async onPendingState(e: PendingStateEvent) {
      const { promise } = e.detail;
      if (promise) {
        this._hasPendingChildren = true;
        this.pendingCount++;
        try {
          await promise;
          await delay(promiseDelay);
        } catch (error) {
          this.dispatchEvent(
            new CustomEvent(PendingStateEvents.error, {
              composed: true,
              bubbles: true,
              detail: {
                message: `Error in pending-state promise: ${error}`,
                error,
              },
            }),
          );
        } finally {
          this.resolvedCount++;
          if (this.pendingCount === this.resolvedCount) {
            this._hasPendingChildren = false;
          }
        }
      }
    }
  }

  return PendingContainerMixin;
};
