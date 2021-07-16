import "./resizable.css";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { useEffect, useState } from "react";

interface ResizableProps {
	direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
	const [innerHeight, setInnerHeight] = useState(window.innerHeight);
	const [innerWidth, setInnerWidth] = useState(window.innerWidth);
	const [width, setWidth] = useState(window.innerWidth * 0.75);
	let resizableProps: ResizableBoxProps;

	useEffect(() => {
		let timer: any;

		const listener = () => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				setInnerHeight(window.innerHeight);
				setInnerWidth(window.innerWidth);
				if (window.innerWidth * 0.75 < width) {
					setWidth(window.innerWidth * 0.75);
				}
			}, 100);
		};

		// add listener fo proper size for showing editor
		window.addEventListener("resize", listener);

		// remove listener
		return () => {
			window.removeEventListener("resize", listener);
		};
	}, [width]);

	if (direction === "vertical") {
		resizableProps = {
			minConstraints: [Infinity, 24],
			maxConstraints: [Infinity, innerHeight * 0.9],
			height: 300,
			width: Infinity,
			resizeHandles: ["s"],
		};
	} else {
		resizableProps = {
			className: "resize-horizontal",
			minConstraints: [innerWidth * 0.2, Infinity],
			maxConstraints: [innerWidth * 0.75, Infinity],
			resizeHandles: ["e"],
			height: Infinity,
			onResizeStop: (e, data) => {
				setWidth(data.size.width);
			},
			width: width,
		};
	}

	return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
