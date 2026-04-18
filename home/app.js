// Helper function to check if a string is a URL
function isUrl(str) {
    return str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:'));
}

// Render overlay box for carousel images
function renderOverlay(overlay, compact = false) {
    if (!overlay) return '';
    const padding = compact ? '6px 10px' : '16px 20px';
    const authorMargin = compact ? '2px' : '8px';
    const titleFontSize = compact ? '10px' : '18px';
    const titleMargin = compact ? '2px' : '8px';
    const authorFontSize = compact ? '7px' : '10px';
    const readTimeFontSize = compact ? '7px' : '10px';
    const titleLineHeight = compact ? '1.2' : '1.3';

    return `
        <div class="carousel-overlay" style="position: absolute; bottom: 0; left: 0; width: 55%; background-color: #ffffff; padding: ${padding}; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transform: translateY(70%);">
            <div style="font-size: ${authorFontSize}; font-weight: 700; color: #1a1a1a; letter-spacing: 0.5px; margin-bottom: ${authorMargin};">${overlay.author}</div>
            <h3 style="font-size: ${titleFontSize}; font-weight: 700; color: #1a1a1a; line-height: ${titleLineHeight}; margin-bottom: ${titleMargin}; font-family: Georgia, 'Iowan Old Style', 'Charter', 'Times New Roman', serif;">${overlay.title}</h3>
            <p style="font-size: ${readTimeFontSize}; color: #999; letter-spacing: 0.5px;">${overlay.readTime}</p>
        </div>
    `;
}

// Render Header
function renderHeader(data) {
    const header = document.getElementById('header');
    const logoHtml = `
        <div class="header-left">
            <button class="hamburger-btn" id="hamburger-btn" aria-label="Open menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <div class="logo">
                <img class="logo-text" src="${data.logo.textImage}" alt="${data.logo.name}">
            </div>
        </div>

        <div class="header-center">
            <img class="header-title-image" src="${data.titleImage}" alt="Ideas Worth Spreading">
        </div>

        <div class="header-right">
            <div class="search-container">
                <div class="search-icon">
                    <img src="${data.search.icon}" alt="Search">
                </div>
                <input type="text" placeholder="${data.search.placeholder}">
            </div>
            ${data.buttons.map(btn => `<button class="btn btn-${btn.type}">${btn.text}</button>`).join('')}
        </div>
    `;
    header.innerHTML = logoHtml;
}

// Render Sidebar
function renderSidebar(data) {
    const sidebar = document.getElementById('sidebar');

    const renderNavItem = (item) => {
        const iconContent = item.type === 'svg'
            ? `<svg class="sidebar-item-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="12" cy="19" r="2"></circle>
                </svg>`
            : `<img src="${item.icon}" alt="${item.label}">`;
        const inner = `
            <div class="sidebar-item-icon">${iconContent}</div>
            <span>${item.label}</span>
        `;
        return item.link
            ? `<a class="sidebar-item" href="${item.link}" style="text-decoration: none; color: inherit;">${inner}</a>`
            : `<div class="sidebar-item">${inner}</div>`;
    };

    const chevronSvg = `<svg class="sidebar-label-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;
    const categoryChevronSvg = `<svg class="category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;

    const sidebarHtml = `
        <div class="sidebar-section">
            ${data.navigation.map(renderNavItem).join('')}
        </div>

        <div class="sidebar-section">
            ${data.user.map(item => `
                <div class="sidebar-item">
                    <div class="sidebar-item-icon">
                        <img src="${item.icon}" alt="${item.label}">
                    </div>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>

        <div class="sidebar-label">
            Categories ${chevronSvg}
        </div>
        <div class="sidebar-section">
            ${data.categories.map(cat => {
                const name = typeof cat === 'string' ? cat : cat.name;
                const icon = typeof cat === 'string' ? '' : (cat.icon || '');
                const items = typeof cat === 'string' ? [] : (cat.items || []);
                const iconHtml = icon
                    ? `<span class="category-item-icon"><img src="${icon}" alt="${name}"></span>`
                    : '';
                const subItems = items.length
                    ? `<div class="category-subitems" style="display: none;">
                        ${items.map(sub => {
                            const label = typeof sub === 'string' ? sub : sub.label;
                            const avatar = typeof sub === 'string' ? '' : (sub.avatar || '');
                            const link = typeof sub === 'string' ? '' : (sub.link || '');
                            const placeholderIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 60%; height: 60%; color: #fff;"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11h-2z"/></svg>`;
                            const avatarHtml = avatar
                                ? `<div class="category-subitem-avatar"><img src="${avatar}" alt="${label}"></div>`
                                : `<div class="category-subitem-avatar category-subitem-avatar--placeholder">${placeholderIcon}</div>`;
                            const inner = `${avatarHtml}<span>${label}</span>`;
                            return link
                                ? `<a class="category-subitem" href="${link}" style="text-decoration: none;">${inner}</a>`
                                : `<div class="category-subitem">${inner}</div>`;
                        }).join('')}
                    </div>`
                    : '';
                return `
                    <div class="category-group">
                        <div class="category-item">
                            <span class="category-item-label">${iconHtml}<span>${name}</span></span>
                            ${categoryChevronSvg}
                        </div>
                        ${subItems}
                    </div>
                `;
            }).join('')}
        </div>

    `;
    sidebar.innerHTML = sidebarHtml;
}

// Render Featured Container (Greeting + Exclusive)
function renderFeaturedContainer(greeting, exclusive, genuin) {
    const articlesPerPage = 2;
    const totalPages = Math.ceil(exclusive.articles.length / articlesPerPage);

    const dotsHtml = Array.from({ length: totalPages }, (_, idx) => `
        <div class="exclusive-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%; cursor: pointer;"></div>
    `).join('');

    const firstPageArticles = exclusive.articles.slice(0, articlesPerPage);

    const featuredPlacement = genuin && genuin.placements && genuin.placements.featured;
    const featuredLeft = featuredPlacement
        ? `<div class="featured-left">
                <div id="gen-sdk" class="gen-sdk-class" data-theme="${featuredPlacement.theme || 'light'}"></div>
            </div>`
        : '';

    return `
        <div class="featured-container">
            ${featuredLeft}

            <div class="featured-right">
                <section class="exclusive-section">
                    <div class="exclusive-header">
                        <span class="exclusive-badge">${exclusive.badge}</span>
                    </div>
                    <div class="article-grid" id="exclusive-articles">
                        ${firstPageArticles.map(article => renderArticleCard(article)).join('')}
                    </div>
                    <div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px; align-items: center;">
                        <button type="button" id="exclusive-prev" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button type="button" id="exclusive-next" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    `;
}

// Render a single article card
function renderArticleCard(article) {
    const imageStyle = article.image ? `style="background-image: url('${article.image}'); background-size: cover; background-position: center;"` : '';
    const cardContent = `
        <div class="article-image" ${imageStyle}></div>
        <div class="article-content">
            <h3 class="article-title">${article.title}</h3>
            <p class="article-meta">${article.meta}</p>
        </div>
    `;

    if (article.link) {
        return `<a href="${article.link}" target="_blank" rel="noopener noreferrer" class="article-card" style="text-decoration: none; color: inherit; cursor: pointer;">${cardContent}</a>`;
    }
    return `<article class="article-card">${cardContent}</article>`;
}

// Set up paginated carousel for exclusive section
function setupExclusiveCarousel(articles) {
    const articlesPerPage = 2;
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    let currentPage = 0;

    const container = document.getElementById('exclusive-articles');
    const prevBtn = document.getElementById('exclusive-prev');
    const nextBtn = document.getElementById('exclusive-next');
    const dots = document.querySelectorAll('.exclusive-dot');

    function updatePage(pageIdx) {
        currentPage = ((pageIdx % totalPages) + totalPages) % totalPages;
        const start = currentPage * articlesPerPage;
        const pageArticles = articles.slice(start, start + articlesPerPage);
        container.innerHTML = pageArticles.map(article => renderArticleCard(article)).join('');
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentPage ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); updatePage(currentPage - 1); prevBtn.blur(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); updatePage(currentPage + 1); nextBtn.blur(); });
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updatePage(idx));
    });
}

// Render Prompt Section with Video
function renderPromptVideo(data, genuin) {
    const dotsHtml = data.items.map((_, idx) => `
        <div class="promptvideo-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%;"></div>
    `).join('');

    const promptPlacement = genuin && genuin.placements && genuin.placements.promptVideo;
    const rightColInner = promptPlacement
        ? `<div style="flex: 1; position: relative; overflow: hidden; border-radius: 8px; border: 1px solid #e5e5e5;">
                <div id="gen-sdk-promptvideo" class="gen-sdk-class" data-theme="${promptPlacement.theme || 'light'}" style="position: absolute; inset: 0; overflow: hidden;"></div>
            </div>`
        : `<div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; flex: 1; display: flex; align-items: center; justify-content: center; position: relative;"></div>`;

    return `
        <section class="content-section promptvideo-section" style="height: 733.11px;">
            <div class="promptvideo-grid" style="display: flex; gap: 20px; padding: 24px; height: 100%;">
                <div class="promptvideo-col" style="flex: 73; min-width: 0; display: flex; flex-direction: column;">
                    <div style="position: relative; flex: 1; margin-bottom: 140px; min-height: 320px;">
                        <div style="width: 100%; height: 100%; background-color: #e5e5e5; border: 2px solid #d0d0d0; border-radius: 8px; overflow: hidden;">
                            <a id="promptvideo-link" href="${data.items[0].link}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;">
                                <img id="promptvideo-image" src="${data.items[0].image}" alt="Article" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;">
                            </a>
                        </div>
                        <div id="promptvideo-overlay">${renderOverlay(data.items[0].overlay)}</div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 8px; align-items: center;">
                        <button type="button" id="promptvideo-prev" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button type="button" id="promptvideo-next" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="promptvideo-col" style="flex: 39; min-width: 0; display: flex; flex-direction: column; height: 100%;">
                    ${rightColInner}
                </div>
            </div>
        </section>
    `;
}

// Set up carousel for prompt video section
function setupPromptVideoCarousel(items) {
    let currentIndex = 0;
    const imgEl = document.getElementById('promptvideo-image');
    const linkEl = document.getElementById('promptvideo-link');
    const overlayEl = document.getElementById('promptvideo-overlay');
    const prevBtn = document.getElementById('promptvideo-prev');
    const nextBtn = document.getElementById('promptvideo-next');
    const dots = document.querySelectorAll('.promptvideo-dot');

    function updateItem(idx) {
        currentIndex = ((idx % items.length) + items.length) % items.length;
        imgEl.src = items[currentIndex].image;
        if (linkEl) linkEl.href = items[currentIndex].link;
        if (overlayEl) overlayEl.innerHTML = renderOverlay(items[currentIndex].overlay, false);
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentIndex ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); updateItem(currentIndex - 1); prevBtn.blur(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); updateItem(currentIndex + 1); nextBtn.blur(); });
    dots.forEach((dot, idx) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => updateItem(idx));
    });
}

// Render Brand Section
function renderBrands(brands) {
    const brandsPerPage = 4;
    const totalPages = Math.max(1, Math.ceil(brands.length / brandsPerPage));
    const firstPageBrands = brands.slice(0, brandsPerPage);

    const dotsHtml = Array.from({ length: totalPages }, (_, idx) => `
        <div class="brands-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%; cursor: pointer;"></div>
    `).join('');

    return `
        <section class="content-section">
            <div class="brands-container">
                <div class="brands-grid" id="brands-grid">
                    ${firstPageBrands.map(renderBrandCard).join('')}
                </div>
                <div style="display: flex; justify-content: center; gap: 8px; align-items: center; margin-top: 16px;">
                    <button type="button" id="brands-prev" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    ${dotsHtml}
                    <button type="button" id="brands-next" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    `;
}

// Render a single brand card
function renderBrandCard(brand) {
    return `
        <div class="brand-card">
            <div class="brand-header">
                <div class="brand-icon">
                    <img src="${brand.icon}" alt="${brand.name}">
                </div>
                <div class="brand-info">
                    <div class="brand-name">${brand.name}</div>
                    <div class="brand-sponsored">${brand.sponsored}</div>
                </div>
            </div>
            <p class="brand-question">${brand.question}</p>
            <div class="brand-options">
                ${brand.options.map(option => `<div class="brand-option">${option}</div>`).join('')}
            </div>
        </div>
    `;
}

// Set up carousel for brands section
function setupBrandsCarousel(brands) {
    const brandsPerPage = 4;
    const totalPages = Math.max(1, Math.ceil(brands.length / brandsPerPage));
    let currentPage = 0;

    const container = document.getElementById('brands-grid');
    const prevBtn = document.getElementById('brands-prev');
    const nextBtn = document.getElementById('brands-next');
    const dots = document.querySelectorAll('.brands-dot');

    function updatePage(pageIdx) {
        currentPage = ((pageIdx % totalPages) + totalPages) % totalPages;
        const start = currentPage * brandsPerPage;
        const pageBrands = brands.slice(start, start + brandsPerPage);
        container.innerHTML = pageBrands.map(renderBrandCard).join('');
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentPage ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); updatePage(currentPage - 1); prevBtn.blur(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); updatePage(currentPage + 1); nextBtn.blur(); });
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updatePage(idx));
    });
}

// Render Last Section (3-Column Layout)
function renderLastSection(data) {
    const dotsHtml = data.items.map((_, idx) => `
        <div class="lastsection-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%; cursor: pointer;"></div>
    `).join('');

    return `
        <section class="content-section">
            <div class="lastsection-grid" style="display: flex; gap: 24px; padding: 24px;">
                <!-- Left Column: Large Article -->
                <div class="lastsection-col" style="flex: 1; display: flex; flex-direction: column;">
                    <div style="position: relative; flex: 1; margin-bottom: 60px; min-height: 240px;">
                        <div style="width: 100%; height: 100%; background-color: #2c2c2c; border-radius: 8px; overflow: hidden;">
                            <a id="lastsection-link" href="${data.items[0].link}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;">
                                <img id="lastsection-image" src="${data.items[0].image}" alt="Article" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;">
                            </a>
                        </div>
                        <div id="lastsection-overlay">${renderOverlay(data.items[0].overlay, true)}</div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 8px; align-items: center;">
                        <button type="button" id="lastsection-prev" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button type="button" id="lastsection-next" style="width: 24px; height: 24px; background-color: #666; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Middle Column: Article Cards -->
                <div class="lastsection-col" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 10px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px;">${data.middleColumn.header}</div>
                        ${data.middleColumn.articles.length > 3 ? `<a href="${data.featured.seeAllLink || '#'}" target="_blank" rel="noopener noreferrer" style="color: #0645ff; font-size: 12px; text-decoration: none;">See all</a>` : ''}
                    </div>
                    ${data.middleColumn.articles.slice(0, 3).map((article, idx, arr) => {
                        const isLast = idx === arr.length - 1;
                        const thumb = article.image
                            ? `<div style="width: 80px; height: 80px; border-radius: 4px; flex-shrink: 0; background-image: url('${article.image}'); background-size: cover; background-position: center;"></div>`
                            : `<div style="width: 80px; height: 80px; background-color: ${article.color}; border-radius: 4px; flex-shrink: 0;"></div>`;
                        const inner = `
                            <div style="display: flex; gap: 12px; align-items: flex-start; padding: ${idx === 0 ? '0' : '16px'} 0 ${isLast ? '0' : '16px'}; ${!isLast ? 'border-bottom: 1px solid #e5e5e5;' : ''}">
                                <div style="flex: 1;">
                                    <h4 style="font-size: 16px; font-weight: 700; color: #1a1a1a; line-height: 1.3; margin-bottom: 8px; font-family: Georgia, 'Iowan Old Style', 'Charter', 'Times New Roman', serif;">${article.title}</h4>
                                    <p style="font-size: 10px; color: #999; letter-spacing: 0.5px; font-weight: 600;">${article.meta}</p>
                                </div>
                                ${thumb}
                            </div>
                        `;
                        return article.link
                            ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">${inner}</a>`
                            : inner;
                    }).join('')}
                </div>

                <!-- Right Column: Featured -->
                <div class="lastsection-col" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${data.featured.title}</h3>
                        ${data.featured.cards.length > 3 ? `<a href="${data.featured.seeAllLink || '#'}" target="_blank" rel="noopener noreferrer" style="color: #0645ff; font-size: 12px; text-decoration: none;">${data.featured.seeAll}</a>` : ''}
                    </div>
                    ${data.featured.cards.slice(0, 3).map((card, idx, arr) => {
                        const avatar = card.image
                            ? `<div style="width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; background-image: url('${card.image}'); background-size: cover; background-position: center;"></div>`
                            : `<div style="width: 40px; height: 40px; background-color: ${card.color}; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px;">${card.initial}</div>`;
                        const inner = `
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 12px; ${idx < arr.length - 1 ? 'margin-bottom: 12px;' : ''}">
                                <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                                    ${avatar}
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; font-size: 12px; color: #1a1a1a;">${card.name}</div>
                                        <div style="font-size: 10px; color: #999;">${card.stats}</div>
                                    </div>
                                    <button style="background-color: ${card.color}; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: pointer;">${card.buttonText}</button>
                                </div>
                                <p style="font-size: 11px; color: #666; line-height: 1.4;">${card.description}</p>
                            </div>
                        `;
                        return card.link
                            ? `<a href="${card.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">${inner}</a>`
                            : inner;
                    }).join('')}
                </div>
            </div>
        </section>
    `;
}

function computeReadTime(body) {
    if (!body) return '3 MIN READ';
    const words = body.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} MIN READ`;
}

function firstSentence(text) {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    const m = clean.match(/^[^.!?]+[.!?]/);
    return (m ? m[0] : clean).trim();
}

function articleLink(data, scraped) {
    const base = data.articlePagePath || '../article/article.html';
    return `${base}?slug=${encodeURIComponent(scraped.slug)}`;
}

function pickImage(scraped, pool, idx) {
    if (scraped && scraped.image) return scraped.image;
    if (pool && pool.length) return pool[idx % pool.length];
    return `https://picsum.photos/seed/${encodeURIComponent(scraped?.slug || String(idx))}/400/300`;
}

function populateFromScraped(data, scraped) {
    const articles = (scraped && Array.isArray(scraped.articles) ? scraped.articles : [])
        .filter(a => a && a.slug && !a.error);
    if (!articles.length) return;

    const placeholders = data.placeholders || {};
    let cursor = 0;
    const take = n => {
        const slice = articles.slice(cursor, cursor + n);
        cursor += n;
        return slice;
    };

    data.exclusive = data.exclusive || { badge: 'EXCLUSIVE' };
    data.exclusive.articles = take(6).map((a, i) => ({
        title: a.title,
        meta: 'DAILY READ',
        image: pickImage(a, placeholders.exclusiveImages, i),
        link: articleLink(data, a),
    }));

    data.promptVideo = data.promptVideo || {};
    data.promptVideo.items = take(3).map((a, i) => ({
        image: pickImage(a, placeholders.heroImages, i),
        link: articleLink(data, a),
        overlay: {
            author: (a.author || 'IHEART').toUpperCase(),
            title: firstSentence(a.description || a.body || a.title) || a.title,
            readTime: computeReadTime(a.body),
        },
    }));

    data.lastSection = data.lastSection || {};
    data.lastSection.items = take(3).map((a, i) => ({
        image: pickImage(a, placeholders.heroImages, i),
        link: articleLink(data, a),
        overlay: {
            author: (a.author || 'IHEART').toUpperCase(),
            title: firstSentence(a.description || a.body || a.title) || a.title,
            readTime: computeReadTime(a.body),
        },
    }));

    const colors = placeholders.middleColumnColors || ['#C6002B', '#0645ff', '#90EE90'];
    data.lastSection.middleColumn = data.lastSection.middleColumn || { header: 'LATEST' };
    data.lastSection.middleColumn.articles = take(3).map((a, i) => ({
        color: colors[i % colors.length],
        image: pickImage(a, placeholders.middleColumnImages, i),
        title: a.title,
        meta: computeReadTime(a.body),
        link: articleLink(data, a),
    }));
}

// Main Render Function
async function renderPage() {
    try {
        const [dataRes, scrapedRes] = await Promise.all([
            fetch('data.json'),
            fetch('../scraped/articles.json').catch(() => null),
        ]);
        const data = await dataRes.json();
        const scraped = scrapedRes && scrapedRes.ok ? await scrapedRes.json() : null;
        populateFromScraped(data, scraped);

        if (data.pageTitle) {
            document.title = data.pageTitle;
        }

        renderHeader(data.header);
        renderSidebar(data.sidebar);
        setupCollapsibleSections();
        setupMobileMenu();
        setupMobileSearch();

        const content = document.getElementById('content');
        content.innerHTML = `
            ${renderFeaturedContainer(data.greeting, data.exclusive, data.genuin)}
            ${renderPromptVideo(data.promptVideo, data.genuin)}
            ${renderBrands(data.brands)}
            ${renderLastSection(data.lastSection)}
        `;

        // Set up carousels after HTML is rendered
        setupPromptVideoCarousel(data.promptVideo.items);
        setupLastSectionCarousel(data.lastSection.items);
        setupExclusiveCarousel(data.exclusive.articles);
        setupBrandsCarousel(data.brands);

        if (data.genuin) {
            initGenuinSdk(data.genuin);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load Genuin SDK and initialize each configured placement
function initGenuinSdk(config) {
    const placementTargets = [
        { placement: config.placements && config.placements.featured, elementId: 'gen-sdk' },
        { placement: config.placements && config.placements.promptVideo, elementId: 'gen-sdk-promptvideo' },
    ].filter(entry => entry.placement && document.getElementById(entry.elementId));

    if (!placementTargets.length) return;

    const run = () => {
        if (typeof genuin === 'undefined' || !genuin.init) return;
        placementTargets.forEach(({ placement, elementId }) => {
            genuin.init({
                style_id: placement.style_id,
                placement_id: placement.placement_id,
                api_key: placement.api_key,
                container_id: elementId,
            });
        });
    };

    if (typeof genuin !== 'undefined' && genuin.init) {
        run();
        return;
    }

    const scriptEl = document.getElementById('genuin-sdk-script');
    if (!scriptEl) return;
    scriptEl.addEventListener('load', run, { once: true });
    if (!scriptEl.src) {
        scriptEl.src = config.sdkScript;
    }
}

// Set up carousel for last section
function setupLastSectionCarousel(items) {
    let currentIndex = 0;
    const imgEl = document.getElementById('lastsection-image');
    const linkEl = document.getElementById('lastsection-link');
    const overlayEl = document.getElementById('lastsection-overlay');
    const prevBtn = document.getElementById('lastsection-prev');
    const nextBtn = document.getElementById('lastsection-next');
    const dots = document.querySelectorAll('.lastsection-dot');

    function updateItem(idx) {
        currentIndex = ((idx % items.length) + items.length) % items.length;
        imgEl.src = items[currentIndex].image;
        if (linkEl) linkEl.href = items[currentIndex].link;
        if (overlayEl) overlayEl.innerHTML = renderOverlay(items[currentIndex].overlay, true);
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentIndex ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); updateItem(currentIndex - 1); prevBtn.blur(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); updateItem(currentIndex + 1); nextBtn.blur(); });
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updateItem(idx));
    });
}

function setupMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!btn || !sidebar) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('visible', isOpen);
    });

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('open');
            backdrop.classList.remove('visible');
        });
    }
}

function setupCollapsibleSections() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.querySelectorAll('.sidebar-label').forEach(label => {
        label.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCollapsed = label.classList.toggle('collapsed');
            const next = label.nextElementSibling;
            if (next) next.style.display = isCollapsed ? 'none' : '';
        });
    });
    sidebar.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = item.closest('.category-group');
            const sub = group ? group.querySelector('.category-subitems') : null;
            if (!sub) return;
            const isOpen = item.classList.toggle('open');
            sub.style.display = isOpen ? 'block' : 'none';
        });
    });
}

function setupMobileSearch() {
    const container = document.querySelector('.header-right .search-container');
    const headerRight = document.querySelector('.header-right');
    if (!container || !headerRight) return;

    container.addEventListener('click', (e) => {
        if (window.innerWidth > 640) return;
        e.stopPropagation();
        if (!headerRight.classList.contains('search-active')) {
            headerRight.classList.add('search-active');
            const input = container.querySelector('input');
            if (input) setTimeout(() => input.focus(), 50);
        }
    });

    document.addEventListener('click', (e) => {
        if (!headerRight.contains(e.target)) {
            headerRight.classList.remove('search-active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderPage);
