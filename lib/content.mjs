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
    { name: 'Prof. Muriel Médard', role: { en: 'Co-founder and CEO', tr: 'Kurucu ortak ve CEO' }, img: '/assets/people/medard.webp', links: [['X', 'https://x.com/MurielMedard'], ['LinkedIn', 'https://www.linkedin.com/in/murielmedard/']],
      bio: { en: 'NEC Professor of Software Science and Engineering at MIT and co-inventor of random linear network coding (RLNC), the technique Optimum is built on. Optimum’s team page ranks her first in the world in network coding.' },
      career: [
        { y: '1989', en: 'Bachelor’s degree in mathematics and electrical engineering, MIT' },
        { y: '1995', en: 'Doctorate in electrical engineering, MIT' },
        { y: '1998', en: 'Assistant professor, University of Illinois at Urbana Champaign' },
        { y: '2000', en: 'Joins the MIT faculty, where she leads the Network Coding and Reliable Communications Group' },
        { y: '2012', en: 'President of the IEEE Information Theory Society' },
        { y: '', en: 'Co-founded the network coding companies CodeOn, Steinwurf and Chocolate Cloud before Optimum' },
      ],
      honours: [
        ['2026', 'IEEE Richard W. Hamming Medal'], ['2025', 'International Fellow, Royal Academy of Engineering'], ['2022', 'Member, German National Academy of Sciences Leopoldina'], ['2022', 'IEEE Koji Kobayashi Computers and Communications Award'],
        ['2021', 'Fellow, American Academy of Arts and Sciences'], ['2020', 'Member, US National Academy of Engineering'], ['2020', 'Honorary doctorate, Technical University of Munich'], ['2018', 'ACM SIGCOMM Test of Time Award'],
        ['2018', 'Fellow, US National Academy of Inventors'], ['2017', 'IEEE Communications Society Edwin Howard Armstrong Achievement Award'], ['2017', 'IEEE Information Theory Society Aaron D. Wyner Distinguished Service Award'],
        ['2016', 'IEEE Vehicular Technology James Evans Avant Garde Award'], ['2009', 'IEEE Communications Society and Information Theory Society Joint Paper Award, and the William R. Bennett Prize'], ['2008', 'IEEE Fellow'],
      ],
      src: [['Optimum team page', 'https://www.getoptimum.xyz/team'], ['MIT News, March 2026', 'https://news.mit.edu/2026/mit-engineering-faculty-receive-awards-0310'], ['Wikipedia', 'https://en.wikipedia.org/wiki/Muriel_M%C3%A9dard']] },
    { name: 'Kent Lin', teaser: 2, role: { en: 'Co-founder', tr: 'Kurucu ortak' }, img: '/assets/people/lin.webp', links: [['X', 'https://x.com/kentlinyy'], ['LinkedIn', 'https://linkedin.com/in/kentyeyanglin']],
      bio: { en: 'Leads business development, tokenomics and fundraising, and appears as COO in Optimum’s videos. He met Muriel Médard while studying for an MBA at Harvard Business School, and left the programme to start Optimum.' },
      career: [
        { y: '', en: 'Management consultant at McKinsey, where he founded the McKinsey Crypto DAO, a group of more than 200 alumni working in Web3' },
        { y: '', en: 'Partner at GSRV, a venture firm Optimum puts at 4 billion dollars' },
        { y: '', en: 'President of the Harvard Blockchain Club' },
        { y: '', en: 'Left Harvard Business School to co-found Optimum with Muriel Médard and Kishori Konwar' },
      ],
      src: [['Optimum team page', 'https://www.getoptimum.xyz/team'], ['Presto Labs interview, April 2025', 'https://www.prestolabs.io/research/kent-optimum-rlnc-memory-layer-and-scalability'], ['IQ.wiki profile', 'https://iq.wiki/wiki/kent-lin']] },
    { name: 'Dr. Kishori Konwar', teaser: 2, role: { en: 'Co-founder', tr: 'Kurucu ortak' }, img: '/assets/people/konwar.webp', links: [['LinkedIn', 'https://linkedin.com/in/kishorikonwar']],
      bio: { en: 'Works across distributed systems, coding theory and AI. He co-wrote Optimum’s research papers, including OptimumP2P, and holds two US patents on erasure coded distributed storage.' },
      career: [
        { y: '2006', en: 'Doctorate in distributed computing, University of Connecticut' },
        { y: '2006', en: 'Quantitative strategist in market risk at Goldman Sachs, New York' },
        { y: '2015', en: 'Distributed computing researcher at MIT, working on network coding' },
        { y: '2018', en: 'Data scientist at the Broad Institute of MIT and Harvard' },
        { y: '2022', en: 'Research data scientist at Meta' },
        { y: '2024', en: 'Co-founds Optimum' },
      ],
      src: [['Optimum team page', 'https://www.getoptimum.xyz/team'], ['IQ.wiki profile', 'https://iq.wiki/wiki/kishori-konwar']] },
  ],
  advisors: [
    { name: 'Prof. Nancy Lynch', bio: { en: "Former NEC Chair at MIT and author of the standard textbook Distributed Algorithms. Optimum's team page credits her with the first mathematical proof of Byzantine fault tolerance (1985) and the DLS algorithm (1988) that Tendermint and Ethereum's consensus protocols descend from." },
      honours: [['2015', 'Member, US National Academy of Sciences'], ['2010', 'IEEE Emanuel R. Piore Award'], ['2007', 'Knuth Prize'], ['2001', 'Member, US National Academy of Engineering']],
      src: [['Optimum team page', 'https://www.getoptimum.xyz/team'], ['Wikipedia', 'https://en.wikipedia.org/wiki/Nancy_Lynch']] },
    { name: 'Prof. Sriram Viswanath', bio: { en: 'IIT Madras, Caltech and a Stanford PhD. Researches information theory, wireless communications and network science.' },
      honours: [['2005', 'IEEE Joint Information Theory and Communications Society Best Paper Award'], ['', 'NSF CAREER Award']],
      src: [['Optimum team page', 'https://www.getoptimum.xyz/team']] },
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
  { id: 'datadash', name: 'Optimum Data Dash', by: 'Lie', handle: 'OliviaRue', member: 'olivia-rue', url: 'https://optimum-data-dash.netlify.app', kind: 'game', added: '2026-11-28', post: 'https://x.com/OliviaRue/status/2111486906064404856',
    what: { en: 'An endless runner: ride the signal, jump over network noise and collect glowing data shards. Plays with one key or a tap.' } },
  { id: 'networklab', name: 'Optimum Network Lab', by: 'Zunaira', handle: 'Zunaira5565', url: 'https://optimum-network-lab.vercel.app', kind: 'simulator', added: '2026-11-18',
    what: { en: 'A guided course through peer to peer basics, GossipSub, mump2p and the Gateway, with quizzes and a network simulator.', tr: 'Eşler arası ağ temelleri, GossipSub, mump2p ve Gateway üzerine testli ve ağ simülatörlü rehberli bir kurs.' } },
  { id: 'windtunnel', name: 'Wind Tunnel', by: 'ecamli', handle: 'ekinoks_26', url: 'https://optimum-wind-tunnel.netlify.app', kind: 'simulator', added: '2026-11-20', own: true,
    what: { en: 'Send your own file across a real world map and watch RLNC coded pieces race the default route, with cable cuts and a loss ledger.', tr: 'Kendi dosyanı gerçek bir dünya haritası üzerinden gönder ve RLNC kodlu parçaların varsayılan yolla yarışını izle; kablo kesintileri ve kayıp defteriyle.' } },
  { id: 'optimummaker', name: "Optimum Maker", by: "WeLoSu", handle: 'io_enthusiast', member: 'welosu', url: 'https://getoptimummaker.netlify.app', post: 'https://x.com/io_enthusiast/status/2109760970855731708', kind: 'tool', added: '2026-11-28',
    what: { en: "On brand Optimum visuals in the browser, made with the official logo and brand kit assets: pick a layout, add text, shapes and images, and download a PNG." } },
  { id: 'packetrush', name: "Optimum Packet Rush", by: "Kundan", handle: 'kundanlover0', member: 'kundan', url: 'https://optimumpacketrush.netlify.app', post: 'https://x.com/kundanlover0/status/2120424503746650482', kind: 'game', added: '2026-11-28',
    what: { en: "You are a node and packets rain in: catch the Optimum packets, dodge lag and duplicates, and move data faster than Gossipsub." } },
  { id: 'prediction', name: "Optimum Prediction", by: "Kundan", handle: 'kundanlover0', member: 'kundan', url: 'https://optimumprediction.netlify.app', post: 'https://x.com/kundanlover0/status/2119866101387636866', kind: 'tool', added: '2026-11-28',
    what: { en: "A prediction market playground: browse markets, create contracts and place bets with test tokens from its faucet." } },
  { id: 'signalorbit', name: "Optimum Signal Orbit", by: "Lie", handle: 'OliviaRue', member: 'olivia-rue', url: 'https://optimum-signal-orbit.netlify.app', post: 'https://x.com/OliviaRue/status/2117638608626823201', kind: 'game', added: '2026-11-28',
    what: { en: "Launch data nodes into the ring, find the gap, avoid collisions and keep the network stable." } },
  { id: 'turbocharging', name: "Turbo Charging", by: "Vita Zhuk", handle: 'zhukv197', member: false, url: 'https://turbocharging.vercel.app', post: 'https://x.com/zhukv197/status/2119056227627843826', kind: 'game', added: '2026-11-28',
    what: { en: "A fan game built around the TurboCard collection, where you can own the full set in game. It needs a free account." } },
  { id: 'surf', name: "Optimum Surf", by: "PixelRey", handle: 'PixelRey_x', member: 'pixelrey', url: 'https://optimum-surf-pixelrey.pages.dev', post: 'https://x.com/PixelRey_x/status/2114049901629956223', kind: 'game', added: '2026-11-28',
    what: { en: "Ride the data wave: dodge obstacles, collect packets and post your best score to a leaderboard with just your Discord username." } },
  { id: 'propagationlab', name: "Propagation Lab", by: "Pawan", handle: 'Pawan2001564157', member: 'pawan', url: 'https://propagation-lab-optimum.vercel.app', post: 'https://x.com/Pawan2001564157/status/2112763888114819328', kind: 'simulator', added: '2026-11-28',
    what: { en: "Real Ethereum block timing in your browser: the latest block's arrival and its rolling median, a Flexnode primer, a monitor and a guess the block game. No simulated data." } },
  { id: 'noderunner', name: "Node Runner", by: "iscy", handle: 'easyisc', member: 'iscy', url: 'https://node-runner-game.netlify.app', post: 'https://x.com/easyisc/status/2105537470091735184', kind: 'game', added: '2026-11-28',
    what: { en: "Tap your node, upgrade your network and climb from a local node to a decentralized grid." } },
  { id: 'sugarsmash', name: "Sugar Smash", by: "Golnoosh", handle: 'amircry94432508', member: false, url: 'https://optimum-smash.netlify.app', post: 'https://x.com/amircry94432508/status/2105401356542705842', kind: 'game', added: '2026-11-28',
    what: { en: "Play the Optimum hero, swing a hammer and smash a tower of pastel candy. Works on a phone." } },
  { id: 'signalbreach', name: "Signal Breach", by: "coro", handle: '0xjulianeth', member: false, url: 'https://optimum-signal.netlify.app', post: 'https://x.com/0xjulianeth/status/2094660950813253880', kind: 'game', added: '2026-11-28',
    what: { en: "Tap away latency, packet loss and congestion to keep your core node online, and watch throughput climb." } },
  { id: 'racetheblock', name: "Race the Block", by: "coro", handle: '0xjulianeth', member: false, url: 'https://optimum-race-theblock.netlify.app', post: 'https://x.com/0xjulianeth/status/2092170962997567622', kind: 'game', added: '2026-11-28',
    what: { en: "Tap to jump, race past duplicate packets and see how far ahead of Gossipsub you can get." } },
  { id: 'rlncquiz', name: "How well do you know RLNC?", by: "coro", handle: '0xjulianeth', member: false, url: 'https://optimum-quiz.netlify.app', post: 'https://x.com/0xjulianeth/status/2084112303281320434', kind: 'quiz', added: '2026-11-28',
    what: { en: "Timed questions on RLNC and the problems it solves, with an Optimum character at the end." } },
  { id: 'flappymum', name: "Flappy Mum", by: "Keng SiR\u00f4", handle: 'dcityuknow', member: 'keng-siro', url: 'https://flappymum.vercel.app', post: 'https://x.com/dcityuknow/status/2093208990377292088', kind: 'game', added: '2026-11-28',
    what: { en: "Pick a character, flap through the gaps and climb the leaderboard." } },
  { id: 'summer', name: "Optimum Summer", by: "baised", handle: 'baisedit', member: 'baised', url: 'https://crpbase.github.io/optimum_summer/', post: 'https://x.com/thachvosiuu/status/2080958457335914694', kind: 'art', added: '2026-11-28',
    what: { en: "Put the 3D Optimum mascot into the real world through your camera, show how you spend the summer and join the hall of fame." } },
  { id: 'puzzle', name: "Optimum Puzzle", by: "baised", handle: 'baisedit', member: 'baised', url: 'https://crpbase.github.io/optimum_puzzle/', post: 'https://x.com/baisedit/status/2071534690704527439', kind: 'game', added: '2026-11-28',
    what: { en: "A picture puzzle with Optimum art: choose a nickname, solve it and land on the leaderboard." } },
  { id: 'memory', name: "Optimum Memory Card Game", by: "Kuchiki", handle: 'eth_Kuchiki', member: false, url: 'https://optimum-memory-game-pearl.vercel.app', post: 'https://x.com/ashmigg/status/2076841599259246670', kind: 'game', added: '2026-11-28',
    what: { en: "Flip the cards and match the Optimum crew across ten levels, each with more faces to remember." } },
  { id: 'dressup', name: "Dress Up Studio", by: "Numaa", handle: 'ashmigg', member: 'numaa', url: 'https://dress-up-studio.vercel.app', post: 'https://x.com/big_boss_707bb/status/2072306380447330546', kind: 'art', added: '2026-11-28',
    what: { en: "Dress the Optimum mascot: mix outfits, accessories and backgrounds, give it a name and download your character." } },
  { id: 'stats', name: "Proof of Optimum", by: "Samir", handle: 'SamirAhame96036', member: false, url: 'https://stats-optimum.vercel.app', post: 'https://x.com/SamirAhame96036/status/2071587117629915578', kind: 'dashboard', added: '2026-11-28',
    what: { en: "Enter an X handle to see the views and likes on the posts it made about Optimum, with a card to download and share. No sign in." } },
  { id: 'spotlightarts', name: "Optimum Community Art Gallery", by: "0xJason", handle: 'Jason0x1', member: false, url: 'https://spotlightarts.vercel.app', post: 'https://x.com/Jason0x1/status/2066543800412225791', kind: 'art', added: '2026-11-28',
    what: { en: "A slide show gallery of some of the best artwork from the Optimum community." } },
  { id: 'hawkquiz', name: "How well do you know Optimum?", by: "Hawk", handle: 'hawk_tyt', member: false, url: 'https://alekshawk.github.io/optimum-quiz/', post: 'https://x.com/cryptolifeukr/status/2063352142434308475', kind: 'quiz', added: '2026-11-28',
    what: { en: "A knowledge challenge on RLNC, mump2p, DeRAM and the team, ranking you from newcomer to Flexnode master." } },
  { id: 'impact', name: "Validator Impact Calculator", by: "Ikechukwu", handle: '0xprobeat', member: false, url: 'https://validator-impact-calculator.vercel.app', post: 'https://x.com/0xprobeat/status/2061558022506426500', kind: 'tool', added: '2026-11-28',
    what: { en: "Open source: estimates the APR and bandwidth a validator setup would gain with mump2p, from Optimum's published figures." } },
  { id: 'artgallery', name: "Optimum Art Gallery", by: "Maharshi", handle: 'maharshi_2207', member: 'maharshi-boosted-arc', url: 'https://optimum-archive.lovable.app', post: 'https://x.com/maharshi_2207/status/2059514920753049898', kind: 'art', added: '2026-11-28',
    what: { en: "An archive for community art, stickers and GIFs in collections: sign in with X, make a collection and upload." } },
  { id: 'identity', name: "Optimum Identity", by: "Maharshi", handle: 'maharshi_2207', member: 'maharshi-boosted-arc', url: 'https://optimum-identity-verse.lovable.app', post: 'https://x.com/Avinash_3107/status/2057902443233693705', kind: 'tool', added: '2026-11-28',
    what: { en: "Forge a holographic Optimum identity card from your handle and role, and download it." } },
  { id: 'packetrunner', name: "Packet Runner", by: "Pawan", handle: 'Pawan2001564157', member: 'pawan', url: 'https://optimum-packet-runner.vercel.app', post: 'https://x.com/meowsoso_1/status/2056970799534510463', kind: 'simulator', added: '2026-11-28',
    what: { en: "An interactive demo of Optimum's networking: steer a data packet, sync node state and see how low latency changes games, AI agents and markets." } },
  { id: 'optimumquiz', name: "Optimum Quiz", by: "Aiueo", handle: 'Yujiu212', member: false, url: 'https://optimum-quiz.xyz', post: 'https://x.com/Yujiu212/status/2056247524395204842', kind: 'quiz', added: '2026-11-28',
    what: { en: "Short questions on mump2p, RLNC, validator latency and Optimum's infrastructure, each with an explanation, in random and daily modes." } },
  { id: 'mumv', name: "MumV", by: "VictOR", handle: 'kingingveek', member: false, url: 'https://mumv.vercel.app', post: 'https://x.com/kingingveek/status/2034934143021138331', kind: 'tool', added: '2026-11-28',
    what: { en: "An AI chatbot that answers questions about Optimum." } },
  { id: 'glasses', name: "Optimum Avatar", by: "T U N G", handle: 'tung9xnb', member: false, url: 'https://tung2606.github.io/OptimumchangeAvt/', post: 'https://x.com/tung9xnb/status/2030908074589130977', kind: 'tool', added: '2026-11-28',
    what: { en: "Add the Optimum mascot's glasses to any photo: choose an image, place the sticker and download your avatar." } },
  { id: 'flappyscratch', name: "Optimum Glide", by: "ONNIX", handle: 'ONNIXWEB3', member: false, url: 'https://scratch.mit.edu/projects/1351989338/', post: 'https://x.com/ONNIXWEB3/status/2075366813513425297', kind: 'game', added: '2026-11-28',
    what: { en: "A Flappy Bird style game on Scratch with custom Optimum art: glide through a high speed network and dodge the data conduits." } },
];

// Ways to join in, shown on the community page. Same texts as issue 001, so the translations are shared.
export const TAKE_PART = [
  { text: { en: 'Run Signal on your validators. It is free and Optimum says one engineer can set it up in under an hour.' }, url: 'https://console.getoptimum.xyz/login' },
  { text: { en: 'Built something about Optimum? Send it in and it joins the builders showcase.' }, url: '/submit/' },
  { text: { en: 'Make art or explainers? The Chronicler role in the Optimum Discord is for you.' }, url: 'https://discord.gg/getoptimum' },
];

export const KINDS = {
  game: { en: 'Game', tr: 'Oyun' }, simulator: { en: 'Simulator', tr: 'Simülasyon' }, dashboard: { en: 'Dashboard', tr: 'Pano' },
  tool: { en: 'Tool', tr: 'Araç' }, content: { en: 'Content', tr: 'İçerik' }, art: { en: 'Art', tr: 'Sanat' }, quiz: { en: 'Quiz', tr: 'Bilgi yarışması' },
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

// Discord roles beyond the ladder, shown as a badge on the cards of members who hold them.
// Holders copied from the Optimum Discord role list and checked against Discord on 28 Nov 2026; a name ending in * would match by its start.
export const BADGES = [
  { id: 'treasure', name: 'Lord of the Treasure', what: { en: 'A Discord role from the community treasure hunts.' }, asOf: '2026-11-28',
    names: ['0xLegenda', '@Upson', 'AQCCapital', 'ACE', 'Alex', 'Arian', 'Atewe', 'Awais Khalid', 'BOLA', 'Biva | mum', 'Bobokan', 'Bounty', 'CryptoSundayz', 'Cubon', 'Cutie Quinn', 'Dr.Thơ', 'DuyHua', 'flash', 'Guynextdooooor', 'Hakan', 'HyperOptimism', 'Ihor', 'ImpermanentPi', 'Jultoshi', 'Khang Nguyen', 'LMN', 'LarOs', 'Loveress', 'Luminary_DC', 'Mst003', 'Nino', 'OG Osmosith | OptimumFan', 'PERFECTman', 'Pegasus', 'Pervert Sage', 'Presh404', 'Rimizze', 'Rimuro', 'Schaslivchik', 'Shahriar', 'Silver_22d', 'TG', 'TheBlockBoy', 'Thuannguyen6868', 'VANAN', 'Vladyslav', 'Web3 Creek', 'artkill', 'barra', 'blockcahil', 'bojack', 'bukukrip', 'cmd', 'connes', 'd3dly', 'ecamli', 'jimmyfx', 'mykhailos.eth', 'rabedell', 'rexregan', 'setrowski', 'tramtiramisu', 'vssema', 'zumorito', '0xVicky', 'samurai.itan', 'si', 'PRESIDENT'] },
];

// Talks and interviews published outside Optimum's own YouTube channel.
export const MEDIA = [
  { id: 'defiant-1105', date: '2026-11-05', title: 'The hidden bottleneck slowing Ethereum, and how Optimum fixed it', who: 'The Defiant, with Camila Russo and Muriel Médard', url: 'https://thedefiant.io/podcasts-and-videos/videos/the-hidden-bottleneck-slowing-ethereum-and-how-optimum-fixed-it-or-mit-s-muriel-medard', note: { en: 'Presented by Optimum.' } },
  { id: 'rollup-1023', date: '2026-10-23', title: 'Muriel Médard and Mike Silagadze on The Rollup', who: 'The Rollup', url: 'https://x.com/therollupco/status/2113646645653262540' },
  { id: 'blocmates-1020', date: '2026-10-20', title: 'The Autobahn for Ethereum: Optimum goes live on mainnet', who: 'blocmates, with Muriel Médard and Kent Lin', url: 'https://x.com/blocmates/status/2112567815794532713' },
];

// Optimum's YouTube channel as of 20 Nov 2026; the wire refreshes this list every hour.
export const YOUTUBE = [{"id": "_6DvMd5Kd5o", "date": "2026-10-20", "title": "Optimum Explained: The Data Acceleration Network for Any Blockchain"}, {"id": "XGxZxzxAe0g", "date": "2026-07-01", "title": "Why Ethereum Has a Data Ceiling — And How RLNC Breaks It (Muriel Medard, Optimum)"}, {"id": "7gva-j7mSyM", "date": "2026-06-16", "title": "Why Post-Quantum Security Is a Coding Problem, Not Just a Crypto Problem | Muriel Medard"}, {"id": "b-cMYd_gCrk", "date": "2026-06-10", "title": "Speed is Money, Reliable Speed Unlocks New Economics"}, {"id": "Hvhu5fH_piQ", "date": "2026-06-08", "title": "This is how post-quantum security really works"}, {"id": "KNxlDEZZMp0", "date": "2026-06-04", "title": "Tarun Chitra sees Optimum's Latency Marketplace giving rise to blockspace futures markets."}, {"id": "IcAzcJ1hjpQ", "date": "2026-06-02", "title": "Speed is Money: Pricing Innovation Under Latency Constraints | Ft. Tarun Chitra"}, {"id": "bph-kmuAgh0", "date": "2026-05-29", "title": "Why are all the top Ethereum node operators testing mump2p?"}, {"id": "DoF398MQ-Tc", "date": "2026-05-21", "title": "Why This Year Is the Year of the Networking Layer"}, {"id": "q2N-eZNGs94", "date": "2026-05-19", "title": "I Dropped Out of Harvard Business School to Build This"}, {"id": "BQ2OIFlbDIU", "date": "2026-05-15", "title": "Speed is Money - Optimum makes ETH staking more profitable"}, {"id": "WIGel6ah-zM", "date": "2026-05-11", "title": "How Optimum Gives ETH Validators an Edge + APY Boost"}, {"id": "sZ2jvTZd0A4", "date": "2026-05-08", "title": "Millions of people stake ETH, but how exactly is that yield generated?🤔"}, {"id": "fgeXDbORuz0", "date": "2026-05-07", "title": "Maximize ETH Staking Returns: Latency Optimization in the $100B Validator Market"}, {"id": "1yQT98EnFDA", "date": "2026-05-06", "title": "What is the Optimum Network Coding Solution?"}];

// ---------- Run a gateway: a setup guide from Optimum's docs and the gateway manual, checked 28 November 2026 ----------
// Commands are shown as the shape of what Console prints; readers copy the real one from Console.
const e = (en) => ({ en });
export const GATEWAY = {
  checked: '2026-11-28',
  release: 'v1.3.6',
  facts: [
    [e('Free'), e('for validators, and Optimum says it will stay free')],
    [e('2 vCPU, 512 MB'), e('minimum host, with 500 MB of disk; 4 vCPU recommended')],
    [e('3 ports'), e('33212 and 33213 open, 48123 kept on the machine itself')],
  ],
  what: [
    e('The gateway is one container that runs on your own machine. It joins the Optimum mesh, where blocks travel as coded pieces over mump2p, and hands each block to whoever needs it next.'),
    e('If you run validators, your consensus client peers with the gateway, and Optimum calls that link Signal. Blocks then reach your node through mump2p as well as through the usual gossip, which is never removed. Optimum reports blocks arriving 2 to 4 times faster on mainnet.'),
    e('Optimum does not host gateways for anyone. The gateway is free and open source, and an independent firm, ProbeLab, audited it in two rounds in 2026.'),
  ],
  measured: e('2 to 4 times faster is Optimum\'s own mainnet figure. An independent test by StereumLabs in September 2026, on 36 mainnet nodes without validators, saw blocks earlier on Lighthouse, Prysm and Grandine, no change on Teku and slower blocks on Nimbus; Optimum replied that acceleration was on for every node during that test.'),
  paths: [
    { id: 'validator', h: e('You run validators'), p: e('The gateway sits beside your beacon node. You peer your consensus client with it, then register your validator indices in Console.'), who: e('Staking providers, solo stakers, node operators') },
    { id: 'stream', h: e('You do not run validators'), p: e('Stream only: the gateway takes blocks from the mesh and serves them on your own machine, at ws://127.0.0.1:9600 and on gRPC at 127.0.0.1:9601. No beacon node, no validator indices.'), who: e('Builders, researchers, community members who want to take part') },
  ],
  before: [
    e('A machine that runs Docker. For validators it must reach your beacon node; stream only can run on any host you control.'),
    e('Inbound TCP 33212 for your consensus client and 33213 for the mesh. At home, 33213 has to be forwarded on your router so peers on the internet can reach it.'),
    e('Outbound HTTPS on port 443, to auth.getoptimum.io and bootstrap.getoptimum.io.'),
    e('Two folders that survive restarts: $HOME/optimum-gateway/libp2p and $HOME/optimum-gateway/mump2p. They keep the gateway\'s identity, so its peer id never changes.'),
    e('A unique name for the gateway. A name already used in your account is refused.'),
    e('A clock in sync. Keep the host within about 30 seconds of UTC, or sign in tokens fail.'),
    e('On Fedora, RHEL, Rocky or Alma, turn on the SELinux relabel option in Console before you copy the command.'),
  ],
  steps: [
    { h: e('Create a Console account'), p: e('Open console.getoptimum.xyz and sign up with Google or Microsoft. Registration asks two things: how you take part, as an individual or an entity, and whether you run validators. Answering no is fine and leads to the stream only gateway.'), link: 'https://console.getoptimum.xyz/' },
    { h: e('Mint an enrollment key'), p: e('Choose the network in the header first, Ethereum or Hoodi; each network needs its own key. The secret is shown once, so save it when it appears. The onboarding key lasts 14 days, a key made on the Signal page lasts one day.') },
    { h: e('Name your gateway'), p: e('Console writes the name into the command as OPT_GATEWAY_ID. Without a name the gateway enrolls as dev-gateway.') },
    { h: e('Start the gateway'), p: e('Copy the command from Console rather than typing it: it carries your key and your cluster. It has this shape. Never add --network host, which would publish the gateway\'s telemetry on every interface.'), code: 'run' },
    { h: e('Check its health'), p: e('On the gateway machine itself. 200 with "healthy" means it works. A 503 that lists cl_peers is normal for a validator setup until your client peers; a stream only gateway waits for its first block.'), code: 'health' },
    { h: e('Peer your consensus client'), p: e('Read the gateway\'s peer id, build the address /ip4/<host>/tcp/33212/p2p/<peer id> with an address your client can reach, and add it with your client\'s flag. Stream only gateways skip this step.'), code: 'peer' },
    { h: e('Verify in Console'), p: e('Signal checks three things from outside: Gateway enrolled, Seen by Optimum in the last ten minutes, and Blocks arriving on the mesh. Then register your validator keys, or for stream only, start reading the feed.') },
  ],
  code: {
    run: 'mkdir -p $HOME/optimum-gateway/libp2p $HOME/optimum-gateway/mump2p\nexport OPT_JOIN_KEY=<your enrollment key>\n\ndocker run -d --name optimum-gateway \\\n  -p 33212:33212 -p 33213:33213 -p 127.0.0.1:48123:48123 \\\n  -e OPT_JOIN_KEY \\\n  -e OPT_GATEWAY_CLUSTER_ID=<cluster id from Console> \\\n  -e OPT_GATEWAY_ID=<your gateway name> \\\n  -e OPT_ENABLE_TELEMETRY=true -e OPT_REMOTE_PUSH_ENABLE=true \\\n  -v $HOME/optimum-gateway/libp2p:/tmp/libp2p \\\n  -v $HOME/optimum-gateway/mump2p:/tmp/mump2p \\\n  docker.io/getoptimum/gateway:latest -config ""',
    stream: '# stream only: drop -p 33212:33212 and add\n  -p 127.0.0.1:9600:9600 -p 127.0.0.1:9601:9601 \\\n  -e OPT_STREAM_ENABLE=true -e OPT_STREAM_ONLY=true \\\n  -e OPT_STREAM_ADDR=0.0.0.0:9600 -e OPT_STREAM_GRPC_ADDR=0.0.0.0:9601 \\',
    health: 'curl http://localhost:48123/health',
    peer: 'curl -s http://localhost:48123/api/v1/self_info   # read peer_id',
  },
  clients: [
    ['Prysm', '--peer=', e('v7.1.8 or later. Re-dials by itself.')],
    ['Teku', '--p2p-direct-peers=', e('Set --p2p-static-peers to the same address; v26.4.0 or later.')],
    ['Nimbus', '--direct-peer=', e('Needs a stable --netkey-file.')],
    ['Lodestar', '--directPeers=', e('Not --bootnodes, which is only for discovery.')],
    ['Lighthouse', 'OPT_DIRECT_CL_PEERS', e('The gateway dials Lighthouse: read data.p2p_addresses from /eth/v1/node/identity and set it on the gateway.')],
  ],
  clientNote: e('For Teku, Nimbus, Lodestar and Lighthouse, also set OPT_DIRECT_CL_PEERS on the gateway so the link comes back after a restart. Once it is set, port 33212 only accepts the clients you named.'),
  fixes: [
    [e('/health says 503 right after start'), e('Expected until your client peers. Use Verify in Console to see whether the gateway reached Optimum.')],
    [e('curl to port 48123 is refused from your laptop'), e('The port is bound to the gateway machine only. Run the command there.')],
    [e('The peer id changed after a restart'), e('The two identity folders were not mounted. Mount them, read self_info again and update your client.')],
    [e('write identity data: permission denied'), e('SELinux is blocking the identity folders. Turn on the relabel option in Console and run the new command.')],
    [e('Seen by Optimum fails'), e('The container is not running or outbound 443 is closed. Check docker ps and your firewall.')],
    [e('Blocks arriving fails'), e('Inbound 33212 and 33213 are not reachable. Open them, and forward 33213 on your router at home.')],
    [e('mump2p_peers stays at 0'), e('Usually a key and cluster that do not match the network, or no outbound HTTPS. Wait two to five minutes, then check both.')],
    [e('A changed setting does nothing'), e('Restarting keeps the old settings. Remove the container with docker rm -f optimum-gateway and run the command again.')],
    [e('Sign in errors with a key that looks fine'), e('The host clock has drifted. Turn on time sync.')],
    [e('I lost the enrollment key'), e('It cannot be shown again. Mint a new one under Gateways and keys; gateways that already enrolled keep working.')],
  ],
  windows: [
    e('Docker Desktop runs the gateway on Windows. Turn on "Start Docker Desktop when you sign in" so the gateway comes back after a reboot.'),
    e('In PowerShell, set the key with $env:OPT_JOIN_KEY = "<key>", end each line of the command with a backtick instead of a backslash, and call curl.exe rather than curl, which PowerShell maps to something else.'),
    e('At home, forward TCP 33213 on your router to the PC, and allow Docker Desktop through Windows Defender Firewall when it asks.'),
    e('A small watchdog keeps it running: a scheduled task that checks the health every five minutes and restarts the container after two failed checks in a row.'),
  ],
  watchdog: '# C:\\optimum\\watchdog.ps1\n$flag = "$env:TEMP\\optimum-gateway.fail"\n$code = curl.exe -s -o NUL -w "%{http_code}" http://localhost:48123/health\nif ($code -eq "200") { Remove-Item $flag -ErrorAction SilentlyContinue }\nelseif (Test-Path $flag) { docker restart optimum-gateway | Out-Null; Remove-Item $flag }\nelse { New-Item $flag -Force | Out-Null }\n\n# run it every five minutes\nschtasks /Create /SC MINUTE /MO 5 /TN "Optimum gateway watchdog" /TR "powershell -NoProfile -ExecutionPolicy Bypass -File C:\\optimum\\watchdog.ps1"',
  windowsBy: 'ecamli',
  news: [
    ['2025-09-23', e('Hoodi testnet results: 30 nodes, each with an Optimum gateway beside its consensus client, about 150 ms average propagation.'), 'https://x.com/get_optimum/status/1970835716763779082'],
    ['2026-08-10', e('Optimum makes the gateway free and open source, and says validator access will stay free.'), 'https://www.getoptimum.xyz/blog/free-and-faster-ethereum-beacon-block-propagation'],
    ['2026-08-18', e('ProbeLab publishes its two round security audit of the gateway: no critical findings, the two high ones fixed.'), 'https://probelab.io/blog/security-audit-report-optimum-gateway/'],
    ['2026-10-20', e('mump2p reaches Ethereum mainnet, free for every node operator.'), '/weekly/001/'],
    ['2026-10-22', e('Self onboarding opens to everyone through Console.'), 'https://x.com/get_optimum/status/2113303834294636561'],
    ['2026-11-28', e('The current release is v1.3.6. v1.3.4 fixed a security issue, so anything older than v1.3.4 should be upgraded.'), 'https://getoptimum.github.io/optimum-gateway/versions/latest/release-notes'],
  ],
  links: [
    ['Console', 'https://console.getoptimum.xyz/'],
    ['Operator docs', 'https://docs.getoptimum.xyz/'],
    ['Gateway manual', 'https://getoptimum.github.io/optimum-gateway/versions/latest/'],
    ['Troubleshooting', 'https://getoptimum.github.io/optimum-gateway/versions/latest/troubleshoot'],
    ['Release notes', 'https://getoptimum.github.io/optimum-gateway/versions/latest/release-notes'],
    ['Docker image', 'https://hub.docker.com/r/getoptimum/gateway'],
    ['HOP, Grafana dashboards', 'https://getoptimum.github.io/optimum-hop'],
    ['ProbeLab audit', 'https://probelab.io/blog/security-audit-report-optimum-gateway/'],
  ],
};

// ---------- Optimum GIFs on Tenor: by the community, collected 28 November 2026. [slug, media, title, Tenor user, width, height] ----------
export const GIFS = [["optimum-bayrak-gif-12120597632180303472","https://media1.tenor.com/m/qDUDVCuMNnAAAAAd/optimum-bayrak.gif","Optimum Bayrak","ecamli",374,374],["optimum-birazdan-gif-7203211553734522998","https://media1.tenor.com/m/Y_byvm5V-HYAAAAC/optimum-birazdan.gif","Optimum Birazdan","ecamli",498,498],["optimum-dans-gif-821838435107104804","https://media1.tenor.com/m/C2fBs9NSaCQAAAAd/optimum-dans.gif","Optimum Dans","ecamli",374,374],["optimum-doner-gif-2160009361065445924","https://media1.tenor.com/m/HfnlEdXTCiQAAAAd/optimum-doner.gif","Optimum Doner","ecamli",374,374],["optimum-dünya-gif-290110861232760668","https://media1.tenor.com/m/BAauSo1C51wAAAAd/optimum-d%C3%BCnya.gif","Optimum Dünya","ecamli",374,330],["optimum-efkar-gif-10321643121090622097","https://media1.tenor.com/m/jz3Xu3L18pEAAAAd/optimum-efkar.gif","Optimum Efkar","ecamli",374,374],["optimum-erikdali-gif-17473181163934998210","https://media1.tenor.com/m/8n01sRRkXsIAAAAd/optimum-erikdali.gif","Optimum Erikdali","ecamli",374,374],["optimum-gandalf-gif-4997298660642526762","https://media1.tenor.com/m/RVn4p7AiFioAAAAd/optimum-gandalf.gif","Optimum Gandalf","ecamli",374,374],["optimum-gif-9508188281600842478","https://media1.tenor.com/m/g_Pe3ZZZmu4AAAAC/optimum.gif","Optimum","ecamli",360,360],["optimum-gol-gif-12288369155313660384","https://media1.tenor.com/m/qokOo-NWceAAAAAd/optimum-gol.gif","Optimum Gol","ecamli",374,270],["optimum-halay-gif-1754667247810871177","https://media1.tenor.com/m/GFnUkLTHf4kAAAAd/optimum-halay.gif","Optimum Halay","ecamli",374,234],["optimum-horon-gif-3522225888811137164","https://media1.tenor.com/m/MOF1yMlFuIwAAAAd/optimum-horon.gif","Optimum Horon","ecamli",374,374],["optimum-ironman-gif-8352551815850394163","https://media1.tenor.com/m/c-o5n2_OgjMAAAAd/optimum-ironman.gif","Optimum Ironman","ecamli",374,374],["optimum-kadro-gif-10011560783330492579","https://media1.tenor.com/m/ivA1fSmlQKMAAAAC/optimum-kadro.gif","Optimum Kadro","ecamli",498,277],["optimum-kahkaha-gif-16021436993019404799","https://media1.tenor.com/m/3leUD1g5Yf8AAAAd/optimum-kahkaha.gif","Optimum Kahkaha","ecamli",374,374],["optimum-kalp-gif-1391844095770857859","https://media1.tenor.com/m/E1DS1K8lkYMAAAAC/optimum-kalp.gif","Optimum Kalp","ecamli",480,423],["optimum-kazaska-gif-17369452249391205111","https://media1.tenor.com/m/8QywyyQSivcAAAAd/optimum-kazaska.gif","Optimum Kazaska","ecamli",374,374],["optimum-moonwalk-gif-915930108766855724","https://media1.tenor.com/m/DLYJlMQiIiwAAAAC/optimum-moonwalk.gif","Optimum Moonwalk","ecamli",498,498],["optimum-pas-gif-9767048138595863194","https://media1.tenor.com/m/h4uGiLUlipoAAAAC/optimum-pas.gif","Optimum Pas","ecamli",498,285],["optimum-rango-gif-3572513910137282531","https://media1.tenor.com/m/MZQeeSjf3-MAAAAd/optimum-rango.gif","Optimum Rango","ecamli",374,374],["optimum-selam-gif-11804648930666657775","https://media1.tenor.com/m/o9KJqKKUt-8AAAAC/optimum-selam.gif","Optimum Selam","ecamli",360,360],["optimum-serit-gif-11239378069840548375","https://media1.tenor.com/m/m_pKzkUpUhcAAAAC/optimum-serit.gif","Optimum Serit","ecamli",498,208],["optimum-thor-gif-14052878020261295712","https://media1.tenor.com/m/wwXaGqWRtmAAAAAd/optimum-thor.gif","Optimum Thor","ecamli",374,374],["optimum-training-gif-5974871983135127687","https://media1.tenor.com/m/UusCaZUz-IcAAAAd/optimum-training.gif","Optimum Training","ecamli",374,374],["optimum-twerk-gif-14653686929692507925","https://media1.tenor.com/m/y1xan74bPxUAAAAC/optimum-twerk.gif","Optimum Twerk","ecamli",498,449],["optimum-gmum-rlnc-gif-17295341824527354054","https://media1.tenor.com/m/8AVlwTfoyMYAAAAC/optimum-gmum.gif","Optimum Gmum","vssema",498,279],["optimum-rlnc-gmum-gif-17971291270478111818","https://media1.tenor.com/m/-WbaMcvtJEoAAAAC/optimum-rlnc.gif","Optimum Rlnc","vssema",498,279],["optimum-shard-get-optimum-gif-3717045147042817100","https://media1.tenor.com/m/M5WY3hOTpEwAAAAd/optimum-shard.gif","Optimum Shard","vssema",414,498],["optimum-gmum-gif-7156286031237547700","https://media1.tenor.com/m/Y1A8OtMBBrQAAAAC/optimum-gmum.gif","Optimum Gmum","ccshark64",498,281],["rlnc-powered-by-optimum-gif-7212878624505060078","https://media1.tenor.com/m/ZBlK5L2h2u4AAAAd/rlnc-powered-by-optimum.gif","Rlnc Powered By Optimum","shahriar4222",400,317],["dancer-dance-robot-optimum-community-gif-11159051941437694909","https://media1.tenor.com/m/mtzqnheG470AAAAC/dancer-dance.gif","Dancer Robot","yes2511",213,320],["funny-laugh-laughing-optimum-lol-gif-3666788465999098882","https://media1.tenor.com/m/MuMMrq5gNAIAAAAC/funny-laugh.gif","Funny Laugh","yes2511",130,130],["laughing-smile-kek-meme-funny-gif-553364017685271095","https://media1.tenor.com/m/B63xpGmdEjcAAAAC/laughing-smile.gif","Laughing Smile Sticker","yes2511",320,320],["like-reply-x-twitter-robot-gif-15646872590512048083","https://media1.tenor.com/m/2STbuGtER9MAAAAC/like-reply.gif","Like Reply","yes2511",320,320],["optimum-optimumnetwork-robot-run-speed-gif-2065569412374212655","https://media1.tenor.com/m/HKpgb8t6MC8AAAAC/optimum-optimumnetwork.gif","Optimum Optimumnetwork","yes2511",320,320],["optimum-alexfix37-flexnodes-gif-7003603128933421458","https://media1.tenor.com/m/YTHL8GfkEZIAAAAC/optimum-alexfix37.gif","Optimum Alexfix37","alexfix",400,400]];

// ---------- Community calls ----------
// Optimum's weekly Discord community call, in short. Every point is our own summary of the recaps linked under each call;
// the recaps were written by community members who were on the call. Tags drive the topic filter on /calls/.
const PG = (id) => ['Pegasus', `https://x.com/ada_pegasus/status/${id}`];
export const CALLS = [
  { date: '2026-11-05', host: 'Jeff', tags: ['community'], src: [PG('2118403886507770228')],
    h: { en: 'Jeff\'s last call, and Flash takes over' },
    points: [
      { en: 'Jeff, who hosted the calls from the start, said his last day at Optimum was the day after this call. He stays in the community on X and Discord but no longer hosts calls.' },
      { en: 'Flash is now the main contact for community matters and campaigns, working with the moderators and Mumbassadors.' },
      { en: 'CMO Eli Laipson thanked Jeff and named the Treasure Hunt as the campaign that got the community going.' },
      { en: 'Ten winners of the Halloween meme competition were announced and got TurboCards codes right after the call.' },
    ] },
  { date: '2026-10-22', host: 'Jeff', tags: ['mainnet', 'community'], src: [PG('2114407336773382447')],
    h: { en: 'Live on Ethereum mainnet, and TurboCards' },
    points: [
      { en: 'Optimum is live on Ethereum mainnet, so any validator or operator can now join through the website, Hub and Console.' },
      { en: 'TurboCards: 999 cards marking the launch, each showing how much Optimum sped up a real block, in several rarities.' },
      { en: 'The cards have no monetary value and are soulbound: once minted they cannot be moved, shared or sold.' },
      { en: 'About 400 codes went out in the first wave, with more drops for Refined and higher roles, then Real OG and Observer.' },
    ] },
  { date: '2026-10-08', host: 'Jeff', tags: ['events', 'mainnet', 'community'], src: [PG('2108505997811789938')],
    h: { en: 'TOKEN2049, trading speed, and a smaller server' },
    points: [
      { en: 'The team was at TOKEN2049 in Singapore and co-hosted an event with AMBR on AI agents and on chain trading.' },
      { en: 'The pitch for traders: they pay heavily for fractions of a millisecond, and Optimum is built to move data faster. A video on this was recorded.' },
      { en: 'Mainnet comes before Flexnodes, with exciting things promised for the next few weeks.' },
      { en: 'After another purge of inactive accounts the server is down to about 38,000 members.' },
    ] },
  { date: '2026-10-01', host: 'Jeff', tags: ['mainnet', 'flexnodes', 'roles', 'events'], src: [PG('2105762208450056570')],
    h: { en: 'Mainnet this year, "90% certain"' },
    points: [
      { en: 'Mainnet was planned for this year with 90% certainty. Flexnodes details would follow later.' },
      { en: 'At Korea Blockchain Week the team hosted its third CODED side event, with Lido, ether.fi, Nethermind, Four Pillars, Auros and Figment on stage.' },
      { en: 'There is no fixed cap on Chronicler or Optimized. The bar for Optimized is high on purpose, and quality counts more than volume.' },
      { en: 'Roles are handed out gradually, so people who keep contributing should expect to be recognised over time.' },
    ] },
  { date: '2026-09-24', host: 'Jeff', tags: ['mainnet', 'flexnodes', 'events'], src: [PG('2103427160820347146')],
    h: { en: 'Mainnet: "you won\'t have to wait much longer"' },
    points: [
      { en: 'A roadmap update is being prepared. Building at the networking layer takes more testing than an L1 or an app, but mainnet is close.' },
      { en: 'Something closely tied to Flexnodes would open to the community soon. No dates yet for DeRAM and DeROM.' },
      { en: 'TwinStake, an institutional staking provider, joined as a mump2p partner.' },
      { en: 'Optimum is hiring a Crypto Markets and Trading Lead. CPO Sajida Zouarhi spoke at ETHSofia, and the team headed to Korea Blockchain Week.' },
    ] },
  { date: '2026-09-17', host: 'Jeff', tags: ['flexnodes', 'roles', 'community'], src: [PG('2100656146092847445')],
    h: { en: 'How roles are judged, and AI content' },
    points: [
      { en: 'Flexnodes are being prepared for launch, and the community will get to take part in some way.' },
      { en: 'mump2p is judged by two things: higher validator earnings and faster attestations.' },
      { en: 'The higher the role, the stricter the review: quality first, then volume, engagement (read with care because of bots) and impact.' },
      { en: 'Using AI is fine and does not mean low effort. Any strong contribution, creative work included, can lead to a higher role.' },
    ] },
  { date: '2026-08-27', host: 'Jeff', tags: ['hunt', 'events'], src: [PG('2093057386261168277')],
    h: { en: 'The Treasure Hunt raffle, run again properly' },
    points: [
      { en: 'The raffle from three months earlier was rushed: some people without the fourth fragment entered, some entered twice.' },
      { en: 'The list was checked again, duplicates and ineligible entries removed, and earlier winners left out. Ten winners got $100 each.' },
      { en: 'The team was on APAC tour part one: Singapore, Shenzhen and Hong Kong. Asia matters for trading volume and builders.' },
      { en: 'Big announcements were hinted at once the raffle was done.' },
    ] },
  { date: '2026-07-31', host: 'Jeff', tags: ['community'], src: [PG('2083282654573863321')],
    h: { en: '"Speed is money", and a 49k server' },
    points: [
      { en: 'DeRAM and DeROM left the docs for positioning reasons, not because the roadmap changed. The message is now a superhighway for data.' },
      { en: 'No plans with Kaito. The mysterious numbers 32 and 6700 stayed unsolved.' },
      { en: 'Regional voice chats may open only where a Mumbassador can help with language and moderation.' },
      { en: 'Purges took the server from 150k to 49k members. The leadership team says it sees the work of Mumbassadors, Refined and Observers.' },
    ] },
  { date: '2026-07-02', host: 'Jeff', tags: ['mainnet', 'flexnodes', 'roles', 'community'], src: [PG('2072731361002283213')],
    h: { en: 'Calls are back' },
    points: [
      { en: 'New campaigns are being built with social media manager rxndy, and game nights and karaoke are coming back.' },
      { en: 'Optimum opened a TikTok channel and posts more on YouTube, with prizes for video content on the way.' },
      { en: 'Mainnet is close, and it is not connected to the role system. Flexnodes are still in development.' },
      { en: 'No new Mumbassadors for now. Purges happen without warning, and Optimized is coming but hard to get by design.' },
    ] },
  { date: '2026-05-14', host: 'Jeff', tags: ['events', 'community'], src: [PG('2054949956956430821')],
    h: { en: 'Consensus Miami and a UNICEF donation' },
    points: [
      { en: 'Talks at Consensus 2026 in Miami should turn into partnerships announced later.' },
      { en: 'Optimum gave $1,000 to UNICEF, unlocked by members replying GMUM on a thread.' },
      { en: 'Muriel Médard received the IEEE Richard W. Hamming Medal. Kent Lin\'s BUIDL Asia keynote is online.' },
      { en: 'Using the bot hunt command now costs XP. One good post a week beats many weak ones.' },
    ] },
  { date: '2026-04-30', host: 'Jeff', tags: ['hunt', 'community'], src: [PG('2049879635396379059')],
    h: { en: 'RLNC on video, and hunt rewards in two phases' },
    points: [
      { en: 'A new video has Muriel Médard comparing RLNC with other coding methods in a simulation, which the team says to read as a simulation.' },
      { en: 'Token: all options are being explored, nothing decided.' },
      { en: 'Merch delays came from the store and are fixed. Another karaoke night is planned.' },
      { en: 'Four fragment hunt rewards come in two phases, after wallets are checked for cheating.' },
    ] },
  { date: '2026-04-23', host: 'Jeff', tags: ['events', 'mainnet', 'flexnodes'], src: [PG('2047345121440743661')],
    h: { en: 'BUIDL Asia, and Network Simulator 2.0' },
    points: [
      { en: 'Optimum hosted CODED at BUIDL Asia, where COO Kent Lin gave the keynote on the first universal data acceleration network.' },
      { en: 'A blog post showed how lower latency raises staking revenue, and partners responded well.' },
      { en: 'Network Simulator 2.0, built by Abbas, compares RLNC, Reed Solomon and no coding under the same conditions.' },
      { en: 'Ethereum mainnet comes before Flexnodes, "pretty soon". Flexnode rewards are still to be decided.' },
    ] },
  { date: '2026-04-02', host: 'Jeff', tags: ['flexnodes', 'roles', 'hunt', 'events'], src: [PG('2039727791697232073')],
    h: { en: 'Roles are not a ladder, and the fourth hunt' },
    points: [
      { en: 'The team went to EthCC in Cannes. Flexnodes will go to partners first, then to the community.' },
      { en: 'Real OG, Refined, Optimized and Chronicler are not strictly ranked: each brings its own benefits. No new Real OGs.' },
      { en: 'Higher roles will stay few, and a live purge of inactive accounts, Real OGs included, was under way.' },
      { en: 'The fourth Treasure Hunt was close and tied to the Latency Lords game, and harder than the earlier ones.' },
    ] },
  { date: '2026-03-19', host: 'Jeff', tags: ['flexnodes', 'roles', 'hunt', 'events'], src: [PG('2034667374906073150')],
    h: { en: 'From ambassador to team member' },
    points: [
      { en: 'Abbas, who built Latency Lords, joined the Optimum team after starting as a Technical Ambassador. Good work gets noticed.' },
      { en: 'The Latency Lords prize would go to the right person once cheating was sorted out.' },
      { en: 'Chronicler and Optimized should start in the next couple of months and need steady contribution. Inactive Real OGs will be removed.' },
      { en: 'The paid promotion label on X is needed only when you were paid for that exact post.' },
    ] },
  { date: '2026-03-12', host: 'Jeff', tags: ['roles', 'hunt'], src: [PG('2032141537480753445')],
    h: { en: 'Roles one step at a time' },
    points: [
      { en: 'The top of the Latency Lords leaderboard wins a prize, and the game feeds into the fourth Treasure Hunt.' },
      { en: 'Muriel Médard was in MIT News for the Hamming Medal.' },
      { en: 'Role upgrades are reviewed weekly on quality and helpfulness, and roles are earned one at a time with no skipping.' },
      { en: 'More events, regional voice channels and a feedback channel are coming in phases.' },
    ] },
  { date: '2026-03-05', host: 'Jeff', tags: ['roles', 'flexnodes', 'hunt'], src: [PG('2029611186384425089')],
    h: { en: 'The first roles, and a game of our own' },
    points: [
      { en: 'New roles were handed out that day, and a game made only for the Optimum community launched.' },
      { en: 'The next Treasure Hunt was set for about two weeks later.' },
      { en: 'Flexnodes should run on almost any machine in the end, and people who run them will be rewarded. They come after mainnet has run a while.' },
      { en: 'The DeCo workshop is closed, so a summary and clips follow instead of a stream.' },
    ] },
  { date: '2026-02-26', host: 'Jeff', tags: ['events', 'community'], src: [PG('2027055280899723573')],
    h: { en: 'ETHDenver, and a nod from the Ethereum Foundation' },
    points: [
      { en: 'Muriel Médard gave a keynote at CapSummit during ETHDenver, and the team showed fast propagation on the Hoodi testnet.' },
      { en: 'Justin Drake of the Ethereum Foundation said on a podcast that RLNC beats what Ethereum uses today.' },
      { en: 'Roles have no fixed schedule: active members are reviewed weekly, and standout work can be rewarded any time.' },
      { en: 'Merch is not sold, only given to the community.' },
    ] },
  { date: '2026-02-19', host: 'Jeff', tags: ['roles', 'hunt'], src: [['SUCCESS_OG_', 'https://x.com/SUCCESS_OG_/status/2024808110917824968'], ['Amelia', 'https://x.com/Amelia175348/status/2024536698475204823']],
    h: { en: 'First roles in March' },
    points: [
      { en: 'The team watches how people contribute, not only how often: quality, value and consistency over time.' },
      { en: 'The first batch of new roles would be given in March, based on past contributions.' },
      { en: 'Rewards confirmed for three Treasure Hunt fragments, and bigger ones for four.' },
      { en: 'A new event follows the hunt, and big news was hinted at.' },
    ] },
  { date: '2026-01-15', host: null, tags: ['roles', 'hunt'], src: [['jany268', 'https://x.com/jany268/status/2012041254834749676']],
    h: { en: 'A new role system, and the 2026 kickoff' },
    points: [
      { en: 'The 2026 kickoff call was set for the next day, with live questions and rewards for the best ones.' },
      { en: 'The final Treasure Hunt in February would be much bigger, possibly with other projects. All four fragments unlock a large reward paid in two phases.' },
      { en: 'A new role system with special roles for contributors and creators was being built, and the old OG role would go.' },
    ] },
  { date: '2025-11-06', host: null, tags: ['hunt', 'community'], src: [['husoco', 'https://x.com/husoco/status/1986431073421828136']],
    h: { en: 'Ambassador program, and the second hunt' },
    points: [
      { en: 'The ambassador program would open to applications soon.' },
      { en: 'Treasure Hunt 2 was due the following week.' },
      { en: 'One Zealy sprint was left in the RealOG campaign, with results 10 days after it ended.' },
    ] },
  { date: '2025-08', host: null, tags: ['events', 'flexnodes'], src: [['0xayeee', 'https://x.com/0xayeee/status/1955813149862715566']],
    h: { en: 'Wave one validators and the case for RLNC' },
    points: [
      { en: 'The team had been at Solana Accelerate and Consensus, and in France co-hosted events with Everstake and the Ethereum Foundation.' },
      { en: 'Research: RLNC against Reed Solomon and fountain codes, and why decentralisation can help scale and security together.' },
      { en: 'mump2p, the first product, ran a private testnet in April and May 2025, about 2 times faster than Ethereum networking at low load and 20 times at high load.' },
      { en: 'Wave one partners included Kiln, P2P.org, Everstake and Blockdaemon. Next: more validators, hacknets and Flexnodes.' },
    ] },
];

// the three questions people asked on almost every call, and how the answer moved
export const CALL_THREADS = [
  { id: 'mainnet', h: { en: 'Mainnet' }, steps: [
    ['2026-04-23', { en: 'Comes before Flexnodes, "pretty soon".' }],
    ['2026-09-24', { en: '"You won\'t have to wait much longer."' }],
    ['2026-10-01', { en: 'This year, 90% certain.' }],
    ['2026-10-22', { en: 'Live on Ethereum mainnet.' }],
  ] },
  { id: 'flexnodes', h: { en: 'Flexnodes' }, steps: [
    ['2026-03-05', { en: 'Light enough for almost any machine, and rewarded.' }],
    ['2026-04-02', { en: 'Partners first, then the community.' }],
    ['2026-09-17', { en: 'Being prepared for launch.' }],
    ['2026-10-08', { en: 'Still after mainnet. No date yet.' }],
  ] },
  { id: 'roles', h: { en: 'Roles' }, steps: [
    ['2026-01-15', { en: 'A new role system is being built.' }],
    ['2026-03-05', { en: 'The first new roles are handed out.' }],
    ['2026-03-12', { en: 'Earned one at a time, reviewed weekly.' }],
    ['2026-10-01', { en: 'No cap on Chronicler or Optimized. Quality first.' }],
  ] },
];

// ---------- Brand kit ----------
// Everything here is from Optimum's own Brand Assets page (linked from getoptimum.xyz) and its Brand Guidelines, March 2026.
// The logo files in /brand/ are Optimum's originals, shown for preview; downloads go to the official page.
export const BRAND = {
  source: 'https://getoptimum.notion.site/Optimum-Brand-Assets-1a6fe54341398098843bc5847670e5ed',
  edition: '2026-03',
  logos: [
    { id: 'logo-dark', file: 'optimum-logo-white.svg', bg: '#282C34', h: { en: 'Wordmark, light' }, p: { en: 'For dark backgrounds.' } },
    { id: 'logo-light', file: 'optimum-logo-black.svg', bg: '#FFFBFB', h: { en: 'Wordmark, dark' }, p: { en: 'For light backgrounds.' } },
    { id: 'mark-dark', file: 'optimum-icon-white.svg', bg: '#33363C', h: { en: 'The Goggles, light' }, p: { en: 'The mark on its own, for small spaces.' } },
    { id: 'mark-light', file: 'optimum-icon-black.svg', bg: '#9DB0C2', h: { en: 'The Goggles, dark' }, p: { en: 'On Platinum or any light colour from the palette.' } },
  ],
  about: [
    { en: 'At the heart of the brand is the Optimum logo and its double O, known as the Goggles. Optimum describes them as clarity, precision and a new way of seeing performance at scale.' },
    { en: 'The Goggles can stand alone when space is tight or a quieter presence fits better. The logo uses two colours only, light and dark, so it always reads clearly.' },
  ],
  donts: [
    ['stretch', { en: 'Don\'t stretch or distort it' }],
    ['rotate', { en: 'Don\'t rotate it' }],
    ['color', { en: 'Don\'t change its colour' }],
    ['shadow', { en: 'Don\'t add a drop shadow' }],
    ['gradient', { en: 'Don\'t fill it with a gradient' }],
    ['change', { en: 'Don\'t redraw or retype it' }],
  ],
  rules: [
    { en: 'Leave clear space around the logo. The guide measures it with the O of the logo itself, on every side.' },
    { en: 'Keep the Goggles in proportion inside an app icon or favicon frame, the way the guide\'s mockups show.' },
    { en: 'Next to another brand, keep both clearly apart: line them up, give them equal space and join them with a ×.' },
  ],
  primary: [['Alabaster', '#FFFBFB'], ['Steel', '#D3DBE2'], ['Plutonium', '#B0BED1'], ['Platinum', '#9DB0C2'], ['Carbon', '#33363C'], ['Midnight', '#282C34']],
  secondary: [['Lavender', '#B87CFF'], ['Peach', '#FEA158'], ['Mint Haze', '#64E27F'], ['Azure', '#51B1FE']],
  gradient: ['#FFFBFB', '#D3DBE2'],
  colorNote: { en: 'The primary colours are greys and near blacks, chrome rather than colour. The four secondary colours are accents, used sparingly. The brand gradient runs from Alabaster to Steel.' },
  type: [
    { face: 'ABC Diatype', role: { en: 'Headlines', }, weights: 'Light, Regular', spec: { en: 'Letter spacing −3%, line height 110%' }, note: { en: 'A licensed typeface by Dinamo.' }, url: 'https://abcdinamo.com/typefaces/diatype' },
    { face: 'Geist', role: { en: 'Subheadings, body text, buttons' }, weights: 'Regular, Medium, Semibold', spec: { en: 'Body: spacing 0%, line height 150%. Buttons and small headings: spacing 8%.' }, note: { en: 'Free and open source, by Vercel.' }, url: 'https://vercel.com/font' },
  ],
  typeNote: { en: 'Write headlines in sentence case.' },
  blobs: [
    { en: 'Meta-blobs are Optimum\'s main visual signature: fluid, chrome shapes that stand for data in motion. They are used in still and animated work.' },
    { en: 'Flat blobs are for infographics and diagrams, and blob style icons are used sparingly.' },
  ],
  words: [
    ['about', { en: 'About Optimum' }, 'Optimum is building the universal data acceleration network for blockchains - a high-throughput, low-latency networking protocol powered by Random Linear Network Coding (RLNC).'],
    ['boiler', { en: 'Short company description' }, 'Incubated at MIT & Harvard, Optimum is building the universal data acceleration network for blockchains, starting with a high-throughput, low-latency networking protocol powered by Random Linear Network Coding (RLNC). Co-founded by Muriel Médard, co-inventor of RLNC, and a team of industry experts, Optimum introduces a breakthrough in blockchain infrastructure that enables high-speed data propagation, fast access, and secure updates, scaling any blockchain.'],
  ],
  taglines: ['Optimum is the universal data acceleration network.', 'Data movement sets the ceiling. Optimum raises it.', 'Scale Any Chain.', 'Transmit Less. Deliver More.', 'Decentralize to Scale.'],
  analogy: 'Optimum is analogous to the internet protocol: upgrading the internet\'s delivery layer, like moving from older transport assumptions to modern delivery, so data reaches its destination faster and more consistently.',
  links: [['Brand Assets', 'https://getoptimum.notion.site/Optimum-Brand-Assets-1a6fe54341398098843bc5847670e5ed'], ['getoptimum.xyz', 'https://getoptimum.xyz/'], ['X', 'https://x.com/get_optimum'], ['Discord', 'https://discord.gg/7EwFpu79cZ']],
};

// ---------- This week band ----------
// Community events for the band on the home page: the past week and the next two. Times are UTC; the page shows them
// in the reader's own time. An entry with every: 7 repeats weekly from its first date. Sources are the posts that announced them.
export const WEEKLY = [
  { id: 'ua-ama', kind: 'ama', every: 7, start: '2026-11-19T18:00Z', mins: 60,
    h: { en: 'Weekly regional AMA' }, where: { en: 'Hosted by Mumbassador samurai.itan, in the Discord' },
    url: 'https://x.com/samurai_itan/status/2125637735230644417' },
  { id: 'vn-ama', kind: 'ama', every: 7, start: '2026-11-15T08:00Z', mins: 90,
    h: { en: 'Vietnam community weekly AMA' }, where: { en: 'Vietnamese Voice stage, hosted by Pegasus' },
    url: 'https://x.com/PhucvinhN1965/status/2126573421320605997' },
  { id: 'quiz', kind: 'quiz', every: 7, start: '2026-11-14T00:00Z', mins: 1439, allDay: true,
    h: { en: 'Weekly regional quiz' }, where: { en: 'Every Saturday in the regional channels' },
    url: 'https://x.com/MysteryVerge/status/2121544975074890102' },
  { id: 'ua-games', kind: 'game', every: 7, start: '2026-11-27T18:00Z', mins: 90,
    h: { en: 'Weekly game night: LOL Beans' }, where: { en: 'Ukrainian community, hosted by Roman_sw09 and denys.h' },
    url: 'https://discord.com/channels/1354818163879182519/1413515509172928552' },
  { id: 'id-games', kind: 'game', every: 7, start: '2026-11-25T00:00Z', mins: 1439, allDay: true,
    h: { en: 'Indonesian community game night' }, where: { en: 'In the Indonesian voice channel, Roblox on 25 November' },
    url: 'https://discord.com/channels/1354818163879182519/1413513944592551967' },
  { id: 'karaoke-1121', kind: 'karaoke', start: '2026-11-21T13:00Z', mins: 120,
    h: { en: 'Karaoke Night: Vietnam, Türkiye and Pakistan' }, where: { en: 'Vietnamese Voice stage, hosted by Cutie Quinn' },
    url: 'https://x.com/PhucvinhN1965/status/2123688888917196904' },
  { id: 'karaoke-1128', kind: 'karaoke', start: '2026-11-28T13:00Z', mins: 120,
    h: { en: 'Karaoke Night: Vietnam, Türkiye, Pakistan and Bangladesh on one stage' }, where: { en: 'Vietnamese Voice stage, hosted by Cutie Quinn' },
    url: 'https://x.com/PhucvinhN1965/status/2126573421320605997' },
  { id: 'bbw-1128', kind: 'event', start: '2026-11-28T01:00Z', end: '2026-11-29T16:00Z',
    h: { en: 'Kent Lin and David Song at Binance Blockchain Week, Bangkok' }, where: { en: 'Ask them about Optimum for Traders' },
    url: 'https://x.com/get_optimum/status/2125246824923676737' },
  { id: 'battle-r1', kind: 'battle', start: '2026-11-30T00:00Z', end: '2026-12-07T23:59Z',
    h: { en: 'Regional Battle, round 1' }, where: { en: 'The 5 most active regions win TurboCards, 5 for first place' },
    url: 'https://discord.com/channels/1354818163879182519/1356459117362807004' },
  { id: 'battle-r2', kind: 'battle', start: '2026-12-14T00:00Z', end: '2026-12-21T23:59Z',
    h: { en: 'Regional Battle, round 2' }, where: { en: 'A second chance for every region to climb' },
    url: 'https://discord.com/channels/1354818163879182519/1356459117362807004' },
];
