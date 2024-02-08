export function showNotification(title: string, message: string): void {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      actions: [
        {
          action: "open",
          title: "Open",
        },
      ],
    });
  }
}
