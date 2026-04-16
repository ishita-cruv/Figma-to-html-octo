// Helper function to check if a string is a URL
function isUrl(str) {
    return str && (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:'));
}

// Render Header
function renderHeader(data) {
    const header = document.getElementById('header');
    const logoHtml = `
        <div class="header-left">
            <div class="logo">
                <div class="logo-icon">
                    <img src="${data.logo.icon}" alt="${data.logo.name} logo">
                </div>
                <span>${data.logo.name}<span style="font-weight: 400; color: #999;">${data.logo.suffix}</span></span>
            </div>
        </div>

        <div class="header-center">
            <div class="header-title">
                <span style="font-weight: 700;">${data.title.bold1}</span><span class="subtle">${data.title.subtle}</span><span style="font-weight: 700;">${data.title.bold2}</span>
            </div>
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
        return `
            <div class="sidebar-item">
                <div class="sidebar-item-icon">${iconContent}</div>
                <span>${item.label}</span>
            </div>
        `;
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

        <div class="creator-banner">
            ${data.creatorBanner}
        </div>

        <div class="sidebar-label">
            Categories ${chevronSvg}
        </div>
        <div class="sidebar-section">
            ${data.categories.map(cat => `
                <div class="category-item">
                    <span>${cat}</span>
                    ${categoryChevronSvg}
                </div>
            `).join('')}
            <div style="padding: 12px 16px; color: #0645ff; font-size: 13px; cursor: pointer; font-weight: 500;">
                ${data.seeMore}
            </div>
        </div>

        <div class="sidebar-label">
            Recent ${chevronSvg}
        </div>
        <div class="sidebar-section">
            ${data.recent.map(item => `
                <div class="community-item">
                    <div class="community-avatar">
                        <img src="${item.avatar}" alt="${item.label}">
                    </div>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>
    `;
    sidebar.innerHTML = sidebarHtml;
}

// Render Featured Container (Greeting + Exclusive)
function renderFeaturedContainer(greeting, exclusive) {
    const articlesPerPage = 2;
    const totalPages = Math.ceil(exclusive.articles.length / articlesPerPage);

    const dotsHtml = Array.from({ length: totalPages }, (_, idx) => `
        <div class="exclusive-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%; cursor: pointer;"></div>
    `).join('');

    const firstPageArticles = exclusive.articles.slice(0, articlesPerPage);

    return `
        <div class="featured-container">
            <div class="featured-left">
                <section class="greeting">
                    <h1 class="greeting-text">${greeting.text}</h1>
                    <div class="briefing-badge">${greeting.badge}</div>
                </section>
                <div class="carousel"></div>
            </div>

            <div class="featured-right">
                <section class="exclusive-section">
                    <div class="exclusive-header">
                        <span class="exclusive-badge">${exclusive.badge}</span>
                    </div>
                    <div class="article-grid" id="exclusive-articles">
                        ${firstPageArticles.map(article => renderArticleCard(article)).join('')}
                    </div>
                    <div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px; align-items: center;">
                        <button id="exclusive-prev" style="width: 20px; height: 20px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button id="exclusive-next" style="width: 20px; height: 20px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

    if (prevBtn) prevBtn.addEventListener('click', () => updatePage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => updatePage(currentPage + 1));
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updatePage(idx));
    });
}

// Render Prompt Section with Video
function renderPromptVideo(data) {
    const dotsHtml = data.items.map((_, idx) => `
        <div class="promptvideo-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%;"></div>
    `).join('');

    return `
        <section class="content-section" style="height: 733.11px;">
            <div style="display: flex; gap: 20px; padding: 24px; height: 100%;">
                <div style="flex: 73; min-width: 0; display: flex; flex-direction: column; overflow: hidden;">
                    <div style="background-color: #e5e5e5; border: 2px solid #d0d0d0; border-radius: 8px; overflow: hidden; margin-bottom: 16px; flex: 1;">
                        <a id="promptvideo-link" href="${data.items[0].link}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;">
                            <img id="promptvideo-image" src="${data.items[0].image}" alt="Article" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;">
                        </a>
                    </div>
                    <div style="display: flex; justify-content: flex-start; gap: 8px; align-items: center;">
                        <button id="promptvideo-prev" style="width: 18px; height: 18px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px;">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button id="promptvideo-next" style="width: 18px; height: 18px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px;">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                <div style="flex: 39; min-width: 0; display: flex; flex-direction: column; height: 100%;">
                    <div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; flex: 1; display: flex; align-items: center; justify-content: center; position: relative;">
                    </div>
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
    const prevBtn = document.getElementById('promptvideo-prev');
    const nextBtn = document.getElementById('promptvideo-next');
    const dots = document.querySelectorAll('.promptvideo-dot');

    function updateItem(idx) {
        currentIndex = ((idx % items.length) + items.length) % items.length;
        imgEl.src = items[currentIndex].image;
        if (linkEl) linkEl.href = items[currentIndex].link;
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentIndex ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => updateItem(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateItem(currentIndex + 1));
    dots.forEach((dot, idx) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => updateItem(idx));
    });
}

// Render Brand Section
function renderBrands(brands) {
    return `
        <section class="content-section">
            <div class="brands-container">
                <div class="brands-grid">
                    ${brands.map(brand => `
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
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// Render Last Section (3-Column Layout)
function renderLastSection(data) {
    const dotsHtml = data.items.map((_, idx) => `
        <div class="lastsection-dot" data-index="${idx}" style="width: 3px; height: 3px; background-color: ${idx === 0 ? '#999' : '#ddd'}; border-radius: 50%; cursor: pointer;"></div>
    `).join('');

    return `
        <section class="content-section">
            <div style="display: flex; gap: 24px; padding: 24px;">
                <!-- Left Column: Large Article -->
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <div style="background-color: #2c2c2c; border-radius: 8px; overflow: hidden; margin-bottom: 16px; flex: 1;">
                        <a id="lastsection-link" href="${data.items[0].link}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;">
                            <img id="lastsection-image" src="${data.items[0].image}" alt="Article" style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer;">
                        </a>
                    </div>
                    <div style="display: flex; justify-content: flex-start; gap: 8px; align-items: center;">
                        <button id="lastsection-prev" style="width: 18px; height: 18px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px;">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        ${dotsHtml}
                        <button id="lastsection-next" style="width: 18px; height: 18px; background-color: #999; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px;">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Middle Column: Article Cards -->
                <div style="flex: 1;">
                    <div style="font-size: 10px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">${data.middleColumn.header}</div>
                    ${data.middleColumn.articles.map((article, idx) => {
                        const thumb = article.image
                            ? `<div style="width: 80px; height: 60px; border-radius: 4px; flex-shrink: 0; background-image: url('${article.image}'); background-size: cover; background-position: center;"></div>`
                            : `<div style="width: 80px; height: 60px; background-color: ${article.color}; border-radius: 4px; flex-shrink: 0;"></div>`;
                        const inner = `
                            <div style="display: flex; gap: 12px; ${idx < data.middleColumn.articles.length - 1 ? 'margin-bottom: 16px;' : ''}">
                                ${thumb}
                                <div style="flex: 1;">
                                    <h4 style="font-size: 12px; font-weight: 600; color: #1a1a1a; line-height: 1.3; margin-bottom: 4px;">${article.title}</h4>
                                    <p style="font-size: 10px; color: #999;">${article.meta}</p>
                                </div>
                            </div>
                        `;
                        return article.link
                            ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">${inner}</a>`
                            : inner;
                    }).join('')}
                </div>

                <!-- Right Column: Featured -->
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${data.featured.title}</h3>
                        <a href="${data.featured.seeAllLink || '#'}" target="_blank" rel="noopener noreferrer" style="color: #0645ff; font-size: 12px; text-decoration: none;">${data.featured.seeAll}</a>
                    </div>
                    ${data.featured.cards.map((card, idx) => {
                        const avatar = card.image
                            ? `<div style="width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; background-image: url('${card.image}'); background-size: cover; background-position: center;"></div>`
                            : `<div style="width: 40px; height: 40px; background-color: ${card.color}; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px;">${card.initial}</div>`;
                        const inner = `
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 12px; ${idx < data.featured.cards.length - 1 ? 'margin-bottom: 12px;' : ''}">
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

// Main Render Function
async function renderPage() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        if (data.pageTitle) {
            document.title = data.pageTitle;
        }

        renderHeader(data.header);
        renderSidebar(data.sidebar);

        const content = document.getElementById('content');
        content.innerHTML = `
            ${renderFeaturedContainer(data.greeting, data.exclusive)}
            ${renderPromptVideo(data.promptVideo)}
            ${renderBrands(data.brands)}
            ${renderLastSection(data.lastSection)}
        `;

        // Set up carousels after HTML is rendered
        setupPromptVideoCarousel(data.promptVideo.items);
        setupLastSectionCarousel(data.lastSection.items);
        setupExclusiveCarousel(data.exclusive.articles);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Set up carousel for last section
function setupLastSectionCarousel(items) {
    let currentIndex = 0;
    const imgEl = document.getElementById('lastsection-image');
    const linkEl = document.getElementById('lastsection-link');
    const prevBtn = document.getElementById('lastsection-prev');
    const nextBtn = document.getElementById('lastsection-next');
    const dots = document.querySelectorAll('.lastsection-dot');

    function updateItem(idx) {
        currentIndex = ((idx % items.length) + items.length) % items.length;
        imgEl.src = items[currentIndex].image;
        if (linkEl) linkEl.href = items[currentIndex].link;
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentIndex ? '#999' : '#ddd';
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => updateItem(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => updateItem(currentIndex + 1));
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => updateItem(idx));
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderPage);
