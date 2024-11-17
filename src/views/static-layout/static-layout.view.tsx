
interface StaticLayoutProps {
  children: React.ReactNode;
  // other props go here
}

export function StaticLayout(props: StaticLayoutProps) {
  return (
    <div>
      {props.children}
      {/* rest of your component */}
    </div>
  );
}
