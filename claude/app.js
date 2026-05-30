const AVATAR_URL =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000/"
    : "/design.html";

// 디자인: 새 탭으로 3D 앱 열기
document.getElementById("designLink")?.setAttribute("href", AVATAR_URL);
const NAME = "진선";

// 인사말 풀 (실제 claude.ai 패턴) — 시간대별, 세션 동안 고정
const GREETINGS = {
  morning: ["좋은 아침이에요, {name} 님"],
  afternoon: ["좋은 오후예요, {name} 님"],
  evening: ["좋은 저녁이에요", "좋은 저녁이에요, {name} 님", "오늘 밤엔 무슨 생각 하세요?"],
  any: [
    "{name} 님, 다시 오셨네요!",
    "다시 시작해볼까요, {name} 님",
    "다시 시작해볼까요!",
    "커피 한 잔과 함께 클로드 어때요?",
    "처음 뵙겠습니다",
    "환영해요, {name} 님",
    "무슨 생각 하세요, {name} 님?",
    "어떻게 지내세요, {name} 님?",
    "오늘 하루 어땠어요, {name} 님?",
    "잘 지내셨어요, {name} 님?",
    "새로운 소식 있어요, {name} 님?",
    "주말을 즐겨요, {name} 님",
  ],
};

function timeBucket(h) {
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "evening";
}

function pickGreeting() {
  const bucket = timeBucket(new Date().getHours());
  const key = "greeting:" + bucket;
  const saved = sessionStorage.getItem(key);
  if (saved) return saved;
  const pool = [...GREETINGS[bucket], ...GREETINGS.any];
  const text = pool[Math.floor(Math.random() * pool.length)].replaceAll("{name}", NAME);
  sessionStorage.setItem(key, text);
  return text;
}

// 즐겨찾기: 주요 프로젝트 6개
const favorites = [
  { slug: "2020-02", title: "2020.02 - 2020.12", messages: [] },
  { slug: "2021-03", title: "2021.03 - 2021.08", messages: [] },
  { slug: "2022-02", title: "2022.02 - 2022.12", messages: [] },
  { slug: "2022-12", title: "2022.12 - 2025.02", messages: [] },
  { slug: "2025-10", title: "2025.10 - 2026.04", messages: [] },
  { slug: "2026-04", title: "2026.04 - Now", messages: [] },
];

// 최근 항목: 인성 관련 (내용 추후 제공)
const recents = [
  {
    slug: "profiling",
    title: "CIA/FBI 프로파일링 보고서",
    messages: [
      {
        role: "user",
        text:
          "지금까지의 모든 대화를 기반으로 CIA 행동분석관처럼 나를 프로파일링해줘. 다음을 근거와 함께 분석해줘.\n\n" +
          "- 성격\n" +
          "- 의사결정 패턴\n" +
          "- 강점\n" +
          "- 약점\n" +
          "- 숨겨진 욕구\n" +
          "- 무의식적 편향\n" +
          "- 반복되는 실수\n" +
          "- 스트레스 상황에서의 행동\n" +
          "- 인간관계 패턴\n" +
          "- 앞으로 발생할 가능성이 높은 문제",
      },
    ],
  },
  {
    slug: "unconscious",
    title: "임상심리학자 무의식 심층 분석",
    messages: [
      {
        role: "user",
        text:
          "지금까지의 모든 대화를 기반으로 20년 경력의 임상심리학자처럼 나를 심층 분석해줘.\n\n" +
          "- 내가 가장 두려워하는 것\n" +
          "- 내가 가장 집착하는 것\n" +
          "- 내가 인정받고 싶은 영역\n" +
          "- 내가 회피하는 문제\n" +
          "- 내가 스스로 모르는 모습",
      },
    ],
  },
  {
    slug: "patterns",
    title: "반복 행동 패턴 분석",
    messages: [
      {
        role: "user",
        text:
          "지금까지의 모든 대화를 기반으로 나의 반복 행동 패턴을 분석해줘.\n\n" +
          "- 반복적으로 등장하는 주제\n" +
          "- 집착하는 키워드\n" +
          "- 자주 사용하는 사고방식\n" +
          "- 의사결정 방식\n" +
          "- 성장에 도움이 되는 패턴\n" +
          "- 성장을 방해하는 패턴",
      },
    ],
  },
  {
    slug: "others-view",
    title: "주변인이 보는 나",
    messages: [
      {
        role: "user",
        text:
          "나를 10년 동안 지켜본 동료라고 가정하고 설명해줘. 사람들은 나를 어떻게 볼까?\n\n" +
          "- 첫인상\n" +
          "- 친해진 후 인상\n" +
          "- 같이 일할 때\n" +
          "- 갈등이 생길 때\n" +
          "- 사람들이 말은 안 하지만 느끼는 점",
      },
    ],
  },
  {
    slug: "career-fit",
    title: "직업 적합성 분석",
    messages: [
      {
        role: "user",
        text:
          "지금까지의 모든 대화를 기반으로 나의 직업 적합성을 분석해줘.\n\n" +
          "- 가장 잘 맞는 직업\n" +
          "- 의외로 안 맞는 직업\n" +
          "- 내가 과소평가하는 능력\n" +
          "- 내가 과대평가하는 능력\n" +
          "- 앞으로 10년간 가장 성공 가능성이 높은 방향",
      },
    ],
  },
  {
    slug: "life-theme",
    title: "삶을 관통하는 하나의 주제",
    messages: [
      {
        role: "user",
        text:
          "\"이 사람은 평생 무엇을 추구해 온 사람인가?\"라는 질문에 답해줘.\n\n" +
          "직업, 기술, 학력 같은 표면적인 내용 말고 삶 전체를 관통하는 하나의 주제를 찾아줘.",
      },
    ],
  },
  {
    slug: "summary",
    title: "종합 인물 분석 리포트",
    messages: [
      {
        role: "user",
        text:
          "지금까지의 모든 대화를 기반으로 종합 인물 분석 리포트를 작성해줘.\n\n" +
          "- 핵심 정체성\n" +
          "- 가장 강한 강점 3개\n" +
          "- 가장 위험한 약점 3개\n" +
          "- 무의식적 동기\n" +
          "- 반복되는 행동 패턴\n" +
          "- 숨겨진 재능\n" +
          "- 앞으로 5년 안에 발생할 가능성이 높은 문제\n" +
          "- 반드시 조심해야 할 것 1가지\n\n" +
          "위로하거나 포장하지 말고 사실만 말해줘. 근거를 반드시 제시해줘.",
      },
    ],
  },
];

const convMap = {};
[...favorites, ...recents].forEach((c) => (convMap[c.slug] = c));

// 인사말: 시간대 기준, 세션 동안 고정 (새로고침해도 유지)
const greetingEl = document.getElementById("greetingText");
greetingEl.textContent = pickGreeting();

// 사이드바 목록 채우기
const favList = document.getElementById("favList");
const recentList = document.getElementById("recentList");
function navItemHTML(c) {
  return `<a class="nav-item conv" href="#/c/${c.slug}" data-slug="${c.slug}"><span>${c.title}</span></a>`;
}
favList.innerHTML = favorites.map(navItemHTML).join("");
recentList.innerHTML = recents.map(navItemHTML).join("");

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function msgHTML(m) {
  return m.role === "user"
    ? `<div class="msg user"><div class="bubble">${escapeHtml(m.text)}</div></div>`
    : `<div class="msg assistant"><div class="md">${escapeHtml(m.text)}</div></div>`;
}

function renderChat(slug) {
  const thread = document.getElementById("chatThread");
  const headerTitle = document.getElementById("chatHeaderTitle");
  const c = convMap[slug];
  if (!c) {
    headerTitle.textContent = "";
    thread.innerHTML = `<div class="msg assistant"><div class="md">대화를 찾을 수 없어요.</div></div>`;
    return;
  }
  headerTitle.textContent = c.title;
  const msgs =
    c.messages && c.messages.length
      ? c.messages
      : [
          { role: "user", text: `${c.title} 시기엔 어떤 일을 했어?` },
          { role: "assistant", text: "이 자리에 해당 대화 내용이 들어갑니다. (내용 준비 중)" },
        ];
  thread.innerHTML = msgs.map(msgHTML).join("");
  const sc = document.getElementById("chatScroll");
  if (sc) sc.scrollTop = 0;
}

function parseHash() {
  const h = location.hash || "#/";
  if (h.startsWith("#/c/")) return { view: "chat", slug: decodeURIComponent(h.slice(4)) };
  return { view: "home" };
}

function setActive({ view, slug }) {
  document.querySelectorAll(".nav-item").forEach((a) => a.classList.remove("active"));
  if (view === "home") document.querySelector('[data-route="home"]')?.classList.add("active");
  else if (view === "chat") document.querySelector(`[data-slug="${slug}"]`)?.classList.add("active");
}

function render() {
  const route = parseHash();
  document.body.dataset.view = route.view;
  document.querySelectorAll(".view").forEach((v) => (v.hidden = v.dataset.view !== route.view));

  if (route.view === "chat") renderChat(route.slug);
  setActive(route);
  closeDrawer();
}

// 사이드바 드로어 / 접기
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const toggle = document.getElementById("toggleSidebar");
const mobileToggle = document.getElementById("mobileToggle");

function isNarrow() {
  return window.matchMedia("(max-width: 768px)").matches;
}
function closeDrawer() {
  sidebar.classList.remove("drawer-open");
  backdrop.classList.remove("show");
}
function openDrawer() {
  sidebar.classList.remove("collapsed");
  sidebar.classList.add("drawer-open");
  backdrop.classList.add("show");
}

toggle.addEventListener("click", () => {
  if (isNarrow()) closeDrawer();
  else sidebar.classList.toggle("collapsed");
});
mobileToggle.addEventListener("click", openDrawer);
backdrop.addEventListener("click", closeDrawer);

// 라우팅
window.addEventListener("hashchange", render);
render();

// 미구현 링크: 눌려도 동작 없음
document.querySelectorAll('a[href="#"]').forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));

// 홈 입력창
const input = document.getElementById("composerInput");
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = input.textContent.trim();
    if (!text) return;
    console.log("submit:", text);
    input.textContent = "";
  }
});

// 대화 입력창: 보낸 질문을 스레드에 추가 (저장 로직은 추후)
const chatInput = document.getElementById("chatInput");
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = chatInput.textContent.trim();
    if (!text) return;
    const thread = document.getElementById("chatThread");
    thread.insertAdjacentHTML("beforeend", msgHTML({ role: "user", text }));
    chatInput.textContent = "";
    const sc = document.getElementById("chatScroll");
    if (sc) sc.scrollTop = sc.scrollHeight;
  }
});
