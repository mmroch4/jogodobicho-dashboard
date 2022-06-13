import styles from "./styles.module.scss";

interface IProps {
  isLoading: boolean;
}

export const Loading = ({ isLoading }: IProps) => {
  return (
    <div
      className={styles.block}
      style={{
        display: isLoading ? "flex" : "none",
      }}
    >
      <div></div>
    </div>
  );
};
