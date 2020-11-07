import { useAsyncFn } from 'react-use';
import { AsyncFnReturn } from 'react-use/lib/useAsync';

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useTypedAsyncFn<T>(
  callback: (input: T) => Promise<any>,
  deps: any[],
): AsyncFnReturn {
  return useAsyncFn(async (...args: T[]) => {
    await callback(args[0]);
  }, deps);
}

export type EmptyObject = Omit<Record<any, never>, keyof any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
export type NoProps = EmptyObject;

const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isValidEmail = (input: string) => !!input.match(emailRegexp);

const MAC_OS_PLATFORMS = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];

const isDeviceMacOs = () => MAC_OS_PLATFORMS.includes(window.navigator.platform);

const isCtrlOrCmdPressed = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return event.metaKey;
  }
  return event.ctrlKey;
};

const isRedoKeyPadTouched = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return event.key === 'Z';
  }
  return event.key === 'y';
};

export const undoAndRedoHandlerBuilder = (undoAction: () => void, redoAction: () => void) => (
  event: KeyboardEvent,
) => {
  if (event.key === 'z' && isCtrlOrCmdPressed(event)) {
    undoAction();
  }
  if (isRedoKeyPadTouched(event) && isCtrlOrCmdPressed(event)) {
    redoAction();
  }
};

export const deleteHandlerBuilder = (deleteAction: () => void) => (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    deleteAction();
  }
};
