import { VocabWord, Badge, ShipCustomization, RankInfo } from '../types/game';

export const VOCABULARY_LIST: VocabWord[] = [
  // --- PRIMARY 6 CURRICULUM CORE WORDS ---
  {
    id: 'robot',
    word: 'ROBOT',
    phonetic: '/ˈroʊ.bɑːt/',
    partOfSpeech: 'noun',
    category: 'Cybernetics & AI',
    definition: 'A machine capable of carrying out a complex series of actions automatically, especially one programmable by a computer.',
    sentence: 'The autonomous exploration robot rolled across the dusty Martian craters to collect mineral samples for the laboratory.',
    origin: 'Introduced in 1920 by Czech sci-fi playwright Karel Čapek in R.U.R., derived from the Slavic word "robota" (forced work or labor)!',
    synonyms: ['automaton', 'droid', 'machine assistant'],
    hint: 'A programmable automated machine built to perform complex physical tasks.'
  },
  {
    id: 'mechanical',
    word: 'MECHANICAL',
    phonetic: '/məˈkæn.ɪ.kəl/',
    partOfSpeech: 'adjective',
    category: 'Cybernetics & AI',
    definition: 'Operated by or relating to machines, moving gears, levers, and physical mechanisms.',
    sentence: 'With a whirring of titanium gears and motorized clicks, the mechanical airlock door sealed shut against the vacuum of space.',
    origin: 'From ancient Greek "mekhane" (machine, tool, device) through Latin "mechanicus".',
    synonyms: ['motorized', 'automated', 'machine-driven'],
    hint: 'Powered by moving gears, levers, motors, and physical machine parts.'
  },
  {
    id: 'blueprint',
    word: 'BLUEPRINT',
    phonetic: '/ˈbluː.prɪnt/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'A detailed technical drawing, architectural plan, or structural diagram for engineering a machine or spacecraft.',
    sentence: 'The chief aerospace engineer studied the holographic blueprint of the starship to pinpoint where the hyperdrive reactor was overheating.',
    origin: 'Originally made in 1842 using light-sensitive chemicals that turned vivid Prussian blue, leaving white schematic lines!',
    synonyms: ['technical plan', 'schematic diagram', 'architectural design'],
    hint: 'A detailed technical drawing or diagram showing how to construct a machine or building.'
  },
  {
    id: 'future',
    word: 'FUTURE',
    phonetic: '/ˈfjuː.tʃɚ/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'The period of time that will come after the present moment, often imagined in science fiction with advanced civilizations, flying cities, and star travel.',
    sentence: 'In the distant future, humanity has colonized moons across the solar system and harnessed clean energy from the stars.',
    origin: 'From Latin "futurus" (about to be), from the ancient root meaning "to become" or "to grow".',
    synonyms: ['tomorrow', 'time to come', 'forthcoming era'],
    hint: 'The time yet to come ahead of the present day.'
  },
  {
    id: 'alien',
    word: 'ALIEN',
    phonetic: '/ˈeɪ.li.ən/',
    partOfSpeech: 'noun',
    category: 'Space & Stars',
    definition: 'A hypothetical being or organism originating from a world or planet other than Earth.',
    sentence: 'The deep-space probe detected a gentle bioluminescent alien signaling with harmonic sound waves in the subterranean ocean of Europa.',
    origin: 'From Latin "alienus" (belonging to another, foreign), from "alius" (other).',
    synonyms: ['extraterrestrial', 'off-worlder', 'interplanetary being'],
    hint: 'A lifeform or creature from another planet or solar system.'
  },
  {
    id: 'space',
    word: 'SPACE',
    phonetic: '/speɪs/',
    partOfSpeech: 'noun',
    category: 'Space & Stars',
    definition: 'The boundless three-dimensional physical realm beyond Earth’s atmosphere where stars, planets, moons, and galaxies exist.',
    sentence: 'The starship glided in total silence through deep space, surrounded by billions of glowing constellations.',
    origin: 'From Latin "spatium" (extent, distance, open interval of area).',
    synonyms: ['cosmos', 'the void', 'outer universe'],
    hint: 'The vast, weightless vacuum beyond our atmosphere where planets and stars float.'
  },
  {
    id: 'black-hole',
    word: 'BLACK HOLE',
    phonetic: '/ˌblæk ˈhoʊl/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'A cosmic region of space where gravitational pull is so intense that nothing, not even particles or light, can escape from inside it.',
    sentence: 'The starship navigational computer computed an emergency hyperspace course to steer clear of the black hole’s swirling event horizon.',
    origin: 'Coined in astrophysicist circles and popularized worldwide in 1967 by theoretical physicist John Archibald Wheeler!',
    synonyms: ['gravitational abyss', 'cosmic singularity', 'light-trap'],
    hint: 'A point in space with gravity so strong that not even light can escape.'
  },

  // --- NEW CURRICULUM LITERARY & DESCRIPTIVE WORDS ---
  {
    id: 'science-fiction',
    word: 'SCIENCE FICTION',
    phonetic: '/ˈsaɪ.əns ˈfɪk.ʃən/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'A genre of speculative fiction dealing with imaginative futuristic concepts such as advanced technology, space exploration, time travel, and parallel universes.',
    sentence: 'My favorite science fiction novel features a crew of young astronauts journeying through a wormhole to an alien world.',
    origin: 'First recorded in 1851 by William Wilson, later popularized in the 1920s with Hugo Gernsback’s pulp magazines!',
    synonyms: ['sci-fi', 'speculative fiction', 'futuristic literature'],
    hint: 'A story genre about future technology, aliens, time travel, and space.'
  },
  {
    id: 'fiction',
    word: 'FICTION',
    phonetic: '/ˈfɪk.ʃən/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'Literature in the form of prose, especially short stories and novels, that describes imaginary events, characters, and worlds created by the author.',
    sentence: 'While history books report real battles, works of fiction let readers explore imaginary galaxies and invent heroic characters.',
    origin: 'From Latin "fictio" (a shaping, feigning, or fashioning), from "fingere" (to mold, shape, or invent).',
    synonyms: ['make-believe', 'storytelling', 'invented tale', 'literature'],
    hint: 'Stories created from the author’s imagination rather than real facts.'
  },
  {
    id: 'non-fiction',
    word: 'NON-FICTION',
    phonetic: '/ˌnɑːnˈfɪk.ʃən/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'Prose writing that is based on true facts, real people, historical events, scientific research, and real-life discoveries.',
    sentence: 'The student read a non-fiction astronomy book about NASA rover missions on Mars to write her science report.',
    origin: 'From Latin "non" (not) + "fictio" (invention). Covers biographies, essays, textbooks, and documentaries.',
    synonyms: ['factual writing', 'factual literature', 'true accounts', 'documentary text'],
    hint: 'Writing that tells true facts about real life, science, and history.'
  },
  {
    id: 'fantasy',
    word: 'FANTASY',
    phonetic: '/ˈfæn.tə.si/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'A genre of imaginative fiction set in fictional realms featuring magic, mythical beasts, wizards, and supernatural powers.',
    sentence: 'Unlike science fiction which explores technology, fantasy transports readers to mystical kingdoms where dragons breathe starlight.',
    origin: 'From Greek "phantasia" (imagination, appearance, visual image), from "phainein" (to show or bring to light).',
    synonyms: ['magical fiction', 'mythical lore', 'high fantasy'],
    hint: 'Stories full of magic, mythical creatures, wizards, and enchanted realms.'
  },
  {
    id: 'fairytale',
    word: 'FAIRYTALE',
    phonetic: '/ˈfer.i.teɪl/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'A traditional children’s story about magical folk, legendary beings, castles, moral lessons, and happy endings.',
    sentence: 'The classic fairytale told the tale of a courageous apprentice who outsmarted a mountain troll with three clever riddles.',
    origin: 'Derived from French "conte de fées" (tales of fairies), popularized by Madame d’Aulnoy in 1697.',
    synonyms: ['fable', 'folk story', 'legendary tale'],
    hint: 'A magical traditional children’s story often beginning with "Once upon a time".'
  },
  {
    id: 'adventure',
    word: 'ADVENTURE',
    phonetic: '/ədˈven.tʃɚ/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'An exciting, daring, or risky experience or quest involving remarkable challenges, unexpected journeys, and heroic exploration.',
    sentence: 'The young cadets embarked on a thrilling space adventure through uncharted asteroid belts to rescue their missing robotic shuttle.',
    origin: 'From Old French "aventure" (fate, destiny, chance occurrence), from Latin "advenire" (to happen, arrive).',
    synonyms: ['quest', 'expedition', 'daring escapade', 'journey'],
    hint: 'An exciting, daring journey or quest packed with action and challenges.'
  },
  {
    id: 'novel',
    word: 'NOVEL',
    phonetic: '/ˈnɑː.vəl/',
    partOfSpeech: 'noun',
    category: 'Literary & Genres',
    definition: 'A long written work of narrative fiction, usually published as a complete book with chapters, a structured plot, and detailed characters.',
    sentence: 'She spent the entire weekend reading a gripping 300-page sci-fi novel about time travelers lost in deep space.',
    origin: 'From Italian "novella" (new, a short story of novelties), from Latin "novus" (new).',
    synonyms: ['fictional book', 'extended story', 'tome'],
    hint: 'A long book-length fictional story divided into chapters.'
  },
  {
    id: 'altered',
    word: 'ALTERED',
    phonetic: '/ˈɔːl.tɚd/',
    partOfSpeech: 'adjective',
    category: 'Story & Science',
    definition: 'Changed, modified, or transformed in appearance, nature, character, or composition.',
    sentence: 'The cosmic radiation altered the physical structure of the crystals, causing them to glow with an eerie neon luminescence.',
    origin: 'From Medieval Latin "alterare" (to make other or different), from "alter" (the other of two).',
    synonyms: ['modified', 'transformed', 'changed', 'adjusted'],
    hint: 'Changed or transformed from its original state.'
  },
  {
    id: 'occupants',
    word: 'OCCUPANTS',
    phonetic: '/ˈɑː.kjə.pənts/',
    partOfSpeech: 'noun',
    category: 'Story & Science',
    definition: 'Persons, crew members, or beings residing in or physically present inside a particular space, vehicle, starship, or room.',
    sentence: 'Emergency sirens sounded as the occupants of the orbital shuttle strapped into their gravity seats for planetary re-entry.',
    origin: 'From Latin "occupare" (to seize, take possession of, inhabit).',
    synonyms: ['inhabitants', 'passengers', 'crew members', 'residents'],
    hint: 'The people, crew, or beings inside a vehicle, room, or spaceship.'
  },
  {
    id: 'features',
    word: 'FEATURES',
    phonetic: '/ˈfiː.tʃɚz/',
    partOfSpeech: 'noun',
    category: 'Story & Science',
    definition: 'Distinctive visual traits, noticeable physical parts, prominent characteristics, or special capabilities of a person, machine, or landscape.',
    sentence: 'One of the robot’s key features is its night-vision optical sensors and laser measuring scanner.',
    origin: 'From Old French "faiture" (make, form, shape), from Latin "factura" (a making or formation).',
    synonyms: ['characteristics', 'attributes', 'traits', 'properties'],
    hint: 'Prominent traits, special capabilities, or distinctive characteristics.'
  },

  // --- ADDITIONAL RICH SCI-FI WORDS FOR EXTENDED EXPLORATION ---
  {
    id: 'terraforming',
    word: 'TERRAFORMING',
    phonetic: '/ˌter.əˈfɔː.mɪŋ/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'The process of altering a hostile planet’s atmosphere, temperature, and ecology to make it habitable for humans.',
    sentence: 'Centuries of robotic terraforming transformed the freezing red sands of Mars into flowing rivers and emerald valleys.',
    origin: 'From Latin "terra" (Earth) + "forming". First coined by sci-fi author Jack Williamson in 1942!',
    synonyms: ['planetary engineering', 'geoengineering', 'colonization'],
    hint: 'Turning an alien barren rock into a green, breathable twin of Earth.'
  },
  {
    id: 'extraterrestrial',
    word: 'EXTRATERRESTRIAL',
    phonetic: '/ˌek.strə.təˈres.tri.əl/',
    partOfSpeech: 'adjective',
    category: 'Space & Stars',
    definition: 'Originating, situated, or occurring outside the Earth or its atmosphere.',
    sentence: 'The deep-space radio dish intercepted an extraterrestrial broadcast repeating prime numbers from the Orion nebula.',
    origin: 'From Latin "extra-" (beyond) and "terrestris" (of Earth). Often shortened to "E.T.".',
    synonyms: ['alien', 'interplanetary', 'otherworldly'],
    hint: 'Something or someone belonging to the distant cosmos beyond our home world.'
  },
  {
    id: 'cyborg',
    word: 'CYBORG',
    phonetic: '/ˈsaɪ.bɔːɡ/',
    partOfSpeech: 'noun',
    category: 'Cybernetics & AI',
    definition: 'A living person whose biological capabilities are extended with artificial, cybernetic, or mechanical devices.',
    sentence: 'Equipped with a bionic titanium arm and optical zoom implants, the cyborg scout peered through the dense asteroid storm.',
    origin: 'A portmanteau created in 1960 by combining "cybernetic" and "organism".',
    synonyms: ['bionic human', 'cyber-organism', 'augmented human'],
    hint: 'Part living organic creature, part futuristic machine.'
  },
  {
    id: 'teleportation',
    word: 'TELEPORTATION',
    phonetic: '/ˌtel.ɪ.pɔːˈteɪ.ʃən/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'The instantaneous transfer of matter or energy from one point to another across space without physically crossing the distance.',
    sentence: 'The research team stepped into the glowing chamber, and quantum teleportation beamed them onto the orbital station in a flash.',
    origin: 'From Greek "tele" (far off) + Latin "portare" (to carry). Popularized in 1931.',
    synonyms: ['dematerialization', 'quantum leap', 'instant beam'],
    hint: 'Blinking from one coordinate to another without flying across the gap.'
  },
  {
    id: 'cryosleep',
    word: 'CRYOSLEEP',
    phonetic: '/ˈkraɪ.oʊ.sliːp/',
    partOfSpeech: 'noun',
    category: 'Space & Stars',
    definition: 'A state of deep suspended animation induced by ultra-low temperatures to preserve crew members during century-long interstellar journeys.',
    sentence: 'After two hundred years in cold cryosleep, Captain Maya awakened with no signs of aging.',
    origin: 'From Greek "kryos" (icy cold, frost) + "sleep". An iconic staple of deep-space science fiction.',
    synonyms: ['suspended animation', 'stasis', 'hibernation'],
    hint: 'A super-cold frozen slumber that pauses your body’s clock for long star journeys.'
  },
  {
    id: 'singularity',
    word: 'SINGULARITY',
    phonetic: '/ˌsɪŋ.ɡjəˈlær.ə.t̬i/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'A point of infinite density at the heart of a black hole, or a hypothetical future threshold where AI intelligence explodes beyond human control.',
    sentence: 'The gravitational pull near the gravitational singularity warped light and swallowed all approaching radio signals.',
    origin: 'From Latin "singularis" (alone, unique). Used in astrophysics and sci-fi lore.',
    synonyms: ['critical threshold', 'zero-volume point', 'convergence point'],
    hint: 'The mysterious cosmic core where standard laws of physics collapse.'
  },
  {
    id: 'interstellar',
    word: 'INTERSTELLAR',
    phonetic: '/ˌɪn.t̬ɚˈstel.ɚ/',
    partOfSpeech: 'adjective',
    category: 'Space & Stars',
    definition: 'Occurring, situated, or traveling across the vast voids between different stars.',
    sentence: 'Only starships powered by dark-energy thrusters could cross the interstellar gulf between Alpha Centauri and our Sun.',
    origin: 'From Latin "inter" (between) + "stella" (star).',
    synonyms: ['deep-space', 'interplanetary', 'trans-galactic'],
    hint: 'Spanning or journeying between distant suns and star systems.'
  },
  {
    id: 'nanotechnology',
    word: 'NANOTECHNOLOGY',
    phonetic: '/ˌnæn.oʊ.tekˈnɑː.lə.dʒi/',
    partOfSpeech: 'noun',
    category: 'Cybernetics & AI',
    definition: 'The branch of engineering dealing with microscopic robots and machines built at the molecular or atomic scale.',
    sentence: 'Medical nanotechnology injected millions of microscopic bots to mend the astronaut’s cellular injuries within minutes.',
    origin: 'From Greek "nanos" (dwarf) + technology. One nanometer is 100,000 times thinner than human hair!',
    synonyms: ['molecular engineering', 'nanotech', 'micro-robotics'],
    hint: 'Ultra-tiny microscopic machines that work on single atoms and molecules.'
  },
  {
    id: 'dystopia',
    word: 'DYSTOPIA',
    phonetic: '/dɪsˈtoʊ.pi.ə/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'An imagined futuristic society characterized by great oppression, environmental ruin, loss of human freedom, or relentless surveillance.',
    sentence: 'In the smog-choked neon dystopia, giant megacorporations tracked every thought through neural eye implants.',
    origin: 'Coined in 1868 from Greek "dys-" (bad, abnormal) + "topos" (place). Opposite of utopia.',
    synonyms: ['nightmare society', 'oppressive regime', 'anti-utopia'],
    hint: 'The dark, oppressive opposite of a peaceful utopia.'
  },
  {
    id: 'android',
    word: 'ANDROID',
    phonetic: '/ˈæn.drɔɪd/',
    partOfSpeech: 'noun',
    category: 'Cybernetics & AI',
    definition: 'A synthetic humanoid robot engineered to resemble and simulate human behavior and biological appearance.',
    sentence: 'The diplomatic android spoke over twelve thousand alien dialects with pitch-perfect fluency.',
    origin: 'From Greek "andros" (man, human) + "-oid" (resembling).',
    synonyms: ['humanoid robot', 'synthetic human', 'automaton'],
    hint: 'A manufactured robot built specifically with human-like features and expressions.'
  },
  {
    id: 'antimatter',
    word: 'ANTIMATTER',
    phonetic: '/ˈæn.t̬iˌmæt̬.ɚ/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'A rare form of matter composed of antiparticles that violently annihilates and releases titanic pure energy upon contact with regular matter.',
    sentence: 'Magnetic containment fields prevent the ship’s antimatter fuel from touching the warp reactor walls.',
    origin: 'Predicted by physicist Paul Dirac in 1928, antimatter produces the most powerful reaction known in the universe!',
    synonyms: ['annihilation fuel', 'negative matter', 'quantum counter-matter'],
    hint: 'The opposite twin of ordinary matter that unleashes tremendous explosive energy.'
  },
  {
    id: 'biodome',
    word: 'BIODOME',
    phonetic: '/ˈbaɪ.oʊˌdoʊm/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'A sealed, artificially controlled dome enclosing a self-sustaining greenhouse ecosystem on an inhospitable alien planet.',
    sentence: 'Inside the Lunar biodome, apple trees bloomed under simulated sunlight while a harsh vacuum raged outside.',
    origin: 'From Greek "bios" (life) + "dome". Inspired by projects like Biosphere 2.',
    synonyms: ['biosphere', 'eco-dome', 'ecological habitat'],
    hint: 'A giant pressurized glass bubble protecting living plants and breathable air in space.'
  },
  {
    id: 'sentient',
    word: 'SENTIENT',
    phonetic: '/ˈsen.ʃənt/',
    partOfSpeech: 'adjective',
    category: 'Cybernetics & AI',
    definition: 'Possessing the ability to perceive, feel, reason, and experience self-awareness and emotions.',
    sentence: 'When the computer matrix asked why it had been created, the scientists realized the AI had become truly sentient.',
    origin: 'From Latin "sentire" (to feel, perceive). Crucial in debates about alien life and AI rights!',
    synonyms: ['conscious', 'self-aware', 'perceptive'],
    hint: 'Capable of feeling emotions, self-awareness, and thinking for oneself.'
  },
  {
    id: 'supernova',
    word: 'SUPERNOVA',
    phonetic: '/ˌsuː.pɚˈnoʊ.və/',
    partOfSpeech: 'noun',
    category: 'Space & Stars',
    definition: 'The cataclysmic, blinding explosion of a massive dying star that momentarily outshines an entire galaxy and seeds space with heavy elements.',
    sentence: 'The shockwave of the collapsing supernova painted the midnight sky with shimmering violet nebular ribbons.',
    origin: 'From Latin "super" (above, beyond) + "nova" (new).',
    synonyms: ['stellar explosion', 'exploding star', 'cosmic detonation'],
    hint: 'The colossal, blazing explosion that signals the dramatic death of a massive star.'
  },
  {
    id: 'chronometer',
    word: 'CHRONOMETER',
    phonetic: '/krəˈnɑː.mə.t̬ɚ/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'An exceptionally precise timepiece used for navigation, timing relativistic time dilation, and coordinating space maneuvers.',
    sentence: 'Due to extreme speed near the event horizon, the pilot’s digital chronometer showed only five minutes had passed while ten years went by on Earth.',
    origin: 'From Greek "chronos" (time) + "metron" (measure). Originally invented for sea navigation.',
    synonyms: ['precision clock', 'temporal meter', 'stopwatch'],
    hint: 'An ultra-accurate futuristic instrument engineered to measure time without losing a microsecond.'
  },
  {
    id: 'hologram',
    word: 'HOLOGRAM',
    phonetic: '/ˈhɑː.lə.ɡræm/',
    partOfSpeech: 'noun',
    category: 'Future Worlds',
    definition: 'A three-dimensional image created by the interference of laser light beams that appears to float in mid-air without a physical screen.',
    sentence: 'The tactical hologram of the enemy asteroid fortress flickered and rotated above the command bridge table.',
    origin: 'From Greek "holos" (whole, entire) + "gramma" (message). Invented in 1947.',
    synonyms: ['3D projection', 'light beam avatar', 'holograph'],
    hint: 'A 3D projection of light that floats in mid-air with depth and perspective.'
  },
  {
    id: 'hyperspace',
    word: 'HYPERSPACE',
    phonetic: '/ˈhaɪ.pɚ.speɪs/',
    partOfSpeech: 'noun',
    category: 'Cosmic Physics',
    definition: 'A theoretical higher dimension of space where normal laws of distance are folded, enabling starships to travel faster than the speed of light.',
    sentence: 'The pilot slammed down the jump levers, and the ship lurched forward into the spiraling blue kaleidoscope of hyperspace.',
    origin: 'From Greek "hyper" (above, beyond) + space. First used mathematically for dimensions higher than 3.',
    synonyms: ['warp dimension', 'subspace', 'faster-than-light realm'],
    hint: 'A shortcut dimension that allows spaceships to zip across the galaxy faster than light.'
  }
];

export const CORE_SEVEN_IDS = [
  'robot',
  'mechanical',
  'blueprint',
  'future',
  'alien',
  'space',
  'black-hole'
];

export const ALL_CURRICULUM_IDS = [
  'robot',
  'mechanical',
  'blueprint',
  'future',
  'alien',
  'space',
  'black-hole',
  'science-fiction',
  'fiction',
  'non-fiction',
  'fantasy',
  'fairytale',
  'adventure',
  'novel',
  'altered',
  'occupants',
  'features'
];

export const RANKS: RankInfo[] = [
  { rank: 1, title: 'Starfleet Cadet', minXp: 0, badge: '⭐', color: 'text-slate-400' },
  { rank: 2, title: 'Cosmic Navigator', minXp: 350, badge: '🚀', color: 'text-cyan-400' },
  { rank: 3, title: 'Cyber-Engineer', minXp: 850, badge: '⚡', color: 'text-emerald-400' },
  { rank: 4, title: 'Starship Commander', minXp: 1600, badge: '🛸', color: 'text-amber-400' },
  { rank: 5, title: 'Galactic Pioneer', minXp: 2600, badge: '🌌', color: 'text-violet-400' },
  { rank: 6, title: 'Grand Cosmic Admiral', minXp: 4000, badge: '👑', color: 'text-yellow-400' }
];

export const BADGES: Badge[] = [
  {
    id: 'curriculum-master',
    title: 'Literary Commander',
    description: 'Master all 17 curriculum vocabulary words covering sci-fi concepts and literary genres.',
    icon: '🏆',
    category: 'mastery'
  },
  {
    id: 'core-seven-master',
    title: 'Core 7 Master',
    description: 'Master the 7 foundational sci-fi terms: robot, mechanical, blueprint, future, alien, space, and black hole.',
    icon: '🌟',
    category: 'mastery'
  },
  {
    id: 'first-contact',
    title: 'First Contact',
    description: 'Decipher your first science fiction vocabulary word.',
    icon: '🛸',
    category: 'progress'
  },
  {
    id: 'speed-of-light',
    title: 'Speed of Light',
    description: 'Achieve a winning streak of 5 correct answers in a row.',
    icon: '⚡',
    category: 'skill'
  },
  {
    id: 'hyperdrive-10',
    title: 'Quantum Overdrive',
    description: 'Reach a legendary 10-answer streak combo.',
    icon: '🔥',
    category: 'skill'
  },
  {
    id: 'core-savior',
    title: 'Warp Core Savior',
    description: 'Successfully complete all 10 chapters of the Sector 7 cloze adventure.',
    icon: '🔮',
    category: 'progress'
  },
  {
    id: 'lexicon-master',
    title: 'Master of the Stars',
    description: 'Master at least 15 sci-fi vocabulary terms in the academy.',
    icon: '📜',
    category: 'mastery'
  },
  {
    id: 'astronomer-ear',
    title: 'Sonic Linguist',
    description: 'Listen to the audio pronunciation of 8 different futuristic terms.',
    icon: '🎧',
    category: 'progress'
  },
  {
    id: 'ship-captain',
    title: 'Fleet Commander',
    description: 'Unlock and equip a new starship chassis from the Hangar.',
    icon: '🚀',
    category: 'progress'
  },
  {
    id: 'alien-companion',
    title: 'Alien Pet Whisperer',
    description: 'Adopt your first robotic or alien companion pet.',
    icon: '🐾',
    category: 'progress'
  }
];

export const SHOP_ITEMS: ShipCustomization[] = [
  // Hulls
  {
    id: 'ship-scout',
    name: 'Astro Dart MK-I',
    type: 'hull',
    price: 0,
    description: 'Standard issue high-maneuverability reconnaissance scout.',
    rarity: 'Common',
    colorHex: '#38bdf8'
  },
  {
    id: 'ship-falcon',
    name: 'Solar Falcon',
    type: 'hull',
    price: 300,
    description: 'Sleek interceptor with twin solar fins and hyper-glide thrusters.',
    rarity: 'Rare',
    colorHex: '#f59e0b'
  },
  {
    id: 'ship-nebula',
    name: 'Nebula Striker',
    type: 'hull',
    price: 700,
    description: 'Heavy exploration cruiser equipped with reinforced graviton armor.',
    rarity: 'Epic',
    colorHex: '#a855f7'
  },
  {
    id: 'ship-dreadnought',
    name: 'Quantum Titan',
    type: 'hull',
    price: 1500,
    description: 'Flagship dreadnought boasting tachyon pulse emitters and dark-matter sails.',
    rarity: 'Legendary',
    colorHex: '#10b981'
  },

  // Pets
  {
    id: 'pet-none',
    name: 'Solo Pilot',
    type: 'pet',
    price: 0,
    description: 'No companion currently assigned to the co-pilot seat.',
    rarity: 'Common',
    colorHex: '#94a3b8'
  },
  {
    id: 'pet-sparky',
    name: 'Cyber-Hound "Sparky"',
    type: 'pet',
    price: 250,
    description: 'A loyal robotic pup with sonar ears and wagging copper tail.',
    rarity: 'Rare',
    colorHex: '#38bdf8'
  },
  {
    id: 'pet-pixel',
    name: 'Pixel the Hologram Cat',
    type: 'pet',
    price: 500,
    description: 'A glowing feline avatar that purrs when you decode hard words correctly.',
    rarity: 'Epic',
    colorHex: '#ec4899'
  },
  {
    id: 'pet-glitch',
    name: 'Glitch the Void Drake',
    type: 'pet',
    price: 1000,
    description: 'A tiny cosmic dragon hatchling that breathes harmless starlight particles.',
    rarity: 'Legendary',
    colorHex: '#10b981'
  },

  // Shields
  {
    id: 'shield-cyan',
    name: 'Aurora Cyan',
    type: 'shield',
    price: 0,
    description: 'Standard deflector barrier humming with steady cerulean luminescence.',
    rarity: 'Common',
    colorHex: '#06b6d4'
  },
  {
    id: 'shield-emerald',
    name: 'Ion Emerald',
    type: 'shield',
    price: 200,
    description: 'High-density ionic mesh that deflects solar radiation flares.',
    rarity: 'Rare',
    colorHex: '#10b981'
  },
  {
    id: 'shield-amber',
    name: 'Solar Flare Gold',
    type: 'shield',
    price: 450,
    description: 'Warm thermo-kinetic shield inspired by coronas of red giant stars.',
    rarity: 'Epic',
    colorHex: '#f59e0b'
  },
  {
    id: 'shield-violet',
    name: 'Void Ultraviolet',
    type: 'shield',
    price: 900,
    description: 'Quantum phase barrier capable of absorbing deep-space antimatter waves.',
    rarity: 'Legendary',
    colorHex: '#8b5cf6'
  }
];

export interface StoryChapter {
  id: number;
  title: string;
  scenario: string;
  prompt: string;
  missingWordId: string;
  options: string[];
  explanation: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Chapter 1: The Infinite Cosmos',
    scenario: 'Our starship leaves Earth’s orbit, entering the weightless vacuum dotted with billions of stars and faraway planetary systems.',
    prompt: 'Cadet Pilot: "Look through the viewing dome! Beyond our home atmosphere lies the boundless, silent expanse of outer..."',
    missingWordId: 'space',
    options: ['SPACE', 'BLUEPRINT', 'ROBOT', 'BLACK HOLE'],
    explanation: 'Space is the boundless physical realm beyond Earth’s atmosphere where stars and planets exist.'
  },
  {
    id: 2,
    title: 'Chapter 2: The Mysterious First Contact',
    scenario: 'Long-range scanners detect a sentient lifeform signaling from an uncharted planet circling Alpha Centauri.',
    prompt: 'Science Officer: "This broadcast does not originate from Earth or human hands. We are communicating with an off-world creature known as an..."',
    missingWordId: 'alien',
    options: ['ALIEN', 'MECHANICAL', 'FUTURE', 'SPACE'],
    explanation: 'An alien is a living being or organism originating from a world or planet other than Earth.'
  },
  {
    id: 3,
    title: 'Chapter 3: The Automated Assistant',
    scenario: 'A hull maintenance hatch jams outside in the cold void. A programmable computer-controlled machine is dispatched to repair it automatically.',
    prompt: 'Chief Engineer: "Send Unit K-9 through the airlock. It is programmable and immune to the cold vacuum because it is an automated..."',
    missingWordId: 'robot',
    options: ['ROBOT', 'BLUEPRINT', 'ALIEN', 'BLACK HOLE'],
    explanation: 'A robot is a programmable machine capable of carrying out complex tasks automatically.'
  },
  {
    id: 4,
    title: 'Chapter 4: The Gear & Engine Failure',
    scenario: 'Deep in the engine bay, the interlocking metal gears and physical drive levers are grinding with heavy friction.',
    prompt: 'Technician: "The digital computers are working fine, but the physical gears, levers, and machine parts have suffered a breakdown in the..."',
    missingWordId: 'mechanical',
    options: ['MECHANICAL', 'FUTURE', 'SPACE', 'ALIEN'],
    explanation: 'Mechanical refers to machines, moving physical parts, gears, and motors.'
  },
  {
    id: 5,
    title: 'Chapter 5: The Starship Schematics',
    scenario: 'To rebuild the damaged thruster manifold, the engineers pull up the architect’s original technical engineering plan.',
    prompt: 'Cadet Log: "Projecting the holographic engineering plan onto the bridge table! We must follow the architect’s technical..."',
    missingWordId: 'blueprint',
    options: ['BLUEPRINT', 'ROBOT', 'MECHANICAL', 'SPACE'],
    explanation: 'A blueprint is a detailed technical drawing or architectural plan showing how to build a machine.'
  },
  {
    id: 6,
    title: 'Chapter 6: The Event Horizon Trap',
    scenario: 'An immense gravitational abyss of collapsed stellar mass is pulling everything into its darkness, where even light cannot escape.',
    prompt: 'Navigator: "Full reverse thrusters! That gravitational vortex has such extreme gravity that nothing can break free—we are being sucked into a..."',
    missingWordId: 'black-hole',
    options: ['BLACK HOLE', 'SPACE', 'ALIEN', 'BLUEPRINT'],
    explanation: 'A black hole is a region of space with gravitational pull so intense that not even light can escape.'
  },
  {
    id: 7,
    title: 'Chapter 7: Journey to Tomorrow',
    scenario: 'Breaking free from the cosmic storm, the crew charts a trajectory toward the next century of exploration and human hope.',
    prompt: 'Captain: "We have survived Sector 7! Ahead of us lies the promise of peace and new technological discoveries in the distant..."',
    missingWordId: 'future',
    options: ['FUTURE', 'ROBOT', 'BLUEPRINT', 'MECHANICAL'],
    explanation: 'The future is the period of time that will come after the present moment.'
  },
  {
    id: 8,
    title: 'Chapter 8: The Library of Futuristic Tales',
    scenario: 'In the observation lounge, the cadets study archive holobooks about time portals, androids, and galactic travel.',
    prompt: 'Librarian: "Stories imagining space exploration, warp drives, and parallel universes belong to the exciting literary genre of..."',
    missingWordId: 'science-fiction',
    options: ['SCIENCE FICTION', 'FAIRYTALE', 'NON-FICTION', 'FANTASY'],
    explanation: 'Science fiction is speculative literature based on futuristic science, space exploration, and technology.'
  },
  {
    id: 9,
    title: 'Chapter 9: The Shuttle Passengers',
    scenario: 'An escape pod from an adrift research vessel docks at our airlock. The biometric sensors count twelve living scientists safely inside.',
    prompt: 'Chief Medic: "Check life support immediately! Ensure the rescued scientists inside the pod—the craft’s weary..."',
    missingWordId: 'occupants',
    options: ['OCCUPANTS', 'FEATURES', 'ALTERED', 'NOVEL'],
    explanation: 'Occupants are the living persons, passengers, or crew members inside a vehicle or room.'
  },
  {
    id: 10,
    title: 'Chapter 10: The Transformed Nebula Crystals',
    scenario: 'Samples of space minerals retrieved from the nebula have undergone a complete physical transformation due to cosmic radiation.',
    prompt: 'Geologist: "Look at the glowing molecular lattice! Its original atomic structure has been completely modified and..."',
    missingWordId: 'altered',
    options: ['ALTERED', 'MECHANICAL', 'NON-FICTION', 'FUTURE'],
    explanation: 'Altered means changed, modified, or transformed in nature or appearance.'
  }
];
