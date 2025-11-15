import styles from '../styles/SummaryCards.module.css';

export default function SummaryCards({ cards = [] }) {
  return (
    <div className={styles.summaryGrid}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={styles.card}>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: card.bgColor }}
            >
              <Icon size={24} color={card.iconColor || '#ffffff'} />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.label}>{card.label}</p>
              <h3 className={styles.value}>{card.value}</h3>
              {card.change && (
                <p
                  className={`${styles.change} ${
                    card.change > 0 ? styles.positive : styles.negative
                  }`}
                >
                  {card.change > 0 ? '+' : ''}{card.change}% from last month
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
