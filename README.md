# dizaynes.com

Dizaynes Sanat Tasarım Bilişim Ltd. Şti. web sitesi. Derleme gerektirmeyen statik site; GitHub Pages ile yayınlanır.

## Yapı

```
index.html     Tek sayfa: hero, hizmetler, projeler, süreç, hakkımızda, SSS, iletişim
css/style.css  Tüm stiller (renkler en üstteki :root değişkenlerinde)
js/main.js     Kayan galeri, proje filtresi, proje penceresi
img/           Görseller (webp)
```

## Güncelleme

- **Metin değiştirmek:** `index.html` içinde ilgili bölümü düzenleyin.
- **Yeni proje eklemek:** `index.html` → `#projectGrid` içindeki bir `<button class="card">` bloğunu kopyalayın; `data-cat` (Dekorasyon, 3D Tabela, Ürün Maketi, Tema & Etkinlik), görsel, başlık ve açıklamayı değiştirin. Görseli `img/` klasörüne koyun.
- **Renk değiştirmek:** `css/style.css` başındaki `--accent` değeri.

`main` dalına gönderilen her değişiklik birkaç dakika içinde yayına çıkar.

## İletişim

İletişim bölümünde form yok; ziyaretçiler WhatsApp'a (0533 306 18 02) hazır mesajla yönlenir. Üst menüde de WhatsApp ikonu var.

## SEO

- Her sayfada başlık, açıklama, `canonical`, Open Graph ve Twitter kartı etiketleri var. Tüm mutlak adresler `https://dizaynes.com` üzerinden.
- Yapısal veri: anasayfada işletme (adres, telefon, saatler, hizmetler), web sitesi ve SSS; blog yazılarında `BlogPosting` ve içerik yolu.
- `sitemap.xml` ve `robots.txt` site kökünde. Yeni sayfa eklenince `sitemap.xml`'e de eklenmeli.
- Eski WordPress adresleri (`/hizmetlerimiz/`, `/projeler/`, `/iletisim/`, `/projelerimiz/...`, eski blog yazıları) yeni karşılıklarına yönlenir; proje adresleri ilgili projeyi açar.
- `404.html` yalnızca alan adı (dizaynes.com) bağlandıktan sonra doğru görünür.

## Yayın (İHS hosting)

`main` dalına gelen her değişiklik `.github/workflows/ihs-yayinla.yml` ile FTP üzerinden İHS'teki hostinge yüklenir.

- GitHub → Settings → Secrets and variables → Actions → **Secrets**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- İsteğe bağlı **Variables**: `FTP_DIR` (varsayılan `public_html/`), `FTP_PROTOCOL` (varsayılan `ftps`; sorun olursa `ftp`)
- Elle yayınlamak için: Actions → "İHS'e yayınla" → Run workflow
- `.htaccess`: HTTPS + www yönlendirmesi, eski WordPress adreslerinden kalıcı (301) yönlendirmeler, 404 sayfası, önbellek.

GitHub Pages (beykan1987.github.io/dizaynes) önizleme olarak çalışmaya devam eder.
