// main.js - shared scripts
document.addEventListener('DOMContentLoaded', function(){
  // set current year in all IDs if present
  ['year','year2','year3'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.textContent=new Date().getFullYear();
  });

  // hamburger toggles (works with multiple hamburger instances)
  document.querySelectorAll('.hamburger').forEach(btn=>{
    btn.addEventListener('click', function(){
      const header = btn.closest('.header-row') || document;
      const navList = header.querySelector('.nav-list');
      if(navList){
        navList.classList.toggle('open');
        btn.classList.toggle('is-active');
      }
    });
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-list a').forEach(a=>{
    a.addEventListener('click', function(){
      const nav = a.closest('.nav-list');
      if(nav && nav.classList.contains('open')){
        nav.classList.remove('open');
      }
    });
  });

  // Animated counters: supports Naira and plain numbers.
  function animateValue(el, start, end, duration, isCurrency){
    let startTime=null;
    function step(timestamp){
      if(!startTime) startTime=timestamp;
      const progress=Math.min((timestamp-startTime)/duration,1);
      const value=Math.floor(progress*(end-start)+start);
      if(isCurrency){
        el.textContent = new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits:0 }).format(value);
      } else {
        el.textContent = value.toLocaleString();
      }
      if(progress<1){
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  // run counters when they appear in viewport
  const counters = document.querySelectorAll('.stat-value');
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        if(seen.has(el)) return;
        seen.add(el);
        const raw = el.getAttribute('data-value') || el.textContent.replace(/\D/g,'');
        const end = parseInt(raw,10) || 0;
        const isCurrency = el.textContent.trim().startsWith('₦') || el.classList.contains('naira') || el.closest('.stats-grid');
        animateValue(el, 0, end, 1400, isCurrency);
      }
    });
  }, {threshold:0.3});
  counters.forEach(c=>io.observe(c));

  // tiny fade-in on load
  document.querySelectorAll('.page-section, .hero, .program').forEach(el=>el.classList.add('fade-in'));


  emailjs.init('YOUR_PUBLIC_KEY');

  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      };

      // update with your own EmailJS service & template IDs
      emailjs.send('ogechiogbaga9@gmail.com', 'YOUR_TEMPLATE_ID', formData)
        .then(() => {
          alert('✅ Message sent successfully!');
          contactForm.reset();
        })
        .catch((err) => {
          console.error('EmailJS Error:', err);
          alert('❌ Something went wrong. Please try again.');
        });
    });
  }
});
