(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    class FullPage {
        constructor(element, options) {
            let config = {
                noEventSelector: "[data-no-event]",
                сlassInit: "fp-init",
                wrapperAnimatedClass: "fp-switching",
                selectorSection: "[data-fp-section]",
                activeClass: "active-section",
                previousClass: "previous-section",
                nextClass: "next-section",
                idActiveSection: 0,
                mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
                bullets: element.hasAttribute("data-fp-bullets") ? true : false,
                bulletsClass: "fp-bullets",
                bulletClass: "fp-bullet",
                bulletActiveClass: "fp-bullet-active",
                onInit: function() {},
                onSwitching: function() {},
                onDestroy: function() {}
            };
            this.options = Object.assign(config, options);
            this.wrapper = element;
            this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
            this.activeSection = false;
            this.activeSectionId = false;
            this.previousSection = false;
            this.previousSectionId = false;
            this.nextSection = false;
            this.nextSectionId = false;
            this.bulletsWrapper = false;
            this.stopEvent = false;
            if (this.sections.length) this.init();
        }
        init() {
            if (this.options.idActiveSection > this.sections.length - 1) return;
            this.setId();
            this.activeSectionId = this.options.idActiveSection;
            this.setEffectsClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) {
                this.setBullets();
                this.setActiveBullet(this.activeSectionId);
            }
            this.events();
            setTimeout((() => {
                document.documentElement.classList.add(this.options.сlassInit);
                this.options.onInit(this);
                document.dispatchEvent(new CustomEvent("fpinit", {
                    detail: {
                        fp: this
                    }
                }));
            }), 0);
        }
        destroy() {
            this.removeEvents();
            this.removeClasses();
            document.documentElement.classList.remove(this.options.сlassInit);
            this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            this.removeEffectsClasses();
            this.removeZIndex();
            this.removeStyle();
            this.removeId();
            this.options.onDestroy(this);
            document.dispatchEvent(new CustomEvent("fpdestroy", {
                detail: {
                    fp: this
                }
            }));
        }
        setId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.setAttribute("data-fp-id", index);
            }
        }
        removeId() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.removeAttribute("data-fp-id");
            }
        }
        setClasses() {
            this.previousSectionId = this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;
            this.nextSectionId = this.activeSectionId + 1 < this.sections.length ? this.activeSectionId + 1 : false;
            this.activeSection = this.sections[this.activeSectionId];
            this.activeSection.classList.add(this.options.activeClass);
            if (false !== this.previousSectionId) {
                this.previousSection = this.sections[this.previousSectionId];
                this.previousSection.classList.add(this.options.previousClass);
            } else this.previousSection = false;
            if (false !== this.nextSectionId) {
                this.nextSection = this.sections[this.nextSectionId];
                this.nextSection.classList.add(this.options.nextClass);
            } else this.nextSection = false;
        }
        removeEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.remove("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.remove("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.remove("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setEffectsClasses() {
            switch (this.options.mode) {
              case "slider":
                this.wrapper.classList.add("slider-mode");
                break;

              case "cards":
                this.wrapper.classList.add("cards-mode");
                this.setZIndex();
                break;

              case "fade":
                this.wrapper.classList.add("fade-mode");
                this.setZIndex();
                break;

              default:
                break;
            }
        }
        setStyle() {
            switch (this.options.mode) {
              case "slider":
                this.styleSlider();
                break;

              case "cards":
                this.styleCards();
                break;

              case "fade":
                this.styleFade();
                break;

              default:
                break;
            }
        }
        styleSlider() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)"; else if (index > this.activeSectionId) section.style.transform = "translate3D(0,100%,0)";
            }
        }
        styleCards() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index >= this.activeSectionId) section.style.transform = "translate3D(0,0,0)"; else if (index < this.activeSectionId) section.style.transform = "translate3D(0,-100%,0)";
            }
        }
        styleFade() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                if (index === this.activeSectionId) {
                    section.style.opacity = "1";
                    section.style.visibility = "visible";
                } else {
                    section.style.opacity = "0";
                    section.style.visibility = "hidden";
                }
            }
        }
        removeStyle() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.opacity = "";
                section.style.visibility = "";
                section.style.transform = "";
            }
        }
        checkScroll(yCoord, element) {
            this.goScroll = false;
            if (!this.stopEvent && element) {
                this.goScroll = true;
                if (this.haveScroll(element)) {
                    this.goScroll = false;
                    const position = Math.round(element.scrollHeight - element.scrollTop);
                    if (Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0 || Math.abs(position - element.clientHeight) < 2 && yCoord >= 0) this.goScroll = true;
                }
            }
        }
        haveScroll(element) {
            return element.scrollHeight !== window.innerHeight;
        }
        removeClasses() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.classList.remove(this.options.activeClass);
                section.classList.remove(this.options.previousClass);
                section.classList.remove(this.options.nextClass);
            }
        }
        events() {
            this.events = {
                wheel: this.wheel.bind(this),
                touchdown: this.touchDown.bind(this),
                touchup: this.touchUp.bind(this),
                touchmove: this.touchMove.bind(this),
                touchcancel: this.touchUp.bind(this),
                transitionEnd: this.transitionend.bind(this),
                click: this.clickBullets.bind(this)
            };
            if (isMobile.iOS()) document.addEventListener("touchmove", (e => {
                e.preventDefault();
            }));
            this.setEvents();
        }
        setEvents() {
            this.wrapper.addEventListener("wheel", this.events.wheel);
            this.wrapper.addEventListener("touchstart", this.events.touchdown);
            if (this.options.bullets && this.bulletsWrapper) this.bulletsWrapper.addEventListener("click", this.events.click);
        }
        removeEvents() {
            this.wrapper.removeEventListener("wheel", this.events.wheel);
            this.wrapper.removeEventListener("touchdown", this.events.touchdown);
            this.wrapper.removeEventListener("touchup", this.events.touchup);
            this.wrapper.removeEventListener("touchcancel", this.events.touchup);
            this.wrapper.removeEventListener("touchmove", this.events.touchmove);
            if (this.bulletsWrapper) this.bulletsWrapper.removeEventListener("click", this.events.click);
        }
        clickBullets(e) {
            const bullet = e.target.closest(`.${this.options.bulletClass}`);
            if (bullet) {
                const arrayChildren = Array.from(this.bulletsWrapper.children);
                const idClickBullet = arrayChildren.indexOf(bullet);
                this.switchingSection(idClickBullet);
            }
        }
        setActiveBullet(idButton) {
            if (!this.bulletsWrapper) return;
            const bullets = this.bulletsWrapper.children;
            for (let index = 0; index < bullets.length; index++) {
                const bullet = bullets[index];
                if (idButton === index) bullet.classList.add(this.options.bulletActiveClass); else bullet.classList.remove(this.options.bulletActiveClass);
            }
        }
        touchDown(e) {
            this._yP = e.changedTouches[0].pageY;
            this._eventElement = e.target.closest(`.${this.options.activeClass}`);
            if (this._eventElement) {
                this._eventElement.addEventListener("touchend", this.events.touchup);
                this._eventElement.addEventListener("touchcancel", this.events.touchup);
                this._eventElement.addEventListener("touchmove", this.events.touchmove);
                this.clickOrTouch = true;
                if (isMobile.iOS()) {
                    if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
                        if (0 === this._eventElement.scrollTop) this._eventElement.scrollTop = 1;
                        if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
                    }
                    this.allowUp = this._eventElement.scrollTop > 0;
                    this.allowDown = this._eventElement.scrollTop < this._eventElement.scrollHeight - this._eventElement.clientHeight;
                    this.lastY = e.changedTouches[0].pageY;
                }
            }
        }
        touchMove(e) {
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            if (isMobile.iOS()) {
                let up = e.changedTouches[0].pageY > this.lastY;
                let down = !up;
                this.lastY = e.changedTouches[0].pageY;
                if (targetElement) if (up && this.allowUp || down && this.allowDown) e.stopPropagation(); else if (e.cancelable) e.preventDefault();
            }
            if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return;
            let yCoord = this._yP - e.changedTouches[0].pageY;
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll && Math.abs(yCoord) > 20) this.choiceOfDirection(yCoord);
        }
        touchUp(e) {
            this._eventElement.removeEventListener("touchend", this.events.touchup);
            this._eventElement.removeEventListener("touchcancel", this.events.touchup);
            this._eventElement.removeEventListener("touchmove", this.events.touchmove);
            return this.clickOrTouch = false;
        }
        transitionend(e) {
            if (e.target.closest(this.options.selectorSection)) {
                this.stopEvent = false;
                this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
            }
        }
        wheel(e) {
            if (e.target.closest(this.options.noEventSelector)) return;
            const yCoord = e.deltaY;
            const targetElement = e.target.closest(`.${this.options.activeClass}`);
            this.checkScroll(yCoord, targetElement);
            if (this.goScroll) this.choiceOfDirection(yCoord);
        }
        choiceOfDirection(direction) {
            this.stopEvent = true;
            if (0 === this.activeSectionId && direction < 0 || this.activeSectionId === this.sections.length - 1 && direction > 0) this.stopEvent = false;
            if (direction > 0 && false !== this.nextSection) this.activeSectionId = this.activeSectionId + 1 < this.sections.length ? ++this.activeSectionId : this.activeSectionId; else if (direction < 0 && false !== this.previousSection) this.activeSectionId = this.activeSectionId - 1 >= 0 ? --this.activeSectionId : this.activeSectionId;
            if (this.stopEvent) this.switchingSection();
        }
        switchingSection(idSection = this.activeSectionId) {
            this.activeSectionId = idSection;
            this.wrapper.classList.add(this.options.wrapperAnimatedClass);
            this.wrapper.addEventListener("transitionend", this.events.transitionEnd);
            this.removeClasses();
            this.setClasses();
            this.setStyle();
            if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
            this.options.onSwitching(this);
            document.dispatchEvent(new CustomEvent("fpswitching", {
                detail: {
                    fp: this
                }
            }));
        }
        setBullets() {
            this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);
            if (!this.bulletsWrapper) {
                const bullets = document.createElement("div");
                bullets.classList.add(this.options.bulletsClass);
                this.wrapper.append(bullets);
                this.bulletsWrapper = bullets;
            }
            if (this.bulletsWrapper) for (let index = 0; index < this.sections.length; index++) {
                const span = document.createElement("span");
                span.classList.add(this.options.bulletClass);
                this.bulletsWrapper.append(span);
            }
        }
        setZIndex() {
            let zIndex = this.sections.length;
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = zIndex;
                --zIndex;
            }
        }
        removeZIndex() {
            for (let index = 0; index < this.sections.length; index++) {
                const section = this.sections[index];
                section.style.zIndex = "";
            }
        }
    }
    if (document.querySelector("[data-fp]")) modules_flsModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("long-press", (function(e) {
        e.target.setAttribute("data-editing", "true");
        console.log("working");
        let optionBody = e.target.closest(".freelancer__message");
        if (optionBody.children[2].classList.contains("_active")) optionBody.children[2].classList.remove("_active"); else optionBody.children[2].classList.add("_active");
    }));
    /*!
 * long-press-event - v2.2.0
 * Pure JavaScript long-press-event
 * https://github.com/john-doherty/long-press-event
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */    !function(e, t) {
        "use strict";
        var n = null, a = "ontouchstart" in e || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0, i = a ? "touchstart" : "mousedown", o = a ? "touchend" : "mouseup", m = a ? "touchmove" : "mousemove", u = 0, r = 0, s = 10, c = 10;
        function l(i) {
            v(i);
            var m = i.target, u = parseInt(m.getAttribute("data-long-press-delay") || "1500", 10);
            n = function(t, n) {
                if (!(e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame && e.mozCancelRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame)) return e.setTimeout(t, n);
                var a = (new Date).getTime(), i = {}, o = function() {
                    (new Date).getTime() - a >= n ? t.call() : i.value = requestAnimFrame(o);
                };
                return i.value = requestAnimFrame(o), i;
            }(function(e) {
                v();
                var n = a ? e.touches[0].clientX : e.clientX, i = a ? e.touches[0].clientY : e.clientY;
                this.dispatchEvent(new CustomEvent("long-press", {
                    bubbles: !0,
                    cancelable: !0,
                    detail: {
                        clientX: n,
                        clientY: i
                    }
                })) && t.addEventListener(o, (function e(n) {
                    t.removeEventListener(o, e, !0), function(e) {
                        e.stopImmediatePropagation(), e.preventDefault(), e.stopPropagation();
                    }(n);
                }), !0);
            }.bind(m, i), u);
        }
        function v(t) {
            var a;
            (a = n) && (e.cancelAnimationFrame ? e.cancelAnimationFrame(a.value) : e.webkitCancelAnimationFrame ? e.webkitCancelAnimationFrame(a.value) : e.webkitCancelRequestAnimationFrame ? e.webkitCancelRequestAnimationFrame(a.value) : e.mozCancelRequestAnimationFrame ? e.mozCancelRequestAnimationFrame(a.value) : e.oCancelRequestAnimationFrame ? e.oCancelRequestAnimationFrame(a.value) : e.msCancelRequestAnimationFrame ? e.msCancelRequestAnimationFrame(a.value) : clearTimeout(a)), 
            n = null;
        }
        "function" != typeof e.CustomEvent && (e.CustomEvent = function(e, n) {
            n = n || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var a = t.createEvent("CustomEvent");
            return a.initCustomEvent(e, n.bubbles, n.cancelable, n.detail), a;
        }, e.CustomEvent.prototype = e.Event.prototype), e.requestAnimFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(t) {
            e.setTimeout(t, 1e3 / 60);
        }, t.addEventListener(o, v, !0), t.addEventListener(m, (function(e) {
            var t = Math.abs(u - e.clientX), n = Math.abs(r - e.clientY);
            (t >= s || n >= c) && v();
        }), !0), t.addEventListener("wheel", v, !0), t.addEventListener("scroll", v, !0), 
        t.addEventListener(i, (function(e) {
            u = e.clientX, r = e.clientY, l(e);
        }), !0);
    }(window, document);
    const tabBtns = Array.from(document.querySelectorAll(".chat__btn"));
    const tabSlide = Array.from(document.querySelectorAll(".chat__body"));
    const btnsContainer = document.getElementsByClassName("chat__fixitem");
    const bodysContainder = document.getElementsByClassName("chat_bodys");
    const backToChatsBtns = Array.from(document.querySelectorAll(".back_to_chats"));
    console.log(backToChatsBtns);
    tabBtns[0].classList.add("_active");
    tabSlide[0].classList.add("_active");
    let activeBtn = tabBtns[0];
    let activeSlide = tabSlide[0];
    tabBtns.forEach((el => {
        el.addEventListener("click", onTabBtnClick);
    }));
    function onTabBtnClick(e) {
        e.preventDefault();
        const btn = e.target.closest(".chat__btn");
        btnsContainer[0].classList.add("_closed");
        bodysContainder[0].classList.add("_opened");
        changeBtn(btn);
    }
    function changeBtn(btn) {
        if (btn.classList.contains("_active")) return;
        activeBtn.classList.remove("_active");
        btn.classList.add("_active");
        activeBtn = btn;
        const indexBtn = tabBtns.indexOf(btn);
        changeSlide(indexBtn);
    }
    function changeSlide(index) {
        activeSlide.classList.remove("_active");
        tabSlide[index].classList.add("_active");
        activeSlide = tabSlide[index];
    }
    const moreInfoBtns = Array.from(document.querySelectorAll(".more__option"));
    const messageBodys = Array.from(document.querySelectorAll(".freelancer__message"));
    moreInfoBtns.forEach((el => {
        el.addEventListener("click", optionMenuOpen);
    }));
    messageBodys.forEach((el => {
        el.addEventListener("mouseleave", closeMenuAuto);
    }));
    function optionMenuOpen(e) {
        let optionBody = e.target.nextElementSibling;
        if (optionBody.classList.contains("_active")) optionBody.classList.remove("_active"); else optionBody.classList.add("_active");
    }
    function closeMenuAuto(e) {
        let elementLost = e.target.closest(".freelancer__message");
        let menuX = elementLost.children[2];
        if (menuX.classList.contains("_active")) menuX.classList.remove("_active");
    }
    const popupBody = document.getElementsByClassName("popup_dark_area");
    const closePopupIcon = document.getElementsByClassName("close_popup_icon");
    const newServiceBtns = Array.from(document.querySelectorAll(".forming_service"));
    newServiceBtns.forEach((el => {
        el.addEventListener("click", newServiceFormOpen);
    }));
    function newServiceFormOpen(e) {
        if (!popupBody[0].classList.contains("_active")) popupBody[0].classList.add("_active");
    }
    if (closePopupIcon.length > 0) closePopupIcon[0].addEventListener("click", closeActivePopup);
    function closeActivePopup() {
        popupBody[0].classList.remove("_active");
    }
    backToChatsBtns.forEach((el => {
        el.addEventListener("click", backToChatsFn);
    }));
    function backToChatsFn() {
        console.log("click");
        btnsContainer[0].classList.remove("_closed");
        bodysContainder[0].classList.remove("_opened");
    }
    window["FLS"] = true;
    isWebp();
})();