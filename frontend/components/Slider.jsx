
import { useState, useEffect } from 'react';
import styles from '../styles/Slider.module.css';

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Welcome to Mobiloitte PMS',
      description: 'Streamline your project management with our comprehensive solution',
      image: '/Slider Image/slider1.jpg',
      bgColor: '#4F46E5'
    },
    {
      id: 2,
      title: 'Collaborate Seamlessly',
      description: 'Bring your team together and achieve more with real-time collaboration',
      image: '/Slider Image/slider2.jpg',
      bgColor: '#7C3AED'
    },
    {
      id: 3,
      title: 'Track Progress Efficiently',
      description: 'Monitor project milestones and stay on top of deadlines',
      image: '/Slider Image/slider3.png',
      bgColor: '#2563EB'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            {/* Full-width background image */}
            <div className={styles.slideBackground}>
              <img src={slide.image} alt={slide.title} />
            </div>
            
            {/* Overlay content */}
            <div className={styles.slideOverlay}>
              <div className={styles.slideContent}>
                <h1 className={styles.slideTitle}>{slide.title}</h1>
                <p className={styles.slideDescription}>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
