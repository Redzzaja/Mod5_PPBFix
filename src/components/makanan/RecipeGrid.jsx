// src/components/makanan/RecipeGrid.jsx
import { Clock, Star, ChefHat } from "lucide-react";
// --- 1. Tambahkan useState ---
import { useState, useEffect, useRef } from "react";
import FavoriteButton from "../common/FavoriteButton";

export default function RecipeGrid({ recipes, onRecipeClick }) {
  // --- 2. GANTI NAMA STATE (atau biarkan) ---
  const [visibleCards, setVisibleCards] = useState(new Set());

  // --- 3. TAMBAHKAN STATE BARU UNTUK GAMBAR ---
  const [loadedImages, setLoadedImages] = useState(new Set());

  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, recipes.length);

    // --- 4. MODIFIKASI OBSERVER ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);

            // (A) LANGSUNG picu pemuatan gambar
            setLoadedImages((prev) => new Set(prev).add(index));

            // (B) TUNDA animasi fade-in
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, (index % 3) * 150);

            // Berhenti mengamati setelah terpicu
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold: 0.1 berarti 10% dari kartu harus terlihat
      // Ubah ke 0.01 untuk memuat TEPAT sebelum masuk layar
      { threshold: 0.01 }
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
      {/* ... */}
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
              className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
            >
              {/* ... */}
              <div className="relative h-32 md:h-56 overflow-hidden">
                {/* --- 5. MODIFIKASI TAG IMG --- */}
                <img
                  // Gunakan state 'loadedImages' untuk 'src'
                  src={
                    loadedImages.has(index)
                      ? recipe.image_url || undefined
                      : undefined
                  }
                  alt={recipe.name}
                  // Hapus loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                {/* ... */}
              </div>
              {/* ... */}
            </div>
          </div>
        ))}
      </div>
      {/* ... */}
    </section>
  );
}
