import { useState } from 'react';
import { VocabWord, Category, PlayerProfile } from '../../types/game';
import { VOCABULARY_LIST, CORE_SEVEN_IDS, ALL_CURRICULUM_IDS } from '../../data/vocabulary';
import { speakWord } from '../../utils/audio';
import { Search, Volume2, Sparkles, CheckCircle2, Rotate3d, BookOpen, Layers } from 'lucide-react';

interface HoloCodexProps {
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onCheckBadges: (currentProfile: PlayerProfile) => void;
}

export default function HoloCodex({ profile, onUpdateProfile, onCheckBadges }: HoloCodexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Curriculum Unit (17)');
  const [activeWord, setActiveWord] = useState<VocabWord | null>(VOCABULARY_LIST[0]);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);

  const categories = [
    'Curriculum Unit (17)',
    'Literary & Genres',
    'Story & Science',
    'All',
    'Space & Stars',
    'Cybernetics & AI',
    'Cosmic Physics',
    'Future Worlds'
  ];

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    let matchesCategory = true;
    if (selectedCategory === 'Curriculum Unit (17)') {
      matchesCategory = ALL_CURRICULUM_IDS.includes(w.id);
    } else if (selectedCategory !== 'All') {
      matchesCategory = w.category === selectedCategory;
    }

    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePronounce = (word: string) => {
    speakWord(word);
    // Award sonic linguist badge progress
    onUpdateProfile((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + 5,
        credits: prev.credits + 5
      };
      setTimeout(() => onCheckBadges(updated), 100);
      return updated;
    });
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIdx((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const currentFlashcard = filteredWords[flashcardIdx] || VOCABULARY_LIST[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Starfleet Database</span>
            <span aria-hidden="true">·</span>
            <span>Holo-Codex</span>
            <span aria-hidden="true">·</span>
            <span>{VOCABULARY_LIST.length} Classified Terms</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Galactic Science Fiction Lexicon
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore futuristic scientific concepts, listen to pronunciation guides, and review flashcards.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl sm:self-start">
          <button
            onClick={() => setIsFlashcardMode(false)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              !isFlashcardMode ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Encyclopedia</span>
          </button>
          <button
            onClick={() => setIsFlashcardMode(true)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              isFlashcardMode ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sci-fi terminology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!isFlashcardMode ? (
        /* Encyclopedia Master-Detail View */
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Words List Grid / Sidebar */}
          <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredWords.map((word) => {
              const isMastered = profile.wordsMastered.includes(word.id);
              const isSelected = activeWord?.id === word.id;

              return (
                <button
                  key={word.id}
                  onClick={() => setActiveWord(word)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-mono text-sm font-bold flex items-center gap-2">
                      <span>{word.word}</span>
                      {isMastered && (
                        <span title="Mastered in missions">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {word.phonetic} · <span className="italic">{word.partOfSpeech}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                    {word.category}
                  </span>
                </button>
              );
            })}

            {filteredWords.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No matching sci-fi terms found in Starfleet archives.
              </div>
            )}
          </div>

          {/* Word Deep Dive Dossier */}
          <div className="lg:col-span-7">
            {activeWord ? (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md sticky top-24 shadow-2xl">
                {/* Word Title & Audio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-cyan-400 font-semibold">{activeWord.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="italic">{activeWord.partOfSpeech}</span>
                    </div>
                    <h3 className="text-3xl font-bold font-mono text-white tracking-wide">
                      {activeWord.word}
                    </h3>
                    <div className="text-sm font-mono text-cyan-300/90 mt-1">
                      {activeWord.phonetic}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePronounce(activeWord.word)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700 rounded-xl transition-all cursor-pointer self-start sm:self-center active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Pronounce Audio</span>
                  </button>
                </div>

                {/* Definition */}
                <div className="mt-6">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-2">
                    Primary 6 Scientific Definition:
                  </div>
                  <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
                    "{activeWord.definition}"
                  </p>
                </div>

                {/* Example in Sci-Fi Literature */}
                <div className="mt-5">
                  <div className="text-xs font-mono uppercase text-slate-400 mb-2">
                    Context Example (Starship Expedition Log):
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 border border-slate-850 rounded-xl p-4">
                    "{activeWord.sentence}"
                  </p>
                </div>

                {/* Etymology & Trivia */}
                <div className="mt-5 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sci-Fi Lore & Origin Trivia:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                    {activeWord.origin}
                  </p>
                </div>

                {/* Synonyms & Relatives */}
                <div className="mt-5 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                  <span className="font-mono uppercase text-slate-500">Related Concepts:</span>
                  {activeWord.synonyms.map((syn, idx) => (
                    <span key={idx} className="text-slate-300">
                      {syn}{idx < activeWord.synonyms.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                Select a word from the catalog to inspect.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Flashcard Study Deck Mode */
        <div className="mt-8 max-w-xl mx-auto text-center">
          <div className="text-xs font-mono text-slate-400 mb-3">
            Card {flashcardIdx + 1} of {filteredWords.length} (Click card to flip)
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] p-8 bg-slate-900/80 border-2 border-slate-700/80 hover:border-cyan-500/80 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col justify-center items-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flip</span>
            </div>

            {!isFlipped ? (
              // Front: Word & Phonetics
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase text-cyan-400">
                  {currentFlashcard.category}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-mono text-white">
                  {currentFlashcard.word}
                </h3>
                <p className="text-sm font-mono text-slate-400">
                  {currentFlashcard.phonetic}
                </p>
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePronounce(currentFlashcard.word);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 rounded-lg hover:bg-cyan-900 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hear Audio</span>
                  </button>
                </div>
              </div>
            ) : (
              // Back: Definition and Context
              <div className="space-y-4 text-left">
                <div>
                  <div className="text-xs font-mono uppercase text-slate-500 mb-1">
                    Definition:
                  </div>
                  <p className="text-base text-slate-100 font-medium">
                    "{currentFlashcard.definition}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-xs font-mono uppercase text-slate-500 mb-1">
                    Example:
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{currentFlashcard.sentence}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevFlashcard}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Previous Card
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/80 rounded-xl transition-colors cursor-pointer"
            >
              Flip Card
            </button>
            <button
              onClick={handleNextFlashcard}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors cursor-pointer"
            >
              Next Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
