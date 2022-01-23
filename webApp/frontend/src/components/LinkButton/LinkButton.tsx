import classNames from "classnames";
import Link from "next/link";
import styles from "./LinkButton.module.scss";

interface LinkButtonProps {
    className?: string;
    href: string;
    children: React.ReactNode;
}

const LinkButton = ({className, href, children}: LinkButtonProps) => (
    <Link href={href}>
        <a className={classNames(styles.LinkButton, className)}>{children}</a>
    </Link>
);

export default LinkButton;
