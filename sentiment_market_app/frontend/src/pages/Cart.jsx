import { useState } from "react";

export default function Cart() {
  // Données de démo - à remplacer par un vrai state management
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Smartphone Galaxy Pro",
      price: 899.99,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      sentimentScore: 85
    },
    {
      id: "2",
      name: "Casque Audio Premium",
      price: 299.99,
      quantity: 2,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      sentimentScore: 92
    },
    {
      id: "3",
      name: "Montre Connectée Sport",
      price: 399.99,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      sentimentScore: 78
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">
            Découvrez nos produits et ajoutez vos articles préférés
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Panier <span className="text-gray-500 text-xl font-normal">({cartItems.length} articles)</span>
        </h1>
        <button 
          onClick={() => setCartItems([])}
          className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Vider le panier
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 flex gap-6 relative group">
              {/* Image */}
              <div className="w-32 h-32 flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Info produit */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.round((item.sentimentScore / 100) * 5) ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{item.sentimentScore}/100</span>
                  </div>
                </div>

                {/* Prix et quantité */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} HTG
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.price.toFixed(2)} HTG × {item.quantity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Supprimer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Résumé</h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold">{subtotal.toFixed(2)} HTG</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-semibold">{shipping.toFixed(2)} HTG</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (20%)</span>
                <span className="font-semibold">{tax.toFixed(2)} HTG</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {total.toFixed(2)} HTG
                  </span>
                </div>
              </div>
            </div>

            {/* Code promo */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Code promo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO2024"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Appliquer</button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Passer la commande
              </button>
              <button className="w-full px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                Continuer mes achats
              </button>
            </div>

            {/* Garanties */}
            <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Livraison rapide
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Retours gratuits
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

