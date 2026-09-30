// Shared script for BEEM STUDIOS inner pages: language toggle + table of contents.
(function () {
    const blocks = document.querySelectorAll('[data-lang-block]');
    const labels = document.querySelectorAll('[data-tr]');
    labels.forEach(el => { el.dataset.en = el.textContent; });

    function setLang(lang) {
        blocks.forEach(b => b.classList.toggle('shown', b.dataset.langBlock === lang));
        labels.forEach(el => { el.textContent = lang === 'tr' ? el.dataset.tr : el.dataset.en; });
        document.documentElement.lang = lang;
        const title = document.body.dataset['title' + (lang === 'tr' ? 'Tr' : 'En')];
        if (title) document.title = title;
        document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
        try { localStorage.setItem('lang', lang); } catch (e) {}
        buildToc(lang);
    }

    function buildToc(lang) {
        const block = document.querySelector('[data-lang-block="' + lang + '"]');
        const toc = block && block.querySelector('.toc ol');
        if (!toc) return;
        toc.innerHTML = '';
        block.querySelectorAll('h3').forEach((h, i) => {
            if (!h.id) h.id = lang + '-s' + (i + 1);
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent.replace(/^\d+\.\s*/, '');
            const li = document.createElement('li');
            li.appendChild(a);
            toc.appendChild(li);
        });
        observeHeadings(block);
    }

    let observer;
    function observeHeadings(block) {
        if (observer) observer.disconnect();
        observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                document.querySelectorAll('.toc a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
            });
        }, { rootMargin: '-90px 0px -70% 0px' });
        block.querySelectorAll('h3').forEach(h => observer.observe(h));
    }

    document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

    // Old links used #tr / #en anchors; honour them first.
    let initial = '';
    if (location.hash === '#en' || location.hash === '#tr') initial = location.hash.slice(1);
    if (!initial) { try { initial = localStorage.getItem('lang') || ''; } catch (e) {} }
    if (!initial) initial = (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en';
    setLang(initial);

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
