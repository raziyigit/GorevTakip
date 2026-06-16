import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const AppStateContext = createContext(null);

const durumSirasi = [
  "Analiz",
  "Analiz tamamlandı",
  "Geliştirme",
  "Teste hazır",
  "Test",
  "Tamamlandı"
];

const panoSutunlari = [
  { baslik: "Analiz", aciklama: "İhtiyaç ve kapsam çözümleme aşaması", durum: "Analiz" },
  { baslik: "Analiz tamamlandı", aciklama: "Analiz bitmiş ve geliştirmeye hazır işler", durum: "Analiz tamamlandı" },
  { baslik: "Geliştirme", aciklama: "Aktif kodlama ve uygulama işleri", durum: "Geliştirme" },
  { baslik: "Teste hazır", aciklama: "Geliştirmesi bitmiş ve test kuyruğunda bekleyen işler", durum: "Teste hazır" },
  { baslik: "Test", aciklama: "Doğrulama ve kabul testi aşaması", durum: "Test" },
  { baslik: "Tamamlandı", aciklama: "Kapanmış ve teslim edilmiş işler", durum: "Tamamlandı" }
];

const initialState = {
  tasks: [
    {
      id: 1,
      kod: "GT-101",
      baslik: "Sprint planlama notlarını netleştir",
      aciklama: "Öncelik sırasını, sorumluları ve geçiş kriterlerini güncelleyerek ekip ile paylaş.",
      kabulKriterleri: "Sprint kapsamı ekip tarafından onaylandı.\nBağımlı işler net şekilde ayrıştırıldı.\nTermin ve sorumlular güncellendi.",
      terminTarihi: isoDateOffset(1),
      oncelik: "Yüksek",
      durum: "Analiz",
      isTipi: "Ana madde",
      atananKisi: "Ürün Analisti",
      alan: "Ürün Yönetimi",
      iterasyon: "Sprint 12",
      sebep: "Analiz çalışması bekliyor",
      isDegeri: 8,
      efor: 5,
      degerAlani: "İş",
      takipteMi: true,
      yorumlar: [
        { id: 1, yazar: "Proje Yöneticisi", metin: "Sprint öncesi bu maddenin kapsamı netleşmeli.", tarih: isoDateTimeOffsetHours(-6) }
      ]
    },
    {
      id: 2,
      kod: "GT-102",
      baslik: "Müşteri geri bildirimlerini backlog'a işle",
      aciklama: "Son demo sonrasında gelen aksiyon maddelerini epiklere ve alt maddelere dağıt.",
      kabulKriterleri: "Tüm müşteri notları etiketlendi.\nBacklog önceliği güncellendi.\nEksik bilgi kalan maddeler işaretlendi.",
      terminTarihi: isoDateOffset(3),
      oncelik: "Orta",
      durum: "Geliştirme",
      isTipi: "Backlog",
      atananKisi: "İş Analisti",
      alan: "Müşteri Başarısı",
      iterasyon: "Sprint 12",
      sebep: "Geliştirme hazırlığı",
      isDegeri: 5,
      efor: 3,
      degerAlani: "Müşteri",
      takipteMi: false,
      yorumlar: [
        { id: 2, yazar: "Ürün Sahibi", metin: "Önce ödeme akışına etkisi olan maddeleri ayıralım.", tarih: isoDateTimeOffsetHours(-4) }
      ]
    },
    {
      id: 3,
      kod: "GT-103",
      baslik: "Haftalık yönetim raporunu kapat",
      aciklama: "Teslim edilen işler, riskler ve gelecek hafta hedefleri ile raporu tamamla.",
      kabulKriterleri: "Rapor gönderildi.\nRisk listesi güncellendi.\nYönetim özeti eklendi.",
      terminTarihi: isoDateOffset(-1),
      oncelik: "Düşük",
      durum: "Tamamlandı",
      isTipi: "Ek madde",
      atananKisi: "Operasyon Uzmanı",
      alan: "Operasyon",
      iterasyon: "Sprint 11",
      sebep: "Teslim edildi",
      isDegeri: 3,
      efor: 2,
      degerAlani: "Operasyon",
      takipteMi: false,
      yorumlar: [
        { id: 3, yazar: "Yönetim", metin: "Rapor formatı onaylandı.", tarih: isoDateTimeOffsetHours(-24) }
      ]
    }
  ],
  selectedTaskId: 1,
  sprints: [
    {
      id: 1,
      ad: "Sprint 11",
      baslangicTarihi: isoDateOffset(-21),
      bitisTarihi: isoDateOffset(-8),
      hedef: "Yönetim raporları ve operasyonel kapanış akışlarını teslim et.",
      kapasite: 18,
      durum: "Tamamlandı",
      kapanisNotu: "Sprint hedefi tamamlandı, kalan küçük destek işleri sonraki döneme taşındı."
    },
    {
      id: 2,
      ad: "Sprint 12",
      baslangicTarihi: isoDateOffset(-2),
      bitisTarihi: isoDateOffset(12),
      hedef: "Müşteri geri bildirimlerini toparla ve kritik işlerin test geçişini hızlandır.",
      kapasite: 24,
      durum: "Aktif",
      kapanisNotu: ""
    },
    {
      id: 3,
      ad: "Sprint 13",
      baslangicTarihi: isoDateOffset(13),
      bitisTarihi: isoDateOffset(27),
      hedef: "Yeni planlanan işlerin analiz ve geliştirme yoğunluğunu dengeli başlat.",
      kapasite: 26,
      durum: "Planlandı",
      kapanisNotu: ""
    }
  ],
  profile: {
    gorunenAd: "Razi Mert YİĞİT",
    eposta: "razimert.yigit@saglik.gov.tr",
    isOgesiFormu: "Alan kenarlıklarını gizle",
    dil: "Tarayıcı: Türkçe (Türkiye)",
    saatDilimi: "Kuruluş: (UTC+03:00) Istanbul"
  },
  notifications: {
    uygulamaIci: true,
    epostaBildirimleri: true,
    gunlukOzet: true,
    tercihKanal: "Her ikisi",
    sessizSaat: "22:00 - 08:00",
    atamaBildirimleri: true,
    durumDegisiklikleri: true,
    yorumVeBahsetmeler: true,
    sprintRiskleri: true,
    ozetSikligi: "Her gün",
    ozetSaati: "17:30"
  },
  settings: {
    sprintAdi: "Sprint 12",
    sprintSuresi: "2 hafta",
    sprintHedefi: "Yüksek öncelikli müşteri kayıtlarını kapat ve test kuyruğunu temizle.",
    wipLimiti: 4,
    baslangicDurumu: "Analiz",
    kapanisKurali: "Tüm kritik işler kapanmalı",
    varsayilanAcilisEkrani: "Genel Bakış",
    bildirimYogunlugu: "Standart",
    tarihBicimi: "dd MMM yyyy",
    kartYogunlugu: "Standart",
    canliBildirimler: true,
    detaydaYorumAlaniAcik: true,
    kisaYolIpuclari: false
  }
};

function isoDateOffset(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isoDateTimeOffsetHours(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function sebepMetni(durum) {
  switch (durum) {
    case "Analiz":
      return "Analiz çalışması bekliyor";
    case "Analiz tamamlandı":
      return "Geliştirme kuyruğuna hazır";
    case "Geliştirme":
      return "Aktif geliştirme sürüyor";
    case "Teste hazır":
      return "Teste çıkmayı bekliyor";
    case "Test":
      return "Doğrulama sürüyor";
    default:
      return "Teslim edildi";
  }
}

function sonrakiDurum(durum) {
  const index = durumSirasi.indexOf(durum);
  return durumSirasi[(index + 1) % durumSirasi.length];
}

function oncekiDurum(durum) {
  const index = durumSirasi.indexOf(durum);
  return durumSirasi[Math.max(0, index - 1)];
}

function updateTask(state, id, updater) {
  const tasks = state.tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }
    const updated = updater(task);
    return {
      ...updated,
      sebep: updated.sebep ?? sebepMetni(updated.durum)
    };
  });
  return {
    ...state,
    tasks
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "selectTask":
      return { ...state, selectedTaskId: action.id };
    case "createTask": {
      const yeniId = Math.max(...state.tasks.map((task) => task.id), 0) + 1;
      const aktifSprint = state.sprints.find((sprint) => sprint.durum === "Aktif");
      const yeniGorev = {
        id: yeniId,
        kod: `GT-${yeniId + 100}`,
        baslik: action.payload.baslik.trim(),
        aciklama: action.payload.aciklama.trim() || "Açıklama eklenmedi.",
        kabulKriterleri: "Kabul kriteri henüz tanımlanmadı.",
        terminTarihi: action.payload.terminTarihi,
        oncelik: action.payload.oncelik,
        durum: "Analiz",
        isTipi: action.payload.isTipi,
        atananKisi: "Atanmamış",
        alan: "Genel",
        iterasyon: aktifSprint?.ad ?? "Backlog",
        sebep: "Yeni oluşturuldu",
        isDegeri: 3,
        efor: 2,
        degerAlani: "İş",
        takipteMi: false,
        yorumlar: []
      };
      return {
        ...state,
        tasks: [yeniGorev, ...state.tasks],
        selectedTaskId: yeniGorev.id
      };
    }
    case "deleteTask": {
      const tasks = state.tasks.filter((task) => task.id !== action.id);
      return {
        ...state,
        tasks,
        selectedTaskId: state.selectedTaskId === action.id ? tasks[0]?.id ?? null : state.selectedTaskId
      };
    }
    case "cycleTaskStatus":
      return updateTask(state, action.id, (task) => ({ ...task, durum: sonrakiDurum(task.durum) }));
    case "moveTaskForward":
      return updateTask(state, action.id, (task) => ({ ...task, durum: sonrakiDurum(task.durum) }));
    case "moveTaskBackward":
      return updateTask(state, action.id, (task) => ({ ...task, durum: oncekiDurum(task.durum) }));
    case "moveTaskToStatus":
      return updateTask(state, action.id, (task) => ({ ...task, durum: action.durum }));
    case "updateTask":
      return updateTask(state, action.id, (task) => ({ ...task, ...action.payload }));
    case "toggleTaskFollow":
      return updateTask(state, action.id, (task) => ({ ...task, takipteMi: !task.takipteMi }));
    case "addComment":
      return updateTask(state, action.id, (task) => ({
        ...task,
        yorumlar: [
          {
            id: Math.max(...task.yorumlar.map((yorum) => yorum.id), 0) + 1,
            yazar: action.payload.yazar.trim() || "Ekip Üyesi",
            metin: action.payload.metin.trim(),
            tarih: new Date().toISOString()
          },
          ...task.yorumlar
        ]
      }));
    case "createSprint": {
      const yeniSprint = {
        id: Math.max(...state.sprints.map((sprint) => sprint.id), 0) + 1,
        ad: action.payload.ad.trim(),
        baslangicTarihi: action.payload.baslangicTarihi,
        bitisTarihi: action.payload.bitisTarihi,
        hedef: action.payload.hedef.trim() || "Sprint hedefi girilmedi.",
        kapasite: Math.max(1, Number(action.payload.kapasite)),
        durum: state.sprints.some((sprint) => sprint.durum === "Aktif") ? "Planlandı" : "Aktif",
        kapanisNotu: ""
      };
      return { ...state, sprints: [...state.sprints, yeniSprint] };
    }
    case "closeActiveSprint": {
      const aktifSprint = state.sprints.find((sprint) => sprint.durum === "Aktif");
      if (!aktifSprint) {
        return state;
      }
      let sprints = state.sprints.map((sprint) =>
        sprint.id === aktifSprint.id
          ? { ...sprint, durum: "Tamamlandı", kapanisNotu: action.payload.kapanisNotu.trim() || "Sprint planı tamamlandı." }
          : sprint
      );
      let sonrakiSprintAd = action.payload.sonrakiSprintAdi?.trim();
      if (sonrakiSprintAd) {
        const nextId = Math.max(...sprints.map((sprint) => sprint.id), 0) + 1;
        if (!sprints.some((sprint) => sprint.ad.toLowerCase() === sonrakiSprintAd.toLowerCase())) {
          sprints = [
            ...sprints,
            {
              id: nextId,
              ad: sonrakiSprintAd,
              baslangicTarihi: action.payload.sonrakiSprintBaslangic,
              bitisTarihi: action.payload.sonrakiSprintBitis,
              hedef: action.payload.sonrakiSprintHedefi.trim() || "Sprint hedefi girilmedi.",
              kapasite: Math.max(1, Number(action.payload.sonrakiSprintKapasite)),
              durum: "Planlandı",
              kapanisNotu: ""
            }
          ];
        }
      }
      const aktifOlacak = sprints
        .filter((sprint) => sprint.durum === "Planlandı")
        .sort((a, b) => a.baslangicTarihi.localeCompare(b.baslangicTarihi))[0];
      sprints = sprints.map((sprint) => ({
        ...sprint,
        durum: aktifOlacak && sprint.id === aktifOlacak.id ? "Aktif" : sprint.durum === "Aktif" ? "Planlandı" : sprint.durum
      }));
      const tasks = action.payload.aciklariTasi
        ? state.tasks.map((task) =>
            task.iterasyon === aktifSprint.ad && task.durum !== "Tamamlandı"
              ? { ...task, iterasyon: aktifOlacak?.ad ?? "Backlog" }
              : task
          )
        : state.tasks;
      return { ...state, sprints, tasks };
    }
    case "activateSprint":
      return {
        ...state,
        sprints: state.sprints.map((sprint) => {
          if (sprint.durum === "Tamamlandı") {
            return sprint;
          }
          return { ...sprint, durum: sprint.id === action.id ? "Aktif" : "Planlandı" };
        })
      };
    case "saveProfile":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "saveNotifications":
      return { ...state, notifications: { ...state.notifications, ...action.payload } };
    case "saveSettings":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (seed) => {
    const stored = window.localStorage.getItem("gorev-takip-react-state");
    return stored ? JSON.parse(stored) : seed;
  });

  useEffect(() => {
    window.localStorage.setItem("gorev-takip-react-state", JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch, panoSutunlari }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function useTaskHelpers() {
  const { state } = useAppState();
  const selectedTask = state.tasks.find((task) => task.id === state.selectedTaskId) ?? null;
  const activeSprint = state.sprints.find((sprint) => sprint.durum === "Aktif") ?? null;
  const tamamlananSayisi = state.tasks.filter((task) => task.durum === "Tamamlandı").length;
  const devamEdenSayisi = state.tasks.filter((task) => task.durum !== "Tamamlandı").length;
  const yuksekOncelikSayisi = state.tasks.filter((task) => task.oncelik === "Yüksek" && task.durum !== "Tamamlandı").length;
  const tamamlanmaOrani = state.tasks.length ? Math.round((tamamlananSayisi * 100) / state.tasks.length) : 0;
  const enYakinTeslimTask = [...state.tasks]
    .filter((task) => task.durum !== "Tamamlandı")
    .sort((a, b) => a.terminTarihi.localeCompare(b.terminTarihi))[0];

  const isTipiOzetleri = ["Bug", "Backlog", "Ana madde", "Ek madde"].map((tip) => ({
    tip,
    adet: state.tasks.filter((task) => task.isTipi === tip).length,
    aciklama:
      tip === "Bug"
        ? "Hata ve arıza kayıtları"
        : tip === "Backlog"
          ? "Planlanan ve sıralanacak işler"
          : tip === "Ana madde"
            ? "Epik veya ana iş kalemleri"
            : "Alt iş veya destek maddeleri"
  }));

  return {
    selectedTask,
    activeSprint,
    tamamlananSayisi,
    devamEdenSayisi,
    yuksekOncelikSayisi,
    tamamlanmaOrani,
    enYakinTeslim: enYakinTeslimTask ? `${enYakinTeslimTask.kod} - ${formatDate(enYakinTeslimTask.terminTarihi)}` : "Açık teslim bulunmuyor",
    isTipiOzetleri
  };
}

export function filterTasks(tasks, filtre, aramaMetni) {
  return tasks
    .filter((task) => {
      if (filtre === "Tamamlanan") {
        return task.durum === "Tamamlandı";
      }
      if (filtre === "Açıklar") {
        return task.durum !== "Tamamlandı";
      }
      return true;
    })
    .filter((task) => {
      const query = aramaMetni.trim().toLocaleLowerCase("tr");
      return !query || [task.baslik, task.aciklama, task.kod].some((alan) => alan.toLocaleLowerCase("tr").includes(query));
    })
    .sort((a, b) => {
      const durumFarki = durumSirasi.indexOf(a.durum) - durumSirasi.indexOf(b.durum);
      if (durumFarki !== 0) {
        return durumFarki;
      }
      return a.terminTarihi.localeCompare(b.terminTarihi);
    });
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDay(value) {
  return new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(new Date(value));
}

export function durumSinifi(durum) {
  switch (durum) {
    case "Analiz":
      return "analysis";
    case "Analiz tamamlandı":
      return "analysis-done";
    case "Geliştirme":
      return "development";
    case "Teste hazır":
      return "ready-test";
    case "Test":
      return "test";
    default:
      return "done";
  }
}

export function oncelikSinifi(oncelik) {
  return oncelik === "Yüksek" ? "priority-high" : oncelik === "Orta" ? "priority-medium" : "priority-low";
}

export function isTipiSinifi(tip) {
  return tip === "Bug" ? "issue-bug" : tip === "Backlog" ? "issue-backlog" : tip === "Ana madde" ? "issue-parent" : "issue-child";
}

export function sprintDurumSinifi(durum) {
  return durum === "Aktif" ? "sprint-state-active" : durum === "Planlandı" ? "sprint-state-planned" : "sprint-state-completed";
}

export function ileriButonEtiketi(durum) {
  switch (durum) {
    case "Analiz":
      return "Analizi bitir";
    case "Analiz tamamlandı":
      return "Geliştirmeye al";
    case "Geliştirme":
      return "Teste hazır yap";
    case "Teste hazır":
      return "Teste al";
    case "Test":
      return "Tamamla";
    default:
      return "Yeniden aç";
  }
}
