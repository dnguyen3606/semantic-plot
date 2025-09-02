import { useCallback, useEffect, useRef, useState } from 'react';
import classes from './Tutorial.module.css';

type WaitFor = 'click' | 'input' | 'focus' | 'none';

export type Step = {
    selector: string;
    highlightAll?: boolean;
    waitFor?: WaitFor;
}

type TutorialProps = {
    id: string;
    steps: Step[];
    onFinish?: () => void;
}

const Tutorial = ( {id, steps, onFinish }: TutorialProps ) => {
    const [index, setIndex] = useState(!(localStorage.getItem(id) === 'true') ? 0 : -1);
    const [highlights, setHighlights] = useState<DOMRect[]>([]);
    const step = steps[index]

    // find all elements given the selectors. Use a callback and MutationObserver in order to listen for
    // the creation of elements that may not exist yet. i.e. nodes exist only after add button is clicked.
    const findElements = useCallback(async (selector: string, timeout = 10) => {
        const existing = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
        if (existing.length) return existing;

        return new Promise<HTMLElement[]>((resolve) => {
            const timer = setTimeout(() => {
                observer.disconnect();
                resolve(Array.from(document.querySelectorAll(selector)) as HTMLElement[]);
            }, timeout);

            const observer = new MutationObserver(() => {
                const found = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
                if (found.length) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(found);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true});
        });
    }, []);

    // useEffect to define highlight rects for the current step. Uses the findElement function above.
    useEffect(() => {
        if (!step) {
            setHighlights([]);
            return;
        }

        let mounted = true;
        let animationFrameId: number;

        const trackElements = async () => {
            const elements = await findElements(step.selector);
            if (!mounted) return;
            if (!elements.length) {
                setIndex(prev => Math.max(prev - 1, 0));
                return;
            }

            const targetElements = step.highlightAll ? elements : [elements[0]];

            let lastHighlights: DOMRect[] = [];

            const update = () => {
                if (!mounted) return;

                const newHighlights = targetElements.map(el => el.getBoundingClientRect());
                let changed = false;

                // only update if position/size changed
                newHighlights.forEach((h, i) => {
                    if (
                        !lastHighlights[i] ||
                        h.top !== lastHighlights[i].top ||
                        h.left !== lastHighlights[i].left ||
                        h.width !== lastHighlights[i].width ||
                        h.height !== lastHighlights[i].height
                    ) {
                        changed = true;
                    }
                });
                if (changed) {
                    setHighlights(newHighlights);
                    lastHighlights = newHighlights;
                }
                animationFrameId = requestAnimationFrame(update);
            };
            update();
        };

        trackElements();

        return () => {
            mounted = false;
            cancelAnimationFrame(animationFrameId);
        };
    }, [index, step, findElements]);

    // useEffect to attach correct listeners for current step, dependent on WaitFor
    const stepCleanupRef = useRef<() => void>(null);
    useEffect(() => {
        if (!step) return;

        stepCleanupRef.current?.();

        (async () => {
            const elements = await findElements(step.selector);
            if (!elements) return;

            let cleanupFunctions: (() => void)[] = [];

            elements.forEach(element => {
                const style = getComputedStyle(element);
                element.style.position = style.position === 'static' ? 'relative' : style.position;
                element.style.zIndex = '1002';
                cleanupFunctions.push(() => element.style.removeProperty('z-index'));
            });

            const advance = () => setIndex((i) => {
                const next = i + 1;
                if (next >= steps.length) {
                    localStorage.setItem(id, "true");
                    onFinish?.();
                    return -1; // tutorial ends with all steps done
                }
                return next;
            });

            switch (step.waitFor) {
                case "click": // wait for click on element to advance
                    const onClick = () => advance();
                    elements.forEach((element) => {
                        element.addEventListener('click', onClick);
                        cleanupFunctions.push(() => element.removeEventListener('click', onClick))
                    })
                    break;
                case "input":
                    let typingDebounced: ReturnType<typeof setTimeout> | null = null;
                    const onInput = (e: Event) => {
                        const value = (e.target as HTMLInputElement).value ?? '';

                        if (typingDebounced) clearTimeout(typingDebounced);

                        if (value.trim().length > 0) {
                            typingDebounced = setTimeout(() => {
                                advance();
                            }, 1500);
                        }
                    };
                    const onBlur = (e: Event) => {
                        const value = (e.target as HTMLInputElement).value ?? '';
                        if (value.trim().length > 0) {
                            advance();
                        }
                    };
                    
                    elements.forEach((element) => {
                        element.addEventListener('input', onInput);
                        element.addEventListener('blur', onBlur);

                        cleanupFunctions.push(() => {
                            element.removeEventListener('input', onInput);
                            element.removeEventListener('blur', onBlur);
                        });
                    })
                    break;
                case "focus":
                    const onFocus = () => advance();
                    elements.forEach((element) => {
                        element.addEventListener('focus', onFocus);
                        cleanupFunctions.push(() => element.removeEventListener('focus', onFocus));
                    });
                    break;
                default: // 'none' waitFor
                    const timeout = setTimeout(() => advance(), 5000);
                    cleanupFunctions.push(() => clearTimeout(timeout));
                    break;
            }
            stepCleanupRef.current = () => cleanupFunctions.forEach(fn => fn());
        })();

        return () => stepCleanupRef.current?.();
    }, [index, step, findElements]);

    if (index < 0 || !step) return null;
    
    return (
        <>
            <div className={classes.overlay}/>
            {highlights.map((h, i) => (
                <div
                    key={i}
                    className={classes.highlight}
                    style={{
                        top: h.top,
                        left: h.left,
                        width: h.width,
                        height: h.height,
                    }}
                />
            ))}
        </>
    )
}

export default Tutorial;