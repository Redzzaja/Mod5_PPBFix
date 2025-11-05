// src/components/minuman/RecipeGrid.jsx
import { Clock, Star, Coffee, ChefHat } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FavoriteButton from "../common/FavoriteButton";

export default function RecipeGrid({ recipes, onRecipeClick }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set()); // <-- TAMBAHKAN
  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, recipes.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);

            // Picu pemuatan gambar
            setLoadedImages((prev) => new Set(prev).add(index)); // <-- TAMBAHKAN

            // Picu animasi (dengan penundaan)
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, (index % 3) * 150);

            // Berhenti mengamati setelah terpicu
            observer.unobserve(entry.target); // <-- TAMBAHKAN
          }
        });
      },
      { threshold: 0.01 } // <-- UBAH threshold
    );

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [recipes]);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`group transform transition-all duration-700 ${
              visibleCards.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0" // <-- KEMBALIKAN KE INI
            }`}
          >
            <div
              onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
              className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-green-500/5 hover:shadow-green-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-32 md:h-56 overflow-hidden">
                <img
                  // --- MODIFIKASI IMG ---
                  src={
                    loadedImages.has(index)
                      ? recipe.image_url || undefined
                      : undefined
                  }
                  alt={recipe.name}
                  // loading="lazy" <-- HAPUS
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton recipeId={recipe.id} size="sm" />
                </div>
              </div>
              <div className="relative z-10 p-4 md:p-8">
                {/* ... sisa kode tidak berubah ... */}
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-xs font-semibold text-green-700 bg-green-100/90 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                    Minuman
                  </span>
                  {recipe.average_rating > 0 && (
                    <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                      <span className="text-xs md:text-sm font-semibold text-slate-700">
                        {recipe.average_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                  {recipe.name}
                </h3>
                <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">{recipe.prep_time}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                    <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ... sisa kode tidak berubah ... */}
    </section>
  );
}
