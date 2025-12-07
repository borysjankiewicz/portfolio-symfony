import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
	static targets = ["form", "message", "button", "buttonText", "buttonLoader"];

	static values = {
		url: String
	}

	connect() {
		// Sprawdzenie na start (dla developera)
		if (!this.urlValue) {
			console.warn('Brak skonfigurowanego adresu URL do Lambdy!');
		}
		// Jeśli skrypt Cloudflare już jest załadowany, ale widget jest pusty -> Renderuj ręcznie!
		if (window.turnstile) {
			this.renderTurnstile();
		}
	}

	renderTurnstile() {
		// Znajdź kontener widgetu
		const widgetContainer = this.element.querySelector('.cf-turnstile');
		if (widgetContainer && !widgetContainer.hasChildNodes()) {
			// Pobierz sitekey z atrybutu (jeśli tam jest) lub wpisz na sztywno w opcjach
			const sitekey = widgetContainer.getAttribute('data-sitekey');

			window.turnstile.render(widgetContainer, {
				sitekey: sitekey,
				callback: function(token) {
					console.log('Challenge Success', token);
				},
			});
		}
	}


	async submit(event) {
		event.preventDefault();

		if (!this.urlValue) {
			this.showMessage('Błąd konfiguracji: Brak adresu API.', 'error');
			return;
		}

		this.lockButton(true);
		this.hideMessage();

		const formData = new FormData(this.formTarget);
		const data = Object.fromEntries(formData.entries());

		try {
			const response = await fetch(this.urlValue, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(data)
			});

			// ZMIANA: Najpierw parsujemy odpowiedź, niezależnie od statusu (200 czy 500)
			let result;
			try {
				result = await response.json();
			} catch (jsonError) {
				// Jeśli serwer nie zwrócił JSON-a (np. timeout gatewaya), rzucamy błąd
				throw new Error(`Critical Server Error: ${response.status}`);
			}

			// Teraz sprawdzamy logikę
			if (response.ok && result.success) {
				// SUKCES (Status 200 + success: true)
				this.showMessage('Dziękuję! Wiadomość została wysłana.', 'success');
				this.formTarget.reset();
			} else {
				// BŁĄD ZNANY (Status 4xx/5xx LUB success: false)
				// Tutaj wyświetlimy komunikat z Lambdy (np. "Błąd serwera pocztowego")
				const errorMessage = result.error || 'Wystąpił nieznany błąd.';
				this.showMessage(errorMessage, 'error');
			}

		} catch (error) {
			// BŁĄD SIECIOWY (Brak internetu, CORS, błąd DNS)
			console.error('Network Error:', error);
			this.showMessage('Nie można wysłać formularza (problem z siecią).', 'error');
		} finally {
			this.lockButton(false);
		}
	}



	// --- UI Helpers ---

	lockButton(isLocked) {
		this.buttonTarget.disabled = isLocked;
		if (isLocked) {
			this.buttonTextTarget.style.display = 'none';
			this.buttonLoaderTarget.style.display = 'inline-block';
		} else {
			this.buttonTextTarget.style.display = 'inline-block';
			this.buttonLoaderTarget.style.display = 'none';
		}
	}

	showMessage(text, type) {
		this.messageTarget.style.display = 'block';
		this.messageTarget.innerText = text;

		if (type === 'success') {
			this.messageTarget.style.backgroundColor = '#d4edda';
			this.messageTarget.style.color = '#155724';
			this.messageTarget.style.border = '1px solid #c3e6cb';
		} else {
			// Styl błędu (czerwony)
			this.messageTarget.style.backgroundColor = '#f8d7da';
			this.messageTarget.style.color = '#721c24';
			this.messageTarget.style.border = '1px solid #f5c6cb';
		}
	}

	hideMessage() {
		this.messageTarget.style.display = 'none';
	}
}
