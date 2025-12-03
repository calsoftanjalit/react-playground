declare module 'drift-zoom' {
  interface DriftOptions {
    paneContainer?: HTMLElement;
    inlinePane?: boolean;
    hoverBoundingBox?: boolean;
    containInline?: boolean;
    zoomFactor?: number;
    // Add any other options you need from Drift docs
  }

  export default class Drift {
    constructor(trigger: HTMLElement, options?: DriftOptions);
    disable(): void;
    enable(): void;
    teardown(): void;
  }
}
