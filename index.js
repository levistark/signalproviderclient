const input = document.getElementById('input')
const messagesElement = document.getElementById('messages')
const messageBox = document.getElementById('message')
let inputValue
let groupId

let payload = {
  username: "Levi",
  userId: null,
  groupId: groupId,
  messageContent: inputValue,
  messageSent: null,
  attachmentUrls: null
}

input.addEventListener('input', (e) => inputValue = e.target.value)

const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5246/chatHub")
    .withAutomaticReconnect()
    .build();  

chatConnection.on("MessageReceived", message => {
  displayMessage(message)
})

chatConnection.on("AddedToGroup", addedGroupId => {
  groupId = addedGroupId
})

async function start() {
  try {
    await chatConnection.start()
    console.log('Connected to SignalR')
    
  } catch (err) {
    console.error("Error connecting to  hub: ", err)
    setTimeout(startConnection, 5000)
  }
}

async function sendMessage() {
  try {
    if (inputValue)
      await chatConnection.invoke("SendMessage", payload)
  } catch (err) {
    console.error("Error sending message: ", err)
  }
}
function displayMessage(message) {
  const messageBlob = document.createElement('li')
  messageBlob.textContent = message
  messagesElement.appendChild(messageBlob)
}

start()