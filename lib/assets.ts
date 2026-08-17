/**
 * AHEFSS Canonical Asset Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * All production Cloudinary URLs live here. This is the SINGLE SOURCE OF TRUTH
 * for every image used across the project.
 *
 * HOW TO UPDATE:
 *  1. Add new images to the correct `public/assets/` subfolder
 *  2. Register them in `scratch/compress-and-upload.mjs` → ASSET_MAP
 *  3. Run: node scratch/compress-and-upload.mjs
 *  4. Copy the new URLs from scratch/cloudinary_manifest.json into this file
 *  5. If adding a new executive/event/project, also update lib/supabase.ts
 *
 * See docs/ASSETS_GUIDE.md for the full contributor workflow.
 *
 * PLACEHOLDER POLICY:
 *  null  → no photo available yet; getOptimizedImageUrl() shows the AHEFSS
 *          branded fallback SVG automatically — no broken images ever.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Brand ─────────────────────────────────────────────────────────────────────
/** Association logo — used in favicon, navbar, and footer */
export const LOGO_URL = 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720138/o4hfek0x4fp18iafb6yx.jpg';

/** Administration / pioneer session badge logo */
export const ADMIN_LOGO_URL = 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg';

/** Head of Department official portrait */
export const HOD_PHOTO_URL = 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832412/nmvay9dbofyruow1g3ys.jpg';

// ── President's Address Section ───────────────────────────────────────────────
/** Full-shot speech photo for the President's Address hero section */
export const PRESIDENT_SPEECH_PHOTO_URL = 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786814762/k3mjspji6w8ce99ei59p.jpg';

// ── Executive Headshots ────────────────────────────────────────────────────────
export const EXEC_PHOTOS: Record<string, string | null> = {
  president:                 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786814764/w6o7r1zhl7smu6w0cmj6.jpg',
  vicePresident:             'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786814765/ijqntlfu1nmarpvwtnhs.jpg',
  generalSecretary:          'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786958867/nevg84ckh6tunsdfcbx8.jpg',
  assistantGeneralSecretary: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832413/re39ljfulmfqghwnivzh.jpg',
  directorOfFinance:         'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832414/fyzpwolhfwwywd4ycfkr.jpg',
  welfareSecretary:          'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786958880/a6tdisicbntzq05y2k0v.jpg',
  pro:                       'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832415/wfutytwtyfvcxadbzmww.jpg',
  pro2:                      'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786814766/ya5qxuvsqkfgi3df1qhf.jpg',
  sportSecretary:            'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832417/j88kb6ar9u8ancacom2j.jpg',
  socialSecretary:           'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786832416/ozagid1sh2zazrh0s3ke.jpg',
  librarian:                 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833390/lfqv27kwdo17nqvssplw.jpg',
};

// ── Executives Flyer (also used as "Meet The Executives" event card) ──────────
export const EXECUTIVES_FLYER_URL = 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720149/m3tw3n6qamoiqobfuimn.jpg';

// ── Events ────────────────────────────────────────────────────────────────────

export const EVENT_MEET_EXECUTIVES = {
  flyer:   EXECUTIVES_FLYER_URL,
  gallery: [
    EXECUTIVES_FLYER_URL,
    EXEC_PHOTOS.president!,
    EXEC_PHOTOS.vicePresident!,
    EXEC_PHOTOS.generalSecretary!,
    EXEC_PHOTOS.assistantGeneralSecretary!,
    EXEC_PHOTOS.directorOfFinance!,
    EXEC_PHOTOS.welfareSecretary!,
    EXEC_PHOTOS.pro!,
    EXEC_PHOTOS.pro2!,
    EXEC_PHOTOS.sportSecretary!,
    EXEC_PHOTOS.socialSecretary!,
    EXEC_PHOTOS.librarian!,
  ],
};

export const EVENT_HODS_CUP = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720150/y1gutjfp0go7yrmtixhv.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720150/y1gutjfp0go7yrmtixhv.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720151/z6xuj1x2duvcglspqrys.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720155/xokqlxjwgdoondjkzdxd.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720157/nvo5gsm1ipm66yixs16d.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720160/zlszzhc2vsecx6ieufoy.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720162/lugik6x74reohvgq5d8a.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720165/daslx1rlslpzycf2yzhn.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720167/bcnnetzwqul3h5yrb4hu.jpg',
  ],
};

export const EVENT_CLEANUP = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720169/abdowjltzzuoy3c5pmy5.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720169/abdowjltzzuoy3c5pmy5.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720170/imelewvlhfcunk3awvte.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720172/rg3ohhlbhprlyxp6laxn.jpg',
  ],
};

export const EVENT_HIV_TESTING = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720174/lqgfvomkxxehiafkgg6w.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720174/lqgfvomkxxehiafkgg6w.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720175/jjbxm7cgiqbyt22stdqw.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720177/dbnhnoi3qsen6angdjac.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720179/r5npoyw3duiyknfadgpb.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720186/irblnfndbpxdfhmhkyaw.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720187/yced6d12pzl4jvbb0kke.jpg',
  ],
};

export const EVENT_FRESHER_ORIENTATION = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720189/cogk6ppm6onydyyawu8m.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720189/cogk6ppm6onydyyawu8m.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720191/fywvrulx1hwhhmaucxzi.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720193/kdtln0dfcjp24pvwnszd.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720197/rzgfbwe96wzrv58hc1el.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720202/f82xgtz8uqcvxg1gpypy.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720206/yh4vxdok7nschccz2yea.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001502/vqp3twtxykcatezy5uki.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001508/qfwxn1idexywdu3w23uy.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001518/jkqa9rcl5kltwza7jfhk.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001527/x5eyzk1g5oaxstqtcgov.jpg',
  ],
};

export const EVENT_MERCHANDISE = {
  // polo.png used as the feature flyer
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720487/bkueucaadjvnrojsxtlm.png',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720218/vqwdjxxmvh0cmlehc8ah.jpg', // IMG-20260314-WA0034
    // IMG-20260401-WA0035 had a network error — re-upload when possible
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720269/dsgt8e0g9um8vog7vbhl.jpg', // IMG_0321
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720271/ahkvpcpjgtpj4g5rjaba.jpg', // IMG_0404
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720274/vw6fgdbcjwxp2vuzevho.jpg', // IMG_0405
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720277/hb7plsmkb7eouf7m9abi.jpg', // IMG_20260522_135530
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720280/jfmun0gg3xb3ihplgpis.jpg', // IMG_20260522_135627
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720286/qsagccsufub7lcv74utj.png', // bottle 2
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720294/tnf8ivh71mrbgqibcd0l.png', // bottle
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720297/uccyrwwhewmzllpsfgbi.png', // cap black
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720303/z1au5aov6jiuhlluckjv.png', // cap white
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720399/b1jj8uvr07swsu8aqnej.png', // mug
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720412/tpnjwfscub7xny7w97od.png', // pen
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720447/vyqetcqowdxy0nrcwl64.png', // polo black
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720487/bkueucaadjvnrojsxtlm.png', // polo
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720495/vgqals4kxxlpyqd7ybmd.png', // shirt black
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720507/kapoxbfk0z6illhb1pee.png', // shirt white
  ],
};

export const EVENT_SKILL_ACQUISITION = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720509/sauudp0cidiyrlcglg8g.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720509/sauudp0cidiyrlcglg8g.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720517/fgiqmbyfqtpwzvroslgn.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720526/bf2j3z806juybuhgnkgf.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720530/mts7cwqxx5xikx0mrmma.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720534/pqj4u42wsc56okxrswqw.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720539/u6kfbvhvx4axp2olsqen.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720547/j9ejveuck9rkkd5ureyl.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720555/e4qvzoyhtzfysgcebkyf.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720564/i2hxe1mhfstd4fdk1vi8.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720573/ne6xw3d4eitdpfnpsejs.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720578/ymml7j9nzdrorc2bwafr.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720584/wofhnvzekxrylcjsxcez.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720596/dz8srqzmgkqv1i0zrrkz.jpg',
  ],
};

// ── Virtual Events ─────────────────────────────────────────────────────────────

export const EVENT_VIRTUAL_ANCHOR = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720603/x07rnyiii4noby6rvmh3.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720603/x07rnyiii4noby6rvmh3.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720610/hawr4owr3ltprsm6e8fm.jpg',
  ],
};

export const EVENT_VIRTUAL_WEYESDAY = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833971/pfnuxp9dkrmofgdzkjid.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833971/pfnuxp9dkrmofgdzkjid.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833972/xkueuwgri6abuqbnsyte.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833973/jehnxrzcvuf45jwtujso.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833974/ejcrczksngxz6wmojpz4.jpg',
  ],
};

export const EVENT_VIRTUAL_FINANCE_ELEVATION = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720613/qkzxqbcz6ki9q4piiy0l.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720613/qkzxqbcz6ki9q4piiy0l.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720616/cqqsbmgj7wp4b4ekpw2o.jpg',
  ],
};

export const EVENT_VIRTUAL_MENTAL_HEALTH_WEBINAR = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833975/yrvosjfllrcdzh4vr7o0.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833975/yrvosjfllrcdzh4vr7o0.jpg',
  ],
};

export const EVENT_VIRTUAL_MENTAL_HEALTH_AWARENESS = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833976/rfzc7ij658zaamp1nexi.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833976/rfzc7ij658zaamp1nexi.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833977/a9m7b8mnobncmj5q4dxl.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833978/o5yzzm6vlp7tydfsoej1.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833979/r4ae0zyaaj3dsjidgxwb.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833980/cplxoaipxw2xmy3tffi5.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833981/ob9mkp1daolytrc9djhn.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833983/agcozhaqgm4axod4voy2.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786833984/mqd77ipuugssgupxs2fp.jpg',
  ],
};

export const EVENT_ORIENTATION_PROGRAM = {
  flyer: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720657/ymjxlavvwwobv8t0uczh.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720657/ymjxlavvwwobv8t0uczh.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720660/kysu1nztelbdxosxgpuw.jpg',
  ],
};

// ── Projects ───────────────────────────────────────────────────────────────────

export const PROJECT_DEPT_SIGNAGE = {
  cover: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720666/grynsm8lc9lo7llr8v8k.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720666/grynsm8lc9lo7llr8v8k.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001744/ti487bwo2jijyjhm5cyq.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720673/ajcxeyb0mkl6qx2oeny6.png',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720681/qd2ruvjdr86qapnxbsck.png',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720687/zmovcrmrisead1fnawsl.png',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720691/vx1c0si8v13zbejgh1ss.png',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720697/eh3yasxzjpvxcorwynoi.png',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720730/kvhnlaknb1fy9ogtqeiy.png',
  ],
};

export const PROJECT_DIGITAL_PORTAL = {
  cover: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786976589/yal4a3tcpvwlhsfmaql9.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786976589/yal4a3tcpvwlhsfmaql9.jpg',
  ],
};

export const PROJECT_BUILDING_RENOVATION = {
  cover: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001535/uqlcxeyh3o8erfo93tpx.jpg',
  gallery: [
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001535/uqlcxeyh3o8erfo93tpx.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001550/isporjld1gchvxk4ecfa.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001573/xgenzh8akw6qilncyero.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001594/ndwfeod1o6fbylidqlzt.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001638/axqbshn4krhsb5lxxohs.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001686/qbbfetshbux39ytjpkzd.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001703/dbfdy7inhlnueth9rkhr.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001721/gmwjz0y9b3ukspay0wjj.jpg',
    'https://res.cloudinary.com/q9jb9wvk/image/upload/v1787001735/ug3opp2z6whc6etyxsdy.jpg',
  ],
};
