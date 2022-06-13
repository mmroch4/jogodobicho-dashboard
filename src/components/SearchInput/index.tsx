import type { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.scss";

interface IProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
}

export const SearchInput = ({ search, setSearch, handleSearch }: IProps) => {
  return (
    <label className={`${styles.field} ${styles.field_v1}`}>
      <input
        className={styles.field__input}
        type="search"
        placeholder="ex: Dave Crookman"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={handleSearch}
      />
      <span className={styles.field__icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-search"
          viewBox="0 0 24 24"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
      </span>
      <span className={styles.field__labelWrap}>
        <span className={styles.field__label}>Pesquisar</span>
      </span>
    </label>
  );
};
