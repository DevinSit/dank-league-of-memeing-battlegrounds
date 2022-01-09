import {useSpring} from "react-spring";
import {useScroll} from "react-use-gesture";

/** Hook that uses `react-spring` to enable an animated 'hide on scroll' effect.
 *
 *  The returned value is a `SpringValue`, so it must be passed as a style or interpolated into
 *  one on an `animated` element. */
const useHideOnScroll = ({translateAmount}: {translateAmount: number}) => {
    const [{y}, api] = useSpring(() => ({y: 0}));

    useScroll(
        ({xy: [, y], direction: [_, yDirection]}) => {
            // Need to make sure the scroll position is positive, to account for the stupid 'overflow bounce'
            // that Safari/Chrome do in iOS. This way, users can just slam scroll to the top without having
            // the item hide away.
            if (y > 0) {
                api.start({y: yDirection < 0 ? 0 : translateAmount});
            }
        },
        {
            domTarget: typeof window !== "undefined" ? window : undefined
        }
    );

    return y;
};

export default useHideOnScroll;
