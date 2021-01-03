import styled from "styled-components";

interface ShapeProps {
  weight: number;
  color: string;
  fill: boolean;
}

const baseShapeTpl = (props: ShapeProps) => `
  width: 20px;
  height: 20px;
  border: ${props.weight}px solid ${props.color};
  display: inline-block;
  vertical-align: text-top;
  background: ${props.fill ? props.color : "transparent"};
`;

const Rect = styled.div<ShapeProps>`
  ${(props) => baseShapeTpl(props)}
`;

const Circle = styled.div<ShapeProps>`
  ${(props) => {
    return `
      ${baseShapeTpl(props)}
      border-radius: 50%;
    `;
  }}}
`;

export { Rect, Circle };
