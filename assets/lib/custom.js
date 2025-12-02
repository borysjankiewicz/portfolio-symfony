$(document).ready(function() {
	$('.popup-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1]
		},
		image: {
			tError: '<a href="%url%">Obraz</a> nie mógł zostać załadowany.',
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		}
	});
});


(function() {
	// Funkcja zmieniająca klasy CSS
	function activatePortfolio(isPortfolioActive) {
		const homeLi = document.getElementById('nav-home');
		const portfolioLi = document.getElementById('nav-portfolio');

		if (isPortfolioActive) {
			if (homeLi) homeLi.classList.remove('active');
			if (portfolioLi) portfolioLi.classList.add('active');
		} else {
			if (homeLi) homeLi.classList.add('active');
			if (portfolioLi) portfolioLi.classList.remove('active');
		}
	}

	// Funkcja sprawdzająca stan na podstawie adresu URL (dla odświeżenia/wstecz)
	function checkUrl() {
		const path = window.location.pathname;
		const hash = window.location.hash;

		// Logika: Portfolio aktywne jeśli jest hash #portfolio LUB ścieżka /work
		const isPortfolio = hash.includes('portfolio') || 
		hash.includes('work') || 
		path.includes('/portfolio') || 
		path.includes('/work');

		// Logika: Home aktywny TYLKO jeśli jesteśmy na '/' i NIE ma portfolio
		const isHome = (path === '/' && !isPortfolio);

		if (isPortfolio) {
			activatePortfolio(true);
		} else if (isHome) {
			activatePortfolio(false);
		}
	}

	// --- LISTENERS ---

	// 1. Obsługa wejścia na stronę i nawigacji Turbo
	document.addEventListener('DOMContentLoaded', checkUrl);
	document.addEventListener('turbo:load', checkUrl); // Dla Symfony 7
	window.addEventListener('popstate', checkUrl); // Dla przycisków przeglądarki

	// 2. Obsługa kotwicy (gdy zmienia się tylko # w adresie)
	window.addEventListener('hashchange', checkUrl);

	// 3. OBSŁUGA KLIKNIĘCIA (To naprawia Twój błąd na Home Page)
	document.addEventListener('click', function(e) {
		// Znajdź link (nawet jeśli kliknięto w <span> w środku)
		const link = e.target.closest('a');
		if (!link) return;

		const href = link.getAttribute('href');
		if (!href) return;

		// Sprawdzamy, czy kliknięty link prowadzi do portfolio
		if (href.includes('portfolio') || href.includes('work')) {
			// Wymuś zmianę natychmiast (z małym opóźnieniem dla pewności)
			setTimeout(() => activatePortfolio(true), 10);
		}
		// Sprawdzamy czy kliknięto w Home (i to nie jest link z hashem)
		else if (href === '/' || (href === window.location.pathname && !href.includes('#'))) {
			setTimeout(() => activatePortfolio(false), 10);
		}
	});
})();


$(document).ready(function() {
	$('a[href="/"], a[href="' + window.location.origin + '/"]').on('click', function(e) {

		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && 
		location.hostname == this.hostname) {

			e.preventDefault();

			// 1. NAJWAŻNIEJSZA ZMIANA:
			// .stop(true, true) czyści kolejkę i wymusza natychmiastowy start
			// Zmniejszyłem też czas z 800 na 500ms dla wrażenia szybszej reakcji
			$('html, body').stop(true, true).animate({
				scrollTop: 0
			}, 500); 

			// 2. Aktualizacja Menu (natychmiastowa wizualnie)
			$('#nav-home').addClass('active');
			$('#nav-portfolio').removeClass('active');

			// 3. Czyszczenie URL
			if (history.pushState) {
				history.pushState(null, null, '/'); 
			}
		}
	});
});




