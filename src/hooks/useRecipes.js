// src/hooks/useRecipes.js
import { useState, useEffect, useCallback } from "react";
import recipeService from "../services/recipeService";

// --- BUAT CACHE DI LEVEL MODUL ---
const simpleCache = new Map();

// --- 1. TAMBAHKAN DURASI KEDALUWARSA CACHE ---
// Contoh: 5 menit (dalam milidetik)
const CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Custom hook for fetching recipes
 * @param {Object} params Query parameters
 * @returns {Object} { recipes, loading, error, pagination, refetch }
 */
export function useRecipes(params = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const cacheKey = JSON.stringify(params);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // --- 2. MODIFIKASI LOGIC PEMBACAAN CACHE ---
      if (simpleCache.has(cacheKey)) {
        const cachedItem = simpleCache.get(cacheKey); // <-- Ambil item cache
        const now = Date.now();
        const isExpired = now - cachedItem.timestamp > CACHE_DURATION_MS; // <-- Cek kedaluwarsa

        if (!isExpired) {
          // Jika BELUM kedaluwarsa, gunakan data cache
          setRecipes(cachedItem.data || []);
          setPagination(cachedItem.pagination || null);
          setLoading(false);
          return;
        } else {
          // Jika SUDAH kedaluwarsa, hapus dari cache
          simpleCache.delete(cacheKey);
        }
      }
      // --- LOGIC CACHING SELESAI ---

      const response = await recipeService.getRecipes(params);
      if (response.success) {
        const responseData = response.data || [];
        const responsePagination = response.pagination || null;

        setRecipes(responseData);
        setPagination(responsePagination);

        // --- MODIFIKASI LOGIC PENYIMPANAN CACHE ---
        // 2. Simpan data DAN timestamp ke cache
        simpleCache.set(cacheKey, {
          data: responseData,
          pagination: responsePagination,
          timestamp: Date.now(), // <-- Tambahkan timestamp saat ini
        });
        // --- LOGIC CACHING SELESAI ---
      } else {
        setError(response.message || "Failed to fetch recipes");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [cacheKey]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const refetchWithInvalidation = useCallback(async () => {
    simpleCache.delete(cacheKey);
    await fetchRecipes();
  }, [cacheKey, fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    pagination,
    refetch: refetchWithInvalidation,
  };
}

/**
 * Custom hook for fetching a single recipe
 * @param {string} id Recipe ID
 * @returns {Object} { recipe, loading, error, refetch }
 */
export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `recipe_${id}`;

  const fetchRecipe = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // --- 3. MODIFIKASI LOGIC PEMBACAAN CACHE ---
      if (simpleCache.has(cacheKey)) {
        const cachedItem = simpleCache.get(cacheKey); // <-- Ambil item cache
        const now = Date.now();
        const isExpired = now - cachedItem.timestamp > CACHE_DURATION_MS; // <-- Cek kedaluwarsa

        if (!isExpired) {
          // Jika BELUM kedaluwarsa, gunakan data cache
          setRecipe(cachedItem.data); // Ambil data dari properti 'data'
          setLoading(false);
          return;
        } else {
          // Jika SUDAH kedaluwarsa, hapus
          simpleCache.delete(cacheKey);
        }
      }
      // --- SELESAI CACHING ---

      const response = await recipeService.getRecipeById(id);
      if (response.success) {
        const responseData = response.data;
        setRecipe(responseData);

        // --- MODIFIKASI LOGIC PENYIMPANAN CACHE ---
        simpleCache.set(cacheKey, {
          data: responseData, // <-- Simpan data di dalam 'data'
          timestamp: Date.now(), // <-- Tambahkan timestamp
        });
        // --- SELESAI CACHING ---
      } else {
        setError(response.message || "Failed to fetch recipe");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching recipe");
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [id, cacheKey]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const refetchWithInvalidation = useCallback(async () => {
    simpleCache.delete(cacheKey);
    await fetchRecipe();
  }, [cacheKey, fetchRecipe]);

  return { recipe, loading, error, refetch: refetchWithInvalidation };
}
