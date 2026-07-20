"""Clone image/icon assets from 1xlite mobile home into assets/images/mobile-home/."""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images" / "mobile-home"
CDN = "https://v3.traincdn.com"

MANIFEST: dict[str, list[tuple[str, str]]] = {
    "chrome": [
        ("logo-1xbet.svg", f"{CDN}/genfiles/cms/1-455/desktop/media_asset/15cb3adfd2e1c3a64a8c8a581810ed21.svg"),
        ("flag-my.svg", "https://1xlite-46272.pro/genfiles/cms/desktop/event-logo/935c13bb83bcf977a03490c485638465.svg"),
    ],
    "promos": [
        ("world-win-26.webp", f"{CDN}/genfiles/banners-admin-api/all/8ad346054aadafbfd1f0cd5074b000cb95x95cn.webp"),
        ("stand-for-victory.webp", f"{CDN}/genfiles/banners-admin-api/all/cbdbddf115bd8b482562e32910766d8a95x95cn.webp"),
        ("first-deposit-bonus.webp", f"{CDN}/genfiles/banners-admin-api/all/3b33cee90d73020af0802e8c7478fca1.webp"),
        ("higher-or-lower.webp", f"{CDN}/sfiles/games-images/ico-logo/mobi/127.webp"),
        ("esports-cashback.webp", f"{CDN}/genfiles/banners-admin-api/all/2c628dbb85486b5e3ed15248011e3f3e95x95cn.webp"),
        ("sport-single.webp", f"{CDN}/genfiles/banners-admin-api/all/d256128783a833a900ec94a7fbf168fe95x95crn.webp"),
        ("wnba-cashback.webp", f"{CDN}/genfiles/banners-admin-api/all/1e30e59cf2a0a4d03a7dcdb388ea648295x95crn.webp"),
        ("first-deposit-megabonus.webp", f"{CDN}/genfiles/banners-admin-api/all/973092098aa9c8f2585439b5fdc0a58c95x95cn.webp"),
        ("happy-monday.webp", f"{CDN}/genfiles/banners-admin-api/all/ad74eddd19e20acd18ae2ea189ee6ca595x95crn.webp"),
        ("chickpoint.webp", f"{CDN}/genfiles/banners-admin-api/all/b2537345ab0dc46ce864d4c438904c9395x95cn.webp"),
        ("go-rosh.webp", f"{CDN}/genfiles/banners-admin-api/all/b4a111381e60592e0b65872f1fd38a3795x95cn.webp"),
        ("crypto-freebet.webp", f"{CDN}/genfiles/banners-admin-api/all/633a00a0cf456ba095b9b9b861fdaf7795x95crn.webp"),
        ("aviator-thursday.webp", f"{CDN}/genfiles/banners-admin-api/all/43383b16c6a79e9ee9532e5963aa2fa595x95cn.webp"),
        ("1xtennis-challenge.webp", f"{CDN}/genfiles/banners-admin-api/all/12d6f88c4ad148e7483df219b95fbd3b95x95cn.webp"),
        ("ace-arena.webp", f"{CDN}/genfiles/banners-admin-api/all/39026d0be227ca2c335e66f3da8cc10395x95crn.webp"),
    ],
    "circles": [
        ("1xgames.webp", f"{CDN}/sfiles/games-images/game-previews/x2/games-no-faceless-circle.jpg"),
        ("world-flight-26.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-660-circle.jpg"),
        ("crash.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-371-circle.jpg"),
        ("crystal.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-249-circle.jpg"),
        ("fruit-cocktail.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-156-circle.jpg"),
        ("burning-hot.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-373-circle.jpg"),
        ("western-slot.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-169-circle.jpg"),
        ("solitaire.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-158-circle.jpg"),
        ("under-and-over-7.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-69-circle.jpg"),
        ("vampire-curse.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-456-circle.jpg"),
        ("crash-point.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-601-circle.jpg"),
        ("21.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-58-circle.jpg"),
        ("apple-of-fortune.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-138-circle.jpg"),
        ("spin-and-win.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-185-circle.jpg"),
        ("gems-odyssey.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-316-circle.jpg"),
        ("las-vegas.webp", f"{CDN}/sfiles/games-images/game-previews/x2/game-438-circle.jpg"),
    ],
    "casino": [
        ("wild-mining.webp", f"{CDN}/genfiles/third-party-files/5bf1c3bd-ff58-4c6e-b8a6-783e11730113_auto.webp"),
        ("soaked-by-seamen.webp", f"{CDN}/genfiles/cmsc-files/69163e82-ca3b-4f01-bab2-01ed5e9f7b9a_auto.webp"),
        ("sweet-bonanza-1000.webp", f"{CDN}/genfiles/third-party-files/aae8459b-7825-4378-8805-6669139138e2_auto.webp"),
        ("gates-of-olympus-1000.webp", f"{CDN}/genfiles/cmsc-files/4bf2fa58-d929-440b-a190-7d48630d6f80_auto.webp"),
        ("coin-craze-powerup.webp", f"{CDN}/genfiles/cmsc-files/68d5f01e-5d2a-4e1d-a595-e4896f495aca_auto.webp"),
        ("royalty-of-olympus.webp", f"{CDN}/genfiles/cmsc-files/b86856ef-1613-44b3-a408-bf3ed040ea3a_auto.webp"),
        ("elven-hold-and-win.webp", f"{CDN}/genfiles/cmsc-files/23b86bdc-d60f-49ac-82bb-f6ac7275f12b_auto.webp"),
        ("tiger-jackpots.webp", f"{CDN}/genfiles/cmsc-files/816a99ae-8823-4c4f-97a4-49b793253681_auto.webp"),
    ],
    "1xlive": [
        ("barcelona-blackjack.webp", f"{CDN}/genfiles/cmsc-files/b81a17d0-e159-40e2-a023-5d6eb5323121_auto.webp"),
        ("barcelona-baccarat.webp", f"{CDN}/genfiles/cmsc-files/2b33d032-283c-4399-ba23-6ed08852fae3_auto.webp"),
        ("roulette-x.webp", f"{CDN}/genfiles/cmsc-files/8330d57f-0b2e-454e-8954-d1bde60df38c_auto.webp"),
        ("golden-blackjack-2.webp", f"{CDN}/genfiles/cmsc-files/f371884d-b9dc-4d17-8223-1585feab12db_auto.webp"),
        ("japanese-speed-baccarat.webp", f"{CDN}/genfiles/cmsc-files/dd8f90f3-3906-4a35-9431-d5c1935f1faf_auto.webp"),
        ("golden-blackjack-vip.webp", f"{CDN}/genfiles/cmsc-files/2045b514-4f61-472d-bfe3-c7e3c888eae3_auto.webp"),
        ("football-studio.webp", f"{CDN}/genfiles/cmsc-files/4a7fdd58-b347-4725-8299-b9d53a27e30e_auto.webp"),
        ("mega-sic-bo.webp", f"{CDN}/genfiles/cmsc-files/f87ba56e-bde5-4a39-a464-1a6ee3f0e713_auto.webp"),
    ],
    "live-casino": [
        ("mega-roulette.webp", f"{CDN}/genfiles/third-party-files/8bc091c9-1203-48a6-91a2-a123d377f180_auto.webp"),
        ("venice-blackjack-vip.webp", f"{CDN}/genfiles/cmsc-files/d4496f47-adb0-4bd4-8331-412b89648594_auto.webp"),
        ("powerup-roulette.webp", f"{CDN}/genfiles/third-party-files/2b1ddd30-a767-4b67-9efd-a8e58b32d6e7_auto.webp"),
        ("funky-time.webp", f"{CDN}/genfiles/third-party-files/6d6fe4cf-4624-4aa3-b5c2-f81aff90fd6c_auto.webp"),
        ("red-door-roulette.webp", f"{CDN}/genfiles/third-party-files/9456525b-5bca-4823-b286-43bb70f7cbbb_auto.webp"),
        ("baccarat-b.webp", f"{CDN}/genfiles/third-party-files/ab5b61e4-4c81-40f5-84c2-4927ed48ec6b_auto.webp"),
        ("brazilian-roulette.webp", f"{CDN}/genfiles/third-party-files/decc1967-ae82-4ac7-b38d-43d298b084b1_auto.webp"),
        ("monopoly-live.webp", f"{CDN}/genfiles/third-party-files/c2d1f757-b543-4659-8b18-b4160f9bc7e7_auto.webp"),
    ],
    "tv-games": [
        ("andar-bahar.webp", f"{CDN}/genfiles/third-party-files/cb15bb52-24f4-4fb7-ac51-59d266e6edc5_auto.webp"),
        ("teen-patti.webp", f"{CDN}/genfiles/third-party-files/4f24d5b6-53a2-4d46-849f-c88bbd1dabb7_auto.webp"),
        ("wheelbet.webp", f"{CDN}/genfiles/third-party-files/9920ff90-0fe5-475e-853e-3469cb1ea6ad_auto.webp"),
        ("poker.webp", f"{CDN}/genfiles/third-party-files/514e97a1-26c1-4452-80ae-99cf9fea4a0b_auto.webp"),
        ("fast-keno.webp", f"{CDN}/genfiles/third-party-files/c14704c9-7837-4e29-8bb5-a640a67d3aae_auto.webp"),
        ("spin2wheels.webp", f"{CDN}/genfiles/third-party-files/cddeb646-54fe-4318-9dad-4429dc955ae7_auto.webp"),
        ("wheelbet-bonus.webp", f"{CDN}/genfiles/third-party-files/e8de7160-feaf-49f1-bff7-852f63cb2524_auto.webp"),
        ("roulette.webp", f"{CDN}/genfiles/third-party-files/a231224b-c2fc-4f91-aa7b-f367dea9a409_auto.webp"),
    ],
    "partners": [
        ("barcelona.webp", f"{CDN}/genfiles/cms/desktop/contact/db4c52e926e7b03338147d33b82d230e_55.webp"),
        ("serie-a.webp", f"{CDN}/genfiles/cms/desktop/contact/ef06ce460e77dd13700869ac149bef8a_55.webp"),
        ("psg.webp", f"{CDN}/genfiles/cms/desktop/contact/7282649bfc3a6bc2bef41cc6be98aa22_55.webp"),
        ("partner-4.webp", f"{CDN}/genfiles/cms/desktop/contact/cdcf791c308de6f623ed4671bea31e69_55.webp"),
        ("volleyball.webp", f"{CDN}/genfiles/cms/desktop/contact/6d53ab6b815e31ee8e8e5ab943f2c2f9_55.webp"),
        ("fiba.webp", f"{CDN}/genfiles/cms/desktop/contact/652c29dbcdafdcb75141c33e278e43ac_55.webp"),
        ("partner-7.webp", f"{CDN}/genfiles/cms/desktop/contact/a2062f80fb11acecf111ad365b0db258_55.webp"),
        ("partner-8.webp", f"{CDN}/genfiles/cms/desktop/contact/0144a599017f9204b530e9b88f173c6c_55.webp"),
        ("partner-9.webp", f"{CDN}/genfiles/cms/desktop/contact/843af0137a02860209f8cdbdc54b9ad2_55.webp"),
        ("partner-10.webp", f"{CDN}/genfiles/cms/desktop/contact/a3b84efd7a7dd100c17bea86acf84bc1_55.webp"),
        ("partner-11.webp", f"{CDN}/genfiles/cms/desktop/contact/ab9ad24df3f32a209e7fc87341f3a6cf_55.webp"),
        ("partner-12.webp", f"{CDN}/genfiles/cms/desktop/contact/bca5eb6bc28fb1d3f5c8a490312b329b_55.webp"),
        ("partner-13.webp", f"{CDN}/genfiles/cms/desktop/contact/cb34e364535e5a3968784fa8c2677857_55.webp"),
        ("partner-14.webp", f"{CDN}/genfiles/cms/desktop/contact/d3a7f93be4759317efb861b0c565b4db_55.webp"),
        ("partner-15.webp", f"{CDN}/genfiles/cms/desktop/contact/e701214e8a5cdc8c577f5a42f328db2e_55.webp"),
    ],
    "teams": [
        ("team-01.webp", f"{CDN}/resized/size16/sfiles/logo_teams/bbe4003f37a6444904c9486f84b0bcf0.webp"),
        ("team-02.webp", f"{CDN}/resized/size16/sfiles/logo_teams/ddae523b15aca610a7228a78af6e862b.webp"),
        ("team-03.webp", f"{CDN}/resized/size16/sfiles/logo_teams/4be0b91033748f288546ba60e0e12e2c.webp"),
        ("team-04.webp", f"{CDN}/resized/size16/sfiles/logo_teams/44825.webp"),
        ("team-05.webp", f"{CDN}/resized/size16/sfiles/logo_teams/0cbf0fc6e6c8bf0e3d0388fe982614d6.webp"),
        ("team-06.webp", f"{CDN}/resized/size16/sfiles/logo_teams/d51588b53dd998c70014fbb831fa79c1.webp"),
        ("team-07.webp", f"{CDN}/resized/size16/sfiles/logo_teams/d19f1e1800e37af558bd103f301d3f8f.webp"),
        ("team-08.webp", f"{CDN}/resized/size16/sfiles/logo_teams/44895.webp"),
        ("team-09.webp", f"{CDN}/resized/size16/sfiles/logo_teams/ce9105af9f83d0664e79ed7bc26da9cc.webp"),
        ("team-10.webp", f"{CDN}/resized/size16/sfiles/logo_teams/4119a7f3ca5347105c6189ab681fcf6b.webp"),
        ("team-11.webp", f"{CDN}/resized/size16/sfiles/logo_teams/e5df6a26070cecfc485f117bcd28ffcf.webp"),
        ("team-12.webp", f"{CDN}/resized/size16/sfiles/logo_teams/8a6d2d42b3a5a99005db915f4471064e.webp"),
        ("team-13.webp", f"{CDN}/resized/size16/sfiles/logo_teams/2a3fee00a3e5f02ecdaa1db649620e1d.webp"),
        ("team-14.webp", f"{CDN}/resized/size16/sfiles/logo_teams/80840b5dac7770d9f553a013503ba560.webp"),
        ("team-15.webp", f"{CDN}/resized/size16/sfiles/logo_teams/93a5d824fecee692d81bf508487129f8.webp"),
        ("team-16.webp", f"{CDN}/resized/size16/sfiles/logo_teams/80ee1c29c6c73e35f8b727d196c12b47.webp"),
        ("team-17.webp", f"{CDN}/resized/size16/sfiles/logo_teams/02992c90e8505580e12894dc662c1a6d.webp"),
        ("team-18.webp", f"{CDN}/resized/size16/sfiles/logo_teams/44b723bbd781e1fd7c5c3643d6ba1bff.webp"),
    ],
}

# Prefer jpg circle downloads saved as .jpg if CDN returns jpeg
CIRCLE_JPG = {name for name, url in MANIFEST["circles"] if url.endswith(".jpg")}

CTX = ssl.create_default_context()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 500:
        return True
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://1xlite-46272.pro/"})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=40) as resp:
            data = resp.read()
        if len(data) < 200:
            print(f"FAIL small {dest.name} ({len(data)}) {url}")
            return False
        dest.write_bytes(data)
        print(f"OK {dest.relative_to(ROOT)} ({len(data)})")
        return True
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL {dest.name}: {exc}")
        return False


def main() -> None:
    results: dict[str, dict[str, str]] = {}
    ok = fail = 0
    for folder, items in MANIFEST.items():
        results[folder] = {}
        for name, url in items:
            # Save circle x2 jpgs with correct extension
            out_name = name
            if folder == "circles" and url.endswith(".jpg"):
                out_name = re.sub(r"\.webp$", ".jpg", name)
            dest = OUT / folder / out_name
            if download(url, dest):
                ok += 1
                results[folder][name.replace(".webp", "").replace(".svg", "").replace(".jpg", "")] = str(
                    dest.relative_to(ROOT)
                ).replace("\\", "/")
            else:
                fail += 1
            time.sleep(0.05)

    manifest_path = OUT / "manifest.json"
    manifest_path.write_text(json.dumps({"ok": ok, "fail": fail, "files": results}, indent=2), encoding="utf-8")
    print(f"\nDone ok={ok} fail={fail} -> {manifest_path}")


if __name__ == "__main__":
    main()
