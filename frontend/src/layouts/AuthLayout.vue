<template>
  <div class="auth-page">
    <div class="auth-visual">
      <div class="visual-overlay"></div>
      <div class="visual-content">
        <div class="brand-logo">
          <span class="logo-text">HotelApp</span>
        </div>
        <div class="visual-text">
          <h2 class="playfair">{{ $t('auth.visual_title') }}</h2>
          <p>{{ $t('auth.visual_subtitle') }}</p>
        </div>

      </div>
    </div>
    <div class="auth-form-container">
      <div class="form-wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}

.auth-visual {
  flex: 1.2;
  position: relative;
  background-image: url('/auth-bg.png'); /* Using correctly named background image */
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem;
  color: white;
  overflow: hidden;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(26, 42, 68, 0.6) 0%, rgba(26, 42, 68, 0.2) 100%);
}

.visual-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-logo {
  margin-bottom: 2rem;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: white;
}

.visual-text {
  max-width: 480px;
}

.visual-text h2 {
  font-size: 3rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.visual-text p {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.auth-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: white;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .auth-visual {
    display: none;
  }
  .auth-form-container {
    flex: 1;
  }
}
</style>
