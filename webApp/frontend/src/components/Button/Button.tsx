import classNames from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Button = ({className, children, ...otherProps}: ButtonProps) => (
    <button className={classNames(styles.Button, className)} {...otherProps}>
        {children}
    </button>
);

export default Button;
