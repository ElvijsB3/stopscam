chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' && tab.active) {
        // Iegūstam bloķējamo vietņu sarakstu no GitHub
        fetch('https://raw.githubusercontent.com/ElvijsB3/stopscam/main/scamwebsite.json')
            .then(response => response.json())
            .then(data => {
                const url = new URL(tab.url);
                const hostname = url.hostname;
                const path = url.pathname.toLowerCase();

                // Pārbaudām vai vietne ir atrodama sarakstā
                const isScamWebsite = data.some(item => {
                    if (item.startsWith("*.")) {
                        // Daļēja vietnes domēna vārda sakritība
                        const domain = item.substring(2);
                        return hostname.endsWith(domain);
                    } else {
                        // Pilna domēna vārda sakritība
                        return (
                            hostname === item ||
                            path.includes(item.toLowerCase())
                        );
                    }
                });

                // Atjaunojam lapu ar brīdinājumu
                if (isScamWebsite) {
                    chrome.tabs.update(tabId, {url: chrome.extension.getURL('warning.html')});
                }
            });
    }
});
