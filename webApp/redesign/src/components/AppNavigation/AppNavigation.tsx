import classNames from "classnames";
import Link from "next/link";
import {useRouter} from "next/router";
import {animated, to as interpolate} from "react-spring";
import {ControllerIcon, ListIcon, TrophyIcon, UploadIcon} from "assets/icons";
import {useHideOnScroll, useGame} from "hooks/";
import {GamePage} from "values/gamePages";
import {ScreenUrls} from "values/screenUrls";
import styles from "./AppNavigation.module.scss";

const AppNavigation = () => {
    const {pathname} = useRouter();
    const translateY = useHideOnScroll({translateAmount: 120});
    const [{dispatch}, actions] = useGame();

    return (
        <animated.nav
            className={styles.AppNavigation}
            style={{
                // Need the translateX since the nav uses the absolute positioned
                // centering trick.
                transform: interpolate([translateY], (y) => `translateX(-50%) translateY(${y}px)`)
            }}
        >
            <IconButton
                href={ScreenUrls.GAME}
                // If the user clicks on this button while in a game,
                // they should be returned to the Rules page.
                onClick={() => dispatch(actions.setPage(GamePage.RULES))}
                active={pathname === ScreenUrls.GAME}
                Icon={ControllerIcon}
            />

            <IconButton
                href={ScreenUrls.LEADERBOARD}
                active={pathname === ScreenUrls.LEADERBOARD}
                Icon={TrophyIcon}
            />

            <IconButton
                href={ScreenUrls.CLASSIFY}
                active={pathname === ScreenUrls.CLASSIFY}
                Icon={UploadIcon}
            />

            <IconButton
                href={ScreenUrls.BROWSE}
                active={pathname === ScreenUrls.BROWSE}
                Icon={ListIcon}
            />
        </animated.nav>
    );
};

export default AppNavigation;

/* Other Components */

interface IconButton extends React.ButtonHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;

    href: string;

    Icon: React.ComponentType<{className: string}>;
}

const IconButton = ({active = false, href, Icon, ...otherProps}: IconButton) => (
    <Link href={href}>
        <a className={styles.IconButton} {...otherProps}>
            <Icon
                className={classNames(styles.AppNavigationIcon, {
                    [styles.AppNavigationIcon_active]: active
                })}
            />
        </a>
    </Link>
);
