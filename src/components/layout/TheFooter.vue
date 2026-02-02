<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <h3 class="footer-title">Hotel App</h3>
        <p>Your comfort is our priority. Experience the best stay with us.</p>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">Quick Links</h4>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/rooms">Rooms</RouterLink></li>
          <li><RouterLink to="/login">Login</RouterLink></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4 class="footer-heading">Contact</h4>
        <p>Nouakchott, Mauritanie</p>
        <p>+222 44076356</p>
        <p>moussamedwedouderebih@gmail.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Hotel App. All rights reserved.</p>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
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
