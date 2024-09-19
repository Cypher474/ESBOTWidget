import { CloseOutlined, RobotOutlined, SendOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "http://192.168.100.25:8000/";



const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);
  const [initialOpen, setInitialOpen] = useState(false);

  useEffect(() => {
    const handleThread = async () => {
      const cookies =
        "_fbp=fb.1.1726642649954.599701701344689728; _scid=xzuHpDtKuUOHjpY0ax0LedNAQy5LY_cZ; _scid_r=xzuHpDtKuUOHjpY0ax0LedNAQy5LY_cZ; _gcl_au=1.1.797107974.1726642650; _ga=GA1.1.1515263978.1726642650; _ScCbts=%5B%5D; _ym_uid=1726642651375359429; _ym_d=1726642651; _sctr=1%7C1726599600000; _clck=nh73ud%7C2%7Cfpa%7C0%7C1722; _clsk=q74bft%7C1726642653007%7C1%7C1%7Cs.clarity.ms%2Fcollect; _ga_FWT2VFKVVE=GS1.1.1726642650.1.1.1726642865.60.0.0; PHPSESSID=s1o83s6fd66s40bd1gh1spo377; ESDUBAI_STUDENT_ID=OhriXiTILfZhZA4KqQM6mw%3D%3D";

      try {
        const response = await fetch(`${BASE_URL}thread`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookies: cookies, // Set cookies in the headers
          },
          // credentials: 'include', // Ensures cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();

          const { thread_id } = data;

          localStorage.setItem("threadId", thread_id);
        } else {
          throw new Error("Invalid thread");
        }
      } catch (error) {
        console.log({ error });
      }
    };

    // Call handleThread when component mounts
    handleThread();
  }, []); // Empty dependency array ensures this runs once on component mount

  const threadId = localStorage.getItem("threadId");

  // Default prompts
  const defaultPrompts = [
    "What is ES Student?",
    // "What are some use cases of ES Student?",
  ];

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setInitialOpen(!isOpen);
    setMessage("");
  };

  // Function to display a message in the chat
  const displayMessage = (sender, text) => {
    setChatMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  // Function to send a message via the API
  const handleSendMessage = () => {
    if (message.trim()) {
      // Display user message immediately
      displayMessage("user", message);

      // Send user message to API
      sendMessageToAPI(message);

      // Clear the input field
      setMessage("");
    }
  };

  // POST request to send a message to the chat API
  const sendMessageToAPI = (text) => {
    const apiUrl = BASE_URL + `chat`;
    const payload = { question: text, thread_id: threadId };

    setIsTyping(true);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (response.ok) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let partialMessage = "";

          // Process the stream in chunks
          while (!done) {
            setIsTyping(false);
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            // Decode the chunk and append to the partial message
            partialMessage += decoder.decode(value, { stream: true });

            // Update the chat with the partial message in real-time
            setChatMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];

              if (lastMessage && lastMessage.sender === "assistant") {
                lastMessage.text = partialMessage;
              } else {
                updatedMessages.push({
                  sender: "assistant",
                  text: partialMessage,
                });
              }

              return updatedMessages;
            });
          }
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      })
      .catch((error) => {
        alert("Error sending message: " + error.message);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  // Load chat history when the page is loaded
  const loadHistory = () => {
    const historyUrl = BASE_URL + `history?thread_id=${threadId}`;
    setLoading(true);

    fetch(historyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      })
      .then((data) => {
        const history = data.history;
        const newChatMessages = [];

        // Loop through the history and map roles to the appropriate message structure
        history.forEach((entry) => {
          if (entry.role === "user") {
            newChatMessages.push({ sender: "user", text: entry.content });
          } else if (entry.role === "assistant") {
            newChatMessages.push({ sender: "assistant", text: entry.content });
          }
        });

        setChatMessages(newChatMessages); // Set the new chat history once
      })
      .catch((error) => {
        console.error("Error loading history:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Automatically open chat window after 5 seconds
  useEffect(() => {
    if (threadId !== "undefined") {
      const timer = setTimeout(() => {
        setInitialOpen(true);
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [threadId]);

  // Load history when the component mounts
  useEffect(() => {
    if (threadId !== "undefined") {
      loadHistory();
    }
  }, [threadId]);

  // Scroll to bottom when chatMessages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Scroll to bottom when the chat window opens
  useEffect(() => {
    if (isOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isOpen]);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 50,
        right: "1rem",
        bottom: "1rem",
      }}
    >
      {!isOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "3rem",
            gap: "0.5rem",
          }}
        >
          {defaultPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setMessage(prompt);
                setIsOpen(true);
              }}
              style={{
                width: "fit-content",
                padding: "0.5rem",
                fontSize: "0.75rem",
                color: "#ff7900",
                border: "1px solid #ff7900",
                borderRadius: "0.5rem",
                textAlign: "left",
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.target.style.background =
                  "linear-gradient(to right, #f46b45, #eea849)"),
                  (e.target.style.color = "white");
              }}
              onMouseLeave={(e) => {
                (e.target.style.background = "transparent"),
                  (e.target.style.color = "#ff7900");
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "2.5rem",
            height: "2.5rem",
            color: "white",
            backgroundColor: "#ff7900",
            borderRadius: "50%",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            border: "none",
            transition: "transform 0.3s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow = "0 0 15px rgba(255, 121, 0, 0.7)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)")
          }
        >
          <RobotOutlined style={{ fontSize: 20 }} />
        </button>
      )}

      {(isOpen || initialOpen) && (
        <div
          style={{
            position: "relative",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            marginTop: "0.5rem",
            backgroundColor: "#f5e6d8",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "400px",
            height: "500px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "2.5rem",
              padding: "0.5rem",
              background: "linear-gradient(to right, #f46b45, #eea849)",
              color: "white",
              borderRadius: "0.5rem 0.5rem 0 0",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ fontSize: "1rem" }}>ES Student Assistant</h3>
            <CloseOutlined
              onClick={toggleChat}
              style={{ cursor: "pointer", color: "#ffffff" }}
            />
          </div>

          <div
            ref={chatBodyRef}
            style={{
              flex: 1,
              padding: "1rem",
              gap: "0.5rem",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <p
                style={{
                  marginTop: "200px",
                  textAlign: "center",
                  color: "black",
                }}
              >
                Loading chat history...
              </p>
            ) : chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    padding: "0.5rem",
                    margin: "0.5rem 0",
                    fontSize: "0.875rem",
                    borderRadius: "0.5rem",
                    maxWidth: "80%",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(to right, #626262, #434343)"
                        : "linear-gradient(to right, #f46b45, #eea849)",
                    color: "white",
                    marginLeft: msg.sender === "user" ? "auto" : undefined,
                    marginRight: msg.sender !== "user" ? "auto" : undefined,
                    fontWeight: msg.sender === "user" ? "bold" : undefined,
                  }}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <p
                style={{
                  marginTop: "200px",
                  textAlign: "center",
                  color: "black",
                }}
              >
                No messages yet.
              </p>
            )}
            {isTyping && (
              <div
                style={{
                  padding: "0.5rem",
                  margin: "0.5rem 0",
                  fontSize: "0.875rem",
                  color: "#ff7900",
                  backgroundColor: "rgba(255, 121, 0, 0.125)",
                  borderRadius: "0.5rem",
                  maxWidth: "80%",
                  marginRight: "auto",
                }}
              >
                Typing...
              </div>
            )}
          </div>

          <div
            style={{
              position: "relative",
              padding: "0.5rem",
              borderRadius: "0 0 0.5rem 0.5rem",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type a message..."
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ff7900",
                borderRadius: "0.5rem",
                outline: "none",
              }}
              onFocus={(e) =>
                (e.target.style.boxShadow = "0 0 0 2px rgba(255, 121, 0, 0.5)")
              }
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <div
              style={{ position: "absolute", right: "1rem", bottom: "1rem" }}
            >
              <SendOutlined
                style={{
                  color: message?.length > 0 ? "#ff7900" : "#ccc",
                  cursor: message?.length > 0 ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  if (message?.length > 0) handleSendMessage();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;