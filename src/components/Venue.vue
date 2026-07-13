<template>
  <section id="venue" class="venue-section">
    <div class="container" v-if="!selectedVenue">
      <!-- ── CATALOG HEADER ──────────────────────── -->
      <div class="venue-header-row">
        <div class="header-main">
          <h2 class="title-display">VENUE CATALOG</h2>
          <div class="pill-accent"></div>
          <p class="subtitle-text">Temukan ruang pertemuan, convention hall, dan auditorium terbaik untuk acara Anda.</p>
        </div>
      </div>

      <!-- ── CATEGORY TABS (Image 1) ──────────────── -->
      <div class="category-tabs-container">
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.name" 
            class="tab-pill" 
            :class="{ active: selectedCategory === cat.name }"
            @click="selectedCategory = cat.name"
          >
            <!-- SVG Icons for tabs -->
            <span class="tab-icon" v-html="cat.icon"></span>
            <span class="tab-name">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- ── CATALOG GRID (Image 1) ───────────────── -->
      <div class="venue-grid">
        <div 
          v-for="venue in filteredVenues" 
          :key="venue.id" 
          class="venue-card"
          @click="openDetail(venue)"
        >
          <div class="card-image-wrap">
            <img :src="venue.image" :alt="venue.name" class="venue-image" />
            <div class="card-tap-overlay">
              <span>EXPLORE VENUE</span>
            </div>
          </div>
          <div class="card-body">
            <div class="venue-title-container">
              <div class="marquee-track" :class="{ 'animate-marquee': venue.name.length > 18 }">
                <h3 class="venue-title">{{ venue.name }}</h3>
                <h3 class="venue-title duplicate" v-if="venue.name.length > 18" aria-hidden="true">{{ venue.name }}</h3>
              </div>
            </div>
            
            <div class="info-row location-row">
              <svg class="icon-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="location-text">{{ venue.location }}</span>
            </div>
            
            <div class="info-row price-row">
              <span class="price-label">Mulai:</span>
              <span class="price-value">{{ venue.price === 0 ? 'Free' : 'Rp' + formatPrice(venue.price) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <div class="category-badge">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
              <span>{{ venue.subCategory }}</span>
            </div>
            <div class="rating-badge">
              <svg class="icon-star" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>{{ venue.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── VENUE DETAIL PAGE (Image 2 & 3) ───────── -->
    <div class="container venue-detail-container" v-else>
   

      <!-- Category & Title -->
      <div class="detail-header" v-if="activeTab !== 'BOOKING VENUE' && activeTab !== 'BOOKING'">
        <span class="venue-type-tag">VENUE OLAHRAGA</span>
        <h2 class="venue-main-title">{{ selectedVenue.name }}</h2>
      </div>

      <!-- Gallery + Host Summary Row (Image 2) -->
      <div class="detail-gallery-host-layout" v-if="activeTab !== 'BOOKING VENUE' && activeTab !== 'BOOKING'">

        <!-- Left: Gallery Section -->
        <div class="detail-gallery-col">
          <div class="gallery-grid">
            <div class="gallery-large">
              <img :src="selectedVenue.gallery[0]" alt="Large View" />
            </div>
            <div class="gallery-small-1">
              <img :src="selectedVenue.gallery[1]" alt="Detail View 1" />
            </div>
            <div class="gallery-small-2">
              <img :src="selectedVenue.gallery[2]" alt="Detail View 2" />
            </div>
            <div class="gallery-small-3">
              <img :src="selectedVenue.gallery[3]" alt="Detail View 3" />
            </div>
            <div class="gallery-small-4">
              <img :src="selectedVenue.gallery[4]" alt="Detail View 4" />
              <div class="overlay-more">
                <button class="btn-more-photos" @click="showGalleryModal = true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  <span>Lihat semua {{ selectedVenue.gallery.length }} foto</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="gallery-footer">
            <div class="social-handle">
              <svg class="icon-instagram" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>{{ selectedVenue.organizer.username }}</span>
            </div>
            <button class="btn-share" aria-label="Share">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right: Host Card (Always visible next to gallery on desktop) -->
        <div class="detail-host-col">
          <div class="sticky-side-card card-host-summary">
            <div class="price-section-card">
              <span class="card-side-label">HARGA MULAI DARI</span>
              <div class="card-side-price">
                <strong>{{ selectedVenue.price === 0 ? 'Free' : 'Rp' + formatPrice(selectedVenue.price) }}</strong>
                <span class="price-unit">/ sesi</span>
              </div>
            </div>
            
            <hr class="separator-dash" />

            <div class="host-section-card">
              <span class="card-side-label">PENYELENGGARA</span>
              <div class="host-meta-row">
                <img :src="selectedVenue.organizer.avatar" :alt="selectedVenue.organizer.name" class="host-avatar" />
                <div class="host-info-card">
                  <span class="host-name-card">{{ selectedVenue.organizer.name }}</span>
                  <div class="host-badge-official">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" class="icon-checkmark">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>OFFICIAL</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="host-actions-group">
              <button class="btn-select-schedule" @click="activeTab = 'BOOKING VENUE'">PILIH JADWAL</button>
              <button class="btn-chat-host" @click="chatHost">CHAT HOST</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Page Content (Tabs and Sub-content) -->
      <div class="detail-content-layout" :class="{ 'has-sidebar': activeTab === 'BOOKING VENUE' || activeTab === 'BOOKING' }">
        <!-- LEFT COLUMN: Tab and Contents -->
        <div class="detail-left-col">
          <!-- Navigation Tabs -->
          <div class="detail-tabs-bar">
            <button 
              v-for="tab in tabs" 
              :key="tab" 
              class="tab-btn" 
              :class="{ active: selectedTab === tab }"
              @click="onTabClick(tab)"
            >
              {{ tab }}
            </button>
          </div>

          <!-- TAB CONTENT: DESKRIPSI (Image 2) -->
          <div v-if="activeTab === 'DESKRIPSI'" class="tab-pane fade-in">
            <!-- Description Card -->
            <div class="description-card" id="section-deskripsi">
              <div class="info-header">
                <h3 class="desc-venue-title">{{ selectedVenue.name }}</h3>
                <div class="rating-reviews">
                  <div class="stars">
                    <svg v-for="n in 5" :key="n" class="icon-star-gold" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <span class="rating-text"><strong>{{ selectedVenue.rating }}</strong> ({{ selectedVenue.ratingCount }}+ ulasan)</span>
                </div>
                <div class="maps-link-row">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-pin-blue">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <a href="https://maps.google.com" target="_blank" class="maps-anchor">https://maps.google.com</a>
                </div>
              </div>

              <div class="desc-content-block">
                <h4 class="block-title">DESKRIPSI VENUE</h4>
                <p class="desc-text">{{ descExpanded ? selectedVenue.description : truncateText(selectedVenue.description, 180) }}</p>
                <button 
                  v-if="selectedVenue.description && selectedVenue.description.length > 180" 
                  class="btn-expand-facilities" 
                  @click="descExpanded = !descExpanded"
                  style="margin-top: 0.15rem;"
                >
                  <span>{{ descExpanded ? 'Lihat Lebih Sedikit' : 'Baca Selengkapnya' }}</span>
                  <svg 
                    viewBox="0 0 24 24" 
                    width="14" 
                    height="14" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2.5" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    class="expand-chevron"
                    :class="{ rotated: descExpanded }"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>


              <!-- Inner divider between Deskripsi and Aturan -->
              <div class="section-divider"></div>

              <div class="desc-content-block">
                <h4 class="block-title">ATURAN VENUE</h4>
                <div class="rules-grid">
                  <div v-for="(rule, idx) in selectedVenue.rules" :key="idx" class="rule-item">
                    <div class="rule-icon-check">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span class="rule-text">{{ rule }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Divider -->
            <div class="section-divider"></div>

            <!-- Facilities Section -->
            <div class="facilities-section-block">
              <div class="block-header-with-icon">
                
                <h4>FASILITAS VENUE</h4>
              </div>
              
              <div class="facilities-categories-container">
                <!-- Always-visible: first 2 categories -->
                <!-- Capacity Category -->
                <div class="facility-category-row">
                  <div class="category-header">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-icon">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span class="category-title">Capacity</span>
                  </div>
                  <div class="category-pills-wrap">
                    <span class="premium-facility-pill">600 pax (Main Auditorium)</span>
                    <span class="premium-facility-pill">350 pax (Balcony)</span>
                    <span class="premium-facility-pill">Full AC</span>
                    <span class="premium-facility-pill">Chairs (According to Number of Pax)</span>
                    <span class="premium-facility-pill">2 Guest Registration Table</span>
                  </div>
                </div>

                <!-- Sound System Category -->
                <div class="facility-category-row">
                  <div class="category-header">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-icon">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span class="category-title">Sound System</span>
                  </div>
                  <div class="category-pills-wrap">
                    <span class="premium-facility-pill">3 wireless mic shure SLX</span>
                    <span class="premium-facility-pill">4 wired mic shure SM 58</span>
                    <span class="premium-facility-pill">Speaker FOH Meyer Melodia</span>
                    <span class="premium-facility-pill">Speaker Monitor</span>
                    <span class="premium-facility-pill">Mixer</span>
                  </div>
                </div>

                <!-- Expandable section: last 2 categories -->
                <div class="facilities-extra-wrapper" :class="{ 'is-expanded': facilitiesExpanded }">
                  <!-- Moving Light Category -->
                  <div class="facility-category-row">
                    <div class="category-header">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-icon">
                        <path d="M9 18h6M10 22h4M12 2v1M5.22 5.22l.7.7M2 12h1M21.78 5.22l-.7.7M22 12h-1M18.36 18.36l-.7-.7M5.64 18.36l.7-.7M8 12a4 4 0 1 1 8 0c0 1.5-1.5 2.5-2.5 3.5H10.5C9.5 14.5 8 13.5 8 12z" />
                      </svg>
                      <span class="category-title">Moving Light</span>
                    </div>
                    <div class="category-pills-wrap">
                      <span class="premium-facility-pill">16 unit PAR LED</span>
                      <span class="premium-facility-pill">2 unit ST Ranger</span>
                      <span class="premium-facility-pill">4 unit Beam</span>
                      <span class="premium-facility-pill">4 unit Fresnel</span>
                      <span class="premium-facility-pill">2 unit Leko</span>
                    </div>
                  </div>

                  <!-- Additional Category -->
                  <div class="facility-category-row">
                    <div class="category-header">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="category-icon">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span class="category-title">Additional</span>
                    </div>
                    <div class="category-pills-wrap">
                      <span class="premium-facility-pill">LED Videotron 8x5 Unilum</span>
                      <span class="premium-facility-pill">2 LED Screen 2x3s</span>
                      <span class="premium-facility-pill">Music instruments: Drum, Guitar, Bass, Keyboard</span>
                    </div>
                  </div>
                </div>

                <!-- Expand / Collapse Toggle -->
                <button class="btn-expand-facilities" @click="facilitiesExpanded = !facilitiesExpanded">
                  <span>{{ facilitiesExpanded ? 'Sembunyikan' : 'Baca Selengkapnya' }}</span>
                  <svg
                    class="expand-chevron"
                    :class="{ 'rotated': facilitiesExpanded }"
                    viewBox="0 0 24 24" width="15" height="15" fill="none"
                    stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Section Divider -->
            <div class="section-divider"></div>

            <!-- Review List Section -->
            <div id="section-ulasan" class="reviews-section-block">
              <div class="review-title-header">
                <h3 class="review-main-heading">Review</h3>
                <a href="#" class="review-link-see-all" @click.prevent="onTabClick('ULASAN')">Lihat semua</a>
              </div>

              <div class="review-stats-summary-row">
                <div class="review-stats-left">
                  <span class="review-avg-score">{{ selectedVenue.rating.toFixed(1).replace('.', ',') }}<span class="review-score-max">/5</span></span>
                  <div class="review-desc-col">
                    <span class="review-grade-bold">{{ selectedVenue.rating >= 4.5 ? 'Sangat Bagus' : 'Bagus' }}</span>
                    <span class="review-count-total">Dari {{ selectedVenue.ratingCount }} review</span>
                  </div>
                </div>
                
                <div class="review-carousel-controls">
                  <button class="review-arrow-btn" @click="scrollReviews('left')" aria-label="Previous reviews">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button class="review-arrow-btn" @click="scrollReviews('right')" aria-label="Next reviews">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Reviews Carousel Container -->
              <div class="reviews-carousel-slider" ref="reviewsSlider">
                <div v-for="review in selectedVenue.reviewsList" :key="review.id" class="premium-review-card-item">
                  <!-- Card Header: Avatar + Name/Date -->
                  <div class="rcard-header">
                    <div class="rcard-avatar-wrap">
                      <img :src="review.avatar" :alt="review.name" class="rcard-avatar" />
                    </div>
                    <div class="rcard-meta-col">
                      <div class="rcard-author-name">{{ review.name }}</div>
                      <div class="rcard-venue-tag">{{ selectedVenue.name }}</div>
                    </div>
                    <div class="rcard-date-badge">{{ review.date }}</div>
                  </div>
                  <!-- Star Rating Row -->
                  <div class="rcard-stars-row">
                    <svg v-for="s in review.stars" :key="s" viewBox="0 0 24 24" width="14" height="14" fill="#f59e0b" class="rcard-star">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span class="rcard-rating-num">{{ review.stars.toFixed(1) }}/5</span>
                  </div>
                  <!-- Review Body -->
                  <p class="rcard-body-text">{{ review.text }}</p>
                </div>
              </div>
            </div>

            <!-- Section Divider -->
            <div class="section-divider"></div>

            <!-- ── LOKASI SECTION ── -->
            <div id="section-lokasi" class="info-section-block">
              <div class="block-header-with-icon">
                <div class="header-icon-wrap">
                  
                </div>
                <h4>LOKASI VENUE</h4>
              </div>

              <div class="redesigned-map-card">
                <div class="map-info-section">
                  <h3 class="map-section-title">Lokasi Venue</h3>
                  <p class="map-address-text">{{ selectedVenue.address || 'Jl. Tembus Mantuil No.67' }}</p>
                </div>
                <div class="map-action-section">
                  <a 
                    :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(selectedVenue.address || 'Jl. Tembus Mantuil No.67')" 
                    target="_blank" 
                    class="btn-buka-peta-pill"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    BUKA PETA
                  </a>
                </div>
                <div class="map-grid-bg">
                  
                </div>
              </div>
            </div>

            <!-- Section Divider -->
            <div class="section-divider"></div>

            <!-- ── FAQ SECTION ── -->
            <div id="section-faq" class="info-section-block">
              <div class="block-header-with-icon">
                <div class="header-icon-wrap">
                  
                </div>
                <h4>FAQ</h4>
              </div>

              <div class="faq-list">
                <div v-for="(faq, idx) in selectedVenue.faqs" :key="idx" class="faq-item">
                  <details class="faq-details">
                    <summary class="faq-summary">
                      <span>{{ faq.q }}</span>
                      <span class="faq-chevron">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <p class="faq-answer">{{ faq.a }}</p>
                  </details>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB CONTENT: BOOKING VENUE (Image 3) -->
          <div v-if="activeTab === 'BOOKING VENUE' || activeTab === 'BOOKING'" class="tab-pane fade-in">
            <div class="booking-flow-card">
              <!-- Pilih Jadwal Header -->
              <div class="booking-section-header">
                <div class="booking-header-top-row">
                  <h3 class="booking-flow-title">PILIH JADWAL VENUE</h3>
                  <span class="month-indicator">Juli 2026</span>
                </div>
                
                <div class="calendar-legends">
                  <span class="legend-item"><span class="dot-legend dot-avail"></span> Tersedia</span>
                  <span class="legend-item"><span class="dot-legend dot-blocked"></span> Blokir</span>
                  <span class="legend-item"><span class="dot-legend dot-yours"></span> Pilihanmu</span>
                </div>
              </div>

              <!-- Date Carousel Slider -->
              <div class="date-carousel-wrapper">
                <button class="arrow-nav left" @click="scrollDates('left')" aria-label="Previous dates">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                
                <div class="date-slider" ref="dateSlider">
                  <button 
                    v-for="(day, idx) in bookingDates" 
                    :key="idx" 
                    class="date-card"
                    :class="{ 
                      blocked: day.status === 'blocked', 
                      selected: selectedDateIndex === idx,
                      available: day.status === 'available'
                    }"
                    :disabled="day.status === 'blocked'"
                    @click="selectDate(idx)"
                  >
                    <span class="date-day-name">{{ day.dayName }}</span>
                    <span class="date-number">{{ day.dateNum }}</span>
                    <span class="dot-indicator" :class="day.status"></span>
                  </button>
                </div>

                <button class="arrow-nav right" @click="scrollDates('right')" aria-label="Next dates">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

                <!-- Small Calendar Icon Button -->
                <button class="btn-mini-cal" aria-label="Open full calendar">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </button>
              </div>

              <p class="helper-text">Pilih tanggal dan slot waktu yang tersedia untuk booking.</p>

              <!-- Session dropdown summary info (Accordion) -->
              <div class="selected-day-schedule-card-wrapper">
                <div class="selected-day-schedule-card" @click="isVenueDropdownOpen = !isVenueDropdownOpen">
                  <div class="sched-left">
                    <div class="sched-icon-wrap">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                      </svg>
                    </div>
                    <div class="sched-info">
                      <span class="sched-title">{{ selectedVenue.name }}</span>
                      <div class="sched-badges">
                        <span class="badge-avail">AVAILABLE</span>
                        <span class="badge-slots-count">15 JADWAL TERSEDIA</span>
                      </div>
                    </div>
                  </div>
                  <button class="btn-toggle-dropdown" :class="{ open: isVenueDropdownOpen }" aria-label="Toggle details">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
                
                <!-- Expanded Accordion List -->
                <div class="venues-accordion-dropdown" v-if="isVenueDropdownOpen">
                  <div class="accordion-dropdown-header">PILIH VENUE LAINNYA</div>
                  <div class="accordion-dropdown-scroll">
                    <div 
                      v-for="v in otherVenuesList" 
                      :key="v.id" 
                      class="accordion-venue-item"
                      @click="selectOtherVenue(v)"
                    >
                      <img :src="v.image" :alt="v.name" class="accordion-venue-img" />
                      <div class="accordion-venue-info">
                        <span class="accordion-venue-name">{{ v.name }}</span>
                        <span class="accordion-venue-meta">{{ v.category }} • {{ v.location }}</span>
                      </div>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="accordion-select-arrow">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pilih Area Venue -->
              <div class="booking-section-block">
                <h4 class="booking-block-title">PILIH AREA VENUE</h4>
                <div class="area-options">
                  <button 
                    v-for="area in selectedVenue.areas" 
                    :key="area" 
                    class="area-btn"
                    :class="{ active: selectedArea === area }"
                    @click="selectedArea = area"
                  >
                    {{ area }}
                  </button>
                </div>
              </div>

              <!-- Pilih Waktu Penggunaan -->
              <div class="booking-section-block">
                <h4 class="booking-block-title">PILIH WAKTU PENGGUNAAN</h4>
                <p class="section-label-sub">SESUAIKAN DURASI DENGAN RENCANA ACARA ANDA.</p>
                
                <div class="usage-radio-list">
                  <!-- Radio 1: Sesi Jam -->
                  <label class="radio-card" :class="{ checked: selectedDurationType === 'sesi_jam' }">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="sesi_jam" 
                      v-model="selectedDurationType" 
                      class="hidden-radio" 
                    />
                    <span class="custom-radio-circle"></span>
                    <div class="radio-card-content">
                      <div class="radio-title-row">
                        <span class="radio-main-title">Sesi Jam</span>
                        <span class="badge-avail-inline">AVAILABLE</span>
                      </div>
                      <span class="radio-sub">Booking per jam sesuai range</span>
                    </div>
                    <div class="radio-card-right">
                      <span class="radio-time">08:00 - 17:00</span>
                      <span class="radio-price">Rp{{ formatPrice(selectedVenue.price) }}</span>
                    </div>
                  </label>

                  <!-- Radio 2: Paket Sesi -->
                  <label class="radio-card" :class="{ checked: selectedDurationType === 'paket_sesi' }">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="paket_sesi" 
                      v-model="selectedDurationType" 
                      class="hidden-radio" 
                    />
                    <span class="custom-radio-circle"></span>
                    <div class="radio-card-content">
                      <div class="radio-title-row">
                        <span class="radio-main-title">Paket Sesi</span>
                        <span class="badge-avail-inline">AVAILABLE</span>
                      </div>
                      <span class="radio-sub">Satu sesi penuh</span>
                    </div>
                    <div class="radio-card-right">
                      <span class="radio-time">08:00 - 17:00</span>
                      <span class="radio-price">Rp{{ formatPrice(selectedVenue.price) }}</span>
                    </div>
                  </label>

                  <!-- Radio 3: Pilih Jam Sendiri -->
                  <label class="radio-card" :class="{ checked: selectedDurationType === 'custom' }">
                    <input 
                      type="radio" 
                      name="duration" 
                      value="custom" 
                      v-model="selectedDurationType" 
                      class="hidden-radio" 
                    />
                    <span class="custom-radio-circle"></span>
                    <div class="radio-card-content">
                      <div class="radio-title-row">
                        <span class="radio-main-title">Pilih Jam Sendiri</span>
                      </div>
                      <span class="radio-sub">Fleksibel sesuai keinginan</span>
                    </div>
                    <div class="radio-card-right">
                      <span class="radio-custom-txt">| Custom</span>
                    </div>
                  </label>
                </div>

                <!-- Custom start & end time picker (Pilih Jam Sendiri) -->
                <div v-if="selectedDurationType === 'custom'" class="custom-time-range-picker fade-in">
                  <div class="picker-row">
                    <!-- WAKTU MULAI -->
                    <div class="picker-col">
                      <label class="picker-label">WAKTU MULAI</label>
                      <div 
                        class="custom-dropdown-select" 
                        :class="{ active: isStartDropdownOpen }"
                        @click.stop="isStartDropdownOpen = !isStartDropdownOpen; isEndDropdownOpen = false"
                      >
                        <div class="select-left">
                          <svg class="clock-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                          </svg>
                          <span class="selected-time-value">{{ selectedStartTime }}</span>
                        </div>
                        <svg class="chevron-icon" :class="{ rotated: isStartDropdownOpen }" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        
                        <!-- Options Dropdown Menu -->
                        <div class="select-options-menu" v-if="isStartDropdownOpen">
                          <div 
                            v-for="hour in availableHours" 
                            :key="hour" 
                            class="select-option-item"
                            :class="{ 
                              selected: selectedStartTime === hour,
                              disabled: isHourBooked(hour)
                            }"
                            @click.stop="selectStartTime(hour)"
                          >
                            <span class="option-time">{{ hour }}</span>
                            <span v-if="isHourBooked(hour)" class="option-status-booked">BOOKED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- WAKTU SELESAI -->
                    <div class="picker-col">
                      <label class="picker-label">WAKTU SELESAI</label>
                      <div 
                        class="custom-dropdown-select" 
                        :class="{ active: isEndDropdownOpen }"
                        @click.stop="isEndDropdownOpen = !isEndDropdownOpen; isStartDropdownOpen = false"
                      >
                        <div class="select-left">
                          <svg class="clock-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                          </svg>
                          <span class="selected-time-value">{{ selectedEndTime }}</span>
                        </div>
                        <svg class="chevron-icon" :class="{ rotated: isEndDropdownOpen }" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                        
                        <!-- Options Dropdown Menu -->
                        <div class="select-options-menu" v-if="isEndDropdownOpen">
                          <div 
                            v-for="hour in filteredEndHours" 
                            :key="hour" 
                            class="select-option-item"
                            :class="{ 
                              selected: selectedEndTime === hour,
                              disabled: isHourBooked(hour)
                            }"
                            @click.stop="selectEndTime(hour)"
                          >
                            <span class="option-time">{{ hour }}</span>
                            <span v-if="isHourBooked(hour)" class="option-status-booked">BOOKED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p class="picker-help-text">* Pilih jam mulai dan selesai. Jam yang sudah dibooking tidak tersedia.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB CONTENT: ULASAN -->
          <div v-if="activeTab === 'ULASAN'" class="tab-pane fade-in">
            <div class="reviews-tab-content">
              <h3 class="section-block-title">Ulasan Pengunjung ({{ selectedVenue.ratingCount }})</h3>
              <div class="reviews-grid">
                <div v-for="review in selectedVenue.reviewsList" :key="review.id" class="premium-review-card-item">
                  <!-- Card Header -->
                  <div class="rcard-header">
                    <div class="rcard-avatar-wrap">
                      <img :src="review.avatar" :alt="review.name" class="rcard-avatar" />
                    </div>
                    <div class="rcard-meta-col">
                      <div class="rcard-author-name">{{ review.name }}</div>
                      <div class="rcard-venue-tag">{{ selectedVenue.name }}</div>
                    </div>
                    <div class="rcard-date-badge">{{ review.date }}</div>
                  </div>
                  <!-- Stars -->
                  <div class="rcard-stars-row">
                    <svg v-for="s in review.stars" :key="s" viewBox="0 0 24 24" width="14" height="14" fill="#f59e0b" class="rcard-star">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span class="rcard-rating-num">{{ review.stars.toFixed(1) }}/5</span>
                  </div>
                  <!-- Body -->
                  <p class="rcard-body-text">{{ review.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Booking Summary Panel (visible only on Booking tab) -->
        <div class="detail-right-col" v-if="activeTab === 'BOOKING VENUE' || activeTab === 'BOOKING'">
          <!-- Selection Panel for Booking (Image 3) -->
          <div class="sticky-side-card card-booking-summary">
            <!-- Header with Edit toggle -->
            <div class="summary-header-row">
              <h3 class="summary-card-title">JADWAL VENUE TERPILIH</h3>
              <button 
                v-if="addedSchedules.length > 0" 
                class="btn-edit-summary" 
                @click="isEditMode = !isEditMode"
              >
                {{ isEditMode ? 'SELESAI EDIT' : 'EDIT' }}
              </button>
            </div>
            
            <!-- Booked Schedules Scroll List (Separate Scroll Div) -->
            <div class="summary-schedules-scroll-area" v-if="addedSchedules.length > 0">
              <div v-for="(group, gIdx) in groupedSchedules" :key="gIdx" class="summary-date-group">
                <!-- Date Header -->
                <div class="summary-date-group-header">
                  <div class="summary-date-group-left">
                    <span class="date-indicator-bar"></span>
                    <span class="date-group-title">{{ group.dateStr }}</span>
                  </div>
                  <!-- Delete All for Day in Edit Mode -->
                  <button 
                    v-if="isEditMode" 
                    class="btn-remove-group" 
                    @click="removeGroup(group.dateStr, group.area)"
                    aria-label="Hapus semua jadwal hari ini"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="#f43f5e" />
                      <path d="M15 9L9 15M9 9l6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>

                <!-- Venue & Area info -->
                <div class="summary-area-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M10 22v-4a2 2 0 0 1 4 0v4" />
                  </svg>
                  <span class="summary-area-name">{{ group.area.toUpperCase() }}</span>
                </div>

                <!-- Slots Card List -->
                <div class="summary-slots-cards-list">
                  <div v-for="slot in group.slots" :key="slot.id" class="summary-slot-item-card">
                    <div class="slot-card-left">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span class="slot-card-time">{{ slot.timeRange }}</span>
                    </div>
                    
                    <div class="slot-card-right">
                      <span class="slot-card-price">Rp{{ formatPrice(slot.price) }}</span>
                      <!-- Trash single slot in Edit Mode -->
                      <button 
                        v-if="isEditMode" 
                        class="btn-remove-slot" 
                        @click="removeSlot(slot.id)"
                        aria-label="Hapus jadwal ini"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ef4444" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Summary Total Info (Separate Footer Div) -->
            <div class="summary-footer-totals" v-if="addedSchedules.length > 0">
              <div class="summary-row total-row">
                <span class="s-label">TOTAL ({{ totalSchedulesCount }} JADWAL)</span>
                <span class="s-val total-price">Rp{{ formatPrice(totalSchedulesPrice) }}</span>
              </div>
            </div>
            
            <!-- Empty State -->
            <div class="booking-summary-empty" v-else>
              <div class="empty-icon-wrap">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p class="empty-msg">Pilih jadwal untuk memulai booking venue Anda</p>
              
              <!-- If a new selection is made but list is empty, show Tambahkan button -->
              <button 
                v-if="selectedDurationType" 
                class="btn-confirm-booking" 
                @click="addSelectedSchedule"
                style="width: 100%; margin-top: 0.5rem;"
              >
                TAMBAHKAN JADWAL
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── STICKY BOTTOM BAR ──────────── -->
      <!-- Visible on Mobile devices or when Booking tab is active -->
      <div class="sticky-bottom-booking-bar" v-if="activeTab === 'BOOKING VENUE' || activeTab === 'BOOKING' || isMobileDevice">
        <!-- Top Row: Price and Detail link (collapsible toggle) -->
        <div class="bottom-bar-row-top">
          <div class="bottom-bar-left">
            <span class="bbar-label">TOTAL HARGA</span>
            <div class="bbar-price-row">
              <span class="bbar-price">Rp{{ formatPrice(totalSchedulesPrice || (selectedVenue ? selectedVenue.price : 0)) }}</span>
            </div>
          </div>
          <button
            class="btn-bottom-detail-text"
            @click="showMobileSummarySheet = !showMobileSummarySheet"
          >
            ({{ totalSchedulesCount }}) Detail <span class="detail-arrow">▲</span>
          </button>
        </div>

        <!-- Bottom Row: Action and Chat button -->
        <div class="bottom-bar-row-actions">
          <button 
            v-if="selectedDurationType && !isCurrentSelectionAdded" 
            class="btn-bottom-booking-main" 
            @click="addSelectedSchedule"
          >
            TAMBAHKAN
          </button>
          <button 
            v-else 
            class="btn-bottom-booking-main" 
            @click="processBooking"
            :disabled="addedSchedules.length === 0"
          >
            SELANJUTNYA
          </button>
          
          <button class="btn-bottom-chat-icon" @click="chatHost" aria-label="Chat host">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Bottom Sheet for Booking Summary (slides up from bottom) -->
      <div 
        class="mobile-summary-sheet-overlay" 
        v-if="isMobileDevice && showMobileSummarySheet"
        @click.self="showMobileSummarySheet = false"
      >
        <div class="mobile-summary-sheet-card">
          <div class="sheet-drag-handle" @click="showMobileSummarySheet = false"></div>
          
          <div class="sheet-header">
            <h3>JADWAL VENUE TERPILIH</h3>
            <button class="btn-sheet-close" @click="showMobileSummarySheet = false" aria-label="Close summary">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="sheet-body card-booking-summary">
            <!-- Header with Edit toggle -->
            <div class="summary-header-row">
              <button 
                v-if="addedSchedules.length > 0" 
                class="btn-edit-summary" 
                @click="isEditMode = !isEditMode"
              >
                {{ isEditMode ? 'SELESAI EDIT' : 'EDIT' }}
              </button>
            </div>
            
            <!-- Booked Schedules Scroll List -->
            <div class="summary-schedules-scroll-area" v-if="addedSchedules.length > 0">
              <div v-for="(group, gIdx) in groupedSchedules" :key="gIdx" class="summary-date-group">
                <div class="summary-date-group-header">
                  <div class="summary-date-group-left">
                    <span class="date-indicator-bar"></span>
                    <span class="date-group-title">{{ group.dateStr }}</span>
                  </div>
                  <button 
                    v-if="isEditMode" 
                    class="btn-remove-group" 
                    @click="removeGroup(group.dateStr, group.area)"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <circle cx="12" cy="12" r="10" fill="#f43f5e" />
                      <path d="M15 9L9 15M9 9l6 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </button>
                </div>

                <div class="summary-area-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M10 22v-4a2 2 0 0 1 4 0v4" />
                  </svg>
                  <span class="summary-area-name">{{ group.area.toUpperCase() }}</span>
                </div>

                <div class="summary-slots-cards-list">
                  <div v-for="slot in group.slots" :key="slot.id" class="summary-slot-item-card">
                    <div class="slot-card-left">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span class="slot-card-time">{{ slot.timeRange }}</span>
                    </div>
                    
                    <div class="slot-card-right">
                      <span class="slot-card-price">Rp{{ formatPrice(slot.price) }}</span>
                      <button 
                        v-if="isEditMode" 
                        class="btn-remove-slot" 
                        @click="removeSlot(slot.id)"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ef4444" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Summary Total Info -->
            <div class="summary-footer-totals" v-if="addedSchedules.length > 0">
              <div class="summary-row total-row">
                <span class="s-label">TOTAL ({{ totalSchedulesCount }} JADWAL)</span>
                <span class="s-val total-price">Rp{{ formatPrice(totalSchedulesPrice) }}</span>
              </div>
            </div>
            
            <div class="booking-summary-empty" v-else>
              <div class="empty-icon-wrap">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <p class="empty-msg">Pilih jadwal untuk memulai booking venue Anda</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Confirmation Modal -->
      <div class="success-overlay" v-if="isBooked && selectedVenue" @click.self="isBooked = false">
        <div class="success-card">
          <div class="success-icon-wrap">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Booking Berhasil!</h3>
          <p>Pesanan booking Anda untuk <strong>{{ selectedVenue?.name }}</strong> ({{ totalSchedulesCount }} Jadwal) dengan total pembayaran <strong>Rp{{ formatPrice(totalSchedulesPrice) }}</strong> telah kami terima.</p>
        </div>
      </div>

      <!-- ALL PHOTOS GALLERY LIGHTBOX MODAL -->
      <div class="success-overlay" v-if="showGalleryModal && selectedVenue" @click.self="showGalleryModal = false" style="z-index: 2000;">
        <div class="gallery-modal-card">
          <div class="gallery-modal-header">
            <h3>SEMUA FOTO VENUE - {{ selectedVenue.name.toUpperCase() }}</h3>
            <button class="btn-close-gallery" @click="showGalleryModal = false" aria-label="Close gallery">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="gallery-modal-scroll">
            <div class="gallery-modal-grid">
              <img v-for="(img, idx) in selectedVenue.gallery" :key="idx" :src="img" alt="Gallery Image" class="gallery-modal-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { navigateTo, hideMobileNavGlobal } from '../store';

const props = defineProps<{
  detailId?: number;
}>();

// ── TYPES ────────────────────────────────────
interface Facility {
  name: string;
  icon: string;
}

interface Review {
  id: number;
  name: string;
  avatar: string;
  stars: number;
  date: string;
  text: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface Organizer {
  name: string;
  username: string;
  avatar: string;
}

interface VenueItem {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  ratingCount: number;
  image: string;
  gallery: string[];
  description: string;
  rules: string[];
  facilities: Facility[];
  reviewsList: Review[];
  faqs: FAQ[];
  organizer: Organizer;
  areas: string[];
}

interface BookingDate {
  dayName: string;
  dateNum: number;
  status: 'available' | 'blocked' | 'yours';
  fullDate: string;
}

// ── CATEGORIES WITH ICONS ─────────────────────
const categories = [
  {
    name: 'Semua',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>`
  },
  {
    name: 'Convention Hall',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18M10 22v-4a2 2 0 0 1 4 0v4M18 10h.01M6 10h.01M18 6h.01M6 6h.01M18 14h.01M6 14h.01M18 18h.01M6 18h.01"></svg>`
  },
  {
    name: 'Meeting Room',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M12 16v4M8 20h8"></path></svg>`
  },
  {
    name: 'Auditorium',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17A10 10 0 0 1 22 17M12 2v6M5 6l4.5 4.5M19 6l-4.5 4.5"></path></svg>`
  },
  {
    name: 'Hall',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
  }
];

// ── TABS ──────────────────────────────────────
const tabs = ['DESKRIPSI', 'BOOKING VENUE', 'ULASAN', 'LOKASI', 'FAQ'];

// ── STATE VARIABLES ───────────────────────────
const selectedCategory = ref('Semua');
const selectedVenue = ref<VenueItem | null>(null);
const activeTab = ref('DESKRIPSI');
const selectedTab = ref('DESKRIPSI');
const reviewsSlider = ref<HTMLElement | null>(null);
const facilitiesExpanded = ref(false);
const descExpanded = ref(false);
const showGalleryModal = ref(false);
const isEditMode = ref(false);

interface BookedSlot {
  id: string;
  dateStr: string;
  area: string;
  timeRange: string;
  price: number;
}

const addedSchedules = ref<BookedSlot[]>([]);

const addSelectedSchedule = () => {
  if (!selectedDurationType.value) return;
  const dateStr = getSelectedDateFormatted();
  const area = selectedArea.value;
  const price = selectedVenue.value?.price || 1000000;
  
  if (selectedDurationType.value === 'sesi_jam') {
    const times = ['08:00 - 09:00 WIB', '09:00 - 10:00 WIB', '10:00 - 11:00 WIB', '11:00 - 12:00 WIB', '12:00 - 13:00 WIB', '13:00 - 14:00 WIB'];
    times.forEach(t => {
      const id = `${dateStr}-${area}-${t}`;
      if (!addedSchedules.value.some(s => s.id === id)) {
        addedSchedules.value.push({ id, dateStr, area, timeRange: t, price });
      }
    });
  } else if (selectedDurationType.value === 'paket_sesi') {
    const t = '08:00 - 17:00 WIB';
    const id = `${dateStr}-${area}-${t}`;
    if (!addedSchedules.value.some(s => s.id === id)) {
      addedSchedules.value.push({ id, dateStr, area, timeRange: t, price: price * 5 });
    }
  } else if (selectedDurationType.value === 'custom') {
    const startIdx = availableHours.indexOf(selectedStartTime.value);
    const endIdx = availableHours.indexOf(selectedEndTime.value);
    const numHours = Math.max(1, endIdx - startIdx);
    
    const t = `${selectedStartTime.value} - ${selectedEndTime.value} WIB`;
    const id = `${dateStr}-${area}-${t}`;
    if (!addedSchedules.value.some(s => s.id === id)) {
      addedSchedules.value.push({ id, dateStr, area, timeRange: t, price: price * numHours });
    }
  } else {
    const t = '13:00 - 15:00 WIB';
    const id = `${dateStr}-${area}-${t}`;
    if (!addedSchedules.value.some(s => s.id === id)) {
      addedSchedules.value.push({ id, dateStr, area, timeRange: t, price: price * 2 });
    }
  }
};

const removeSlot = (slotId: string) => {
  addedSchedules.value = addedSchedules.value.filter(s => s.id !== slotId);
};

const removeGroup = (dateStr: string, area: string) => {
  addedSchedules.value = addedSchedules.value.filter(s => !(s.dateStr === dateStr && s.area === area));
};

const removeAllSchedules = () => {
  addedSchedules.value = [];
};

const isCurrentSelectionAdded = computed(() => {
  if (!selectedDurationType.value) return false;
  const dateStr = getSelectedDateFormatted();
  const area = selectedArea.value;
  if (selectedDurationType.value === 'custom') {
    const t = `${selectedStartTime.value} - ${selectedEndTime.value} WIB`;
    const id = `${dateStr}-${area}-${t}`;
    return addedSchedules.value.some(s => s.id === id);
  }
  return addedSchedules.value.some(s => s.dateStr === dateStr && s.area === area);
});

const groupedSchedules = computed(() => {
  const groups: { [key: string]: { dateStr: string; area: string; slots: BookedSlot[] } } = {};
  addedSchedules.value.forEach(s => {
    const key = `${s.dateStr}-${s.area}`;
    if (!groups[key]) {
      groups[key] = {
        dateStr: s.dateStr,
        area: s.area,
        slots: []
      };
    }
    groups[key].slots.push(s);
  });
  return Object.values(groups);
});

const totalSchedulesCount = computed(() => addedSchedules.value.length);
const totalSchedulesPrice = computed(() => {
  return addedSchedules.value.reduce((total, s) => total + s.price, 0);
});

// Hide mobile nav whenever viewing any venue detail (any tab)
watch(selectedVenue, (val) => {
  hideMobileNavGlobal.value = !!val;
}, { immediate: true });


const selectedArea = ref('Main Hall');
const selectedDurationType = ref('');
const isBooked = ref(false);
const dateSlider = ref<HTMLElement | null>(null);
const isMobileDevice = ref(false);

const selectedCustomSlots = ref<string[]>([]);
const showMobileSummarySheet = ref(false);
const isVenueDropdownOpen = ref(false);

const otherVenuesList = computed(() => {
  if (!selectedVenue.value) return [];
  return venuesList.value.filter(v => v.id !== selectedVenue.value?.id);
});

const selectOtherVenue = (v: VenueItem) => {
  const currentTab = activeTab.value;
  loadVenueDetails(v.id);
  if (currentTab === 'BOOKING VENUE' || currentTab === 'BOOKING') {
    activeTab.value = currentTab;
    selectedTab.value = currentTab;
  }
  isVenueDropdownOpen.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const isStartDropdownOpen = ref(false);
const isEndDropdownOpen = ref(false);
const selectedStartTime = ref('08:00');
const selectedEndTime = ref('12:00');

const availableHours = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const bookedHours = ['09:00', '15:00'];

const isHourBooked = (hour: string) => {
  return bookedHours.includes(hour);
};

const selectStartTime = (hour: string) => {
  if (isHourBooked(hour)) return;
  selectedStartTime.value = hour;
  isStartDropdownOpen.value = false;
  
  // Auto-adjust end time if start time >= end time
  const startIdx = availableHours.indexOf(hour);
  const endIdx = availableHours.indexOf(selectedEndTime.value);
  if (startIdx >= endIdx && startIdx < availableHours.length - 1) {
    selectedEndTime.value = availableHours[startIdx + 1];
  }
};

const selectEndTime = (hour: string) => {
  if (isHourBooked(hour)) return;
  selectedEndTime.value = hour;
  isEndDropdownOpen.value = false;
};

// Available end hours must be after start hour
const filteredEndHours = computed(() => {
  const startIdx = availableHours.indexOf(selectedStartTime.value);
  if (startIdx === -1) return availableHours;
  return availableHours.slice(startIdx + 1);
});

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.custom-dropdown-select')) {
    isStartDropdownOpen.value = false;
    isEndDropdownOpen.value = false;
  }
};

const truncateText = (text: string | undefined, length: number) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};


// Scroll to a named anchor inside the DESKRIPSI pane
const scrollToSection = (anchorId: string) => {
  activeTab.value = 'DESKRIPSI';
  setTimeout(() => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

// Handle tab click
const onTabClick = (tab: string) => {
  selectedTab.value = tab;
  if (tab === 'BOOKING VENUE') {
    activeTab.value = 'BOOKING VENUE';
  } else {
    activeTab.value = 'DESKRIPSI';
    let anchorId = 'section-deskripsi';
    if (tab === 'ULASAN') anchorId = 'section-ulasan';
    else if (tab === 'LOKASI') anchorId = 'section-lokasi';
    else if (tab === 'FAQ') anchorId = 'section-faq';
    scrollToSection(anchorId);
  }
};

const scrollReviews = (direction: 'left' | 'right') => {
  if (!reviewsSlider.value) return;
  const scrollAmount = 320;
  if (direction === 'left') {
    reviewsSlider.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    reviewsSlider.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

// ── RESPONSIVENESS LISTENER ──────────────────
const checkIfMobile = () => {
  isMobileDevice.value = window.innerWidth <= 768;
};

// ── FORMAT PRICE ──────────────────────────────
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// ── MOCK VENUES DATA ──────────────────────────
const venuesList = ref<VenueItem[]>([
  {
    id: 1,
    name: 'Tes Venue Rules 2',
    category: 'Convention Hall',
    subCategory: 'Conference Room',
    location: 'Jakarta Raya',
    address: 'Jl. Jenderal Sudirman No. 21, Jakarta Raya',
    price: 1000000,
    rating: 4.8,
    ratingCount: 120,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Tes Venue Rules 2 adalah ruang konferensi modular yang didesain khusus untuk mendukung berbagai format acara, mulai dari konferensi pers, pelatihan intensif, hingga meeting bisnis eksekutif. Ruangan ini dilengkapi dengan teknologi peredam suara tinggi untuk menjamin privasi pertemuan Anda.',
    rules: [
      'Dilarang membawa makanan dari luar',
      'Check-in 15 menit sebelum waktu mulai',
      'Dilarang merokok di area olahraga / gedung',
      'Menggunakan sepatu olahraga yang sesuai',
      'Menjaga kebersihan area lapangan',
      'Jaga dan amankan barang bawaan masing-masing'
    ],
    facilities: [
      { name: 'WiFi Kecepatan Tinggi', icon: '📶' },
      { name: 'AC Sentral', icon: '❄️' },
      { name: 'Sound System Premium', icon: '🔊' },
      { name: 'Proyektor & Layar UHD', icon: '📽️' },
      { name: 'Area Parkir Luas', icon: '🅿️' }
    ],
    reviewsList: [
      { id: 1, name: 'Budi Santoso', avatar: 'https://ui-avatars.com/api/?name=Budi+S&background=0d52d6&color=fff', stars: 5, date: '10 Jul 2026', text: 'Tempatnya bersih, luas, dan AC-nya sangat dingin. Fasilitas proyektor dan sound-nya mantap sekali untuk meeting.' },
      { id: 2, name: 'Siti Rahma', avatar: 'https://ui-avatars.com/api/?name=Siti+R&background=10b981&color=fff', stars: 4, date: '8 Jul 2026', text: 'Pelayanan staff-nya cepat dan sangat membantu. Hanya saja tempat parkirnya penuh saat akhir pekan.' },
      { id: 3, name: 'Ahmad Fauzi', avatar: 'https://ui-avatars.com/api/?name=Ahmad+F&background=f59e0b&color=fff', stars: 5, date: '5 Jul 2026', text: 'Sangat rekomendasikan untuk acara pelatihan perusahaan. Ruangannya sangat kondusif dan tim sangat profesional.' },
      { id: 4, name: 'Dewi Lestari', avatar: 'https://ui-avatars.com/api/?name=Dewi+L&background=ec4899&color=fff', stars: 4, date: '1 Jul 2026', text: 'Fasilitasnya lengkap dan bersih. Internet kencang, AC sejuk. Sangat nyaman untuk rapat seharian.' },
      { id: 5, name: 'Rizky Pratama', avatar: 'https://ui-avatars.com/api/?name=Rizky+P&background=8b5cf6&color=fff', stars: 5, date: '28 Jun 2026', text: 'Lokasi strategis dan mudah dijangkau. Suasananya profesional dan membuat meeting jadi lebih produktif.' },
      { id: 6, name: 'Maya Indra', avatar: 'https://ui-avatars.com/api/?name=Maya+I&background=ef4444&color=fff', stars: 4, date: '25 Jun 2026', text: 'Worth it banget! Harganya terjangkau untuk fasilitas sebagus ini. Pasti akan booking lagi di sini.' }
    ],
    faqs: [
      { q: 'Apakah ada biaya tambahan untuk penggunaan proyektor?', a: 'Tidak ada. Penggunaan proyektor, layar, dan sound system standar sudah termasuk ke dalam biaya rental sesi.' },
      { q: 'Bagaimana kebijakan pembatalan booking?', a: 'Pembatalan gratis dilakukan paling lambat H-3 sebelum jadwal pemakaian. Pembatalan setelah itu akan dikenakan potongan 50%.' }
    ],
    organizer: {
      name: 'moofeet',
      username: 'moofeet',
      avatar: 'https://ui-avatars.com/api/?name=moofeet&background=1e40af&color=fff&bold=true'
    },
    areas: ['Main Hall', 'VIP Room', 'Outdoor Balcony']
  },
  {
    id: 2,
    name: 'Tes Venue Rules',
    category: 'Convention Hall',
    subCategory: 'Banquet Hall',
    location: 'Jakarta Raya',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Raya',
    price: 1000000,
    rating: 4.8,
    ratingCount: 154,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Tes Venue Rules menyediakan ruang banquet hall megah yang ideal untuk pesta pernikahan, resepsi formal, pesta korporat, hingga gathering berskala besar dengan kapasitas ratusan tamu undangan.',
    rules: [
      'Dilarang membawa makanan dari luar',
      'Check-in 15 menit sebelum waktu mulai',
      'Dilarang merokok di area olahraga',
      'Menggunakan sepatu olahraga yang sesuai',
      'Menjaga kebersihan area lapangan',
      'Jaga dan amankan barang bawaan masing-masing'
    ],
    facilities: [
      { name: 'Catering Kitchen Access', icon: '🍳' },
      { name: 'Sound System Konser', icon: '🔊' },
      { name: 'Panggung Utama', icon: '🎭' },
      { name: 'Full Karpet & AC', icon: '❄️' },
      { name: 'Valet Parking', icon: '🚗' }
    ],
    reviewsList: [
      { id: 1, name: 'Daniel Lim', avatar: 'https://ui-avatars.com/api/?name=Daniel+L&background=a855f7&color=fff', stars: 5, date: '14 Jun 2026', text: 'Sangat megah! Acara pernikahan keluarga kami berjalan dengan lancar dan semua tamu memuji keindahan hall ini.' },
      { id: 2, name: 'Putri Ayu', avatar: 'https://ui-avatars.com/api/?name=Putri+A&background=f43f5e&color=fff', stars: 5, date: '10 Jun 2026', text: 'Dekorasi dan lighting-nya sudah sangat bagus dari bawaan venue. Hemat budget dekorasi ekstra!' },
      { id: 3, name: 'Kevin Tan', avatar: 'https://ui-avatars.com/api/?name=Kevin+T&background=06b6d4&color=fff', stars: 4, date: '5 Jun 2026', text: 'Acara gathering perusahaan kami sangat sukses di sini. Staff sangat helpful dan responsif.' },
      { id: 4, name: 'Nurul Hidayah', avatar: 'https://ui-avatars.com/api/?name=Nurul+H&background=84cc16&color=fff', stars: 5, date: '1 Jun 2026', text: 'Ruangan banquet yang mewah dengan harga yang masuk akal. Sangat merekomendasikan untuk resepsi pernikahan.' },
      { id: 5, name: 'Bagas Wicaksono', avatar: 'https://ui-avatars.com/api/?name=Bagas+W&background=f97316&color=fff', stars: 4, date: '28 Mei 2026', text: 'Sound system konsernya hebat! Musik mengisi seluruh ruangan tanpa feedback noise sama sekali.' }
    ],
    faqs: [
      { q: 'Berapa kapasitas maksimal Banquet Hall ini?', a: 'Kapasitas maksimal banquet hall adalah 500 tamu dalam format standing party, atau 250 tamu dalam format round-table.' }
    ],
    organizer: {
      name: 'moofeet',
      username: 'moofeet',
      avatar: 'https://ui-avatars.com/api/?name=moofeet&background=1e40af&color=fff&bold=true'
    },
    areas: ['Main Hall', 'Bridal Dressing Room']
  },
  {
    id: 3,
    name: 'Jakarta Convention Hall',
    category: 'Convention Hall',
    subCategory: 'Concert Hall',
    location: 'Jakarta Pusat',
    address: 'Jl. M.H. Thamrin No. 9, Jakarta Pusat',
    price: 0, // Free
    rating: 4.8,
    ratingCount: 310,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Jakarta Convention Hall adalah panggung konser kelas internasional yang terletak strategis di pusat kota Jakarta. Dilengkapi dengan tata lampu canggih dan akustik ruang berstandar konser dunia.',
    rules: [
      'Dilarang membawa senjata tajam & narkoba',
      'Penonton wajib tertib & menjaga kebersihan',
      'Merokok hanya di smoking area luar gedung',
      'Membeli tiket resmi dari penyelenggara'
    ],
    facilities: [
      { name: 'Akustik Ruang Premium', icon: '🎼' },
      { name: 'Stage Lighting System', icon: '💡' },
      { name: 'VIP Lounge', icon: '🍸' },
      { name: 'Press Room', icon: '📰' },
      { name: 'Koneksi Internet Dedicated', icon: '🌐' }
    ],
    reviewsList: [
      { id: 1, name: 'Rian D.', avatar: 'https://ui-avatars.com/api/?name=Rian+D&background=e11d48&color=fff', stars: 5, date: '1 Jul 2026', text: 'Sound system-nya juara! Sangat megah dan memiliki akses keluar-masuk penonton yang teratur.' },
      { id: 2, name: 'Vina Sekar', avatar: 'https://ui-avatars.com/api/?name=Vina+S&background=7c3aed&color=fff', stars: 5, date: '27 Jun 2026', text: 'Konsert di sini benar-benar pengalaman world-class. Akustik ruangannya menakjubkan, setiap nada terdengar kristal.' },
      { id: 3, name: 'Taufik Rahman', avatar: 'https://ui-avatars.com/api/?name=Taufik+R&background=0891b2&color=fff', stars: 4, date: '20 Jun 2026', text: 'VIP Lounge-nya sangat eksklusif. Pelayanan premium dari awal hingga akhir acara.' },
      { id: 4, name: 'Citra Maulidya', avatar: 'https://ui-avatars.com/api/?name=Citra+M&background=15803d&color=fff', stars: 5, date: '15 Jun 2026', text: 'Hall terbesar dan termegah di Jakarta. Sangat cocok untuk konser berskala internasional.' },
      { id: 5, name: 'Hendra Wijaya', avatar: 'https://ui-avatars.com/api/?name=Hendra+W&background=c2410c&color=fff', stars: 4, date: '10 Jun 2026', text: 'Fasilitas press room-nya sangat membantu liputan kami. Internet dedicated-nya stabil sepanjang acara.' }
    ],
    faqs: [
      { q: 'Apakah diperbolehkan membawa kamera profesional ke dalam Hall?', a: 'Penggunaan kamera profesional DSLR/Mirrorless tanpa ID pers resmi biasanya dilarang selama performa berlangsung atas kebijakan artis.' }
    ],
    organizer: {
      name: 'Jakarta Event Group',
      username: 'jkt.event',
      avatar: 'https://ui-avatars.com/api/?name=JEG&background=dc2626&color=fff&bold=true'
    },
    areas: ['Auditorium A', 'Festival Area']
  },
  {
    id: 4,
    name: 'Dari Dashboard Venue',
    category: 'Meeting Room',
    subCategory: 'Conference Room',
    location: 'Depok, Jawa Barat',
    address: 'Jl. Margonda Raya No. 102, Depok, Jawa Barat',
    price: 1000000,
    rating: 4.8,
    ratingCount: 88,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Sebuah ruang meeting kolaboratif dengan gaya minimalis modern di Depok, Jawa Barat. Memiliki pencahayaan natural yang baik serta fasilitas papan tulis kaca dan kelengkapan hybrid meeting.',
    rules: [
      'Dilarang membawa makanan berbau menyengat',
      'Check-in 10 menit sebelum jadwal rapat',
      'Menjaga ketenangan ruangan',
      'Merapikan kembali peralatan setelah selesai'
    ],
    facilities: [
      { name: 'Whiteboard Kaca', icon: '✏️' },
      { name: 'Smart TV 65 Inch', icon: '📺' },
      { name: 'High-speed Internet', icon: '📶' },
      { name: 'Free Flow Mineral Water', icon: '🥤' }
    ],
    reviewsList: [
      { id: 1, name: 'Heri Kurniawan', avatar: 'https://ui-avatars.com/api/?name=Heri+K&background=d97706&color=fff', stars: 4, date: '28 Jun 2026', text: 'Ruangannya sangat kondusif untuk fokus berdiskusi. Internet cepat dan ada TV monitor besar.' },
      { id: 2, name: 'Liana Putri', avatar: 'https://ui-avatars.com/api/?name=Liana+P&background=4f46e5&color=fff', stars: 5, date: '22 Jun 2026', text: 'Sangat impressed dengan kualitas meeting room-nya! Whiteboard kaca dan smart TV-nya sangat memudahkan presentasi.' },
      { id: 3, name: 'Dimas Arief', avatar: 'https://ui-avatars.com/api/?name=Dimas+A&background=059669&color=fff', stars: 4, date: '18 Jun 2026', text: 'Lokasi di Depok sangat strategis dan mudah parkir. Suasana ruangannya bikin meeting jadi lebih produktif.' },
      { id: 4, name: 'Ratna Dewi', avatar: 'https://ui-avatars.com/api/?name=Ratna+D&background=db2777&color=fff', stars: 5, date: '12 Jun 2026', text: 'Free flow mineral water-nya sangat diapresiasi! Ruangan bersih dan nyaman untuk rapat seharian penuh.' },
      { id: 5, name: 'Gilang S.', avatar: 'https://ui-avatars.com/api/?name=Gilang+S&background=7e22ce&color=fff', stars: 4, date: '8 Jun 2026', text: 'Conference camera Jabra-nya kualitas bagus banget. Ideal untuk meeting hybrid dengan tim yang remote.' }
    ],
    faqs: [
      { q: 'Apakah ada fasilitas hybrid meeting / conference camera?', a: 'Ya, kami menyediakan conference camera Jabra Meet secara gratis jika diminta saat booking.' }
    ],
    organizer: {
      name: 'moofeet',
      username: 'moofeet',
      avatar: 'https://ui-avatars.com/api/?name=moofeet&background=1e40af&color=fff&bold=true'
    },
    areas: ['Main Hall', 'Private Meeting Pods']
  },
  {
    id: 5,
    name: 'Co-working Seminar Auditorium',
    category: 'Auditorium',
    subCategory: 'Seminar Room',
    location: 'Jakarta Selatan',
    address: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
    price: 1500000,
    rating: 4.7,
    ratingCount: 65,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Auditorium bergaya teater mini dengan kursi bertingkat yang nyaman untuk seminar, workshop, presentasi startup, maupun screening film independen.',
    rules: [
      'Maksimal kapasitas 80 orang',
      'Dilarang merusak instalasi kursi teater',
      'Dilarang membuang sampah sembarangan',
      'Registrasi peserta wajib tertib'
    ],
    facilities: [
      { name: 'Kursi Bertingkat Premium', icon: '💺' },
      { name: 'Stage Projector System', icon: '📽️' },
      { name: 'Microphone Wireless (4)', icon: '🎙️' },
      { name: 'AC & Pengharum Ruangan', icon: '🌸' }
    ],
    reviewsList: [
      { id: 1, name: 'Amanda P.', avatar: 'https://ui-avatars.com/api/?name=Amanda+P&background=ec4899&color=fff', stars: 5, date: '15 Mei 2026', text: 'Sangat cocok untuk event launching produk kami kemarin. Layar projector-nya sangat besar dan jernih.' }
    ],
    faqs: [
      { q: 'Apakah ada area registrasi di luar pintu masuk?', a: 'Ya, disediakan meja dan kursi registrasi khusus di foyer utama sebelum pintu auditorium.' }
    ],
    organizer: {
      name: 'SouthHub Co.',
      username: 'southhub.co',
      avatar: 'https://ui-avatars.com/api/?name=SouthHub&background=0284c7&color=fff&bold=true'
    },
    areas: ['Auditorium Room', 'Foyer Lounge']
  },
  {
    id: 6,
    name: 'Grand Ballroom Newhope',
    category: 'Hall',
    subCategory: 'Banquet Hall',
    location: 'Bandung, Jawa Barat',
    address: 'Jl. Dago No. 15, Bandung, Jawa Barat',
    price: 2500000,
    rating: 4.9,
    ratingCount: 142,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Grand Ballroom mewah di Bandung dengan pemandangan pegunungan dari jendela besar. Menawarkan fasilitas hospitality bintang 5 untuk menjamin kesuksesan event gala dinner maupun pesta privat Anda.',
    rules: [
      'Dilarang menempel materi dekorasi langsung ke dinding permanen',
      'Vendor dekor wajib menyerahkan uang jaminan kebersihan',
      'Check-out tepat waktu sesuai durasi sewa'
    ],
    facilities: [
      { name: 'Panoramic View Window', icon: '🌄' },
      { name: 'Stage & LED Wall Access', icon: '📺' },
      { name: 'Hospitality Staff Dedicated', icon: '🕴️' },
      { name: 'Kapasitas s/d 800 orang', icon: '👥' }
    ],
    reviewsList: [
      { id: 1, name: 'Sanjaya K.', avatar: 'https://ui-avatars.com/api/?name=Sanjaya+K&background=4f46e5&color=fff', stars: 5, date: '11 Mei 2026', text: 'Luar biasa megah dan stafnya sangat sigap membantu. Pemandangan Bandung malam hari dari ballroom sangat memukau.' }
    ],
    faqs: [
      { q: 'Apakah harga rental termasuk penyediaan LED Wall?', a: 'LED Wall utama dikenakan tambahan biaya operasional teknisi, detailnya bisa dikoordinasikan dengan event manajer kami.' }
    ],
    organizer: {
      name: 'Newhope Hospitality',
      username: 'newhope.hospitality',
      avatar: 'https://ui-avatars.com/api/?name=NH&background=09090b&color=fff&bold=true'
    },
    areas: ['Grand Ballroom', 'Foyer & Reception Desk']
  }
]);

// ── FILTER VENUES ─────────────────────────────
const filteredVenues = computed(() => {
  if (selectedCategory.value === 'Semua') {
    return venuesList.value;
  }
  return venuesList.value.filter(v => v.category === selectedCategory.value);
});

// ── BOOKING DATES GENERATION ──────────────────
const selectedDateIndex = ref(0);
const bookingDates = ref<BookingDate[]>([]);

const generateBookingDates = () => {
  const dates: BookingDate[] = [];
  const daysShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  // Starting from July 10, 2026 (matching mockup timeline)
  const baseDate = new Date(2026, 6, 10); 
  
  for (let i = 0; i < 15; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i);
    
    const dayName = daysShort[nextDate.getDay()];
    const dateNum = nextDate.getDate();
    
    // Simulating block for some dates: block weekends (Sabtu & Minggu) for rules testing, or make specific block
    let status: 'available' | 'blocked' | 'yours' = 'available';
    if (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
      status = 'blocked';
    }
    
    dates.push({
      dayName,
      dateNum,
      status,
      fullDate: `${dateNum} ${monthNames[nextDate.getMonth()]} ${nextDate.getFullYear()}`
    });
  }
  
  bookingDates.value = dates;
};

// ── DATE SELECTION ────────────────────────────
const selectDate = (index: number) => {
  if (bookingDates.value[index].status === 'blocked') return;
  
  // Reset previous "yours" to "available"
  bookingDates.value.forEach((d, idx) => {
    if (d.status === 'yours') {
      d.status = 'available';
    }
  });
  
  // Set selected date
  selectedDateIndex.value = index;
  bookingDates.value[index].status = 'yours';
  
  // Pre-select a duration type if none is selected, to help user fill out the form
  if (!selectedDurationType.value) {
    selectedDurationType.value = 'sesi_jam';
  }
};

const getSelectedDateFormatted = () => {
  if (bookingDates.value.length === 0) return '';
  return bookingDates.value[selectedDateIndex.value].fullDate;
};

// ── SCROLL DATES ──────────────────────────────
const scrollDates = (direction: 'left' | 'right') => {
  if (!dateSlider.value) return;
  const scrollAmount = 240;
  if (direction === 'left') {
    dateSlider.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    dateSlider.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

// Helper to set venue details based on prop id
const loadVenueDetails = (id: number) => {
  const found = venuesList.value.find(v => v.id === id);
  if (found) {
    selectedVenue.value = found;
    activeTab.value = 'DESKRIPSI';
    selectedTab.value = 'DESKRIPSI';
    selectedArea.value = found.areas[0] || 'Main Hall';
    selectedDurationType.value = '';
    isBooked.value = false;
    facilitiesExpanded.value = false; // always start collapsed
    generateBookingDates();
    const firstAvail = bookingDates.value.findIndex(d => d.status === 'available');
    if (firstAvail !== -1) {
      selectedDateIndex.value = firstAvail;
      bookingDates.value[firstAvail].status = 'yours';
    }
  }
};

// ── OPEN / CLOSE DETAILS ──────────────────────
const openDetail = (venue: VenueItem) => {
  navigateTo('/venue/' + venue.id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closeDetail = () => {
  navigateTo('/');
  setTimeout(() => {
    document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};

// ── ACTIONS ───────────────────────────────────
const chatHost = () => {
  alert(`Menghubungi host ${selectedVenue.value?.organizer.name}... Fitur chat sedang diaktifkan.`);
};

const processBooking = () => {
  if (!selectedDurationType.value) {
    activeTab.value = 'BOOKING VENUE';
    alert('Silakan pilih waktu penggunaan (Sesi Jam / Paket Sesi / Custom) terlebih dahulu.');
    return;
  }
  isBooked.value = true;
};

const resetBookingFlow = () => {
  isBooked.value = false;
  navigateTo('/');
};

// ── LIFECYCLE ─────────────────────────────────
onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  window.addEventListener('click', handleClickOutside);
  generateBookingDates();
  
  if (props.detailId) {
    loadVenueDetails(props.detailId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
  window.removeEventListener('click', handleClickOutside);
});

watch(() => props.detailId, (newId) => {
  if (newId) {
    loadVenueDetails(newId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    selectedVenue.value = null;
  }
});
</script>

<style scoped>
.venue-section {
  padding: 2.5rem 0;
  background-color: var(--bg-dark);
  color: var(--text-main);
  position: relative;
}

/* ── HEADER ROW ────────────────────────────── */
.venue-header-row {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 2rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
}

.title-display {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0;
  text-align: center;
  font-family: var(--font-heading);
}

.pill-accent {
  width: 60px;
  height: 8px;
  background-color: #fff;
  border-radius: 100px;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.subtitle-text {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0;
}

/* ── CATEGORY TABS (Image 1) ───────────────── */
.category-tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  width: 100%;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 100px;
}

.tab-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 38px;
}

.tab-pill:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.04);
}

.tab-pill.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon svg {
  width: 15px;
  height: 15px;
}

/* ── CATALOG GRID (Image 1) ────────────────── */
.venue-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  width: 100%;
}

@media (max-width: 1200px) {
  .venue-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 992px) {
  .venue-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
  }
}

.venue-card {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents overflow-x stretch from white-space nowrap */
}

.venue-card:hover .card-image-wrap {
  transform: scale(1.03);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.08);
  z-index: 2;
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 2.2 / 1; /* Wide elegant compact banner */
  background-color: #0d0d0d;
  overflow: hidden;
  border-bottom: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Glow light sheet slide on hover */
.card-image-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 45%,
    rgba(255, 255, 255, 0.5) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  mix-blend-mode: overlay; /* makes the slide gloss look like light blending */
  pointer-events: none;
  z-index: 2;
  transition: left 1.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.venue-card:hover .card-image-wrap::after {
  left: 150%;
}

.venue-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-tap-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-tap-overlay span {
  background: #fff;
  color: #000;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 0.75rem 0 0 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.venue-title-container {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  position: relative;
  display: block;
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
}

.marquee-track.animate-marquee .venue-title {
  padding-right: 3rem; /* padding gap for seamless loop reset */
}

.marquee-track.animate-marquee {
  animation: marquee-loop 12s linear infinite;
}

@keyframes marquee-loop {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

.venue-title {
  font-size: 0.95rem; /* compact title */
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-main);
  font-family: var(--font-body);
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
  margin: 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-pin {
  width: 14px;
  height: 14px;
  color: #3b82f6;
  flex-shrink: 0;
}

.location-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.price-row {
  margin-top: 0.1rem;
  font-size: 0.85rem;
}

.price-label {
  color: var(--text-muted);
}

.price-value {
  color: #fff;
  font-weight: 700;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0 0 0;
  background: transparent;
  border-top: none;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
}

.icon-tag {
  width: 11px;
  height: 11px;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #fbbf24;
  font-size: 0.75rem;
  font-weight: 700;
}

.icon-star {
  width: 12px;
  height: 12px;
}

.venue-detail-container {
  max-width: 1400px;
  padding-top: 3.5rem;
  animation: fadeIn 0.4s ease-out;
  padding-bottom: 6rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  color: var(--text-muted);
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: color 0.3s;
  align-self: flex-start;
}

.btn-back:hover {
  color: var(--text-main);
}

.detail-header {
  margin-top: 1.5rem;
  margin-bottom: 1.25rem;
}

.venue-type-tag {
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
}

.venue-main-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  line-height: 1.1;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  font-family: var(--font-body);
  letter-spacing: -1px;
}

/* Gallery + Host Row Layout */
.detail-gallery-host-layout {
  display: grid;
  grid-template-columns: 2.3fr 0.7fr;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2.5rem;
}

.detail-gallery-col {
  min-width: 0;
}

.detail-host-col {
  height: 100%;
}

.detail-host-col .card-host-summary {
  height: 350px; /* match gallery height exactly */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Gallery Grid Section (Image 2) */
.gallery-section {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  height: 350px;
  background-color: #0b0b0b;
}

.gallery-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-grid img:hover {
  transform: scale(1.03);
}

.gallery-large {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

.gallery-small-1 {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.gallery-small-2 {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.gallery-small-3 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.gallery-small-4 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  position: relative;
}

.overlay-more {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-more-photos {
  background: rgba(255, 255, 255, 0.95);
  color: #000000;
  padding: 0.6rem 1rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.btn-more-photos:hover {
  background: #ffffff;
  transform: translateY(-2px);
}

.gallery-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0 0.5rem;
}

.social-handle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-share {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-share:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Two Columns Content Layout */
.detail-content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}

.detail-content-layout.has-sidebar {
  grid-template-columns: 2.25fr 0.75fr;
  align-items: start; /* critical for sticky to work in grid */
}

/* LEFT COLUMN */
.detail-left-col {
  position: relative;
  min-width: 0;
}

/* Tabs Bar */
.detail-tabs-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 72px;
  background-color: #09090b;
  z-index: 99;
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* thin divider line */
  border-bottom: 2px solid rgba(255, 255, 255, 0.08);
  gap: 2.2rem;
  overflow-x: auto;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.detail-tabs-bar::-webkit-scrollbar {
  display: none; /* Hide scrollbar for tabs */
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 1rem 0;
  position: relative;
  cursor: pointer;
  transition: color 0.3s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn.active {
  color: var(--text-main);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--text-main);
  border-radius: 100px;
}

/* Tab contents animation */
.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* narrower gap between blocks */
  animation: fadeIn 0.4s ease-out;
}

/* Description Card Styling */
.description-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
}

.desc-venue-title {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.6rem;
  font-family: var(--font-body);
  text-transform: none;
  letter-spacing: -0.5px;
}

.rating-reviews {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.stars {
  display: flex;
  gap: 0.15rem;
}

.icon-star-gold {
  width: 16px;
  height: 16px;
  color: #fbbf24;
}

.rating-text {
  font-size: 0.92rem;
  color: #ffffff;
}

.maps-link-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
}

.icon-pin-blue {
  color: #e4e4e7;
}

.maps-anchor {
  color: #a1a1aa;
  font-size: 0.88rem;
  transition: underline 0.3s;
}

.maps-anchor:hover {
  text-decoration: underline;
}

.desc-content-block {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.block-title {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 0.1rem;
}

.desc-text {
  color: #e4e4e7;
  font-size: 0.98rem;
  line-height: 1.7;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.rule-icon-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.rule-text {
  font-size: 0.92rem;
  color: #e4e4e7;
  line-height: 1.4;
}

/* Facilities Block */
.facilities-section-block {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.block-header-with-icon {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding-bottom: 0.8rem;
}



.block-header-with-icon h4 {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffffff;
  margin: 0;
}

/* ── NEW FACILITIES CATEGORIES ─────────────── */
.facilities-categories-container {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.facility-category-row {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.category-icon {
  color: #ffffff;
  flex-shrink: 0;
  opacity: 0.9;
}

.category-title {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.2px;
}

.category-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-left: 1.5rem;
}

.premium-facility-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e4e4e7;
  padding: 0.38rem 0.9rem;
  border-radius: 100px;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
  white-space: nowrap;
}

.premium-facility-pill:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  transform: translateY(-1px);
}

/* ── SECTION DIVIDER ───────────────────────── */
.section-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 255, 255, 0.08) 80%,
    transparent
  );
  margin: 0;
  flex-shrink: 0;
}

/* ── FACILITIES EXPAND / COLLAPSE ──────────── */
.facilities-extra-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  /* Collapse: zero height, invisible, no pointer events */
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.facilities-extra-wrapper.is-expanded {
  max-height: 600px; /* generous ceiling so both rows fit */
  opacity: 1;
  pointer-events: auto;
}

/* ── EXPAND TOGGLE BUTTON ──────────────────── */
.btn-expand-facilities {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0.3rem 0;
  color: #a1a1aa;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition: color 0.25s;
  align-self: flex-start;
}

.btn-expand-facilities:hover {
  color: #ffffff;
}

.expand-chevron {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s;
}

.expand-chevron.rotated {
  transform: rotate(180deg);
}

.facilities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.facility-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
}

.facility-icon {
  font-size: 1.1rem;
}

/* Review Block - Mockup Style */
.reviews-section-block {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-main-heading {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-transform: none;
  letter-spacing: -0.5px;
}

.review-link-see-all {
  color: #a1a1aa;
  font-size: 0.88rem;
  font-weight: 700;
  transition: color 0.3s;
}

.review-link-see-all:hover {
  color: #ffffff;
}

.review-stats-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.review-stats-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-avg-score {
  font-size: 2.5rem;
  font-weight: 850;
  color: #ffffff;
  line-height: 1;
}

.review-score-max {
  font-size: 1rem;
  color: #a1a1aa;
  font-weight: 500;
}

.review-desc-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.review-grade-bold {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
}

.review-count-total {
  font-size: 0.8rem;
  color: #a1a1aa;
}

.review-carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.review-arrow-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  cursor: pointer;
}

.review-arrow-btn:hover {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.reviews-carousel-slider {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-behavior: smooth;
  padding: 0.4rem 0;
  scrollbar-width: none; /* Firefox */
}

.reviews-carousel-slider::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.premium-review-card-item {
  flex: 0 0 320px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.premium-review-card-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.review-card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-card-rating {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
}

.review-card-rating-max {
  font-size: 0.72rem;
  color: #a1a1aa;
  font-weight: 500;
}

.review-card-date {
  font-size: 0.8rem;
  color: #a1a1aa;
}

.review-card-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
}

.review-card-author {
  font-weight: 800;
  color: #ffffff;
}

.review-card-sep {
  color: rgba(255, 255, 255, 0.2);
}

.review-card-venue {
  color: #a1a1aa;
}

.review-card-text {
  font-size: 0.92rem;
  color: #e4e4e7;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
}

/* ── BOOKING FLOW (Image 3) ────────────────── */
.booking-flow-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
}

.booking-section-header {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
}

.booking-header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.booking-flow-title {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #ffffff;
  text-transform: none;
  margin: 0;
}

.month-indicator {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.calendar-legends {
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: #a1a1aa;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot-legend {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot-avail { background: rgba(255, 255, 255, 0.3); }
.dot-blocked { background: #ef4444; }
.dot-yours { background: #ffffff; }

/* Date Carousel Slider */
.date-carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  width: 100%;
}

.date-slider {
  display: flex;
  overflow-x: auto;
  gap: 0.6rem;
  scroll-behavior: smooth;
  flex-grow: 1;
  padding: 0.4rem 0;
}

.date-slider::-webkit-scrollbar {
  display: none;
}

.arrow-nav {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.arrow-nav:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.btn-mini-cal {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.btn-mini-cal:hover {
  background: rgba(255, 255, 255, 0.1);
}

.date-card {
  flex: 0 0 62px;
  height: 76px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.date-card.available:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
}

.date-day-name {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
}

.date-number {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.dot-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.dot-indicator.available { background: var(--text-muted); }
.dot-indicator.blocked { background: #ef4444; }
.dot-indicator.yours { background: #ffffff; }

.date-card.blocked {
  opacity: 0.35;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.01);
}

.date-card.selected {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.date-card.selected .date-day-name,
.date-card.selected .date-number {
  color: #000000;
}

.date-card.selected .dot-indicator {
  background: #ffffff;
}

.helper-text {
  font-size: 0.82rem;
  color: #a1a1aa;
  margin-top: -1.2rem;
}

/* Schedule Card (Image 3 Dropdown representation) */
.selected-day-schedule-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
}

.sched-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sched-icon-wrap {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sched-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sched-title {
  font-size: 0.95rem;
  font-weight: 750;
  color: #ffffff;
}

.sched-badges {
  display: flex;
  gap: 0.5rem;
}

.badge-avail {
  font-size: 0.65rem;
  font-weight: 800;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.badge-slots-count {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.btn-toggle-dropdown {
  color: var(--text-muted);
  transition: color 0.3s;
}

.btn-toggle-dropdown:hover {
  color: var(--text-main);
}

/* Booking blocks */
.booking-section-block {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.booking-block-title {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-label-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 1px;
  font-weight: 700;
  margin-top: -0.4rem;
}

.area-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}


.area-btn {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.3s;
}

.area-btn:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text-main);
}

.area-btn.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-weight: 700;
}

/* Radio Cards (Image 3) */
.usage-radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.radio-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.radio-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}

.radio-card.checked {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
}

.icon-pin {
  width: 14px;
  height: 14px;
  color: #ffffff;
  flex-shrink: 0;
}

.location-text {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.price-row {
  margin-top: 0.1rem;
}

.hidden-radio {
  display: none;
}

.custom-radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.15);
  margin-right: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.radio-card.checked .custom-radio-circle {
  border-color: #ffffff;
}

.radio-card.checked .custom-radio-circle::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #ffffff;
  border-radius: 50%;
  display: block;
}

.radio-card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.radio-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.radio-main-title {
  font-size: 0.95rem;
  font-weight: 750;
  color: #ffffff;
}

.badge-avail-inline {
  font-size: 0.6rem;
  font-weight: 800;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.radio-sub {
  font-size: 0.8rem;
  color: #a1a1aa;
}

.radio-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 0.2rem;
}

.radio-time {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
}

.radio-price {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
}

.radio-custom-txt {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ── CUSTOM HOURS RANGE PICKER ── */
.custom-time-range-picker {
  margin-top: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.picker-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.picker-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0; /* prevent overflow */
}

.picker-label {
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 800;
  color: #a1a1aa;
  letter-spacing: 0.5px;
}

.custom-dropdown-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.custom-dropdown-select:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Active select box gets a stylish gold-yellow highlight border matching the image */
.custom-dropdown-select.active {
  border-color: #d97706; /* amber/gold */
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 0 0 1px #d97706;
}

.select-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
}

.clock-icon {
  color: #a1a1aa;
  flex-shrink: 0;
}

.custom-dropdown-select.active .clock-icon {
  color: #d97706;
}

.selected-time-value {
  font-size: 0.95rem;
  font-weight: 750;
  color: #ffffff;
}

.chevron-icon {
  color: #a1a1aa;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
  color: #ffffff;
}

/* Dropdown Options List popover (Dark theme matching website, clean lists) */
.select-options-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  max-height: 220px;
  background: #18181b; /* dark bg matching website themes */
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.select-options-menu::-webkit-scrollbar {
  width: 4px;
}

.select-options-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}

.select-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.select-option-item:last-child {
  border-bottom: none;
}

.select-option-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.select-option-item.selected {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.option-time {
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
}

.option-status-booked {
  font-size: 0.55rem;
  font-weight: 800;
  color: #f43f5e; /* pink/red BOOKED label */
  background: rgba(244, 63, 94, 0.08);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.select-option-item.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.2);
}

.picker-help-text {
  font-size: 0.7rem;
  color: #a1a1aa;
  margin: 0;
  font-style: italic;
}

/* ── MOBILE BOTTOM SHEET FOR BOOKING SUMMARY ── */
.mobile-summary-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mobile-summary-sheet-card {
  width: 100%;
  max-width: 500px;
  background: #09090b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.25rem 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  animation: sheetSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes sheetSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.sheet-drag-handle {
  width: 36px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  align-self: center;
  cursor: pointer;
  margin-bottom: 0.25rem;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.5rem;
}

.sheet-header h3 {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 850;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.3px;
}

.btn-sheet-close {
  background: transparent;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  transition: color 0.2s;
}

.btn-sheet-close:hover {
  color: #ffffff;
}

.sheet-body {
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}


/* ── REVIEWS & LOCATION & FAQ OTHER PANES ── */
.section-block-title {
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  color: #ffffff;
  text-transform: none;
}

/* Grid layout for ULASAN tab */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.reviews-grid .premium-review-card-item {
  min-width: unset;
  max-width: unset;
}

.review-item-card {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reviewer-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.reviewer-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
}

.reviewer-date {
  font-size: 0.75rem;
  color: #a1a1aa;
}

.review-rating {
  display: flex;
}

.review-text-content {
  font-size: 0.92rem;
  color: #e4e4e7;
  line-height: 1.6;
  font-style: italic;
}

.address-text {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.mock-map-container {
  aspect-ratio: 16/9;
  background: #101014;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0);
  background-size: 24px 24px;
}

.map-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.map-tag {
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
}

.btn-open-gmaps {
  background: #ffffff;
  color: #000000;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-open-gmaps:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ── NEW REVIEW CARD STYLES ─────────────────── */
.reviews-carousel-slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: 100%;
  max-width: 100%;
}

.reviews-carousel-slider::-webkit-scrollbar {
  display: none;
}

.premium-review-card-item {
  min-width: 280px;
  max-width: 300px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: border-color 0.25s, transform 0.25s;
}

.premium-review-card-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.rcard-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rcard-avatar-wrap {
  flex-shrink: 0;
}

.rcard-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.12);
}

.rcard-meta-col {
  flex: 1;
  min-width: 0;
}

.rcard-author-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rcard-venue-tag {
  font-size: 0.75rem;
  color: #a1a1aa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rcard-date-badge {
  font-size: 0.72rem;
  color: #71717a;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
}

.rcard-stars-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rcard-star {
  flex-shrink: 0;
}

.rcard-rating-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f59e0b;
  margin-left: 4px;
}

.rcard-body-text {
  font-size: 0.88rem;
  color: #d4d4d8;
  line-height: 1.6;
  flex: 1;
  margin: 0;
}



.faq-details {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.faq-details[open] {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.faq-summary {
  padding: 1.2rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-chevron {
  transition: transform 0.3s;
  color: #e4e4e7;
}

.faq-details[open] .faq-chevron {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #e4e4e7;
  font-size: 0.92rem;
  line-height: 1.6;
}

/* ── REDESIGNED MAP CARD ─────────────────────── */
.redesigned-map-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.6rem 2rem;
  overflow: hidden;
  min-height: 80px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: border-color 0.3s;
}

.redesigned-map-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.map-info-section {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 2;
  position: relative;
}

.map-section-title {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.3px;
  text-transform: none;
  margin: 0;
}

.map-address-text {
  font-size: 0.85rem;
  color: #a1a1aa;
  margin: 0;
}

.map-action-section {
  z-index: 2;
  position: relative;
  flex-shrink: 0;
}

.btn-buka-peta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 100px;
  padding: 0.6rem 1.3rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

.btn-buka-peta-pill:hover {
  background: #e5e5e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.btn-buka-peta-pill svg {
  flex-shrink: 0;
}


.map-grid-bg {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 55%;
  z-index: 1;
  /* Fade mask from left to right */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.95) 100%);
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.95) 100%);
}

.map-grid-bg svg {
  width: 100%;
  height: 100%;
}

/* ── STICKY SIDE CARD (Image 2 & 3 Right) ─── */
.sticky-side-card {
  position: sticky;
  top: 100px;
  /* Bound height so the internal scroll area actually scrolls */
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  scrollbar-width: none;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.sticky-side-card::-webkit-scrollbar {
  display: none;
}

.price-section-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-side-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 800;
  letter-spacing: 1px;
}

.card-side-price {
  color: #ffffff;
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.card-side-price strong {
  font-size: 1.4rem;
  font-weight: 850;
  letter-spacing: -0.5px;
}

.price-unit {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.separator-dash {
  border: none;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin: 0;
}

.host-section-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.host-meta-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.host-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.host-info-card {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.host-name-card {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
}

.host-badge-official {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #22c55e;
  font-size: 0.6rem;
  font-weight: 800;
}

.icon-checkmark {
  width: 8px;
  height: 8px;
}

.btn-chat-host {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.7rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 750;
  font-size: 0.78rem;
  transition: all 0.3s;
  text-align: center;
  letter-spacing: 0.5px;
  width: 100%;
}

.btn-chat-host:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #ffffff;
}

.host-actions-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.btn-select-schedule {
  background: #ffffff;
  color: #000000;
  border: 1px solid #ffffff;
  padding: 0.7rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.78rem;
  transition: all 0.3s;
  text-align: center;
  letter-spacing: 0.5px;
  width: 100%;
}

.btn-select-schedule:hover {
  background: transparent;
  color: #ffffff;
  transform: translateY(-1px);
}

/* Selection summary card inside booking tab (Image 3 Right) */
.sticky-side-card.card-booking-summary {
  height: 470px;
  max-height: 470px;
  display: flex;
  flex-direction: column;
  overflow: hidden !important; /* Prevent card from scrolling, keep layout static */
}

.sticky-side-card.card-booking-summary .summary-schedules-scroll-area {
  max-height: 270px;
  flex-grow: 1;
}

.summary-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding-bottom: 0.6rem;
}

.summary-card-title {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin: 0;
}

.btn-edit-summary {
  background: rgba(255, 255, 255, 0.06);
  color: #a1a1aa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.65rem;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit-summary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.booking-summary-details {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

/* Scrollable area inside booking summary */
.summary-schedules-scroll-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  /* Dynamic max-height: fills the card's available space */
  max-height: calc(100vh - 380px);
  min-height: 80px;
  overflow-y: auto;
  padding-right: 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}

.summary-schedules-scroll-area::-webkit-scrollbar {
  width: 3px;
}

.summary-schedules-scroll-area::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}

/* Each date group */
.summary-date-group {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  overflow: hidden;
}

.summary-date-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-date-group-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-indicator-bar {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #ffffff;
  border-radius: 2px;
  flex-shrink: 0;
}

.date-group-title {
  font-size: 0.78rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.btn-remove-group {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.1rem;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.btn-remove-group:hover {
  opacity: 0.7;
}

/* Area row inside a date group */
.summary-area-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem 0.3rem;
  color: #a1a1aa;
}

.summary-area-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: #a1a1aa;
  letter-spacing: 0.5px;
}

/* Slots list */
.summary-slots-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 0.5rem 0.5rem;
}

.summary-slot-item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.summary-slot-item-card:last-child {
  border-bottom: none;
}

.slot-card-left {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #d4d4d8;
}

.slot-card-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: #e4e4e7;
}

.slot-card-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.slot-card-price {
  font-size: 0.78rem;
  font-weight: 800;
  color: #ffffff;
}

.btn-remove-slot {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.btn-remove-slot:hover {
  opacity: 0.7;
}

/* Footer totals */
.summary-footer-totals {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.s-label {
  color: #a1a1aa;
}

.s-val {
  color: #ffffff;
  font-weight: 700;
}

.total-row {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 0.75rem;
  align-items: center;
}

.total-price {
  font-size: 1.15rem;
  color: #ffffff;
  font-weight: 850;
}

.btn-confirm-booking {
  background: #ffffff;
  color: #000000;
  padding: 0.75rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.78rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  margin-top: 0.3rem;
}

.btn-confirm-booking:hover {
  background: #e5e5e5;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.15);
}

.booking-summary-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem 0.5rem;
  gap: 0.75rem;
  color: var(--text-muted);
}

.empty-icon-wrap {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e4e4e7;
}

.empty-msg {
  font-size: 0.85rem;
  line-height: 1.4;
}

/* ── STICKY BOTTOM BAR (Image 3 bottom) ─────── */
.sticky-bottom-booking-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 4.5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  gap: 1.5rem;
}

.bottom-bar-row-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.bottom-bar-row-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bottom-bar-left {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.bbar-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 800;
  letter-spacing: 1px;
}

.bbar-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.bbar-price {
  font-size: 1.3rem;
  font-weight: 850;
  color: #ffffff;
}

.btn-bottom-booking-main {
  background: #ffffff;
  color: #000000;
  padding: 0.75rem 2rem;
  border-radius: 100px;
  border: 1px solid #ffffff;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.85rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
  cursor: pointer;
}

.btn-bottom-booking-main:hover {
  background: #e5e5e5;
  border-color: #e5e5e5;
  transform: translateY(-1px);
}

.btn-bottom-booking-main:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-bottom-chat-icon {
  display: none; /* Only visible in mobile layout */
}

.btn-bottom-detail-text {
  display: none; /* Only visible in mobile layout */
}

/* ── GALLERY MODAL ──────────────── */
.gallery-modal-card {
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: min(90vw, 760px);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.25s ease-out;
}

.gallery-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.gallery-modal-header h3 {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin: 0;
  text-transform: none;
}

.btn-close-gallery {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-close-gallery:hover {
  background: rgba(255, 255, 255, 0.12);
}

.gallery-modal-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 1rem 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

.gallery-modal-scroll::-webkit-scrollbar {
  width: 4px;
}

.gallery-modal-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}

.gallery-modal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.gallery-modal-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 8px;
  cursor: zoom-in;
  transition: transform 0.2s, opacity 0.2s;
  border: 1px solid rgba(255,255,255,0.06);
}

.gallery-modal-img:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

/* Success Confirmation Overlay */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.success-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-out;
}

.success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card h3 {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: none;
  margin: 0;
}

.success-card p {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.btn-success-close {
  background: #ffffff;
  color: #000000;
  padding: 0.8rem 2rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.85rem;
  width: 100%;
  margin-top: 0.5rem;
  transition: all 0.3s;
}

.btn-success-close:hover {
  transform: scale(1.02);
}

/* ── ACCORDION DROPDOWN FOR OTHER VENUES ── */
.selected-day-schedule-card-wrapper {
  position: relative;
  width: 100%;
}

.selected-day-schedule-card {
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
}

.selected-day-schedule-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.btn-toggle-dropdown svg {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-toggle-dropdown.open svg {
  transform: rotate(180deg);
}

.venues-accordion-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  z-index: 999;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
}

.accordion-dropdown-header {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 800;
  color: #a1a1aa;
  padding: 0.75rem 1rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  letter-spacing: 0.5px;
}

.accordion-dropdown-scroll {
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.12) transparent;
}

.accordion-dropdown-scroll::-webkit-scrollbar {
  width: 4px;
}

.accordion-dropdown-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}

.accordion-venue-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.accordion-venue-item:last-child {
  border-bottom: none;
}

.accordion-venue-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.accordion-venue-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.accordion-venue-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.accordion-venue-name {
  font-size: 0.82rem;
  font-weight: 750;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.accordion-venue-meta {
  font-size: 0.68rem;
  color: #a1a1aa;
}

.accordion-select-arrow {
  color: #71717a;
  transition: color 0.2s;
  flex-shrink: 0;
}

.accordion-venue-item:hover .accordion-select-arrow {
  color: #ffffff;
}

/* ── RESPONSIVE DESIGN (All Devices) ──────── */

/* Tablet and Smaller Screen adjustments */
@media (max-width: 992px) {
  .detail-right-col {
    display: none !important; /* Hide sticky panel on mobile - detail button will toggle it */
  }

  .detail-gallery-host-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .detail-content-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .detail-content-layout.has-sidebar {
    grid-template-columns: 1fr;
  }
  
  .sticky-side-card {
    position: static;
    width: 100%;
  }
  
  .detail-host-col .card-host-summary {
    height: auto;
  }

  .gallery-grid {
    height: 320px;
  }
}

/* Mobile Devices (max-width: 768px) */
@media (max-width: 768px) {
  .date-carousel-wrapper {
    gap: 0.4rem;
  }

  .date-slider {
    gap: 0.4rem;
    padding: 0.2rem 0;
  }

  .date-card {
    flex: 0 0 50px;
    height: 62px;
    border-radius: 10px;
    gap: 0.25rem;
  }

  .date-day-name {
    font-size: 0.58rem;
  }

  .date-number {
    font-size: 0.95rem;
  }

  .dot-indicator {
    width: 4px;
    height: 4px;
  }

  .arrow-nav {
    width: 30px;
    height: 30px;
  }

  .btn-mini-cal {
    width: 36px;
    height: 36px;
    border-radius: 9px;
  }

  /* Mobile Bottom Bar Overrides matching dark website design */
  .sticky-bottom-booking-bar {
    background: rgba(9, 9, 11, 0.95) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    padding: 0.65rem 1rem 0.8rem !important; /* Shorter/smaller padding */
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0.45rem !important; /* Smaller gap */
  }

  .bottom-bar-row-top {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
  }

  .bottom-bar-left {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.05rem !important;
  }

  .bbar-label {
    font-family: var(--font-body) !important;
    font-size: 0.58rem !important;
    color: #a1a1aa !important; /* Match dark theme muted gray */
    font-weight: 800 !important;
    letter-spacing: 0.5px !important;
  }

  .bbar-price-row {
    display: flex !important;
    align-items: baseline !important;
  }

  .bbar-price {
    font-size: 1.18rem !important; /* Smaller price */
    font-weight: 850 !important;
    color: #ffffff !important; /* White color matching dark theme */
  }

  .btn-bottom-detail-text {
    display: flex !important;
    align-items: center !important;
    gap: 0.2rem !important;
    background: transparent !important;
    border: none !important;
    color: #ffffff !important; /* White text link */
    font-family: var(--font-body) !important;
    font-weight: 800 !important;
    font-size: 0.78rem !important;
    cursor: pointer !important;
    padding: 0 !important;
    opacity: 0.85 !important;
  }

  .btn-bottom-detail-text:hover {
    opacity: 1 !important;
  }

  .detail-arrow {
    font-size: 0.55rem !important;
    display: inline-block !important;
  }

  .bottom-bar-row-actions {
    display: flex !important;
    gap: 0.5rem !important;
    align-items: center !important;
    width: 100% !important;
  }

  .btn-bottom-booking-main {
    flex: 1 !important;
    background: #ffffff !important; /* White button color */
    color: #000000 !important; /* Black text */
    border: none !important;
    padding: 0.65rem 1.2rem !important; /* Smaller button padding */
    border-radius: 10px !important;
    font-family: var(--font-body) !important;
    font-weight: 800 !important;
    font-size: 0.82rem !important; /* Smaller font */
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1) !important;
    text-align: center !important;
    cursor: pointer !important;
  }

  .btn-bottom-booking-main:hover {
    background: #e5e5e5 !important;
  }

  .btn-bottom-booking-main:disabled {
    opacity: 0.3 !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
  }

  .btn-bottom-chat-icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 36px !important; /* Smaller chat icon size */
    height: 36px !important;
    border-radius: 10px !important;
    background: rgba(255, 255, 255, 0.08) !important; /* Dark glassmorphism chat bubble */
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
  }

  .btn-bottom-chat-icon:hover {
    background: rgba(255, 255, 255, 0.15) !important;
  }

  /* Keep mobile sheet scroll list constrained and scrollable */
  .mobile-summary-sheet-card .summary-schedules-scroll-area {
    max-height: 220px !important;
    overflow-y: auto !important;
  }

  .venue-section {
    padding: 1.5rem 0;
  }

  .title-display {
    font-size: 1.6rem;
  }

  .category-tabs {
    border-radius: 20px;
    padding: 0.4rem;
    max-width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .category-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-pill {
    flex-shrink: 0;
  }

  .venue-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, 90px);
    height: 280px;
    border-radius: 8px;
  }

  .gallery-large {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
  }

  .gallery-small-1 {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }

  .gallery-small-2 {
    display: none; /* Hide middle photos on mobile to avoid clutter */
  }

  .gallery-small-3 {
    display: none;
  }

  .gallery-small-4 {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  .rules-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .detail-tabs-bar {
    gap: 1.2rem;
  }

  .tab-btn {
    font-size: 0.8rem;
    padding: 0.75rem 0;
  }

  .description-card {
    gap: 1.5rem;
  }

  .category-pills-wrap {
    padding-left: 0.5rem;
  }

  .premium-facility-pill {
    font-size: 0.78rem;
    padding: 0.32rem 0.75rem;
  }

  .facilities-categories-container {
    gap: 1rem;
  }

  .redesigned-map-card {
    padding: 1.2rem 1.5rem;
  }

  .map-grid-bg {
    width: 45%;
  }

  .booking-section-header {
    gap: 0.8rem;
  }

  .calendar-legends {
    position: static;
    margin-top: 0.2rem;
  }

  .arrow-nav {
    display: none; /* Rely on native swipe scroll on mobile */
  }

  .date-slider {
    padding: 0.2rem 0;
  }

  .radio-card {
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }

  .custom-radio-circle {
    width: 15px;
    height: 15px;
    margin-right: 0.7rem;
  }

  .radio-card.checked .custom-radio-circle::after {
    width: 7px;
    height: 7px;
  }

  .radio-title-row {
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .radio-main-title {
    font-size: 0.8rem;
  }

  .radio-sub {
    font-size: 0.68rem;
  }

  .radio-card-right {
    min-width: 70px;
    gap: 0.1rem;
  }

  .radio-time {
    font-size: 0.72rem;
  }

  .radio-price {
    font-size: 0.8rem;
  }

  /* Custom slots responsive */
  .custom-slots-container {
    padding: 0.75rem;
    margin-top: 0.75rem;
  }

  .custom-slot-card {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
  }

  .custom-slot-time, .custom-slot-price {
    font-size: 0.72rem;
  }

  .custom-checkbox {
    width: 12px;
    height: 12px;
  }

  .custom-checkbox.checked svg {
    width: 8px;
    height: 8px;
  }
}

/* Extra Small Devices */
@media (max-width: 480px) {
  .venue-main-title {
    font-size: 1.8rem;
  }

  .desc-venue-title {
    font-size: 1.4rem;
  }

  .area-options {
    flex-wrap: wrap;
  }

  .area-btn {
    flex-grow: 1;
    text-align: center;
    padding: 0.55rem 1rem;
    font-size: 0.82rem;
  }

  .redesigned-map-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.2rem;
  }

  .map-action-section {
    align-self: stretch;
  }

  .btn-buka-peta-pill {
    width: 100%;
    justify-content: center;
  }

  .map-grid-bg {
    width: 100%;
    top: auto;
    bottom: 0;
    height: 50%;
    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
    mask-image: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  }

  .premium-review-card-item {
    min-width: 260px;
    max-width: 280px;
  }

  .gallery-modal-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-pills-wrap {
    padding-left: 0;
  }

  .premium-facility-pill {
    font-size: 0.75rem;
  }
}
</style>

