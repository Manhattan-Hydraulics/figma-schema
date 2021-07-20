import { Container } from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";
import { PanelContext } from "src/ui";
import { PanelData } from "../constants";
import styles from "../styles.module.css";
import CategoryTitle from "./CategoryTitle";
import ChevronRightIcon from "./Icons/ChevronRightIcon";

interface ICategoryRow {
  panel: PanelData;
}

export default function CategoryRow({ panel }: ICategoryRow) {
  const { openPanels, setOpenPanels } = useContext(PanelContext);

  return (
    <div className={styles.row}>
      <Container
        onClick={() => {
          setOpenPanels([...openPanels, panel]);
          console.log(openPanels);
        }}>
        <div className={styles.rowContents}>
          <CategoryTitle panel={panel} />
          <ChevronRightIcon />
        </div>
      </Container>
    </div>
  );
}
