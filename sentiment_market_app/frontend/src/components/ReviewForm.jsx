import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
export default function ReviewForm({ productId, userId, userEmail, userDisplayName, onReviewAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Vérifier si l'utilisateur est connecté
  const { currentUser } = useAuth();
  const isAuthenticated = currentUser?.uid && currentUser?.uid !==  "guest";
  const submitReview = async () => {
    if (!text.trim() || !isAuthenticated) return;
    
    setLoading(true);
    try {
      await axios.post("/api/reviews", {
        userId,
        productId,
        text,
        userEmail,
        userDisplayName
      });
      setText("");
      onReviewAdded?.();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Donner votre avis
      </h3>

      {/* Message si non connecté */}
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Connexion requise</p>
            <p className="text-sm text-blue-700 mt-1">
              Vous devez être connecté pour laisser un avis sur ce produit.
            </p>
          </div>
        </div>
      )}

      <textarea
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={isAuthenticated ? "Partagez votre expérience avec ce produit..." : "Connectez-vous pour laisser un avis..."}
        value={text}
        style={{ color: 'black' }}
        onChange={(e) => setText(e.target.value)}
        disabled={loading || !isAuthenticated}
      />
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {text.length}/500 caractères
        </span>
        <button
          onClick={submitReview}
          disabled={loading || !text.trim() || !isAuthenticated}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          title={!isAuthenticated ? "Connectez-vous pour envoyer un avis" : ""}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Envoyer mon avis
            </>
          )}
        </button>
      </div>
    </div>
  );
}