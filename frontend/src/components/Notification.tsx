import React from "react";
import { Banner } from "react-native-paper";

export default function NotificationBanner({
  visible,
  message,
  onDismiss,
  type = "info",
}: any) {
  const getIcon = () => {
    switch (type) {
      case "success": return "check-circle";
      case "error": return "alert-circle";
      case "warning": return "alert";
      default: return "bell";
    }
  };

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: "Fechar",
          onPress: onDismiss,
        },
      ]}
      icon={getIcon()}
    >
      {message}
    </Banner>
  );
}
