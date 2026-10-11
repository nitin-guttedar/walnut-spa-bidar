/**
 * WALNUT SPA & WELLNESS - NAUBAD, BIDAR
 * Premium Interactive Engine: Parallax Depth, Reveal on Scroll, 3D Tilt, Draggable Slider & Modals
 */

// Image Fallback Resilience
window.addEventListener('error', (event) => {
  if (event.target && event.target.tagName === 'IMG') {
    const img = event.target;
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = 'true';
      img.src = 'assets/spa-suite-1.jpg';
    }
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initParallaxEffects();
  init3DTiltEngine();
  initServicesCarousel();
  initCatalogFilters();
  initAccordions();
  initStatsCounter();
  initServiceModal();
  initGalleryLightbox();
  initBookingEngine();
  initMobileNav();
  initSmoothScrollLinks();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. SCROLL REVEAL OBSERVER (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealElements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px 50px 0px',
    threshold: 0.04
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   3. GPU-ACCELERATED PARALLAX ENGINE (DEGRADES ON MOBILE & REDUCED MOTION)
   ========================================================================== */
function initParallaxEffects() {
  const isMobile = window.innerWidth <= 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || prefersReduced) return;

  const heroBanner = document.querySelector('.hero-banner');
  const heroFloating = document.querySelector('.hero-floating-card');
  const ambientOrbs = document.querySelectorAll('.glow-ambient-orb');
  const parallaxNodes = document.querySelectorAll('[data-parallax-speed]');

  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    // Hero background slow translation
    if (heroBanner && scrollY < window.innerHeight * 1.5) {
      const bannerOffset = scrollY * 0.18;
      heroBanner.style.backgroundPositionY = `calc(50% + ${bannerOffset}px)`;
    }

    // Hero floating badge counter-parallax
    if (heroFloating && scrollY < window.innerHeight) {
      const floatOffset = -(scrollY * 0.12);
      heroFloating.style.transform = `translate3d(0, ${floatOffset}px, 0)`;
    }

    // Ambient orbs subtle drift
    if (ambientOrbs.length && scrollY < window.innerHeight * 1.5) {
      ambientOrbs.forEach((orb, idx) => {
        const factor = (idx % 2 === 0 ? 0.08 : -0.06);
        orb.style.transform = `translate3d(0, ${scrollY * factor}px, 0)`;
      });
    }

    // Elements with custom speed
    parallaxNodes.forEach(node => {
      const speed = parseFloat(node.getAttribute('data-parallax-speed')) || 0.1;
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yOffset = (window.innerHeight - rect.top) * speed * 0.2;
        node.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   4. 3D CARD TILT MICRO-INTERACTION (DESKTOP ONLY)
   ========================================================================== */
function init3DTiltEngine() {
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasHover) return;

  const tiltCards = document.querySelectorAll('.tilt-3d');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -4px, 10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    });
  });
}

/* ==========================================================================
   5. TOP SERVICES PILL CAROUSEL (DRAGGABLE & TACTILE CONTROLS)
   ========================================================================== */
function initServicesCarousel() {
  const container = document.getElementById('servicesTrackContainer');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!container) return;

  const scrollAmount = 320;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Mouse Drag to Scroll with Velocity
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   6. TREATMENT CATALOG TABS FILTER
   ========================================================================== */
function initCatalogFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.catalog-card');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 16px, 0)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translate3d(0, 0, 0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. THERAPEUTIC ACCORDION
   ========================================================================== */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const wasActive = parent.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current
      if (!wasActive) {
        parent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. STATS ANIMATED COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(item => {
          const target = item.getAttribute('data-target') || item.textContent;
          const isPercent = target.includes('%');
          const isPlus = target.includes('+');
          const isRating = target.includes('.');
          
          if (isRating) {
            const finalVal = parseFloat(target);
            let cur = 0;
            const timer = setInterval(() => {
              cur += 0.1;
              if (cur >= finalVal) {
                cur = finalVal;
                clearInterval(timer);
              }
              item.textContent = cur.toFixed(1);
            }, 30);
          } else {
            const numValue = parseInt(target.replace(/[^0-9]/g, ''));
            let current = 0;
            const step = Math.max(1, Math.floor(numValue / 35));
            const timer = setInterval(() => {
              current += step;
              if (current >= numValue) {
                current = numValue;
                clearInterval(timer);
              }
              item.textContent = current + (isPercent ? '%' : (isPlus ? '+' : ''));
            }, 30);
          }
        });
      }
    });
  }, { threshold: 0.35 });

  const counterBar = document.querySelector('.stats-counter-bar');
  if (counterBar) observer.observe(counterBar);
}

/* ==========================================================================
   9. COMPLETE TREATMENT DETAILS MODAL DATA & CONTROLLER
   ========================================================================== */
const treatmentsData = {
  aroma: {
    title: "Aroma Therapy Massage",
    tagline: "Emotional serenity & botanical essential healing",
    image: "assets/spa-aroma-girl.jpg",
    pageUrl: "aroma-massage.html",
    duration: "60 / 90 Minutes",
    focus: "Full Body Stress Relief, Nervous System Calming",
    description: "Experience a soothing and relaxing Aroma Massage at Walnut Spa, Naubad, Bidar. This wellness-focused massage combines gentle rhythmic massage techniques with warm organic aromatic essential oils (lavender, eucalyptus, lemongrass, sandalwood). It is a wonderful choice for those looking to take a break from everyday stress, relax their muscles, and enjoy some peaceful personal time.",
    benefits: [
      "Deep emotional relaxation and anxiety relief",
      "Skin nourishment with organic botanicals",
      "Release of mental fog and daily fatigue",
      "Promotes deep, sound sleep"
    ]
  },
  body: {
    title: "Full Body Spa & Massage",
    tagline: "Complete head-to-toe relaxation & vital renewal",
    image: "assets/spa-female-massage.jpg",
    pageUrl: "full-body-spa-and-massage.html",
    duration: "60 / 90 / 120 Minutes",
    focus: "Holistic Total Body Rejuvenation",
    description: "Give yourself a well-deserved break with a relaxing Full Body Spa & Massage at Walnut Spa, Naubad, Bidar. Our skilled therapists work systematically across all major muscle groups—neck, shoulders, back, arms, legs, and feet—to dissolve fatigue, enhance lymph flow, and restore harmonic balance.",
    benefits: [
      "Relieves persistent full-body heaviness and fatigue",
      "Stimulates lymphatic circulation and detox",
      "Eases stiff joints and muscular tension",
      "Leaves you feeling completely revitalized"
    ]
  },
  thai: {
    title: "Traditional Thai Spa & Massage",
    tagline: "Ancient acupressure & passive yogic flexibility",
    image: "assets/spa-thai-girl.jpg",
    pageUrl: "thai-spa-and-massage.html",
    duration: "60 / 90 Minutes",
    focus: "Energy Meridians & Muscular Flexibility",
    description: "Experience the calming and restorative benefits of Thai Spa & Massage at Walnut Spa, Naubad, Bidar. Combining assisted yoga stretches, gentle rocking, and focused rhythmic palm pressure along the body's energy channels ('Sen lines'), this therapy releases energy blocks and unlocks freedom of movement.",
    benefits: [
      "Significantly boosts flexibility and joint mobility",
      "Unblocks stagnant energy pathways",
      "Corrects posture alignment and relieves lower back tightness",
      "Invigorating yet profoundly centering"
    ]
  },
  deep: {
    title: "Deep Tissue Muscle Therapy",
    tagline: "Intense myofascial tension release & knot therapy",
    image: "assets/spa-deep-tissue-girl.jpg",
    pageUrl: "deep-tissue-massage.html",
    duration: "60 / 90 Minutes",
    focus: "Chronic Muscle Knots & Postural Tension",
    description: "A therapeutic, slow-pressure treatment designed to target the inner layers of muscle fibers and connective tissues. Ideal for active individuals, gym-goers, or those experiencing chronic upper back, shoulder, and neck pain from prolonged desk work.",
    benefits: [
      "Breaks down stubborn adhesions and scar tissue",
      "Drastically reduces chronic neck, back, and hip pain",
      "Speeds up recovery from muscle fatigue",
      "Restores normal range of muscle motion"
    ]
  },
  swedish: {
    title: "Swedish Classical Massage",
    tagline: "The gold standard of gentle European relaxation",
    image: "assets/spa-female-massage.jpg",
    pageUrl: "swedish-massage.html",
    duration: "60 / 90 Minutes",
    focus: "Circulation Enhancement & Total Relaxation",
    description: "The world's most beloved classic therapeutic massage. Uses long, flowing effleurage strokes, gentle kneading (petrissage), and rhythmic percussion toward the heart. Perfect for newcomers to spa therapy who desire pure tranquility.",
    benefits: [
      "Enhances cardiovascular and venous blood return",
      "Gently loosens surface muscle stiffness",
      "Induces peaceful mental calm and lowers cortisol",
      "Hydrates and softens dry skin"
    ]
  },
  couple: {
    title: "Luxury Couple Massage & Spa",
    tagline: "Private shared luxury retreat with romantic ambiance",
    image: "assets/spa-couple-luxury.jpg",
    pageUrl: "couple-massage-and-spa.html",
    duration: "90 / 120 Minutes",
    focus: "Shared Wellness & Restful Bond",
    description: "Unwind alongside your partner in our exclusive private couple suite at Walnut Spa Bidar. Featuring twin massage tables, ambient candlelight, soothing aromas, and synchronized massage therapy performed by two senior therapists.",
    benefits: [
      "Private VIP suite with serene aesthetic atmosphere",
      "Synchronized dual therapist treatment",
      "Includes herbal tea ritual and optional jacuzzi session",
      "Ideal for anniversaries, birthdays, or weekend getaways"
    ]
  },
  jacuzzi: {
    title: "Jacuzzi Spa & Hydrotherapy",
    tagline: "Warm aerated hydro-jets & mineral soak",
    image: "assets/spa-jacuzzi.jpg",
    pageUrl: "jacuzzi-massage-and-spa.html",
    duration: "45 / 60 Minutes",
    focus: "Hydro-thermal Relief & Muscle Decompression",
    description: "Immerse yourself in our premium temperature-controlled jacuzzi tub equipped with targeted hydro-massage jets. Water buoyancy cradles your spine, relieves joint compression, and melts away tension prior to or after a body massage.",
    benefits: [
      "Hydro-jets target lumbar, calves, and shoulder blades",
      "Water buoyancy relieves stress on weight-bearing joints",
      "Promotes deep vascular dilation and relaxation",
      "Can be paired with body scrub or steam bath"
    ]
  },
  steam: {
    title: "Herbal Steam Bath",
    tagline: "Detoxifying botanical mist & pore opening",
    image: "assets/spa-steam.jpg",
    pageUrl: "steam-bath.html",
    duration: "30 / 45 Minutes",
    focus: "Skin Detoxification & Respiratory Relief",
    description: "Step into our aromatic steam chamber infused with eucalyptus and herbal extracts. The warm, nutrient-rich steam cleanses skin impurities, improves respiration, and prepares the body for deep restorative oil therapies.",
    benefits: [
      "Deeply opens pores and flushes subcutaneous toxins",
      "Clears sinuses and improves respiratory ease",
      "Warms muscle fibers to prevent cramping",
      "Leaves skin visibly glowing and refreshed"
    ]
  },
  signature: {
    title: "Walnut Signature Wellness Massage",
    tagline: "Our master therapist's bespoke fusion ritual",
    image: "assets/spa-amenities.jpg",
    pageUrl: "signature-massage.html",
    duration: "90 / 120 Minutes",
    focus: "The Ultimate Walnut Spa Luxury Experience",
    description: "Our crowning masterpiece: a synchronized combination of Swedish flow, Balinese pressure, warm herbal compresses, and custom aromatherapy oils curated specifically to your body's unique state on the day of your visit.",
    benefits: [
      "Personalized therapist assessment before treatment",
      "Combination of warm herbal compress + acupressure",
      "Custom essential oil selection based on mood & tension",
      "The ultimate signature treatment in Bidar"
    ]
  },
  balinese: {
    title: "Traditional Balinese Massage",
    tagline: "Exotic Indonesian acupressure & warm oil rolling",
    image: "assets/spa-balinese-girl.jpg",
    pageUrl: "balinese-massage.html",
    duration: "60 / 90 Minutes",
    focus: "Deep Muscle Acupressure & Skin Rolling",
    description: "Originating from Bali, Indonesia, this therapeutic ritual combines acupressure, gentle skin rolling, kneading, and warm fragrant coconut and spice oils to stimulate blood and chi flow throughout the whole body.",
    benefits: [
      "Deep tissue penetration without excessive soreness",
      "Stimulates energetic meridians and eases nervous exhaustion",
      "Warm floral and herbal oils awaken the senses",
      "Fosters a deep sense of peace and emotional equilibrium"
    ]
  },
  reflexology: {
    title: "Foot & Hand Reflexology",
    tagline: "Reflex point stimulation for whole-body vitality",
    image: "assets/spa-reflexology.jpg",
    duration: "45 / 60 Minutes",
    focus: "Targeted Pressure Points on Soles & Palms",
    description: "Based on the ancient principle that specific reflex zones on the feet and hands map directly to internal glands and organs. Precise thumb and finger pressure relieves internal fatigue and promotes natural self-healing.",
    benefits: [
      "Relieves heavy, aching feet and swollen ankles",
      "Improves digestion, sleep patterns, and nerve response",
      "Stimulates internal organs through neurological pathways",
      "Deeply calming with no need to undress"
    ]
  },
  sauna: {
    title: "Dry Sauna Relaxation",
    tagline: "Infrared dry heat therapy for muscular recovery",
    image: "assets/spa-sauna.jpg",
    duration: "30 / 45 Minutes",
    focus: "Thermal Detoxification & Cardiovascular Calming",
    description: "Relax in dry, cedar-scented soothing warmth. The dry heat elevates skin temperature, relaxes taut muscle fibers, and induces healthy perspiration that relieves bodily heaviness.",
    benefits: [
      "Soothes joint inflammation and arthritis stiffness",
      "Accelerates post-workout muscle recovery",
      "Induces release of natural endorphins",
      "Ideal companion prior to full-body massages"
    ]
  }
};

function initServiceModal() {
  const modalOverlay = document.getElementById('serviceModalOverlay');
  const modalBody = document.getElementById('serviceModalBody');
  const closeBtn = document.getElementById('serviceModalClose');

  if (!modalOverlay || !modalBody) return;

  document.querySelectorAll('[data-service-key]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-service-key');
      const data = treatmentsData[key];

      if (data) {
        renderModalContent(data);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  function renderModalContent(data) {
    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
        <div style="height: 280px; border-radius: 20px; overflow: hidden; position: relative;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(20, 28, 22, 0.88); backdrop-filter: blur(8px); padding: 6px 16px; border-radius: 999px; color: #FFF; font-size: 0.85rem; font-weight: 600;">
            ${data.duration}
          </div>
        </div>

        <div>
          <span class="section-tag">${data.focus}</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 6px; color: var(--text-main);">${data.title}</h2>
          <p style="font-style: italic; color: var(--accent-gold); margin-bottom: 18px; font-size: 1.05rem;">${data.tagline}</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 0.98rem;">${data.description}</p>

          <h4 style="font-family: var(--font-sans); font-size: 1rem; font-weight: 600; margin-bottom: 12px; color: var(--text-main);">Key Therapy Benefits:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px;">
            ${data.benefits.map(b => `
              <li style="display: flex; align-items: center; gap: 10px; font-size: 0.92rem; color: var(--text-muted);">
                <i class="fas fa-check-circle" style="color: var(--accent-gold);"></i> ${b}
              </li>
            `).join('')}
          </ul>

          <div style="display: flex; flex-wrap: wrap; gap: 14px; border-top: 1px solid var(--border-subtle); padding-top: 24px;">
            ${data.pageUrl ? `<a href="${data.pageUrl}" class="btn btn-light" style="flex: 1 1 100%; text-align: center;"><i class="fas fa-external-link-alt"></i> View Full Therapy Guide & Spec</a>` : ''}
            <a href="https://wa.me/919972053939?text=Hello%20Walnut%20Spa,%20I%20would%20like%20to%20inquire%20and%20book%20the%20${encodeURIComponent(data.title)}" 
               target="_blank" 
               class="btn btn-whatsapp" 
               style="flex: 1;">
              <i class="fab fa-whatsapp"></i> Book via WhatsApp
            </a>
            <a href="tel:+919972053939" class="btn btn-dark" style="flex: 1;">
              <i class="fas fa-phone"></i> Call +91 9972053939
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   10. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.gallery-card img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLb();
    }
  });
}

/* ==========================================================================
   11. SMART BOOKING ENGINE -> WHATSAPP LINK GENERATOR
   ========================================================================== */
function initBookingEngine() {
  const form = document.getElementById('spaBookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookName')?.value.trim() || 'Guest';
    const phone = document.getElementById('bookPhone')?.value.trim() || 'Not specified';
    const service = document.getElementById('bookService')?.value || 'General Spa Therapy';
    const date = document.getElementById('bookDate')?.value || 'As soon as possible';
    const time = document.getElementById('bookTime')?.value || 'Anytime';
    const therapist = document.getElementById('bookTherapist')?.value || 'No preference';
    const notes = document.getElementById('bookNotes')?.value.trim() || 'None';

    const message = `Hello Walnut Spa Naubad, Bidar! 🌿%0A%0AI would like to book a therapy session with you:%0A%0A• *Client Name:* ${encodeURIComponent(name)}%0A• *Contact Phone:* ${encodeURIComponent(phone)}%0A• *Service Selected:* ${encodeURIComponent(service)}%0A• *Preferred Date:* ${encodeURIComponent(date)}%0A• *Preferred Time:* ${encodeURIComponent(time)}%0A• *Therapist Preference:* ${encodeURIComponent(therapist)}%0A• *Notes/Requests:* ${encodeURIComponent(notes)}%0A%0APlease confirm availability for me. Thank you!`;

    const whatsappUrl = `https://wa.me/919972053939?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   12. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.mobile-nav-list a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   13. SMOOTH SCROLL ANCHOR LINKS
   ========================================================================== */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
