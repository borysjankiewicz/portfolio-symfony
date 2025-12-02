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
    }

    async submit(event) {
        event.preventDefault();

        // 0. Szybkie sprawdzenie, czy mamy gdzie wysłać
        if (!this.urlValue) {
            this.showMessage('Błąd konfiguracji: Brak adresu API. Spróbuj później.', 'error');
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

            // 1. OBSŁUGA BŁĘDÓW HTTP (404, 500, 502)
            // Jeśli Lambda nie istnieje (404) lub AWS ma awarię (500)
            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            // Próbujemy odczytać JSON tylko jeśli status jest OK
            const result = await response.json();

            // 2. OBSŁUGA LOGIKI BIZNESOWEJ (Lambda działa, ale np. walidacja nie przeszła)
            if (result.success) {
                this.showMessage('Dziękuję! Wiadomość została wysłana.', 'success');
                this.formTarget.reset();
            } else {
                // Lambda zwróciła błąd (np. "Puste pole")
                this.showMessage(result.error || 'Wystąpił błąd walidacji.', 'error');
            }

        } catch (error) {
            // 3. OBSŁUGA BŁĘDÓW KRYTYCZNYCH (Sieć, DNS, CORS, lub throw powyżej)
            console.error('Błąd wysyłania:', error);
            
            // Komunikat o braku połączenia
            this.showMessage('Nie można wysłać formularza (błąd połączenia). Spróbuj ponownie później.', 'error');
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
