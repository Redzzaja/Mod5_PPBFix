// src/components/home/FeaturedMinumanSection.jsx
import { Clock, Star, ChefHat, Coffee } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function FeaturedMinumanSection({
  recipes,
  loading,
  error,
  onRecipeClick,
  onNavigate,
}) {
  const [visibleMinuman, setVisibleMinuman] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set()); // <-- TAMBAHKAN
  const minumanRefs = useRef([]);

  useEffect(() => {
    const observerMinuman = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);

            // Picu pemuatan gambar
            setLoadedImages((prev) => new Set(prev).add(index)); // <-- TAMBAHKAN

            // Picu animasi (dengan penundaan)
            setTimeout(() => {
              setVisibleMinuman((prev) => new Set(prev).add(index));
            }, index * 250);

            // Berhenti mengamati
            observerMinuman.unobserve(entry.target); // <-- TAMBAHKAN
          }
        });
      },
      { threshold: 0.01 } // <-- UBAH threshold
    );

    minumanRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observerMinuman.observe(ref);
      }
    });

    return () => {
      observerMinuman.disconnect();
    };
  }, [recipes]);

  if (loading) {
    // ... sisa kode loading tidak berubah ...
  }

  if (error) {
    // ... sisa kode error tidak berubah ...
  }

  if (!recipes || recipes.length === 0) {
    // ... sisa kode empty tidak berubah ...
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        {/* ... sisa kode header tidak berubah ... */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            ref={(el) => (minumanRefs.current[index] = el)}
            className={`group transform transition-all duration-700 ${
              visibleMinuman.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0" // <-- KEMBALIKAN KE INI
            }`}
          >
            <div
              onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
              className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-indigo-500/5 hover:shadow-indigo-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex">
                {/* Recipe Image */}
                <div className="h-29 w-28 md:h-48 md:w-48 flex-shrink-0 overflow-hidden">
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
                </div>
                <div className="relative z-10 p-4 md:p-8 flex-1 flex flex-col justify-center">
                  {/* ... sisa kode konten tidak berubah ... */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
