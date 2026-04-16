// Render Header
function renderHeader(data) {
    const header = document.getElementById('header');
    header.innerHTML = `
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
        const inner = `
            <div class="sidebar-item-icon">${iconContent}</div>
            ${span}
        `;
        return item.link
            ? `<a class="${classes}" href="${item.link}" style="text-decoration: none; color: inherit;">${inner}</a>`
            : `<div class="${classes}">${inner}</div>`;
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

        <div class="sidebar-label">
            Categories ${chevronSvg}
        </div>
        <div class="sidebar-section-expanded">
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
        <div style="margin-bottom: 32px; position: relative;">
            <img src="${section.image}" alt="Article featured image" class="article-featured-image">
            <div class="video-seeker">
                <div class="seeker-progress" style="width: ${progress}%;"></div>
            </div>
            ${adPill}
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
    return `<div style="width: 100%; aspect-ratio: ${section.aspectRatio}; border: 1px solid #d0d0d0; border-radius: 8px; margin-bottom: 32px;"></div>`;
}

function renderEmptySpacer(section) {
    return `<div style="width: 100%; height: ${section.height}px; border: 1px solid #d0d0d0; border-radius: 8px; margin-bottom: 32px;"></div>`;
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
    const heroIdx = data.sections.findIndex(s => s.type === 'featured-image');
    const preSections = heroIdx >= 0 ? data.sections.slice(0, heroIdx) : [];
    const mainSections = heroIdx >= 0 ? data.sections.slice(heroIdx) : data.sections;
    const preHtml = preSections.map(renderSection).join('');
    const mainHtml = mainSections.map(renderSection).join('');
    container.innerHTML = `
        ${breadcrumb}
        ${preHtml}
        <div class="article-layout">
            <div class="article-main">${mainHtml}</div>
            <aside class="article-side"></aside>
        </div>
    `;
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
        setupCollapsibleSections();
        setupMobileMenu();
        setupMobileSearch();
    } catch (err) {
        console.error('Error loading article data:', err);
    }
}

document.addEventListener('DOMContentLoaded', renderPage);
