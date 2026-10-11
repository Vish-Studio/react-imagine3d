import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import gsap from 'gsap';
import Loader from './loader';

test('a completed loader cannot block clicks while it remains mounted', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const setLoader = jest.fn();
    const previousActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
    global.IS_REACT_ACT_ENVIRONMENT = true;
    let timeline;

    const originalTimeline = gsap.timeline;
    const spy = jest.spyOn(gsap, 'timeline').mockImplementation((options) => {
        timeline = originalTimeline.call(gsap, options);
        return timeline;
    });

    try {
        act(() => root.render(<Loader setLoader={setLoader} />));
        act(() => {
            timeline.progress(1);
        });

        expect(setLoader).toHaveBeenCalledWith(false);
        expect(host.firstChild.style.opacity).toBe('0');
        expect(host.firstChild.style.pointerEvents).toBe('none');
        expect(host.firstChild.style.visibility).toBe('hidden');
    } finally {
        act(() => root.unmount());
        global.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
        spy.mockRestore();
        host.remove();
    }
});
