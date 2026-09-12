export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">© {year} StockAI. Data provided by Yahoo Finance.</p>
        <p className="footer__disclaimer">
          For informational purposes only. Not financial advice.
        </p>
      </div>
    </footer>
  );
}
