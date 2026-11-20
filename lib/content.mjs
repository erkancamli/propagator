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
        'People without validators can run a stream only gateway to receive the block stream.'],
      tr: ["Operatör bir gateway çalıştırıyor: beacon düğümünün yanındaki bir sunucuda tek bir konteyner. Gateway, konsensüs istemcisinin bir eşi gibi davranıyor ve doğrulayıcı anahtarlarını asla almıyor. Prysm, Lighthouse, Teku, Nimbus ve Lodestar destekleniyor; alışılmış gossip yolu da yanında çalışmaya devam ediyor. Yani gateway bir yolu değiştirmiyor, ek olarak daha hızlı bir yol açıyor.",
        "Doğrulayıcısı olmayanlar da blok akışını almak için yalnızca akış (stream only) modunda gateway çalıştırabiliyor."],
    },
    src: [['Optimum docs: introduction', 'https://docs.getoptimum.xyz/'], ['crypto.news, 10 Nov 2026', 'https://crypto.news/ethereum-p2p-protocol-mump2p-faster-block-delivery/']],
  },
  {
    id: 'products',
    h: { en: 'Signal and Accelerate', tr: 'Signal ve Accelerate' },
    p: {
      en: ['Signal hands blocks from the Optimum mesh to your beacon node so your validators receive them sooner. It is free for Ethereum validators.',
        'Accelerate goes further for large operators: it recommends a bid cutoff for the MEV sidecar they already run, based on the slots their validators proposed. It needs at least 200 active mainnet validators and has to be enabled by Optimum.'],
      tr: ["Signal, Optimum ağındaki blokları beacon düğümüne aktararak doğrulayıcıların onları daha erken almasını sağlıyor. Ethereum doğrulayıcıları için ücretsiz.",
        "Accelerate büyük operatörler için bir adım daha ileri gidiyor: doğrulayıcılarının önerdiği slotlara bakarak zaten çalıştırdıkları MEV sidecar için bir teklif kesim zamanı (bid cutoff) öneriyor. En az 200 aktif ana ağ doğrulayıcısı gerekiyor ve Optimum tarafından açılması lazım."],
    },
    src: [['Optimum docs: Signal', 'https://docs.getoptimum.xyz/signal/what-signal-does'], ['Optimum docs: Accelerate', 'https://docs.getoptimum.xyz/accelerate/what-accelerate-does'], ['Optimum FAQ on getoptimum.xyz', 'https://www.getoptimum.xyz/']],
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
      en: ["Optimum's own figures, published live on its Hub, show blocks reaching nodes faster than the default gossip route in most slots. Outside checks are more mixed: a Lido evaluation on the Hoodi testnet found blocks arriving about 407 ms sooner at the 95th percentile, while an independent StereumLabs test on 36 mainnet nodes with an early gateway build found some clients faster and none statistically significant.",
        'Propagator labels every number with who measured it. The Pulse page explains each metric.'],
      tr: ["Optimum'un Hub'da canlı yayınladığı kendi verileri, slotların çoğunda blokların düğümlere varsayılan gossip yolundan daha hızlı ulaştığını gösteriyor. Dış testler daha karışık: Lido'nun Hoodi test ağındaki değerlendirmesi blokların 95. yüzdelikte yaklaşık 407 ms daha erken geldiğini buldu; StereumLabs'in erken bir gateway sürümüyle 36 ana ağ düğümünde yaptığı bağımsız test ise bazı istemcilerde hızlanma gördü ama hiçbirinde istatistiksel olarak anlamlı sonuç çıkmadı.",
        "Propagator her rakamın yanında onu kimin ölçtüğünü yazıyor. Nabız sayfası her ölçümü açıklıyor."],
    },
    src: [['Optimum Hub', 'https://hub.getoptimum.xyz'], ['TokenPost, 11 Nov 2026', 'https://www.tokenpost.com/news/technology/53709']],
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
    { name: 'Kent Lin', role: { en: 'Co-founder', tr: 'Kurucu ortak' }, bio: { en: 'Leads business development, tokenomics and fundraising. Previously a partner at GSRV.', tr: 'İş geliştirme, tokenomi ve yatırım süreçlerini yönetiyor. Daha önce GSRV’de ortaktı.' }, img: '/assets/people/lin.webp', links: [['X', 'https://x.com/kentlinyy'], ['LinkedIn', 'https://linkedin.com/in/kentyeyanglin']] },
    { name: 'Dr. Kishori Konwar', role: { en: 'Co-founder', tr: 'Kurucu ortak' }, bio: { en: 'Distributed systems, coding theory and AI. Previously at Meta and an MIT postdoc.', tr: 'Dağıtık sistemler, kodlama teorisi ve yapay zekâ. Daha önce Meta’da ve MIT’de doktora sonrası araştırmacı.' }, img: '/assets/people/konwar.webp', links: [['LinkedIn', 'https://linkedin.com/in/kishorikonwar']] },
  ],
  advisors: [
    { name: 'Prof. Nancy Lynch', bio: { en: "Former NEC Chair at MIT. Optimum's team page credits her with the first proof of Byzantine fault tolerance.", tr: "MIT'de eski NEC Kürsüsü sahibi. Optimum'un ekip sayfası ona Bizans hata toleransının ilk ispatını atfediyor." } },
    { name: 'Prof. Sriram Viswanath', bio: { en: 'IIT Madras, Caltech and a Stanford PhD.', tr: 'IIT Madras, Caltech ve Stanford doktorası.' } },
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
