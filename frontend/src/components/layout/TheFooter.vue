<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <div class="brand" style="color: white; margin-bottom: 1.5rem; font-size: 1.5rem;">
          Hotel<span class="brand-accent">App</span>
        </div>
        <p>Votre confort est notre priorité. Vivez le meilleur séjour avec nous.</p>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">Liens Rapides</h4>
        <ul>
          <li><RouterLink to="/">Accueil</RouterLink></li>
          <li><RouterLink to="/rooms">Chambres</RouterLink></li>
          <li><RouterLink to="/login">Connexion</RouterLink></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">Contact</h4>
        <p>Nouakchott, Mauritanie</p>
        <p>+222 44076356</p>
        <p>hotelapp023@gmail.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Hotel App. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-primary);
  color: white;
  padding-top: var(--spacing-2xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
}

.footer-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-secondary);
}

.footer-heading {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
  color: white;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: var(--spacing-sm);
}

.footer-section a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: white;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-xs);
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: var(--spacing-md);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
