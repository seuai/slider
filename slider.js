addEventListener('load', () => {
    const $slider = document.querySelector('.slider');
    const $wrap = $slider.querySelector('*');
    const $nav = $slider.querySelector('nav');
    const $prev = $nav.querySelector('button.prev');
    const $next = $nav.querySelector('button.next');

    let width = $slider.clientWidth;
    let half = width / 2;
    let last = $wrap.childElementCount - 1;
    let startTime = 0;
    let startX = 0;
    let lastX = 0;
    let maxX = width * last;
    let isIng = false;
    let i = $slider.style.getPropertyValue('--i') || 0;

    const render = () => {
        $slider.style.setProperty('--i', i);
        delete $slider.dataset.last;
        delete $slider.dataset.first;
        if(i == last){
            $slider.dataset.last = true;
        }else if(i == 0){
            $slider.dataset.first = true;
        }
    }
    const slidermove = ({x} = {}) => {
        x -= startX - lastX;
        if(x >= 0){
            x = 0;
        }else if(x <= -maxX){
            x = -maxX;
        }
        $slider.style.setProperty('--x', x + 'px');
    };
    const sliderend = ({timeStamp} = {}) => {
        removeEventListener('pointermove', slidermove);
        let x = parseInt($slider.style.getPropertyValue('--x'));
        $slider.style.removeProperty('--x');
        if(isNaN(x)) return;
        if(x >= 0){
            x = 0;
        }else if(x <= -maxX){
            x = -maxX;
        }
        if(lastX == x) return;
        if(timeStamp - startTime < 300){
            if(lastX < x){
                i--;
            }else{
                i++;
            }
        }else{
            if(x > lastX + half){
                i--;
            }else if(x < lastX - half){
                i++;
            }
        }
        render();
    }

    $wrap.addEventListener('transitionstart', () => {
        isIng = true;
        $slider.querySelector(`nav > button.on`).classList.remove('on');
        $slider.querySelector(`nav > button:nth-child(${i + 2})`).classList.add('on');
    }, {passive: true});
    $wrap.addEventListener('transitionend', () => {
        isIng = false;
    }, {passive: true});
    $slider.onpointerdown = ({x, timeStamp} = {}) => {
        if(isIng) return;
        startTime = timeStamp;
        startX = x;
        lastX = -width * i;
        addEventListener('pointermove', slidermove, {passive: true});
        addEventListener('pointerup', sliderend, {passive: true, once: true})
    }
    $prev.onclick = () => {
        if(isIng || i <= 0) return;
        i--;
        render();
    }
    $next.onclick = () => {
        if(isIng || i >= last) return;
        i++;
        render();
    }
    $nav.onclick = ({target} = {}) => {
        if(isIng || target.matches(':first-child, :last-child, .on')) return;
        i = Array.prototype.slice.call($nav.children, 1).indexOf(target);
        render();
    }

    addEventListener('pointercancel', () => {
        $slider.style.removeProperty('--x');
        $wrap.removeEventListener('pointerup', sliderend);
        $wrap.removeEventListener('pointermove', slidermove);
    }, {passive: true});
    addEventListener('resize', () => {
        width = $slider.clientWidth;
        half = width / 2;
        maxX = width * last;
    }, {passive: true});
    
    $nav.querySelector(`:nth-child(${i + 2})`).classList.add('on');
    render();
});