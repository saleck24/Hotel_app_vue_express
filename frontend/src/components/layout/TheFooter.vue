<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <div class="brand" style="color: white; margin-bottom: 1.5rem; font-size: 1.5rem;">
          Hotel<span class="brand-accent">App</span>
        </div>
        <p>{{ $t('footer.about') }}</p>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">{{ $t('footer.links') }}</h4>
        <ul>
          <li><RouterLink to="/">{{ $t('nav.home') }}</RouterLink></li>
          <li><RouterLink to="/rooms">{{ $t('nav.rooms') }}</RouterLink></li>
          <li><RouterLink to="/login">{{ $t('nav.login') }}</RouterLink></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">{{ $t('footer.contact') }}</h4>
        <p>{{ $t('footer.location') }}</p>
        <p>+222 43455259</p>
        <p>hotelapp023@gmail.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Hotel App. {{ $t('footer.rights') }}</p>
    </div>

  </footer>
</template>
<script setup>
</script>

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
