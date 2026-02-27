

//  une option "Quitter" dans le menu si elle existe et demande confirmation au clic
document.addEventListener('DOMContentLoaded', function () {
    const quitterLink = document.querySelector('a[href="quitter"]');
    if (quitterLink) {
        quitterLink.addEventListener('click', function (e) {
            const confirmation = confirm("Voulez vous vraiment quitté et revenir à la page d'acceuille ?");
            if (!confirmation) {
                e.preventDefault();
            } else {
                // Redirige vers une page de déconnexion ou ferme la fenêtre si besoin
                // window.close(); // Attention : window.close() ne fonctionne que si la fenêtre a été ouverte par script
            }
        });
    }
});

// Met en surbrillance le lien actif dans le menu de navigation
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        if (window.location.pathname.endsWith(link.getAttribute('href'))) {
            link.style.textDecoration = 'underline';
        }
    });
});

// Confirmation à l'envoi du formulaire de contact
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert(t('contact.thanks') || 'Merci pour votre message ! Nous vous répondrons rapidement.');
            form.reset();
        });
    }
});
// Affiche un commentaire quand on clique sur une image avec la classe 'img-comment'
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.img-comment');
    images.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener('click', function () {
            // Crée ou met à jour la bulle de commentaire
            let commentBox = document.getElementById('img-comment-box');
            if (!commentBox) {
                commentBox = document.createElement('div');
                commentBox.id = 'img-comment-box';
                document.body.appendChild(commentBox);
            }
            commentBox.textContent = img.getAttribute('data-comment');
            commentBox.style.position = 'fixed';
            commentBox.style.left = '50%';
            commentBox.style.top = '20%';
            commentBox.style.transform = 'translate(-50%, 0)';
            commentBox.style.background = '#fffdfa';
            commentBox.style.color = '#222';
            commentBox.style.padding = '18px 28px';
            commentBox.style.borderRadius = '12px';
            commentBox.style.boxShadow = '0 4px 24px rgba(196,122,27,0.13)';
            commentBox.style.zIndex = '9999';
            commentBox.style.fontSize = '1.15em';
            commentBox.style.maxWidth = '90vw';
            commentBox.style.textAlign = 'center';
            commentBox.style.cursor = 'pointer';
            // Clique sur la bulle pour la fermer
            commentBox.onclick = () => commentBox.remove();
        });
    });
});

// --- i18n: chargement dynamique des traductions ---
document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('lang-select');
    const defaultLang = document.documentElement.lang || 'fr';
    const saved = localStorage.getItem('site-lang') || defaultLang;

    function applyTranslations(translations) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations;
            for (const k of keys) {
                if (value && k in value) value = value[k];
                else { value = null; break; }
            }
            if (value !== null && value !== undefined) {
                if (el.placeholder !== undefined && el.tagName.toLowerCase() === 'input') el.placeholder = value;
                else el.innerHTML = value;
            }
        });
    }
    // keep current translations in memory for lookup
    let currentTranslations = {};
    function t(key) {
        const keys = key.split('.');
        let v = currentTranslations;
        for (const k of keys) {
            if (v && k in v) v = v[k];
            else { v = undefined; break; }
        }
        return v !== undefined ? v : key;
    }

    async function loadLocale(lang) {
        try {
            const res = await fetch(`locales/${lang}.json`);
            if (!res.ok) throw new Error('Locale not found');
            const translations = await res.json();
            applyTranslations(translations);
            currentTranslations = translations;
            document.documentElement.lang = lang;
            localStorage.setItem('site-lang', lang);
        } catch (e) {
            console.warn('i18n load failed for', lang, e);
        }
    }

    if (select) {
        select.value = saved;
        select.addEventListener('change', (e) => loadLocale(e.target.value));
    }

    loadLocale(saved).then(() => {
        // quit button translation
        const quitterBtn = document.getElementById('quitter-btn');
        if (quitterBtn) {
            quitterBtn.addEventListener('click', function (e) {
                const msg = t('contact.confirmQuit') || 'Êtes-vous sûr de quitter ?';
                if (!confirm(msg)) e.preventDefault();
                else window.location.href = 'index.html';
            });
        }
    });
});
       