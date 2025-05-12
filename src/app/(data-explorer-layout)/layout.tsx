import type { Metadata } from 'next';
// DataExplorerSubNav is already included via the MainLayout's NavBar logic 
// if we correctly structure routing groups, so it might not be needed here explicitly
// if this layout is nested within (main-layout).
// However, if this is a separate top-level route group, then SubNav might be here.
// For now, assuming it's part of the main flow and SubNav is handled by NavBar.

export const metadata: Metadata = {
  title: 'Data Explorer - Emissions Analysis', // Can be more specific
  description: 'Explore detailed emissions data and analysis.',
};

export default function DataExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The NavBar and DataExplorerSubNav are expected to be rendered by the parent (main-layout)
    // This layout can add specific padding or structure for data explorer pages if needed.
    <section className="py-2"> {/* Minimal padding, main layout handles container */}
      {children}
    </section>
  );
}
