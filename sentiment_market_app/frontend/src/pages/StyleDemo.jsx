import React from 'react';

const StyleDemo = () => {
  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <section className="hero-gradient p-8 text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          🌗 Démo des Styles Dark/Light Mode
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto reading-width">
          Découvrez tous les composants disponibles avec support complet du mode clair et sombre. 
          Cliquez sur le bouton en haut à droite pour basculer entre les modes.
        </p>
      </section>

      {/* Boutons */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          🎯 Boutons
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary">Bouton Principal</button>
          <button className="btn-secondary">Bouton Secondaire</button>
          <button className="btn-outline">Bouton Outline</button>
        </div>
      </section>

      {/* Cartes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          🃏 Cartes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="product-card">
            <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Carte Produit
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Une belle carte avec effet glassmorphism et hover élégant.
            </p>
            <div className="star-rating mb-3">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
            </div>
            <span className="badge">Nouveau</span>
          </div>

          <div className="glass-dark p-6">
            <div className="w-full h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Glass Dark
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Variante avec transparence ajustée.
            </p>
          </div>

          <div className="glass p-6 animate-float">
            <div className="w-full h-40 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Avec Animation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Flotte doucement dans l'air.
            </p>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          ✏️ Inputs & Forms
        </h2>
        <div className="space-y-4 max-w-xl">
          <input
            type="text"
            className="input-modern"
            placeholder="Nom d'utilisateur"
          />
          <input
            type="email"
            className="input-modern"
            placeholder="Email"
          />
          <textarea
            className="input-modern resize-none"
            rows="4"
            placeholder="Votre message..."
          />
        </div>
      </section>

      {/* Tags & Badges */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          🏷️ Tags & Badges
        </h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="category-tag">Électronique</span>
          <span className="category-tag">Mode</span>
          <span className="category-tag">Sport</span>
          <span className="category-tag">Livres</span>
          <span className="category-tag">Maison</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="badge">-50%</span>
          <span className="badge">Nouveau</span>
          <span className="badge">Populaire</span>
          <span className="badge">Promo</span>
        </div>
      </section>

      {/* Text Gradients */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          ✨ Text Gradients
        </h2>
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Gradient Bleu-Indigo-Violet
        </h1>
        <h2 className="text-4xl font-bold text-gradient-gold">
          Gradient Doré
        </h2>
      </section>

      {/* Animations */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          💫 Animations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-dark p-6 text-center animate-float">
            <div className="text-4xl mb-2">🎈</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Float</p>
          </div>
          <div className="glass-dark p-6 text-center animate-glow">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Glow</p>
          </div>
          <div className="glass-dark p-6 text-center animate-fade-in">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fade In</p>
          </div>
          <div className="glass-dark p-6 text-center shimmer">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Shimmer</p>
          </div>
        </div>
      </section>

      {/* Scrollbar */}
      <section className="glass p-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          📜 Scrollbar Personnalisée
        </h2>
        <div className="custom-scrollbar h-64 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">
              Ligne {i + 1} - Scrollez pour voir la scrollbar personnalisée avec des
              couleurs adaptées au mode clair et sombre. Le design est subtil et élégant.
            </p>
          ))}
        </div>
      </section>

      {/* Typographie */}
      <section className="glass p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          📝 Typographie Confortable
        </h2>
        <p className="text-slate-700 dark:text-slate-300 reading-width text-balance leading-relaxed">
          Cette typographie est optimisée pour une lecture prolongée. Les espacements,
          les hauteurs de ligne et les contrastes ont été soigneusement ajustés pour
          offrir un confort maximal, que vous soyez en mode clair ou en mode sombre.
          La largeur de lecture est limitée à 65 caractères pour une lisibilité optimale.
        </p>
      </section>

      {/* Couleurs */}
      <section className="glass p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          🎨 Palette de Couleurs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 bg-blue-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bleu</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-indigo-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Indigo</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-emerald-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Émeraude</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-teal-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sarcelle</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-rose-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rose</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-pink-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pink</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-amber-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ambre</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-slate-500 rounded-lg"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Slate</p>
          </div>
        </div>
      </section>

      {/* Footer de démo */}
      <section className="hero-gradient p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          🎉 Tous ces composants sont maintenant disponibles dans votre application !
        </p>
      </section>
    </div>
  );
};

export default StyleDemo;
