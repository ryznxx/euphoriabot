interface Reply {
   error: string;
}

interface MessageReply {
   reply: Reply;
}

const message: MessageReply = {
   reply: {
      error: "api",
   },
};

export default message;
