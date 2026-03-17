<template>
  <div class="marquee-container">
    <div class="marquee-content">
      <span class="marquee-item" v-for="i in 10" :key="i">
        <span class="marquee-text">NEWHOPE.INC</span>
        <span class="marquee-separator">•</span>
        <span class="marquee-text">STREET RIOT PARADE</span>
        <span class="marquee-separator">•</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  overflow: hidden;
  background-color: var(--accent-red);
  color: rgb(0, 0, 0);
  padding: 1rem 0;
  display: flex;
  white-space: nowrap;
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  position: relative;
  z-index: 10;
}

.marquee-content {
  display: flex;
  animation: marquee 25s linear infinite;
  will-change: transform;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
}

.marquee-text {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1;
  text-transform: uppercase;
  padding: 0 2rem;
}

.marquee-separator {
  font-size: 1.5rem;
  opacity: 0.5;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .marquee-container {
    padding: 0.5rem 0;
  }
  
  .marquee-text {
    font-size: 1.8rem;
    padding: 0 1rem;
    letter-spacing: 0.5px;
  }
  
  .marquee-separator {
    font-size: 1rem;
  }
}
</style>
