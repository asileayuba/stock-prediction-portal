import Marquee from 'react-fast-marquee';

export default function NewsTicker() {
  return (
    <div className="news-ticker-container">
      <Marquee speed={30} autoFill={true} gradient={false} pauseOnHover={true}>
        <span className="news-ticker-msg">
          🚀 <strong>StockAI by Asile</strong> — Built to predict the unpredictable (because guessing is for amateurs). Not financial advice, but we do accept thank-you notes if you strike it rich! 📈
        </span>
      </Marquee>
    </div>
  );
}

