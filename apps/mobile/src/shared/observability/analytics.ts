/** Funnel analytics interface — the product thesis is drop-off reduction, so events are first-class. */
export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}
export interface Analytics {
  track(event: AnalyticsEvent): void;
  identify(userId: string): void;
}

// No-op until a provider (Amplitude/Segment) is wired in Phase 1.
export const analytics: Analytics = {
  track: () => {},
  identify: () => {},
};
