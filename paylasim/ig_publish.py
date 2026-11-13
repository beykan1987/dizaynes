#!/usr/bin/env python3
"""@dizayn_es Instagram hesabına paylaşım yapar (Meta Graph API, Facebook ile giriş).

Kullanım: ig_publish.py <id> <post|hikaye|ikisi|reel|reelsadece>
  post       : social/<id>-post.jpg  + açıklama paylasim/aciklama/<id>.txt
  hikaye     : social/<id>-hikaye.jpg (yoksa <id>-hikaye.mp4)
  ikisi      : post + hikaye
  reel       : social/<id>-reel.mp4 Reel olarak (+ aynı video hikâyede)  açıklama: <id>-reel.txt ya da <id>.txt
  reelsadece : yalnızca Reel
Medya herkese açık adresten çekilir: https://dizaynes.com/social/<dosya>
Ortam: IG_ACCESS_TOKEN (zorunlu), IG_USER_ID (isteğe bağlı; yoksa @dizayn_es otomatik bulunur)
"""
import os, sys, json, time, urllib.request, urllib.parse, urllib.error

API = 'https://graph.facebook.com/v21.0'
BASE = 'https://dizaynes.com/social'
T = os.environ.get('IG_ACCESS_TOKEN', '').strip()
USERNAME = os.environ.get('IG_USERNAME', 'dizayn_es')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def gizle(s):
    return s.replace(T, '***') if T else s


def call(path, data=None, method='POST'):
    if method == 'POST':
        body = urllib.parse.urlencode({**(data or {}), 'access_token': T}).encode()
        url = API + path
    else:
        body = None
        url = API + path + ('&' if '?' in path else '?') + 'access_token=' + urllib.parse.quote(T)
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=body, method=method), timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print('HATA', e.code, gizle(e.read().decode()))
        sys.exit(1)


def ig_kimligi():
    if os.environ.get('IG_USER_ID'):
        return os.environ['IG_USER_ID']
    # Sayfa anahtarı ise doğrudan sayfanın bağlı Instagram hesabı
    try:
        me = call('/me?fields=name,instagram_business_account{id,username}', method='GET')
        iba = me.get('instagram_business_account')
        if iba:
            print('Instagram hesabı:', '@' + iba.get('username', '?'), '(sayfa:', me.get('name'), ')')
            return iba['id']
    except SystemExit:
        pass
    # Kullanıcı anahtarı ise yönettiği sayfalardan @dizayn_es'i bul
    r = call('/me/accounts?fields=name,instagram_business_account{id,username}&limit=100', method='GET')
    for p in r.get('data', []):
        iba = p.get('instagram_business_account') or {}
        if iba.get('username', '').lower() == USERNAME.lower():
            print('Instagram hesabı:', '@' + iba['username'], '(sayfa:', p.get('name'), ')')
            return iba['id']
    print('HATA: @%s hesabı bu anahtarın erişebildiği Facebook Sayfalarında bulunamadı.' % USERNAME)
    print('Erişilebilen sayfalar:', [(p.get('name'), (p.get('instagram_business_account') or {}).get('username')) for p in r.get('data', [])])
    sys.exit(1)


def adres_hazir(u, turler=('image/jpeg', 'video/mp4')):
    for _ in range(30):
        try:
            with urllib.request.urlopen(urllib.request.Request(u + '?t=%d' % time.time(), method='HEAD'), timeout=20) as r:
                if r.status == 200 and any(t in r.headers.get('Content-Type', '') for t in turler):
                    print('dosya erişilebilir:', u)
                    return
        except Exception:
            pass
        time.sleep(10)
    print('HATA: dosya siteden açılmıyor (henüz yüklenmemiş olabilir):', u)
    sys.exit(1)


def var(dosya):
    return os.path.exists(os.path.join(ROOT, 'social', dosya))


def aciklama(*adlar):
    for a in adlar:
        p = os.path.join(HERE, 'aciklama', a)
        if os.path.exists(p):
            return open(p, encoding='utf-8').read().strip()
    return ''


def yayinla(ig, params):
    c = call(f'/{ig}/media', params)
    cid = c['id']
    print('kapsayıcı', cid)
    for _ in range(72):
        s = call(f'/{cid}?fields=status_code,status', method='GET')
        print(' durum:', s.get('status_code'))
        if s.get('status_code') == 'FINISHED':
            break
        if s.get('status_code') in ('ERROR', 'EXPIRED'):
            print('HATA', s)
            sys.exit(1)
        time.sleep(5)
    m = call(f'/{ig}/media_publish', {'creation_id': cid})
    p = call(f'/{m["id"]}?fields=permalink', method='GET')
    print('YAYINLANDI:', p.get('permalink') or m['id'])
    return p.get('permalink') or m['id']


def calistir(pid, ne):
    if not T:
        print('HATA: IG_ACCESS_TOKEN tanımlı değil')
        sys.exit(1)
    ig = ig_kimligi()
    sonuc = {}
    if ne in ('post', 'ikisi'):
        u = f'{BASE}/{pid}-post.jpg'
        adres_hazir(u)
        sonuc['post'] = yayinla(ig, {'image_url': u, 'caption': aciklama(f'{pid}.txt')})
    if ne in ('hikaye', 'ikisi'):
        if var(f'{pid}-hikaye.mp4'):
            u = f'{BASE}/{pid}-hikaye.mp4'
            adres_hazir(u)
            sonuc['hikaye'] = yayinla(ig, {'video_url': u, 'media_type': 'STORIES'})
        else:
            u = f'{BASE}/{pid}-hikaye.jpg'
            adres_hazir(u)
            sonuc['hikaye'] = yayinla(ig, {'image_url': u, 'media_type': 'STORIES'})
    if ne in ('reel', 'reelsadece'):
        u = f'{BASE}/{pid}-reel.mp4'
        adres_hazir(u)
        prm = {'video_url': u, 'media_type': 'REELS', 'share_to_feed': 'true',
               'caption': aciklama(f'{pid}-reel.txt', f'{pid}.txt')}
        if var(f'{pid}-kapak.jpg'):
            adres_hazir(f'{BASE}/{pid}-kapak.jpg')
            prm['cover_url'] = f'{BASE}/{pid}-kapak.jpg'
        sonuc['reel'] = yayinla(ig, prm)
        if ne == 'reel':
            sonuc['hikaye'] = yayinla(ig, {'video_url': u, 'media_type': 'STORIES'})
    print(json.dumps(sonuc, ensure_ascii=False))
    return sonuc


if __name__ == '__main__':
    if len(sys.argv) != 3 or sys.argv[2] not in ('post', 'hikaye', 'ikisi', 'reel', 'reelsadece'):
        print(__doc__)
        sys.exit(2)
    calistir(sys.argv[1], sys.argv[2])
