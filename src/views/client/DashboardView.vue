<template>
  <div class="dashboard-home">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Reservations</h3>
        <p class="stat-value">0</p>
      </div>
       <div class="stat-card">
        <h3>Pending Reviews</h3>
        <p class="stat-value">0</p>
      </div>
    </div>

    <div class="recent-section">
      <h3>Recent Activity</h3>
      <p>No recent activity.</p>
      <RouterLink to="/rooms" class="btn btn-primary mt-4">Book a Room</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.recent-section {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.mt-4 { margin-top: var(--spacing-md); }
</style>
