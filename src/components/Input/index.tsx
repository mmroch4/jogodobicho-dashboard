import { HTMLInputTypeAttribute, ReactNode } from "react";
import styles from "./styles.module.scss";

interface IProps {
  type: HTMLInputTypeAttribute;
  label: string;
  placeholder: string;
  children: ReactNode;
}

export const Input = ({ type, label, placeholder, children }: IProps) => {
  return (
    <label className={`${styles.field} ${styles.field_v1}`}>
      <input
        className={styles.field__input}
        type={type}
        placeholder={`ex: ${placeholder}`}
      />
      <span className={styles.field__icon}>{children}</span>
      <span className={styles.field__labelWrap}>
        <span className={styles.field__label}>{label}</span>
      </span>
    </label>
  );
};
