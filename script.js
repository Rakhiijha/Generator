(function() {
  // ========================
  // DOM ELEMENT REFERENCES
  // ========================
  const form = document.getElementById('form');
  const toInput = document.getElementById('toInput');
  const fromInput = document.getElementById('fromInput');
  const msgInput = document.getElementById('msgInput');
  const themeSelect = document.getElementById('themeSelect');
  const photoInput = document.getElementById('photoInput');
  const previewSection = document.getElementById('preview');
  const previewCard = document.getElementById('previewCard');
  const previewBtn = document.getElementById('previewBtn');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  const primaryColor = document.getElementById('primaryColor');
  const bgColor = document.getElementById('bgColor');
  const fontSelect = document.getElementById('fontSelect');
  const titleText = document.getElementById('titleText');
  const bodyText = document.getElementById('bodyText');
  const titlePreview = document.getElementById('titlePreview');
  const bodyPreview = document.getElementById('bodyPreview');

  const decor = document.getElementById('decor');
  const classicDiya = document.getElementById('classicDiya');
  const glowOrb = document.getElementById('glowOrb');
  const sparkleWrap = document.getElementById('sparkleWrap');
  const garland = document.getElementById('garland');
  const candleEl = document.getElementById('candleEl');
  const fwCanvas = document.getElementById('fwCanvas');
  const bgImage = document.getElementById('bgImage');

  // Canvas context
  const ctx = fwCanvas.getContext('2d');
  let cw, ch;

  // State
  let currentImageData = null;
  let currentTheme = 'classic';
  let fireworks = [];

  // ========================
  // IMAGE RESIZING FUNCTION
  // ========================
  function resizeImage(file, maxW, maxH) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ========================
  // RENDER PREVIEW CARD
  // ========================
  function renderCard() {
    const to = toInput.value.trim() || 'Dear Friend';
    const from = fromInput.value.trim();
    const msg = msgInput.value.trim() || 'Happy Diwali!';
    const theme = themeSelect.value;

    previewCard.className = `greeting-card theme-${theme}`;
    previewCard.innerHTML = `
      <div class="wish">शुभ दीपावली</div>
      <div class="who">To: ${to}</div>
      ${currentImageData ? `<img src="${currentImageData}" alt="Photo" style="width:80%;border-radius:10px;margin:10px 0;">` : ''}
      <div class="msg">${msg}${from ? ` — ${from}` : ''}</div>
    `;
    previewSection.hidden = false;
  }

  // ========================
  // IMAGE UPLOAD HANDLER
  // ========================
  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return currentImageData = null;
    if (!file.type.startsWith('image/')) return alert('Please upload an image');
    currentImageData = await resizeImage(file, 900, 900);
  });

  // ========================
  // PREVIEW & DOWNLOAD HANDLERS
  // ========================
  previewBtn.addEventListener('click', renderCard);
  themeSelect.addEventListener('change', () => {
    renderCard();
    applyTheme(themeSelect.value);
  });

  generateBtn.addEventListener('click', () => {
    renderCard();
    html2canvas(previewCard).then(canvas => {
      const link = document.createElement('a');
      link.download = 'diwali-greeting.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  downloadBtn.addEventListener('click', () => {
    html2canvas(previewCard).then(canvas => {
      const link = document.createElement('a');
      link.download = 'diwali-greeting.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // ========================
  // RESET HANDLER
  // ========================
  resetBtn.addEventListener('click', () => {
    form.reset();
    previewCard.innerHTML = '';
    previewSection.hidden = true;
    currentImageData = null;
    currentTheme = 'classic';
    applyTheme('classic');
    updateAccentElements();
    titlePreview.textContent = titleText.value = 'Happy Diwali!';
    bodyPreview.textContent = bodyText.value = 'Wishing you light, joy and prosperity.';
    primaryColor.value = '#ffb74d';
    bgColor.value = '#081124';
    fontSelect.value = 'Inter';
    document.documentElement.style.setProperty('--primary','#ffb74d');
    document.documentElement.style.setProperty('--bg','#081124');
    document.body.style.fontFamily='Inter';
  });

  // ========================
  // THEME MANAGEMENT
  // ========================
  function applyTheme(theme) {
    currentTheme = theme;
    preview.className = 'preview theme-' + theme;

    [classicDiya, glowOrb, sparkleWrap, garland, candleEl].forEach(el => el.style.display = 'none');
    sparkleWrap.innerHTML = '';
    garland.innerHTML = '';
    decor.innerHTML = '';

    if(theme==='classic') classicDiya.style.display='block';
    if(theme==='glow') glowOrb.style.display='block';
    if(theme==='sparkle') createSparkles();
    if(theme==='festival') createGarland();
    if(theme==='fireworks') {} // handled by canvas loop
    if(theme==='candlelight') candleEl.style.display='block';
  }

  function createSparkles() {
    sparkleWrap.style.display = 'block';
    for(let i=0;i<20;i++){
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = Math.random()*90 + '%';
      s.style.bottom = (20 + Math.random()*60)+'px';
      s.style.animationDuration = (1.1 + Math.random()*1.6)+'s';
      s.style.background = primaryColor.value;
      sparkleWrap.appendChild(s);
    }
  }

  function createGarland() {
    garland.style.display='flex';
    for(let i=0;i<18;i++){
      const l=document.createElement('div');
      l.className='lamp';
      l.style.background = primaryColor.value;
      garland.appendChild(l);
    }
  }

  function updateAccentElements() {
    document.querySelectorAll('.sparkle').forEach(s=> s.style.background = primaryColor.value );
    document.querySelectorAll('.garland .lamp').forEach(l=> l.style.background = primaryColor.value );
    const flame = document.querySelector('.flame');
    if(flame) flame.style.background = `linear-gradient(180deg, #fff2a8, ${primaryColor.value} 60%, #ff6d00)`;
  }

  // ========================
  // BACKGROUND IMAGE UPLOAD
  // ========================
  bgImage.addEventListener('change', e=>{
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    preview.style.backgroundImage = `url(${url})`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
  });

  // ========================
  // CANVAS & FIREWORKS SYSTEM
  // ========================
  function resizeCanvas(){
    cw = fwCanvas.width = fwCanvas.offsetWidth;
    ch = fwCanvas.height = fwCanvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function spawnFirework(x,y){
    const count = 20 + Math.floor(Math.random()*40);
    const hue = Math.floor(Math.random()*360);
    for(let i=0;i<count;i++){
      fireworks.push({ x, y, vx:(Math.random()-0.5)*6, vy:(Math.random()-0.9)*6, life:60 + Math.random()*40, age:0, hue });
    }
  }

  function stepFireworks(){
    ctx.clearRect(0,0,cw,ch);
    for(let i=fireworks.length-1;i>=0;i--){
      const p = fireworks[i];
      p.vy += 0.06;
      p.x += p.vx;
      p.y += p.vy;
      p.age++;
      const t = p.age/p.life;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `hsl(${p.hue}, 90%, ${70 - t*50}%)`;
      ctx.beginPath();
      ctx.arc(p.x,p.y, Math.max(0, 2*(1-t)), 0, Math.PI*2);
      ctx.fill();
      if(p.age>p.life) fireworks.splice(i,1);
    }
  }

  let fwTick=0;
  function fwLoop(){
    fwTick++;
    if(currentTheme==='fireworks' && fwTick%40===0){
      const x = 80 + Math.random()*(cw-160);
      const y = 80 + Math.random()*(ch-160);
      spawnFirework(x,y);
    }
    stepFireworks();
    requestAnimationFrame(fwLoop);
  }
  fwLoop();

  // ========================
  // INTERACTIVE ELEMENTS
  // ========================
  primaryColor.addEventListener('input', e => {
    document.documentElement.style.setProperty('--primary', e.target.value);
    updateAccentElements();
  });

  bgColor.addEventListener('input', e => {
    document.documentElement.style.setProperty('--bg', e.target.value);
    preview.style.backgroundColor = e.target.value;
  });

  fontSelect.addEventListener('change', e => {
    document.documentElement.style.setProperty('--font-stack', `"${e.target.value}", sans-serif`);
    document.body.style.fontFamily = `"${e.target.value}", sans-serif`;
  });

  titleText.addEventListener('input', e => titlePreview.textContent = e.target.value);
  bodyText.addEventListener('input', e => bodyPreview.textContent = e.target.value);

  // Clicking preview spawns fireworks if theme is fireworks
  preview.addEventListener('click', (e)=>{
    if(currentTheme==='fireworks'){
      const rect = preview.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnFirework(x,y);
    }
  });

  // ========================
  // INITIALIZE
  // ========================
  applyTheme('classic');
  updateAccentElements();
})();
