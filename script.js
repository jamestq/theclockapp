class TheClock {
    constructor() {
        this.localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.sharedTimeZone = null;
        this.sharedUserName = null;
        
        this.init();
    }
    
    init() {
        this.parseURLParams();
        this.updateClocks();
        this.setupEventListeners();
        
        setInterval(() => this.updateClocks(), 1000);
    }
    
    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.sharedTimeZone = urlParams.get('tz');
        this.sharedUserName = urlParams.get('user') || 'Shared User';
        
        if (this.sharedTimeZone) {
            document.getElementById('shared-title').textContent = `${this.sharedUserName}'s Time`;
        } else {
            document.getElementById('shared-title').textContent = 'Shared Time';
            document.querySelector('.clock-section:last-child').style.display = 'none';
        }
    }
    
    updateClocks() {
        this.updateLocalClock();
        if (this.sharedTimeZone) {
            this.updateSharedClock();
        }
    }
    
    updateLocalClock() {
        const now = new Date();
        
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('local-time').textContent = timeStr;
        document.getElementById('local-date').textContent = dateStr;
        document.getElementById('local-timezone').textContent = this.localTimeZone;
    }
    
    updateSharedClock() {
        if (!this.sharedTimeZone) return;
        
        const now = new Date();
        
        try {
            const timeStr = now.toLocaleTimeString('en-US', {
                timeZone: this.sharedTimeZone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateStr = now.toLocaleDateString('en-US', {
                timeZone: this.sharedTimeZone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            document.getElementById('shared-time').textContent = timeStr;
            document.getElementById('shared-date').textContent = dateStr;
            document.getElementById('shared-timezone').textContent = this.sharedTimeZone;
        } catch (error) {
            document.getElementById('shared-time').textContent = 'Invalid timezone';
            document.getElementById('shared-date').textContent = '';
            document.getElementById('shared-timezone').textContent = this.sharedTimeZone;
        }
    }
    
    setupEventListeners() {
        document.getElementById('share-btn').addEventListener('click', () => {
            this.generateShareLink();
        });
        
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyShareLink();
        });
    }
    
    generateShareLink() {
        const userName = prompt('Enter your name (optional):') || 'A Friend';
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?tz=${encodeURIComponent(this.localTimeZone)}&user=${encodeURIComponent(userName)}`;
        
        document.getElementById('share-url').value = shareUrl;
        document.getElementById('share-link').style.display = 'block';
    }
    
    copyShareLink() {
        const shareUrlInput = document.getElementById('share-url');
        shareUrlInput.select();
        shareUrlInput.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            const copyBtn = document.getElementById('copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TheClock();
});