// Render Header
function renderHeader(data) {
    const header = document.getElementById('header');
    header.innerHTML = `
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
}

// Render Sidebar
function renderSidebar(data) {
    const sidebar = document.getElementById('sidebar');

    const renderNavItem = (item, collapsed) => {
        const iconContent = item.type === 'svg'
            ? `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%;">
                    <circle cx="12" cy="5" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="12" cy="19" r="2"></circle>
                </svg>`
            : `<img src="${item.icon}" alt="${item.label}">`;
        const classes = collapsed ? 'sidebar-item collapsed-only' : 'sidebar-item';
        const span = collapsed ? '' : `<span>${item.label}</span>`;
        return `
            <div class="${classes}">
                <div class="sidebar-item-icon">${iconContent}</div>
                ${span}
            </div>
        `;
    };

    const chevronSvg = `<svg class="sidebar-label-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;
    const categoryChevronSvg = `<svg class="category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;

    sidebar.innerHTML = `
        <div class="sidebar-section-expanded">
            ${data.navigation.map(item => renderNavItem(item, false)).join('')}
        </div>

        ${data.navigation.map(item => renderNavItem(item, true)).join('')}

        <div class="sidebar-divider collapsed-only"></div>

        <div class="sidebar-section-expanded">
            ${data.user.map(item => `
                <div class="sidebar-item">
                    <div class="sidebar-item-icon">
                        <img src="${item.icon}" alt="${item.label}">
                    </div>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>

        ${data.user.map(item => `
            <div class="sidebar-item collapsed-only">
                <div class="sidebar-item-icon">
                    <img src="${item.icon}" alt="${item.label}">
                </div>
            </div>
        `).join('')}

        <div class="creator-banner">${data.creatorBanner}</div>

        <div class="sidebar-label">
            Categories ${chevronSvg}
        </div>
        <div class="sidebar-section-expanded">
            ${data.categories.map(cat => `
                <div class="category-item">
                    <span>${cat}</span>
                    ${categoryChevronSvg}
                </div>
            `).join('')}
        </div>

        <div class="sidebar-label">
            Recent ${chevronSvg}
        </div>
        <div class="sidebar-section-expanded">
            ${data.recent.map(item => `
                <div class="community-item">
                    <div class="community-avatar">
                        <img src="${item.avatar}" alt="${item.label}">
                    </div>
                    <span>${item.label}</span>
                </div>
            `).join('')}
        </div>

        ${data.recent.map(item => `
            <div class="community-avatar collapsed-only">
                <img src="${item.avatar}" alt="${item.label}">
            </div>
        `).join('')}
    `;
}

// --- Section renderers ---
function renderTitleSection(section) {
    return `
        <header class="article-header">
            <h1 class="article-title">${section.text}</h1>
        </header>
    `;
}

function renderFeaturedImage(section) {
    const adPill = section.adPill ? renderAdPill(section.adPill) : '';
    const progress = section.videoSeekerProgress || 0;
    return `
        <div style="display: flex; gap: 16px; margin-bottom: 32px;">
            <div style="flex: 900; min-width: 0; position: relative;">
                <img src="${section.image}" alt="Article featured image" class="article-featured-image">
                <div class="video-seeker">
                    <div class="seeker-progress" style="width: ${progress}%;"></div>
                </div>
                ${adPill}
            </div>
            <div style="flex: 392; min-width: 0; aspect-ratio: 392 / 640; border: 1px solid #d0d0d0; border-radius: 8px; position: relative;"></div>
        </div>
    `;
}

function renderAdPill(pill) {
    const circumference = 2 * Math.PI * 10;
    const offset = circumference * (1 - (pill.progressPercent || 0) / 100);
    return `
        <div class="ad-starting-pill">
            <span class="ad-starting-text">${pill.text}</span>
            <div class="ad-starting-counter">
                <svg viewBox="0 0 22 22">
                    <circle class="counter-track" cx="11" cy="11" r="10"></circle>
                    <circle class="counter-progress" cx="11" cy="11" r="10" style="stroke-dashoffset: ${offset.toFixed(2)};"></circle>
                </svg>
                <span>${pill.counter}</span>
            </div>
        </div>
    `;
}

function renderShareSaveActions() {
    return `
        <div class="section-actions">
            <a class="section-action">
                <span class="section-action-icon" style="width: 14px; height: 14px;">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path fill-rule="evenodd" d="M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4z"/>
                    </svg>
                </span>
                <span style="font-weight: 700; font-size: 14px;">Share</span>
            </a>
            <a class="section-action">
                <span class="section-action-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15.75 5H8.25C7.55964 5 7 5.58763 7 6.3125V19L12 15.5L17 19V6.3125C17 5.58763 16.4404 5 15.75 5Z"></path>
                    </svg>
                </span>
                <span style="font-weight: 700; font-size: 14px;">Save</span>
            </a>
        </div>
    `;
}

function renderBrandCard(brandCard, navigation) {
    const nav = navigation ? renderNavigation(navigation) : '';
    return `
        <div class="section-sidebar">
            <div class="brand-card">
                <div class="brand-header">
                    <div class="brand-icon">
                        <img src="${brandCard.icon}" alt="${brandCard.name}">
                    </div>
                    <div class="brand-info">
                        <div class="brand-name">${brandCard.name}</div>
                        <div class="brand-sponsored">${brandCard.sponsored}</div>
                    </div>
                </div>
                <p class="brand-question">${brandCard.question}</p>
                <div class="brand-options">
                    ${brandCard.options.map(option => `<div class="brand-option">${option}</div>`).join('')}
                </div>
            </div>
            ${nav}
        </div>
    `;
}

function renderNavigation(navigation) {
    const dots = Array.from({ length: navigation.dots }, (_, idx) => `
        <div class="nav-dot${idx === navigation.active ? ' active' : ''}"></div>
    `).join('');
    return `
        <div class="section-footer">
            <button class="nav-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            ${dots}
            <button class="nav-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    `;
}

function renderArticleSection(section) {
    const dateEl = section.date ? `<div class="section-date">${section.date}</div>` : '';
    const actions = section.showActions ? renderShareSaveActions() : '';
    const headerEl = (section.date || section.showActions)
        ? `<div class="section-header">${dateEl}${actions}</div>`
        : '';
    const paragraphs = section.paragraphs.map((p, idx) => {
        const isLast = idx === section.paragraphs.length - 1;
        const marginBottom = isLast ? '' : 'style="margin-bottom: 16px;"';
        const cls = p.faded ? 'faded-text' : '';
        return `<p class="${cls}" ${marginBottom}>${p.text}</p>`;
    }).join('');
    const brand = section.brandCard ? renderBrandCard(section.brandCard, section.navigation) : '';

    return `
        <div class="article-section">
            <div class="section-content">
                <div style="flex: 1;">
                    ${headerEl}
                    <div class="section-text">
                        ${paragraphs}
                    </div>
                </div>
                ${brand}
            </div>
        </div>
    `;
}

function renderEmptyWrapper(section) {
    return `<div style="width: calc((100% - 16px) * 900 / 1292); aspect-ratio: ${section.aspectRatio}; border: 1px solid #d0d0d0; border-radius: 8px; margin-bottom: 32px;"></div>`;
}

function renderEmptySpacer(section) {
    const width = section.fullWidth ? '100%' : 'calc((100% - 16px) * 900 / 1292)';
    return `<div style="width: ${width}; height: ${section.height}px; border: 1px solid #d0d0d0; border-radius: 8px; margin-bottom: 32px;"></div>`;
}

// Render Breadcrumb
function renderBreadcrumb(text) {
    return `<nav class="breadcrumb">${text}</nav>`;
}

// Dispatch section renderer by type
function renderSection(section) {
    switch (section.type) {
        case 'title': return renderTitleSection(section);
        case 'featured-image': return renderFeaturedImage(section);
        case 'article-section': return renderArticleSection(section);
        case 'empty-wrapper': return renderEmptyWrapper(section);
        case 'empty-spacer': return renderEmptySpacer(section);
        default: return '';
    }
}

// Render Article Content
function renderArticleContent(data) {
    const container = document.getElementById('article-content');
    const breadcrumb = data.breadcrumb ? renderBreadcrumb(data.breadcrumb) : '';
    const sectionsHtml = data.sections.map(renderSection).join('');
    container.innerHTML = breadcrumb + sectionsHtml;
}

// Sidebar toggle handling (kept dynamic)
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');

    function expand() {
        sidebar.classList.add('expanded');
    }

    sidebar.addEventListener('click', expand);

    document.addEventListener('click', function (event) {
        if (sidebar && !sidebar.contains(event.target) && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
        }
    });
}

// Main Render Function
async function renderPage() {
    try {
        const response = await fetch('article-data.json');
        const data = await response.json();

        if (data.pageTitle) document.title = data.pageTitle;
        renderHeader(data.header);
        renderSidebar(data.sidebar);
        renderArticleContent(data);
        setupSidebarToggle();
    } catch (err) {
        console.error('Error loading article data:', err);
    }
}

document.addEventListener('DOMContentLoaded', renderPage);
