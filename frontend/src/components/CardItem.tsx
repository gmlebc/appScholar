import React from "react";
import { Card, Text } from "react-native-paper";

export default function CardItem({ title, subtitle }: any) {
  return (
    <Card style={{ marginBottom: 8 }}>
      <Card.Content>
        <Text variant="titleMedium">{title}</Text>
        <Text variant="bodyMedium">{subtitle}</Text>
      </Card.Content>
    </Card>
  );
}
