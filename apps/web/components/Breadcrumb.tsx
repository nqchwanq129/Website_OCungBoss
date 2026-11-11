export type BreadcrumbProps = {
  ancestors: readonly { label: string; href: string }[];
  currentLabel: string;
  label?: string;
};

export function Breadcrumb({ ancestors, currentLabel, label = 'Đường dẫn phân cấp' }: BreadcrumbProps) {
  if (
    !label.trim() ||
    !currentLabel.trim() ||
    ancestors.some(
      (item) =>
        !item.label.trim() || !item.href.startsWith('/') || item.href.startsWith('//') || /[\\\s]/.test(item.href),
    )
  ) {
    throw new Error('Breadcrumb requires named labels and local absolute paths');
  }

  return (
    <nav className="breadcrumb" aria-label={label}>
      <ol role="list">
        {ancestors.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            <a href={item.href}>{item.label}</a>
            <span className="breadcrumb-separator" aria-hidden="true">
              /
            </span>
          </li>
        ))}
        <li>
          <span aria-current="page">{currentLabel}</span>
        </li>
      </ol>
    </nav>
  );
}
