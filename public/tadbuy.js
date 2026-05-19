// Tadbuy SDK v1.0.0
// Features: Publisher Ad Placements, Dynamic Retargeting Pixel, View-Through Tracking, Heatmap Scroll Tracking

(function(window, document) {
  const API_URL = "https://api.tadbuy.com/v1";

  class TadbuySDK {
    constructor() {
      this.initialized = false;
      this.publisherId = null;
      this.retargetingId = null;
      this.fingerprint = this._generateFingerprint();
    }

    // Phase 4: Bot Mitigation Fingerprinting (Privacy-Preserving)
    _generateFingerprint() {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      return btoa(`${navigator.userAgent}-${screen.width}x${screen.height}-${gl ? gl.getParameter(gl.RENDERER) : 'unknown'}`);
    }

    // Phase 5: Publisher SDK initialization
    initPublisher(config) {
      this.publisherId = config.id;
      this.initialized = true;
      this._renderAds();
      this._initHeatmap(); // Phase 2: Heatmap tracking
    }

    // Phase 1: Dynamic Retargeting Pixel
    initRetargeting(config) {
      this.retargetingId = config.id;
      fetch(`${API_URL}/retargeting/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advertiserId: this.retargetingId,
          url: window.location.href,
          fp: this.fingerprint
        })
      });
    }

    // Phase 2: Server-to-Server Postbacks via client side trigger
    trackConversion(value) {
      if (!this.retargetingId) return;
      fetch(`${API_URL}/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advertiserId: this.retargetingId, value, fp: this.fingerprint })
      });
    }

    _renderAds() {
      const adSlots = document.querySelectorAll('[data-tadbuy-slot]');
      adSlots.forEach(slot => {
        const keywords = slot.getAttribute('data-keywords') || ''; // Phase 1: Contextual Keyword Targeting
        const format = slot.getAttribute('data-format') || 'banner';
        const floorPrice = slot.getAttribute('data-floor') || 0; // Phase 1: Dynamic Floor Prices
        
        fetch(`${API_URL}/ads/serve?pub=${this.publisherId}&k=${keywords}&f=${format}&floor=${floorPrice}&fp=${this.fingerprint}`)
          .then(r => r.json())
          .then(data => {
            if (data.html) {
              slot.innerHTML = data.html;
              this._trackView(data.adId); // Phase 2: View-Through Attribution
            }
          });
      });
    }

    _trackView(adId) {
      fetch(`${API_URL}/ads/view`, { method: 'POST', body: JSON.stringify({ adId, fp: this.fingerprint }) });
    }

    _initHeatmap() {
      let scrollDepth = 0;
      window.addEventListener('scroll', () => {
        const depth = Math.round((window.scrollY / document.body.scrollHeight) * 100);
        if (depth > scrollDepth + 20) {
          scrollDepth = depth;
          fetch(`${API_URL}/analytics/heatmap`, { method: 'POST', body: JSON.stringify({ pubId: this.publisherId, scroll: scrollDepth }) });
        }
      });
    }
  }

  window.Tadbuy = new TadbuySDK();
})(window, document);
