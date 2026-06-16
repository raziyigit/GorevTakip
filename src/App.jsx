import React, { useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  filterTasks,
  formatDate,
  formatDateTime,
  formatDay,
  ileriButonEtiketi,
  isTipiSinifi,
  oncelikSinifi,
  sprintDurumSinifi,
  durumSinifi,
  useAppState,
  useTaskHelpers
} from "./state/AppState";

const navItems = [
  {
    to: "/gorevler",
    eyebrow: "Operasyon",
    title: "İş Öğeleri",
    subtitle: "Backlog, bug ve teslim kalemlerini tek akışta yönet",
    tag: "Liste",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M4.5 5.5H15.5" />
        <path d="M4.5 10H15.5" />
        <path d="M4.5 14.5H11.5" />
      </svg>
    )
  },
  {
    to: "/gorevler/pano",
    eyebrow: "Süreç",
    title: "Akış Tahtası",
    subtitle: "Kart bazlı ilerlemeyi canlı süreç akışı ile yönlendir",
    tag: "Pano",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="3.5" y="4" width="5.5" height="5.5" rx="1.2" />
        <rect x="11" y="4" width="5.5" height="3.5" rx="1.2" />
        <rect x="11" y="9.5" width="5.5" height="6.5" rx="1.2" />
        <rect x="3.5" y="11.5" width="5.5" height="4.5" rx="1.2" />
      </svg>
    )
  },
  {
    to: "/sprint-yonetimi",
    eyebrow: "Planlama",
    title: "Sprint'ler",
    subtitle: "Aktif plan, kapasite ve sprint döngülerini netleştir",
    tag: "Sprint",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M5 4.5V7.5" />
        <path d="M15 4.5V7.5" />
        <rect x="3.5" y="6" width="13" height="10.5" rx="2" />
        <path d="M3.5 9.5H16.5" />
      </svg>
    )
  },
  {
    to: "/gorevler/liste",
    eyebrow: "Analiz",
    title: "Sorgular",
    subtitle: "Filtreli listeler ve hızlı sorgularla odaklan",
    tag: "Filtre",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M4.5 5.5H15.5" />
        <path d="M6.5 10H13.5" />
        <path d="M8 14.5H12" />
      </svg>
    )
  },
  {
    to: "/ayarlar",
    eyebrow: "Yönetim",
    title: "Site Ayarları",
    subtitle: "Sistem ayarları, planlar ve roller için merkez alan",
    tag: "Ayar",
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M10 4.1L11 2.8L12.7 3.3L13.1 5C13.5 5.2 13.9 5.4 14.2 5.7L15.9 5.2L17 6.5L16.1 8C16.2 8.4 16.3 8.8 16.3 9.2C16.3 9.6 16.2 10 16.1 10.4L17 11.9L15.9 13.2L14.2 12.7C13.9 13 13.5 13.2 13.1 13.4L12.7 15.1L11 15.6L10 14.3C9.6 14.3 9.2 14.3 8.8 14.3L7.8 15.6L6.1 15.1L5.7 13.4C5.3 13.2 4.9 13 4.6 12.7L2.9 13.2L1.8 11.9L2.7 10.4C2.6 10 2.5 9.6 2.5 9.2C2.5 8.8 2.6 8.4 2.7 8L1.8 6.5L2.9 5.2L4.6 5.7C4.9 5.4 5.3 5.2 5.7 5L6.1 3.3L7.8 2.8L8.8 4.1C9.2 4 9.6 4 10 4.1Z" />
        <circle cx="9.4" cy="9.2" r="2.2" />
      </svg>
    )
  }
];

const emptyCreateForm = {
  baslik: "",
  aciklama: "",
  terminTarihi: nextDate(3),
  oncelik: "Orta",
  isTipi: "Backlog"
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const helpers = useTaskHelpers();
  const [notice, setNotice] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const detailTask = state.tasks.find((task) => task.id === detailTaskId) ?? null;
  const routeMeta = getRouteMeta(location.pathname);

  function openTaskDetail(taskId) {
    dispatch({ type: "selectTask", id: taskId });
    setDetailTaskId(taskId);
    setShowDetailModal(true);
  }

  function closeMenus() {
    setShowUserMenu(false);
  }

  return (
    <div className="page">
      <aside className="sidebar-shell">
        <div className="azdo-nav-panel">
          <NavLink className="azdo-project-card" to="/">
            <div className="azdo-project-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M3.8 8.5L10 3.6L16.2 8.5" />
                <path d="M5.4 7.9V15.5H14.6V7.9" />
                <path d="M8.4 15.5V11.2H11.6V15.5" />
              </svg>
            </div>
            <div>
              <div className="azdo-project-label">Platform</div>
              <div className="azdo-project-title">Görev Takip</div>
              <div className="azdo-project-subtitle">Planlama, izleme ve süreç yönetimi merkezi</div>
            </div>
          </NavLink>

          <div className="azdo-nav-group">
            <div className="azdo-nav-group-title">Çalışma Alanı</div>
            {navItems.map((item) => (
              <NavLink key={item.to} className={({ isActive }) => `azdo-nav-entry${isActive ? " active" : ""}`} to={item.to}>
                <span className="azdo-nav-entry-icon" aria-hidden="true">{item.icon}</span>
                <div className="azdo-nav-entry-copy">
                  <span className="azdo-nav-entry-eyebrow">{item.eyebrow}</span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                  <span className="azdo-nav-entry-tag">{item.tag}</span>
                </div>
                <span className="azdo-nav-entry-arrow">›</span>
              </NavLink>
            ))}
          </div>

          <div className="azdo-nav-footer">
            <div className="team-card azdo-team-card">
              <div className="azdo-team-presence">
                <div className="team-avatar azdo-team-avatar">MY</div>
                <span className="azdo-team-status-dot" />
              </div>
              <div className="azdo-team-copy">
                <span className="azdo-team-label">Proje sorumlusu</span>
                <strong>Mert Y.</strong>
                <small>Sprint akışı ve teslim koordinasyonu</small>
              </div>
              <span className="azdo-team-chip">Aktif</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="top-row">
          <div className="top-row-heading">
            <div className="top-row-breadcrumbs">
              <NavLink className="breadcrumb-link" to={routeMeta.parentHref}>
                {routeMeta.parent}
              </NavLink>
              <span className="breadcrumb-separator">/</span>
              <NavLink className="breadcrumb-link breadcrumb-link-current" to={location.pathname}>
                {routeMeta.title}
              </NavLink>
            </div>

            <div className="top-row-title-block">
              <span className="top-row-kicker">{routeMeta.section}</span>
              <div className="top-row-title-line">
                <div className="top-row-title-icon" aria-hidden="true">
                  {routeMeta.icon}
                </div>
                <div>
                  <strong>{routeMeta.title}</strong>
                  <small>{routeMeta.subtitle}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="top-row-meta">
            <button className="top-icon-button top-icon-button-labeled" onClick={() => { closeMenus(); setShowNotificationModal(true); }} title="Bildirim ayarları">
              <span className="toolbar-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 3.5C7.7 3.5 6 5.3 6 7.5V9.4C6 10.1 5.7 10.8 5.2 11.3L4.3 12.2C3.8 12.7 4.2 13.5 4.9 13.5H15.1C15.8 13.5 16.2 12.7 15.7 12.2L14.8 11.3C14.3 10.8 14 10.1 14 9.4V7.5C14 5.3 12.3 3.5 10 3.5Z" />
                  <path d="M8.4 15.2C8.8 16 9.3 16.4 10 16.4C10.7 16.4 11.2 16 11.6 15.2" />
                </svg>
              </span>
              <span className="top-icon-copy">
                <strong>Bildirimler</strong>
                <small>Ayarlar</small>
              </span>
            </button>
            <button className="top-icon-button top-icon-button-labeled" onClick={() => { closeMenus(); navigate("/ayarlar?sekme=site"); setNotice("Ayarlar merkezi açıldı."); }} title="Site ayarları">
              <span className="toolbar-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 4.1L11 2.8L12.7 3.3L13.1 5C13.5 5.2 13.9 5.4 14.2 5.7L15.9 5.2L17 6.5L16.1 8C16.2 8.4 16.3 8.8 16.3 9.2C16.3 9.6 16.2 10 16.1 10.4L17 11.9L15.9 13.2L14.2 12.7C13.9 13 13.5 13.2 13.1 13.4L12.7 15.1L11 15.6L10 14.3C9.6 14.3 9.2 14.3 8.8 14.3L7.8 15.6L6.1 15.1L5.7 13.4C5.3 13.2 4.9 13 4.6 12.7L2.9 13.2L1.8 11.9L2.7 10.4C2.6 10 2.5 9.6 2.5 9.2C2.5 8.8 2.6 8.4 2.7 8L1.8 6.5L2.9 5.2L4.6 5.7C4.9 5.4 5.3 5.2 5.7 5L6.1 3.3L7.8 2.8L8.8 4.1C9.2 4 9.6 4 10 4.1Z" />
                  <circle cx="9.4" cy="9.2" r="2.2" />
                </svg>
              </span>
              <span className="top-icon-copy">
                <strong>Ayarlar</strong>
                <small>Site</small>
              </span>
            </button>
            <span className="status-pill">{helpers.activeSprint?.ad ?? "Backlog"}</span>
            <div className="user-menu-shell">
              <button className="top-row-user user-menu-trigger" onClick={() => setShowUserMenu((value) => !value)}>
                <span className="top-row-avatar">MY</span>
              </button>

              {showUserMenu ? (
                <div className="user-menu-popover">
                  <div className="user-menu-profile">
                    <div className="user-menu-profile-avatar">MY</div>
                    <div>
                      <strong>Razi Mert Yigit</strong>
                      <small>SBNET\razimert.yigit</small>
                    </div>
                  </div>

                  <div className="user-menu-list">
                    <button className="user-menu-item" onClick={() => { closeMenus(); setShowProfileModal(true); }}>
                      Profilim
                    </button>
                    <button className="user-menu-item" onClick={() => { closeMenus(); setShowNotificationModal(true); }}>
                      Bildirim ayarları
                    </button>
                    <button className="user-menu-item" onClick={() => { closeMenus(); navigate("/ayarlar?sekme=site"); setNotice("Ayarlar merkezi açıldı."); }}>
                      Özellikleri yönet
                    </button>
                    <button className="user-menu-item" onClick={() => { closeMenus(); navigate("/ayarlar?sekme=site"); setNotice("Yardım merkezi giriş noktası ayarlar bölümüne bağlandı."); }}>
                      Yardım
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {notice ? <div className="top-row-notice">{notice}</div> : null}

        <article className="workspace-content">
          <Routes>
            <Route path="/" element={<HomePage setNotice={setNotice} />} />
            <Route path="/gorevler" element={<TasksOverviewPage onCreate={() => setShowCreateModal(true)} />} />
            <Route path="/gorevler/pano" element={<TaskBoardPage onCreate={() => setShowCreateModal(true)} onOpenDetail={openTaskDetail} />} />
            <Route path="/gorevler/liste" element={<TaskListPage onCreate={() => setShowCreateModal(true)} onOpenDetail={openTaskDetail} />} />
            <Route path="/sprint-yonetimi" element={<SprintPage setNotice={setNotice} />} />
            <Route path="/ayarlar" element={<SettingsPage setNotice={setNotice} />} />
          </Routes>
        </article>
      </main>

      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaved={(message) => setNotice(message)}
      />
      <TaskDetailModal
        open={showDetailModal}
        task={detailTask}
        onClose={() => setShowDetailModal(false)}
        onOpenList={() => {
          setShowDetailModal(false);
          navigate("/gorevler/liste");
        }}
        onNotify={setNotice}
      />
      <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} onNotify={setNotice} />
      <NotificationModal open={showNotificationModal} onClose={() => setShowNotificationModal(false)} onNotify={setNotice} />
    </div>
  );
}

function HomePage({ setNotice }) {
  const { state } = useAppState();
  const { tamamlananSayisi, isTipiOzetleri } = useTaskHelpers();
  const [bannerMesaji, setBannerMesaji] = useState(
    "Takvim görünümü Boards menüsü altına taşındı. Sprint, pano ve iş öğeleri alanları güncel yapıda kullanılabilir."
  );

  return (
    <div className="azdo-home-shell">
      <section className="azdo-home-banner">
        <span className="azdo-home-banner-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 8.1V12.1" />
            <circle cx="10" cy="5.9" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span>{bannerMesaji}</span>
      </section>

      <section className="azdo-home-header">
        <div className="azdo-home-project-mark" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="3.5" y="4" width="5.5" height="5.5" rx="1.2" />
            <rect x="11" y="4" width="5.5" height="3.5" rx="1.2" />
            <rect x="11" y="9.5" width="5.5" height="6.5" rx="1.2" />
            <rect x="3.5" y="11.5" width="5.5" height="4.5" rx="1.2" />
          </svg>
        </div>
        <div>
          <h1>GörevTakip</h1>
          <p>Ürün geliştirme, sprint takibi ve iş öğesi yönetimi için merkezi çalışma alanı.</p>
        </div>
      </section>

      <section className="azdo-home-grid">
        <article className="overview-card azdo-overview-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Bu proje hakkında</span>
              <h2>Kurumsal iş takibi için tek merkez</h2>
            </div>
            <NavLink className="ghost-action" to="/gorevler">
              İş öğelerine git
            </NavLink>
          </div>

          <div className="summary-list azdo-summary-list">
            <div>
              <strong>İş Öğeleri</strong>
              <p>Backlog, bug, ana madde ve ek madde kayıtları tek yapıda yönetilir.</p>
            </div>
            <div>
              <strong>Panolar</strong>
              <p>Sürükle bırak akışı ile analizden tamamlanana kadar tüm durumlar görünür.</p>
            </div>
            <div>
              <strong>Sprint Yönetimi</strong>
              <p>Yeni sprint açma, aktif sprinti kapatma ve geçmiş sprintleri izleme hazırdır.</p>
            </div>
          </div>
        </article>

        <div className="azdo-side-stack">
          <article className="overview-card azdo-stats-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Proje istatistikleri</span>
                <h2>Son 7 gün</h2>
              </div>
              <button
                className="ghost-action"
                onClick={() => {
                  const message = "İstatistik dönemi seçici hazır. Ayrıntılı rapor filtreleri bir sonraki adımda bağlanabilir.";
                  setBannerMesaji(message);
                  setNotice(message);
                }}
              >
                Dönem: Son 7 gün
              </button>
            </div>

            <div className="azdo-stat-grid">
              <div className="azdo-stat-item">
                <span>Oluşturulan iş öğeleri</span>
                <strong>{state.tasks.length}</strong>
              </div>
              <div className="azdo-stat-item">
                <span>Tamamlanan iş öğeleri</span>
                <strong>{tamamlananSayisi}</strong>
              </div>
            </div>
          </article>

          <article className="overview-card azdo-members-card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Üyeler</span>
                <h2>Proje ekibi</h2>
              </div>
              <span className="inline-chip">27 kişi</span>
            </div>

            <div className="azdo-member-row">
              {["MY", "GE", "EK", "EY", "SY", "NÇ"].map((member, index) => (
                <span key={member} className={`azdo-member-avatar${index ? ` ${["alt-red", "alt-orange", "alt-green", "alt-blue", "alt-purple"][index - 1]}` : ""}`}>
                  {member}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="board-card">
        <div className="board-header">
          <div>
            <span className="section-kicker">İş türleri</span>
            <h2>Madde dağılımı</h2>
          </div>
        </div>
        <div className="issue-type-grid">
          {isTipiOzetleri.map((tip) => (
            <article className="issue-type-card" key={tip.tip}>
              <div className="issue-type-card-top">
                <span className={`issue-badge ${isTipiSinifi(tip.tip)}`}>{tip.tip}</span>
                <strong>{tip.adet}</strong>
              </div>
              <p>{tip.aciklama}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TasksOverviewPage({ onCreate }) {
  const helpers = useTaskHelpers();
  const task = helpers.selectedTask;

  return (
    <div className="tasks-shell">
      <section className="tasks-hero">
        <div>
          <div className="hero-badge">Görev Özeti</div>
          <h1>Görevler</h1>
          <p>Bu ekran görev operasyonunun merkezi özeti. Buradan pano görünümüne, liste görünümüne ve yeni madde oluşturma akışına geçebilirsiniz.</p>
        </div>

        <div className="hero-actions">
          <button className="ghost-action" onClick={onCreate}>
            Yeni madde aç
          </button>
          <NavLink className="primary-action" to="/gorevler/liste">
            Liste görünümüne git
          </NavLink>
        </div>
      </section>

      <section className="stats-grid">
        <MetricCard title="Toplam kayıt" value={helpers.selectedTask ? helpers.tamamlananSayisi + helpers.devamEdenSayisi : 0} detail="Tüm aktif ve tamamlanan iş kalemleri" />
        <MetricCard title="Tamamlanan" value={helpers.tamamlananSayisi} detail={`${helpers.tamamlanmaOrani}% kapanış oranı`} accent="accent-blue" />
        <MetricCard title="Devam eden" value={helpers.devamEdenSayisi} detail="Üzerinde çalışılan görevler" accent="accent-amber" />
        <MetricCard title="Yüksek öncelik" value={helpers.yuksekOncelikSayisi} detail="Yakın takip gerektiren işler" accent="accent-red" />
      </section>

      <section className="panel-grid">
        <article className="summary-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Seçili kayıt</span>
              <h2>Görev özeti</h2>
            </div>
          </div>
          {task ? <SelectedTaskCard task={task} /> : <div className="selected-task-empty">Henüz seçili görev yok.</div>}
        </article>

        <article className="board-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Çalışma akışı</span>
              <h2>Nereden devam edelim?</h2>
            </div>
          </div>

          <div className="summary-list">
            <div>
              <strong>Pano görünümü</strong>
              <small>Kart bazlı süreç takibi için soldaki alt menüden açılır.</small>
            </div>
            <div>
              <strong>Liste görünümü</strong>
              <small>Tablo bazlı ayrıntılı yönetim için soldaki alt menüden açılır.</small>
            </div>
            <div>
              <strong>Yeni madde aç</strong>
              <small>Üstteki buton üzerinden pop-up ile yeni kayıt oluşturulur.</small>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function TaskListPage({ onCreate, onOpenDetail }) {
  return <TaskWorkspace mode="liste" onCreate={onCreate} onOpenDetail={onOpenDetail} />;
}

function TaskBoardPage({ onCreate, onOpenDetail }) {
  return <TaskWorkspace mode="pano" onCreate={onCreate} onOpenDetail={onOpenDetail} />;
}

function TaskWorkspace({ mode, onCreate, onOpenDetail }) {
  const { state, dispatch, panoSutunlari } = useAppState();
  const helpers = useTaskHelpers();
  const [aktifFiltre, setAktifFiltre] = useState("Tümü");
  const [aramaMetni, setAramaMetni] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [dragTaskId, setDragTaskId] = useState(null);

  const filteredTasks = useMemo(() => filterTasks(state.tasks, aktifFiltre, aramaMetni), [state.tasks, aktifFiltre, aramaMetni]);

  function startEdit(task) {
    dispatch({ type: "selectTask", id: task.id });
    setDuzenlenenId(task.id);
    setEditing({
      baslik: task.baslik,
      aciklama: task.aciklama,
      terminTarihi: task.terminTarihi,
      oncelik: task.oncelik,
      durum: task.durum,
      isTipi: task.isTipi
    });
  }

  function saveEdit() {
    if (!duzenlenenId || !editing?.baslik.trim()) {
      return;
    }
    dispatch({ type: "updateTask", id: duzenlenenId, payload: editing });
    cancelEdit();
  }

  function cancelEdit() {
    setDuzenlenenId(null);
    setEditing(null);
  }

  const title = mode === "pano" ? "İş Akışı Panosu" : "Görev Kayıt Listesi";
  const badge = mode === "pano" ? "Pano Görünümü" : "Liste Görünümü";
  const description =
    mode === "pano"
      ? "Kart bazlı süreç yönetimi. Görevleri sütunlar arasında ilerletin, seçin, düzenleyin ve kapatın."
      : "Tablo bazlı ayrıntılı görev yönetimi. Her satır üzerinde durum, tür, öncelik ve düzenleme işlemleri yapılır.";

  return (
    <div className="tasks-shell">
      <section className="tasks-hero">
        <div>
          <div className="hero-badge">{badge}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="hero-actions">
          <button className="ghost-action" onClick={() => { setAktifFiltre("Tümü"); setAramaMetni(""); }}>
            Filtreleri sıfırla
          </button>
          <button className="primary-action" onClick={onCreate}>
            Yeni madde aç
          </button>
        </div>
      </section>

      <section className="board-card">
        <div className="board-header">
          <div>
            <span className="section-kicker">{mode === "pano" ? "Kanban alanı" : "Kayıt görünümü"}</span>
            <h2>{mode === "pano" ? "Sütun bazlı yönetim" : "Görev tablosu"}</h2>
          </div>
          <div className="board-tools">
            <div className="filter-group">
              {["Tümü", "Açıklar", "Tamamlanan"].map((filtre) => (
                <button key={filtre} className={`filter-chip${aktifFiltre === filtre ? " active" : ""}`} onClick={() => setAktifFiltre(filtre)}>
                  {filtre === "Açıklar" ? "Açık işler" : filtre}
                </button>
              ))}
            </div>
            <input className="search-box" placeholder={mode === "pano" ? "Kart ara..." : "Kayıt ara..."} value={aramaMetni} onChange={(event) => setAramaMetni(event.target.value)} />
          </div>
        </div>

        {mode === "pano" ? (
          <div className="kanban-grid">
            {panoSutunlari.map((sutun) => {
              const sutunGorevleri = filteredTasks.filter((task) => task.durum === sutun.durum);
              return (
                <article
                  className="kanban-column"
                  key={sutun.durum}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (dragTaskId) {
                      dispatch({ type: "moveTaskToStatus", id: dragTaskId, durum: sutun.durum });
                      setDragTaskId(null);
                    }
                  }}
                >
                  <div className="kanban-column-header">
                    <div>
                      <span className="kanban-title">{sutun.baslik}</span>
                      <small>{sutun.aciklama}</small>
                    </div>
                    <span className="kanban-count">{sutunGorevleri.length}</span>
                  </div>

                  <div className="kanban-stack">
                    {sutunGorevleri.map((task) => (
                      <div
                        key={task.id}
                        className={`kanban-task${helpers.selectedTask?.id === task.id ? " selected" : ""}`}
                        draggable
                        onDragStart={() => setDragTaskId(task.id)}
                        onClick={() => dispatch({ type: "selectTask", id: task.id })}
                      >
                        <div className="kanban-task-top">
                          <strong>{task.kod}</strong>
                          <span className={`issue-badge ${isTipiSinifi(task.isTipi)}`}>{task.isTipi}</span>
                        </div>
                        <button className="kanban-title-button" onClick={(event) => { event.stopPropagation(); onOpenDetail(task.id); }}>
                          {task.baslik}
                        </button>
                        <p>{task.aciklama}</p>
                        <div className="kanban-meta">
                          <span>{task.durum}</span>
                          <span>{formatDate(task.terminTarihi)}</span>
                        </div>
                        <div className="kanban-detail-row">
                          <span className={`priority-badge ${oncelikSinifi(task.oncelik)}`}>{task.oncelik}</span>
                          <span className="kanban-mini-note">Başlığa tıklayarak detay penceresini açın.</span>
                        </div>
                      </div>
                    ))}
                    {!sutunGorevleri.length ? <div className="kanban-empty">Bu sütunda gösterilecek görev yok.</div> : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="table-shell">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Durum</th>
                  <th>İş kalemi</th>
                  <th>Tür</th>
                  <th>Öncelik</th>
                  <th>Termin</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const duzenlemede = duzenlenenId === task.id;
                  return (
                    <tr key={task.id} className={duzenlemede ? "row-editing" : helpers.selectedTask?.id === task.id ? "row-selected" : ""} onClick={() => dispatch({ type: "selectTask", id: task.id })}>
                      <td>
                        {duzenlemede ? (
                          <select value={editing.durum} onChange={(event) => setEditing({ ...editing, durum: event.target.value })}>
                            {["Analiz", "Analiz tamamlandı", "Geliştirme", "Teste hazır", "Test", "Tamamlandı"].map((durum) => (
                              <option key={durum} value={durum}>
                                {durum}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button className={`state-toggle ${durumSinifi(task.durum)}`} onClick={(event) => { event.stopPropagation(); dispatch({ type: "cycleTaskStatus", id: task.id }); }}>
                            {task.durum}
                          </button>
                        )}
                      </td>
                      <td>
                        {duzenlemede ? (
                          <div className="inline-edit-grid">
                            <input value={editing.baslik} onChange={(event) => setEditing({ ...editing, baslik: event.target.value })} />
                            <textarea rows="3" value={editing.aciklama} onChange={(event) => setEditing({ ...editing, aciklama: event.target.value })} />
                          </div>
                        ) : (
                          <div className="task-cell">
                            <div className="task-symbol">{task.kod}</div>
                            <div>
                              <button className={`task-title-button${task.durum === "Tamamlandı" ? " muted-text" : ""}`} onClick={(event) => { event.stopPropagation(); onOpenDetail(task.id); }}>
                                {task.baslik}
                              </button>
                              <small>{task.aciklama}</small>
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        {duzenlemede ? (
                          <select value={editing.isTipi} onChange={(event) => setEditing({ ...editing, isTipi: event.target.value })}>
                            {["Bug", "Backlog", "Ana madde", "Ek madde"].map((tip) => (
                              <option key={tip} value={tip}>
                                {tip}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`issue-badge ${isTipiSinifi(task.isTipi)}`}>{task.isTipi}</span>
                        )}
                      </td>
                      <td>
                        {duzenlemede ? (
                          <select value={editing.oncelik} onChange={(event) => setEditing({ ...editing, oncelik: event.target.value })}>
                            {["Düşük", "Orta", "Yüksek"].map((oncelik) => (
                              <option key={oncelik} value={oncelik}>
                                {oncelik}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`priority-badge ${oncelikSinifi(task.oncelik)}`}>{task.oncelik}</span>
                        )}
                      </td>
                      <td>
                        {duzenlemede ? (
                          <input type="date" value={editing.terminTarihi} onChange={(event) => setEditing({ ...editing, terminTarihi: event.target.value })} />
                        ) : (
                          <div className="date-stack">
                            <strong>{formatDate(task.terminTarihi)}</strong>
                            <small>{formatDay(task.terminTarihi)}</small>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          {duzenlemede ? (
                            <>
                              <button className="action-btn primary-inline" onClick={(event) => { event.stopPropagation(); saveEdit(); }}>
                                Kaydet
                              </button>
                              <button className="action-btn" onClick={(event) => { event.stopPropagation(); cancelEdit(); }}>
                                İptal
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="action-btn" onClick={(event) => { event.stopPropagation(); dispatch({ type: "moveTaskBackward", id: task.id }); }}>
                                Geri al
                              </button>
                              <button className="action-btn success" onClick={(event) => { event.stopPropagation(); dispatch({ type: "moveTaskForward", id: task.id }); }}>
                                {ileriButonEtiketi(task.durum)}
                              </button>
                              <button className="action-btn" onClick={(event) => { event.stopPropagation(); startEdit(task); }}>
                                Düzenle
                              </button>
                              <button className="action-btn danger" onClick={(event) => { event.stopPropagation(); dispatch({ type: "deleteTask", id: task.id }); }}>
                                Sil
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel-grid">
        <article className="summary-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{mode === "pano" ? "Pano metrikleri" : "Tablo metrikleri"}</span>
              <h2>{mode === "pano" ? "Akış özeti" : "Liste özeti"}</h2>
            </div>
          </div>
          <div className="summary-list">
            <div>
              <strong>{mode === "pano" ? helpers.devamEdenSayisi : filteredTasks.length}</strong>
              <small>{mode === "pano" ? "Aktif işlenen kart" : "Filtre sonrası satır"}</small>
            </div>
            <div>
              <strong>{helpers.tamamlananSayisi}</strong>
              <small>{mode === "pano" ? "Kapanmış kart" : "Toplam tamamlanan"}</small>
            </div>
            <div>
              <strong>{helpers.enYakinTeslim}</strong>
              <small>En yakın teslim</small>
            </div>
          </div>
        </article>

        <article className="summary-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{mode === "pano" ? "Çalışma rehberi" : "Satır detayı"}</span>
              <h2>{mode === "pano" ? "Detay akışı" : "Seçili kayıt"}</h2>
            </div>
          </div>
          {mode === "pano" ? (
            <div className="summary-list">
              <div>
                <strong>Başlığa tıkla</strong>
                <small>Her kartın başlığı profesyonel detay penceresini açar.</small>
              </div>
              <div>
                <strong>Sürükle bırak kullan</strong>
                <small>Kartı süreç sütunları arasında taşıyarak durum güncelle.</small>
              </div>
              <div>
                <strong>Detayda yönet</strong>
                <small>Kaydet, yorum, takip, akış ve bağlantı işlemleri pop-up içinden yürür.</small>
              </div>
            </div>
          ) : helpers.selectedTask ? (
            <SelectedTaskCard task={helpers.selectedTask} />
          ) : (
            <div className="selected-task-empty">Detay görmek için listeden bir satır seçin.</div>
          )}
        </article>
      </section>
    </div>
  );
}

function SprintPage({ setNotice }) {
  const { state, dispatch } = useAppState();
  const helpers = useTaskHelpers();
  const activeSprint =
    helpers.activeSprint ?? {
      ad: "Backlog",
      baslangicTarihi: nextDate(0),
      bitisTarihi: nextDate(0),
      hedef: "Aktif sprint bulunamadı.",
      kapasite: 0
    };
  const sprintGorevleri = state.tasks.filter((task) => task.iterasyon === activeSprint.ad);
  const tamamlananlar = sprintGorevleri.filter((task) => task.durum === "Tamamlandı");
  const riskliTeslimler = sprintGorevleri.filter((task) => task.durum !== "Tamamlandı" && task.terminTarihi <= nextDate(0));
  const kritikKayitlar = sprintGorevleri.filter((task) => task.oncelik === "Yüksek" && task.durum !== "Tamamlandı").sort((a, b) => a.terminTarihi.localeCompare(b.terminTarihi));
  const gecmisSprintler = state.sprints.filter((sprint) => sprint.durum === "Tamamlandı");
  const planlananSprintler = state.sprints.filter((sprint) => sprint.durum === "Planlandı");
  const [showNewSprint, setShowNewSprint] = useState(false);
  const [showCloseSprint, setShowCloseSprint] = useState(false);
  const [newSprintForm, setNewSprintForm] = useState({
    ad: "Sprint 14",
    baslangicTarihi: nextDate(14),
    bitisTarihi: nextDate(28),
    hedef: "Yeni sprint içinde planlı geliştirme ve test yükünü dengeli başlat.",
    kapasite: 26
  });
  const [closeForm, setCloseForm] = useState({
    kapanisNotu: "Sprint hedefleri tamamlandı, açık işlerin kalan kısmı sonraki döneme taşınacak.",
    sonrakiSprintAdi: "Sprint 14",
    sonrakiSprintBaslangic: nextDate(14),
    sonrakiSprintBitis: nextDate(28),
    sonrakiSprintHedefi: "Açık işlerin devamını kontrollü şekilde teslim etmek ve yeni kritik maddeleri almak.",
    sonrakiSprintKapasite: 26,
    aciklariTasi: true
  });

  const sprintTamamlanmaOrani = sprintGorevleri.length ? Math.round((tamamlananlar.length * 100) / sprintGorevleri.length) : 0;
  const analizBekleyenSayisi = sprintGorevleri.filter((task) => ["Analiz", "Analiz tamamlandı"].includes(task.durum)).length;
  const testKuyruguSayisi = sprintGorevleri.filter((task) => ["Teste hazır", "Test"].includes(task.durum)).length;
  const toplamEfor = sprintGorevleri.reduce((sum, task) => sum + task.efor, 0);
  const kalanKapasite = Math.max(0, activeSprint.kapasite - toplamEfor);
  const sprintMesaji = sprintTamamlanmaOrani >= 80 ? "Sprint planı rayında ilerliyor" : sprintTamamlanmaOrani >= 50 ? "Sprintte kontrollü ilerleme var" : "Sprintte yakın takip gerekli";

  return (
    <div className="overview-shell">
      <section className="tasks-hero sprint-hero sprint-hero-strong">
        <div>
          <div className="hero-badge">Sprint Yönetimi</div>
          <h1>{activeSprint.ad} için kontrol paneli</h1>
          <p>Sprint açılışını, kapanışını, geçmiş performansı ve sonraki sprint planını tek yönetim alanında yönetin.</p>
        </div>
        <div className="hero-actions">
          <button className="ghost-action" onClick={() => setShowNewSprint(true)}>
            Yeni sprint oluştur
          </button>
          <button className="primary-action" onClick={() => setShowCloseSprint(true)}>
            Sprinti kapat
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <MetricCard title="Aktif sprint" value={activeSprint.ad} detail={`${formatDate(activeSprint.baslangicTarihi)} - ${formatDate(activeSprint.bitisTarihi)}`} />
        <MetricCard title="Tamamlanma" value={`${sprintTamamlanmaOrani}%`} detail={`${tamamlananlar.length} kayıt kapatıldı`} accent="accent-blue" />
        <MetricCard title="Kalan kapasite" value={kalanKapasite} detail={`${activeSprint.kapasite} puan planı içinde kullanılabilir alan`} accent="accent-amber" />
        <MetricCard title="Riskli teslim" value={riskliTeslimler.length} detail="Bugün veya geçmiş terminli açık iş" accent="accent-red" />
      </section>

      <section className="panel-grid">
        <article className="board-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Sprint sağlığı</span>
              <h2>Yürüyen sprint özeti</h2>
            </div>
            <span className="inline-chip">{sprintMesaji}</span>
          </div>
          <div className="sprint-progress-shell">
            <div className="sprint-progress-track">
              <div className="sprint-progress-value" style={{ width: `${sprintTamamlanmaOrani}%` }} />
            </div>
            <div className="sprint-progress-meta">
              <strong>{sprintTamamlanmaOrani}%</strong>
              <small>Kapanan iş oranı</small>
            </div>
          </div>
          <div className="summary-list">
            <div>
              <strong>{analizBekleyenSayisi}</strong>
              <small>Analiz tarafında bekleyen madde</small>
            </div>
            <div>
              <strong>{testKuyruguSayisi}</strong>
              <small>Teste hazır veya test aşamasındaki kayıt</small>
            </div>
            <div>
              <strong>{toplamEfor}</strong>
              <small>Sprint içindeki toplam efor</small>
            </div>
          </div>
        </article>

        <article className="summary-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Sprint hedefi</span>
              <h2>Yönetici odağı</h2>
            </div>
          </div>
          <div className="selected-task-card selected-task-card-standalone">
            <h3>{activeSprint.hedef}</h3>
            <p>
              {riskliTeslimler.length
                ? `${riskliTeslimler.length} kayıt bugün veya geçmiş terminli durumda. Sprint kapatmadan önce bu maddelerin akışını netleştirmek faydalı olur.`
                : "Bugün için kritik teslim baskısı görünmüyor. Planlanan sprint açılışı ve kapasite hazırlığına odaklanabilirsiniz."}
            </p>
            <div className="selected-task-meta">
              <span>{activeSprint.kapasite} puan kapasite</span>
              <span>{helpers.enYakinTeslim}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="overview-grid sprint-grid-3">
        <article className="board-card">
          <div className="board-header">
            <div>
              <span className="section-kicker">Durum dağılımı</span>
              <h2>Akış yoğunluğu</h2>
            </div>
          </div>
          <div className="sprint-status-list">
            {["Analiz", "Analiz tamamlandı", "Geliştirme", "Teste hazır", "Test", "Tamamlandı"].map((durum) => {
              const adet = sprintGorevleri.filter((task) => task.durum === durum).length;
              const yuzde = sprintGorevleri.length ? Math.round((adet * 100) / sprintGorevleri.length) : 0;
              return (
                <div className="sprint-status-row" key={durum}>
                  <div className="sprint-status-head">
                    <span className={`state-toggle ${durumSinifi(durum)}`}>{durum}</span>
                    <strong>{adet}</strong>
                  </div>
                  <div className="sprint-mini-progress">
                    <div className="sprint-mini-progress-bar" style={{ width: `${yuzde}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="board-card">
          <div className="board-header">
            <div>
              <span className="section-kicker">Takım yükü</span>
              <h2>Sorumlu dağılımı</h2>
            </div>
          </div>
          <div className="sprint-load-list">
            {Object.values(
              sprintGorevleri.reduce((acc, task) => {
                acc[task.atananKisi] ??= { atananKisi: task.atananKisi, gorevSayisi: 0, toplamEfor: 0 };
                acc[task.atananKisi].gorevSayisi += 1;
                acc[task.atananKisi].toplamEfor += task.efor;
                return acc;
              }, {})
            ).map((kisi) => (
              <div className="sprint-load-card" key={kisi.atananKisi}>
                <div className="sprint-load-head">
                  <strong>{kisi.atananKisi}</strong>
                  <span>{kisi.gorevSayisi} görev</span>
                </div>
                <small>{kisi.toplamEfor} puan planlı efor</small>
              </div>
            ))}
          </div>
        </article>

        <article className="board-card">
          <div className="board-header">
            <div>
              <span className="section-kicker">Kritik kayıtlar</span>
              <h2>Öncelik takibi</h2>
            </div>
          </div>
          <div className="sprint-critical-list">
            {!kritikKayitlar.length ? (
              <div className="detail-empty-box">Yüksek öncelikli açık kayıt bulunmuyor.</div>
            ) : (
              kritikKayitlar.map((task) => (
                <NavLink className="sprint-critical-card" key={task.id} to="/gorevler/pano">
                  <div className="sprint-critical-top">
                    <strong>{task.kod}</strong>
                    <span className={`priority-badge ${oncelikSinifi(task.oncelik)}`}>{task.oncelik}</span>
                  </div>
                  <h3>{task.baslik}</h3>
                  <p>{task.atananKisi} • {formatDate(task.terminTarihi)}</p>
                </NavLink>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="panel-grid sprint-management-grid">
        <article className="board-card">
          <div className="board-header">
            <div>
              <span className="section-kicker">Geçmiş sprintler</span>
              <h2>Kapanan dönemler</h2>
            </div>
          </div>
          <div className="sprint-history-list">
            {gecmisSprintler.map((sprint) => (
              <div className="sprint-history-card" key={sprint.id}>
                <div className="sprint-history-head">
                  <div>
                    <strong>{sprint.ad}</strong>
                    <small>{formatDate(sprint.baslangicTarihi)} - {formatDate(sprint.bitisTarihi)}</small>
                  </div>
                  <span className={`sprint-state ${sprintDurumSinifi(sprint.durum)}`}>{sprint.durum}</span>
                </div>
                <p>{sprint.hedef}</p>
                <small>{sprint.kapanisNotu || "Kapanış notu girilmedi."}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="board-card">
          <div className="board-header">
            <div>
              <span className="section-kicker">Planlanan sprintler</span>
              <h2>Sıradaki dönemler</h2>
            </div>
          </div>
          <div className="sprint-history-list">
            {planlananSprintler.map((sprint) => (
              <div className="sprint-history-card future" key={sprint.id}>
                <div className="sprint-history-head">
                  <div>
                    <strong>{sprint.ad}</strong>
                    <small>{formatDate(sprint.baslangicTarihi)} - {formatDate(sprint.bitisTarihi)}</small>
                  </div>
                  <span className={`sprint-state ${sprintDurumSinifi(sprint.durum)}`}>{sprint.durum}</span>
                </div>
                <p>{sprint.hedef}</p>
                <div className="sprint-history-actions">
                  <button className="action-btn" onClick={() => { dispatch({ type: "activateSprint", id: sprint.id }); setNotice(`${sprint.ad} aktif sprint olarak ayarlandı.`); }}>
                    Aktif yap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="board-card">
        <div className="board-header">
          <div>
            <span className="section-kicker">Yaklaşan teslimler</span>
            <h2>Sprint iş listesi</h2>
          </div>
        </div>
        <div className="table-shell">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Kayıt</th>
                <th>Sorumlu</th>
                <th>Durum</th>
                <th>Öncelik</th>
                <th>Termin</th>
                <th>Efor</th>
              </tr>
            </thead>
            <tbody>
              {[...sprintGorevleri].sort((a, b) => a.terminTarihi.localeCompare(b.terminTarihi)).map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="task-cell">
                      <div className="task-symbol">{task.kod}</div>
                      <div>
                        <strong>{task.baslik}</strong>
                        <small>{task.alan}</small>
                      </div>
                    </div>
                  </td>
                  <td>{task.atananKisi}</td>
                  <td><span className={`state-toggle ${durumSinifi(task.durum)}`}>{task.durum}</span></td>
                  <td><span className={`priority-badge ${oncelikSinifi(task.oncelik)}`}>{task.oncelik}</span></td>
                  <td>{formatDate(task.terminTarihi)}</td>
                  <td>{task.efor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showNewSprint ? (
        <ModalShell title="Yeni sprint oluştur" kicker="Yeni Sprint" onClose={() => setShowNewSprint(false)} className="sprint-action-modal">
          <div className="form-grid modal-form-grid">
            <label>Sprint adı<input value={newSprintForm.ad} onChange={(event) => setNewSprintForm({ ...newSprintForm, ad: event.target.value })} /></label>
            <label>Kapasite<input type="number" value={newSprintForm.kapasite} onChange={(event) => setNewSprintForm({ ...newSprintForm, kapasite: Number(event.target.value) })} /></label>
            <label>Başlangıç tarihi<input type="date" value={newSprintForm.baslangicTarihi} onChange={(event) => setNewSprintForm({ ...newSprintForm, baslangicTarihi: event.target.value })} /></label>
            <label>Bitiş tarihi<input type="date" value={newSprintForm.bitisTarihi} onChange={(event) => setNewSprintForm({ ...newSprintForm, bitisTarihi: event.target.value })} /></label>
            <label>Sprint hedefi<textarea rows="4" value={newSprintForm.hedef} onChange={(event) => setNewSprintForm({ ...newSprintForm, hedef: event.target.value })} /></label>
          </div>
          <div className="modal-actions">
            <button className="ghost-action" onClick={() => setNewSprintForm({ ad: "Sprint 15", baslangicTarihi: nextDate(29), bitisTarihi: nextDate(43), hedef: "Backlog ve yeni kritik talepleri kapasite sınırı içinde dengeli başlat.", kapasite: 28 })}>
              Şablon yükle
            </button>
            <button className="primary-action" onClick={() => { dispatch({ type: "createSprint", payload: newSprintForm }); setShowNewSprint(false); setNotice(`${newSprintForm.ad} sprinti oluşturuldu.`); }}>
              Sprinti oluştur
            </button>
          </div>
        </ModalShell>
      ) : null}

      {showCloseSprint ? (
        <ModalShell title={`${activeSprint.ad} sprintini tamamla`} kicker="Sprint Kapat" onClose={() => setShowCloseSprint(false)} className="sprint-action-modal">
          <div className="form-grid modal-form-grid">
            <label>Kapanış notu<textarea rows="4" value={closeForm.kapanisNotu} onChange={(event) => setCloseForm({ ...closeForm, kapanisNotu: event.target.value })} /></label>
            <label>Sonraki sprint adı<input value={closeForm.sonrakiSprintAdi} onChange={(event) => setCloseForm({ ...closeForm, sonrakiSprintAdi: event.target.value })} /></label>
            <label>Sonraki sprint başlangıcı<input type="date" value={closeForm.sonrakiSprintBaslangic} onChange={(event) => setCloseForm({ ...closeForm, sonrakiSprintBaslangic: event.target.value })} /></label>
            <label>Sonraki sprint bitişi<input type="date" value={closeForm.sonrakiSprintBitis} onChange={(event) => setCloseForm({ ...closeForm, sonrakiSprintBitis: event.target.value })} /></label>
            <label>Sonraki sprint hedefi<textarea rows="4" value={closeForm.sonrakiSprintHedefi} onChange={(event) => setCloseForm({ ...closeForm, sonrakiSprintHedefi: event.target.value })} /></label>
            <label>Sonraki sprint kapasitesi<input type="number" value={closeForm.sonrakiSprintKapasite} onChange={(event) => setCloseForm({ ...closeForm, sonrakiSprintKapasite: Number(event.target.value) })} /></label>
          </div>
          <div className="settings-toggle-grid sprint-settings-toggle-grid">
            <button className={`settings-toggle-card${closeForm.aciklariTasi ? " active" : ""}`} onClick={() => setCloseForm({ ...closeForm, aciklariTasi: !closeForm.aciklariTasi })}>
              <strong>Açık işleri taşı</strong>
              <small>{closeForm.aciklariTasi ? "Açık işler sonraki sprintte açılır" : "Açık işler backlog üzerinde kalır"}</small>
            </button>
          </div>
          <div className="modal-actions">
            <button className="ghost-action" onClick={() => setCloseForm({ ...closeForm, kapanisNotu: "Sprint hedefleri genel olarak tamamlandı, kalan açık maddeler sıradaki sprintte devam edecek." })}>
              Önerilen kapanış planı
            </button>
            <button className="primary-action" onClick={() => { dispatch({ type: "closeActiveSprint", payload: closeForm }); setShowCloseSprint(false); setNotice(`${activeSprint.ad} kapatıldı.`); }}>
              Sprinti kapat
            </button>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

function SettingsPage({ setNotice }) {
  const { state, dispatch } = useAppState();
  const params = new URLSearchParams(window.location.search);
  const [sekme, setSekme] = useState(params.get("sekme") === "site" ? "site" : "sprint");
  const [sprintSettings, setSprintSettings] = useState(state.settings);
  const [siteSettings, setSiteSettings] = useState(state.settings);

  return (
    <div className="tasks-shell">
      <section className="tasks-hero">
        <div>
          <div className="hero-badge">Ayarlar Merkezi</div>
          <h1>Sistem ayarları</h1>
          <p>Sprint yapılandırmalarını ve site içi genel davranışları tek merkezden yönetin.</p>
        </div>
        <div className="hero-actions">
          <NavLink className="ghost-action" to="/sprint-yonetimi">Sprint paneline dön</NavLink>
          <NavLink className="primary-action" to="/gorevler">Görev özetine git</NavLink>
        </div>
      </section>

      <section className="workspace-shell settings-shell">
        <aside className="view-rail settings-rail">
          <button className={`rail-tab${sekme === "sprint" ? " active" : ""}`} onClick={() => setSekme("sprint")}>
            <span>Sp</span>
            <strong>Sprint Ayarları</strong>
            <small>Süre, hedef ve iş akışı kuralları</small>
          </button>
          <button className={`rail-tab${sekme === "site" ? " active" : ""}`} onClick={() => setSekme("site")}>
            <span>St</span>
            <strong>Site Ayarları</strong>
            <small>Arayüz, bildirim ve sistem tercihleri</small>
          </button>
        </aside>

        <div className="workspace-stage">
          {sekme === "sprint" ? (
            <div className="overview-shell">
              <section className="board-card">
                <div className="board-header">
                  <div>
                    <span className="section-kicker">Sprint Ayarları</span>
                    <h2>Aktif sprint yapılandırması</h2>
                  </div>
                  <button className="primary-action" onClick={() => { dispatch({ type: "saveSettings", payload: sprintSettings }); setNotice("Sprint ayarları kaydedildi."); }}>
                    Kaydet
                  </button>
                </div>

                <div className="form-grid modal-form-grid">
                  <label>Aktif sprint adı<input value={sprintSettings.sprintAdi} onChange={(event) => setSprintSettings({ ...sprintSettings, sprintAdi: event.target.value })} /></label>
                  <label>Sprint süresi<select value={sprintSettings.sprintSuresi} onChange={(event) => setSprintSettings({ ...sprintSettings, sprintSuresi: event.target.value })}><option>1 hafta</option><option>2 hafta</option><option>3 hafta</option><option>4 hafta</option></select></label>
                  <label>Sprint hedefi<textarea rows="4" value={sprintSettings.sprintHedefi} onChange={(event) => setSprintSettings({ ...sprintSettings, sprintHedefi: event.target.value })} /></label>
                  <label>WIP limiti<input type="number" value={sprintSettings.wipLimiti} onChange={(event) => setSprintSettings({ ...sprintSettings, wipLimiti: Number(event.target.value) })} /></label>
                  <label>Varsayılan başlangıç sütunu<select value={sprintSettings.baslangicDurumu} onChange={(event) => setSprintSettings({ ...sprintSettings, baslangicDurumu: event.target.value })}><option>Analiz</option><option>Analiz tamamlandı</option><option>Geliştirme</option><option>Teste hazır</option></select></label>
                  <label>Sprint kapanış kuralı<select value={sprintSettings.kapanisKurali} onChange={(event) => setSprintSettings({ ...sprintSettings, kapanisKurali: event.target.value })}><option>Tüm kritik işler kapanmalı</option><option>Test aşamasındakiler taşınabilir</option><option>Manuel karar ile kapat</option></select></label>
                </div>
                <div className="settings-actions">
                  <button className="ghost-action" onClick={() => setSprintSettings({ ...sprintSettings, sprintAdi: "Sprint 13", sprintSuresi: "2 hafta", sprintHedefi: "Analizden teste kadar akışı dengeleyip kritik işlerin kapanışını hızlandır.", wipLimiti: 5, baslangicDurumu: "Analiz", kapanisKurali: "Test aşamasındakiler taşınabilir" })}>
                    Önerilen şablonu yükle
                  </button>
                  <button className="action-btn" onClick={() => setSprintSettings({ ...sprintSettings, sprintAdi: "", sprintHedefi: "", wipLimiti: 3, baslangicDurumu: "Analiz", kapanisKurali: "Tüm kritik işler kapanmalı" })}>
                    Formu sıfırla
                  </button>
                </div>
              </section>
            </div>
          ) : (
            <div className="overview-shell">
              <section className="board-card">
                <div className="board-header">
                  <div>
                    <span className="section-kicker">Site Ayarları</span>
                    <h2>Genel sistem tercihleri</h2>
                  </div>
                  <button className="primary-action" onClick={() => { dispatch({ type: "saveSettings", payload: siteSettings }); setNotice("Site ayarları kaydedildi."); }}>
                    Kaydet
                  </button>
                </div>
                <div className="form-grid modal-form-grid">
                  <label>Varsayılan açılış ekranı<select value={siteSettings.varsayilanAcilisEkrani} onChange={(event) => setSiteSettings({ ...siteSettings, varsayilanAcilisEkrani: event.target.value })}><option>Genel Bakış</option><option>Görevler</option><option>Sprint Yönetimi</option></select></label>
                  <label>Bildirim yoğunluğu<select value={siteSettings.bildirimYogunlugu} onChange={(event) => setSiteSettings({ ...siteSettings, bildirimYogunlugu: event.target.value })}><option>Sade</option><option>Standart</option><option>Yoğun</option></select></label>
                  <label>Tarih biçimi<select value={siteSettings.tarihBicimi} onChange={(event) => setSiteSettings({ ...siteSettings, tarihBicimi: event.target.value })}><option>dd MMM yyyy</option><option>dd.MM.yyyy</option><option>yyyy-MM-dd</option></select></label>
                  <label>Kart yoğunluğu<select value={siteSettings.kartYogunlugu} onChange={(event) => setSiteSettings({ ...siteSettings, kartYogunlugu: event.target.value })}><option>Rahat</option><option>Standart</option><option>Kompakt</option></select></label>
                </div>
                <div className="settings-toggle-grid">
                  <button className={`settings-toggle-card${siteSettings.canliBildirimler ? " active" : ""}`} onClick={() => setSiteSettings({ ...siteSettings, canliBildirimler: !siteSettings.canliBildirimler })}>
                    <strong>Canlı bildirimler</strong>
                    <small>{siteSettings.canliBildirimler ? "Açık" : "Kapalı"}</small>
                  </button>
                  <button className={`settings-toggle-card${siteSettings.detaydaYorumAlaniAcik ? " active" : ""}`} onClick={() => setSiteSettings({ ...siteSettings, detaydaYorumAlaniAcik: !siteSettings.detaydaYorumAlaniAcik })}>
                    <strong>Detayda yorum alanı</strong>
                    <small>{siteSettings.detaydaYorumAlaniAcik ? "Varsayılan açık" : "Varsayılan kapalı"}</small>
                  </button>
                  <button className={`settings-toggle-card${siteSettings.kisaYolIpuclari ? " active" : ""}`} onClick={() => setSiteSettings({ ...siteSettings, kisaYolIpuclari: !siteSettings.kisaYolIpuclari })}>
                    <strong>Kısayol ipuçları</strong>
                    <small>{siteSettings.kisaYolIpuclari ? "Gösteriliyor" : "Gizli"}</small>
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CreateTaskModal({ open, onClose, onSaved }) {
  const { dispatch } = useAppState();
  const [form, setForm] = useState(emptyCreateForm);

  if (!open) {
    return null;
  }

  return (
    <ModalShell title="Yeni madde oluştur" kicker="Yeni kayıt" onClose={onClose}>
      <div className="form-grid modal-form-grid">
        <label>Başlık<input value={form.baslik} onChange={(event) => setForm({ ...form, baslik: event.target.value })} placeholder="Örn. API hata senaryosunu doğrula" /></label>
        <label>İş türü<select value={form.isTipi} onChange={(event) => setForm({ ...form, isTipi: event.target.value })}><option>Bug</option><option>Backlog</option><option>Ana madde</option><option>Ek madde</option></select></label>
        <label>Açıklama<textarea rows="4" value={form.aciklama} onChange={(event) => setForm({ ...form, aciklama: event.target.value })} placeholder="Kapsam, ihtiyaç ve beklenen çıktı" /></label>
        <label>Termin tarihi<input type="date" value={form.terminTarihi} onChange={(event) => setForm({ ...form, terminTarihi: event.target.value })} /></label>
        <label>Öncelik<select value={form.oncelik} onChange={(event) => setForm({ ...form, oncelik: event.target.value })}><option>Düşük</option><option>Orta</option><option>Yüksek</option></select></label>
      </div>
      <div className="modal-actions">
        <button className="ghost-action" onClick={() => setForm(emptyCreateForm)}>Temizle</button>
        <button
          className="primary-action"
          onClick={() => {
            if (!form.baslik.trim()) {
              return;
            }
            dispatch({ type: "createTask", payload: form });
            setForm(emptyCreateForm);
            onClose();
            onSaved("Yeni görev oluşturuldu ve listeye eklendi.");
          }}
        >
          Kaydı aç
        </button>
      </div>
    </ModalShell>
  );
}

function TaskDetailModal({ open, task, onClose, onOpenList, onNotify }) {
  const { dispatch } = useAppState();
  const [form, setForm] = useState(null);
  const [comment, setComment] = useState({ yazar: "Ekip Üyesi", metin: "" });

  React.useEffect(() => {
    if (task) {
      setForm({
        baslik: task.baslik,
        aciklama: task.aciklama,
        kabulKriterleri: task.kabulKriterleri,
        atananKisi: task.atananKisi,
        alan: task.alan,
        iterasyon: task.iterasyon,
        degerAlani: task.degerAlani,
        terminTarihi: task.terminTarihi,
        oncelik: task.oncelik,
        durum: task.durum,
        isTipi: task.isTipi,
        isDegeri: task.isDegeri,
        efor: task.efor
      });
      setComment({ yazar: "Ekip Üyesi", metin: "" });
    }
  }, [task]);

  if (!open || !task || !form) {
    return null;
  }

  return (
    <div className="modal-backdrop detail-modal-backdrop" onClick={onClose}>
      <div className="modal-card detail-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="detail-modal-header">
          <div>
            <div className="detail-modal-breadcrumb">
              <span className={`issue-badge ${isTipiSinifi(form.isTipi)}`}>{form.isTipi}</span>
              <span>{task.kod}</span>
            </div>
            <input className="detail-title-input" value={form.baslik} onChange={(event) => setForm({ ...form, baslik: event.target.value })} />
          </div>
          <div className="detail-toolbar">
            <button className="ghost-action" onClick={() => { dispatch({ type: "toggleTaskFollow", id: task.id }); onNotify(task.takipteMi ? `${task.kod} takip listesinden çıkarıldı.` : `${task.kod} takip listesine eklendi.`); }}>
              {task.takipteMi ? "Takibi bırak" : "Takip et"}
            </button>
            <button className="ghost-action" onClick={() => onNotify(`${task.kod} bağlantısı kopyalamaya hazır: /gorevler/${task.kod.toLowerCase()}`)}>Bağlantı kopyala</button>
            <button className="ghost-action" onClick={() => onNotify(`${task.kod} için son durum geçişi: ${task.durum}.`)}>Geçmiş</button>
            <button className="primary-action" onClick={() => { dispatch({ type: "updateTask", id: task.id, payload: form }); onClose(); onNotify(`${task.kod} detayları kaydedildi.`); }}>
              Kaydet ve kapat
            </button>
            <button className="modal-close" onClick={onClose}>Kapat</button>
          </div>
        </div>

        <div className="detail-top-grid">
          <div className="detail-top-item">
            <span>Durum</span>
            <button className={`state-toggle ${durumSinifi(form.durum)}`} onClick={() => setForm({ ...form, durum: nextStatus(form.durum) })}>{form.durum}</button>
          </div>
          <div className="detail-top-item">
            <span>Sebep</span>
            <strong>{task.sebep}</strong>
          </div>
          <div className="detail-top-item">
            <span>Alan</span>
            <input value={form.alan} onChange={(event) => setForm({ ...form, alan: event.target.value })} />
          </div>
          <div className="detail-top-item">
            <span>İterasyon</span>
            <input value={form.iterasyon} onChange={(event) => setForm({ ...form, iterasyon: event.target.value })} />
          </div>
        </div>

        <div className="detail-modal-layout">
          <section className="detail-main-column">
            <article className="detail-panel">
              <div className="detail-section-header">
                <h3>Açıklama</h3>
                <button className="action-btn" onClick={() => setForm({ ...form, aciklama: form.aciklama ? `${form.aciklama}\n\nBeklenen çıktı:` : "İş kapsamı:\nBeklenen çıktı:\nTeknik notlar:" })}>Şablon ekle</button>
              </div>
              <textarea className="detail-textarea" rows="6" value={form.aciklama} onChange={(event) => setForm({ ...form, aciklama: event.target.value })} />
            </article>

            <article className="detail-panel">
              <div className="detail-section-header">
                <h3>Kabul Kriterleri</h3>
                <button className="action-btn" onClick={() => setForm({ ...form, kabulKriterleri: form.kabulKriterleri ? `${form.kabulKriterleri}\nYeni kriter` : "Madde 1\nMadde 2\nMadde 3" })}>Madde ekle</button>
              </div>
              <textarea className="detail-textarea" rows="6" value={form.kabulKriterleri} onChange={(event) => setForm({ ...form, kabulKriterleri: event.target.value })} />
            </article>

            <article className="detail-panel">
              <div className="detail-section-header">
                <h3>Tartışma</h3>
                <span className="inline-chip">{task.yorumlar.length} yorum</span>
              </div>
              <div className="detail-comments">
                {!task.yorumlar.length ? <div className="detail-empty-box">Henüz yorum eklenmedi.</div> : task.yorumlar.map((yorum) => (
                  <div className="detail-comment" key={yorum.id}>
                    <div className="detail-comment-head">
                      <strong>{yorum.yazar}</strong>
                      <span>{formatDateTime(yorum.tarih)}</span>
                    </div>
                    <p>{yorum.metin}</p>
                  </div>
                ))}
              </div>
              <div className="detail-comment-composer">
                <input value={comment.yazar} onChange={(event) => setComment({ ...comment, yazar: event.target.value })} placeholder="Yorum sahibi" />
                <textarea rows="3" value={comment.metin} onChange={(event) => setComment({ ...comment, metin: event.target.value })} placeholder="Yorum ekleyin, bağlantı veya karar notu yazın" />
                <div className="detail-inline-actions">
                  <button className="action-btn" onClick={() => setComment({ ...comment, metin: "" })}>Temizle</button>
                  <button className="primary-action" onClick={() => { if (!comment.metin.trim()) return; dispatch({ type: "addComment", id: task.id, payload: comment }); setComment({ ...comment, metin: "" }); }}>
                    Yorum ekle
                  </button>
                </div>
              </div>
            </article>
          </section>

          <aside className="detail-side-column">
            <article className="detail-panel">
              <h3>Detaylar</h3>
              <div className="detail-field-grid">
                <label>Atanan kişi<input value={form.atananKisi} onChange={(event) => setForm({ ...form, atananKisi: event.target.value })} /></label>
                <label>Tür<select value={form.isTipi} onChange={(event) => setForm({ ...form, isTipi: event.target.value })}><option>Bug</option><option>Backlog</option><option>Ana madde</option><option>Ek madde</option></select></label>
                <label>Öncelik<select value={form.oncelik} onChange={(event) => setForm({ ...form, oncelik: event.target.value })}><option>Düşük</option><option>Orta</option><option>Yüksek</option></select></label>
                <label>Durum<select value={form.durum} onChange={(event) => setForm({ ...form, durum: event.target.value })}><option>Analiz</option><option>Analiz tamamlandı</option><option>Geliştirme</option><option>Teste hazır</option><option>Test</option><option>Tamamlandı</option></select></label>
                <label>Termin<input type="date" value={form.terminTarihi} onChange={(event) => setForm({ ...form, terminTarihi: event.target.value })} /></label>
                <label>Değer alanı<input value={form.degerAlani} onChange={(event) => setForm({ ...form, degerAlani: event.target.value })} /></label>
                <label>İş değeri<input type="number" value={form.isDegeri} onChange={(event) => setForm({ ...form, isDegeri: Number(event.target.value) })} /></label>
                <label>Efor<input type="number" value={form.efor} onChange={(event) => setForm({ ...form, efor: Number(event.target.value) })} /></label>
              </div>
            </article>
            <article className="detail-panel">
              <h3>Akış işlemleri</h3>
              <div className="detail-stack-buttons">
                <button className="action-btn" disabled={form.durum === "Analiz"} onClick={() => setForm({ ...form, durum: prevStatus(form.durum) })}>Geri al</button>
                <button className="action-btn success" onClick={() => setForm({ ...form, durum: nextStatus(form.durum) })}>{ileriButonEtiketi(form.durum)}</button>
                <button className="action-btn" onClick={onOpenList}>Liste görünümünde aç</button>
                <button className="action-btn danger" onClick={() => { dispatch({ type: "deleteTask", id: task.id }); onClose(); }}>Maddeyi sil</button>
              </div>
            </article>
            <article className="detail-panel">
              <h3>Geliştirme</h3>
              <div className="detail-info-box">İş kalemi için geliştirme bağlantısı, dal referansı veya commit notu ekleyebilirsiniz.</div>
            </article>
            <article className="detail-panel">
              <h3>İlişkili işler</h3>
              <div className="detail-info-box">Bu kayıt için üst madde, alt madde veya bağımlı iş bağlantısı oluşturabilirsiniz.</div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ open, onClose, onNotify }) {
  const { state, dispatch } = useAppState();
  const [sekme, setSekme] = useState("genel");
  const [form, setForm] = useState(state.profile);

  React.useEffect(() => setForm(state.profile), [state.profile, open]);
  if (!open) return null;

  return (
    <ModalShell title="Kullanıcı profili" onClose={onClose} simpleHeader className="profile-modal-card">
      <div className="profile-identity">
        <div className="profile-avatar">MY</div>
        <div>
          <strong>Razi Mert YİĞİT</strong>
          <small>razimert.yigit</small>
        </div>
      </div>
      <div className="profile-tabs">
        <button className={`profile-tab${sekme === "genel" ? " active" : ""}`} onClick={() => setSekme("genel")}>GENEL</button>
        <button className={`profile-tab${sekme === "yerel" ? " active" : ""}`} onClick={() => setSekme("yerel")}>YEREL AYAR</button>
      </div>
      {sekme === "genel" ? (
        <div className="profile-panel">
          <button className="profile-link-btn" onClick={() => onNotify("Profil resmi değiştirme akışı kullanıcı modülü sonrasında bağlanacak.")}>Resmi değiştir</button>
          <div className="profile-section-title">KULLANICI BİLGİLERİ</div>
          <div className="profile-form-grid">
            <label>Görünen Ad<input value={form.gorunenAd} onChange={(event) => setForm({ ...form, gorunenAd: event.target.value })} /></label>
            <label>Tercih edilen e-posta<input value={form.eposta} onChange={(event) => setForm({ ...form, eposta: event.target.value })} /></label>
          </div>
          <div className="profile-section-title">UI AYARLARI</div>
          <div className="profile-form-grid">
            <label>İş öğesi formu<select value={form.isOgesiFormu} onChange={(event) => setForm({ ...form, isOgesiFormu: event.target.value })}><option>Alan kenarlıklarını gizle</option><option>Standart görünüm</option><option>Kompakt görünüm</option></select></label>
          </div>
        </div>
      ) : (
        <div className="profile-panel">
          <div className="profile-section-title">AYARLAR</div>
          <div className="profile-form-grid">
            <label>Dil<select value={form.dil} onChange={(event) => setForm({ ...form, dil: event.target.value })}><option>Tarayıcı: Türkçe (Türkiye)</option><option>Türkçe</option></select></label>
            <label>Takvim türü<input value="Miladi Takvim" disabled /></label>
            <label>Tarih düzeni<input value="15.06.2026 (d.MM.yyyy)" disabled /></label>
            <label>Saat düzeni<input value="16:09 (HH:mm)" disabled /></label>
            <label>Saat dilimi<select value={form.saatDilimi} onChange={(event) => setForm({ ...form, saatDilimi: event.target.value })}><option>Kuruluş: (UTC+03:00) Istanbul</option><option>UTC</option></select></label>
          </div>
        </div>
      )}
      <div className="profile-actions">
        <button className="primary-action" onClick={() => { dispatch({ type: "saveProfile", payload: form }); onClose(); onNotify("Profil tercihleri kaydedildi."); }}>Değişiklikleri kaydet</button>
        <button className="ghost-action" onClick={onClose}>İptal</button>
      </div>
    </ModalShell>
  );
}

function NotificationModal({ open, onClose, onNotify }) {
  const { state, dispatch } = useAppState();
  const [sekme, setSekme] = useState("kanal");
  const [form, setForm] = useState(state.notifications);

  React.useEffect(() => setForm(state.notifications), [state.notifications, open]);
  if (!open) return null;

  return (
    <ModalShell title="Bildirim ayarları" onClose={onClose} simpleHeader className="profile-modal-card notification-modal-card">
      <div className="profile-identity">
        <div className="profile-avatar notification-avatar">BI</div>
        <div>
          <strong>İş akışı bildirimleri</strong>
          <small>Görev, sprint ve takip edilen kayıt bildirim tercihleri</small>
        </div>
      </div>
      <div className="profile-tabs">
        <button className={`profile-tab${sekme === "kanal" ? " active" : ""}`} onClick={() => setSekme("kanal")}>KANAL</button>
        <button className={`profile-tab${sekme === "olay" ? " active" : ""}`} onClick={() => setSekme("olay")}>OLAYLAR</button>
        <button className={`profile-tab${sekme === "ozet" ? " active" : ""}`} onClick={() => setSekme("ozet")}>ÖZET</button>
      </div>
      {sekme === "kanal" ? (
        <div className="profile-panel">
          <div className="notification-grid">
            {[
              ["uygulamaIci", "Uygulama içi bildirim", form.uygulamaIci ? "Açık" : "Kapalı"],
              ["epostaBildirimleri", "E-posta bildirimleri", form.epostaBildirimleri ? "Açık" : "Kapalı"],
              ["gunlukOzet", "Günlük özet", form.gunlukOzet ? "Her akşam gönder" : "Kapalı"]
            ].map(([key, title, text]) => (
              <button key={key} className={`settings-toggle-card${form[key] ? " active" : ""}`} onClick={() => setForm({ ...form, [key]: !form[key] })}>
                <strong>{title}</strong>
                <small>{text}</small>
              </button>
            ))}
          </div>
        </div>
      ) : sekme === "olay" ? (
        <div className="notification-check-list">
          {[
            ["atamaBildirimleri", "Bana atanan işler"],
            ["durumDegisiklikleri", "Durum değişiklikleri"],
            ["yorumVeBahsetmeler", "Yorum ve bahsetmeler"],
            ["sprintRiskleri", "Sprint riski ve gecikmeler"]
          ].map(([key, title]) => (
            <button key={key} className={`notification-check-item${form[key] ? " active" : ""}`} onClick={() => setForm({ ...form, [key]: !form[key] })}>
              <strong>{title}</strong>
            </button>
          ))}
        </div>
      ) : (
        <div className="profile-panel">
          <div className="profile-form-grid notification-form-grid">
            <label>Özet sıklığı<select value={form.ozetSikligi} onChange={(event) => setForm({ ...form, ozetSikligi: event.target.value })}><option>Her gün</option><option>Haftada 3 gün</option><option>Haftalık</option></select></label>
            <label>Özet saati<select value={form.ozetSaati} onChange={(event) => setForm({ ...form, ozetSaati: event.target.value })}><option>17:30</option><option>18:00</option><option>09:00</option></select></label>
          </div>
          <div className="detail-info-box notification-info-box">Özet içinde: bana atanan açık işler, yaklaşan teslimler, takip edilen kritik kayıtlar ve sprint riskleri yer alır.</div>
        </div>
      )}
      <div className="profile-actions">
        <button className="primary-action" onClick={() => { dispatch({ type: "saveNotifications", payload: form }); onClose(); onNotify("Bildirim tercihleri kaydedildi."); }}>Değişiklikleri kaydet</button>
        <button className="ghost-action" onClick={onClose}>İptal</button>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, kicker, children, onClose, className = "", simpleHeader = false }) {
  return (
    <div className="modal-backdrop profile-modal-backdrop" onClick={onClose}>
      <div className={`modal-card ${className}`.trim()} onClick={(event) => event.stopPropagation()}>
        <div className={simpleHeader ? "profile-modal-header" : "modal-header"}>
          <div>
            {kicker ? <span className="section-kicker">{kicker}</span> : null}
            <h2>{title}</h2>
          </div>
          <button className={simpleHeader ? "profile-close" : "modal-close"} onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MetricCard({ title, value, detail, accent = "" }) {
  return (
    <article className={`metric-card ${accent}`.trim()}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function SelectedTaskCard({ task }) {
  return (
    <div className="selected-task-card selected-task-card-standalone">
      <div className="selected-task-head">
        <strong>{task.kod}</strong>
        <span className={`priority-badge ${oncelikSinifi(task.oncelik)}`}>{task.oncelik}</span>
      </div>
      <h3>{task.baslik}</h3>
      <p>{task.aciklama}</p>
      <div className="selected-task-meta">
        <span>{task.durum}</span>
        <span className={`issue-badge ${isTipiSinifi(task.isTipi)}`}>{task.isTipi}</span>
      </div>
    </div>
  );
}

function getRouteMeta(pathname) {
  switch (pathname) {
    case "/":
      return {
        parent: "Genel Bakış",
        title: "Özet",
        parentHref: "/",
        section: "Ana Alan",
        subtitle: "Proje görünümü, ekip durumu ve görev dağılımı tek bakışta.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3.8 8.5L10 3.6L16.2 8.5" />
            <path d="M5.4 7.9V15.5H14.6V7.9" />
            <path d="M8.4 15.5V11.2H11.6V15.5" />
          </svg>
        )
      };
    case "/gorevler":
      return {
        parent: "Genel Bakış",
        title: "İş Öğeleri",
        parentHref: "/",
        section: "Operasyon",
        subtitle: "Backlog, teslim ve iş akışını merkezi görünümden yönetin.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4.5 5.5H15.5" />
            <path d="M4.5 10H15.5" />
            <path d="M4.5 14.5H11.5" />
          </svg>
        )
      };
    case "/gorevler/pano":
      return {
        parent: "Genel Bakış",
        title: "Akış Tahtası",
        parentHref: "/",
        section: "Süreç",
        subtitle: "Kartları süreç sütunları arasında yönetip darboğazları görün.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="3.5" y="4" width="5.5" height="5.5" rx="1.2" />
            <rect x="11" y="4" width="5.5" height="3.5" rx="1.2" />
            <rect x="11" y="9.5" width="5.5" height="6.5" rx="1.2" />
            <rect x="3.5" y="11.5" width="5.5" height="4.5" rx="1.2" />
          </svg>
        )
      };
    case "/gorevler/liste":
      return {
        parent: "Genel Bakış",
        title: "Sorgular",
        parentHref: "/",
        section: "Analiz",
        subtitle: "Filtreli tablo görünümü ile görevleri hızla tarayın ve düzenleyin.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4.5 5.5H15.5" />
            <path d="M6.5 10H13.5" />
            <path d="M8 14.5H12" />
          </svg>
        )
      };
    case "/sprint-yonetimi":
      return {
        parent: "Genel Bakış",
        title: "Sprint'ler",
        parentHref: "/",
        section: "Planlama",
        subtitle: "Kapasite, risk ve dönem kapanışlarını profesyonel panelde izleyin.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M5 4.5V7.5" />
            <path d="M15 4.5V7.5" />
            <rect x="3.5" y="6" width="13" height="10.5" rx="2" />
            <path d="M3.5 9.5H16.5" />
          </svg>
        )
      };
    default:
      return {
        parent: "Ayarlar",
        title: "Site Ayarları",
        parentHref: "/ayarlar",
        section: "Yönetim",
        subtitle: "Sistem davranışlarını, tercihler ve ekip deneyimini tek yerden ayarlayın.",
        icon: (
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M10 4.1L11 2.8L12.7 3.3L13.1 5C13.5 5.2 13.9 5.4 14.2 5.7L15.9 5.2L17 6.5L16.1 8C16.2 8.4 16.3 8.8 16.3 9.2C16.3 9.6 16.2 10 16.1 10.4L17 11.9L15.9 13.2L14.2 12.7C13.9 13 13.5 13.2 13.1 13.4L12.7 15.1L11 15.6L10 14.3C9.6 14.3 9.2 14.3 8.8 14.3L7.8 15.6L6.1 15.1L5.7 13.4C5.3 13.2 4.9 13 4.6 12.7L2.9 13.2L1.8 11.9L2.7 10.4C2.6 10 2.5 9.6 2.5 9.2C2.5 8.8 2.6 8.4 2.7 8L1.8 6.5L2.9 5.2L4.6 5.7C4.9 5.4 5.3 5.2 5.7 5L6.1 3.3L7.8 2.8L8.8 4.1C9.2 4 9.6 4 10 4.1Z" />
            <circle cx="9.4" cy="9.2" r="2.2" />
          </svg>
        )
      };
  }
}

function nextDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function nextStatus(status) {
  return ileriButonEtiketi(status) === "Yeniden aç"
    ? "Analiz"
    : status === "Analiz"
      ? "Analiz tamamlandı"
      : status === "Analiz tamamlandı"
        ? "Geliştirme"
        : status === "Geliştirme"
          ? "Teste hazır"
          : status === "Teste hazır"
            ? "Test"
            : "Tamamlandı";
}

function prevStatus(status) {
  return status === "Tamamlandı"
    ? "Test"
    : status === "Test"
      ? "Teste hazır"
      : status === "Teste hazır"
        ? "Geliştirme"
        : status === "Geliştirme"
          ? "Analiz tamamlandı"
          : "Analiz";
}
