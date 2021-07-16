import "./cell-list.css";
import { Fragment } from "react";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import AddCell from "../add-cell/AddCell";
import CellListItem from "../cell-list-item/CellListItem";

const CellList: React.FC = () => {
	const cells = useTypedSelector(({ cells }) => {
		return cells?.order.map((id: string) => {
			return cells?.data[id];
		});
	});

	const renderedCells = cells?.map((cell) => (
		<Fragment key={cell.id}>
			<CellListItem cell={cell} />
			<AddCell previousCellId={cell.id} />
		</Fragment>
	));

	return (
		<div className="cell-list">
			<AddCell previousCellId={null} forceVisible={cells?.length === 0} />
			{renderedCells}
		</div>
	);
};

export default CellList;
