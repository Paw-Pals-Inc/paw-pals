/*
title - New message from Open Chat
icon - image URL from Flaticon
body - main content of the notification
*/
function sendNotification(message, user) {
  document.onvisibilitychange = () => {
    console.log("visibility change");
    if (document.visibilityState === "hidden") {
      console.log("sending notification to you");
      const notification = new Notification("New message from Paw Pals", {
        icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
        body: `@${user}: ${message}`,
      });
      console.log("sent noti");
      console.log(notification);
      notification.onclick = () =>
        function () {
          window.open("http://localhost:3000/chat");
        };
    }
  };
}

export default function checkPageStatus(message, user) {
  console.log("trying to send noti");
  //   if (user !== localStorage.getItem("userName")) {
  //   if (user !== sessionStorage.getItem("userName")) {
  console.log("okay");
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications!");
  } else if (Notification.permission === "granted") {
    sendNotification(message, user);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        sendNotification(message, user);
      } else {
        alert(message);
      }
    });
  }
  //   } else {
  //     console.log("dang");
  //   }
}
