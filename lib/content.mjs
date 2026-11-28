// Evergreen content: the explainer, the people, the builders showcase and the editorial policy.
// Every fact here is taken from a public source linked next to it. Text is bilingual: { en, tr }.

export const LINKS = {
  site: 'https://www.getoptimum.xyz/',
  docs: 'https://docs.getoptimum.xyz/',
  blog: 'https://www.getoptimum.xyz/blog',
  hub: 'https://hub.getoptimum.xyz',
  console: 'https://console.getoptimum.xyz/login',
  discord: 'https://discord.gg/getoptimum',
  x: 'https://x.com/get_optimum',
  telegram: 'https://t.me/+I1fmgPCPO5IxNzZl',
  youtube: 'https://www.youtube.com/@getoptimum',
  github: 'https://github.com/getoptimum',
  team: 'https://www.getoptimum.xyz/team',
  careers: 'https://jobs.ashbyhq.com/optimum',
};

// The explainer, one idea per section, written for someone who has never run a node.
export const LEARN = [
  {
    id: 'short',
    h: { en: 'The short version', tr: 'Kısaca' },
    p: {
      en: ['Optimum makes blockchain data move faster between the machines that run a network. Its first product, mump2p, gets each new Ethereum block to validators sooner than the default route does.',
        'It does not change Ethereum itself. Operators run a small extra program next to their node, and blocks start arriving earlier.'],
      tr: ["Optimum, bir ağı çalıştıran makineler arasında blok zinciri verisinin daha hızlı taşınmasını sağlıyor. İlk ürünü mump2p, her yeni Ethereum bloğunu doğrulayıcılara varsayılan yoldan daha erken ulaştırıyor.",
        "Ethereum'un kendisini değiştirmiyor. Operatörler düğümlerinin yanında küçük ek bir program çalıştırıyor ve bloklar daha erken gelmeye başlıyor."],
    },
    src: [['Optimum docs: introduction', 'https://docs.getoptimum.xyz/']],
  },
  {
    id: 'why',
    h: { en: 'Why a few hundred milliseconds matter', tr: 'Birkaç yüz milisaniye neden önemli' },
    p: {
      en: ['Ethereum makes a block every 12 seconds, and validators have to vote on it quickly. A validator that sees the block late can miss the vote or vote on the wrong thing, and that costs rewards. Across a market of staked ETH worth around 100 billion dollars, small delays add up.',
        'That is the idea behind the slogan the team uses: speed is money.'],
      tr: ["Ethereum her 12 saniyede bir blok üretiyor ve doğrulayıcıların bu blok için hızlıca oy vermesi gerekiyor. Bloğu geç gören doğrulayıcı oylamayı kaçırabilir ya da yanlış bloğa oy verebilir; bu da ödül kaybı demek. Yaklaşık 100 milyar dolarlık stake edilmiş ETH piyasasında küçük gecikmeler büyük toplamlara dönüşüyor.",
        "Ekibin kullandığı slogan da buradan geliyor: hız paradır (speed is money)."],
    },
    src: [['Optimum blog: Effects of latency reduction on ETH staking revenue', 'https://www.getoptimum.xyz/blog/optimizing-a-100b-market-effects-of-latency-reduction-on-eth-staking-revenue']],
  },
  {
    id: 'rlnc',
    h: { en: 'How it works, without the math', tr: 'Matematiksiz nasıl çalışıyor' },
    p: {
      en: ['Normally a block travels as a whole, passed from peer to peer, and every peer waits for the full copy before sending it on.',
        'mump2p cuts the block into pieces and mixes them into coded pieces with a technique called Random Linear Network Coding (RLNC). Think of each coded piece as one equation about the block: once a node holds enough independent equations, from any senders in any order, it can solve for the whole block. Nodes in the middle can also mix fresh pieces from what they already hold, without waiting for the full block.',
        'RLNC was co-invented at MIT by Optimum co-founder and CEO Muriel Médard.'],
      tr: ["Normalde bir blok bütün halinde eşten eşe aktarılır ve her eş, bloğu iletmeden önce tam kopyasının gelmesini bekler.",
        "mump2p bloğu parçalara ayırıyor ve Rastgele Doğrusal Ağ Kodlaması (RLNC) denen bir teknikle bu parçaları karıştırarak kodlu parçalar üretiyor. Her kodlu parçayı blok hakkında bir denklem gibi düşün: bir düğüm yeterli sayıda bağımsız denkleme sahip olduğunda, kimden ve hangi sırayla geldiğine bakmadan bloğun tamamını çözebiliyor. Aradaki düğümler de tam bloğu beklemeden elindeki parçalardan yeni karışımlar üretebiliyor.",
        "RLNC, Optimum'un kurucu ortağı ve CEO'su Muriel Médard tarafından MIT'de ortak olarak icat edildi."],
    },
    src: [['Optimum docs: mump2p protocol', 'https://docs.getoptimum.xyz/docs/learn/overview/p2p'], ['Optimum team page and timeline', 'https://www.getoptimum.xyz/team']],
  },
  {
    id: 'where',
    h: { en: 'What actually runs', tr: 'Sahada ne çalışıyor' },
    p: {
      en: ['An operator runs a gateway: one container on a host next to the beacon node. The gateway acts as a peer of the consensus client and never receives validator keys. Prysm, Lighthouse, Teku, Nimbus and Lodestar are supported, and the usual gossip route keeps running alongside it, so the gateway adds a faster path instead of replacing one.',
        'People without validators will be able to run a stream only gateway and serve the block stream to their own apps, once Optimum turns on consumer tokens for every account.'],
      tr: ["Operatör bir gateway çalıştırıyor: beacon düğümünün yanındaki bir sunucuda tek bir konteyner. Gateway, konsensüs istemcisinin bir eşi gibi davranıyor ve doğrulayıcı anahtarlarını asla almıyor. Prysm, Lighthouse, Teku, Nimbus ve Lodestar destekleniyor; alışılmış gossip yolu da yanında çalışmaya devam ediyor. Yani gateway bir yolu değiştirmiyor, ek olarak daha hızlı bir yol açıyor.",
        "Doğrulayıcısı olmayanlar da blok akışını almak için yalnızca akış (stream only) modunda gateway çalıştırabiliyor."],
    },
    src: [['Optimum docs: introduction', 'https://docs.getoptimum.xyz/'], ['Gateway docs: connecting your CL client', 'https://getoptimum.github.io/optimum-gateway/versions/latest/cl-clients'], ['Optimum docs: block stream', 'https://docs.getoptimum.xyz/operate/block-stream']],
  },
  {
    id: 'products',
    h: { en: 'Signal and Accelerate', tr: 'Signal ve Accelerate' },
    p: {
      en: ['Signal hands blocks from the Optimum mesh to your beacon node so your validators receive them sooner. It is free for Ethereum validators: operators sign up in the Console, start the gateway, and Optimum switches Signal on for the account.',
        'Accelerate goes further for large operators: it recommends a bid cutoff for the MEV sidecar they already run, based on the slots their validators proposed. It needs at least 200 active mainnet validators and has to be enabled by Optimum.'],
      tr: ["Signal, Optimum ağındaki blokları beacon düğümüne aktararak doğrulayıcıların onları daha erken almasını sağlıyor. Ethereum doğrulayıcıları için ücretsiz.",
        "Accelerate büyük operatörler için bir adım daha ileri gidiyor: doğrulayıcılarının önerdiği slotlara bakarak zaten çalıştırdıkları MEV sidecar için bir teklif kesim zamanı (bid cutoff) öneriyor. En az 200 aktif ana ağ doğrulayıcısı gerekiyor ve Optimum tarafından açılması lazım."],
    },
    src: [['Optimum docs: Signal', 'https://docs.getoptimum.xyz/signal/what-signal-does'], ['Optimum docs: Accelerate', 'https://docs.getoptimum.xyz/accelerate/what-accelerate-does'], ['Optimum blog, 20 Oct 2026', 'https://www.getoptimum.xyz/blog/3-4b-total-value-boosted-mump2p-is-live-on-ethereum-mainnet']],
  },
  {
    id: 'flex',
    h: { en: 'What comes next: Flexnodes', tr: 'Sırada ne var: Flexnode’lar' },
    p: {
      en: ['Flexnodes are extra nodes that add bandwidth and shorten distances in the network. They receive block data through a gateway and send more coded pieces to the validators that need them. Operators would be paid through a Latency Marketplace, where validators pay for the pieces they need.',
        'The early rollout is limited to existing validator partners, with wider community participation planned after testing.'],
      tr: ["Flexnode'lar ağa bant genişliği ekleyen ve mesafeleri kısaltan ek düğümler. Blok verisini bir gateway üzerinden alıyor ve ihtiyacı olan doğrulayıcılara daha fazla kodlu parça gönderiyorlar. Operatörler, doğrulayıcıların ihtiyaç duydukları parçalar için ödeme yaptığı bir Gecikme Pazarı (Latency Marketplace) üzerinden kazanacak.",
        "İlk aşama mevcut doğrulayıcı ortaklarla sınırlı; daha geniş topluluk katılımı testlerden sonra planlanıyor."],
    },
    src: [['Optimum blog: Flexnodes, 20 Jan 2026', 'https://www.getoptimum.xyz/blog/flexnodes-a-global-network-of-data-accelerators']],
  },
  {
    id: 'evidence',
    h: { en: 'What the evidence says so far', tr: 'Şu ana kadarki kanıtlar ne diyor' },
    p: {
      en: ["Optimum's own figures, published live on its Hub, show blocks reaching nodes faster than the default gossip route in most slots. Outside checks are more mixed: Lido’s PERCH evaluation on the Hoodi testnet found blocks arriving about 407 ms sooner at the 95th percentile and wrong head votes down 45%, while an independent StereumLabs study on 36 mainnet nodes with an early gateway build found some clients faster and none statistically significant. Optimum replied that its network-wide acceleration was switched on during that study, which blurred the comparison.",
        'Propagator labels every number with who measured it. The Pulse page explains each metric.'],
      tr: ["Optimum'un Hub'da canlı yayınladığı kendi verileri, slotların çoğunda blokların düğümlere varsayılan gossip yolundan daha hızlı ulaştığını gösteriyor. Dış testler daha karışık: Lido'nun Hoodi test ağındaki değerlendirmesi blokların 95. yüzdelikte yaklaşık 407 ms daha erken geldiğini buldu; StereumLabs'in erken bir gateway sürümüyle 36 ana ağ düğümünde yaptığı bağımsız test ise bazı istemcilerde hızlanma gördü ama hiçbirinde istatistiksel olarak anlamlı sonuç çıkmadı.",
        "Propagator her rakamın yanında onu kimin ölçtüğünü yazıyor. Nabız sayfası her ölçümü açıklıyor."],
    },
    src: [['Optimum Hub', 'https://hub.getoptimum.xyz'], ['Lido research forum: PERCH thread', 'https://research.lido.fi/t/perch-request-for-node-operators-to-run-and-test-optimum-mump2p/11786'], ['crypto.news, 10 Nov 2026', 'https://crypto.news/ethereum-p2p-protocol-mump2p-faster-block-delivery/']],
  },
];

export const GLOSSARY = [
  ['RLNC', { en: 'Random Linear Network Coding. Data is sent as mixed, coded pieces; any big enough set of them rebuilds the original.', tr: 'Rastgele Doğrusal Ağ Kodlaması. Veri karıştırılmış kodlu parçalar halinde gönderilir; yeterince büyük herhangi bir parça kümesi aslını yeniden kurar.' }],
  ['mump2p', { en: "Optimum's peer to peer protocol built on RLNC. The Optimum network is the set of gateways that speak it.", tr: "Optimum'un RLNC üzerine kurulu eşten eşe protokolü. Optimum ağı, bu protokolü konuşan gateway'lerin bütünüdür." }],
  ['Gossipsub', { en: "The default way Ethereum nodes pass blocks to each other (libp2p gossipsub). mump2p runs next to it.", tr: "Ethereum düğümlerinin blokları birbirine aktardığı varsayılan yöntem (libp2p gossipsub). mump2p onun yanında çalışır." }],
  ['Gateway', { en: 'The container an operator runs beside a beacon node. It never holds validator keys.', tr: 'Operatörün beacon düğümünün yanında çalıştırdığı konteyner. Doğrulayıcı anahtarlarını asla tutmaz.' }],
  ['Slot', { en: 'A 12 second window in which one Ethereum block can be proposed.', tr: 'İçinde bir Ethereum bloğunun önerilebildiği 12 saniyelik zaman dilimi.' }],
  ['Attestation', { en: "A validator's vote on the block it saw. Late or wrong votes cost rewards.", tr: 'Doğrulayıcının gördüğü blok için verdiği oy. Geç ya da yanlış oy ödül kaybettirir.' }],
  ['p95', { en: 'The 95th percentile: 95 out of 100 cases are at or below this value.', tr: '95. yüzdelik: 100 durumdan 95’i bu değerde ya da altında kalır.' }],
  ['Hoodi', { en: "An Ethereum test network. mump2p ran there before mainnet.", tr: 'Bir Ethereum test ağı. mump2p ana ağdan önce burada çalıştı.' }],
  ['Xatu', { en: "ethPandaOps' open network monitoring data, used as the reference for the default route.", tr: "ethPandaOps'un açık ağ izleme verisi; varsayılan yol için referans olarak kullanılıyor." }],
  ['Flexnode', { en: 'An extra node that adds bandwidth and sends more coded pieces to validators. Planned, partners first.', tr: 'Ağa bant genişliği ekleyip doğrulayıcılara daha fazla kodlu parça gönderen ek düğüm. Planlanıyor, önce ortaklarla.' }],
];

// From getoptimum.xyz/team (only these five people are listed publicly there).
export const TEAM = {
  founders: [
    { name: 'Prof. Muriel Médard', role: { en: 'Co-founder and CEO', tr: 'Kurucu ortak ve CEO' }, bio: { en: 'NEC Chair at MIT EECS and co-inventor of RLNC. 2026 IEEE Richard W. Hamming Medal.', tr: "MIT EECS'te NEC Kürsüsü sahibi ve RLNC'nin ortak mucidi. 2026 IEEE Richard W. Hamming Madalyası." }, img: '/assets/people/medard.webp', links: [['X', 'https://x.com/MurielMedard'], ['LinkedIn', 'https://www.linkedin.com/in/murielmedard/']] },
    { name: 'Kent Lin', role: { en: 'Co-founder', tr: 'Kurucu ortak' }, bio: { en: 'Leads business development, tokenomics and fundraising, and appears as COO in Optimum’s videos. Previously a partner at GSRV and president of the Harvard Blockchain Club.' }, img: '/assets/people/lin.webp', links: [['X', 'https://x.com/kentlinyy'], ['LinkedIn', 'https://linkedin.com/in/kentyeyanglin']] },
    { name: 'Dr. Kishori Konwar', role: { en: 'Co-founder', tr: 'Kurucu ortak' }, bio: { en: 'Distributed systems, coding theory and AI. Previously a senior engineer and scientist at Meta, a network coding postdoc at MIT and a quant at Goldman Sachs.' }, img: '/assets/people/konwar.webp', links: [['LinkedIn', 'https://linkedin.com/in/kishorikonwar']] },
  ],
  advisors: [
    { name: 'Prof. Nancy Lynch', bio: { en: "Former NEC Chair at MIT. Optimum's team page credits her with the first mathematical proof of Byzantine fault tolerance (1985) and the DLS algorithm (1988) that Tendermint and Ethereum's consensus protocols descend from." } },
    { name: 'Prof. Sriram Viswanath', bio: { en: 'IIT Madras, Caltech and a Stanford PhD. NSF CAREER Award recipient, researching information theory, wireless communications and network science.' } },
  ],
  // Named in Optimum's own posts and videos, not on the team page.
  wider: [
    { name: 'Har Preet Singh', role: { en: 'CTO' }, src: ['Optimum on X, 27 Oct 2026', 'https://x.com/get_optimum/status/2115120747782005213'], x: 'h_p_sing' },
    { name: 'Sajida Zouarhi', role: { en: 'Chief Product Officer' }, src: ['Optimum on YouTube', 'https://www.youtube.com/watch?v=b-cMYd_gCrk'] },
    { name: 'Slobodan Sudaric-Hefner', role: { en: 'Chief Economist' }, src: ['Optimum on X, 26 Oct 2026', 'https://x.com/get_optimum/status/2114522459991052509'] },
    { name: 'Swarnabha Sinha', role: { en: 'Developer relations' }, src: ['Optimum on X, 27 Oct 2026', 'https://x.com/get_optimum/status/2115120747782005213'], x: 'SinhaSwarnabha' },
    { name: 'Moritz Grundei', role: { en: 'Research engineer' }, src: ['Optimum on YouTube', 'https://www.youtube.com/watch?v=IcAzcJ1hjpQ'] },
  ],
  // Community roles as they work in the Optimum Discord.
  community: [
    { name: 'Pegasus', role: { en: 'Mumbassador, the community helper in the Optimum Discord', tr: "Mumbassador, Optimum Discord'unda topluluğa yardım eden kişi" } },
    { name: 'Flash', role: { en: 'Community manager and main point of contact in the Optimum Discord since November; also runs the weekly role distribution.', tr: 'Kasım’dan beri Optimum Discord’unun topluluk yöneticisi ve ana iletişim kişisi; haftalık rol dağıtımını da yürütüyor.' } },
  ],
  ladder: [
    ['Optimum Newbie', { en: 'Where everyone starts.', tr: 'Herkesin başladığı yer.' }],
    ['Observer', { en: 'The next step for people who stick around.', tr: 'Kalıcı olanlar için bir sonraki adım.' }],
    ['Refined', { en: 'For members who keep showing up.', tr: 'Sürekli katkı veren üyeler için.' }],
    ['Optimized', { en: 'For active members who post and help.', tr: 'Paylaşan ve yardım eden aktif üyeler için.' }],
    ['Chronicler', { en: 'For creative members who make art and content.', tr: 'Sanat ve içerik üreten yaratıcı üyeler için.' }],
  ],
  timeline: [
    ['2003', { en: 'RLNC invented at MIT by Muriel Médard and colleagues.', tr: "RLNC, Muriel Médard ve ekibi tarafından MIT'de icat edildi." }],
    ['2006', { en: 'Foundational RLNC paper in IEEE Transactions on Information Theory.', tr: 'Temel RLNC makalesi IEEE Transactions on Information Theory’de yayımlandı.' }],
    ['2024', { en: 'Optimum founded by Médard, Konwar and Lin.', tr: 'Optimum, Médard, Konwar ve Lin tarafından kuruldu.' }],
    ['Apr 2025', { en: '11 million dollar seed round led by 1kx.', tr: '1kx liderliğinde 11 milyon dolarlık tohum yatırımı.' }],
    ['2025', { en: 'Private testnet with 40 validator partners, then the Hoodi testnet.', tr: '40 doğrulayıcı ortakla özel test ağı, ardından Hoodi test ağı.' }],
    ['23 Oct 2026', { en: 'Lido’s PERCH evaluation on Hoodi ends: blocks 407 ms sooner at p95, wrong head votes down 45%.' }],
    ['20 Oct 2026', { en: 'mump2p live on Ethereum mainnet.', tr: 'mump2p Ethereum ana ağında yayında.' }],
  ],
};

// Builders showcase. Order on the page rotates daily so nobody is permanently first.
// own: true marks projects made by Propagator's editor, disclosed on the card.
// The builder of the week: one community project shown large on the front page and the builders page.
// The plan runs Monday to Monday; `from` is the first day each pick is featured. When the plan runs out, the page keeps
// rotating by itself through community projects (never the editor's own), one per week, using each project's own line.
export const FEATURED = [
  { id: 'optimumpulse', from: '2026-11-20', why: { en: 'Following Optimum used to mean ten tabs: X, Discord, the blog, the Hub, interviews. Süleyman put all of it on one page that updates through the day, in English and Turkish, so anyone can catch up in a minute.' } },
  { id: 'opticard', from: '2026-11-23', why: { en: 'Half of it is a personality quiz, half a test of how well you know the community, and the result is a card people actually post. A whole timeline of Opti Cards says it worked.' } },
  { id: 'infinityrun', from: '2026-11-30', why: { en: 'Mmorgs drew six characters for Optimum and then gave each of them a run and a power of their own. Few community games start from original art; this one does.' } },
  { id: 'networklab', from: '2026-12-07', why: { en: 'Zunaira turned her own study notes into nine modules with quizzes and a simulator. If mump2p still feels abstract, this is the gentlest way in.' } },
  { id: 'linklab', from: '2026-12-14', why: { en: 'A quiet puzzle about getting a signal through a network, which is the whole idea of Optimum in one screen. It plays well on a phone, one level at a time.' } },
  { id: 'pitwall', from: '2026-12-21', why: { en: 'WeLoSu treats block propagation like a race and reads it from public Xatu data, with an honest mump2p estimate beside the real numbers.' } },
  { id: 'blockarena', from: '2026-12-28', why: { en: 'Keng SiRô hid an Optimum explainer inside boss fights and linked his world to another builder\'s city through a portal. Community projects talking to each other is rare.' } },
  { id: 'optimumworld', from: '2027-01-04', why: { en: 'baised built a city you can walk through, with the team and community members inside it. It is the closest thing to visiting Optimum.' } },
  { id: 'runner', from: '2027-01-11', why: { en: 'A simple platform game with real leaderboards, built to be played between role calls and to bring friends back every week.' } },
  { id: 'optimumlab', from: '2027-01-18', why: { en: 'Five simulations that do the actual coding math in the browser. When someone asks how RLNC works, send them here.' } },
];

const ISO = (d) => new Date(d + 'T12:00:00Z').getTime();
// the pick for a given day: the latest planned pick that has started, or after the plan ends, a weekly rotation
export function featuredFor(today, builders) {
  const started = FEATURED.filter((f) => f.from <= today && builders.some((b) => b.id === f.id));
  const last = started[started.length - 1];
  if (last && (ISO(today) - ISO(last.from)) / 864e5 < 7) return last;
  if (!last) return null;
  // projects never planned go first, so new work gets its turn; then the plan again from the top
  const planned = FEATURED.map((f) => f.id);
  const order = [...builders.filter((b) => !b.own && !planned.includes(b.id)).map((b) => b.id), ...planned.filter((id) => builders.some((b) => b.id === id && !b.own))];
  const weeks = Math.floor((ISO(today) - ISO(last.from)) / (7 * 864e5));
  const id = order[(weeks - 1) % order.length];
  return FEATURED.find((f) => f.id === id) || { id, from: today, why: null };
}

export const BUILDERS = [
  { id: 'pitwall', name: 'Optimum Pit Wall', by: 'WeLoSu', handle: 'io_enthusiast', url: 'https://optimum-pitwall.netlify.app', post: 'https://x.com/io_enthusiast/status/2119720543163437453', kind: 'dashboard', added: '2026-11-20',
    what: { en: 'Race style timing for Ethereum block propagation, built on ethPandaOps Xatu open data, with an estimated mump2p what if car.', tr: 'Ethereum blok yayılımı için yarış tarzı zamanlama ekranı; ethPandaOps Xatu açık verisiyle kurulmuş, tahmini bir mump2p "ya olsaydı" aracı da var.' } },
  { id: 'optimumlab', name: 'Optimum Lab', by: 'Süleyman', handle: 'slymnogunc', url: 'https://optimumlab.netlify.app', kind: 'simulator', added: '2026-11-20',
    what: { en: 'Five interactive simulations of propagation, RLNC coding and DeRAM memory, with real GF(2^8) math and a shareable result card.', tr: 'Yayılım, RLNC kodlaması ve DeRAM belleği üzerine beş etkileşimli simülasyon; gerçek GF(2^8) matematiği ve paylaşılabilir sonuç kartıyla.' } },
  { id: 'runner', name: 'Optimum Runner', by: 'cryptoperseus', handle: 'cryptoperseus_', url: 'https://optimumrunner.netlify.app', kind: 'game', added: '2026-11-20',
    what: { en: 'A platform game set in the Optimum world, with Google sign in and global and weekly leaderboards.', tr: 'Optimum dünyasında geçen bir platform oyunu; Google ile giriş, genel ve haftalık liderlik tablosuyla.' } },
  { id: 'optimumpulse', name: 'Optimum Pulse', by: 'Süleyman', handle: 'slymnogunc', url: 'https://optimum-pulse.netlify.app', post: 'https://x.com/slymnogunc/status/2123462295690907857', kind: 'dashboard', added: '2026-11-20',
    what: { en: 'Everything Optimum in one place, updated through the day: breaking news, live Hub numbers, posts from X, Discord and YouTube, and daily post ideas, in English and Turkish.', tr: 'Gün boyu güncellenen, Optimum’la ilgili her şey tek yerde: son dakika haberleri, canlı Hub rakamları, X, Discord ve YouTube paylaşımları ve günlük paylaşım fikirleri; İngilizce ve Türkçe.' } },
  { id: 'blockarena', name: 'Block Arena', by: 'Keng SiRô', handle: 'dcityuknow', url: 'https://dcityuknow.github.io/from0tohero/', post: 'https://x.com/dcityuknow/status/2122621465417613789', kind: 'game', added: '2026-11-20',
    what: { en: "A voxel shooter made for the Optimum community: climb four floors, beat bosses whose dialogue explains Optimum, and play with friends using a room code. Its Space Rift portal leads into Optimum World.", tr: "Optimum topluluğu için yapılmış voksel bir nişancı oyunu: dört katı tırman, diyalogları Optimum’u anlatan boss’ları yen ve oda koduyla arkadaşlarınla oyna. Space Rift portalı seni Optimum World’e götürüyor." } },
  { id: 'optimumworld', name: 'Optimum World', by: 'baised', handle: 'baisedit', url: 'https://crpbase.github.io/optimum_world/', post: 'https://x.com/baisedit/status/2108562534152196233', kind: 'game', added: '2026-11-20',
    what: { en: "A walkable 3D city built around Optimum: meet the team, take on quests and mini games starring community members, and take a photo. Block Arena’s Space Rift portal drops players here.", tr: "Optimum etrafında kurulmuş, içinde gezilebilen 3B bir şehir: ekiple tanış, topluluk üyelerinin rol aldığı görevleri ve mini oyunları oyna, bir de fotoğraf çek. Block Arena’daki Space Rift portalı oyuncuları buraya bırakıyor." } },
  { id: 'gossipsiege', name: 'Gossip Siege', by: 'ecamli', handle: 'ekinoks_26', url: 'https://gossipsiege.xyz', kind: 'game', added: '2026-11-20', own: true,
    what: { en: 'A tower defense game about block propagation, with a study guide of sourced quiz questions and a shared leaderboard.', tr: 'Blok yayılımı üzerine bir kule savunma oyunu; kaynaklı soru rehberi ve ortak liderlik tablosuyla.' } },
  { id: 'aethlos', name: 'Aethlos', by: 'Capzz', handle: 'Capzzlord', member: 'capzz', url: 'https://aethlos.onrender.com', post: 'https://x.com/Capzzlord/status/2109607933654769759', kind: 'game', added: '2026-10-12',
    what: { en: 'A live head to head tournament: two players meet in a quiz, a riddle and a word round, fast answers score more, and anyone can watch the bracket.', tr: 'Canlı, bire bir bir turnuva: iki oyuncu bilgi, bilmece ve kelime turlarında karşılaşıyor, hızlı cevap daha çok puan getiriyor ve herkes eşleşmeleri izleyebiliyor.' } },
  { id: 'opticard', name: 'Opti Card', by: 'Capzz', handle: 'Capzzlord', member: 'capzz', url: 'https://opti-card.vercel.app', kind: 'game', added: '2026-11-16',
    what: { en: 'Answer eight questions about yourself and the community and get a shareable Optimum card with your type, rank and region.', tr: 'Kendin ve topluluk hakkında sekiz soruyu yanıtla; tipini, rütbeni ve bölgeni gösteren paylaşılabilir bir Optimum kartı al.' } },
  { id: 'infinityrun', name: 'Infinity Run', by: 'Mmorgs', handle: 'ZickoMicha127', member: 'mmorgs-dreaming', url: 'https://infinity-run-xi.vercel.app', kind: 'game', added: '2026-11-16',
    what: { en: 'An endless runner with six characters drawn from the maker\'s Optimum artworks, each with its own power, and a leaderboard.', tr: 'Yapımcının Optimum çizimlerinden doğan, her biri kendi gücüne sahip altı karakterli ve liderlik tablolu sonsuz koşu oyunu.' } },
  { id: 'linklab', name: 'Link Lab', by: 'Lie', handle: 'OliviaRue', member: 'olivia-rue', url: 'https://optimum-link-lab.netlify.app', kind: 'game', added: '2026-11-15',
    what: { en: 'A puzzle game: rotate the network tiles until the signal runs from source to destination, level after level.', tr: 'Bir bulmaca oyunu: ağ parçalarını döndürerek sinyali kaynaktan hedefe ulaştır, seviye seviye.' } },
  { id: 'networklab', name: 'Optimum Network Lab', by: 'Zunaira', handle: 'Zunaira5565', url: 'https://optimum-network-lab.vercel.app', kind: 'simulator', added: '2026-11-18',
    what: { en: 'A guided course through peer to peer basics, GossipSub, mump2p and the Gateway, with quizzes and a network simulator.', tr: 'Eşler arası ağ temelleri, GossipSub, mump2p ve Gateway üzerine testli ve ağ simülatörlü rehberli bir kurs.' } },
  { id: 'windtunnel', name: 'Wind Tunnel', by: 'ecamli', handle: 'ekinoks_26', url: 'https://optimum-wind-tunnel.netlify.app', kind: 'simulator', added: '2026-11-20', own: true,
    what: { en: 'Send your own file across a real world map and watch RLNC coded pieces race the default route, with cable cuts and a loss ledger.', tr: 'Kendi dosyanı gerçek bir dünya haritası üzerinden gönder ve RLNC kodlu parçaların varsayılan yolla yarışını izle; kablo kesintileri ve kayıp defteriyle.' } },
];

// Ways to join in, shown on the community page. Same texts as issue 001, so the translations are shared.
export const TAKE_PART = [
  { text: { en: 'Run Signal on your validators. It is free and Optimum says one engineer can set it up in under an hour.' }, url: 'https://console.getoptimum.xyz/login' },
  { text: { en: 'Built something about Optimum? Send it in and it joins the builders showcase.' }, url: '/submit/' },
  { text: { en: 'Make art or explainers? The Chronicler role in the Optimum Discord is for you.' }, url: 'https://discord.gg/getoptimum' },
];

export const KINDS = {
  game: { en: 'Game', tr: 'Oyun' }, simulator: { en: 'Simulator', tr: 'Simülasyon' }, dashboard: { en: 'Dashboard', tr: 'Pano' },
  tool: { en: 'Tool', tr: 'Araç' }, content: { en: 'Content', tr: 'İçerik' }, art: { en: 'Art', tr: 'Sanat' },
};

// Events Optimum took part in, newest first. Dates are local to the event.
export const EVENTS = [
  { id: 'bbw26', start: '2026-11-28', end: '2026-11-29', city: 'Bangkok', name: 'Binance Blockchain Week 2026', url: 'https://www.venturesquare.net/?p=1107204', kind: 'conference',
    what: { en: 'Optimum sent Kent Lin and David Song to Bangkok and asked people there to ask them about Optimum for Traders.' },
    src: [['Optimum on X', 'https://x.com/get_optimum/status/2125246824923676737']] },
  { id: 'devcon8-hub', start: '2026-11-03', end: '2026-11-06', city: 'Mumbai', name: 'P2P Networking Hub at Devcon 8', url: 'https://luma.com/cz51ibrc', kind: 'conference',
    what: { en: 'Optimum co-organised the P2P Networking Hub inside Devcon with ProbeLab, the Ethereum Foundation and HOPR. CTO Har Preet Singh gave the talk “What do you send a peer when the pieces are coded?” on 4 November.' },
    src: [['Hub agenda on Luma', 'https://luma.com/cz51ibrc'], ['Optimum on X', 'https://x.com/get_optimum/status/2115120747782005213']] },
  { id: 'tbc26', start: '2026-10-29', end: '2026-10-31', city: 'Munich', name: 'TUM Blockchain Conference 26', url: 'https://luma.com/tbc26', kind: 'conference',
    what: { en: 'Optimum’s Chief Economist Slobodan Sudaric-Hefner spoke on the opening day.' },
    src: [['Optimum on X', 'https://x.com/get_optimum/status/2114522459991052509']] },
  { id: 'rollup-1023', start: '2026-10-23', city: 'Online', name: 'The Rollup livestream', url: 'https://x.com/therollupco/status/2113646645653262540', kind: 'livestream',
    what: { en: 'Muriel Médard and ether.fi’s Mike Silagadze on why ether.fi made mump2p standard across its validator fleet.' },
    src: [['The Rollup on X', 'https://x.com/therollupco/status/2113646645653262540']] },
  { id: 'blocmates-1020', start: '2026-10-20', city: 'Online', name: 'blocmates launch livestream', url: 'https://x.com/blocmates/status/2112567815794532713', kind: 'livestream',
    what: { en: '“The Autobahn for Ethereum”: Muriel Médard and Kent Lin on mainnet launch day.' },
    src: [['Optimum on X', 'https://x.com/get_optimum/status/2114856161849827393']] },
];

// Talks and interviews published outside Optimum's own YouTube channel.
export const MEDIA = [
  { id: 'defiant-1105', date: '2026-11-05', title: 'The hidden bottleneck slowing Ethereum, and how Optimum fixed it', who: 'The Defiant, with Camila Russo and Muriel Médard', url: 'https://thedefiant.io/podcasts-and-videos/videos/the-hidden-bottleneck-slowing-ethereum-and-how-optimum-fixed-it-or-mit-s-muriel-medard', note: { en: 'Presented by Optimum.' } },
  { id: 'rollup-1023', date: '2026-10-23', title: 'Muriel Médard and Mike Silagadze on The Rollup', who: 'The Rollup', url: 'https://x.com/therollupco/status/2113646645653262540' },
  { id: 'blocmates-1020', date: '2026-10-20', title: 'The Autobahn for Ethereum: Optimum goes live on mainnet', who: 'blocmates, with Muriel Médard and Kent Lin', url: 'https://x.com/blocmates/status/2112567815794532713' },
];

// Optimum's YouTube channel as of 20 Nov 2026; the wire refreshes this list every hour.
export const YOUTUBE = [{"id": "_6DvMd5Kd5o", "date": "2026-10-20", "title": "Optimum Explained: The Data Acceleration Network for Any Blockchain"}, {"id": "XGxZxzxAe0g", "date": "2026-07-01", "title": "Why Ethereum Has a Data Ceiling — And How RLNC Breaks It (Muriel Medard, Optimum)"}, {"id": "7gva-j7mSyM", "date": "2026-06-16", "title": "Why Post-Quantum Security Is a Coding Problem, Not Just a Crypto Problem | Muriel Medard"}, {"id": "b-cMYd_gCrk", "date": "2026-06-10", "title": "Speed is Money, Reliable Speed Unlocks New Economics"}, {"id": "Hvhu5fH_piQ", "date": "2026-06-08", "title": "This is how post-quantum security really works"}, {"id": "KNxlDEZZMp0", "date": "2026-06-04", "title": "Tarun Chitra sees Optimum's Latency Marketplace giving rise to blockspace futures markets."}, {"id": "IcAzcJ1hjpQ", "date": "2026-06-02", "title": "Speed is Money: Pricing Innovation Under Latency Constraints | Ft. Tarun Chitra"}, {"id": "bph-kmuAgh0", "date": "2026-05-29", "title": "Why are all the top Ethereum node operators testing mump2p?"}, {"id": "DoF398MQ-Tc", "date": "2026-05-21", "title": "Why This Year Is the Year of the Networking Layer"}, {"id": "q2N-eZNGs94", "date": "2026-05-19", "title": "I Dropped Out of Harvard Business School to Build This"}, {"id": "BQ2OIFlbDIU", "date": "2026-05-15", "title": "Speed is Money - Optimum makes ETH staking more profitable"}, {"id": "WIGel6ah-zM", "date": "2026-05-11", "title": "How Optimum Gives ETH Validators an Edge + APY Boost"}, {"id": "sZ2jvTZd0A4", "date": "2026-05-08", "title": "Millions of people stake ETH, but how exactly is that yield generated?🤔"}, {"id": "fgeXDbORuz0", "date": "2026-05-07", "title": "Maximize ETH Staking Returns: Latency Optimization in the $100B Validator Market"}, {"id": "1yQT98EnFDA", "date": "2026-05-06", "title": "What is the Optimum Network Coding Solution?"}];
