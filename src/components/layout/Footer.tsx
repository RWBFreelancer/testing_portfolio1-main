export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Reynaldo W. Binay-an</p>
        <p>Baguio City, PH</p>
      </div>
    </footer>
  );
}
