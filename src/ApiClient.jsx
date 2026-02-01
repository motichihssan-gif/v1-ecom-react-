import React, { useEffect, useState } from 'react';
import axios from 'axios';

// API URL (Relative to proxy)
const API_URL = 'https://v1-ecom-ww.vercel.app/api';

export default function ApiClient({ refreshKey }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetail, setErrorDetail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/products`);
                let data = response.data;

                // Handle both array and paginated wrapped data
                const productsList = Array.isArray(data) ? data : (data.data || []);

                // Sort by ID descending (newest first)
                productsList.sort((a, b) => Number(b.id) - Number(a.id));

                setProducts(productsList);
            } catch (err) {
                console.error("API Error Detailed:", err);
                let msg = "Impossible de charger les produits.";
                if (err.response) {
                    msg += ` (Status: ${err.response.status})`;
                } else if (err.request) {
                    msg += " (Pas de réponse du serveur. Vérifiez que l'API est accessible.)";
                } else {
                    msg += ` (${err.message})`;
                }
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [refreshKey]);

    const filteredProducts = products.filter(prod =>
        (prod.titre?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (prod.categorie?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (prod.contenu?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (loading && products.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <div className="loader">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <header className="navbar glass" style={{ borderRadius: 'var(--radius-md)', padding: '1rem 2rem', marginBottom: '3rem', position: 'sticky', top: '1rem', zIndex: 100 }}>
                <div className="navbar-content" style={{ width: '100%' }}>
                    <div className="logo-text">EcomSport</div>
                    <div style={{ flexGrow: 1, margin: '0 2rem' }}>
                        <input
                            type="text"
                            placeholder="Rechercher un produit, une catégorie..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="glass"
                            style={{ background: 'rgba(255,255,255,0.7)' }}
                        />
                    </div>
                </div>
            </header>

            <main>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>
                        {searchQuery ? `Résultats pour "${searchQuery}"` : "Nos Produits"}
                    </h2>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>
                        {filteredProducts.length} produits trouvés
                    </span>
                </div>

                {error && products.length === 0 && (
                    <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <p style={{ color: '#dc2626', fontWeight: '600' }}>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                            style={{ marginTop: '1rem' }}
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && !error && (
                    <div className="glass" style={{ padding: '4rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Aucun produit ne correspond à votre recherche.</p>
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Catégorie</th>
                                <th>Prix</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        <img
                                            src={prod.image || 'https://via.placeholder.com/100x100?text=Pas+d\'image'}
                                            alt={prod.titre}
                                            className="table-image"
                                        />
                                    </td>
                                    <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{prod.titre}</td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {prod.contenu}
                                    </td>
                                    <td>
                                        <span className="category-badge">{prod.categorie}</span>
                                    </td>
                                    <td>
                                        <span className="price-tag">{Number(prod.prix).toFixed(2)} €</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '4rem' }}>
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 1}
                            className="glass"
                            style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                        >
                            Précédent
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? "btn-primary" : "glass"}
                                style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="glass"
                            style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </main>

            <footer style={{ marginTop: '6rem', paddingBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <p>&copy; 2026 Motiich Shop. Tous droits réservés.</p>
            </footer>
        </div>
    );
}
