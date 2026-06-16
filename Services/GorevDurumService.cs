using System.Globalization;

namespace GorevTakip.Services;

public sealed class GorevDurumService
{
    private static readonly CultureInfo TrCulture = CultureInfo.GetCultureInfo("tr-TR");

    private readonly List<GorevKaydi> _gorevler =
    [
        new()
        {
            Id = 1,
            Kod = "GT-101",
            Baslik = "Sprint planlama notlarını netleştir",
            Aciklama = "Öncelik sırasını, sorumluları ve geçiş kriterlerini güncelleyerek ekip ile paylaş.",
            KabulKriterleri = "Sprint kapsamı ekip tarafından onaylandı.\nBağımlı işler net şekilde ayrıştırıldı.\nTermin ve sorumlular güncellendi.",
            TerminTarihi = DateTime.Today.AddDays(1),
            Oncelik = Oncelik.Yuksek,
            Durum = GorevDurumu.Analiz,
            IsTipi = IsTipi.AnaMadde,
            AtananKisi = "Ürün Analisti",
            Alan = "Ürün Yönetimi",
            Iterasyon = "Sprint 12",
            Sebep = "Analiz çalışması bekliyor",
            IsDegeri = 8,
            Efor = 5,
            DegerAlani = "İş",
            TakipteMi = true,
            Yorumlar =
            [
                new GorevYorumu(1, "Proje Yöneticisi", "Sprint öncesi bu maddenin kapsamı netleşmeli.", DateTime.Now.AddHours(-6))
            ]
        },
        new()
        {
            Id = 2,
            Kod = "GT-102",
            Baslik = "Müşteri geri bildirimlerini backlog'a işle",
            Aciklama = "Son demo sonrasında gelen aksiyon maddelerini epiklere ve alt maddelere dağıt.",
            KabulKriterleri = "Tüm müşteri notları etiketlendi.\nBacklog önceliği güncellendi.\nEksik bilgi kalan maddeler işaretlendi.",
            TerminTarihi = DateTime.Today.AddDays(3),
            Oncelik = Oncelik.Orta,
            Durum = GorevDurumu.Gelistirme,
            IsTipi = IsTipi.Backlog,
            AtananKisi = "İş Analisti",
            Alan = "Müşteri Başarısı",
            Iterasyon = "Sprint 12",
            Sebep = "Geliştirme hazırlığı",
            IsDegeri = 5,
            Efor = 3,
            DegerAlani = "Müşteri",
            Yorumlar =
            [
                new GorevYorumu(2, "Ürün Sahibi", "Önce ödeme akışına etkisi olan maddeleri ayıralım.", DateTime.Now.AddHours(-4))
            ]
        },
        new()
        {
            Id = 3,
            Kod = "GT-103",
            Baslik = "Haftalık yönetim raporunu kapat",
            Aciklama = "Teslim edilen işler, riskler ve gelecek hafta hedefleri ile raporu tamamla.",
            KabulKriterleri = "Rapor gönderildi.\nRisk listesi güncellendi.\nYönetim özeti eklendi.",
            TerminTarihi = DateTime.Today.AddDays(-1),
            Oncelik = Oncelik.Dusuk,
            Durum = GorevDurumu.Tamamlandi,
            IsTipi = IsTipi.EkMadde,
            AtananKisi = "Operasyon Uzmanı",
            Alan = "Operasyon",
            Iterasyon = "Sprint 11",
            Sebep = "Teslim edildi",
            IsDegeri = 3,
            Efor = 2,
            DegerAlani = "Operasyon",
            Yorumlar =
            [
                new GorevYorumu(3, "Yönetim", "Rapor formatı onaylandı.", DateTime.Now.AddDays(-1))
            ]
        }
    ];

    private readonly List<SprintKaydi> _sprintler =
    [
        new()
        {
            Id = 1,
            Ad = "Sprint 11",
            BaslangicTarihi = DateTime.Today.AddDays(-21),
            BitisTarihi = DateTime.Today.AddDays(-8),
            Hedef = "Yönetim raporları ve operasyonel kapanış akışlarını teslim et.",
            Kapasite = 18,
            Durum = SprintDurumu.Tamamlandi,
            KapanisNotu = "Sprint hedefi tamamlandı, kalan küçük destek işleri sonraki döneme taşındı."
        },
        new()
        {
            Id = 2,
            Ad = "Sprint 12",
            BaslangicTarihi = DateTime.Today.AddDays(-2),
            BitisTarihi = DateTime.Today.AddDays(12),
            Hedef = "Müşteri geri bildirimlerini toparla ve kritik işlerin test geçişini hızlandır.",
            Kapasite = 24,
            Durum = SprintDurumu.Aktif
        },
        new()
        {
            Id = 3,
            Ad = "Sprint 13",
            BaslangicTarihi = DateTime.Today.AddDays(13),
            BitisTarihi = DateTime.Today.AddDays(27),
            Hedef = "Yeni planlanan işlerin analiz ve geliştirme yoğunluğunu dengeli başlat.",
            Kapasite = 26,
            Durum = SprintDurumu.Planlandi
        }
    ];

    public event Action? OnChange;

    public IReadOnlyList<PanoSutunu> PanoSutunlari { get; } =
    [
        new("Analiz", "İhtiyaç ve kapsam çözümleme aşaması", GorevDurumu.Analiz),
        new("Analiz tamamlandı", "Analiz bitmiş ve geliştirmeye hazır işler", GorevDurumu.AnalizTamamlandi),
        new("Geliştirme", "Aktif kodlama ve uygulama işleri", GorevDurumu.Gelistirme),
        new("Teste hazır", "Geliştirmesi bitmiş ve test kuyruğunda bekleyen işler", GorevDurumu.TesteHazir),
        new("Test", "Doğrulama ve kabul testi aşaması", GorevDurumu.Test),
        new("Tamamlandı", "Kapanmış ve teslim edilmiş işler", GorevDurumu.Tamamlandi)
    ];

    public GorevKaydi? SeciliGorev { get; private set; }
    public IReadOnlyList<SprintKaydi> Sprintler => _sprintler.OrderByDescending(x => x.BaslangicTarihi).ToList();
    public SprintKaydi? AktifSprintKaydi => _sprintler.FirstOrDefault(x => x.Durum == SprintDurumu.Aktif);
    public string AktifSprintAdi => AktifSprintKaydi?.Ad ?? "Backlog";
    public int ToplamGorevSayisi => _gorevler.Count;

    public IReadOnlyList<IsTipiOzeti> IsTipiOzetleri =>
    [
        new(IsTipi.Bug, _gorevler.Count(x => x.IsTipi == IsTipi.Bug), "Hata ve arıza kayıtları"),
        new(IsTipi.Backlog, _gorevler.Count(x => x.IsTipi == IsTipi.Backlog), "Planlanan ve sıralanacak işler"),
        new(IsTipi.AnaMadde, _gorevler.Count(x => x.IsTipi == IsTipi.AnaMadde), "Epik veya ana iş kalemleri"),
        new(IsTipi.EkMadde, _gorevler.Count(x => x.IsTipi == IsTipi.EkMadde), "Alt iş veya destek maddeleri")
    ];

    public GorevDurumService()
    {
        SeciliGorev = _gorevler.FirstOrDefault();
    }

    public int TamamlananSayisi => _gorevler.Count(x => x.Durum == GorevDurumu.Tamamlandi);
    public int DevamEdenSayisi => _gorevler.Count(x => x.Durum != GorevDurumu.Tamamlandi);
    public int YuksekOncelikSayisi => _gorevler.Count(x => x.Oncelik == Oncelik.Yuksek && x.Durum != GorevDurumu.Tamamlandi);
    public int TamamlanmaOrani => _gorevler.Count == 0 ? 0 : (int)Math.Round(TamamlananSayisi * 100d / _gorevler.Count);

    public string EnYakinTeslim => _gorevler
        .Where(x => x.Durum != GorevDurumu.Tamamlandi)
        .OrderBy(x => x.TerminTarihi)
        .Select(x => $"{x.Kod} - {x.TerminTarihi.ToString("dd MMM yyyy", TrCulture)}")
        .FirstOrDefault() ?? "Açık teslim bulunmuyor";

    public IEnumerable<GorevKaydi> FiltrelenmisGorevler(DurumFiltresi filtre, string? aramaMetni) =>
        _gorevler
            .Where(g => filtre switch
            {
                DurumFiltresi.Tamamlanan => g.Durum == GorevDurumu.Tamamlandi,
                DurumFiltresi.Aciklar => g.Durum != GorevDurumu.Tamamlandi,
                _ => true
            })
            .Where(g =>
                string.IsNullOrWhiteSpace(aramaMetni) ||
                g.Baslik.Contains(aramaMetni, StringComparison.CurrentCultureIgnoreCase) ||
                g.Aciklama.Contains(aramaMetni, StringComparison.CurrentCultureIgnoreCase) ||
                g.Kod.Contains(aramaMetni, StringComparison.CurrentCultureIgnoreCase))
            .OrderBy(g => g.Durum)
            .ThenBy(g => g.TerminTarihi);

    public IEnumerable<GorevKaydi> SprintGorevleri(string sprintAdi) =>
        _gorevler.Where(x => x.Iterasyon == sprintAdi);

    public IslemSonucu GorevEkle(string baslik, string aciklama, DateTime terminTarihi, Oncelik oncelik, IsTipi isTipi)
    {
        if (string.IsNullOrWhiteSpace(baslik))
        {
            return new(false, "Görev başlığı boş bırakılamaz.");
        }

        var yeniId = _gorevler.Any() ? _gorevler.Max(x => x.Id) + 1 : 1;
        var gorev = new GorevKaydi
        {
            Id = yeniId,
            Kod = $"GT-{yeniId + 100}",
            Baslik = baslik.Trim(),
            Aciklama = string.IsNullOrWhiteSpace(aciklama) ? "Açıklama eklenmedi." : aciklama.Trim(),
            KabulKriterleri = "Kabul kriteri henüz tanımlanmadı.",
            TerminTarihi = terminTarihi,
            Oncelik = oncelik,
            Durum = GorevDurumu.Analiz,
            IsTipi = isTipi,
            AtananKisi = "Atanmamış",
            Alan = "Genel",
            Iterasyon = AktifSprintAdi,
            Sebep = "Yeni oluşturuldu",
            IsDegeri = 3,
            Efor = 2,
            DegerAlani = "İş"
        };

        _gorevler.Insert(0, gorev);
        SeciliGorev = gorev;
        Bildir();
        return new(true, "Yeni görev oluşturuldu ve listeye eklendi.");
    }

    public void GorevSec(int id)
    {
        SeciliGorev = _gorevler.FirstOrDefault(x => x.Id == id);
        Bildir();
    }

    public string DurumuDondur(int id)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        gorev.Durum = SonrakiDurum(gorev.Durum);
        gorev.Sebep = SebepMetni(gorev.Durum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} durumu {DurumEtiketi(gorev.Durum).ToLower(TrCulture)} olarak güncellendi.";
    }

    public string IleriTasi(int id)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        gorev.Durum = SonrakiDurum(gorev.Durum);
        gorev.Sebep = SebepMetni(gorev.Durum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} yeni aşamaya taşındı.";
    }

    public string GeriTasi(int id)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        gorev.Durum = OncekiDurum(gorev.Durum);
        gorev.Sebep = SebepMetni(gorev.Durum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} önceki akış adımına taşındı.";
    }

    public string Guncelle(int id, string baslik, string aciklama, DateTime tarih, Oncelik oncelik, GorevDurumu durum, IsTipi isTipi)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        if (string.IsNullOrWhiteSpace(baslik))
        {
            return "Düzenleme için başlık zorunludur.";
        }

        gorev.Baslik = baslik.Trim();
        gorev.Aciklama = string.IsNullOrWhiteSpace(aciklama) ? "Açıklama eklenmedi." : aciklama.Trim();
        gorev.TerminTarihi = tarih;
        gorev.Oncelik = oncelik;
        gorev.Durum = durum;
        gorev.IsTipi = isTipi;
        gorev.Sebep = SebepMetni(durum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} güncellendi.";
    }

    public string DetayGuncelle(
        int id,
        string baslik,
        string aciklama,
        string kabulKriterleri,
        string atananKisi,
        string alan,
        string iterasyon,
        DateTime terminTarihi,
        Oncelik oncelik,
        GorevDurumu durum,
        IsTipi isTipi,
        int isDegeri,
        int efor,
        string degerAlani)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        if (string.IsNullOrWhiteSpace(baslik))
        {
            return "Kaydetmek için başlık zorunludur.";
        }

        gorev.Baslik = baslik.Trim();
        gorev.Aciklama = string.IsNullOrWhiteSpace(aciklama) ? "Açıklama eklenmedi." : aciklama.Trim();
        gorev.KabulKriterleri = string.IsNullOrWhiteSpace(kabulKriterleri) ? "Kabul kriteri henüz tanımlanmadı." : kabulKriterleri.Trim();
        gorev.AtananKisi = string.IsNullOrWhiteSpace(atananKisi) ? "Atanmamış" : atananKisi.Trim();
        gorev.Alan = string.IsNullOrWhiteSpace(alan) ? "Genel" : alan.Trim();
        gorev.Iterasyon = string.IsNullOrWhiteSpace(iterasyon) ? "Backlog" : iterasyon.Trim();
        gorev.TerminTarihi = terminTarihi;
        gorev.Oncelik = oncelik;
        gorev.Durum = durum;
        gorev.IsTipi = isTipi;
        gorev.IsDegeri = Math.Max(0, isDegeri);
        gorev.Efor = Math.Max(0, efor);
        gorev.DegerAlani = string.IsNullOrWhiteSpace(degerAlani) ? "İş" : degerAlani.Trim();
        gorev.Sebep = SebepMetni(durum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} detayları kaydedildi.";
    }

    public string YorumEkle(int id, string yazar, string metin)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        if (string.IsNullOrWhiteSpace(metin))
        {
            return "Yorum metni boş bırakılamaz.";
        }

        var yorumId = gorev.Yorumlar.Count == 0 ? 1 : gorev.Yorumlar.Max(x => x.Id) + 1;
        gorev.Yorumlar.Insert(0, new GorevYorumu(yorumId, string.IsNullOrWhiteSpace(yazar) ? "Ekip Üyesi" : yazar.Trim(), metin.Trim(), DateTime.Now));
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} için yeni yorum eklendi.";
    }

    public string TakipDurumunuDegistir(int id)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        gorev.TakipteMi = !gorev.TakipteMi;
        SeciliGorev = gorev;
        Bildir();
        return gorev.TakipteMi ? $"{gorev.Kod} takip listesine eklendi." : $"{gorev.Kod} takip listesinden çıkarıldı.";
    }

    public string SprintOlustur(string ad, DateTime baslangicTarihi, DateTime bitisTarihi, string hedef, int kapasite)
    {
        if (string.IsNullOrWhiteSpace(ad))
        {
            return "Sprint adı boş bırakılamaz.";
        }

        if (bitisTarihi < baslangicTarihi)
        {
            return "Sprint bitiş tarihi başlangıç tarihinden önce olamaz.";
        }

        if (_sprintler.Any(x => x.Ad.Equals(ad.Trim(), StringComparison.CurrentCultureIgnoreCase)))
        {
            return "Aynı adlı sprint zaten mevcut.";
        }

        var yeniSprint = new SprintKaydi
        {
            Id = _sprintler.Any() ? _sprintler.Max(x => x.Id) + 1 : 1,
            Ad = ad.Trim(),
            BaslangicTarihi = baslangicTarihi,
            BitisTarihi = bitisTarihi,
            Hedef = string.IsNullOrWhiteSpace(hedef) ? "Sprint hedefi girilmedi." : hedef.Trim(),
            Kapasite = Math.Max(1, kapasite),
            Durum = AktifSprintKaydi is null ? SprintDurumu.Aktif : SprintDurumu.Planlandi
        };

        _sprintler.Add(yeniSprint);
        Bildir();
        return yeniSprint.Durum == SprintDurumu.Aktif
            ? $"{yeniSprint.Ad} aktif sprint olarak oluşturuldu."
            : $"{yeniSprint.Ad} planlanan sprint olarak oluşturuldu.";
    }

    public string AktifSprintiKapat(string kapanisNotu, bool aciklariSonrakiSprinteTasi, string yeniSprintAdi, DateTime yeniBaslangic, DateTime yeniBitis, string yeniSprintHedefi, int yeniKapasite)
    {
        var aktifSprint = AktifSprintKaydi;
        if (aktifSprint is null)
        {
            return "Kapatılacak aktif sprint bulunamadı.";
        }

        aktifSprint.Durum = SprintDurumu.Tamamlandi;
        aktifSprint.KapanisNotu = string.IsNullOrWhiteSpace(kapanisNotu) ? "Sprint planı tamamlandı." : kapanisNotu.Trim();

        SprintKaydi? sonrakiSprint = _sprintler
            .Where(x => x.Durum == SprintDurumu.Planlandi)
            .OrderBy(x => x.BaslangicTarihi)
            .FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(yeniSprintAdi))
        {
            var sonuc = SprintOlustur(yeniSprintAdi, yeniBaslangic, yeniBitis, yeniSprintHedefi, yeniKapasite);
            if (sonuc.Contains("boş", StringComparison.OrdinalIgnoreCase) ||
                sonuc.Contains("önce", StringComparison.OrdinalIgnoreCase) ||
                sonuc.Contains("mevcut", StringComparison.OrdinalIgnoreCase))
            {
                Bildir();
                return sonuc;
            }

            sonrakiSprint = _sprintler.FirstOrDefault(x => x.Ad.Equals(yeniSprintAdi.Trim(), StringComparison.CurrentCultureIgnoreCase));
        }

        if (sonrakiSprint is not null)
        {
            foreach (var sprint in _sprintler.Where(x => x.Durum == SprintDurumu.Aktif))
            {
                sprint.Durum = SprintDurumu.Planlandi;
            }

            sonrakiSprint.Durum = SprintDurumu.Aktif;
        }

        if (aciklariSonrakiSprinteTasi)
        {
            foreach (var gorev in _gorevler.Where(x => x.Iterasyon == aktifSprint.Ad && x.Durum != GorevDurumu.Tamamlandi))
            {
                gorev.Iterasyon = sonrakiSprint?.Ad ?? "Backlog";
            }
        }

        Bildir();
        return sonrakiSprint is null
            ? $"{aktifSprint.Ad} kapatıldı. Açık işler backlog üzerinde bırakıldı."
            : $"{aktifSprint.Ad} kapatıldı ve {sonrakiSprint.Ad} aktif sprint olarak açıldı.";
    }

    public string PlanlananSprintiAktiflestir(int sprintId)
    {
        var hedefSprint = _sprintler.FirstOrDefault(x => x.Id == sprintId);
        if (hedefSprint is null)
        {
            return "Sprint bulunamadı.";
        }

        if (hedefSprint.Durum == SprintDurumu.Tamamlandi)
        {
            return "Tamamlanmış sprint yeniden aktifleştirilemez.";
        }

        foreach (var sprint in _sprintler.Where(x => x.Durum == SprintDurumu.Aktif))
        {
            sprint.Durum = SprintDurumu.Planlandi;
        }

        hedefSprint.Durum = SprintDurumu.Aktif;
        Bildir();
        return $"{hedefSprint.Ad} aktif sprint olarak ayarlandı.";
    }

    public string DurumaTasi(int id, GorevDurumu hedefDurum)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        gorev.Durum = hedefDurum;
        gorev.Sebep = SebepMetni(hedefDurum);
        SeciliGorev = gorev;
        Bildir();
        return $"{gorev.Kod} {DurumEtiketi(hedefDurum).ToLower(TrCulture)} sütununa taşındı.";
    }

    public string Sil(int id)
    {
        var gorev = Bul(id);
        if (gorev is null)
        {
            return "Görev bulunamadı.";
        }

        _gorevler.Remove(gorev);
        if (SeciliGorev?.Id == id)
        {
            SeciliGorev = _gorevler.FirstOrDefault();
        }

        Bildir();
        return $"{gorev.Kod} listeden kaldırıldı.";
    }

    public string OncelikEtiketi(Oncelik oncelik) => oncelik switch
    {
        Oncelik.Yuksek => "Yüksek",
        Oncelik.Orta => "Orta",
        _ => "Düşük"
    };

    public string OncelikSinifi(Oncelik oncelik) => oncelik switch
    {
        Oncelik.Yuksek => "priority-high",
        Oncelik.Orta => "priority-medium",
        _ => "priority-low"
    };

    public string DurumEtiketi(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Analiz => "Analiz",
        GorevDurumu.AnalizTamamlandi => "Analiz tamamlandı",
        GorevDurumu.Gelistirme => "Geliştirme",
        GorevDurumu.TesteHazir => "Teste hazır",
        GorevDurumu.Test => "Test",
        _ => "Tamamlandı"
    };

    public string DurumSinifi(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Analiz => "analysis",
        GorevDurumu.AnalizTamamlandi => "analysis-done",
        GorevDurumu.Gelistirme => "development",
        GorevDurumu.TesteHazir => "ready-test",
        GorevDurumu.Test => "test",
        _ => "done"
    };

    public string IleriButonEtiketi(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Analiz => "Analizi bitir",
        GorevDurumu.AnalizTamamlandi => "Geliştirmeye al",
        GorevDurumu.Gelistirme => "Teste hazır yap",
        GorevDurumu.TesteHazir => "Teste al",
        GorevDurumu.Test => "Tamamla",
        _ => "Yeniden aç"
    };

    public string IsTipiEtiketi(IsTipi tip) => tip switch
    {
        IsTipi.Bug => "Bug",
        IsTipi.Backlog => "Backlog",
        IsTipi.AnaMadde => "Ana madde",
        _ => "Ek madde"
    };

    public string IsTipiSinifi(IsTipi tip) => tip switch
    {
        IsTipi.Bug => "issue-bug",
        IsTipi.Backlog => "issue-backlog",
        IsTipi.AnaMadde => "issue-parent",
        _ => "issue-child"
    };

    public string SprintDurumEtiketi(SprintDurumu durum) => durum switch
    {
        SprintDurumu.Aktif => "Aktif",
        SprintDurumu.Planlandi => "Planlandı",
        _ => "Tamamlandı"
    };

    public string SprintDurumSinifi(SprintDurumu durum) => durum switch
    {
        SprintDurumu.Aktif => "sprint-state-active",
        SprintDurumu.Planlandi => "sprint-state-planned",
        _ => "sprint-state-completed"
    };

    private GorevKaydi? Bul(int id) => _gorevler.FirstOrDefault(x => x.Id == id);

    private static GorevDurumu SonrakiDurum(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Analiz => GorevDurumu.AnalizTamamlandi,
        GorevDurumu.AnalizTamamlandi => GorevDurumu.Gelistirme,
        GorevDurumu.Gelistirme => GorevDurumu.TesteHazir,
        GorevDurumu.TesteHazir => GorevDurumu.Test,
        GorevDurumu.Test => GorevDurumu.Tamamlandi,
        _ => GorevDurumu.Analiz
    };

    private static GorevDurumu OncekiDurum(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Tamamlandi => GorevDurumu.Test,
        GorevDurumu.Test => GorevDurumu.TesteHazir,
        GorevDurumu.TesteHazir => GorevDurumu.Gelistirme,
        GorevDurumu.Gelistirme => GorevDurumu.AnalizTamamlandi,
        GorevDurumu.AnalizTamamlandi => GorevDurumu.Analiz,
        _ => GorevDurumu.Analiz
    };

    private static string SebepMetni(GorevDurumu durum) => durum switch
    {
        GorevDurumu.Analiz => "Analiz çalışması bekliyor",
        GorevDurumu.AnalizTamamlandi => "Geliştirme kuyruğuna hazır",
        GorevDurumu.Gelistirme => "Aktif geliştirme sürüyor",
        GorevDurumu.TesteHazir => "Teste çıkmayı bekliyor",
        GorevDurumu.Test => "Doğrulama sürüyor",
        _ => "Teslim edildi"
    };

    private void Bildir() => OnChange?.Invoke();
}

public sealed record IslemSonucu(bool Basarili, string Mesaj);

public sealed class SprintKaydi
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public DateTime BaslangicTarihi { get; set; }
    public DateTime BitisTarihi { get; set; }
    public string Hedef { get; set; } = string.Empty;
    public int Kapasite { get; set; }
    public SprintDurumu Durum { get; set; }
    public string KapanisNotu { get; set; } = string.Empty;
}

public sealed class GorevKaydi
{
    public int Id { get; set; }
    public string Kod { get; set; } = string.Empty;
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public string KabulKriterleri { get; set; } = "Kabul kriteri henüz tanımlanmadı.";
    public DateTime TerminTarihi { get; set; }
    public Oncelik Oncelik { get; set; }
    public GorevDurumu Durum { get; set; }
    public IsTipi IsTipi { get; set; }
    public string AtananKisi { get; set; } = "Atanmamış";
    public string Alan { get; set; } = "Genel";
    public string Iterasyon { get; set; } = "Backlog";
    public string Sebep { get; set; } = "Yeni oluşturuldu";
    public int IsDegeri { get; set; }
    public int Efor { get; set; }
    public string DegerAlani { get; set; } = "İş";
    public bool TakipteMi { get; set; }
    public List<GorevYorumu> Yorumlar { get; set; } = [];
}

public sealed record GorevYorumu(int Id, string Yazar, string Metin, DateTime Tarih);
public sealed record IsTipiOzeti(IsTipi Tip, int Adet, string Aciklama);
public sealed record PanoSutunu(string Baslik, string Aciklama, GorevDurumu Durum);

public enum DurumFiltresi
{
    Tumu,
    Aciklar,
    Tamamlanan
}

public enum CalismaGorunumu
{
    Pano,
    Liste
}

public enum Oncelik
{
    Dusuk,
    Orta,
    Yuksek
}

public enum GorevDurumu
{
    Analiz,
    AnalizTamamlandi,
    Gelistirme,
    TesteHazir,
    Test,
    Tamamlandi
}

public enum IsTipi
{
    Bug,
    Backlog,
    AnaMadde,
    EkMadde
}

public enum SprintDurumu
{
    Planlandi,
    Aktif,
    Tamamlandi
}
