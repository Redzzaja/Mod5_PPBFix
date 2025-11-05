// src/components/home/FeaturedMakananSection.jsx
import { Clock, Star, ChefHat } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function FeaturedMakananSection({
  recipes,
  loading,
  error,
  onRecipeClick,
  onNavigate,
}) {
  const [visibleMakanan, setVisibleMakanan] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState(new Set()); // <-- TAMBAHKAN
  const makananRefs = useRef([]);

  useEffect(() => {
    const observerMakanan = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);

            // Picu pemuatan gambar
            setLoadedImages((prev) => new Set(prev).add(index)); // <-- TAMBAHKAN

            // Picu animasi (dengan penundaan)
            setTimeout(() => {
              setVisibleMakanan((prev) => new Set(prev).add(index));
            }, index * 200);

            // Berhenti mengamati
            observerMakanan.unobserve(entry.target); // <-- TAMBAHKAN
          }
        });
      },
      { threshold: 0.01 } // <-- UBAH threshold
    );

    makananRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observerMakanan.observe(ref);
      }
    });

    return () => {
      observerMakanan.disconnect();
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
      <div className="flex items-center justify-between py-6 md:py-8">
        {/* ... sisa kode header tidak berubah ... */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.id}
            ref={(el) => (makananRefs.current[index] = el)}
            className={`group transform transition-all duration-700 ${
              visibleMakanan.has(index)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0" // <-- KEMBALIKAN KE INI
            }`}
          >
            <div
              onClick={() => onRecipeClick && onRecipeClick(recipe.id)}
              className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 cursor-pointer group-hover:scale-105 group-hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Recipe Image*/}
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
              </div>
              <div className="relative z-10 p-4 md:p-8">
                {/* ... sisa kode konten tidak berubah ... */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
