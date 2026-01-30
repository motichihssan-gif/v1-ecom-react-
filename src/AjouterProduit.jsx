import axios from 'axios';
import React, { useState } from 'react';

export default function AjouterProduit({ onProductAdded }) {
    const [titre, setTitre] = useState('');
    const [contenu, setContenu] = useState('');
    const [prix, setPrix] = useState('');
    const [categorie, setCategorie] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setStatus(null);
        setErrors({});
        setLoading(true);

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('contenu', contenu);
        formData.append('prix', prix);
        formData.append('categorie', categorie);
        formData.append('solde', 0); // Default value as requested
        if (image) {
            formData.append('image', image);
        }

        try {
            // Using '/api' which is proxied via vite.config.js
            const response = await axios.post('/api/products', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage("Produit ajouté avec succès !");
            setStatus('success');

            // Reset fields
            setTitre('');
            setContenu('');
            setPrix('');
            setCategorie('');
            setImage(null);

            // Notify parent to refresh products
            if (onProductAdded) {
                onProductAdded();
            }

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage('');
                setStatus(null);
            }, 3000);

        } catch (error) {
            console.error("Erreur lors de l'ajout du produit :", error);
            setStatus('error');
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                    setMessage('Veuillez corriger les erreurs de validation.');
                } else {
                    const errorDetail = error.response.data.message || error.response.statusText || error.response.status;
                    setMessage(`Erreur serveur (${error.response.status}): ${errorDetail}`);
                }
            } else if (error.request) {
                setMessage('Erreur réseau : Impossible de contacter le serveur. Vérifiez que Laravel est lancé.');
            } else {
                setMessage(`Erreur : ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container" style={{ marginBottom: '4rem', perspective: '1000px' }}>
            <div className="glass" style={{
                padding: '3.5rem',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '850px',
                margin: '0 auto',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                color: 'var(--text-main)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.025em',
                        lineHeight: '1.2'
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            Ajouter un produit
                        </span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Ajoutez un nouvel article à la collection EcomSport</p>
                </div>

                {message && (
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '2.5rem',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '1rem',
                        backgroundColor: status === 'error' ? '#fef2f2' : '#f0fdf4',
                        color: status === 'error' ? '#dc2626' : '#10b981',
                        border: `1px solid ${status === 'error' ? '#fecaca' : '#bbf7d0'}`,
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        {status === 'success' ? '🚀 ' : '⚠️ '}{message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Nom du produit
                        </label>
                        <input
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Ex: Basket Running Pro"
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                background: '#f8fafc',
                                border: `2px solid ${errors.titre ? '#ef4444' : '#e2e8f0'}`,
                                color: 'var(--text-main)',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = errors.titre ? '#ef4444' : '#e2e8f0'}
                        />
                        {errors.titre && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.titre[0]}</div>}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            Description
                        </label>
                        <textarea
                            value={contenu}
                            onChange={(e) => setContenu(e.target.value)}
                            placeholder="Spécifications techniques, matériaux..."
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                minHeight: '140px',
                                background: '#f8fafc',
                                border: `2px solid ${errors.contenu ? '#ef4444' : '#e2e8f0'}`,
                                color: 'var(--text-main)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = errors.contenu ? '#ef4444' : '#e2e8f0'}
                        />
                        {errors.contenu && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.contenu[0]}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Prix (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={prix}
                            onChange={(e) => setPrix(e.target.value)}
                            placeholder="0.00"
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                background: '#f8fafc',
                                border: `2px solid ${errors.prix ? '#ef4444' : '#e2e8f0'}`,
                                color: 'var(--text-main)',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = errors.prix ? '#ef4444' : '#e2e8f0'}
                        />
                        {errors.prix && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.prix[0]}</div>}
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                            Catégorie
                        </label>
                        <select
                            value={categorie}
                            onChange={(e) => setCategorie(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                background: '#f8fafc',
                                border: `2px solid ${errors.categorie ? '#ef4444' : '#e2e8f0'}`,
                                color: 'var(--text-main)',
                                outline: 'none',
                                appearance: 'none',
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1.25rem center',
                                backgroundSize: '1.25rem'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = errors.categorie ? '#ef4444' : '#e2e8f0'}
                        >
                            <option value="" disabled>Choisir une catégorie</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Running">Running</option>
                            <option value="Sport">Sac de sport</option>
                        </select>
                        {errors.categorie && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.categorie[0]}</div>}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Image du produit
                        </label>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            alignItems: 'center',
                            padding: '2.5rem',
                            border: `2px dashed ${errors.image ? '#ef4444' : '#e2e8f0'}`,
                            borderRadius: 'var(--radius-md)',
                            background: '#f8fafc',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = errors.image ? '#ef4444' : '#e2e8f0'}
                        >
                            <label className="btn-primary" style={{ padding: '0.875rem 2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)' }}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span style={{ fontWeight: '700' }}>Choisir une image</span>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    required
                                />
                            </label>
                            <span style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontStyle: image ? 'normal' : 'italic' }}>
                                {image ? `📸 ${image.name}` : 'Glissez-déposez ou cliquez pour sélectionner'}
                            </span>
                        </div>
                        {errors.image && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{errors.image[0]}</div>}
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1.5rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.5rem',
                                fontSize: '1.25rem',
                                fontWeight: '800',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3)';
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    TRAITEMENT...
                                </>
                            ) : (
                                <>
                                    Ajouter le produit
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
