import React from "react";
import styled from "@emotion/styled";

export default function ModalCard({ children, heading }) {
  return (
    <Card>
      <CardHeader>{heading}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
const Card = styled.div`
  width: 100%;
  /* display: flex;
  flex-direction: column; */
  background: white;
  padding: 14px;
  border-radius: 4px;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
  text-align: center;
`;
const CardHeader = styled.h1``;
const CardContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  align-items: center;
`;
