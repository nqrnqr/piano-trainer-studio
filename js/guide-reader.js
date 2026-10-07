// Render the repository's own setup documents. Chinese is the default;
// an explicit ?lang=en URL opens the English copy without changing app preferences.
(function () {
    'use strict';
    const page = document.body;
    const content = document.getElementById('content');
    const backLink = document.getElementById('guide-back');
    const sourceLink = document.getElementById('guide-source');
    const languageButtons = Array.from(document.querySelectorAll('[data-guide-language]'));
    let requestId = 0;
    const messages = {
        'zh-CN': {loading: '正在加载配置指南…', back: '← 返回应用', source: '查看 Markdown 原文',
            error: '配置指南加载失败。请刷新重试，或通过“查看 Markdown 原文”阅读。'},
        en: {loading: 'Loading setup guide…', back: '← Back to app', source: 'View Markdown source',
            error: 'Could not load the guide. Refresh to retry, or use “View Markdown source”.'}
    };

    async function loadGuide(value, updateUrl) {
        const language = value === 'en' ? 'en' : 'zh-CN';
        const copy = messages[language];
        const file = language === 'en' ? page.dataset.guideEn : page.dataset.guideZh;
        const token = ++requestId;
        document.documentElement.lang = language;
        document.title = language === 'en' ? page.dataset.titleEn : page.dataset.titleZh;
        backLink.textContent = copy.back;
        sourceLink.textContent = copy.source;
        sourceLink.href = file;
        for (const button of languageButtons) {
            button.setAttribute('aria-pressed', String(button.dataset.guideLanguage === language));
        }
        if (updateUrl) {
            const url = new URL(window.location.href);
            if (language === 'en') url.searchParams.set('lang', 'en');
            else url.searchParams.delete('lang');
            window.history.replaceState(null, '', url);
        }
        content.setAttribute('aria-busy', 'true');
        content.textContent = copy.loading;
        try {
            const response = await fetch(file, {cache: 'no-cache'});
            if (!response.ok) throw new Error('Guide HTTP ' + response.status);
            const markdown = await response.text();
            if (token !== requestId) return;
            if (!window.marked) throw new Error('Markdown renderer unavailable');
            content.innerHTML = window.marked.parse(markdown);
        } catch (error) {
            if (token !== requestId) return;
            content.textContent = copy.error;
            console.error('Could not load setup guide:', error);
        } finally {
            if (token === requestId) content.setAttribute('aria-busy', 'false');
        }
    }

    for (const button of languageButtons) {
        button.addEventListener('click', () => loadGuide(button.dataset.guideLanguage, true));
    }
    loadGuide(new URL(window.location.href).searchParams.get('lang'), false);
})();
