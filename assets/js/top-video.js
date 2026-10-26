(() => {
    const video = document.getElementById('top-video');
    if (!video) return;

    const playButton = document.getElementById('video-play');
    const soundButton = document.getElementById('video-sound');
    const status = document.getElementById('video-status');
    let withSound = false;
    let request = 0;

    const message = (text = '') => {
        status.textContent = text;
        status.hidden = !text;
    };
    const render = () => {
        playButton.hidden = !video.paused && !video.ended && !video.error && video.networkState !== HTMLMediaElement.NETWORK_NO_SOURCE;
        soundButton.textContent = withSound ? '鳴き声を止める' : '鳴き声を聞く';
        soundButton.setAttribute('aria-pressed', String(withSound));
    };
    const mute = () => {
        withSound = false;
        video.muted = true;
        video.loop = true;
    };
    const play = () => {
        const currentRequest = ++request;
        message();
        const result = video.play();
        if (result) result.catch((error) => {
            if (currentRequest !== request) return;
            mute();
            render();
            message(video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
                ? '動画を読み込めませんでした。「動画を再生」で再試行できます。'
                : '再生を開始できませんでした。ボタンを押して再生してください。');
            console.warn('トップ動画の再生を開始できませんでした:', error.name);
        });
    };

    // HTMLのmuted属性に加えてプロパティも、最初のplay()より前に設定する。
    video.defaultMuted = true;
    video.playsInline = true;
    mute();
    video.controls = false;
    document.querySelector('.hero-video-controls').hidden = false;

    playButton.addEventListener('click', () => {
        mute();
        if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
        play();
        render();
    });
    soundButton.addEventListener('click', () => {
        if (withSound) {
            // 停止するのは音声のみ。映像は同じ位置から無音で続ける。
            mute();
        } else {
            if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
            withSound = true;
            video.loop = false;
            video.currentTime = 0;
            video.muted = false;
        }
        // ユーザー操作の中で、映像と音声を持つ同じvideoを再生する。
        play();
        render();
    });
    video.addEventListener('playing', () => {
        message();
        render();
    });
    video.addEventListener('pause', () => {
        if (!video.ended) {
            ++request;
            mute();
            render();
        }
    });
    video.addEventListener('ended', () => {
        mute();
        video.currentTime = 0;
        play();
        render();
    });
    const loadError = () => {
        ++request;
        mute();
        video.pause();
        render();
        message('動画を読み込めませんでした。「動画を再生」で再試行できます。');
    };
    video.addEventListener('error', loadError);
    // sourceの読み込み失敗はvideoへバブルせず、play()が保留のままになる場合もある。
    video.querySelector('source').addEventListener('error', loadError);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ++request;
            mute();
            render();
        }
    });
    // 戻る操作で復元された場合も、音声付き再生は引き継がない。
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            mute();
            play();
            render();
        }
    });
    render();
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        loadError();
    } else {
        play();
    }
})();
