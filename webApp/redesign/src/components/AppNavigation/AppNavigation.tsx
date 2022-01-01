import classNames from "classnames";
import {ControllerIcon, ListIcon, TrophyIcon, UploadIcon} from "assets/icons";
import styles from "./AppNavigation.module.scss";

const AppNavigation = () => (
    <nav className={styles.AppNavigation}>
        <IconButton active={true} Icon={ControllerIcon} />
        <IconButton Icon={TrophyIcon} />
        <IconButton Icon={UploadIcon} />
        <IconButton Icon={ListIcon} />
    </nav>
);

export default AppNavigation;

/* Other Components */

interface IconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;

    Icon: React.ComponentType<{className: string}>;
}

const IconButton = ({active = false, Icon, ...otherProps}: IconButton) => (
    <button className={styles.IconButton} {...otherProps}>
        <Icon
            className={classNames(styles.AppNavigationIcon, {
                [styles.AppNavigationIcon_active]: active
            })}
        />
    </button>
);
