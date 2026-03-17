<script>
export default {

  data() {
    return {
      dataKolektixNewHope: {},
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  },

  async mounted() {
    try {
      const response = await fetch("https://api.kolektix.com/api/event/street-riot-parade")
      const data = await response.json()
      console.log("DATA API:", data)
      this.dataKolektixNewHope = data.data
      this.startCountdown()
    } catch (err) {
      console.log("ERROR:", err)
    }
  },

  methods: {
    startCountdown() {
      const eventDate = new Date(
        this.dataKolektixNewHope.start_date + "T" + this.dataKolektixNewHope.start_time
      )
      setInterval(() => {
        const now = new Date()
        const diff = eventDate - now
        if (diff <= 0) return
        this.countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24))
        this.countdown.hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        this.countdown.minutes = Math.floor((diff / (1000 * 60)) % 60)
        this.countdown.seconds = Math.floor((diff / 1000) % 60)
      }, 1000)
    }
  }

}
</script>

<template>
<section id="tentang" class="about">
  <div class="container about-container">

    <!-- TOP ROW: title left, countdown right -->
    <div class="top-row">
      <div class="title-group">
        <span class="sub-title">MUSIK</span>
        <h1 class="main-title" v-if="dataKolektixNewHope.name">{{ dataKolektixNewHope.name }}</h1>
      </div>

      <div class="countdown-group" v-if="dataKolektixNewHope.start_date">
        <span class="countdown-label">Event Dimulai Dalam</span>
        <div class="countdown">
          <div class="time-box">
            <span class="val">{{ countdown.days }}</span>
            <span class="lbl">Hari</span>
          </div>
          <div class="time-box">
            <span class="val">{{ countdown.hours }}</span>
            <span class="lbl">Jam</span>
          </div>
          <div class="time-box">
            <span class="val">{{ countdown.minutes }}</span>
            <span class="lbl">Menit</span>
          </div>
          <div class="time-box">
            <span class="val">{{ countdown.seconds }}</span>
            <span class="lbl">Detik</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT: poster left, detail card right -->
    <div class="main-grid">
      <div class="poster-col">
        <div class="poster-wrapper">
          <img
            v-if="dataKolektixNewHope.image_url"
            :src="dataKolektixNewHope.image_url"
            alt="Event Poster"
            class="poster-image"
          />
        </div>
        <!-- social row below poster -->
        <div class="social-row" v-if="dataKolektixNewHope.organizer">
          <div class="social-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span class="social-handle">{{ dataKolektixNewHope.organizer }}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="share-icon">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </div>
      </div>

      <!-- DETAIL CARD -->
      <div class="detail-card">
        <div class="meta-list" v-if="dataKolektixNewHope">
          <!-- TANGGAL -->
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{{ new Date(dataKolektixNewHope.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
          </div>

          <!-- JAM -->
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ dataKolektixNewHope.start_time }} - {{ dataKolektixNewHope.end_time }} {{ dataKolektixNewHope.zone_time }}</span>
          </div>

          <!-- LOKASI -->
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{{ dataKolektixNewHope.location_name }}</span>
          </div>
        </div>

        <!-- ORGANIZER -->
        <div class="organizer-block">
          <p class="org-label">Diselenggarakan Oleh</p>
          <h3 class="org-name">{{ dataKolektixNewHope.organizer || "NEWHOPE INC." }}</h3>
        </div>

        <!-- ACTIONS -->
        <div class="action-buttons">
          <!-- <a href="#" class="btn-chat">Chat</a> -->
          <a href="https://kolektix.com/event/street-riot-parade" target="_blank" class="btn-ticket">Beli Tiket</a>
        </div>
      </div>
    </div>

  </div>
</section>
</template>

<style scoped>
.about {
  padding: 5rem 0 6rem;
  background-color: var(--bg-dark);
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* ── TOP ROW ─────────────────────────────────── */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.sub-title {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 3px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.main-title {
  font-family: var(--font-heading);
  font-size: 2.6rem;
  color: var(--text-main);
  margin: 0;
  line-height: 1.1;
}

/* ── COUNTDOWN ───────────────────────────────── */
.countdown-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.countdown-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.countdown {
  display: flex;
  gap: 0.4rem;
}

.time-box {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  padding: 0.6rem 0.5rem;
  min-width: 58px;
  text-align: center;
}

.time-box .val {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}

.time-box .lbl {
  display: block;
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 3px;
  letter-spacing: 1px;
}

/* ── MAIN GRID ───────────────────────────────── */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

/* ── POSTER ──────────────────────────────────── */
.poster-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.poster-wrapper {
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-card);
}

.poster-image {
  width: 100%;
  height: auto;
  display: block;
}

.social-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
}

.social-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.social-handle {
  color: var(--text-muted);
}

.share-icon {
  color: var(--text-muted);
  cursor: pointer;
}
.share-icon:hover { color: var(--text-main); }

/* ── DETAIL CARD ─────────────────────────────── */
.detail-card {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 500;
}

.organizer-block {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 1rem;
}

.org-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.org-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-main);
  margin: 0;
}

/* ── BUTTONS ─────────────────────────────────── */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-chat,
.btn-ticket {
  display: block;
  width: 100%;
  padding: 0.95rem;
  border-radius: 100px;
  text-align: center;
  font-weight: 700;
  font-family: var(--font-body);
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
}

.btn-chat {
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.25);
  color: var(--text-main);
}
.btn-chat:hover {
  border-color: var(--text-main);
  background: rgba(255,255,255,0.05);
}

.btn-ticket {
  background: var(--text-main);
  border: 1.5px solid var(--text-main);
  color: var(--bg-dark);
}
.btn-ticket:hover {
  background: transparent;
  color: var(--text-main);
}

/* ── RESPONSIVE ──────────────────────────────── */
@media (max-width: 900px) {
  .top-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .countdown-group {
    align-items: flex-start;
  }
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
