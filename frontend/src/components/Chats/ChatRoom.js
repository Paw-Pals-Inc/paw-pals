import React, { useState, useEffect, useRef } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";

const ChatRoom = ({ socket, currentUser, selectedUser, enterProfile }) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  useEffect(() => {
    if (!socket || !currentUser || !selectedUser) {
      return;
    }

    const roomName =
      currentUser.userID < selectedUser.userID
        ? `${currentUser.userID}-${selectedUser.userID}`
        : `${selectedUser.userID}-${currentUser.userID}`;

    // join room
    socket.emit("join", {
      userId: currentUser.userID,
      roomId: roomName,
    });

    // Listen for confirmation my sent message was saved to the db
    socket.on("messageSaved", (data) => {
      console.log("message saved. free to update the UI");
      // Add message to local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: currentUser.userID,
          receiverId: selectedUser.userID,
          message: data.message,
        },
      ]);

      // Clear message input
      setMessageText("");
    });

    // Listen for private messages sent to the current user
    socket.on("message", (data) => {
      console.log(
        "got a new message from ",
        selectedUser.firstName + "  ",
        data.message
      );
      // append message data to chat
      // Add message to local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: selectedUser.userID,
          receiverId: currentUser.userID,
          message: data.message,
        },
      ]);

      // Clear message input
      setMessageText("");

      // scroll down the message container
    });

    return () => {
      // Leave user's own room when component unmounts
      socket.emit("leave", {
        userId: currentUser.userID,
        roomId: roomName,
      });

      // Remove event listener for private messages
      socket.off("message");
      socket.off("messageSaved");
    };
  }, [socket, currentUser, selectedUser]);

  useEffect(() => {
    async function fetchMessages(senderId, receiverId) {
      const jwt = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/chat/${senderId}/${receiverId}`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const messages = await response.json();
      return messages;
    }

    if (selectedUser) {
      const messages = fetchMessages(currentUser.userID, selectedUser.userID);
      messages.then((data) => {
        console.log("fetched messages: ", data);
        setMessages((prev) => data);
      });
    }
  }, [currentUser, selectedUser]);

  const lastMessageRef = useRef(null);
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("messages changed", messages);
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!selectedUser || !messageText) {
      return;
    }

    // Send private message to selected user
    socket.emit("message", {
      senderId: currentUser.userID,
      receiverId: selectedUser.userID,
      message: messageText,
    });
  };

  let typing = false;
  let timeout;
  const timeoutFunction = () => {
    typing = false;
    socket.emit("typing", "");
  };

  const handleTyping = (e) => {
    if (e.keyCode !== 13) {
      if (!typing) {
        typing = true;
        socket.emit("typing", `${currentUser.firstName} is typing...`);
        timeout = setTimeout(timeoutFunction, 3000);
      } else {
        clearTimeout(timeout);
      }
    }
  };

  return (
    <div className="chatRoom">
      {selectedUser ? (
        <div className="chatContainer">
          <div className="selectedUserProfile">
            <h2>{selectedUser.firstName}</h2>
            <MaterialButton
              styleOverrides={{
                backgroundColor: "#ffd29d",
                width: "fit-content",
                height: "fit-content",
              }}
              onClick={() => enterProfile(selectedUser.userID)}
            >
              View Profile
            </MaterialButton>
          </div>
          <div className="messages">
            {messages.length > 0
              ? messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.senderId === currentUser.userID
                        ? "my-msg"
                        : "their-msg"
                    }
                  >
                    <span>{message.message}</span>
                  </div>
                ))
              : ""}
            <div ref={lastMessageRef} />
          </div>
          {/*This is triggered when a user is typing*/}
          <div className="message__status">
            <p>{typingStatus}</p>
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={"Message " + selectedUser.firstName}
              onKeyDown={handleTyping}
            />
            <MaterialButton
              type="submit"
              styleOverrides={{ backgroundColor: "#ffd29d" }}
            >
              Send
            </MaterialButton>
          </form>
        </div>
      ) : (
        <p>Please select a user to chat with</p>
      )}
    </div>
  );
};

export default ChatRoom;
