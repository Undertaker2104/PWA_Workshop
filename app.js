// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                console.log('Service Worker registered successfully:', registration.scope);
                showStatus('Service Worker registered - App ready for offline use!', 'success');
            })
            .catch(function (error) {
                console.log('Service Worker registration failed:', error);
                showStatus('Service Worker registration failed', 'error');
            });
    });
}

// Basic PWA functionality
document.addEventListener('DOMContentLoaded', function () {
    console.log('Smart Things PWA loaded');

    // Check if app is running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        console.log('App is running as PWA');
        showStatus('Running as installed PWA!', 'success');
    }

    // Add install prompt functionality
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', function (e) {
        console.log('Install prompt available');
        e.preventDefault();
        deferredPrompt = e;

        // Show install button if it exists
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', function () {
                installApp();
            });
        }
    });

    // Create install button dynamically
    createInstallButton();
});

// Install app function
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                showStatus('App installed successfully!', 'success');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Create install button
function createInstallButton() {
    const container = document.querySelector('.container');
    if (container) {
        const installSection = document.createElement('div');
        installSection.innerHTML = `
      <h2>Install App</h2>
      <p>Install this app on your device for a better experience!</p>
      <button id="installBtn" class="button" style="display: none; margin-right: 10px;">
        📱 Install App
      </button>
    `;

        // Insert before the last element (the existing button)
        const lastElement = container.lastElementChild;
        container.insertBefore(installSection, lastElement);
    }
}

// Status notification function
function showStatus(message, type = 'info') {
    // Remove existing status messages
    const existingStatus = document.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }

    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;

    // Add styles
    statusDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ${type === 'success' ? 'background-color: #28a745;' : ''}
    ${type === 'error' ? 'background-color: #dc3545;' : ''}
    ${type === 'info' ? 'background-color: #007bff;' : ''}
  `;

    document.body.appendChild(statusDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        statusDiv.remove();
    }, 5000);
}

// Enhanced button functionality
function enhanceExistingButton() {
    const button = document.querySelector('.button');
    if (button && button.onclick) {
        const originalOnclick = button.onclick;
        button.onclick = function () {
            originalOnclick();
            showStatus('Button clicked! PWA is working correctly.', 'info');
        };
    }
}

// Check network status
function checkNetworkStatus() {
    if (navigator.onLine) {
        showStatus('Online - Full functionality available', 'success');
    } else {
        showStatus('Offline - Using cached content', 'info');
    }
}

// Listen for network changes
window.addEventListener('online', function () {
    showStatus('Back online!', 'success');
});

window.addEventListener('offline', function () {
    showStatus('Gone offline - App will work with cached content', 'info');
});

// Initialize enhanced functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    enhanceExistingButton();

    // Show initial network status after a brief delay
    setTimeout(checkNetworkStatus, 2000);
});
