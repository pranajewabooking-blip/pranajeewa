// WhatsApp Chat Widget - Shared Component
// Loaded via external platform (Elfsight)
(function() {
    // Prevent duplicate loading
    if (document.querySelector('.elfsight-app-94caa7a0-c8e2-4f83-aee0-4bbe4f40222b')) return;
    if (document.getElementById('elfsight-whatsapp-script')) return;

    var script = document.createElement('script');
    script.id = 'elfsight-whatsapp-script';
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.head.appendChild(script);

    var div = document.createElement('div');
    div.className = 'elfsight-app-94caa7a0-c8e2-4f83-aee0-4bbe4f40222b';
    div.setAttribute('data-elfsight-app-lazy', '');
    document.body.appendChild(div);
})();