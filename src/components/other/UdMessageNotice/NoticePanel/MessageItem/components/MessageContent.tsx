import React, {useState} from 'react';
import TextItem from "./TextItem";
import LinkItem from "./LinkItem";
import VoiceItem from "./VoiceItem";
import TemplateItem from "./TemplateItem";
import {IUdMessageInfo} from "../../../index";

interface IMessageContentProps {
    message: IUdMessageInfo
}

const MessageContent: React.FC<IMessageContentProps> = (props: IMessageContentProps) => {

    const [message] = useState(props.message);

    return <>
        {message.messageType == "TEXT" && <TextItem message={message}></TextItem>}
        {message.messageType == "LINK" && <LinkItem message={message}></LinkItem>}
        {message.messageType == "VOICE" && <VoiceItem message={message}></VoiceItem>}
        {message.messageType == "TEMPLATE" && <TemplateItem message={message}></TemplateItem>}
    </>;
}

export default MessageContent;
