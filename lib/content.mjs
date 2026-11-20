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
    { name: 'Flash', role: { en: 'Runs the role distribution in the Optimum Discord', tr: "Optimum Discord'unda rol dağıtımını yürütüyor" } },
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
export const BUILDERS = [
  { id: 'pitwall', name: 'Optimum Pit Wall', by: 'WeLoSu', handle: 'io_enthusiast', url: 'https://optimum-pitwall.netlify.app', post: 'https://x.com/io_enthusiast/status/2119720543163437453', kind: 'dashboard', added: '2026-11-20',
    what: { en: 'Race style timing for Ethereum block propagation, built on ethPandaOps Xatu open data, with an estimated mump2p what if car.', tr: 'Ethereum blok yayılımı için yarış tarzı zamanlama ekranı; ethPandaOps Xatu açık verisiyle kurulmuş, tahmini bir mump2p "ya olsaydı" aracı da var.' } },
  { id: 'optimumlab', name: 'Optimum Lab', by: 'Süleyman', handle: 'slymnogunc', url: 'https://optimumlab.netlify.app', kind: 'simulator', added: '2026-11-20',
    what: { en: 'Five interactive simulations of propagation, RLNC coding and DeRAM memory, with real GF(2^8) math and a shareable result card.', tr: 'Yayılım, RLNC kodlaması ve DeRAM belleği üzerine beş etkileşimli simülasyon; gerçek GF(2^8) matematiği ve paylaşılabilir sonuç kartıyla.' } },
  { id: 'runner', name: 'Optimum Runner', by: 'cryptoperseus', handle: 'cryptoperseus_', url: 'https://optimumrunner.netlify.app', kind: 'game', added: '2026-11-20',
    what: { en: 'A platform game set in the Optimum world. After its first tournament it is offline for a short while as the leaderboard is finalized.', tr: 'Optimum dünyasında geçen bir platform oyunu. İlk turnuvasının ardından liderlik tablosu kesinleşene kadar kısa bir süre kapalı.' } },
  { id: 'signalbreach', name: 'Signal Breach', by: 'ganindraraka', url: 'https://github.com/ganindraraka/optimum-game', kind: 'game', added: '2026-11-20', sourceOnly: true,
    what: { en: 'An Optimum network defense game, published as source code.', tr: 'Kaynak kodu olarak yayımlanmış bir Optimum ağ savunma oyunu.' } },
  { id: 'gossipsiege', name: 'Gossip Siege', by: 'ecamli', handle: 'ekinoks_26', url: 'https://gossipsiege.xyz', kind: 'game', added: '2026-11-20', own: true,
    what: { en: 'A tower defense game about block propagation, with a study guide of sourced quiz questions and a shared leaderboard.', tr: 'Blok yayılımı üzerine bir kule savunma oyunu; kaynaklı soru rehberi ve ortak liderlik tablosuyla.' } },
  { id: 'windtunnel', name: 'Wind Tunnel', by: 'ecamli', handle: 'ekinoks_26', url: 'https://optimum-wind-tunnel.netlify.app', kind: 'simulator', added: '2026-11-20', own: true,
    what: { en: 'Send your own file across a real world map and watch RLNC coded pieces race the default route, with cable cuts and a loss ledger.', tr: 'Kendi dosyanı gerçek bir dünya haritası üzerinden gönder ve RLNC kodlu parçaların varsayılan yolla yarışını izle; kablo kesintileri ve kayıp defteriyle.' } },
];

export const KINDS = {
  game: { en: 'Game', tr: 'Oyun' }, simulator: { en: 'Simulator', tr: 'Simülasyon' }, dashboard: { en: 'Dashboard', tr: 'Pano' },
  tool: { en: 'Tool', tr: 'Araç' }, content: { en: 'Content', tr: 'İçerik' }, art: { en: 'Art', tr: 'Sanat' },
};

// Events Optimum took part in, newest first. Dates are local to the event.
export const EVENTS = [
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
