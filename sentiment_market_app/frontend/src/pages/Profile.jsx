import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");

  // Données de démonstration
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    avatar: "JD",
    memberSince: "Janvier 2024",
    totalOrders: 12,
    totalSpent: 2499.87
  };

  const orders = [
    {
      id: "ORD-2024-001",
      date: "15 Oct 2024",
      status: "delivered",
      total: 1299.97,
      items: 3,
      products: [
        { name: "Smartphone Galaxy Pro", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100" },
        { name: "Casque Audio Premium", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" }
      ]
    },
    {
      id: "ORD-2024-002",
      date: "10 Oct 2024",
      status: "shipped",
      total: 399.99,
      items: 1,
      products: [
        { name: "Montre Connectée Sport", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" }
      ]
    },
    {
      id: "ORD-2024-003",
      date: "5 Oct 2024",
      status: "processing",
      total: 799.91,
      items: 2,
      products: [
        { name: "Tablette Pro 12", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100" }
      ]
    }
  ];

  const getStatusInfo = (status) => {
    const statuses = {
      delivered: { label: "Livrée", color: "text-green-400", bg: "bg-green-500/20", icon: "✓" },
      shipped: { label: "Expédiée", color: "text-blue-400", bg: "bg-blue-500/20", icon: "📦" },
      processing: { label: "En traitement", color: "text-yellow-400", bg: "bg-yellow-500/20", icon: "⏳" },
      cancelled: { label: "Annulée", color: "text-red-400", bg: "bg-red-500/20", icon: "✗" }
    };
    return statuses[status] || statuses.processing;
  };

  return (
    <div className="space-y-8">
      {/* En-tête profil */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {user.avatar}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Infos utilisateur */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Membre depuis {user.memberSince}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Client VIP
              </div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{user.totalOrders}</div>
              <div className="text-xs text-gray-600 mt-1">Commandes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{user.totalSpent.toFixed(2)} HTG</div>
              <div className="text-xs text-gray-600 mt-1">Total dépensé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mes commandes
            </div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres
            </div>
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "wishlist"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Liste de souhaits
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Onglet Commandes */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Historique des commandes</h2>
                <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toutes les commandes</option>
                  <option>En cours</option>
                  <option>Livrées</option>
                  <option>Annulées</option>
                </select>
              </div>

              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {order.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            {order.items} article{order.items > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {order.total.toFixed(2)} HTG
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">Voir détails</button>
                          {order.status === "delivered" && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Racheter</button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Aperçu produits */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items > order.products.length && (
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                          +{order.items - order.products.length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Onglet Paramètres */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres du compte</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" defaultValue={user.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input type="tel" placeholder="+33 6 12 34 56 78" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24" placeholder="Votre adresse complète..."></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Enregistrer</button>
                <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Annuler</button>
              </div>
            </div>
          )}

          {/* Onglet Liste de souhaits */}
          {activeTab === "wishlist" && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Votre liste de souhaits est vide</h3>
              <p className="text-gray-600 mb-6">Ajoutez vos produits préférés à votre liste de souhaits</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Explorer les produits</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

