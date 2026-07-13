const SUPABASE_URL = 'https://fthupnpifkxwjubtzyjj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ranIVsUillvlRx8jLs6ZCQ_3JTjKpPp';

async function sendMessage() {
  const name = document.getElementById('inp-name').value.trim();
  const email = document.getElementById('inp-email').value.trim();
  const message = document.getElementById('inp-message').value.trim();
  const status = document.getElementById('form-status');
  const btn = document.getElementById('send-btn');

  if (!name || !email || !message) {
    status.style.color = '#f87171';
    status.textContent = '모든 항목을 입력해 주세요.';
    return;
  }

  btn.disabled = true;
  btn.textContent = '전송 중...';
  status.textContent = '';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok || res.status === 201) {
      status.style.color = '#4ade80';
      status.textContent = '✅ 메시지가 전송됐습니다! 곧 연락드릴게요.';
      document.getElementById('inp-name').value = '';
      document.getElementById('inp-email').value = '';
      document.getElementById('inp-message').value = '';
    } else {
      throw new Error(res.status);
    }
  } catch (e) {
    status.style.color = '#f87171';
    status.textContent = '❌ 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }

  btn.disabled = false;
  btn.textContent = '메시지 보내기';
}

// 스크롤 애니메이션
const els = document.querySelectorAll('.fade-in');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') });
}, {threshold: 0.1});
els.forEach(el => obs.observe(el));
