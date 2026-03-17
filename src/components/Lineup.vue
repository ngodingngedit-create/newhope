<template>
  <section id="lineup" class="lineup">
    <div class="container">
      <h2 class="section-title">LINE UP BAND</h2>
      <p class="section-subtitle">Band cadas pilihan kami yang akan mengguncang panggung.</p>
      
      <div class="lineup-grid">
        <div class="band-card" v-for="(band, index) in bands" :key="index" @click="openDetail(band)">
          <div class="card-image">
            <img :src="band.image" :alt="band.name" />
            <div class="band-type" :class="band.type.toLowerCase()">{{ band.type }}</div>
          </div>
          <div class="card-content">
            <h3 class="band-name">{{ band.name }}</h3>
            <p class="band-genre">{{ band.genre }}</p>
          </div>
        </div>
      </div>
      
      <div class="lineup-action">
        <button class="btn-outline">LIHAT SEMUA BAND</button>
      </div>
    </div>

    <!-- Band Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedBand" class="modal-overlay" :class="{ 'is-open': isModalOpen }" @click.self="closeModal">
        <div class="modal-container">
          <button class="modal-close" @click="closeModal">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div class="modal-banner">
            <img :src="selectedBand.banner" :alt="selectedBand.name" />
            <div class="banner-overlay"></div>
          </div>
          
          <div class="modal-content">
            <div class="info-section header-section">
              <span class="detail-genre">{{ selectedBand.genre }}</span>
              <h2 class="detail-name">{{ selectedBand.name }}</h2>
            </div>
            
            <div class="info-section description-section">
              <h4 class="section-label">ABOUT THE BAND</h4>
              <p class="detail-description">{{ selectedBand.description }}</p>
            </div>
            
            <div class="info-section socials-section">
              <h4 class="section-label">FOLLOW THEM</h4>
              <div class="detail-socials">
                <a :href="selectedBand.socials.instagram" target="_blank" class="social-link" title="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span>Instagram</span>
                </a>
                <a :href="selectedBand.socials.twitter" target="_blank" class="social-link" title="Twitter">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            <div class="info-section spotify-section">
              <h4 class="section-label">LISTEN ON SPOTIFY</h4>
              <div class="spotify-card">
                <div class="spotify-header">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.304c-.216.36-.672.468-1.032.252-2.856-1.74-6.444-2.136-10.668-1.164-.408.096-.828-.156-.924-.552-.096-.408.156-.828.552-.924 4.632-1.056 8.604-.6 11.808 1.356.36.216.468.672.264 1.032zm1.464-3.264c-.276.444-.852.588-1.296.312-3.264-2.004-8.232-2.58-12.096-1.416-.504.156-1.032-.144-1.188-.636-.156-.504.144-1.032.636-1.188 4.392-1.332 9.888-.684 13.632 1.62.444.276.588.852.312 1.308zm.132-3.42c-3.912-2.328-10.344-2.544-14.124-1.392-.6.18-1.248-.156-1.428-.756s.156-1.248.756-1.428c4.332-1.32 11.448-1.056 15.948 1.62.54.324.72 1.02.408 1.56-.324.528-1.008.708-1.56.396z"/></svg>
                  <span>SPOTIFY PLAYER</span>
                </div>
                <div class="spotify-container">
                  <iframe 
                    style="border-radius:12px" 
                    :src="`https://open.spotify.com/embed/track/${selectedBand.spotifyId}`" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const bands = ref([
  {
    name: 'THE WRETCHED',
    type: 'HEADLINER',
    genre: 'Metalcore / Mosh',
    image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2679&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2574&auto=format&fit=crop',
    description: 'Energi murni dari kedalaman skena metalcore lokal. The Wretched membawa intensitas yang tak tertandingi ke atas panggung dengan riff berat dan breakdown yang mematikan. Bersiaplah untuk moshpit yang tak terlupakan.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '0QJt0k3fG4y4gN2R3Qj0S0'
  },
  {
    name: 'HAYWIRE',
    type: 'HEADLINER',
    genre: 'Hardcore',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2670&auto=format&fit=crop',
    description: 'Cepat, marah, dan tanpa kompromi. Haywire adalah definisi dari hardcore modern yang menyatukan semua orang di moshpit. Debut album mereka baru saja meledak di tangga lagu alternatif.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '1P6E5a6l4X7q7p07Zk8Y2I'
  },
  {
    name: 'DEATH SPELL',
    type: 'SPECIAL',
    genre: 'Death Metal',
    image: 'https://images.unsplash.com/photo-1546707641-fc81395b0c9f?q=80&w=2675&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2670&auto=format&fit=crop',
    description: 'Melodi kegelapan yang dibungkus dalam teknik death metal yang presisi. Death Spell akan membawa Anda ke dalam perjalanan sonik yang mencekam dan teknikal tinggi.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '3q7kMFce0TnDafVUzq8IpE'
  },
  {
    name: 'IRON CLAW',
    type: 'SPECIAL',
    genre: 'Thrash',
    image: 'https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?q=80&w=2574&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop',
    description: 'Kecepatan adalah segalanya. Iron Claw menghidupkan kembali semangat thrash metal kental dengan solo gitar yang membakar dan riff yang sangat agresif.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '2FVlJ7H87YxQhJ8n20b3sO'
  },
  {
    name: 'BLOOD ROOT',
    type: 'OPENER',
    genre: 'Punk Rock',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2670&auto=format&fit=crop',
    description: 'Anthemic dan penuh semangat pemberontakan. Blood Root adalah nafas segar bagi skena punk rock hari ini dengan lirik yang tajam dan melodi yang catchy.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '47vj6C98yvX8677X691N4C'
  },
  {
    name: 'VOID DWELLER',
    type: 'OPENER',
    genre: 'Doom Metal',
    image: 'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?q=80&w=2670&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop',
    description: 'Lambat, berat, dan atmosferik. Void Dweller mengeksplorasi sisi gelap dari doom metal yang menghipnotis, menciptakan dinding suara yang megah.',
    socials: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    spotifyId: '37SByUvN4fO33B9R7TfUnV'
  }
]);




const selectedBand = ref(null);
const isModalOpen = ref(false);

const openDetail = (band) => {
  selectedBand.value = band;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  // Use timeout to wait for transition
  setTimeout(() => {
    selectedBand.value = null;
    document.body.style.overflow = '';
  }, 300);
};

</script>

<style scoped>
.lineup {
  padding: 8rem 0;
  background-color: var(--bg-dark);
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-top: -2rem;
  margin-bottom: 4rem;
  font-size: 1.1rem;
}

.lineup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.band-card {
  background: var(--bg-card);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.band-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: grayscale(0.8) contrast(1.2);
}

.band-card:hover .card-image img {
  transform: scale(1.1);
  filter: grayscale(0) contrast(1.1);
}

.band-type {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 1rem;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  border-radius: 4px;
  font-weight: 600;
  z-index: 2;
  border: 1px solid rgba(255,255,255,0.2);
}

.band-type.headliner {
  background-color: var(--text-main);
  color: var(--bg-dark);
  border-color: var(--text-main);
}

.band-type.special {
  background-color: rgba(0,0,0,0.8);
  color: var(--text-muted);
}

.band-type.opener {
  background-color: rgba(0,0,0,0.8);
  color: var(--text-main);
}

.card-content {
  padding: 1.5rem;
  background: linear-gradient(to bottom, transparent, var(--bg-card));
}

.band-name {
  font-size: 2.5rem;
  color: var(--text-main);
  line-height: 1.1;
  margin-bottom: 0.5rem;
}

.band-card:hover .band-name {
  color: var(--accent-red);
}

.band-genre {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.lineup-action {
  text-align: center;
  margin-top: 4rem;
}

.btn-outline {
  border: 1px solid var(--accent-red);
  color: var(--text-main);
  padding: 1rem 3.5rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: var(--text-main);
  color: var(--bg-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -10px rgba(255, 255, 255, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}

.modal-container {
  background-color: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(20px);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 24px;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: scale(0.9) translateY(20px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
}

.modal-overlay.is-open .modal-container {
  transform: scale(1) translateY(0);
}

.modal-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.modal-close:hover {
  background-color: var(--accent-red);
  color: var(--bg-dark);
  transform: rotate(90deg);
}

.modal-banner {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.modal-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 0.8s ease;
}

.modal-overlay.is-open .modal-banner img {
  transform: scale(1);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), var(--bg-card));
}

.modal-content {
  padding: 0 3.5rem 3.5rem;
  margin-top: -6rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.info-section {
  padding: 2.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.info-section:last-child {
  border-bottom: none;
}

.section-label {
  font-size: 0.8rem;
  color: var(--accent-red);
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.detail-genre {
  color: var(--accent-red);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.75rem;
}

.detail-name {
  font-size: clamp(3.5rem, 10vw, 6rem);
  line-height: 0.85;
  color: var(--text-main);
  margin: 0;
  font-weight: 700;
  letter-spacing: -2px;
}

.detail-description {
  color: var(--text-muted);
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 400;
}

.detail-socials {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 100px;
  color: var(--text-main);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  font-weight: 500;
}

.social-link:hover {
  background-color: var(--text-main);
  color: var(--bg-dark);
  transform: translateY(-3px);
  border-color: var(--text-main);
}

.modal-sidebar {
  display: flex;
  flex-direction: column;
}

.spotify-card {
  background: rgba(18, 18, 18, 0.4);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.spotify-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: #1DB954;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.spotify-container {
  overflow: hidden;
  border-radius: 12px;
}

@media (max-width: 992px) {
  .modal-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 2rem 3rem;
  }
  
  .modal-sidebar {
    margin-top: 1rem;
  }
  
  .spotify-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .lineup {
    padding: 5rem 0;
  }

  .section-title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
  }

  .lineup-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .band-name {
    font-size: 2rem;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-banner {
    height: 300px;
  }
  
  .detail-name {
    font-size: 3.5rem;
    letter-spacing: -1px;
  }
  
  .modal-content {
    margin-top: -4rem;
    padding: 0 1.5rem 3rem;
  }

  .info-section {
    padding: 2rem 0;
  }

  .social-link {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
}
</style>
