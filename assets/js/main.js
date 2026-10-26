document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Hamburger Menu & Mobile Navigation
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const headerNav = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && headerNav) {
        const setMenuState = (isOpen) => {
            hamburger.classList.toggle('is-active', isOpen);
            headerNav.classList.toggle('is-open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        };

        hamburger.addEventListener('click', () => {
            setMenuState(!headerNav.classList.contains('is-open'));
        });

        // スマホ時にリンクをクリックしたらメニューを閉じる
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    setMenuState(false);
                }
            });
        });
    }

    // ==========================================
    // 2. Smooth Scroll
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const headerEl = document.querySelector('.header');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return; // ダミーリンクは無視

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // クリック時にヘッダー高さを再取得（レスポンシブ対応）
                const headerHeight = headerEl ? headerEl.offsetHeight : 56;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. Overlay Close (Writer Details)
    // ==========================================
    const infoContents = document.querySelectorAll('.writer-info-content');
    infoContents.forEach(content => {
        content.addEventListener('click', (e) => {
            const details = e.target.closest('details');
            if (details) {
                details.removeAttribute('open');
            }
        });
    });
    // ==========================================
    // 4. Gallery Modal
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const closeModalBtn = document.querySelector('.gallery-modal-close');

    if (galleryItems.length > 0 && galleryModal && modalImg && closeModalBtn) {
        // 画像クリックでモーダルを開く
        galleryItems.forEach(img => {
            img.style.cursor = 'pointer'; // クリック可能であることを明示
            img.addEventListener('click', function() {
                galleryModal.classList.add('is-open');
                modalImg.src = this.src;
                document.body.style.overflow = 'hidden'; // 背面のスクロールを禁止
            });
        });

        // モーダルを閉じる関数
        const closeGalleryModal = () => {
            galleryModal.classList.remove('is-open');
            modalImg.src = '';
            document.body.style.overflow = ''; // 背面のスクロールを再開
        };

        // 背景または×ボタンクリックで閉じる
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal || e.target === closeModalBtn) {
                closeGalleryModal();
            }
        });

        // Escキーで閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && galleryModal.classList.contains('is-open')) {
                closeGalleryModal();
            }
        });
    }
});
