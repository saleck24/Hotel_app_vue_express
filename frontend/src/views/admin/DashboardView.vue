<template>
  <div class="admin-dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Occupancy Rate</h3>
        <p class="stat-value">75%</p>
        <span class="stat-trend">+5% from last month</span>
      </div>
      <div class="stat-card">
        <h3>Provisional Revenue</h3>
        <p class="stat-value">$12,450</p>
        <span class="stat-trend text-success">Total generated</span>
      </div>
      <div class="stat-card">
        <h3>Pending Reservations</h3>
        <p class="stat-value">3</p>
        <RouterLink to="/admin/reservations" class="stat-link">Review now</RouterLink>
      </div>
      <div class="stat-card">
        <h3>Average Rating</h3>
        <p class="stat-value">4.8</p>
        <span class="stat-sub">Based on 120 reviews</span>
      </div>
    </div>

    <div class="recent-reservations">
      <h3>Recent Booking Requests</h3>
      <p class="placeholder-text">Table of recent bookings will go here...</p>
      <!-- Normally a data table here -->
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.stat-card h3 {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.stat-trend {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.text-success { color: var(--color-success); }

.recent-reservations {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  min-height: 300px;
}

.placeholder-text {
  color: var(--color-text-muted);
  font-style: italic;
  margin-top: var(--spacing-md);
}
</style>
