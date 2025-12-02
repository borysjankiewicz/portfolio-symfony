import './stimulus_bootstrap.js';


/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

// Importujemy z katalogu "lib" (Twoje ręczne pliki)
import "./lib/jquery/jquery.js";
// 2. Ręczne przypisanie (Bridge)
// Skoro jQuery (stara wersja) dopisało się do `window.jQuery`, musimy to
// jawnie przypisać do `window.$`, żeby kolejne skrypty (Bootstrap) to widziały.
if (typeof window.jQuery !== 'undefined') {
    window.$ = window.jQuery;
} else {
    console.error('Błąd: jQuery nie zostało poprawnie załadowane z pliku.');
}

// Import reszty z "lib"
import './lib/bootstrap/bootstrap.min.js';
import './lib/megamenu/js/main.js';
import './lib/magnific-popup/jquery.magnific-popup.js';
//import './lib/custom.js';

//console.log('Legacy scripts loaded from /lib');


console.log('App & Plugins Loaded. jQuery version:', $.fn.jquery);

// 3. GŁÓWNA FUNKCJA INICJALIZUJĄCA (Dla Turbo i zwykłego ładowania)
// Zamykamy wszystko w funkcję, którą będziemy wywoływać przy każdej zmianie strony
function initApp() {

    // --- A. Obsługa Magnific Popup ---
    if ($('.popup-gallery').length > 0) {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">Obraz</a> nie mógł zostać załadowany.',
                titleSrc: function(item) {
                    return item.el.attr('title');
                }
            }
        });
        console.log('Magnific Popup initialized');
    }

    // --- B. Obsługa Active Menu (Naprawiona logika) ---
    checkAndSetActiveMenu();
}

// Funkcja pomocnicza do Menu (wyciągnięta na zewnątrz dla czytelności)
function checkAndSetActiveMenu() {
    const path = window.location.pathname; // np. /about
    const hash = window.location.hash;     // np. #portfolio

    const navHome = document.getElementById('nav-home');
    const navPortfolio = document.getElementById('nav-portfolio');

    // Reset klas (najpierw czyścimy)
    if (navHome) navHome.classList.remove('active');
    if (navPortfolio) navPortfolio.classList.remove('active');

    // LOGIKA:
    // 1. Jesteśmy w portfolio jeśli: URL ma /work LUB /portfolio LUB hash to #portfolio LUB #work
    const isPortfolioSection = path.includes('/work') ||
                               path.includes('/portfolio') ||
                               hash === '#portfolio' ||
                               hash === '#work';

    if (isPortfolioSection) {
        if (navPortfolio) navPortfolio.classList.add('active');
    }
    // 2. Jesteśmy na Home TYLKO jeśli to nie portfolio i ścieżka to '/'
    else if (path === '/') {
        if (navHome) navHome.classList.add('active');
    }
    // 3. Inne podstrony (About, Contact) obsługuje Twig, ale JS nie musi ich psuć.
}

// 4. EVENT LISTENERS (Uruchamianie aplikacji)

// Start przy pierwszym wejściu
$(document).ready(function() {
    initApp();
});

// Start przy nawigacji Turbo (Kluczowe dla Symfony!)
document.addEventListener('turbo:load', function() {
    initApp();
});

// Obsługa kliknięcia w menu (dla natychmiastowej reakcji bez przeładowania)
window.addEventListener('hashchange', checkAndSetActiveMenu);

// Obsługa kliknięć w linki (Fix dla "Scroll to section")
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Jeśli klikamy w link prowadzący do kotwicy na tej samej stronie
    if (href.startsWith('/#') || href.startsWith('#')) {
        // Małe opóźnienie, by URL zdążył się zmienić
        setTimeout(checkAndSetActiveMenu, 50);
    }
});







