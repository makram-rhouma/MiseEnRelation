# Beehive Group - Site Vitrine

Un site web moderne, élégant et professionnel qui unifie les trois services du groupe Beehive : Lodge (hébergements premium), Service (plateforme de services), et Store (marketplace e-commerce).

## 🚀 Fonctionnalités

### Pages
- **Accueil** : Hero slider, highlights des 3 services, animations
- **À propos** : Mission, vision, timeline de croissance
- **Fonctionnalités** : Grid interactif avec onglets pour chaque service
- **Blog** : Grille de cartes avec catégories et animations
- **Contact** : Formulaire de contact avec intégration backend
- **Demande de Démo** : Formulaire avancé avec options de programmation

### Technologies
- **Frontend** : HTML5, CSS3, JavaScript ES6+, Bootstrap 5
- **Backend** : PHP (pour les formulaires)
- **Animations** : AOS (Animate On Scroll), animations CSS personnalisées
- **Typographie** : Google Fonts (Poppins)
- **Icons** : Font Awesome 6

### Design
- **Couleurs** : Or (#D4A017) comme couleur principale, noir, blanc, gris
- **Style** : Minimalisme luxueux avec glassmorphism et ombres douces
- **Responsive** : Optimisé pour desktop, tablet et mobile
- **Effets** : Hover animations, golden glow, smooth scrolling

## 📁 Structure du Projet

```
beehive-website/
├── index.html              # Page principale
├── css/
│   └── style.css           # Styles personnalisés
├── js/
│   └── main.js             # JavaScript interactif
├── images/                 # Images et assets
├── contact.php             # Backend formulaire contact
├── demo.php               # Backend demande de démo
├── README.md              # Documentation
├── Dockerfile             # Configuration Docker
└── .htaccess              # Configuration Apache
```

## 🛠️ Installation

### Prérequis
- Serveur web (Apache/Nginx)
- PHP 7.4+ (pour les formulaires)
- Support des emails PHP

### Installation Locale

1. **Cloner ou télécharger** le projet dans votre serveur web
   ```bash
   git clone <repository-url> beehive-website
   cd beehive-website
   ```

2. **Configurer le serveur web**
   - Apache : Assurer que mod_rewrite est activé
   - Nginx : Configurer les redirections si nécessaire

3. **Configurer les emails**
   - Modifier les adresses email dans `contact.php` et `demo.php`
   - Configurer le serveur SMTP si nécessaire

4. **Tester l'installation**
   - Ouvrir `http://localhost/beehive-website`
   - Vérifier que toutes les animations fonctionnent
   - Tester les formulaires de contact et de démo

### Installation Docker

1. **Build l'image Docker**
   ```bash
   docker build -t beehive-website .
   ```

2. **Lancer le container**
   ```bash
   docker run -d -p 80:80 --name beehive-site beehive-website
   ```

3. **Accéder au site**
   ```
   http://localhost
   ```

## ⚙️ Configuration

### Formulaires PHP

**Contact.php**
- Modifier `$to = 'contact@beehivegroup.com';` avec votre email
- Personnaliser le template email si nécessaire

**Demo.php**
- Modifier `$to = 'demo@beehivegroup.com';` avec votre email
- Ajuster les services disponibles dans le tableau `$services`

### Intégration Gmail API (Alternative)

Pour utiliser l'API Gmail au lieu du PHP mail(), vous pouvez :

1. Configurer les credentials Google OAuth 2.0
2. Remplacer la logique d'envoi dans les fichiers PHP
3. Utiliser la library Google Client PHP

### WhatsApp Business

Modifier le lien WhatsApp dans `index.html` :
```html
<a href="https://wa.me/33123456789" class="whatsapp-float" target="_blank">
```

## 🎨 Personnalisation

### Couleurs
Modifier les variables CSS dans `css/style.css` :
```css
:root {
    --gold-primary: #D4A017;
    --gold-secondary: #B8860B;
    --gold-light: #F4E4BC;
    /* ... */
}
```

### Images
- Hero slider : Remplacer les URLs d'images Unsplash
- Blog : Ajouter vos images dans le dossier `images/`
- About : Remplacer `images/about-beehive.jpg`

### Contenu
- Modifier les textes directement dans `index.html`
- Personnaliser les services dans la section highlights
- Mettre à jour les informations de contact

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints pour :
- Desktop (>= 1200px)
- Tablet (768px - 1199px) 
- Mobile (< 768px)

## 🔧 Optimisations SEO

### Métadonnées
- Titles et descriptions optimisées
- Meta keywords
- Open Graph tags (à ajouter)
- Schema.org structured data (à ajouter)

### Performance
- Images optimisées et lazy loading
- CSS et JS minifiés (en production)
- CDN pour Bootstrap et Font Awesome
- Compression gzip activée

## 🚀 Déploiement

### Serveur Traditionnel
1. Upload des fichiers via FTP/SFTP
2. Configurer les permissions (755 pour dossiers, 644 pour fichiers)
3. Tester les formulaires avec un vrai serveur SMTP

### Docker Production
```bash
docker build -t beehive-prod .
docker run -d -p 80:80 -p 443:443 --name beehive-production beehive-prod
```

### CDN et Cache
- Activer la mise en cache des assets statiques
- Utiliser un CDN pour les images
- Configurer les headers de cache appropriés

## 🔒 Sécurité

### Formulaires
- Validation et sanitisation des inputs
- Protection CSRF (à ajouter)
- Rate limiting pour éviter le spam
- Validation côté serveur et client

### Serveur
- HTTPS obligatoire en production
- Headers de sécurité (HSTS, CSP, etc.)
- Mise à jour régulière de PHP
- Logs de sécurité activés

## 📊 Analytics et Tracking

### À ajouter
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- Hotjar pour l'analyse UX

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📞 Support

Pour toute question ou assistance :

- **Email** : dev@beehivegroup.com
- **Documentation** : [Documentation complète](#)
- **Issues** : [GitHub Issues](#)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ par l'équipe Beehive Group**

🐝 *"Transforming digital experiences, one hive at a time"*
