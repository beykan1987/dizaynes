# dizaynes.com

Dizaynes Sanat Tasarım Bilişim Ltd. Şti. web sitesi. Derleme gerektirmeyen statik site; GitHub Pages ile yayınlanır.

## Yapı

```
index.html     Tek sayfa: hero, hizmetler, projeler, süreç, hakkımızda, SSS, iletişim
css/style.css  Tüm stiller (renkler en üstteki :root değişkenlerinde)
js/main.js     Kayan galeri, proje filtresi, proje penceresi, iletişim formu
img/           Görseller (webp)
```

## Güncelleme

- **Metin değiştirmek:** `index.html` içinde ilgili bölümü düzenleyin.
- **Yeni proje eklemek:** `index.html` → `#projectGrid` içindeki bir `<button class="card">` bloğunu kopyalayın; `data-cat` (Dekorasyon, 3D Tabela, Ürün Maketi, Tema & Etkinlik), görsel, başlık ve açıklamayı değiştirin. Görseli `img/` klasörüne koyun.
- **Renk değiştirmek:** `css/style.css` başındaki `--accent` değeri.

`main` dalına gönderilen her değişiklik birkaç dakika içinde yayına çıkar.

## İletişim formu

Form şu an ziyaretçinin e-posta uygulamasını `info@dizaynes.com` adresine hazır mesajla açar. Doğrudan e-posta göndermesi için Formspree veya Web3Forms gibi bir form servisi bağlanabilir.
