import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Target, Eye, Heart, Users, Award, Globe } from 'lucide-react';
import styles from '../styles/About.module.css';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, delivering quality solutions that exceed expectations.'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We operate with honesty, transparency, and ethical practices in all our business dealings.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and foster a collaborative environment for innovation.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'We continuously innovate and adapt to emerging technologies to stay ahead of the curve.'
    }
  ];

  const team = [
    { name: 'John Doe', role: 'CEO & Founder', image: '/team/ceo.jpg' },
    { name: 'Jane Smith', role: 'CTO', image: '/team/cto.jpg' },
    { name: 'Mike Johnson', role: 'Head of Product', image: '/team/product.jpg' },
    { name: 'Sarah Williams', role: 'Lead Developer', image: '/team/dev.jpg' }
  ];

  return (
    <>
      <Head>
        <title>About Us - Mobiloitte PMS</title>
        <meta name="description" content="Learn about Mobiloitte and our mission" />
      </Head>

      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>About Mobiloitte</h1>
            <p className={styles.heroSubtitle}>
              Transforming Project Management Through Innovation
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className={styles.missionVision}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Target size={40} />
                </div>
                <h2 className={styles.cardTitle}>Our Mission</h2>
                <p className={styles.cardText}>
                  To empower organizations worldwide with cutting-edge project management 
                  tools that streamline workflows, enhance collaboration, and drive success. 
                  We are committed to making project management simple, efficient, and accessible to all.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Eye size={40} />
                </div>
                <h2 className={styles.cardTitle}>Our Vision</h2>
                <p className={styles.cardText}>
                  To be the global leader in project management solutions, recognized for 
                  innovation, reliability, and customer satisfaction. We envision a world 
                  where every team has the tools they need to achieve extraordinary results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className={styles.story}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <div className={styles.storyContent}>
              <p className={styles.storyText}>
                Founded in 2015, Mobiloitte began with a simple yet powerful idea: to create 
                a project management system that truly understands the needs of modern teams. 
                Our founders, experienced software developers and project managers, witnessed 
                firsthand the challenges teams face when managing complex projects.
              </p>
              <p className={styles.storyText}>
                Today, Mobiloitte serves thousands of organizations across 50+ countries, 
                helping them manage millions of projects efficiently. Our platform has evolved 
                from a simple task tracker to a comprehensive project management ecosystem, 
                thanks to continuous innovation and valuable feedback from our users.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <Globe size={32} />
                  <div className={styles.statNumber}>50+</div>
                  <div className={styles.statLabel}>Countries</div>
                </div>
                <div className={styles.stat}>
                  <Users size={32} />
                  <div className={styles.statNumber}>10,000+</div>
                  <div className={styles.statLabel}>Active Users</div>
                </div>
                <div className={styles.stat}>
                  <Award size={32} />
                  <div className={styles.statNumber}>15+</div>
                  <div className={styles.statLabel}>Industry Awards</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className={styles.values}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
            <div className={styles.valuesGrid}>
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className={styles.valueCard}>
                    <div className={styles.valueIcon}>
                      <Icon size={36} />
                    </div>
                    <h3 className={styles.valueTitle}>{value.title}</h3>
                    <p className={styles.valueDescription}>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Meet Our Team</h2>
            <p className={styles.teamDescription}>
              Our diverse team of experts is dedicated to your success
            </p>
            <div className={styles.teamGrid}>
              {team.map((member, index) => (
                <div key={index} className={styles.teamMember}>
                  <div className={styles.teamImage}>
                    <div className={styles.imagePlaceholder}>
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
