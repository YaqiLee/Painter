import styled from "styled-components";

interface LineProps {
  weight: number;
  color: string;
}

const Line = styled.div<LineProps>`
  ${(props) => {
    return `
      width: 50%;
      height: ${props.weight}px;
      max-height: 30px;
      background-color: ${props.color};
    `;
  }}
`;

export default Line;
