// countdown.js - Lógica de la cuenta regresiva
import { CONFIG } from '../config.js';

class CountdownTimer {
    constructor(targetDateStr) {
        this.targetDate = new Date(targetDateStr).getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.interval = null;
    }

    start() {
        this.update(); // Llamada inmediata para evitar retardo
        this.interval = setInterval(() => this.update(), 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.stop();
            this.renderZeros();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.render(days, hours, minutes, seconds);
    }

    render(d, h, m, s) {
        if(!this.elements.days) return; // Prevención si no estamos en el index
        
        this.elements.days.textContent = d.toString().padStart(2, '0');
        this.elements.hours.textContent = h.toString().padStart(2, '0');
        this.elements.minutes.textContent = m.toString().padStart(2, '0');
        this.elements.seconds.textContent = s.toString().padStart(2, '0');
    }

    renderZeros() {
        this.render(0, 0, 0, 0);
    }
}

export const initCountdown = () => {
    const timer = new CountdownTimer(CONFIG.targetDateISO);
    timer.start();
    return timer;
};