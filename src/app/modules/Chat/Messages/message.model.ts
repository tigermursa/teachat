import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  message: string;
  createdAt?: Date;
}

// schema
const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// the model
const Message = model<IMessage>("Message", messageSchema);

export default Message;
