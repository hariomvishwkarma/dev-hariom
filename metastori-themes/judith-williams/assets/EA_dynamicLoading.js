/* eslint-disable */
let eA_domain = 'www.judithwilliams.com';
let eA_top = '80%'; // top position of the icon e.g. "200px" or "calc(50% -44px)"
let eA_side = 'left'; // side position icon e.g. "left", only works on desktop
let eA_sideMobile = 'left'; // side position icon mobile e.g. "right"
let eA_sideDistance = '16px'; // side distance of the icon e.g. "200px" or "calc(50% -44px)"
let eA_sideDistanceMobile = '16px'; // side distance of the icon e.g. "200px" or "calc(50% -44px)"
let eA_iconSize = '50px'; // Icon size in px e.g. "70"
let eA_iconSizeMobile = '40px'; // Icon size mobile in px e.g. "70"
let eA_bottom = '15%'; //Mobile bottom position
let eA_externalLogoUrl = 'https://cdn.shopify.com/s/files/1/0430/2517/0587/files/Icon_Barrierefreiheit_32x32px_2025-12-16.svg?v=1765875472'; // If set in config then it will includes here
let eA_customBackgroundColor = '#000'; // Backgroundcolor of the tooltip
let eA_bColor = '#000'; // background color of the icon

let eA_fColor = '#fff'; // foreground color of the icon

/*--------------------------------------------------------------------------------*/
/* The following lines need to be changed only for local hosting:
/*--------------------------------------------------------------------------------*/
let eA_path = 'https://cdn.eye-able.com/'; //Change to the local path of the public folder when hosting Eye-Able
let eA_configPath = 'https://cdn.eye-able.com/configs/'; //Change to the local path of the config when hosting Eye-Able
/*--------------------------------------------------------------------------------*/

let t1 = 'Eye-Able - Visuelle Hilfe';
let t2 = 'Passe diese Seite visuell an oder lasse sie Dir vorlesen. Klicken zum Ã–ffnen.';
let t3 = 'Externer Dienst';
let t4 = 'Mehr Infos';
let eA_privacyPath = 'https://eye-able.com/hinweis-datenschutz/'; //Url of the privacy notification
if (
    document.documentElement.lang &&
    (document.documentElement.lang.includes('en') || !document.documentElement.lang.includes('de'))
) {
    t1 = 'Eye-Able - Visual Help';
    t2 = 'Customize this website visually or use the screenreader. Click to open.';
    t3 = 'External Service';
    t4 = 'More Info';
    eA_privacyPath = 'https://eye-able.com/en/hinweis-datenschutz/';
}

if (eA_externalLogoUrl.length === 0) {
    function eyeAble_updateConfig() {
        window.eyeAble_pluginConfig.customIconColor = eA_bColor;
    }
}

let eA_loaded = false;

function aEA() {
    if (!eA_loaded) {
        let eA_h = document.querySelector('head') || document.body;
        let s = document.createElement('script');
        let c = document.createElement('script');
        s.src = eA_path + 'public/js/eyeAble.js';
        s.async = true;
        c.src = eA_configPath + eA_domain + '.js';
        // c.async = true;
        eA_h.appendChild(c);
        eA_h.appendChild(s);
        eA_loaded = true;
    }
}

//load directly if a LocalStorage Entry exists
if (localStorage.getItem('eyeAbleVariables')) {
    aEA();
} else {
    function s() {
        //Check for custom opener elements
        let co = document.querySelectorAll(
            '.eyeAble_customToolOpenerClass,#eyeAble_customToolOpenerID,.eyeAble_customToolOpenerNoHideClass'
        );
        if (window.location.hash.substring(1) === 'showEyeAble') {
            aEA();
            return;
        }
        if (co.length > 0) {
            function cOf() {
                eA_open = true;
                aEA();
                co.forEach(e => e.removeEventListener('click', cOf));
            }

            co.forEach(e => e.addEventListener('click', cOf));
            co.forEach(e =>
                e.addEventListener('keyup', function (e) {
                    if (event.which === 13) cOf();
                })
            );
        } else {
            let t = document.createElement('Eye-Able');
            t.setAttribute('id', 'eA_Opener');
            t.attachShadow({mode: 'open'});
            //append after the first link that is not a jump to a landmark
            if (document.links.length > 0) {
                //check if the first link has an hash, which would indicate a jump to a landmark
                if (!document.links[0].hash) {
                    //no hash
                    document.body.prepend(t);
                } else {
                    for (let i = 0; i < document.links.length; i++) {
                        if (
                            document.links[i].hash &&
                            document.links[i].baseURI.includes(window.location.hostname)
                        ) {
                            //link with hash found! Place access after this one
                        } else {
                            if (i === 0) {
                                //make sure its not places at the end
                                document.body.prepend(t);
                                break;
                            } else {
                                //a link has been found without an hash. Place the access link right after the last link that had an hash
                                document.links[i - 1].after(t);
                                break;
                            }
                        }
                    }
                }
            } else {
                document.body.prepend(t);
            }
            // document.body.appendChild(t);
            let h = document.createElement('div');
            if (window.innerWidth < 700) {
                eA_iconSize = eA_iconSizeMobile;
                eA_side = eA_sideMobile;
                eA_sideDistance = eA_sideDistanceMobile;
            }
            h.setAttribute(
                'style',
                'position: fixed;top:' + eA_top + ';' + eA_side + ': ' + eA_sideDistance + ';z-index: 2147483648'
            );
            t.shadowRoot.appendChild(h);
            let ts = 'left';
            if (eA_side === 'left') ts = 'right';
            let s =
                '' +
                '<div aria-hidden="true" id="t" style="display:none;' +
                ts +
                ': -350px;top: -40px;position: absolute;background: ' + eA_customBackgroundColor + ';color: white;width: 290px;padding: 11px 20px 28px;border-radius: 20px;border: 3px solid #fff;font-family:Open Sans,sans-serif;font-weight: 400;font-size: 17px;line-height:24px;box-shadow: 0 0 8px 1px rgb(0 0 0 / 50%);">' +
                '   <div style="font-size: 22px;font-weight: bold;padding-bottom: 8px;margin-bottom: 8px;border-bottom: 3px solid;">' +
                t1 +
                '</div>' +
                '   <p style="margin: 0 0 13px 0;">' +
                t2 +
                '</p>' +
                '   <p style="position: absolute;bottom: 11px;right: 22px;margin: 0;font-weight: bold;font-size: 16px;">' +
                t3 +
                ' (<a href="' +
                eA_privacyPath +
                '" target="_blank" style="' +
                '    color: white;text-decoration: underline;cursor: pointer;">' +
                t4 +
                '</a>)</p>' +
                '</div>' +
                '<div tabindex="0" role="button" aria-label="' +
                t1 +
                ' ' +
                t2 +
                t3 +
                '" id="i" style="width: ' + eA_iconSize + ';cursor: pointer;transition: transform 150ms ease;">';
                if (eA_externalLogoUrl.length > 0) {
                    s = s + 
                    '   <img src="' + eA_externalLogoUrl + '">'               
                } else {
                    s = s + 
                    '   <svg style="filter: drop-shadow(2px 3px 4px #505050);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 389.9 389.6" preserveAspectRatio="none" xmlns:v="https://vecta.io/nano"><defs><linearGradient id="A" x1="253.85" y1="63.7" x2="253.85" y2="480.49" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f4f4e"></stop><stop offset=".26" stop-color="#313130"></stop><stop offset=".55" stop-color="#161616"></stop><stop offset=".8" stop-color="#060606"></stop><stop offset="1"></stop></linearGradient><linearGradient id="B" x1="214.9" y1="353.49" x2="286.3" y2="353.49" gradientTransform="matrix(0.16, 0.99, 0.99, -0.16, -138.47, -44.34)" xlink:href="#A"></linearGradient><linearGradient id="C" x1="135.26" y1="296.4" x2="365.84" y2="296.4" xlink:href="#A"></linearGradient></defs><path style="fill:' +
                    eA_bColor +
                    '" d="M201.6 443.2h-33.4c-27.7 0-51.9-9.6-71.9-28.4a101.84 101.84 0 0 1-30.6-56.2 107.42 107.42 0 0 1-1.7-19v-52.7l.1-120.5c.1-26.7 9.5-50.3 28.1-70.1a101.58 101.58 0 0 1 55.6-30.7 104 104 0 0 1 20.9-1.9H339c25.9 0 48.8 8.3 68.1 24.6a102 102 0 0 1 34.5 58.2 100.5 100.5 0 0 1 2.1 20.8V340a99.13 99.13 0 0 1-11 46.3c-15.9 30.4-41 49.1-74.7 55.6a95.89 95.89 0 0 1-17.6 1.6h-87.8z" transform="translate(-59.2 -58.6)" fill="url(#A)"></path><path style="fill:' +
                    eA_fColor +
                    '" d="M279.9 10c24.4 0 46.2 7.6 64.8 23.4C362 48 372.9 66.6 377.6 88.8a93.42 93.42 0 0 1 2 19.7q0 86.4.1 172.7a94.41 94.41 0 0 1-10.4 44q-22.8 43.65-71.2 53a85.05 85.05 0 0 1-16.7 1.5H109.2c-26.4 0-49.3-9-68.4-27.1-15.5-14.6-25.1-32.5-29.1-53.5a99.85 99.85 0 0 1-1.6-18.1l.1-173.2c.1-25.7 9.2-48 26.7-66.7a96.5 96.5 0 0 1 52.9-29.2 102.64 102.64 0 0 1 20-1.8h96.9l73.2-.1h0m0-10H109.7a114.49 114.49 0 0 0-22 2 106.79 106.79 0 0 0-58.2 32.2C10.1 55 .2 79.7.1 107.7L0 228.2v52.7a109.41 109.41 0 0 0 1.8 20c4.4 23.2 15.1 43 32.1 58.9 20.9 19.7 46.3 29.8 75.3 29.8h172.3a99.15 99.15 0 0 0 18.6-1.6c35.3-6.8 61.6-26.3 78.2-58.2a103.74 103.74 0 0 0 11.6-48.6V108.5a103.33 103.33 0 0 0-2.2-21.8 106.53 106.53 0 0 0-36.2-61C331 8.6 307 0 279.9 0z" fill="#fff"></path><circle style="fill:' +
                    eA_bColor +
                    '" cx="250.6" cy="146.4" r="35.7" transform="matrix(.160226 -.98708 .98708 .160226 6.75 311.71)" fill="url(#B)"></circle><path style="fill:' +
                    eA_bColor +
                    '" d="M350.6,203.6l-75,6.7c-2.8.2-5.5.4-8.3.4H233.9a76.87,76.87,0,0,1-8.3-.4l-75-6.7a14.24,14.24,0,0,0-2.2,28.4l60.6,5.5a14.25,14.25,0,0,1,13,14.2v16.4a33.8,33.8,0,0,1-2.5,13l-34.5,88a14.3,14.3,0,0,0,26.1,11.7l33-80.1a7,7,0,0,1,13-.1l33,80.1A14.3,14.3,0,1,0,316.2,369l-34.5-87.9a36.61,36.61,0,0,1-2.5-13V251.7a14.18,14.18,0,0,1,13-14.2l60.6-5.5a14.24,14.24,0,0,0-2.2-28.4Z" transform="translate(-59.2 -58.6)" fill="url(#C)"></path><path style="fill:' +
                    eA_fColor +
                    '" d="M191.4 130.7c-23.693 0-42.9-19.207-42.9-42.9s19.207-42.9 42.9-42.9 42.9 19.207 42.9 42.9a42.89 42.89 0 0 1-42.9 42.9zm0-71.5c-13.69-.038-25.498 9.605-28.197 23.026a28.68 28.68 0 0 0 17.105 32.135c12.641 5.256 27.234.846 34.848-10.531A28.68 28.68 0 0 0 211.6 67.6a29.06 29.06 0 0 0-20.2-8.4zm52.5 278.6a21.46 21.46 0 0 1-19.5-12.6l-33.1-80.3-32.7 80.1a21.41 21.41 0 0 1-37.1 4.1 21.57 21.57 0 0 1-2.1-21.5l34.4-87.5a26.63 26.63 0 0 0 1.9-10.4v-16.4a7.09 7.09 0 0 0-6.5-7.1l-60.6-5.5c-11.791-.911-20.611-11.209-19.7-23s11.209-20.611 23-19.7l75.1 6.7a97.18 97.18 0 0 0 7.7.3h33.4a99.08 99.08 0 0 0 7.7-.3l75-6.7h.1c11.791-.911 22.089 7.909 23 19.7s-7.909 22.089-19.7 23l-60.5 5.5a7.09 7.09 0 0 0-6.5 7.1v16.4a28.29 28.29 0 0 0 2 10.4l34.5 87.9a21.36 21.36 0 0 1-1.8 20.2 22.06 22.06 0 0 1-18 9.6zm-52.5-107.1a14.11 14.11 0 0 1 13.1 8.8l33 80.1a7.62 7.62 0 0 0 3.9 3.6 7.13 7.13 0 0 0 9-9.6l-34.6-88.3a42.14 42.14 0 0 1-3-15.7v-16.4c-.054-11.101 8.438-20.376 19.5-21.3l60.6-5.5a7 7 0 0 0 4.9-2.4 6.61 6.61 0 0 0 1.7-5.2 7 7 0 0 0-7.6-6.6l-74.9 6.7a88.33 88.33 0 0 1-8.9.4h-33.4a87 87 0 0 1-8.9-.4l-75-6.7a7.12 7.12 0 0 0-1 14.2l60.7 5.5c11.062.924 19.554 10.199 19.5 21.3v16.4a42.14 42.14 0 0 1-3 15.7l-34.5 87.9a7.09 7.09 0 0 0 .3 7.3 7.19 7.19 0 0 0 6.6 3.2 7 7 0 0 0 5.9-4.3l32.9-79.9a14 14 0 0 1 13.2-8.8z" fill="#fff"></path></svg>'
                }
                s = s + '  </div>' +
                '</div>';
            h.insertAdjacentHTML('afterbegin', s);
            let o = h.querySelector('#i');
            let m = h.querySelector('#t');
            if (!sessionStorage.getItem('eyeAbleShow')) {
                setTimeout(() => {
                    m.style.display = 'block';
                    m.setAttribute('aria-hidden', 'false');
                }, 500);
                setTimeout(() => {
                    m.style.display = 'none';
                    m.setAttribute('aria-hidden', 'true');
                }, 4000);
                sessionStorage.setItem('eyeAbleShow', 'false');
            }

            function x() {
                eA_open = true;
                aEA();
            }

            if (window.innerWidth < 700) {
                h.style.top = 'unset';
                h.style.bottom = eA_bottom;
                o.style.width = eA_iconSize;
                m.style.width = '240px';
                if(eA_sideMobile === 'right') {
                    m.style.left = '-297px';
                } else {
                    m.style.right = '-297px';
                }
                m.style.top = '-50px';
                m.children[0].style.fontSize = '19px';
                if (navigator.userAgent.match(/SamsungBrowser/i))
                    m.children[0].style.fontSize = '17px';
                m.children[1].style.fontSize = '14px';
                m.children[2].style.fontSize = '14px';
                //m.style.opacity = "0";
                o.addEventListener('touchstart', () => {
                    if (m.style.display === 'block') x();
                });
            } else {
                o.addEventListener('click', x);
            }
            t.addEventListener('keyup', function (e) {
                if (event.which === 13) {
                    x();
                }
            });
            o.addEventListener('mouseenter', function () {
                m.style.display = 'block';
                m.setAttribute('aria-hidden', 'false');
                o.style.transform = 'scale(1.1)';
            });
            o.addEventListener('focus', function () {
                m.style.display = 'block';
                m.setAttribute('aria-hidden', 'false');
                o.style.outline = '3px solid black';
            });
            o.addEventListener('blur', function () {
                m.style.display = 'none';
                m.setAttribute('aria-hidden', 'true');
                o.style.outline = 'none';
            });
            h.querySelectorAll('#i,#t').forEach((e) =>
                e.addEventListener('mouseleave', function () {
                    setTimeout(() => {
                        if (!t.matches(':hover')) {
                            m.style.display = 'none';
                            m.setAttribute('aria-hidden', 'true');
                        }
                    }, 1500);
                    o.style.transform = 'none';
                })
            );

            //detect alt+1 and alt+f1
            function k(e) {
                if (e.altKey) {
                    if (e.key === '1' || e.key === 'F1') {
                        eA_open = true;
                        aEA();
                        window.removeEventListener('keyup', k);
                        if (e.key === 'F1') {
                            document.addEventListener('eyeable:init_completed', () => {
                                window.eyeAble_toggleShortcutManPage();
                            });
                        }
                    }
                }
            }

            window.addEventListener('keyup', k);
        }
    }

    if (document.readyState === 'complete') {
        s();
    } else {
        window.addEventListener('load', () => {
            s();
        });
    }
}