# dizaynes.com: proje notları

Dizaynes Sanat Tasarım Bilişim Ltd. Şti. (Bursa, Nilüfer) — 3D tabela, kabartma (rölyef) duvar/tavan, tema tasarım ve üretim, strafor kesim, 3D baskı, SLA reçine özel model.
İletişim: 0533 306 18 02 (Sedat Olgun), 0532 200 86 34, info@dizaynes.com. Instagram @dizayn_es, facebook.com/Dizaynes.
Kullanıcı Türkçe konuşur; yanıtlar Türkçe olsun.

## Yapı
- Statik site deponun kökünde: `index.html`, `css/style.css`, `js/main.js`, `js/menu.js`, `img/`, `blog/`, `404.html`, `.htaccess`, `sitemap.xml`, `robots.txt`.
- Yayın: `main`'e push → `.github/workflows/ihs-yayinla.yml` lftp ile İHS (Plesk) `httpdocs/` klasörüne yükler (düz FTP; FTPS veri bağlantısı sunucuda kesiliyor). Secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. `paylasim/`, README, CLAUDE.md, `.github/` yüklenmez.
- GitHub Pages (beykan1987.github.io/dizaynes) önizleme olarak açık.
- Görsel adreslerinde `?v=N` önbellek kırıcı var; görsel değişince sürümü artır.
- `.htaccess`: HTTPS + www'suz yönlendirme, eski WordPress adreslerine 301, wp-* dosyaları 404 (WordPress dosyaları sunucuda duruyor ama kapalı).

## Instagram (@dizayn_es)
- Meta Graph API, Facebook ile giriş (A yolu: kullanıcının kişisel Facebook'u Dizaynes Facebook Sayfasında tam yetkili). Anahtar GitHub Secret `IG_ACCESS_TOKEN`; sohbete ya da dosyaya asla yazılmaz.
- `paylasim/ig_publish.py <id> <post|hikaye|ikisi|reel|reelsadece>`; medya `social/<id>-post.jpg`, `-hikaye.jpg|mp4`, `-reel.mp4`, `-kapak.jpg` (siteye yüklenir, Instagram https://dizaynes.com/social/... adresinden çeker); açıklamalar `paylasim/aciklama/<id>.txt` (reel için `<id>-reel.txt`).
- Workflow'lar: `instagram-paylas.yml` (elle: `id`, `ne`), `instagram-test.yml` (yalnızca okur). Tetikleme: `gh workflow run instagram-paylas.yml -f id=... -f ne=post`.
- Paylaşım yalnızca kullanıcı onayıyla. Otomatik takvim henüz kurulmadı (sonra planlanacak).

## Kurallar
- Görsel değişiklikleri yayından önce önizlemeyle kontrol et.
- Ürün görsellerinde telefon numarası kesilir (sitede WhatsApp 0533 306 18 02'ye gider).
