export type LoadingStateProps = {
  regionLabel: string;
  statusLabel: string;
};

export function LoadingState({ regionLabel, statusLabel }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="skeleton-panel" role="region" aria-label={regionLabel} aria-busy="true">
        <div aria-hidden="true">
          <div className="skeleton-bar" />
          <div className="skeleton-bar short" />
        </div>
      </div>
      <p className="loading-status" role="status" aria-atomic="true">
        {statusLabel}
      </p>
    </div>
  );
}
